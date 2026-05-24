/**
 * Escala Hamilton de Depresión (HAM-D 17)
 * 17 ítems con opciones específicas
 */

const tests_hamilton = {
  nombre: 'Hamilton',
  tipo: 'HAMILTON',
  items: [
    {
      q: '1. Humor deprimido',
      opts: ['Ausente', 'Si preguntan', 'Espontáneo', 'No verbal', 'Verbal/No verbal']
    },
    {
      q: '2. Sentimiento de culpa',
      opts: ['Ausente', 'Diferente de lo normal', 'Ideas de culpabilidad', 'Castigo merecido', 'Alucinaciones de culpa']
    },
    {
      q: '3. Suicidio',
      opts: ['Ausente', 'Sin valor', 'Deseo de morir', 'Amenazas', 'Intentos']
    },
    {
      q: '4. Insomnio inicial (dificultad para dormir)',
      opts: ['Ausente', 'Dificultad ocasional', 'Dificultad frecuente']
    },
    {
      q: '5. Insomnio intermedio (despertares nocturnos)',
      opts: ['Ausente', 'No queja significativa', 'Se queja de inquietud durante la noche', 'Se despierta frecuentemente']
    },
    {
      q: '6. Insomnio tardío (despertar matutino)',
      opts: ['Ausente', 'Despertar matutino ocasional', 'Despertar matutino frecuente']
    },
    {
      q: '7. Trabajo y actividades',
      opts: ['Ausente', 'Fatiga leve', 'Interés disminuido', 'Productividad reducida', 'Dejó de trabajar']
    },
    {
      q: '8. Enlentecimiento (pensamiento y lenguaje)',
      opts: ['Ausente', 'Retraso ligero', 'Evidente', 'Expresión lentificada', 'Incapacidad para comunicarse']
    },
    {
      q: '9. Agitación',
      opts: ['Ausente', 'Fidgetismo', 'Juguetea con las manos', 'Inquieto en la silla', 'Sale y entra constantemente']
    },
    {
      q: '10. Ansiedad psiquiátrica',
      opts: ['Ausente', 'Tensión leve', 'Preocupación por pequeñeces', 'Expresión aprensiva', 'Temores expresados sin preguntar']
    },
    {
      q: '11. Ansiedad somática',
      opts: ['Ausente', 'Ligera', 'Moderada', 'Severa', 'Incapacitante']
    },
    {
      q: '12. Síntomas gastrointestinales',
      opts: ['Ausente', 'Pérdida de apetito o constipación', 'Requiere laxante o medicamento']
    },
    {
      q: '13. Síntomas somáticos generales',
      opts: ['Ausente', 'Pesadez en extremidades', 'Pérdida de energía visible']
    },
    {
      q: '14. Síntomas genitales',
      opts: ['Ausente', 'Débil', 'Grave']
    },
    {
      q: '15. Hipocondría',
      opts: ['Ausente', 'Preocupación corporal', 'Preocupación por salud', 'Lamentos frecuentes', 'Delirios sobre la salud']
    },
    {
      q: '16. Pérdida de peso',
      opts: ['Ausente', 'Pérdida menor de 500g', 'Pérdida mayor de 1kg']
    },
    {
      q: '17. Insight (conciencia de la enfermedad)',
      opts: ['Completo', 'Reconoce causas externas', 'No reconoce enfermedad']
    }
  ],

  init() {
    testRenderer.renderHamilton('ham-container', this.items);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('ham-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('ham', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('ham', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('ham', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const calculo = interpretacion.hamD17.calcular(total);
    return { total, ...calculo };
  }
};
