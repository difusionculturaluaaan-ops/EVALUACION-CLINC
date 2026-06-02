const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/clinica_psico'
});

(async () => {
  try {
    console.log('🔍 Conectando a BD...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado\n');

    const result = await pool.query(
      "SELECT id, paciente_id, tipo, fecha, subescalas FROM pruebas WHERE tipo='MMPI2' ORDER BY fecha DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      console.log('❌ No hay pruebas MMPI-2 guardadas');
      await pool.end();
      return;
    }

    const row = result.rows[0];
    console.log(`📋 Prueba ID: ${row.id}`);
    console.log(`👤 Paciente: ${row.paciente_id}`);
    console.log(`📅 Fecha: ${row.fecha}`);
    console.log(`\n📊 Contenido de subescalas:`);

    let subescalas = row.subescalas;

    // Si es string, parsear JSON
    if (typeof subescalas === 'string') {
      try {
        subescalas = JSON.parse(subescalas);
      } catch (e) {
        console.log('⚠️  No es JSON válido:', subescalas.substring(0, 100));
      }
    }

    if (typeof subescalas === 'object' && subescalas !== null) {
      const keys = Object.keys(subescalas);
      console.log(`🔑 Total de claves: ${keys.length}`);
      console.log(`\n✅ Claves encontradas: ${keys.slice(0, 10).join(', ')}${keys.length > 10 ? '...' : ''}`);

      if (subescalas.pdf_base64) {
        const pdfSize = subescalas.pdf_base64.length;
        console.log(`\n✅ ¡PDF ENCONTRADO!`);
        console.log(`   Tamaño: ${(pdfSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Primeros 80 caracteres:`);
        console.log(`   ${subescalas.pdf_base64.substring(0, 80)}...`);
      } else {
        console.log(`\n❌ NO hay pdf_base64 en subescalas`);
        console.log(`   Claves presentes: ${keys.join(', ')}`);
      }
    } else {
      console.log('⚠️  subescalas no es un objeto válido');
      console.log('   Tipo:', typeof subescalas);
      console.log('   Valor:', String(subescalas).substring(0, 100));
    }

    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
