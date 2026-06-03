const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    console.log('\n📋 USUARIOS EN LA BD:\n');

    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.nombre, u.rol, u.estado, u.tenant_id,
        t.nombre as tenant_nombre
      FROM usuarios u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      ORDER BY u.tenant_id DESC, u.email
    `);

    if (result.rows.length === 0) {
      console.log('❌ No hay usuarios en la BD');
      await pool.end();
      return;
    }

    console.log(`Total: ${result.rows.length} usuarios\n`);

    result.rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`  Email: ${row.email}`);
      console.log(`  Nombre: ${row.nombre}`);
      console.log(`  Rol: ${row.rol}`);
      console.log(`  Estado: ${row.estado}`);
      console.log(`  Tenant: ${row.tenant_nombre} (ID: ${row.tenant_id})`);
      console.log('');
    });

    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
