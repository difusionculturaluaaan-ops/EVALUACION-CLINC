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

    // Crear índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pacientes_tenant ON pacientes(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pruebas_tenant ON pruebas(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_tenant ON usuarios(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');
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

async function actualizarPaciente(id, tenant_id, datos) {
  try {
    const result = await pool.query(
      `UPDATE pacientes SET nombre = $1, edad = $2, sexo = $3, estado_civil = $4,
       medicamentos = $5, observaciones = $6, actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $7 AND tenant_id = $8 RETURNING *`,
      [datos.nombre, datos.edad, datos.sexo, datos.estado_civil, datos.medicamentos, datos.observaciones, id, tenant_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function toggleStatusPaciente(id, tenant_id) {
  try {
    const paciente = await getPacienteByIdTenant(id, tenant_id);
    if (!paciente) return null;

    const nuevoStatus = paciente.status === 'activo' ? 'standby' : 'activo';
    const result = await pool.query(
      'UPDATE pacientes SET status = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [nuevoStatus, id, tenant_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    return null;
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
      [datos.tenant_id, datos.paciente_id, datos.tipo, datos.data, datos.total, datos.subescalas]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al crear prueba:', err);
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
  actualizarPaciente,
  toggleStatusPaciente,
  getPruebas,
  getPruebasByTenant,
  getPruebasByPaciente,
  getPruebaById,
  crearPrueba
};
