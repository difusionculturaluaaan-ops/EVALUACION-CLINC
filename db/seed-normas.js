const { pool } = require('./schema');

const normasDatos = [
  // SCL-90-R - Población Normal
  { test_tipo: 'SCL90R', escala: 'Somatización', poblacion: 'población normal', valor_media: 0.36, desviacion_tipica: 0.42, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Obsesivo-Compulsivo', poblacion: 'población normal', valor_media: 0.39, desviacion_tipica: 0.45, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Susceptibilidad Interpersonal', poblacion: 'población normal', valor_media: 0.29, desviacion_tipica: 0.39, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Depresión', poblacion: 'población normal', valor_media: 0.36, desviacion_tipica: 0.44, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Ansiedad', poblacion: 'población normal', valor_media: 0.30, desviacion_tipica: 0.37, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Hostilidad', poblacion: 'población normal', valor_media: 0.30, desviacion_tipica: 0.40, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Ansiedad Fóbica', poblacion: 'población normal', valor_media: 0.13, desviacion_tipica: 0.31, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Ideación Paranoide', poblacion: 'población normal', valor_media: 0.34, desviacion_tipica: 0.44, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Psicotisismo', poblacion: 'población normal', valor_media: 0.14, desviacion_tipica: 0.25, minimo: 0, maximo: 4 },
  { test_tipo: 'SCL90R', escala: 'Índice Severidad Total', poblacion: 'población normal', valor_media: 0.31, desviacion_tipica: 0.31, minimo: 0, maximo: 4 },

  // SCL-90-R - Pacientes Psiquiátricos Externos
  { test_tipo: 'SCL90R', escala: 'Índice Severidad Total', poblacion: 'pacientes psiquiátricos externos', valor_media: 1.26, desviacion_tipica: 0.68, minimo: 0, maximo: 4 },

  // SCL-90-R - Pacientes Psiquiátricos Internos
  { test_tipo: 'SCL90R', escala: 'Índice Severidad Total', poblacion: 'pacientes psiquiátricos internos', valor_media: 1.30, desviacion_tipica: 0.82, minimo: 0, maximo: 4 },

  // Hamilton Depression Rating Scale (HDRS)
  { test_tipo: 'HAMILTON', escala: 'Puntuación Total', poblacion: 'población normal', valor_media: 0, desviacion_tipica: 0, minimo: 0, maximo: 7, interpretacion: 'Sin depresión' },
  { test_tipo: 'HAMILTON', escala: 'Puntuación Total', poblacion: 'depresión leve', valor_media: 10.5, desviacion_tipica: 1.5, minimo: 8, maximo: 13, interpretacion: 'Depresión leve/menor' },
  { test_tipo: 'HAMILTON', escala: 'Puntuación Total', poblacion: 'depresión moderada', valor_media: 16, desviacion_tipica: 1.4, minimo: 14, maximo: 18, interpretacion: 'Depresión moderada' },
  { test_tipo: 'HAMILTON', escala: 'Puntuación Total', poblacion: 'depresión severa', valor_media: 20.5, desviacion_tipica: 1, minimo: 19, maximo: 22, interpretacion: 'Depresión severa' },
  { test_tipo: 'HAMILTON', escala: 'Puntuación Total', poblacion: 'depresión muy severa', valor_media: 28, desviacion_tipica: 3, minimo: 23, maximo: 52, interpretacion: 'Depresión muy severa' },

  // MMPI-2 - Escalas T
  { test_tipo: 'MMPI2', escala: 'total', poblacion: 'población normal', valor_media: 50, desviacion_tipica: 10, minimo: 30, maximo: 70, interpretacion: 'Rango normal T30-T65' },

  // ISRA - Población Normal Española
  { test_tipo: 'ISRA', escala: 'total', poblacion: 'población general', valor_media: 1.2, desviacion_tipica: 0.5, minimo: 0, maximo: 4 },
  { test_tipo: 'ISRA', escala: 'total', poblacion: 'trastornos psicofisiológicos', valor_media: 2.1, desviacion_tipica: 0.8, minimo: 0, maximo: 4 },
  { test_tipo: 'ISRA', escala: 'total', poblacion: 'trastornos de ansiedad', valor_media: 2.8, desviacion_tipica: 0.9, minimo: 0, maximo: 4 },

  // TDS - Test de Trastornos del Sueño
  { test_tipo: 'TDS', escala: 'total', poblacion: 'población normal', valor_media: 22.5, desviacion_tipica: 10.8, minimo: 0, maximo: 120, interpretacion: '<30: Sin trastorno significativo; 30-60: Trastorno moderado; >60: Trastorno severo' },

  // PCL-R - Hare Psychopathy Checklist
  { test_tipo: 'PCLR', escala: 'total', poblacion: 'población carcelaria', valor_media: 20.25, desviacion_tipica: 7.3, minimo: 0, maximo: 40, interpretacion: '<30: No psicopatía; ≥30: Probable psicopatía' },
  { test_tipo: 'PCLR', escala: 'factor1', poblacion: 'población carcelaria', valor_media: 9.33, desviacion_tipica: 3.59, minimo: 0, maximo: 16 },
  { test_tipo: 'PCLR', escala: 'factor2', poblacion: 'población carcelaria', valor_media: 9.69, desviacion_tipica: 4.68, minimo: 0, maximo: 20 },

  // EGEP-5 / EGS-R - TEPT
  { test_tipo: 'EGEP5', escala: 'total', poblacion: 'población normativa', valor_media: 5.2, desviacion_tipica: 3.1, minimo: 0, maximo: 80, interpretacion: '<20: Sin TEPT probable' },
  { test_tipo: 'EGEP5', escala: 'total', poblacion: 'víctimas violencia', valor_media: 35.5, desviacion_tipica: 18.4, minimo: 0, maximo: 80, interpretacion: '≥20: TEPT probable (sensibilidad 82.48%)' }
];

async function seedNormas() {
  try {
    console.log('Iniciando siembra de datos normativos...');

    // Verificar si ya existen datos
    const result = await pool.query('SELECT COUNT(*) FROM normas');
    const count = parseInt(result.rows[0].count);

    if (count > 0) {
      console.log(`✓ Datos normativos ya existen (${count} registros). Omitiendo siembra.`);
      return;
    }

    // Insertar datos
    for (const norma of normasDatos) {
      await pool.query(
        `INSERT INTO normas (test_tipo, escala, poblacion, valor_media, desviacion_tipica, minimo, maximo, interpretacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [norma.test_tipo, norma.escala, norma.poblacion, norma.valor_media, norma.desviacion_tipica, norma.minimo, norma.maximo, norma.interpretacion]
      );
    }

    console.log(`✓ Insertados ${normasDatos.length} registros de normas de población`);
  } catch (err) {
    console.error('Error al sembrar normas:', err);
  }
}

// Ejecutar siembra si se llama directamente
if (require.main === module) {
  seedNormas().then(() => {
    console.log('Siembra completada');
    process.exit(0);
  });
}

module.exports = { seedNormas };
