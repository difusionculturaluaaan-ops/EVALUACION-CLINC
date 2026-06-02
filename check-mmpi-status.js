const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/clinica_psico'
});

(async () => {
  try {
    console.log('🔍 Verificando MMPI-2 guardado...\n');

    // Última prueba MMPI-2
    const result = await pool.query(
      "SELECT id, paciente_id, tipo, fecha, total, subescalas FROM pruebas WHERE tipo='MMPI2' ORDER BY fecha DESC LIMIT 1"
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
    console.log(`💯 Total: ${row.total}\n`);

    let subescalas = row.subescalas;
    if (typeof subescalas === 'string') {
      try {
        subescalas = JSON.parse(subescalas);
      } catch (e) {
        console.log('⚠️ subescalas no es JSON válido');
      }
    }

    console.log('📊 Contenido de subescalas:');
    if (subescalas && typeof subescalas === 'object') {
      const keys = Object.keys(subescalas);
      console.log(`   Claves: ${keys.join(', ')}`);

      if (subescalas.pdf_filename) {
        console.log(`\n✅ pdf_filename ENCONTRADO: ${subescalas.pdf_filename}`);

        // Verificar si el archivo existe en disco
        const fs = require('fs');
        const path = require('path');
        const filepath = path.join(__dirname, 'public/pdfs', subescalas.pdf_filename);
        const exists = fs.existsSync(filepath);
        console.log(`   Archivo en disco: ${exists ? '✅ SÍ existe' : '❌ NO existe'}`);
      } else if (subescalas.pdf_base64) {
        console.log(`\n⚠️ pdf_base64 encontrado (${(subescalas.pdf_base64.length / 1024 / 1024).toFixed(2)} MB)`);
        console.log(`   Primeros 50 chars: ${subescalas.pdf_base64.substring(0, 50)}...`);
      } else {
        console.log(`\n❌ NO hay pdf_filename ni pdf_base64`);
        console.log(`   Claves presentes: ${keys.join(', ')}`);
      }
    }

    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
