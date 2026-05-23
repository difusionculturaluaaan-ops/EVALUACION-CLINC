const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  crearTenant,
  crearUsuario,
  getUsuarioPorEmail,
  actualizarUltimoAcceso,
  getTenantBySlug
} = require('../db/schema');

// Generar slug a partir del nombre
function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-');
}

// Generar JWT token
function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      tenant_id: usuario.tenant_id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
}

// ============================================================
// POST /api/auth/register - Crear nueva clínica + usuario admin
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { nombre_clinica, email, password, nombre_admin } = req.body;

    // Validar campos
    if (!nombre_clinica?.trim()) {
      return res.status(400).json({ error: 'Nombre de clínica requerido' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email requerido' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Contraseña debe tener mínimo 6 caracteres' });
    }
    if (!nombre_admin?.trim()) {
      return res.status(400).json({ error: 'Nombre del admin requerido' });
    }

    // Verificar que el email no exista
    const usuarioExistente = await getUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email ya está registrado' });
    }

    // Crear tenant
    const slug = generarSlug(nombre_clinica);
    const tenant = await crearTenant(nombre_clinica, slug, email);

    if (!tenant) {
      return res.status(400).json({ error: 'No se pudo crear la clínica. El nombre podría ya existir.' });
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario admin
    const usuario = await crearUsuario(
      tenant.id,
      email,
      nombre_admin,
      passwordHash,
      'admin'
    );

    if (!usuario) {
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }

    // Actualizar último acceso
    await actualizarUltimoAcceso(usuario.id);

    // Generar token
    const token = generarToken(usuario);

    console.log(`✓ Nueva clínica registrada: ${nombre_clinica} (ID: ${tenant.id})`);

    res.status(201).json({
      success: true,
      message: 'Clínica y usuario creados exitosamente',
      tenant_id: tenant.id,
      usuario_id: usuario.id,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// POST /api/auth/login - Login con email y contraseña
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email requerido' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Contraseña requerida' });
    }

    // Obtener usuario por email
    const usuario = await getUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar que el usuario esté activo
    if (usuario.estado !== 'activo') {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar último acceso
    await actualizarUltimoAcceso(usuario.id);

    // Generar token
    const token = generarToken(usuario);

    console.log(`✓ Login exitoso: ${email} (Tenant: ${usuario.tenant_id})`);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      tenant_id: usuario.tenant_id,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// POST /api/auth/logout - Logout (solo invalida en frontend)
// ============================================================
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada. Por favor elimina el token del cliente.'
  });
});

// ============================================================
// POST /api/auth/verify - Verificar que el token es válido
// ============================================================
router.post('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      valid: true,
      usuario: payload
    });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
  }
});

module.exports = router;
