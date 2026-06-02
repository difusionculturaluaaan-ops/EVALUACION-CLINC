const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/clinica_psico'
});

(async () => {
  try {
    console.log('🔍 Conectando a BD...');
    const testConn = await pool.query('SELECT NOW()');
    console.log('✅ Conectado');

    console.log('\n📊 Últimas pruebas MMPI-2:');
    const result = await pool.query(
      "SELECT id, paciente_id, tipo, fecha, subescalas FROM pruebas WHERE tipo='MMPI2' ORDER BY fecha DESC LIMIT 3"
    );

    result.rows.forEach((row, idx) => {
      console.log(`\n[${idx + 1}] Prueba ID: ${row.id}`);
      console.log(`    Paciente: ${row.paciente_id}`);
      console.log(`    Fecha: ${row.fecha}`);

      if (row.subescalas && typeof row.subescalas === 'object') {
        const hasPDF = row.subescalas.pdf_base64 ? '✅ SÍ' : '❌ NO';
        console.log(`    ¿Tiene pdf_base64?: ${hasPDF}`);

        if (row.subescalas.pdf_base64) {
          const pdfSize = row.subescalas.pdf_base64.length;
          console.log(`    Tamaño base64: ${(pdfSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`    Primeros 50 chars: ${row.subescalas.pdf_base64.substring(0, 50)}...`);
        }
      }
    });

    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
