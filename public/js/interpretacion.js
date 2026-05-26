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
        subescalas[key] = {
          nombre: sub.name,
          suma: suma,
          media: media.toFixed(2),
          nivel: this.getNivelSubescala(media)
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
        interpretacion
      };
    },

    getNivelSubescala(media) {
      if (media < 0.70) return { label: 'Sin significación', color: '#276749' };
      if (media < 1.30) return { label: 'Leve', color: '#0284c7' };
      if (media < 2.00) return { label: 'Moderada', color: '#d97706' };
      return { label: 'Severa', color: '#dc2626' };
    },

    interpretarGSI(gsi) {
      let label, color, nivel;

      if (gsi < 0.70) {
        nivel = 0;
        label = 'Sin Caseness';
        color = '#276749';
      } else if (gsi < 1.30) {
        nivel = 1;
        label = 'Caseness Leve';
        color = '#0284c7';
      } else if (gsi < 2.00) {
        nivel = 2;
        label = 'Caseness Moderado';
        color = '#d97706';
      } else {
        nivel = 3;
        label = 'Caseness Severo';
        color = '#dc2626';
      }

      return { label, color, nivel };
    }
  },

  // ===== MMPI-2 =====
  mmpi2: {
    escalas: ['L', 'F', 'K', 'Hs', 'D', 'Hy', 'Pd', 'Mf', 'Pa', 'Pt', 'Sc', 'Ma', 'Si'],
    escalasClinicas: ['Hs', 'D', 'Hy', 'Pd', 'Mf', 'Pa', 'Pt', 'Sc', 'Ma', 'Si'],

    interpretarTScore(tScore) {
      let nivel, label, color;

      if (tScore < 50) {
        nivel = 0;
        label = 'Bajo';
        color = '#276749';
      } else if (tScore < 65) {
        nivel = 1;
        label = 'Normal';
        color = '#0284c7';
      } else if (tScore < 75) {
        nivel = 2;
        label = 'Clínicamente elevado';
        color = '#d97706';
      } else {
        nivel = 3;
        label = 'Muy elevado';
        color = '#dc2626';
      }

      return { nivel, label, color };
    },

    validarPerfil(datos) {
      const L = datos.L || 0;
      const F = datos.F || 0;
      const K = datos.K || 0;

      const advertencias = [];

      if (L >= 65) {
        advertencias.push('Elevación en L: Defensividad o imagen excesivamente positiva.');
      }
      if (F >= 80) {
        advertencias.push('Elevación en F: Posible fingimiento, crisis aguda o protocolo inválido.');
      }
      if (K < 40) {
        advertencias.push('K bajo: Franqueza excesiva o autodevaluación.');
      }

      return advertencias;
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

  // ===== ISRA =====
  isra: {
    sistemas: {
      C: { nombre: 'Cognitivo', items: [] },
      F: { nombre: 'Fisiológico', items: [] },
      M: { nombre: 'Motor-Conductual', items: [] }
    },

    situaciones: {
      E: { nombre: 'Evaluación', items: [] },
      I: { nombre: 'Interpersonal', items: [] },
      F: { nombre: 'Fóbicas', items: [] },
      V: { nombre: 'Vida Cotidiana', items: [] }
    },

    interpretarIGA(iga) {
      let nivel, label, color;

      if (iga < 0.15) {
        nivel = 0;
        label = 'Muy Bajo';
        color = '#276749';
      } else if (iga < 0.30) {
        nivel = 1;
        label = 'Bajo';
        color = '#0284c7';
      } else if (iga < 0.70) {
        nivel = 2;
        label = 'Medio';
        color = '#f97316';
      } else if (iga < 0.85) {
        nivel = 3;
        label = 'Alto';
        color = '#d97706';
      } else {
        nivel = 4;
        label = 'Muy Alto';
        color = '#dc2626';
      }

      return { nivel, label, color };
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

  // ===== EGEP-5 =====
  egep5: {
    criterios: {
      B: { nombre: 'Re-experimentación', items: [1, 2, 3, 4, 5] },
      C: { nombre: 'Evitación', items: [6, 7] },
      D: { nombre: 'Alteraciones cognitivas/afectivas', items: [8, 9, 10, 11, 12, 13, 14] },
      E: { nombre: 'Activación/Reactividad', items: [15, 16, 17, 18, 19, 20] },
      F: { nombre: 'Deterioro funcional', items: [21, 22] }
    },

    calcular(data) {
      const total = data.reduce((a, b) => a + b, 0);
      let nivel, label, color, texto;

      if (total < 21) {
        nivel = 0;
        label = 'Subcrínico';
        color = '#276749';
        texto = 'Síntomas por debajo del nivel de diagnóstico clínico.';
      } else if (total < 41) {
        nivel = 1;
        label = 'TEPT Leve';
        color = '#0284c7';
        texto = 'Síntomas de TEPT presentes con interferencia leve en funcionamiento.';
      } else if (total < 61) {
        nivel = 2;
        label = 'TEPT Moderado';
        color = '#d97706';
        texto = 'TEPT de severidad moderada. Se recomienda tratamiento especializado.';
      } else {
        nivel = 3;
        label = 'TEPT Severo';
        color = '#dc2626';
        texto = 'Síntomas severos de TEPT con deterioro importante. Evaluación urgente recomendada.';
      }

      return { nivel, label, color, texto, total };
    },

    obtenerDiagnosticoDSM5(data) {
      // Verificar criterios DSM-5
      const criterioB = data.slice(0, 5).some(v => v >= 1) ? 1 : 0;
      const criterioC = data.slice(5, 7).some(v => v >= 1) ? 1 : 0;
      const criterioD = data.slice(7, 14).filter(v => v >= 1).length >= 2 ? 1 : 0;
      const criterioE = data.slice(14, 20).filter(v => v >= 1).length >= 2 ? 1 : 0;
      const criterioF = data.slice(20, 22).some(v => v >= 1) ? 1 : 0;

      const cumplidos = [criterioB, criterioC, criterioD, criterioE, criterioF].filter(c => c).length;

      if (cumplidos === 5) {
        return { probable: true, texto: 'TEPT probable según criterios DSM-5' };
      } else {
        return { probable: false, texto: `Criterios incompletos: ${cumplidos}/5 presentes` };
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
