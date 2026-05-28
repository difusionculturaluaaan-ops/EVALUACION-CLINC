const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  getSuperAdminByEmail,
  crearSuperAdmin,
  registrarAuditLog,
  getAuditLog,
  getAllTenants,
  getTenantById,
  crearTenant,
  crearUsuario,
  actualizarTenant,
  deleteTenant,
  actualizarTenantLogo,
  inicializarMapeoSCID2,
  inicializarTestsParaUsuario,
  pool
} = require('../db/schema');
const autenticarSuperAdmin = require('../middleware/super-admin-auth');
const { upload, uploadLogo } = require('../middleware/cloudinary');

const router = express.Router();

// POST /api/super-admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const superAdmin = await getSuperAdminByEmail(email);

    if (!superAdmin || !await bcrypt.compare(password, superAdmin.password_hash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: superAdmin.id, email: superAdmin.email },
      process.env.JWT_SECRET_SUPER || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    registrarAuditLog('login', null, { email });

    res.json({ token, nombre: superAdmin.nombre, email: superAdmin.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/super-admin/dashboard
router.get('/dashboard', autenticarSuperAdmin, async (req, res) => {
  try {
    // Contar tenants
    const tenantsResult = await pool.query(`
      SELECT
        COUNT(*) as total_tenants,
        COUNT(CASE WHEN estado = 'activo' THEN 1 END) as tenants_activos
      FROM tenants
    `);

    const { total_tenants, tenants_activos } = tenantsResult.rows[0] || {};

    // Contar usuarios (profesionales)
    const usuariosResult = await pool.query(`
      SELECT COUNT(*) as total_usuarios
      FROM usuarios
    `);

    const total_usuarios = usuariosResult.rows[0]?.total_usuarios || 0;

    // Contar pacientes
    const pacientesResult = await pool.query(`
      SELECT COUNT(*) as total_pacientes
      FROM pacientes
    `);

    const total_pacientes = pacientesResult.rows[0]?.total_pacientes || 0;

    registrarAuditLog('ver_dashboard');

    res.json({
      total_tenants: parseInt(total_tenants) || 0,
      tenants_activos: parseInt(tenants_activos) || 0,
      total_psicologos: parseInt(total_usuarios) || 0,
      total_pacientes: parseInt(total_pacientes) || 0,
      crecimiento_ultimo_mes: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/super-admin/tenants
router.get('/tenants', autenticarSuperAdmin, async (req, res) => {
  try {
    const tenants = await getAllTenants();

    // Enriquecer con datos de usuarios y pacientes por tenant
    const tenantsConDatos = await Promise.all(tenants.map(async (tenant) => {
      const usuariosResult = await pool.query(
        'SELECT COUNT(*) as count FROM usuarios WHERE tenant_id = $1',
        [tenant.id]
      );
      const pacientesResult = await pool.query(
        'SELECT COUNT(*) as count FROM pacientes WHERE tenant_id = $1',
        [tenant.id]
      );

      return {
        ...tenant,
        psicologos: parseInt(usuariosResult.rows[0]?.count || 0),
        pacientes: parseInt(pacientesResult.rows[0]?.count || 0)
      };
    }));

    res.json(tenantsConDatos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/super-admin/tenants/:id
router.get('/tenants/:id', autenticarSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await getTenantById(parseInt(id));

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    const usuariosResult = await pool.query(
      'SELECT COUNT(*) as count FROM usuarios WHERE tenant_id = $1',
      [tenant.id]
    );
    const pacientesResult = await pool.query(
      'SELECT COUNT(*) as count FROM pacientes WHERE tenant_id = $1',
      [tenant.id]
    );

    res.json({
      ...tenant,
      psicologos: parseInt(usuariosResult.rows[0]?.count || 0),
      pacientes: parseInt(pacientesResult.rows[0]?.count || 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/super-admin/tenants
router.post('/tenants', autenticarSuperAdmin, async (req, res) => {
  try {
    const { nombre, slug, email_contacto, admin_nombre, admin_email, admin_password } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ error: 'Nombre y slug son requeridos' });
    }

    if (!admin_nombre || !admin_email || !admin_password) {
      return res.status(400).json({ error: 'Datos del admin requeridos' });
    }

    if (admin_password.length < 6) {
      return res.status(400).json({ error: 'Contraseña debe tener mínimo 6 caracteres' });
    }

    // Crear tenant
    const tenant = await crearTenant(nombre, slug, email_contacto);

    if (!tenant) {
      return res.status(400).json({ error: 'No se pudo crear el tenant' });
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(admin_password, salt);

    // Crear usuario admin para el nuevo tenant
    const admin = await crearUsuario(
      tenant.id,
      admin_email,
      admin_nombre,
      passwordHash,
      'admin'
    );

    if (!admin) {
      // Rollback: eliminar tenant si no se pudo crear el usuario
      await deleteTenant(tenant.id);
      return res.status(500).json({ error: 'Error al crear usuario admin' });
    }

    // Inicializar tests para el nuevo admin
    await inicializarTestsParaUsuario(admin.id);

    // Inicializar estructura SCID-II automáticamente para el nuevo tenant
    await inicializarMapeoSCID2(tenant.id, null);

    registrarAuditLog('crear_tenant', tenant.id, {
      nombre,
      slug,
      admin_email,
      admin_id: admin.id
    });

    res.status(201).json({
      tenant,
      admin: {
        id: admin.id,
        email: admin.email,
        nombre: admin.nombre
      }
    });
  } catch (error) {
    console.error('Error en POST /tenants:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El nombre, slug o email del admin ya existe' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/super-admin/tenants/:id
router.patch('/tenants/:id', autenticarSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const tenant = await actualizarTenant(parseInt(id), { nombre, estado });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    registrarAuditLog('editar_tenant', parseInt(id), { nombre, estado });

    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/super-admin/tenants/:id/logo - Subir logo
router.post('/tenants/:id/logo', autenticarSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { logo_base64 } = req.body;

    if (!logo_base64) {
      return res.status(400).json({ error: 'Logo requerido' });
    }

    // Validar que sea base64 válido y una imagen
    if (!logo_base64.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Solo se aceptan imágenes (PNG, JPG, etc.)' });
    }

    // Limitar tamaño: máximo 2MB
    if (logo_base64.length > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Imagen demasiado grande (máximo 2MB)' });
    }

    // Actualizar logo en BD
    const result = await pool.query(
      `UPDATE tenants SET logo_url = $1, logo_updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [logo_base64, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    registrarAuditLog('actualizar_logo_tenant', parseInt(id));

    res.json({
      success: true,
      tenant: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/super-admin/tenants/:id
router.delete('/tenants/:id', autenticarSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const success = await deleteTenant(parseInt(id));

    if (!success) {
      return res.status(400).json({ error: 'No se pudo eliminar el tenant' });
    }

    registrarAuditLog('eliminar_tenant', parseInt(id));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/super-admin/audit-log
router.get('/audit-log', autenticarSuperAdmin, async (req, res) => {
  try {
    const logs = await getAuditLog(100);

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/super-admin/tenants/:id/logo
router.post('/tenants/:id/logo', autenticarSuperAdmin, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió archivo' });
    }

    // Subir a Cloudinary
    const logoUrl = await uploadLogo(req.file.buffer, id);

    // Guardar en BD
    const result = await actualizarTenantLogo(parseInt(id), logoUrl);

    if (!result) {
      return res.status(404).json({ error: 'Tenant no encontrado' });
    }

    // Auditar
    registrarAuditLog('actualizar_logo_tenant', parseInt(id), { logo_url: logoUrl });

    res.json({ success: true, logo_url: logoUrl, tenant: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
