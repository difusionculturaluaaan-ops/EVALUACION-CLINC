/**
 * EGEP-5: Escala de Gravedad de TEPT (DSM-5)
 * 22 ítems, escala Likert 0-3
 */

const tests_egep5 = {
  nombre: 'EGEP-5',
  tipo: 'EGEP5',
  items: [
    'Re-experimentación: Recuerdos/flashbacks intrusivos del evento',
    'Re-experimentación: Pesadillas relacionadas con el evento',
    'Re-experimentación: Reacciones intensas a recordatorios',
    'Re-experimentación: Cambios físicos al recordar (sudoración, palpitaciones)',
    'Re-experimentación: Pensamientos intrusivos sobre el evento',
    'Evitación: Evita hablar sobre lo ocurrido',
    'Evitación: Evita lugares/personas que recuerdan el evento',
    'Alteraciones cognitivas: Culpa injustificada',
    'Alteraciones cognitivas: Creencias negativas sobre sí mismo',
    'Alteraciones cognitivas: Incapacidad para recordar detalles importantes',
    'Alteraciones cognitivas: Culpa extrema o autoculpa',
    'Alteraciones cognitivas: Cambios en creencias sobre el mundo',
    'Alteraciones cognitivas: Tendencia a culpar a otros',
    'Alteraciones cognitivas: Disminución de interés en actividades',
    'Alteraciones afectivas: Sentimientos de desapego',
    'Alteraciones afectivas: Incapacidad para sentir emociones positivas',
    'Activación: Hipervigilancia',
    'Activación: Respuesta de sobresalto exagerada',
    'Activación: Conducta temeraria o autodestructiva',
    'Activación: Concentración deficiente',
    'Activación: Irritabilidad o agresividad',
    'Activación: Problemas del sueño'
  ],

  init() {
    testRenderer.renderLikert04('egep5-container', this.items, 'egep5', ['Nada', 'Poco', 'Moderado', 'Bastante']);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('egep5-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('egep5', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('egep5', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('egep5', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const resultado = interpretacion.egep5.calcular(data);
    const diagnosticoD5 = interpretacion.egep5.obtenerDiagnosticoDSM5(data);

    return {
      total,
      ...resultado,
      diagnosticoDSM5: diagnosticoD5
    };
  }
};
