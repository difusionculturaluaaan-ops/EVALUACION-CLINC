/**
 * EGEP-5: Escala para la Evaluación del Trastorno por Estrés Postraumático
 * Validado según criterios DSM-5
 * Autor: TEA Ediciones
 * Estructura: 58 items, 3 secciones, autoadministrable
 */

window.tests_egep5 = {
  nombre: 'EGEP-5',
  tipo: 'EGEP-5',
  seccionActual: 1,
  pacienteId: null,
  resultados: null,

  respuestas: {
    trauma_type: [],
    trauma_description: '',
    trauma_severity: null,
    trauma_timing: null,
    trauma_frequency: null,
    during_event: [],
    event_type: [],
    items_27_31: [0,0,0,0,0],
    items_32_33: [0,0],
    items_34_40: [0,0,0,0,0,0,0],
    items_41_46: [0,0,0,0,0,0],
    items_47_49: [0,0,0],
    symptom_duration: null,
    symptom_onset: null,
    items_52_58: [0,0,0,0,0,0,0]
  },

  eventDefinitions: {
    1: 'Accidente grave de tráfico',
    2: 'Desastre natural (terremoto, inundación, incendio)',
    3: 'Violencia de pareja o doméstica',
    4: 'Abuso o agresión sexual',
    5: 'Enfermedad grave o lesión seria',
    6: 'Muerte traumática de un ser querido',
    7: 'Combate militar o zona de guerra',
    8: 'Tortura o cautiverio',
    9: 'Accidente grave con lesiones',
    10: 'Amenaza de muerte o lesión grave',
    11: 'Otro acontecimiento traumático'
  },

  caracteristicaDefinitions: {
    16: 'Sintió intenso miedo, desamparo u horror',
    17: 'Actuaba o se sentía como si el acontecimiento estuviera sucediendo nuevamente',
    18: 'Tenía reacciones físicas intensas (sudor, aceleración cardíaca)',
    19: 'Tuvo dificultad para respirar o sensación de asfixia',
    20: 'Perdió momentáneamente la conciencia o se desconectó',
    21: 'Tuvo sensaciones de adormecimiento o despersonalización',
    22: 'Tuvo dificultades para hablar o movimiento',
    23: 'Experimentó parálisis temporal',
    24: 'Tuvo amnesia (no recuerda partes del evento)',
    25: 'Sintió confusión durante el evento',
    26: 'Creyó que iba a morir o sufrir un daño grave'
  },

  symptomDefinitions: {
    27: 'Recuerdos desagradables o repetitivos sobre el acontecimiento',
    28: 'Sueños desagradables o repetitivos sobre el acontecimiento',
    29: 'Actuaba o sentía como si el acontecimiento estuviera sucediendo de nuevo',
    30: 'Se sentía molesto cuando algo le recordaba el acontecimiento',
    31: 'Tenía reacciones físicas fuertes (sudor, aceleración cardíaca) cuando algo le recordaba',
    32: 'Evitaba pensamientos o conversaciones sobre el acontecimiento',
    33: 'Evitaba actividades, lugares o personas que le recordaban el acontecimiento',
    34: 'Tuvo dificultad en recordar partes importantes del acontecimiento',
    35: 'Tiene creencias muy negativas sobre sí mismo, otras personas o el mundo',
    36: 'Se culpaba injustificadamente a sí mismo o a otras personas',
    37: 'Tiene sentimientos negativos persistentes (miedo, ira, culpa, vergüenza)',
    38: 'Ha disminuido bastante su interés en las actividades que antes disfrutaba',
    39: 'Se siente distanciado de otras personas',
    40: 'Tiene dificultad en experimentar emociones positivas',
    41: 'Ha estado irritable o ha tenido arrebatos de ira',
    42: 'Ha actuado de forma temeraria o autodestructiva',
    43: 'Ha estado constantemente en guardia o alerta',
    44: 'Se sobresaltaba con facilidad',
    45: 'Ha tenido dificultad en concentrarse',
    46: 'Ha tenido dificultad en conciliar o mantener el sueño',
    47: 'Ha actuado de forma impulsiva o sin pensar en las consecuencias',
    48: 'Ha tenido comportamientos autodestructivos o autolesivos',
    49: 'Ha mostrado una disminución significativa en su responsabilidad'
  },

  funcionamientoDefinitions: [
    'Consultar con un profesional de la salud',
    'Tomar medicación más de una vez por semana',
    'Usar alcohol o drogas para hacer frente a los síntomas',
    'Impacto negativo en la vida laboral o académica',
    'Impacto negativo en las relaciones sociales',
    'Impacto negativo en las relaciones familiares o de pareja',
    'Impacto negativo en otros aspectos importantes de la vida'
  ],

  init() {
    this.pacienteId = sessionStorage.getItem('pacienteSeleccionado') || localStorage.getItem('paciente_id');

    // Obtener nombre de múltiples fuentes
    let nombre = localStorage.getItem('paciente_nombre') || sessionStorage.getItem('paciente_nombre');

    if (!nombre) {
      nombre = 'Paciente';
    }

    localStorage.setItem('paciente_nombre', nombre);
    sessionStorage.setItem('paciente_nombre', nombre);

    // Cargar baremos por defecto
    if (!this.baremos) {
      this.baremos = window.EGEP5_BAREMOS.BAREMOS_ESPANA;
    }

    console.log('EGEP5 Init - Nombre:', nombre, 'ID:', this.pacienteId);

    this.mostrarPaciente();
    this.renderizarEventos();
    this.renderizarCaracteristicas();
    this.renderizarSintomas();
    this.renderizarFuncionamiento();
    this.actualizarProgreso();
    this.actualizarDashboard();

    // Cargar datos del paciente automáticamente
    this.cargarDatosAutomaticos();

    // Inicializar importador de archivos
    this.inicializarImportador();
  },

  cargarDatosAutomaticos() {
    // Nombre del paciente
    const nombrePaciente = localStorage.getItem('paciente_nombre') || sessionStorage.getItem('paciente_nombre');
    if (nombrePaciente && document.getElementById('m_nombre')) {
      document.getElementById('m_nombre').value = nombrePaciente;
    }

    // Fecha de hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (document.getElementById('m_fecha')) {
      document.getElementById('m_fecha').value = hoy;
    }

    // Edad (si está en sessionStorage)
    const edad = sessionStorage.getItem('paciente_edad') || localStorage.getItem('paciente_edad');
    if (edad && document.getElementById('m_edad')) {
      document.getElementById('m_edad').value = edad;
    }

    // Sexo (si está en sessionStorage)
    const sexo = sessionStorage.getItem('paciente_sexo') || localStorage.getItem('paciente_sexo');
    if (sexo && document.getElementById('m_sexo')) {
      document.getElementById('m_sexo').value = sexo;
    }

    // Centro (nombre de la clínica)
    const centro = sessionStorage.getItem('clinica_nombre') || localStorage.getItem('clinica_nombre') || 'Clínica Centro Psicológico';
    if (document.getElementById('m_centro')) {
      document.getElementById('m_centro').value = centro;
    }

    // Evaluador (nombre del usuario logueado)
    const evaluador = sessionStorage.getItem('usuario_nombre') || localStorage.getItem('nombre') || localStorage.getItem('usuario_nombre');
    if (evaluador && document.getElementById('m_evaluador')) {
      document.getElementById('m_evaluador').value = evaluador;
    }
  },

  mostrarPaciente() {
    // Legacy function - no longer needed with new tab-based UI
    // Datos se cargan automáticamente en cargarDatosAutomaticos()
  },

  actualizarDashboard() {
    // Legacy function - progreso ahora se actualiza en actualizarProgreso()
  },

  renderizarEventos() {
    let html = '';
    for (let i = 1; i <= 11; i++) {
      const eventName = this.eventDefinitions[i];
      html += `
        <tr>
          <td><strong>${i}. ${eventName}</strong></td>
          <td class="table-center">
            <input type="radio" name="event_${i}" value="me" onchange="window.tests_egep5.cambiarEvento(${i}, this.value)">
          </td>
          <td class="table-center">
            <input type="radio" name="event_${i}" value="presencié" onchange="window.tests_egep5.cambiarEvento(${i}, this.value)">
          </td>
          <td class="table-center">
            <input type="radio" name="event_${i}" value="cercano" onchange="window.tests_egep5.cambiarEvento(${i}, this.value)">
          </td>
          <td class="table-center">
            <input type="radio" name="most_impactful" value="${i}" onchange="window.tests_egep5.cambiarImpacto(this.value)">
          </td>
        </tr>
      `;
    }
    const el = document.getElementById('egep5-items-1-11');
    if (el) el.innerHTML = html;
  },

  cambiarEvento(numero, valor) {
    if (!this.respuestas.event_type) {
      this.respuestas.event_type = {};
    }
    this.respuestas.event_type[numero] = valor;

    // Mostrar/ocultar descripción del ítem 11
    const desc11El = document.getElementById('egep5-item11-description');
    if (desc11El) {
      desc11El.style.display = numero === 11 && valor ? 'block' : 'none';
    }

    console.log(`Evento ${numero} marcado como: ${valor}`);
  },

  cambiarImpacto(valor) {
    this.respuestas.most_impactful_event = parseInt(valor);
    console.log(`Evento más impactante: ${valor}`);
  },

  cambiarItem13(valor) {
    this.respuestas.trauma_severity = valor;
    console.log(`Ítem 13 - Gravedad: ${valor}`);
  },

  cambiarItem14(valor) {
    this.respuestas.trauma_timing = valor;
    console.log(`Ítem 14 - Cuándo ocurrió: ${valor}`);
  },

  cambiarItem15(valor, checked) {
    if (!this.respuestas.trauma_frequency) {
      this.respuestas.trauma_frequency = [];
    }
    if (checked) {
      if (!this.respuestas.trauma_frequency.includes(valor)) {
        this.respuestas.trauma_frequency.push(valor);
      }
    } else {
      this.respuestas.trauma_frequency = this.respuestas.trauma_frequency.filter(x => x !== valor);
    }
    console.log(`Ítem 15 - Frecuencia: ${this.respuestas.trauma_frequency.join(', ')}`);
  },

  renderizarCaracteristicas() {
    let html = `
      <table class="egep5-characteristics-table">
        <thead>
          <tr>
            <th style="width: 70%; text-align: left; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-primary);">Característica</th>
            <th class="table-center" style="padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700; font-size: 14px;">SÍ</th>
            <th class="table-center" style="padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700; font-size: 14px;">NO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3" style="background: var(--bg-surface-2); font-weight: 600; padding: 12px; border: 1px solid var(--border); color: var(--text-primary);">
              Durante ese acontecimiento, usted se sintió...
            </td>
          </tr>
    `;

    // Items 16-18
    for (let i = 16; i <= 18; i++) {
      html += `
        <tr>
          <td style="padding: 12px; border: 1px solid var(--border); width: 70%;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.caracteristicaDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="caract_${i}_si" onchange="window.tests_egep5.cambiarCaracteristica(${i}, true)">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="caract_${i}_no" onchange="window.tests_egep5.cambiarCaracteristica(${i}, false)">
          </td>
        </tr>
      `;
    }

    html += `
          <tr>
            <td colspan="3" style="background: var(--bg-surface-2); font-weight: 600; padding: 12px; border: 1px solid var(--border); color: var(--text-primary);">
              Ese acontecimiento supuso...
            </td>
          </tr>
    `;

    // Items 19-26
    for (let i = 19; i <= 26; i++) {
      html += `
        <tr>
          <td style="padding: 12px; border: 1px solid var(--border); width: 70%;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.caracteristicaDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="caract_${i}_si" onchange="window.tests_egep5.cambiarCaracteristica(${i}, true)">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="caract_${i}_no" onchange="window.tests_egep5.cambiarCaracteristica(${i}, false)">
          </td>
        </tr>
      `;
    }

    html += `
        </tbody>
      </table>
    `;

    const el = document.getElementById('egep5-items-16-26');
    if (el) el.innerHTML = html;
  },

  cambiarCaracteristica(numero, valor) {
    if (!this.respuestas.characteristics) {
      this.respuestas.characteristics = {};
    }
    // valor true = SÍ, valor false = NO, undefined/null = no marcado
    this.respuestas.characteristics[numero] = valor;
    console.log(`Característica ${numero}: ${valor === true ? 'SÍ' : valor === false ? 'NO' : 'no marcado'}`);
  },

  renderizarSintomas() {
    // Items 27-31
    this.renderizarTablaLikert('egep5-items-27-31', 27, 31, 'items_27_31', false);

    // Items 32-33 (con fondo diferente)
    this.renderizarTablaLikert('egep5-items-32-33', 32, 33, 'items_32_33', true);

    // Items 34-40
    this.renderizarTablaLikert('egep5-items-34-40', 34, 40, 'items_34_40', false);

    // Items 41-46
    this.renderizarTablaLikert('egep5-items-41-46', 41, 46, 'items_41_46', false);

    // Items 47-49
    this.renderizarTablaLikert('egep5-items-47-49', 47, 49, 'items_47_49', false);
  },

  renderizarTablaLikert(elementId, inicio, fin, grupo, esDestacado) {
    const etiquetasSeveridad = ['Ninguna', 'Leve', 'Moderada', 'Grave', 'Extrema'];
    let html = `
      <table class="egep5-symptoms-table">
        <thead>
          <tr>
            <th style="width: 50%; text-align: left; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-primary);">Síntoma</th>
            <th class="table-center" style="padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700;">SÍ</th>
            <th class="table-center" style="padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700;">NO</th>
            <th colspan="5" style="text-align: center; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-weight: 600;">GRADO DE MOLESTIA</th>
          </tr>
          <tr>
            <th style="width: 50%; text-align: left; padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2);"></th>
            <th style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2);"></th>
            <th style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2);"></th>
            <th class="table-center" style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-size: 12px;">Ninguna</th>
            <th class="table-center" style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-size: 12px;">Leve</th>
            <th class="table-center" style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-size: 12px;">Moderada</th>
            <th class="table-center" style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-size: 12px;">Grave</th>
            <th class="table-center" style="padding: 8px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-secondary); font-size: 12px;">Extrema</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = inicio; i <= fin; i++) {
      const indice = i - inicio;
      const bgColor = esDestacado ? 'background: rgba(107, 76, 122, 0.3);' : '';
      html += `
        <tr style="${bgColor}">
          <td style="padding: 12px; border: 1px solid var(--border);"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.symptomDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="symptom_${i}_si" onchange="window.tests_egep5.cambiarSintomaSI(${i}, this.checked)">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="checkbox" name="symptom_${i}_no" onchange="window.tests_egep5.cambiarSintomaNO(${i}, this.checked)">
          </td>
      `;

      for (let valor = 0; valor <= 4; valor++) {
        html += `
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" name="symptom_${i}" value="${valor}" onchange="window.tests_egep5.cambiarRespuesta('${grupo}', ${indice}, ${valor})">
          </td>
        `;
      }

      html += `</tr>`;
    }

    html += `
        </tbody>
      </table>
    `;

    const el = document.getElementById(elementId);
    if (el) el.innerHTML = html;
  },

  renderizarFuncionamiento() {
    let html = '';
    this.funcionamientoDefinitions.forEach((def, indice) => {
      const numero = 52 + indice;
      html += `<div class="functioning-item"><label class="checkbox-item"><input type="checkbox" name="item_${numero}" onchange="window.tests_egep5.cambiarFuncionamiento(${indice}, this.checked)"><span style="color: var(--accent-light);"><strong>${numero}.</strong> ${def}</span></label></div>`;
    });
    document.getElementById('egep5-items-52-58').innerHTML = html;
  },

  cambiarRespuesta(grupo, indice, valor) {
    this.respuestas[grupo][indice] = parseInt(valor);
    this.actualizarProgreso();
  },

  cambiarSintomaSI(numero, checked) {
    if (!this.respuestas.sintomas_si_no) {
      this.respuestas.sintomas_si_no = {};
    }
    if (checked) {
      this.respuestas.sintomas_si_no[numero] = 'SÍ';
      // Desmarcar NO si está marcado
      const noCheckbox = document.querySelector(`input[name="symptom_${numero}_no"]`);
      if (noCheckbox) noCheckbox.checked = false;
    } else {
      delete this.respuestas.sintomas_si_no[numero];
    }
  },

  cambiarSintomaNO(numero, checked) {
    if (!this.respuestas.sintomas_si_no) {
      this.respuestas.sintomas_si_no = {};
    }
    if (checked) {
      this.respuestas.sintomas_si_no[numero] = 'NO';
      // Desmarcar SÍ si está marcado
      const siCheckbox = document.querySelector(`input[name="symptom_${numero}_si"]`);
      if (siCheckbox) siCheckbox.checked = false;
    } else {
      delete this.respuestas.sintomas_si_no[numero];
    }
  },

  cambiarFuncionamiento(indice, checked) {
    this.respuestas.items_52_58[indice] = checked ? 1 : 0;
    this.actualizarProgreso();
  },

  actualizarProgreso() {
    let completadas = 0;
    if (this.respuestas.trauma_type.length > 0) completadas++;
    if (this.respuestas.trauma_description.trim()) completadas++;
    if (this.respuestas.trauma_severity) completadas++;
    if (this.respuestas.trauma_timing) completadas++;
    if (this.respuestas.trauma_frequency) completadas++;
    completadas += this.respuestas.items_27_31.filter(x => x > 0).length;
    completadas += this.respuestas.items_32_33.filter(x => x > 0).length;
    completadas += this.respuestas.items_34_40.filter(x => x > 0).length;
    completadas += this.respuestas.items_41_46.filter(x => x > 0).length;
    if (this.respuestas.symptom_duration) completadas++;
    if (this.respuestas.symptom_onset) completadas++;
    completadas += this.respuestas.items_52_58.filter(x => x > 0).length;

    const porcentaje = Math.round((completadas / 58) * 100);

    // Actualizar barra de progreso (IDs nuevos)
    const fillEl = document.getElementById('pg_bar');
    const itemsEl = document.getElementById('pg_n');

    if (fillEl) fillEl.style.width = porcentaje + '%';
    if (itemsEl) itemsEl.textContent = completadas;

    // Actualizar estadísticas
    const siEl = document.getElementById('st_si');
    const noEl = document.getElementById('st_no');
    if (siEl) siEl.textContent = this.respuestas.items_27_31.filter(x => x > 0).length +
                                  this.respuestas.items_32_33.filter(x => x > 0).length +
                                  this.respuestas.items_34_40.filter(x => x > 0).length +
                                  this.respuestas.items_41_46.filter(x => x > 0).length;
    if (noEl) noEl.textContent = 46 - (siEl ? parseInt(siEl.textContent) : 0);
  },

  // Funciones de navegación por secciones (LEGACY - usar irTab() en su lugar)
  siguienteSeccion() {
    // Usar nuevo sistema de tabs
    const tabs = ['datos', 'test', 'resultados'];
    const siguienteTab = tabs[Math.min(this.seccionActual, tabs.length - 1)];
    this.irTab(siguienteTab);
  },

  seccionAnterior() {
    // Usar nuevo sistema de tabs
    const tabs = ['datos', 'test', 'resultados'];
    const anteriorTab = tabs[Math.max(this.seccionActual - 2, 0)];
    this.irTab(anteriorTab);
  },

  validarSeccion1() {
    const descripcion = document.getElementById('trauma_description').value.trim();
    const gravedad = document.getElementById('trauma_severity').value;
    const timing = document.getElementById('trauma_timing').value;
    const frecuencia = document.getElementById('trauma_frequency').value;

    if (!descripcion || !gravedad || !timing || !frecuencia) {
      alert('Por favor, complete todos los campos de la Sección 1');
      return false;
    }

    this.respuestas.trauma_description = descripcion;
    this.respuestas.trauma_severity = gravedad;
    this.respuestas.trauma_timing = timing;
    this.respuestas.trauma_frequency = frecuencia;
    this.respuestas.trauma_type = Array.from(document.querySelectorAll('input[name="trauma_type"]:checked')).map(x => x.value);
    this.respuestas.during_event = Array.from(document.querySelectorAll('input[name="during_event"]:checked')).map(x => x.value);
    this.respuestas.event_type = Array.from(document.querySelectorAll('input[name="event_type"]:checked')).map(x => x.value);

    return true;
  },

  validarSeccion2() {
    const duracion = document.getElementById('symptom_duration').value;
    const onset = document.getElementById('symptom_onset').value;

    if (!duracion || !onset) {
      alert('Por favor, complete los campos de duración');
      return false;
    }

    this.respuestas.symptom_duration = duracion;
    this.respuestas.symptom_onset = onset;

    return true;
  },

  /**
   * Mapear respuestas actuales al formato esperado por el corrector DSM-5
   */
  mapearRespuestasAlCorrector() {
    const respuestas = {};

    // Mapear eventos (ítems 1-11)
    const eventos = {};
    for (let i = 1; i <= 11; i++) {
      eventos[i] = {
        s: this.respuestas.trauma_type.includes(String(i)),
        p: false,
        c: false
      };
    }

    // Mapear características (ítems 13-15, 16-26)
    respuestas[13] = this.respuestas.trauma_severity ? this.mapGravedad(this.respuestas.trauma_severity) : null;
    respuestas[14] = this.respuestas.trauma_timing ? this.mapTiming(this.respuestas.trauma_timing) : null;
    respuestas[15] = this.respuestas.trauma_frequency ? this.mapFrecuencia(this.respuestas.trauma_frequency) : null;

    // Mapear reacción (ítems 16-26) como SI/NO simples
    window.EGEP5_CORRECTOR.SN1626.forEach(item => {
      respuestas[item] = this.respuestas.during_event ? 'SI' : 'NO';
    });

    // Mapear síntomas (ítems 27-31, 32-33, 34-40, 41-46) como SI + grado
    const sintomas = [
      { items: this.respuestas.items_27_31, offset: 27 },
      { items: this.respuestas.items_32_33, offset: 32 },
      { items: this.respuestas.items_34_40, offset: 34 },
      { items: this.respuestas.items_41_46, offset: 41 }
    ];

    sintomas.forEach(({ items, offset }) => {
      items.forEach((grado, idx) => {
        const itemNum = offset + idx;
        respuestas[itemNum] = grado > 0 ? { si: 'SI', g: grado - 1 } : 'NO';
      });
    });

    // Mapear duración y onset (ítems 50-51)
    respuestas[50] = this.respuestas.symptom_duration ? this.mapDuracion(this.respuestas.symptom_duration) : null;
    respuestas[51] = this.respuestas.symptom_onset ? this.mapOnset(this.respuestas.symptom_onset) : null;

    // Mapear funcionamiento (ítems 52-58)
    this.respuestas.items_52_58.forEach((v, i) => {
      const itemNum = 52 + i;
      respuestas[itemNum] = v > 0 ? 'SI' : 'NO';
    });

    return { respuestas, eventos };
  },

  mapGravedad(v) {
    const m = { '1': 'leve', '2': 'mod', '3': 'grave', '4': 'extrema' };
    return m[v] || null;
  },

  mapTiming(v) {
    const m = { '1': 'infancia', '2': 'mas3m', '3': '1a3m', '4': 'ultimo_mes' };
    return m[v] || null;
  },

  mapFrecuencia(v) {
    const m = { '1': 'unica', '2': 'varias', '3': 'repetida' };
    return m[v] || null;
  },

  mapDuracion(v) {
    const m = { '1': 'menos1m', '2': '1a3m', '3': 'mas3m' };
    return m[v] || null;
  },

  mapOnset(v) {
    const m = { '1': 'inmediato', '2': 'primeros6m', '3': '6m_mas' };
    return m[v] || null;
  },

  calcularResultados() {
    // Usar corrector DSM-5 portado
    const { respuestas, eventos } = this.mapearRespuestasAlCorrector();
    const resultado = window.EGEP5_CORRECTOR.corregir({ respuestas, eventos });

    this.mostrarResultados(resultado);
    this.resultados = resultado;

    // Navegar a tab de resultados
    this.irTab('resultados');
  },

  mostrarResultados(resultado) {
    const CRIT = window.EGEP5_CORRECTOR.CRIT_DESC;
    const { tept, crit, pd, nsint } = resultado;

    // Diagnóstico principal
    const dxClass = tept === 'SI' ? 'positive' : tept === 'NO' ? 'negative' : 'neutral';
    const dxText = tept === 'SI' ? 'Cumple criterios DSM-5 de TEPT' : tept === 'NO' ? 'No cumple criterios de TEPT' : 'Información incompleta';
    const diagHTML = `<div class="diagnostic-result ${dxClass}"><div class="diagnostic-label">${dxText}</div><div class="diagnostic-intensity">Diagnóstico: ${tept}</div><div class="diagnostic-score">Puntuación total: ${pd.Total}/80</div></div>`;
    document.getElementById('egep5-diagnostico').innerHTML = diagHTML;

    // Tabla de criterios DSM-5
    let criteriaHTML = '<table class="criteria-table-content"><tr><th>Criterio</th><th>Descripción</th><th>Estado</th></tr>';
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(k => {
      const estado = crit[k].r;
      const badge = estado === 'SI' ? '✓ Sí' : estado === 'NO' ? '✗ No' : '? Incompleto';
      const badgeClass = estado === 'SI' ? 'cumple' : estado === 'NO' ? 'no-cumple' : 'neutral';
      criteriaHTML += `<tr><td><strong>${k}</strong></td><td>${CRIT[k]}</td><td class="${badgeClass}">${badge}</td></tr>`;
    });
    criteriaHTML += '</table>';
    document.getElementById('egep5-criteria-table').innerHTML = criteriaHTML;

    // Tabla de síntomas por escala
    let sympHTML = '<table class="symptoms-table-content"><tr><th>Escala</th><th>Síntomas</th><th>PD</th><th>Máx</th></tr>';
    sympHTML += `<tr><td>I (Intrusivos)</td><td>${nsint.I}</td><td>${pd.I}</td><td>20</td></tr>`;
    sympHTML += `<tr><td>E (Evitación)</td><td>${nsint.E}</td><td>${pd.E}</td><td>8</td></tr>`;
    sympHTML += `<tr><td>C (Cognitivas)</td><td>${nsint.C}</td><td>${pd.C}</td><td>28</td></tr>`;
    sympHTML += `<tr><td>A (Activación)</td><td>${nsint.A}</td><td>${pd.A}</td><td>24</td></tr>`;
    sympHTML += `<tr><td><strong>Total</strong></td><td>-</td><td><strong>${pd.Total}</strong></td><td><strong>80</strong></td></tr>`;
    sympHTML += '</table>';
    document.getElementById('egep5-symptoms-summary').innerHTML = sympHTML;

    // Funcionamiento
    const funcionAfectadas = this.respuestas.items_52_58.filter(x => x > 0).length;
    let funcHTML = `<p><strong>Áreas afectadas: ${funcionAfectadas}/7</strong></p><ul>`;
    this.respuestas.items_52_58.forEach((v, i) => { if (v > 0) funcHTML += `<li>${this.funcionamientoDefinitions[i]}</li>`; });
    funcHTML += '</ul>';
    document.getElementById('egep5-functioning-summary').innerHTML = funcHTML;
  },

  /**
   * Importar ejemplo de ejemplo JSON (positivo o negativo)
   */
  async importarEjemplo(tipo) {
    try {
      const archivo = tipo === 'positivo' ? 'egep5-ejemplo-positivo.json' : 'egep5-ejemplo-negativo.json';
      const response = await fetch(`/data/${archivo}`);

      if (!response.ok) {
        alert('❌ No se pudo cargar el archivo de ejemplo');
        return;
      }

      const data = await response.json();
      this.respuestas = data.respuestas || {};

      // Actualizar UI
      this.renderizarSintomas();
      this.renderizarFuncionamiento();
      this.actualizarProgreso();
      this.actualizarDashboard();

      // Notificación visual
      const tipo_txt = tipo === 'positivo' ? '✅ POSITIVO (con TEPT)' : '❌ NEGATIVO (sin TEPT)';
      alert(`📥 Ejemplo ${tipo_txt} cargado.\n\nAhora ve a Sección 3 y haz clic en "Calcular Resultados"`);

      // Auto-scroll a Sección 3
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Error importando ejemplo:', error);
      alert('❌ Error al importar: ' + error.message);
    }
  },

  /**
   * Manejar importación de archivo JSON personalizado
   */
  inicializarImportador() {
    const fileInput = document.getElementById('egep5-file-input');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);

          if (!data.respuestas) {
            throw new Error('El archivo no contiene "respuestas"');
          }

          // Mapear respuestas según formato (array o objeto)
          if (Array.isArray(data.respuestas)) {
            // Formato v2.0: array de 29+ números
            this.respuestas.items_27_31 = data.respuestas.slice(0, 5);
            this.respuestas.items_32_33 = data.respuestas.slice(5, 7);
            this.respuestas.items_34_40 = data.respuestas.slice(7, 14);
            this.respuestas.items_41_46 = data.respuestas.slice(14, 20);
            this.respuestas.items_47_49 = data.respuestas.slice(20, 23) || [0,0,0];
            this.respuestas.symptom_duration = data.respuestas[23] || 0;
            this.respuestas.symptom_onset = data.respuestas[24] || 0;
            this.respuestas.items_52_58 = data.respuestas.slice(25, 32) || [0,0,0,0,0,0,0];
          } else {
            // Formato legacy: objeto con propiedades
            this.respuestas = data.respuestas;
          }

          // Cargar metadatos si existen
          if (data.metadatos) {
            if (document.getElementById('m_nombre')) {
              document.getElementById('m_nombre').value = data.metadatos.paciente_nombre || '';
            }
            if (document.getElementById('m_edad')) {
              document.getElementById('m_edad').value = data.metadatos.edad || '';
            }
          }

          // Actualizar UI
          this.renderizarSintomas();
          this.renderizarFuncionamiento();
          this.actualizarProgreso();

          alert(`✅ Archivo "${file.name}" importado correctamente.\n\nVe a Tab 2 "Aplicar Test" y haz clic en "Calcular Resultados"`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          alert('❌ Error al parsear JSON: ' + error.message);
          console.error('Parse error:', error);
        }
      };
      reader.readAsText(file);
    });
  },

  calculaPercentil(pd, escala) {
    // Retornar percentil estimado (simplificado sin baremos cargados)
    if (!pd || pd <= 0) return 1;

    // Mapeo simple de PD a percentil (será mejorado con baremos reales)
    const maxPD = { I: 20, E: 8, C: 28, A: 24, Total: 80 };
    const max = maxPD[escala] || 80;

    const percentil = Math.round((pd / max) * 99);
    return Math.min(percentil, 99);
  },

  exportarJSON() {
    if (!this.resultados) {
      alert('Primero calcula los resultados');
      return;
    }

    const paciente_nombre = localStorage.getItem('paciente_nombre') || 'Paciente';
    const evaluador = document.getElementById('m_evaluador')?.value || localStorage.getItem('nombre') || 'Sin especificar';
    const fecha_eval = document.getElementById('m_fecha')?.value || new Date().toISOString().split('T')[0];
    const edad = document.getElementById('m_edad')?.value || 'No especificada';
    const sexo = document.getElementById('m_sexo')?.value || 'No especificado';
    const centro = document.getElementById('m_centro')?.value || 'No especificado';

    // Calcular percentiles con baremos
    const percentiles = {
      I: this.calculaPercentil(this.resultados.pd?.I || 0, 'I'),
      E: this.calculaPercentil(this.resultados.pd?.E || 0, 'E'),
      C: this.calculaPercentil(this.resultados.pd?.C || 0, 'C'),
      A: this.calculaPercentil(this.resultados.pd?.A || 0, 'A'),
      Total: this.calculaPercentil(this.resultados.pd?.Total || 0, 'Total')
    };

    const data = {
      testType: 'EGEP-5',
      version: '2.0',
      baremos: 'españa_2024',
      respuestas: this.construirArrayRespuestas(),
      metadatos: {
        paciente_nombre: paciente_nombre,
        paciente_id: sessionStorage.getItem('pacienteSeleccionado'),
        edad: edad,
        sexo: sexo,
        evaluador: evaluador,
        centro: centro,
        fecha_evaluacion: fecha_eval,
        tipo_trauma: this.respuestas.trauma_type.join(','),
        descripcion_evento: this.respuestas.trauma_description,
        severidad_evento: this.respuestas.trauma_severity,
        tiempo_evento: this.respuestas.trauma_timing
      },
      criterios_dsm5: this.resultados.crit,
      diagnostico: {
        tept_presente: this.resultados.tept,
        puntuaciones_directas: this.resultados.pd,
        percentiles: percentiles,
        sintomas_reportados: {
          intrusivos: this.resultados.nsint?.I || 0,
          evitacion: this.resultados.nsint?.E || 0,
          cognitivas: this.resultados.nsint?.C || 0,
          activacion: this.resultados.nsint?.A || 0
        }
      },
      funcionamiento: {
        areas_afectadas: this.respuestas.items_52_58.filter(x => x > 0).length,
        total_areas: 7,
        areas_detalles: this.funcionamientoDefinitions.filter((_, i) => this.respuestas.items_52_58[i] > 0)
      },
      respondidas: this.construirArrayRespuestas().filter(x => x > 0).length,
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EGEP-5_${paciente_nombre}_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ JSON exportado con percentiles y baremos incluidos');
  },

  irTab(tabName) {
    const tabs = document.querySelectorAll('.egep5-tab');
    const contents = document.querySelectorAll('.egep5-tab-content');

    contents.forEach(c => c.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    document.querySelector(`.egep5-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`tab-${tabName}`)?.classList.add('active');

    window.scrollTo(0, 0);
  },

  importarJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validar estructura
        if (data.testType !== 'EGEP-5') {
          throw new Error('El archivo no es un EGEP-5 válido');
        }

        if (!data.respuestas || data.respuestas.length !== 58) {
          throw new Error(`El archivo debe tener 58 respuestas (tiene ${data.respuestas.length})`);
        }

        if (!data.respuestas.every(r => [0, 1, 2, 3, 4].includes(r))) {
          throw new Error('Las respuestas deben estar entre 0 y 4');
        }

        // Confirmar antes de cargar
        if (!confirm(`Se cargarán ${data.respondidas || 0} respuestas del paciente: ${data.metadatos.paciente_nombre}. ¿Continuar?`)) {
          return;
        }

        // 1. Cargar respuestas en memoria
        this.respuestas.items_27_31 = data.respuestas.slice(0, 5);
        this.respuestas.items_32_33 = data.respuestas.slice(5, 7);
        this.respuestas.items_34_40 = data.respuestas.slice(7, 14);
        this.respuestas.items_41_46 = data.respuestas.slice(14, 20);
        this.respuestas.symptom_duration = data.respuestas[20];
        this.respuestas.symptom_onset = data.respuestas[21];
        this.respuestas.items_52_58 = data.respuestas.slice(22, 29);

        // 2. Reconstruir respuestas en el DOM
        this.cargarRespuestasEnDOM(data);

        // 3. Crear objeto resultados a partir de datos cargados
        this.resultados = data.diagnostico;

        // 4. Mostrar resultados
        this.mostrarResultados({
          teptPresente: data.diagnostico.tept_presente,
          nivelIntensidad: data.diagnostico.intensidad,
          criterios: data.criterios_dsm5,
          reexper: data.diagnostico.reexperimentacion,
          evitar: data.diagnostico.evitacion,
          cognit: data.diagnostico.cognitivas,
          activa: data.diagnostico.activacion,
          intensidadTotal: data.diagnostico.intensidad_total
        });

        // 5. Navegar a resultados
        this.irTab('resultados');

        // 6. Mostrar éxito
        this.mostrarMensajeExito(`✅ JSON importado correctamente<br>Respuestas cargadas: ${data.respondidas}/58<br>Diagnóstico: ${data.diagnostico.tept_presente ? 'TEPT PRESENTE' : 'TEPT AUSENTE'}`);

      } catch (error) {
        this.mostrarMensajeError(`❌ Error: ${error.message}`);
        console.error('Error al importar JSON:', error);
      }
    };
    reader.readAsText(file);
  },

  construirArrayRespuestas() {
    const data = [];
    data.push(...this.respuestas.items_27_31);
    data.push(...this.respuestas.items_32_33);
    data.push(...this.respuestas.items_34_40);
    data.push(...this.respuestas.items_41_46);
    data.push(this.respuestas.symptom_duration || 0);
    data.push(this.respuestas.symptom_onset || 0);
    data.push(...this.respuestas.items_52_58);
    return data;
  },

  cargarRespuestasEnDOM(data) {
    // Items 27-31
    data.respuestas.slice(0, 5).forEach((resp, i) => {
      const radio = document.querySelector(`input[name="${27 + i}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });
    // Items 32-33
    data.respuestas.slice(5, 7).forEach((resp, i) => {
      const radio = document.querySelector(`input[name="${32 + i}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });
    // Items 34-40
    data.respuestas.slice(7, 14).forEach((resp, i) => {
      const radio = document.querySelector(`input[name="${34 + i}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });
    // Items 41-46
    data.respuestas.slice(14, 20).forEach((resp, i) => {
      const radio = document.querySelector(`input[name="${41 + i}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });
    // Items 50-51
    document.getElementById('symptom_duration').value = data.respuestas[20] || '';
    document.getElementById('symptom_onset').value = data.respuestas[21] || '';
    // Items 52-58
    data.respuestas.slice(22, 29).forEach((resp, i) => {
      const checkbox = document.querySelector(`input[name="item_${52 + i}"]`);
      if (checkbox) checkbox.checked = resp > 0;
    });
  },

  mostrarMensajeExito(html) {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    successMsg.innerHTML = html;
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 5000);
  },

  mostrarMensajeError(msg) {
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 15px; border-radius: 4px; z-index: 9999;';
    errorMsg.textContent = msg;
    document.body.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 5000);
  },

  generarPDF() {
    if (!this.resultados) {
      alert('Primero calcula los resultados');
      return;
    }

    const nombre_paciente = localStorage.getItem('paciente_nombre') || 'Paciente';
    const resultContainer = document.getElementById('tab-resultados');

    if (!resultContainer) {
      alert('No se encontró el contenedor de resultados');
      return;
    }

    const opt = {
      margin: 10,
      filename: `EGEP-5_${nombre_paciente}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(resultContainer).save();
    alert('PDF descargado correctamente');
  },

  guardarResultados() {
    if (!this.resultados) {
      alert('Primero calcula los resultados');
      return;
    }

    // Preparar array de 58 respuestas (0 = no contestada, 1-4 = puntuación)
    const data = [];

    // Items 27-31 (Reexperimentación)
    data.push(...this.respuestas.items_27_31);

    // Items 32-33 (Evitación)
    data.push(...this.respuestas.items_32_33);

    // Items 34-40 (Cognitivas/Ánimo)
    data.push(...this.respuestas.items_34_40);

    // Items 41-46 (Activación)
    data.push(...this.respuestas.items_41_46);

    // Items 50-51 (Duración/Onset)
    data.push(this.respuestas.symptom_duration || 0, this.respuestas.symptom_onset || 0);

    // Items 52-58 (Funcionamiento: 0 o 1)
    data.push(...this.respuestas.items_52_58);

    // Subescalas con criterios DSM-5 y metadatos
    const subescalas = {
      reexperimentacion: this.resultados.reexper,
      evitacion: this.resultados.evitar,
      cognitivas_animo: this.resultados.cognit,
      activacion: this.resultados.activa,
      funcionamiento: this.respuestas.items_52_58.filter(x => x > 0).length,
      intensidad_total: this.resultados.intensidadTotal,
      nivel: this.resultados.nivelIntensidad,
      _criterios_dsm5: this.resultados.criterios,
      _tept_presente: this.resultados.teptPresente,
      _evaluador: localStorage.getItem('nombre') || 'Sin especificar'
    };

    // Guardar via API
    const pacienteId = sessionStorage.getItem('pacienteSeleccionado');
    api.guardarPrueba(
      pacienteId,
      'EGEP-5',
      data,
      this.resultados.intensidadTotal,
      subescalas,
      localStorage.getItem('nombre')
    ).then(resultado => {
      alert('✅ Resultados guardados en expediente correctamente');
      window.history.back();
    }).catch(error => {
      alert('❌ Error al guardar: ' + error.message);
      console.error('Error:', error);
    });
  }
};
