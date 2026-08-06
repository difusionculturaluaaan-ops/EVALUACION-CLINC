/**
 * TDS: Test de Trastornos del Sueño
 * 30 ítems, escala Likert 0-4, organizados en 10 factores
 */

const tests_tds = {
  nombre: 'TDS',
  tipo: 'TDS',

  factores: {
    F1: {
      nombre: 'F1: Somnolencia Excesiva Diurna',
      items: [
        'A pesar de haber dormido durante la noche, siente sueño durante el día.',
        'Se siente con sueño durante el día.',
        'Se siente cansado aunque haya dormido suficiente tiempo.',
        'Siente muchas ganas de dormir durante el día.',
        'Qué tan seguido ha sentido somnolencia excesiva durante el día.'
      ]
    },
    F2: {
      nombre: 'F2: Insomnio Intermedio e Insomnio Final',
      items: [
        'Se despierta dos o tres horas antes de lo acostumbrado y tiene dificultades para volver a dormir.',
        'Se despierta antes de su horario habitual y ya no se puede quedar dormido nuevamente.',
        'Se despierta durante la noche con dificultades para volver a dormir.',
        'Se despierta a mitad de la noche y no consigue volver a dormir.'
      ]
    },
    F3: {
      nombre: 'F3: Insomnio Inicial',
      items: [
        'Al acostarse, permanece despierto una hora o más antes de dormir.',
        'Tarda en quedarse dormido después de que se acuesta.',
        'Tiene dificultades para quedarse dormido.',
        'Tiene insomnio.'
      ]
    },
    F4: {
      nombre: 'F4: Apnea del Sueño',
      items: [
        'Se sofoca o se atraganta mientras duerme.',
        'Ha sentido que se detiene su respiración mientras duerme.',
        'Ha sentido dificultad para respirar en las noches.'
      ]
    },
    F5: {
      nombre: 'F5: Parálisis del Dormir, Enuresis y Bruxismo',
      items: [
        'Ha sentido que no puede moverse o se siente paralizado al empezar a despertarse.',
        'Se orina en la cama.',
        'Rechinan los dientes cuando está dormido.'
      ]
    },
    F6: {
      nombre: 'F6: Sonambulismo y Somniloquio',
      items: [
        'Le han comentado que camina dormido.',
        'Ha presentado sonambulismo.',
        'Habla dormido.'
      ]
    },
    F7: {
      nombre: 'F7: Roncar',
      items: [
        'Le han comentado que ronca mientras duerme.',
        'Ronca.'
      ]
    },
    F8: {
      nombre: 'F8: Piernas Inquietas y Pesadillas',
      items: [
        'Por la noche me duelen las piernas o se me acalambren.',
        'Cuando intenta dormir siente dolor o cosquilleo en las piernas.',
        'Tiene pesadillas.'
      ]
    },
    F9: {
      nombre: 'F9: Uso de Medicamentos',
      items: [
        'Consume medicamentos que le quitan el sueño.',
        'Consume medicamentos para conciliar el sueño.'
      ]
    },
    F10: {
      nombre: 'F10: Parálisis al Dormir',
      items: [
        'Ha sentido que no puede moverse o se siente paralizado al empezar a dormir.'
      ]
    }
  },

  init() {
    const container = document.getElementById('tds-container');
    container.innerHTML = '';
    container.className = 'test-items';

    let numeroItem = 1;
    const opciones = ['Nada', 'Un poco', 'Moderado', 'Bastante', 'Mucho'];

    for (const [factorKey, factor] of Object.entries(this.factores)) {
      const factorDiv = document.createElement('div');
      factorDiv.className = 'factor-section';
      factorDiv.innerHTML = `<h3 class="factor-title">${factor.nombre}</h3>`;

      factor.items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'test-item';
        itemDiv.innerHTML = `
          <div class="test-item-text">
            <span class="test-item-number">${numeroItem}.</span> ${item}
          </div>
          <div class="opciones">
            ${[0, 1, 2, 3, 4].map(value => `
              <label class="opcion-label">
                <input type="radio" name="tds_r${numeroItem - 1}" value="${value}">
                <span class="opcion-box">${opciones[value]}</span>
              </label>
            `).join('')}
          </div>
        `;
        factorDiv.appendChild(itemDiv);
        numeroItem++;
      });

      container.appendChild(factorDiv);
    }

    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('tds-container')?.addEventListener('change', () => {
      const totalItems = Object.values(this.factores).reduce((sum, f) => sum + f.items.length, 0);
      testRenderer.actualizarProgreso('tds', totalItems);
    });
  },

  obtenerRespuestas() {
    const totalItems = Object.values(this.factores).reduce((sum, f) => sum + f.items.length, 0);
    const respuestas = [];
    for (let i = 0; i < totalItems; i++) {
      const input = document.querySelector(`input[name="tds_r${i}"]:checked`);
      respuestas.push(input ? parseInt(input.value) : null);
    }
    return respuestas;
  },

  validar() {
    const totalItems = Object.values(this.factores).reduce((sum, f) => sum + f.items.length, 0);
    const respuestas = this.obtenerRespuestas();
    return respuestas.every(r => r !== null);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const resultado = interpretacion.tds.calcular(data, this.factores);
    return resultado;
  }
};
