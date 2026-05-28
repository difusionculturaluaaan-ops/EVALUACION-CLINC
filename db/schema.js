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
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data TEXT NOT NULL,
        total REAL,
        subescalas TEXT,
        estado TEXT DEFAULT 'borrador'
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

    // Agregar columnas de estado y actualizado_en a pruebas si no existen
    await pool.query(`
      ALTER TABLE pruebas
      ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'borrador',
      ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
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

    // Tabla de escalas SCID-II (A-L con estructura oficial)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scid2_escala (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        escala CHAR(1) NOT NULL,
        numero_pregunta_inicio INTEGER NOT NULL,
        numero_pregunta_fin INTEGER NOT NULL,
        trastorno TEXT NOT NULL,
        cutoff_minimo INTEGER NOT NULL,
        UNIQUE(tenant_id, escala)
      )
    `);

    // Tabla de mapeo SCID-II (pregunta a escala)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scid2_pregunta_mapeo (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        numero_pregunta INTEGER NOT NULL,
        pregunta_texto TEXT NOT NULL,
        escala CHAR(1) NOT NULL,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tenant_id, numero_pregunta)
      )
    `);

    // Tabla de tests habilitados por usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario_tests (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        test_tipo TEXT NOT NULL,
        habilitado BOOLEAN DEFAULT true,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, test_tipo)
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
    await pool.query('CREATE INDEX IF NOT EXISTS idx_scid2_escala_tenant ON scid2_escala(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_scid2_mapeo_tenant ON scid2_pregunta_mapeo(tenant_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_usuario_tests_usuario ON usuario_tests(usuario_id)');
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
    throw err;
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
      `INSERT INTO pruebas (tenant_id, paciente_id, tipo, data, total, subescalas, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [datos.tenant_id, datos.paciente_id, datos.tipo, JSON.stringify(datos.data), datos.total, JSON.stringify(datos.subescalas), 'borrador']
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

// ==================== FUNCIONES SCID-II - ESTRUCTURA OFICIAL ====================

async function obtenerEscalasSCID2(tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM scid2_escala WHERE tenant_id = $1 ORDER BY escala',
      [tenant_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function obtenerMapeoSCID2(tenant_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM scid2_pregunta_mapeo WHERE tenant_id = $1 ORDER BY numero_pregunta',
      [tenant_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function inicializarMapeoSCID2(tenant_id, usuario_id) {
  try {
    // Estructura oficial de escalas A-L según la psicóloga
    const escalas = [
      { escala: 'A', inicio: 1, fin: 7, trastorno: 'Trastorno de la personalidad por evitación', cutoff: 4 },
      { escala: 'B', inicio: 8, fin: 15, trastorno: 'Trastorno de la personalidad por dependencia', cutoff: 5 },
      { escala: 'C', inicio: 16, fin: 26, trastorno: 'Trastorno obsesivo-compulsivo', cutoff: 5 },
      { escala: 'D', inicio: 27, fin: 35, trastorno: 'Pasivo-agresivo', cutoff: 5 },
      { escala: 'E', inicio: 36, fin: 48, trastorno: 'Autodestructivo', cutoff: 5 },
      { escala: 'F', inicio: 49, fin: 56, trastorno: 'Trastorno paranoide de la personalidad', cutoff: 4 },
      { escala: 'G', inicio: 57, fin: 64, trastorno: 'Trastorno esquizotípico de la personalidad', cutoff: 5 },
      { escala: 'H', inicio: 65, fin: 69, trastorno: 'Trastorno esquizoide de la personalidad', cutoff: 4 },
      { escala: 'I', inicio: 70, fin: 79, trastorno: 'Trastorno histriónico de la personalidad', cutoff: 4 },
      { escala: 'J', inicio: 80, fin: 90, trastorno: 'Trastorno narcisista de la personalidad', cutoff: 6 },
      { escala: 'K', inicio: 91, fin: 108, trastorno: 'Trastorno límite de la personalidad', cutoff: 5 },
      { escala: 'L', inicio: 109, fin: 120, trastorno: 'Trastorno antisocial de la personalidad', cutoff: 3 }
    ];

    // Insertar escalas
    for (const escala of escalas) {
      await pool.query(
        `INSERT INTO scid2_escala (tenant_id, escala, numero_pregunta_inicio, numero_pregunta_fin, trastorno, cutoff_minimo)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (tenant_id, escala) DO NOTHING`,
        [tenant_id, escala.escala, escala.inicio, escala.fin, escala.trastorno, escala.cutoff]
      );
    }

    // Preguntas SCID-II (119 total)
    const preguntas = [
      '¿Ha evitado trabajos o tareas que implicaban tener que tratar con mucha gente?',
      '¿Evita entablar relación con otras personas a menos que esté seguro de que les va a caer bien?',
      '¿Le resulta difícil ser "abierto" incluso con las personas con las que se mantiene una relación cercana?',
      '¿Le preocupa con frecuencia ser criticado o rechazado en situaciones sociales?',
      '¿Permanece generalmente callado cuando conoce gente nueva?',
      '¿Cree usted que no es tan bueno, tan listo o tan atractivo como la mayoría de las personas?',
      '¿Le da miedo intentar cosas nuevas?',
      '¿Necesita usted dejarse aconsejar y desangustiar mucho por parte de otras personas antes de poder tomar decisiones cotidianas?',
      '¿Depende usted de otras personas para controlar áreas importantes de su vida?',
      '¿Le resulta difícil mostrarse en desacuerdo con otras personas incluso cuando considera que están equivocadas?',
      '¿Le cuesta empezar o realizar tareas cuando no hay nadie que le ayude?',
      '¿Se ha ofrecido con frecuencia voluntario para realizar tareas desagradables?',
      '¿Se siente usted generalmente incómodo cuando está solo?',
      'Cuando finaliza una relación de pareja, ¿siente usted que tiene que encontrar inmediatamente a otra persona que le cuide?',
      '¿Le preocupa mucho que le abandonen y que tenga que cuidar de sí mismo?',
      '¿Es usted la clase de persona que se fija en los detalles, el orden y la organización?',
      '¿Tiene problemas a la hora de finalizar tareas debido a que emplea demasiado tiempo tratando de hacer las cosas de forma perfecta?',
      '¿Le parece a usted que está tan dedicado a su trabajo que no le queda tiempo para nadie más?',
      '¿Tiene usted unos valores muy estrictos sobre lo que está bien y lo que está mal?',
      '¿Le cuesta a usted mucho tirar las cosas porque algún día podrían serle útiles?',
      '¿Le cuesta dejar que otras personas le ayuden a menos que hagan las cosas exactamente como usted quiere?',
      '¿Le cuesta a usted mucho gastar dinero en usted mismo o en otros?',
      '¿Está a menudo tan seguro de tener razón que no le importa lo que digan los demás?',
      '¿Le han comentado otras personas que usted es terco o rígido?',
      'Cuando alguien le pide que haga algo que usted no quiere hacer, ¿dice que sí pero luego lo hace despacio o mal?',
      'Cuando no quiere hacer algo, ¿suele simplemente "olvidarse" de hacerlo?',
      '¿Siente con frecuencia que los demás no le comprenden o que no aprecian lo mucho que usted hace?',
      '¿Está usted a menudo de mal humor o tiende a discutir?',
      '¿Le parece a usted que la mayoría de sus jefes, profesores, supervisores, médicos o personas supuestamente expertas realmente no lo son?',
      '¿Piensa a menudo que no es justo que otras personas tengan más que usted?',
      '¿Se queja usted a menudo de haber tenido más mala suerte de lo normal?',
      '¿Rehúsa a menudo con enfado hacer lo que quieren los demás, luego se siente mal y se disculpa?',
      '¿Se siente habitualmente infeliz, o como si la vida no fuese agradable?',
      '¿Cree usted ser una persona básicamente incapaz y con frecuencia no se siente bien consigo mismo?',
      '¿Se descalifica a sí mismo con frecuencia?',
      '¿Piensa mucho en cosas malas que han sucedido en el pasado o se preocupa por las que podrían suceder en el futuro?',
      '¿Juzga a menudo a los demás con dureza y les encuentra defectos con facilidad?',
      '¿Cree usted que la mayoría de las personas no son buenas?',
      '¿Espera usted casi siempre que las cosas vayan mal?',
      '¿Se siente usted a menudo culpable de cosas que ha hecho o dejado de hacer?',
      '¿Tiene a menudo que estar alerta para evitar que los demás abusen de usted?',
      '¿Pasa usted mucho tiempo preguntándose si puede fiarse de sus amigos o compañeros de trabajo?',
      '¿Cree usted que es mejor no dejar que otras personas sepan mucho sobre usted?',
      '¿Detecta usted a menudo amenazas o insultos ocultos en lo que la gente dice o hace?',
      '¿Es usted la clase de persona que guarda rencor o tarda mucho tiempo en perdonar?',
      '¿Hay muchas personas a las que no puede perdonar por algo que le hicieron?',
      '¿Con que frecuencia se enfada o se pone furioso cuando alguien le critica?',
      '¿Ha sospechado a menudo que su pareja le es o era infiel?',
      'Cuando está en público y ve personas hablando, ¿a menudo le parece que están hablando de usted?',
      '¿Tiene con frecuencia la impresión de que cosas sin significado especial contienen un mensaje especial para usted?',
      'Cuando está entre la gente, ¿tiene a menudo la sensación de que lo están observando?',
      '¿Ha sentido alguna vez que podría hacer que sucedieran cosas simplemente formulando un deseo?',
      '¿Ha tenido experiencias personales de tipo sobrenatural?',
      '¿Cree tener un "sexto sentido" que le permite conocer y predecir cosas?',
      '¿Le ha parecido a menudo como si los objetos o las sombras fueran realmente personas o animales?',
      '¿Ha tenido la sensación de que alguna persona o fuerza se hallaba alrededor de usted?',
      '¿Ve con frecuencia auras o campos de energía alrededor de las personas?',
      '¿Hay muy pocas personas a las que se sienta próximo aparte de su familia inmediata?',
      '¿Se siente con frecuencia nervioso cuando está con otras personas?',
      '¿Es poco importante para usted si tiene o no relaciones personales?',
      '¿Prefiere usted casi siempre hacer las cosas solo?',
      '¿Podría estar satisfecho sin tener jamás ninguna relación sexual?',
      '¿Hay realmente muy pocas cosas que le proporcionen placer?',
      '¿Le es totalmente indiferente lo que otras personas piensen de usted?',
      '¿Cree que no hay nada que ponga ni muy contento ni muy triste?',
      '¿Le gusta ser el centro de atención?',
      '¿Coquetea mucho?',
      '¿Se da cuenta a menudo de que se está comportando de forma seductora con otras personas?',
      '¿Trata de llamar la atención a través de su forma de vestir o su aspecto físico?',
      '¿Se muestra muy a menudo como una persona dramática y pintoresca?',
      '¿Cambia a menudo de opinión según las personas con las que esté?',
      '¿Tiene usted muchos amigos a los que se siente muy próximo?',
      '¿Considera que a menudo los demás no saben apreciar su talento o sus cualidades?',
      '¿Le han comentado otras personas que tiene una opinión demasiado elevada de sí mismo?',
      '¿Piensa mucho en que algún día alcanzará el poder, la fama o el reconocimiento?',
      '¿Pasa usted mucho tiempo pensado en que algún día disfrutará de un romance perfecto?',
      'Cuando tiene un problema, ¿insiste casi siempre en ver al máximo responsable?',
      '¿Considera usted que es importante dedicar el tiempo a personas especiales o influyentes?',
      '¿Es muy importante para usted que la gente le preste atención o le admire?',
      '¿Cree usted que no es necesario respetar ciertas reglas o convenciones sociales?',
      '¿Considera usted que es la clase de persona que merece un trato especial?',
      '¿A menudo le resulta necesario aprovecharse de otros para conseguir lo que quiere?',
      '¿Tiene con frecuencia que anteponer sus necesidades a las de otras personas?',
      '¿Espera a menudo que otras personas hagan lo que les pide sin vacilar?',
      '¿A usted realmente no le interesan los problemas y sentimientos de los demás?',
      '¿Se han quejado algunas personas de que usted no le escucha?',
      '¿Tiene a menudo envidia de otras personas?',
      '¿Cree usted que los demás a menudo le envidian?',
      '¿Le parece que hay pocas personas que merezcan que usted les dedique su tiempo?',
      '¿Se ha puesto furioso con frecuencia cuando ha creído que alguien iba a abandonarlo?',
      'Las relaciones con las personas que verdaderamente quiere, ¿tienen muchos altibajos extremos?',
      '¿Cambia a veces de repente su sentido de quién es usted?',
      '¿Cambia a menudo dramáticamente su sentido de quién es?',
      '¿Es usted diferente con diferentes personas, de tal manera que a veces no sabe quién es usted en realidad?',
      '¿Se han producido muchos cambios bruscos en sus metas, planes profesionales?',
      '¿Ha hecho a menudo cosas impulsivas?',
      '¿Ha tratado de hacerse daño o matarse, o amenazado con hacerlo?',
      '¿Alguna vez se ha cortado, quemado o herido a sí mismo a propósito?',
      '¿Experimenta usted muchos cambios repentinos de estado de ánimo?',
      '¿Se siente con frecuencia vacío por dentro?',
      '¿Tiene usted a menudo arranques de cólera o se enfurece tanto que pierde el control?',
      'Cuando se enfada, ¿golpea usted a las personas o arroja objetos?',
      '¿Se pone muy furioso incluso por cosas sin importancia?',
      'Cuando se halla bajo gran tensión, ¿se vuelve suspicaz con otras personas?',
      'Antes de los 15 años, ¿intimidaba o amenazaba a otros niños?',
      'Antes de los 15 años, ¿provocaba usted peleas?',
      'Antes de los 15 años, ¿hirió o amenazó a alguien con un arma?',
      'Antes de los 15 años, ¿torturó deliberadamente a alguien?',
      'Antes de los 15 años, ¿torturó o hirió animales a propósito?',
      'Antes de los 15 años, ¿robó, atracó o arrebató por la fuerza algo?',
      'Antes de los 15 años, ¿forzó a alguien a tener relaciones sexuales?',
      'Antes de los 15 años, ¿provocó algún incendio?',
      'Antes de los 15 años, ¿destruyó deliberadamente cosas que no eran suyas?',
      'Antes de los 15 años, ¿irrumpió en casas, otros edificios o coches?',
      'Antes de los 15 años, ¿mentía mucho o estafaba a otras personas?',
      'Antes de los 15 años, ¿robaba cosas o falsificaba la firma de otras personas?',
      'Antes de los 15 años, ¿se escapó de casa y pasó la noche fuera?',
      'Antes de los 13 años, ¿permanecía mucho tiempo fuera de casa?',
      'Antes de los 13 años, ¿faltaba a menudo a clase?'
    ];

    // Insertar preguntas mapeadas a escalas
    const mapeoPreguntas = {
      'A': [1, 2, 3, 4, 5, 6, 7],
      'B': [8, 9, 10, 11, 12, 13, 14, 15],
      'C': [16, 17, 18, 19, 20, 21, 22],
      'D': [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
      'E': [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
      'F': [49, 50, 51, 52, 53, 54, 55, 56],
      'G': [57, 58, 59, 60, 61, 62, 63, 64],
      'H': [65, 66, 67, 68, 69],
      'I': [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
      'J': [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
      'K': [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108],
      'L': [109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]
    };

    for (const [escala, numeros] of Object.entries(mapeoPreguntas)) {
      for (const num of numeros) {
        if (num <= preguntas.length) {
          await pool.query(
            `INSERT INTO scid2_pregunta_mapeo (tenant_id, numero_pregunta, pregunta_texto, escala)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (tenant_id, numero_pregunta) DO NOTHING`,
            [tenant_id, num, preguntas[num - 1], escala]
          );
        }
      }
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ==================== FUNCIONES USUARIO_TESTS ====================

async function obtenerTestsHabilitados(usuario_id) {
  try {
    const result = await pool.query(
      'SELECT test_tipo, habilitado FROM usuario_tests WHERE usuario_id = $1 ORDER BY test_tipo',
      [usuario_id]
    );
    return result.rows || [];
  } catch (err) {
    console.error('Error al obtener tests habilitados:', err);
    return [];
  }
}

async function habilitarTest(usuario_id, test_tipo) {
  try {
    const result = await pool.query(
      `INSERT INTO usuario_tests (usuario_id, test_tipo, habilitado)
       VALUES ($1, $2, true)
       ON CONFLICT (usuario_id, test_tipo)
       DO UPDATE SET habilitado = true
       RETURNING *`,
      [usuario_id, test_tipo]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al habilitar test:', err);
    throw err;
  }
}

async function deshabilitarTest(usuario_id, test_tipo) {
  try {
    const result = await pool.query(
      `UPDATE usuario_tests SET habilitado = false
       WHERE usuario_id = $1 AND test_tipo = $2
       RETURNING *`,
      [usuario_id, test_tipo]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error al deshabilitar test:', err);
    throw err;
  }
}

async function inicializarTestsParaUsuario(usuario_id) {
  try {
    const tests = ['scl90r', 'hamilton', 'mmpi2', 'isra-c', 'isra-f', 'isra-m', 'tds', 'pclr', 'egep5', 'scid2'];

    for (const test of tests) {
      await pool.query(
        `INSERT INTO usuario_tests (usuario_id, test_tipo, habilitado)
         VALUES ($1, $2, true)
         ON CONFLICT (usuario_id, test_tipo) DO NOTHING`,
        [usuario_id, test]
      );
    }
    return true;
  } catch (err) {
    console.error('Error al inicializar tests:', err);
    throw err;
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
  actualizarTenantLogo,
  obtenerEscalasSCID2,
  obtenerMapeoSCID2,
  inicializarMapeoSCID2,
  obtenerTestsHabilitados,
  habilitarTest,
  deshabilitarTest,
  inicializarTestsParaUsuario
};
