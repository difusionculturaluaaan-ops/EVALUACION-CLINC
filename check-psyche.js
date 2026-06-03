const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE email = 'psyche@clinica.com'`
    );

    if (result.rows.length === 0) {
      console.log('❌ psyche@clinica.com NO existe en la BD');
    } else {
      console.log('✅ psyche@clinica.com EXISTE:');
      const u = result.rows[0];
      console.log(`  ID: ${u.id}`);
      console.log(`  Nombre: ${u.nombre}`);
      console.log(`  Estado: ${u.estado}`);
      console.log(`  Tenant ID: ${u.tenant_id}`);
    }

    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
