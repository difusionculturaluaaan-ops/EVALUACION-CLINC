/**
 * Motor de Interpretación Clínica
 * Incluye baremos y niveles de severidad para todos los tests
 */

const interpretacion = {
  // ===== HAMILTON (HAM-D 17) =====
  hamD17: {
    calcular(total) {
      let nivel, label, color, texto;

      if (total <= 7) {
        nivel = 0;
        label = 'Sin Depresión';
        color = '#276749';
        texto = 'No se observa sintomatología depresiva significativa.';
      } else if (total <= 13) {
        nivel = 1;
        label = 'Depresión Leve';
        color = '#0284c7';
        texto = 'Presencia de síntomas depresivos con funcionamiento preservado.';
      } else if (total <= 18) {
        nivel = 2;
        label = 'Depresión Moderada';
        color = '#d97706';
        texto = 'Deterioro funcional moderado. Se recomienda intervención terapéutica.';
      } else if (total <= 22) {
        nivel = 3;
        label = 'Depresión Severa';
        color = '#dc2626';
        texto = 'Deterioro funcional importante. Considerar evaluación para tratamiento farmacológico.';
      } else {
        nivel = 4;
        label = 'Depresión Muy Severa';
        color = '#991b1b';
        texto = 'Sintomatología grave. Evaluar hospitalización o tratamiento intensivo.';
      }

      return { nivel, label, color, texto, total };
    },

    getEscala() {
      return [
        { min: 0, max: 7, label: 'Sin depresión' },
        { min: 8, max: 13, label: 'Leve' },
        { min: 14, max: 18, label: 'Moderada' },
        { min: 19, max: 22, label: 'Severa' },
        { min: 23, max: 52, label: 'Muy severa' }
      ];
    }
  },

  // ===== SCL-90-R =====
  scl90r: {
    // Parámetros normativos por subescala (media, DS, corte clínico)
    normas: {
      SOM: { media: 0.47, ds: 0.52, corte: 1.0 },
      OC: { media: 0.59, ds: 0.55, corte: 1.2 },
      SI: { media: 0.47, ds: 0.52, corte: 1.0 },
      DEP: { media: 0.59, ds: 0.59, corte: 1.2 },
      ANX: { media: 0.39, ds: 0.44, corte: 1.0 },
      HOS: { media: 0.46, ds: 0.55, corte: 1.0 },
      PHOB: { media: 0.15, ds: 0.31, corte: 0.7 },
      PAR: { media: 0.47, ds: 0.52, corte: 1.0 },
      PSY: { media: 0.19, ds: 0.36, corte: 0.7 }
    },

    // Índices globales: media normal, DS, corte clínico
    indicesGlobales: {
      GSI: { media: 0.44, ds: 0.43, corte: 0.70 },
      PST: { media: 26.9, ds: 18.3, corte: 37 },
      PSDI: { media: 1.55, ds: 0.46, corte: 1.85 }
    },

    subescalas: {
      SOM: { name: 'Somatización', items: [0, 3, 11, 26, 39, 41, 47, 48, 51, 52, 55, 57] },
      OC: { name: 'Obsesión-Compulsión', items: [2, 8, 9, 27, 37, 44, 45, 50, 54, 64] },
      SI: { name: 'Sensibilidad Interpersonal', items: [5, 20, 33, 35, 36, 40, 60, 68, 72] },
      DEP: { name: 'Depresión', items: [4, 13, 14, 19, 21, 25, 28, 29, 30, 31, 53, 70, 78] },
      ANX: { name: 'Ansiedad', items: [1, 16, 22, 32, 38, 56, 71, 77, 79, 85] },
      HOS: { name: 'Hostilidad', items: [10, 23, 62, 66, 73, 80] },
      PHOB: { name: 'Ansiedad Fóbica', items: [12, 24, 46, 49, 69, 74, 81] },
      PAR: { name: 'Ideación Paranoide', items: [7, 17, 42, 67, 75, 82] },
      PSY: { name: 'Psicoticismo', items: [6, 15, 34, 61, 76, 83, 84, 86, 87, 89] }
    },

    calcular(data) {
      const subescalas = {};

      for (const [key, sub] of Object.entries(this.subescalas)) {
        const suma = sub.items.reduce((acc, i) => acc + (data[i] || 0), 0);
        const media = suma / sub.items.length;
        const norma = this.normas[key];
        subescalas[key] = {
          nombre: sub.name,
          suma: suma,
          media: media.toFixed(2),
          mediaNormal: norma.media,
          ds: norma.ds,
          corte: norma.corte,
          nivel: this.getNivelSubescala(media, key)
        };
      }

      const GSI = data.reduce((a, b) => a + b, 0) / 90;
      const PST = data.filter(v => v > 0).length;
      const PSDI = PST > 0 ? (data.reduce((a, b) => a + b, 0) / PST) : 0;

      const interpretacion = this.interpretarGSI(GSI);

      return {
        subescalas,
        GSI: GSI.toFixed(3),
        PST: PST,
        PSDI: PSDI.toFixed(3),
        indicesGlobales: {
          GSI: { valor: GSI.toFixed(3), media: this.indicesGlobales.GSI.media, corte: this.indicesGlobales.GSI.corte },
          PST: { valor: PST, media: this.indicesGlobales.PST.media, corte: this.indicesGlobales.PST.corte },
          PSDI: { valor: PSDI.toFixed(3), media: this.indicesGlobales.PSDI.media, corte: this.indicesGlobales.PSDI.corte }
        },
        interpretacion
      };
    },

    getNivelSubescala(media, key) {
      const corte = this.normas[key]?.corte || 1.0;
      if (media < corte) return { label: 'Normal', color: '#276749' };
      if (media < corte * 1.3) return { label: 'Leve', color: '#0284c7' };
      if (media < corte * 1.7) return { label: 'Moderada', color: '#d97706' };
      return { label: 'Severa', color: '#dc2626' };
    },

    interpretarGSI(gsi) {
      let label, color, nivel;

      if (gsi < 0.44) {
        nivel = 0;
        label = 'Sin malestar significativo';
        color = '#276749';
      } else if (gsi < 0.70) {
        nivel = 1;
        label = 'Malestar leve';
        color = '#0284c7';
      } else if (gsi < 1.10) {
        nivel = 2;
        label = 'Malestar moderado (Umbral clínico)';
        color = '#d97706';
      } else if (gsi < 1.80) {
        nivel = 3;
        label = 'Malestar severo';
        color = '#dc2626';
      } else {
        nivel = 4;
        label = 'Malestar muy severo';
        color = '#991b1b';
      }

      return { label, color, nivel };
    }
  },

  // ===== MMPI-2 (Minnesota Multiphasic Personality Inventory-2) =====
  mmpi2: {
    // Escalas de Validez (T-score: media 50, DS 10)
    escalasValidez: {
      L: { nombre: 'Mentira', corteAlerta: 65 },
      F: { nombre: 'Infrecuencia', corteAlerta: 80 },
      K: { nombre: 'Corrección', corteAlerta: { bajo: 35, alto: 70 } },
      VRIN: { nombre: 'Inconsistencia Variable', corteAlerta: 80 },
      TRIN: { nombre: 'Inconsistencia Verdadero', corteAlerta: 80 }
    },

    // Escalas Clínicas Básicas (10 escalas primarias)
    escalasClinicas: {
      Hs: { numero: 1, nombre: 'Hipocondría', corte: 65 },
      D: { numero: 2, nombre: 'Depresión', corte: 65 },
      Hy: { numero: 3, nombre: 'Histeria', corte: 65 },
      Pd: { numero: 4, nombre: 'Desviación Psicopática', corte: 65 },
      Mf: { numero: 5, nombre: 'Masculinidad-Feminidad', corte: 65 },
      Pa: { numero: 6, nombre: 'Paranoia', corte: 65 },
      Pt: { numero: 7, nombre: 'Psicastenia', corte: 65 },
      Sc: { numero: 8, nombre: 'Esquizofrenia', corte: 65 },
      Ma: { numero: 9, nombre: 'Hipomanía', corte: 65 },
      Si: { numero: 0, nombre: 'Introversión Social', corte: 65 }
    },

    // Escalas de Contenido (suplementarias)
    escalasContenido: {
      ANX: { nombre: 'Ansiedad General', corte: 65 },
      FRS: { nombre: 'Miedos', corte: 65 },
      OBS: { nombre: 'Pensamiento Obsesivo', corte: 65 },
      DEP: { nombre: 'Depresión General', corte: 65 },
      HEA: { nombre: 'Preocupaciones Saludables', corte: 65 },
      BIZ: { nombre: 'Pensamiento Bizarro', corte: 65 },
      ANG: { nombre: 'Ira', corte: 65 },
      ASP: { nombre: 'Prácticas Antisociales', corte: 65 },
      TPA: { nombre: 'Conducta Tipo A', corte: 65 },
      LSE: { nombre: 'Baja Autoestima', corte: 65 },
      SOD: { nombre: 'Malestar Social', corte: 65 },
      FAM: { nombre: 'Problemas Familiares', corte: 65 },
      WRK: { nombre: 'Interferencia Laboral', corte: 65 },
      TRT: { nombre: 'Indicadores Negativos Tx', corte: 65 }
    },

    interpretarTScore(tScore) {
      let nivel, label, color;

      if (tScore < 40) {
        nivel = 0;
        label = 'Bajo / Infravalorado';
        color = '#276749';
      } else if (tScore < 55) {
        nivel = 1;
        label = 'Normal / Sin significación clínica';
        color = '#0284c7';
      } else if (tScore < 65) {
        nivel = 2;
        label = 'Elevación leve (Monitorear)';
        color = '#f97316';
      } else if (tScore < 75) {
        nivel = 3;
        label = 'Clínicamente significativo';
        color = '#d97706';
      } else if (tScore < 85) {
        nivel = 4;
        label = 'Elevación marcada / Patología probable';
        color = '#dc2626';
      } else {
        nivel = 5;
        label = 'Elevación extrema / Patología severa';
        color = '#991b1b';
      }

      return { nivel, label, color };
    },

    validarPerfil(datos) {
      const L = datos.L || 0;
      const F = datos.F || 0;
      const K = datos.K || 0;
      const VRIN = datos.VRIN || 0;
      const TRIN = datos.TRIN || 0;

      const advertencias = [];
      let valido = true;

      if (L >= 65) {
        advertencias.push('Elevación en L: Defensividad o imagen excesivamente positiva.');
      }
      if (F >= 80) {
        advertencias.push('Elevación en F (≥80): Posible fingimiento, crisis aguda o protocolo inválido.');
        valido = false;
      }
      if (K < 35 || K > 70) {
        advertencias.push('K fuera de rango: Verificar interpretabilidad del protocolo.');
      }
      if (VRIN >= 80) {
        advertencias.push('VRIN elevado: Respuestas inconsistentes aleatorias.');
        valido = false;
      }
      if (TRIN >= 80) {
        advertencias.push('TRIN elevado: Sesgo sistemático en respuestas (Sí/No).');
        valido = false;
      }

      return { advertencias, valido };
    }
  },

  // ===== HAMILTON (más datos) =====
  hamilton: {
    items: [
      { nombre: 'Humor deprimido', escala: 'Ausente | Si preguntan | Espontáneo | No verbal | Verbal/No verbal' },
      { nombre: 'Culpa', escala: 'Ausente | Diferente | Ideas de culpabilidad | Castigo | Alucinaciones' },
      { nombre: 'Suicidio', escala: 'Ausente | Sin valor | Deseo de morir | Amenazas | Intentos' },
      { nombre: 'Insomnio precoz', escala: 'Ausente | Dificultad >30m | Diario' },
      { nombre: 'Insomnio intermedio', escala: 'Ausente | Vuelve a dormir | Incapaz' },
      { nombre: 'Insomnio tardío', escala: 'Ausente | Duerme | Incapaz' },
      { nombre: 'Trabajo y actividades', escala: 'Ausente | Fatiga | Interés | Productividad | Dejó de trabajar' },
      { nombre: 'Inhibición', escala: 'Ausente | Retraso ligero | Evidente | Expresión | Incapacidad' },
      { nombre: 'Agitación', escala: 'Ausente | Dedos | Manos/Pelo | No para | Manos/Labios' },
      { nombre: 'Ansiedad psiquiátrica', escala: 'Ausente | Tensión | Pequeñas cosas | Aprensivo | Temores' },
      { nombre: 'Ansiedad somática', escala: 'Ausente | Ligera | Moderada | Severa | Incapacitante' },
      { nombre: 'Síntomas gastrointestinales', escala: 'Ausente | Apetito/Pesadez | Laxantes' },
      { nombre: 'Síntomas somáticos generales', escala: 'Ausente | Pesadez | Energía' },
      { nombre: 'Síntomas genitales', escala: 'Ausente | Débil | Grave' },
      { nombre: 'Hipocondría', escala: 'Ausente | Corporal | Salud | Lamentos | Delirios' },
      { nombre: 'Pérdida de peso', escala: 'Ausente | >500g | >1kg' },
      { nombre: 'Insight', escala: 'Ausente | Causas externas | No reconoce' }
    ]
  },

  // ===== ISRA (Inventario Situaciones y Respuestas de Ansiedad) =====
  isra: {
    // Parámetros normativos para sistemas de respuesta (Tobal & Cano Vindel)
    normasSistemas: {
      C: { media: 55.0, ds: 28.5, rango: '0-272' },     // Cognitivo
      F: { media: 44.0, ds: 25.0, rango: '0-272' },     // Fisiológico
      M: { media: 38.0, ds: 22.0, rango: '0-272' }      // Motor-Conductual
    },

    normasTotal: {
      total: { media: 137.0, ds: 68.0, rango: '0-896', corte: 185, corteP75: 185 }
    },

    // Percentiles para clasificación
    percentiles: {
      P25: 90,      // < 25 percentil
      P50: 137,     // 25-50 percentil
      P75: 185,     // 51-75 percentil
      P90: 240      // 76-90 percentil
    },

    sistemas: {
      C: { nombre: 'Cognitivo', rango: '0-272' },
      F: { nombre: 'Fisiológico', rango: '0-272' },
      M: { nombre: 'Motor-Conductual', rango: '0-272' }
    },

    areas: {
      FE: { nombre: 'Evaluación y vida cotidiana' },
      IS: { nombre: 'Situaciones interpersonales/sexuales' },
      FC: { nombre: 'Situaciones fóbicas' },
      RH: { nombre: 'Rutinas y hábitos' }
    },

    calcular(datos) {
      const sistemas = {};

      // Calcular sistemas de respuesta
      for (const [key, sys] of Object.entries(this.sistemas)) {
        const puntuacion = datos[key] || 0;
        const norma = this.normasSistemas[key];
        const z = ((puntuacion - norma.media) / norma.ds).toFixed(2);

        sistemas[key] = {
          nombre: sys.nombre,
          suma: puntuacion,
          media: norma.media,
          ds: norma.ds,
          zScore: z,
          elevado: puntuacion > (norma.media + norma.ds)
        };
      }

      const totalR = (datos.C || 0) + (datos.F || 0) + (datos.M || 0);
      const interpretacion = this.interpretarTotal(totalR);

      return {
        sistemas,
        totalR: totalR,
        interpretacion
      };
    },

    interpretarTotal(totalR) {
      let nivel, label, color, percentil;

      if (totalR < this.percentiles.P25) {
        nivel = 0;
        label = 'Ansiedad baja';
        color = '#276749';
        percentil = '< P25';
      } else if (totalR <= this.percentiles.P50) {
        nivel = 1;
        label = 'Ansiedad normal/media';
        color = '#0284c7';
        percentil = 'P25–P50';
      } else if (totalR <= this.percentiles.P75) {
        nivel = 2;
        label = 'Ansiedad moderada';
        color = '#f97316';
        percentil = 'P51–P75';
      } else if (totalR <= this.percentiles.P90) {
        nivel = 3;
        label = 'Ansiedad alta';
        color = '#d97706';
        percentil = 'P76–P90';
      } else {
        nivel = 4;
        label = 'Ansiedad muy alta / Clínica';
        color = '#dc2626';
        percentil = '> P90';
      }

      return { nivel, label, color, percentil, corteClinico: totalR > this.percentiles.P75 };
    }
  },

  // ===== TDS =====
  tds: {
    factoresConfig: {
      F1: { nombre: 'Somnolencia Excesiva Diurna', items: [0, 1, 2, 3, 4], normal: 4, alerta: 5 },
      F2: { nombre: 'Insomnio Intermedio / Final', items: [5, 6, 7, 8], normal: 2, alerta: 3 },
      F3: { nombre: 'Insomnio Inicial', items: [9, 10, 11, 12], normal: 2, alerta: 3 },
      F4: { nombre: 'Apnea del Sueño', items: [13, 14, 15], normal: 0, alerta: 1 },
      F5: { nombre: 'Parasomnias Complejas', items: [16, 17, 18], normal: 1, alerta: 2 },
      F6: { nombre: 'Sonambulismo / Somniloquio', items: [19, 20, 21], normal: 2, alerta: 3 },
      F7: { nombre: 'Ronquido', items: [22, 23], normal: 1, alerta: 2 },
      F8: { nombre: 'Piernas Inquietas / Pesadillas', items: [24, 25, 26], normal: 1, alerta: 2 },
      F9: { nombre: 'Uso de Medicamentos', items: [27, 28], normal: 0, alerta: 1 },
      F10: { nombre: 'Parálisis al Dormir', items: [29], normal: 0, alerta: 1 }
    },

    calcular(data) {
      const factores = {};
      let totalAlertasClinicas = 0;

      for (const [factorKey, config] of Object.entries(this.factoresConfig)) {
        const suma = config.items.reduce((acc, i) => acc + (data[i] || 0), 0);
        const tieneAlerta = suma >= config.alerta;

        if (tieneAlerta) totalAlertasClinicas++;

        factores[factorKey] = {
          nombre: config.nombre,
          suma: suma,
          estado: tieneAlerta ? 'Alerta Clínica' : 'Normal',
          color: tieneAlerta ? '#dc2626' : '#276749'
        };
      }

      const total = data.reduce((a, b) => a + (b || 0), 0);

      let nivelGlobal, labelGlobal, colorGlobal, textoGlobal;

      if (totalAlertasClinicas === 0) {
        nivelGlobal = 0;
        labelGlobal = 'Sueño Normal';
        colorGlobal = '#276749';
        textoGlobal = 'Patrón de sueño dentro de los rangos normales. Sin alertas clínicas detectadas.';
      } else if (totalAlertasClinicas <= 2) {
        nivelGlobal = 1;
        labelGlobal = 'Trastorno Leve';
        colorGlobal = '#0284c7';
        textoGlobal = 'Presencia de alteraciones del sueño leves. ' + totalAlertasClinicas + ' factor(es) en alerta.';
      } else if (totalAlertasClinicas <= 4) {
        nivelGlobal = 2;
        labelGlobal = 'Trastorno Moderado';
        colorGlobal = '#d97706';
        textoGlobal = 'Trastornos del sueño de magnitud clínica moderada. ' + totalAlertasClinicas + ' factor(es) en alerta. Se recomienda intervención.';
      } else {
        nivelGlobal = 3;
        labelGlobal = 'Trastorno Severo';
        colorGlobal = '#dc2626';
        textoGlobal = 'Trastornos del sueño severos. ' + totalAlertasClinicas + ' factor(es) en alerta. Se recomienda evaluación especializada.';
      }

      return {
        nivel: nivelGlobal,
        label: labelGlobal,
        color: colorGlobal,
        texto: textoGlobal,
        total: total,
        factores: factores,
        totalAlertasClinicas: totalAlertasClinicas
      };
    }
  },

  // ===== PCL-R =====
  pclr: {
    factores: {
      Factor1: { nombre: 'Factor 1: Interpersonal/Afectivo', items: [1, 3, 5, 7, 8] },
      Factor2: { nombre: 'Factor 2: Estilo de vida/Antisocial', items: [2, 4, 6, 9, 10] }
    },

    calcular(data) {
      const total = data.reduce((a, b) => a + b, 0);
      let nivel, label, color;

      if (total < 20) {
        nivel = 0;
        label = 'Sin indicadores significativos de psicopatía';
        color = '#276749';
      } else if (total < 30) {
        nivel = 1;
        label = 'Rasgos psicopáticos subclínicos o moderados';
        color = '#0284c7';
      } else if (total < 40) {
        nivel = 2;
        label = 'Umbral diagnóstico - Psicopatía probable';
        color = '#d97706';
      } else {
        nivel = 3;
        label = 'Psicopatía severa';
        color = '#dc2626';
      }

      return { nivel, label, color, total };
    },

    advertencia() {
      return '⚠️ El PCL-R es de uso restringido. Solo profesionales entrenados deben administrarlo.';
    },

    obtenerNormasPoblacion() {
      return {
        totalMedio: 20,
        totalMaximo: 60,
        items: {
          1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0,
          6: 1.0, 7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0,
          11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0,
          16: 1.0, 17: 1.0, 18: 1.0, 19: 1.0, 20: 1.0
        },
        factores: {
          Factor1: { nombre: 'Interpersonal/Afectivo', media: 10 },
          Factor2: { nombre: 'Estilo de vida/Antisocial', media: 10 }
        }
      };
    }
  },

  // ===== EGEP-5 (TEPT) =====
  egep5: {
    // Parámetros normativos (media, DS) por clúster DSM-5
    normas: {
      B: { media: 2.1, ds: 2.8, rango: '0-20' },
      C: { media: 0.8, ds: 1.4, rango: '0-8' },
      D: { media: 3.2, ds: 4.1, rango: '0-28' },
      E: { media: 3.5, ds: 3.9, rango: '0-24' }
    },

    indicesGlobales: {
      total: { media: 9.6, ds: 11.2, corte: 20, corteMaximo: 80 }
    },

    criterios: {
      B: { nombre: 'Clúster B — Re-experimentación', items: [1, 2, 3, 4, 5], rango: 20 },
      C: { nombre: 'Clúster C — Evitación', items: [6, 7], rango: 8 },
      D: { nombre: 'Clúster D — Alteraciones cognitivas/ánimo', items: [8, 9, 10, 11, 12, 13, 14], rango: 28 },
      E: { nombre: 'Clúster E — Hiperactivación', items: [15, 16, 17, 18, 19, 20], rango: 24 }
    },

    calcular(data) {
      const clusters = {};

      for (const [key, crit] of Object.entries(this.criterios)) {
        const suma = crit.items.reduce((acc, i) => acc + (data[i - 1] || 0), 0);
        const norma = this.normas[key];
        clusters[key] = {
          nombre: crit.nombre,
          suma: suma,
          rango: crit.rango,
          media: norma.media,
          ds: norma.ds
        };
      }

      const total = data.reduce((a, b) => a + b, 0);
      let nivel, label, color, texto;

      if (total <= 10) {
        nivel = 0;
        label = 'Sin TEPT / Subcínico';
        color = '#276749';
        texto = 'Síntomas por debajo del umbral diagnóstico.';
      } else if (total <= 20) {
        nivel = 1;
        label = 'Leve (Punto de corte diagnóstico)';
        color = '#0284c7';
        texto = 'Cumple criterios básicos de TEPT. Requiere verificación de: Criterio A (exposición), duración >1 mes y deterioro funcional.';
      } else if (total <= 35) {
        nivel = 2;
        label = 'Moderado';
        color = '#d97706';
        texto = 'TEPT de severidad moderada. Se recomienda tratamiento especializado.';
      } else if (total <= 50) {
        nivel = 3;
        label = 'Severo';
        color = '#dc2626';
        texto = 'Síntomas severos de TEPT con deterioro importante. Evaluación urgente recomendada.';
      } else {
        nivel = 4;
        label = 'Muy severo';
        color = '#991b1b';
        texto = 'TEPT extremadamente severo. Intervención inmediata necesaria.';
      }

      return { nivel, label, color, texto, total, clusters };
    },

    obtenerDiagnosticoDSM5(data) {
      // Verificar criterios DSM-5
      const criterioB = data.slice(0, 5).some(v => v >= 1) ? 1 : 0;
      const criterioC = data.slice(5, 7).some(v => v >= 1) ? 1 : 0;
      const criterioD = data.slice(7, 14).filter(v => v >= 1).length >= 2 ? 1 : 0;
      const criterioE = data.slice(14, 20).filter(v => v >= 1).length >= 2 ? 1 : 0;

      const cumplidos = [criterioB, criterioC, criterioD, criterioE].filter(c => c).length;
      const total = data.reduce((a, b) => a + b, 0);
      const cumplePuntoCOrte = total >= 20;

      if (cumplidos === 4 && cumplePuntoCOrte) {
        return { probable: true, texto: 'TEPT probable según criterios DSM-5 (Bados et al., 2015)' };
      } else {
        return { probable: false, texto: `Criterios incompletos: ${cumplidos}/4 presentes. Total: ${total}/80 (corte: ≥20)` };
      }
    }
  },

  /**
   * Función genérica para obtener el color de una barra de progreso
   */
  getColorNivel(nivel) {
    const colores = {
      0: '#276749',  // Verde - Normal
      1: '#0284c7',  // Azul - Leve
      2: '#d97706',  // Naranja - Moderado
      3: '#dc2626',  // Rojo - Severo
      4: '#991b1b'   // Rojo muy oscuro - Muy severo
    };
    return colores[nivel] || '#718096';
  }
};
