/**
 * TDS: Test de Trastornos del Sueño
 * 30 ítems, escala Likert 0-4
 */

const tests_tds = {
  nombre: 'TDS',
  tipo: 'TDS',
  items: [
    'Sueno durante el día', 'Cansancio o fatiga', 'Ganas o necesidad de dormir',
    'Somnolencia', 'Sueño después de dormir', 'Despierta muy temprano',
    'Vuelve a dormir después de despertar', 'Despierta durante la noche', 'No concilia el sueño',
    'Tarda más de 1 hora en conciliar el sueño', 'Dificultad para iniciar el sueño', 'Insomnio al acostarse',
    'Dificultad general del sueño', 'Sofocación o sensación de ahogo', 'Problemas respiratorios',
    'Dificultad para respirar', 'Parálisis al despertar', 'Enuresis nocturna (orinarse en la cama)',
    'Rechina los dientes', 'Camina mientras duerme', 'Comportamiento sonambulista',
    'Habla mientras duerme', 'Dice que ronca', 'Ronquido fuerte',
    'Dolor en las piernas', 'Cosquilleo en las extremidades', 'Pesadillas',
    'Estimulantes (café, té)', 'Hipnóticos o sedantes', 'Parálisis al iniciar el sueño'
  ],

  init() {
    testRenderer.renderLikert04('tds-container', this.items, 'tds');
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('tds-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('tds', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('tds', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('tds', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const resultado = interpretacion.tds.calcular(data);
    return { total, ...resultado };
  }
};
