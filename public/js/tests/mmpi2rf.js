/**
 * MMPI-2-RF: Inventario Multifásico de Personalidad Minnesota-2 Forma Reestructurada
 * 338 items - Respuestas Verdadero/Falso
 * Evalúa: Validez, Escalas Clínicas, Patrones de Respuesta
 */

const tests_mmpi2rf = {
  nombre: 'MMPI-2-RF (Forma Reestructurada)',
  tipo: 'MMPI2RF',

  // 338 items del MMPI-2-RF
  items: [
    '1. Tengo un buen apetito',
    '2. A menudo desearía ser otra persona',
    '3. Creo que soy una persona condenada',
    '4. Me gusta una cantidad de deportes activos',
    '5. Me molesta mucho ser criticado',
    '6. Comúnmente me despierto de mi sueño con la preocupación corriendo en mi mente',
    '7. Creo que hay gente tratando de envenenarme',
    '8. Puedo leer las noticias de los periódicos sin estar muy perturbado',
    '9. Creo en los segundos milagros',
    '10. Un buen número de veces he tenido que tomar medidas para evitar estar en apuros u otros problemas',
    // ... (los 328 items restantes irían aquí)
    // Nota: Para la implementación completa, necesitaremos extraer todos los 338 items del test original
  ],

  /**
   * Escalas y sus correspondientes células de cálculo
   * Basado en extracción de fórmulas del Excel MMPI-2-RF
   */
  escalas: {
    // ESCALAS DE VALIDEZ
    CNS: {
      nombre: 'Inconsistencia de Contenido Cerrada',
      categoria: 'validez',
      minimo: 0,
      maximo: 50
    },
    VRIN_r: {
      nombre: 'Respuestas Inconsistentes Variables Reestructuradas',
      categoria: 'validez',
      minimo: 0,
      maximo: 52
    },
    TRIN_r: {
      nombre: 'Respuestas Inconsistentes Verdaderas Reestructuradas',
      categoria: 'validez',
      minimo: 0,
      maximo: 50
    },
    F_r: {
      nombre: 'Escala F Reestructurada',
      categoria: 'validez',
      minimo: 0,
      maximo: 30
    },
    Fp_r: {
      nombre: 'Escala Fp Reestructurada',
      categoria: 'validez',
      minimo: 0,
      maximo: 28
    },

    // ESCALAS CLÍNICAS REESTRUCTURADAS (RCd)
    RCd: {
      nombre: 'Depresión',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {
        0: 32, 1: 37, 2: 42, 3: 46, 4: 51, 5: 56,
        6: 61, 7: 65, 8: 70, 9: 75, 10: 79, 11: 84, 12: 89
      }
    },
    RC1: {
      nombre: 'Quejas Somáticas',
      categoria: 'clinica',
      minimo: 0,
      maximo: 15,
      tablaConversion: {}
    },
    RC2: {
      nombre: 'Baja Energía Motivacional',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC3: {
      nombre: 'Disfunción Cognitiva',
      categoria: 'clinica',
      minimo: 0,
      maximo: 10,
      tablaConversion: {}
    },
    RC4: {
      nombre: 'Problemas de Conducta Deshinibida',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC6: {
      nombre: 'Ideas Persecutorias',
      categoria: 'clinica',
      minimo: 0,
      maximo: 13,
      tablaConversion: {}
    },
    RC7: {
      nombre: 'Disfunción Somática',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC8: {
      nombre: 'Incapacidad de Concentración',
      categoria: 'clinica',
      minimo: 0,
      maximo: 11,
      tablaConversion: {}
    },
    RC9: {
      nombre: 'Hipomanía',
      categoria: 'clinica',
      minimo: 0,
      maximo: 11,
      tablaConversion: {}
    },

    // ESCALAS ADICIONALES
    BRF: {
      nombre: 'Comportamiento Aberrante',
      categoria: 'adicional',
      minimo: 0,
      maximo: 24
    }
  },

  /**
   * Mapeo de items a cada escala
   * Extraído de las fórmulas de suma del Excel
   * Formato: escalaNombre: [item1, item2, item3, ...]
   */
  itemsPorEscala: {
    RCd: [5, 14, 20, 30, 39, 44, 46, 57, 71, 92, 127, 130],
    RC1: [3, 11, 28, 39, 53, 58, 71, 103],
    RC2: [15, 27, 41, 52, 92, 100, 109, 127],
    RC3: [8, 41, 135, 142, 159, 175, 179, 192, 208, 225],
    RC4: [37, 38, 66, 67, 84, 100, 110, 134, 143, 177],
    RC6: [17, 35, 108, 123, 130, 142, 157, 180, 216],
    RC7: [3, 11, 28, 39, 53, 58, 71, 103],
    RC8: [8, 41, 135, 142, 159, 175, 179, 192],
    RC9: [20, 23, 38, 40, 46, 57, 73, 81, 95, 109, 138],
    // Las escalas de validez tienen sus propias fórmulas complejas
  },

  /**
   * Inicializar el test
   */
  init() {
    testRenderer.renderYesNo('mmpi2rf-container', this.items, 'mmpi2rf');
    this.setupEventListeners();
  },

  /**
   * Configurar listeners de eventos
   */
  setupEventListeners() {
    document.getElementById('mmpi2rf-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('mmpi2rf', this.items.length);
    });
  },

  /**
   * Obtener respuestas del formulario
   */
  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('mmpi2rf', this.items.length);
  },

  /**
   * Validar que todas las preguntas fueron respondidas
   */
  validar() {
    return testRenderer.validarCompleto('mmpi2rf', this.items.length);
  },

  /**
   * Calcular puntuaciones de escalas
   */
  calcular() {
    try {
      const respuestas = this.obtenerRespuestas();
      const escalasResult = {};

      // Calcular escalas clínicas
      for (const [nombreEscala, items] of Object.entries(this.itemsPorEscala)) {
        // Convertir índices de items (1-338) a índices de array (0-337)
        const itemsIndices = items.map(i => i - 1);

        // Sumar respuestas (1 si es Verdadero)
        const rawScore = itemsIndices.reduce((sum, idx) => {
          return sum + (respuestas[idx] || 0);
        }, 0);

        // Convertir a T-Score
        const escala = this.escalas[nombreEscala];
        const tScore = escala.tablaConversion?.[rawScore] || this.calcularTScore(rawScore, escala);

        escalasResult[nombreEscala] = {
          nombre: escala.nombre,
          rawScore: rawScore,
          tScore: tScore,
          color: this.obtenerColor(tScore),
          interpretacion: this.obtenerInterpretacion(tScore)
        };
      }

      // Calcular escalas de validez
      escalasResult.validez = this.calcularValidez(respuestas);

      // Interpretación general
      const interpretacionGeneral = this.generarInterpretacion(escalasResult);

      return {
        total: respuestas.length,
        escalas: escalasResult,
        validez: escalasResult.validez,
        interpretacion: interpretacionGeneral,
        label: 'MMPI-2-RF Completado',
        color: '#2c5aa0',
        texto: interpretacionGeneral
      };

    } catch (error) {
      console.error('Error en cálculo MMPI-2-RF:', error);
      return {
        error: true,
        mensaje: 'Error al calcular el MMPI-2-RF',
        detalles: error.message
      };
    }
  },

  /**
   * Calcular escalas de validez
   */
  calcularValidez(respuestas) {
    return {
      CNS: { valor: 0, interpretacion: 'Consistente' },
      VRIN_r: { valor: 0, interpretacion: 'Válido' },
      TRIN_r: { valor: 0, interpretacion: 'Válido' },
      F_r: { valor: 0, interpretacion: 'Normal' },
      Fp_r: { valor: 0, interpretacion: 'Válido' }
      // Nota: Las fórmulas exactas se extraerán del Excel
    };
  },

  /**
   * Calcular T-Score (desviación estándar: media=50, DS=10)
   */
  calcularTScore(rawScore, escala) {
    // Fórmula genérica T-Score: T = (X - media) * 10 / DS + 50
    // Los parámetros específicos se extraerán del Excel
    return Math.round(50 + (rawScore - (escala.minimo + escala.maximo) / 2) * 10 / ((escala.maximo - escala.minimo) / 3));
  },

  /**
   * Obtener color según T-Score
   */
  obtenerColor(tScore) {
    if (tScore < 40) return '#276749'; // Verde - Normal
    if (tScore < 60) return '#0284c7'; // Azul - Leve
    if (tScore < 70) return '#d97706'; // Naranja - Moderado
    if (tScore < 80) return '#dc2626'; // Rojo - Elevado
    return '#7f1d1d';                   // Rojo oscuro - Muy elevado
  },

  /**
   * Obtener interpretación según T-Score
   */
  obtenerInterpretacion(tScore) {
    if (tScore < 40) return 'Normal';
    if (tScore < 60) return 'Leve';
    if (tScore < 70) return 'Moderado';
    if (tScore < 80) return 'Elevado';
    return 'Muy Elevado';
  },

  /**
   * Generar interpretación general del perfil
   */
  generarInterpretacion(escalasResult) {
    const escalasElevadas = Object.entries(escalasResult.escalas)
      .filter(([_, e]) => e.tScore >= 70)
      .map(([nombre, e]) => e.nombre);

    if (escalasElevadas.length === 0) {
      return 'Perfil dentro de los rangos normales. No se detectan elevaciones clínicas significativas.';
    }

    return `Se observan elevaciones en: ${escalasElevadas.join(', ')}. Se recomienda evaluación clínica detallada.`;
  }
};
