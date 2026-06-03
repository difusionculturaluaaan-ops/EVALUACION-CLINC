const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const result = await pool.query(
      `SELECT 
        id, tipo, paciente_id, total, 
        data::jsonb, 
        subescalas::jsonb as subescalas_parsed
      FROM pruebas 
      WHERE tipo = 'MMPI2' 
      ORDER BY fecha DESC 
      LIMIT 1`
    );

    if (result.rows.length === 0) {
      console.log('❌ No hay pruebas MMPI-2 guardadas');
      await pool.end();
      return;
    }

    const row = result.rows[0];
    console.log('\n📊 ESTRUCTURA DE DATOS MMPI-2 GUARDADO:\n');
    console.log(`ID Prueba: ${row.id}`);
    console.log(`Paciente: ${row.paciente_id}`);
    console.log(`Total: ${row.total}`);
    
    console.log('\n📋 CAMPO "data" (Respuestas 338 items):');
    console.log(`   Tipo: Array de 338 números (1-2 para V/F)`);
    console.log(`   Primeros 10: ${JSON.stringify(row.data?.slice(0, 10))}`);
    console.log(`   Últimos 5: ${JSON.stringify(row.data?.slice(-5))}`);
    
    console.log('\n📈 CAMPO "subescalas" (JSON con escalas y PDF):');
    const sub = row.subescalas_parsed;
    if (sub?.subescalas) {
      console.log(`   Escalas encontradas: ${Object.keys(sub.subescalas).length}`);
      const firstEscala = Object.entries(sub.subescalas)[0];
      console.log(`   Ejemplo (${firstEscala[0]}): ${JSON.stringify(firstEscala[1])}`);
    }
    if (sub?.pdf_base64) {
      console.log(`\n   ✅ PDF Base64 encontrado`);
      console.log(`   Tamaño: ${(sub.pdf_base64.length / 1024).toFixed(2)} KB`);
      console.log(`   Primeros 50 chars: ${sub.pdf_base64.substring(0, 50)}...`);
    }

    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
