const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/clinica_psico'
});

// Inicializar base de datos
async function initDb() {
  try {
    await pool.query('SELECT NOW()'); // Test conexión
    await createTables();
    console.log('✓ Base de datos PostgreSQL conectada');
    return pool;
  } catch (err) {
    console.error('Error al conectar BD:', err);
    throw err;
  }
}

async function createTables() {
  try {
    // Tabla de tenants (clínicas/organizaciones)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        email_contacto TEXT,
        suscripcion_tipo TEXT DEFAULT 'pro',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado TEXT DEFAULT 'activo'
      )
    `);

    // Tabla de usuarios (profesionales/admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        rol TEXT DEFAULT 'profesional',
        estado TEXT DEFAULT 'activo',
        ultimo_acceso TIMESTAMP,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de pacientes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        nombre TEXT NOT NULL,
        edad INTEGER,
        sexo TEXT,
        estado_civil TEXT,
        medicamentos TEXT,
        observaciones TEXT,
        status TEXT DEFAULT 'activo',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de pruebas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pruebas (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
        tipo TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data TEXT NOT NULL,
        total REAL,
        subescalas TEXT
      )
    `);

    // Tabla de normas de población
    await pool.query(`
      CREATE TABLE IF NOT EXISTS normas (
        id SERIAL PRIMARY KEY,
        test_tipo TEXT NOT NULL,
        escala TEXT NOT NULL,
        poblacion TEXT NOT NULL,
        valor_media REAL,
        desviacion_tipica REAL,
        minimo REAL,
        maximo REAL,
        interpretacion TEXT
      )
    `);

    // Agregar columnas de logo a tenants si no existen
    await pool.query(`
      ALTER TABLE tenants
      ADD COLUMN IF NOT EXISTS logo_url TEXT,
      ADD COLUMN IF NOT EXISTS logo_updated_at TIMESTAMP;
    `);

    // Tabla super admin
    await pool.query(`
      CREATE TABLE IF NOT EXISTS super_admin (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla auditoría super admin
    await pool.query(`
      CREATE TABLE IF NOT EXISTS super_admin_audit_log (
        id SERIAL PRIMARY KEY,
        accion TEXT NOT NULL,
        tenant_id INTEGER,
        detalles TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pacientes_tenant ON pacientes(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pruebas_tenant ON pruebas(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_tenant ON usuarios(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_normas_test ON normas(test_tipo, escala)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_super_admin_email ON super_admin(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_audit_log_tenant ON super_admin_audit_log(tenant_id)');
  } catch (err) {
    console.error('Error al crear tablas:', err);
    throw err;
  }
}

// ==================== FUNCIONES TENANT ====================

async function crearTenant(nombre, slug, email_contacto = null) {
  try {
    const result = await pool.query(
      'INSERT INTO tenants (nombre, slug, email_contacto) VALUES ($1, $2, $3) RETURNING *',
      [nombre, slug, email_contacto]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear tenant:', err);
    return null;
  }
}

async function getTenantById(id) {
  try {
    const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getTenantBySlug(slug) {
  try {
    const result = await pool.query('SELECT * FROM tenants WHERE slug = $1', [slug]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ==================== FUNCIONES USUARIO ====================

async function crearUsuario(tenant_id, email, nombre, password_hash, rol = 'profesional') {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (tenant_id, email, nombre, password_hash, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenant_id, email, nombre, password_hash, rol]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return null;
  }
}

async function getUsuarioById(id) {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getUsuarioPorEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function actualizarUltimoAcceso(usuario_id) {
  try {
    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
      [usuario_id]
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ==================== FUNCIONES PACIENTES ====================

async function getPacientes() {
  try {
    const result = await pool.query('SELECT * FROM pacientes ORDER BY creado_en DESC');
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPacientesByTenant(tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE tenant_id = $1 ORDER BY creado_en DESC',
      [tenant_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPacienteById(id) {
  try {
    const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getPacienteByIdTenant(id, tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE id = $1 AND tenant_id = $2',
      [id, tenant_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function buscarPacientes(query) {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE nombre ILIKE $1 OR observaciones ILIKE $1 ORDER BY creado_en DESC',
      [`%${query}%`]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function buscarPacientesPorTenant(tenant_id, query) {
  try {
    const result = await pool.query(
      'SELECT * FROM pacientes WHERE tenant_id = $1 AND (nombre ILIKE $2 OR observaciones ILIKE $2) ORDER BY creado_en DESC',
      [tenant_id, `%${query}%`]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function crearPaciente(datos) {
  try {
    const result = await pool.query(
      `INSERT INTO pacientes (tenant_id, nombre, edad, sexo, estado_civil, medicamentos, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [datos.tenant_id, datos.nombre, datos.edad, datos.sexo, datos.estado_civil, datos.medicamentos, datos.observaciones]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear paciente:', err);
    return null;
  }
}

async function crearPacienteTenant(tenant_id, datos) {
  return crearPaciente({ tenant_id, ...datos });
}

async function actualizarPaciente(id, datos) {
  try {
    const result = await pool.query(
      `UPDATE pacientes SET nombre = $1, edad = $2, sexo = $3, estado_civil = $4,
       medicamentos = $5, observaciones = $6, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [datos.nombre, datos.edad, datos.sexo, datos.estado_civil, datos.medicamentos, datos.observaciones, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function toggleStatusPaciente(id) {
  try {
    const paciente = await getPacienteById(id);
    if (!paciente) return null;

    const nuevoStatus = paciente.status === 'activo' ? 'standby' : 'activo';
    const result = await pool.query(
      'UPDATE pacientes SET status = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [nuevoStatus, id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deletePaciente(id) {
  try {
    // Las pruebas se eliminarán automáticamente por ON DELETE CASCADE
    const result = await pool.query(
      'DELETE FROM pacientes WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ==================== FUNCIONES PRUEBAS ====================

async function getPruebas() {
  try {
    const result = await pool.query('SELECT * FROM pruebas ORDER BY fecha DESC');
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPruebasByTenant(tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM pruebas WHERE tenant_id = $1 ORDER BY fecha DESC',
      [tenant_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPruebasByPaciente(paciente_id, tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM pruebas WHERE paciente_id = $1 AND tenant_id = $2 ORDER BY fecha DESC',
      [paciente_id, tenant_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPruebaById(id) {
  try {
    const result = await pool.query('SELECT * FROM pruebas WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function crearPrueba(datos) {
  try {
    const result = await pool.query(
      `INSERT INTO pruebas (tenant_id, paciente_id, tipo, data, total, subescalas)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [datos.tenant_id, datos.paciente_id, datos.tipo, JSON.stringify(datos.data), datos.total, JSON.stringify(datos.subescalas)]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear prueba:', err);
    return null;
  }
}

async function guardarPrueba(paciente_id, tipo, data, total, subescalas) {
  try {
    // Obtener tenant_id del paciente
    const paciente = await getPacienteById(paciente_id);
    if (!paciente) return null;

    return crearPrueba({
      tenant_id: paciente.tenant_id,
      paciente_id,
      tipo,
      data,
      total,
      subescalas
    });
  } catch (err) {
    console.error('Error al guardar prueba:', err);
    return null;
  }
}

async function obtenerPruebasRango(paciente_id, tipo) {
  try {
    const result = await pool.query(
      'SELECT * FROM pruebas WHERE paciente_id = $1 AND tipo = $2 ORDER BY fecha DESC',
      [paciente_id, tipo]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ==================== FUNCIONES NORMAS ====================

async function getNormasByTest(test_tipo, escala = null) {
  try {
    let query = 'SELECT * FROM normas WHERE test_tipo = $1';
    let params = [test_tipo];

    if (escala) {
      query += ' AND escala = $2';
      params.push(escala);
    }

    const result = await pool.query(query, params);
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getNormasPoblacionGeneral(test_tipo) {
  try {
    const result = await pool.query(
      'SELECT * FROM normas WHERE test_tipo = $1 AND poblacion = $2 ORDER BY escala',
      [test_tipo, 'población normal']
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function insertarNormas(datos) {
  try {
    const result = await pool.query(
      `INSERT INTO normas (test_tipo, escala, poblacion, valor_media, desviacion_tipica, minimo, maximo, interpretacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [datos.test_tipo, datos.escala, datos.poblacion, datos.valor_media, datos.desviacion_tipica, datos.minimo, datos.maximo, datos.interpretacion]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al insertar norma:', err);
    return null;
  }
}

// ==================== FUNCIONES SUPER ADMIN ====================

async function getSuperAdminByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM super_admin WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function crearSuperAdmin(email, nombre, password_hash) {
  try {
    const result = await pool.query(
      'INSERT INTO super_admin (email, nombre, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [email, nombre, password_hash]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear super admin:', err);
    return null;
  }
}

async function registrarAuditLog(accion, tenant_id = null, detalles = null) {
  try {
    await pool.query(
      'INSERT INTO super_admin_audit_log (accion, tenant_id, detalles) VALUES ($1, $2, $3)',
      [accion, tenant_id, detalles ? JSON.stringify(detalles) : null]
    );
    return true;
  } catch (err) {
    console.error('Error al registrar audit log:', err);
    return false;
  }
}

async function getAuditLog(limit = 100) {
  try {
    const result = await pool.query(
      'SELECT * FROM super_admin_audit_log ORDER BY timestamp DESC LIMIT $1',
      [limit]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getAllTenants() {
  try {
    const result = await pool.query('SELECT * FROM tenants ORDER BY fecha_creacion DESC');
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function actualizarTenant(tenant_id, datos) {
  try {
    let query = 'UPDATE tenants SET ';
    const params = [];
    let paramCount = 1;

    if (datos.nombre) {
      query += `nombre = $${paramCount++}, `;
      params.push(datos.nombre);
    }
    if (datos.estado) {
      query += `estado = $${paramCount++}, `;
      params.push(datos.estado);
    }

    query += `actualizado_en = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    params.push(tenant_id);

    const result = await pool.query(query, params);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteTenant(tenant_id) {
  try {
    await pool.query('DELETE FROM tenants WHERE id = $1', [tenant_id]);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function actualizarTenantLogo(tenant_id, logo_url) {
  try {
    const result = await pool.query(
      'UPDATE tenants SET logo_url = $1, logo_updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [logo_url, tenant_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  initDb,
  pool,
  crearTenant,
  getTenantById,
  getTenantBySlug,
  crearUsuario,
  getUsuarioById,
  getUsuarioPorEmail,
  actualizarUltimoAcceso,
  getPacientes,
  getPacientesByTenant,
  getPacienteById,
  getPacienteByIdTenant,
  buscarPacientes,
  buscarPacientesPorTenant,
  crearPaciente,
  crearPacienteTenant,
  actualizarPaciente,
  toggleStatusPaciente,
  deletePaciente,
  getPruebas,
  getPruebasByTenant,
  getPruebasByPaciente,
  obtenerPruebasPaciente: getPruebasByPaciente,
  getPruebaById,
  obtenerPruebaById: getPruebaById,
  crearPrueba,
  guardarPrueba,
  obtenerPruebasRango,
  getNormasByTest,
  getNormasPoblacionGeneral,
  insertarNormas,
  getSuperAdminByEmail,
  crearSuperAdmin,
  registrarAuditLog,
  getAuditLog,
  getAllTenants,
  actualizarTenant,
  deleteTenant,
  actualizarTenantLogo
};
