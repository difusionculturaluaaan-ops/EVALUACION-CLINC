/**
 * Renderizador genérico para tests de opción múltiple
 */

const testRenderer = {
  /**
   * Renderizar items de test Likert 0-4 (SCL-90-R, TDS, ISRA, EGEP-5)
   */
  renderLikert04(containerId, items, prefix, opciones = ['Nada', 'Un poco', 'Moderado', 'Bastante', 'Mucho']) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    container.innerHTML = items.map((texto, i) => `
      <div class="test-item" data-item="${i}">
        <div class="test-item-text">
          <span class="test-item-number">${i + 1}.</span> ${texto}
        </div>
        <div class="opciones">
          ${[0, 1, 2, 3, 4].map(v => `
            <label class="opcion-label">
              <input type="radio" name="${prefix}_r${i}" value="${v}">
              <span class="opcion-box">${opciones[v]}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Agregar listeners para actualizar progreso
    this.agregarListenersProgreso(prefix, items.length);
  },

  /**
   * Renderizar items de Hamilton (opciones complejas)
   */
  renderHamilton(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    container.innerHTML = items.map((item, i) => `
      <div class="test-item" data-item="${i}">
        <div class="test-item-text">
          <span class="test-item-number">${i + 1}.</span> ${item.q}
        </div>
        <div class="ham-opciones">
          ${item.opts.map((opt, v) => `
            <label class="opcion-label">
              <input type="radio" name="ham_r${i}" value="${v}">
              <span class="opcion-box"><strong>${v}</strong> - ${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    this.agregarListenersProgreso('ham', items.length);
  },

  /**
   * Renderizar MMPI-2 (entrada de T-scores)
   */
  renderMMPI2(containerId, escalas) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    // Separar validez y clínicas
    const escalasValidez = escalas.filter(e => ['L', 'F', 'K'].includes(e.id));
    const escalasClinicas = escalas.filter(e => !['L', 'F', 'K'].includes(e.id));

    let html = '<div class="mmpi-seccion"><h3>Escalas de Validez</h3>';
    html += '<div class="mmpi-grid">';
    escalasValidez.forEach(escala => {
      html += `
        <div class="form-group">
          <label for="mmpi_${escala.id}">${escala.nombre}</label>
          <input type="number" id="mmpi_${escala.id}" class="mmpi-input" min="0" max="100" placeholder="T-score" data-escala="${escala.id}">
        </div>
      `;
    });
    html += '</div></div>';

    html += '<div class="mmpi-seccion"><h3>Escalas Clínicas</h3>';
    html += '<div class="mmpi-grid">';
    escalasClinicas.forEach(escala => {
      html += `
        <div class="form-group">
          <label for="mmpi_${escala.id}">${escala.nombre}</label>
          <input type="number" id="mmpi_${escala.id}" class="mmpi-input" min="0" max="120" placeholder="T-score" data-escala="${escala.id}">
        </div>
      `;
    });
    html += '</div></div>';

    container.innerHTML = html;
  },

  /**
   * Renderizar PCL-R
   */
  renderPCLR(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    container.innerHTML = items.map((item, i) => `
      <div class="test-item" data-item="${i}">
        <div class="test-item-text">
          <span class="test-item-number">${i + 1}.</span> ${item.texto}
        </div>
        <div class="opciones">
          <label class="opcion-label">
            <input type="radio" name="pclr_r${i}" value="1">
            <span class="opcion-box">Nunca (1)</span>
          </label>
          <label class="opcion-label">
            <input type="radio" name="pclr_r${i}" value="2">
            <span class="opcion-box">Parcialmente (2)</span>
          </label>
          <label class="opcion-label">
            <input type="radio" name="pclr_r${i}" value="3">
            <span class="opcion-box">Muchas veces (3)</span>
          </label>
        </div>
      </div>
    `).join('');

    this.agregarListenersProgreso('pclr', items.length);
  },

  /**
   * Agregrar listeners para actualizar barra de progreso
   */
  agregarListenersProgreso(prefix, total) {
    const container = document.getElementById(this.getContainerId(prefix));
    if (!container) return;

    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.actualizarProgreso(prefix, total);
      });
    });
  },

  /**
   * Actualizar barra de progreso
   */
  actualizarProgreso(prefix, total) {
    const respondidos = this.contarRespondidos(prefix, total);
    const porcentaje = (respondidos / total) * 100;

    const progressBar = document.getElementById(`${prefix}-progress`);
    const progressText = document.getElementById(`${prefix}-counter`);

    if (progressBar) progressBar.style.width = `${porcentaje}%`;
    if (progressText) progressText.textContent = `${respondidos} / ${total}`;
  },

  /**
   * Contar items respondidos
   */
  contarRespondidos(prefix, total) {
    let count = 0;
    for (let i = 0; i < total; i++) {
      const sel = document.querySelector(`input[name="${prefix}_r${i}"]:checked`);
      if (sel) count++;
    }
    return count;
  },

  /**
   * Validar que todos los ítems tengan respuesta
   */
  validarCompleto(prefix, total) {
    const sinResponder = [];
    for (let i = 0; i < total; i++) {
      const sel = document.querySelector(`input[name="${prefix}_r${i}"]:checked`);
      if (!sel) sinResponder.push(i + 1);
    }
    return sinResponder;
  },

  /**
   * Obtener respuestas como array
   */
  obtenerRespuestas(prefix, total) {
    const data = [];
    for (let i = 0; i < total; i++) {
      const sel = document.querySelector(`input[name="${prefix}_r${i}"]:checked`);
      data.push(sel ? parseInt(sel.value) : null);
    }
    return data;
  },

  /**
   * Renderizar items Sí/No (SCID-II y similares)
   */
  renderYesNo(containerId, items, prefix) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    container.innerHTML = items.map((texto, i) => `
      <div class="test-item" data-item="${i}">
        <div class="test-item-text">
          <span class="test-item-number">${i + 1}.</span> ${texto}
        </div>
        <div class="opciones-binarias">
          <label class="opcion-label">
            <input type="radio" name="${prefix}_r${i}" value="1">
            <span class="opcion-box">Sí</span>
          </label>
          <label class="opcion-label">
            <input type="radio" name="${prefix}_r${i}" value="0">
            <span class="opcion-box">No</span>
          </label>
        </div>
      </div>
    `).join('');

    this.agregarListenersProgreso(prefix, items.length);
  },

  /**
   * Mapeo de prefijo a container ID
   */
  getContainerId(prefix) {
    const mapa = {
      'scl': 'scl-container',
      'ham': 'ham-container',
      'tds': 'tds-container',
      'isra': 'isra-container',
      'isra-f': 'isra-f-container',
      'isra-m': 'isra-m-container',
      'pclr': 'pclr-container',
      'egep5': 'egep5-container',
      'scid2': 'scid2-container'
    };
    return mapa[prefix] || '';
  }
};
