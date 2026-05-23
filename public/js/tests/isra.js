/**
 * ISRA: Inventario de Situaciones y Respuestas de Ansiedad
 * 56 ítems (simplificado), escala Likert 0-4
 */

const tests_isra = {
  nombre: 'ISRA',
  tipo: 'ISRA',
  items: Array.from({ length: 56 }, (_, i) => `Situación / Respuesta ${i + 1}`),

  init() {
    testRenderer.renderLikert04('isra-container', this.items, 'isra', ['Nada', 'Poco', 'Moderado', 'Bastante', 'Mucho']);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('isra-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('isra', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('isra', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('isra', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const IGA = total / (this.items.length * 4); // Índice General de Ansiedad normalizado

    const interpretacion = interpretacion.isra.interpretarIGA(IGA);

    return {
      total,
      IGA: IGA.toFixed(2),
      ...interpretacion
    };
  }
};
