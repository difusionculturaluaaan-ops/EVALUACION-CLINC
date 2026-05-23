/**
 * PCL-R: Hare Psychopathy Checklist - Revised
 * 20 ítems, escala 0-2
 */

const tests_pclr = {
  nombre: 'PCL-R',
  tipo: 'PCLR',
  items: [
    { id: 1, texto: 'Siento que soy una persona encantadora hacia los demás' },
    { id: 2, texto: 'Creo que valgo más que las otras personas' },
    { id: 3, texto: 'Tengo tendencia al aburrimiento, necesito estimularme constantemente' },
    { id: 4, texto: 'No puedo evitarlo, miento en muchas ocasiones de manera constante e incluso patológica' },
    { id: 5, texto: 'Siento un cierto nivel de bienestar cuando soy el/la líder y manipulo a los demás' },
    { id: 6, texto: 'No suelo sentir ni culpa ni remordimientos' },
    { id: 7, texto: 'Cuando siento algún tipo de emoción, no suele ser muy profunda' },
    { id: 8, texto: 'Siento que puedo llegar a ser muy insensible y me cuesta tener empatía hacia los demás' },
    { id: 9, texto: 'Me cuesta admitirlo, pero suelo relacionarme con los demás para sacar algún tipo de provecho' },
    { id: 10, texto: 'Cuando me pongo nervioso/a me cuesta mucho controlarme y puedo llegar a estallar en cualquier momento' },
    { id: 11, texto: 'Considero que mi conducta sexual es bastante promiscua' },
    { id: 12, texto: 'Me cuesta controlar mis impulsos' },
    { id: 13, texto: 'Siento que no tengo metas realistas a largo plazo' },
    { id: 14, texto: 'Me considero una persona que actúa antes de pensar en las consecuencias' },
    { id: 15, texto: 'Me cuesta asumir responsabilidades externas' },
    { id: 16, texto: 'Siento que soy incapaz de aceptar la responsabilidad de mis propias acciones' },
    { id: 17, texto: 'Mis relaciones amorosas han sido relativamente cortas' },
    { id: 18, texto: 'Cuando era más joven, habría sido un delincuente menor' },
    { id: 19, texto: 'He abusado de drogas o alcohol en algún momento de mi vida' },
    { id: 20, texto: 'He tenido conductas criminales de distinta naturaleza' }
  ],

  init() {
    this.mostrarAdvertencia();
    testRenderer.renderPCLR('pclr-container', this.items);
    this.setupEventListeners();
  },

  mostrarAdvertencia() {
    const warning = document.querySelector('.warning-banner');
    if (warning) {
      warning.innerHTML = `⚠️ <strong>Nota importante:</strong> El PCL-R es una herramienta de evaluación restringida. Solo profesionales entrenados en su administración pueden completarla. Los T-scores se basan en evaluación clínica estructurada, no en autorreporte.`;
    }
  },

  setupEventListeners() {
    document.getElementById('pclr-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('pclr', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('pclr', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('pclr', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const resultado = interpretacion.pclr.calcular(data);

    return { total, ...resultado };
  }
};
