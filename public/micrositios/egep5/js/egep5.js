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
          <td style="text-transform: capitalize;"><strong>${i}. ${eventName}</strong></td>
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
          <td style="padding: 12px; border: 1px solid var(--border); width: 70%; text-transform: capitalize;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.caracteristicaDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="caract_${i}_si" name="caract_${i}" value="si" onchange="window.tests_egep5.cambiarCaracteristica(${i}, true)" style="cursor: pointer; width: 18px; height: 18px;">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="caract_${i}_no" name="caract_${i}" value="no" onchange="window.tests_egep5.cambiarCaracteristica(${i}, false)" style="cursor: pointer; width: 18px; height: 18px;">
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
          <td style="padding: 12px; border: 1px solid var(--border); width: 70%; text-transform: capitalize;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.caracteristicaDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="caract_${i}_si" name="caract_${i}" value="si" onchange="window.tests_egep5.cambiarCaracteristica(${i}, true)" style="cursor: pointer; width: 18px; height: 18px;">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="caract_${i}_no" name="caract_${i}" value="no" onchange="window.tests_egep5.cambiarCaracteristica(${i}, false)" style="cursor: pointer; width: 18px; height: 18px;">
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
    this.renderizarTablaLikert('egep5-items-41-46', 41, 46, 'items_41_46', true);

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
          <td style="padding: 12px; border: 1px solid var(--border); text-transform: capitalize;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.symptomDefinitions[i]}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="symptom_${i}_si" name="symptom_respuesta_${i}" value="si" onchange="window.tests_egep5.cambiarSintomaSI(${i}, 'si')" style="cursor: pointer; width: 18px; height: 18px;">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" id="symptom_${i}_no" name="symptom_respuesta_${i}" value="no" onchange="window.tests_egep5.cambiarSintomaNO(${i}, 'no')" style="cursor: pointer; width: 18px; height: 18px;">
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
    let html = `
      <table class="egep5-functioning-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="width: 70%; text-align: left; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--text-primary); font-weight: 600;">Pregunta</th>
            <th class="table-center" style="width: 15%; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700;">SÍ</th>
            <th class="table-center" style="width: 15%; padding: 12px; border: 1px solid var(--border); background: var(--bg-surface-2); color: var(--accent-light); font-weight: 700;">NO</th>
          </tr>
        </thead>
        <tbody>
    `;

    this.funcionamientoDefinitions.forEach((def, indice) => {
      const numero = 52 + indice;
      html += `
        <tr>
          <td style="padding: 12px; border: 1px solid var(--border); text-transform: capitalize;"><strong style="color: #60a5fa;">${numero}.</strong> <span style="color: #60a5fa;">${def}</span></td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" name="item_${numero}" value="si" onchange="window.tests_egep5.cambiarFuncionamiento(${indice}, 'si')">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" name="item_${numero}" value="no" onchange="window.tests_egep5.cambiarFuncionamiento(${indice}, 'no')">
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    document.getElementById('egep5-items-52-58').innerHTML = html;
  },

  cambiarRespuesta(grupo, indice, valor) {
    this.respuestas[grupo][indice] = parseInt(valor);
    this.actualizarProgreso();
  },

  cambiarSintomaSI(numero, valor) {
    if (!this.respuestas.sintomas_si_no) {
      this.respuestas.sintomas_si_no = {};
    }
    this.respuestas.sintomas_si_no[numero] = valor === 'si' ? 'SÍ' : 'NO';
  },

  cambiarSintomaNO(numero, valor) {
    if (!this.respuestas.sintomas_si_no) {
      this.respuestas.sintomas_si_no = {};
    }
    this.respuestas.sintomas_si_no[numero] = valor === 'no' ? 'NO' : 'SÍ';
  },

  cambiarFuncionamiento(indice, valor) {
    this.respuestas.items_52_58[indice] = valor === 'si' ? 1 : (valor === 'no' ? 0 : null);
    this.actualizarProgreso();
  },

  cambiarItem50(checkbox) {
    if (checkbox.checked) {
      // Desmarcar los otros
      document.querySelectorAll('input[name^="item_50_option"]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
      });
      this.respuestas.symptom_duration = checkbox.name.replace('item_50_option', '');
    } else {
      this.respuestas.symptom_duration = null;
    }
    this.actualizarProgreso();
  },

  cambiarItem51(checkbox) {
    if (checkbox.checked) {
      // Desmarcar los otros
      document.querySelectorAll('input[name^="item_51_option"]').forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
      });
      this.respuestas.symptom_onset = checkbox.name.replace('item_51_option', '');
    } else {
      this.respuestas.symptom_onset = null;
    }
    this.actualizarProgreso();
  },

  actualizarProgreso() {
    let completadas = 0;

    // Items 1-11: Eventos traumáticos (contar values no vacíos en event_type object)
    if (this.respuestas.event_type && typeof this.respuestas.event_type === 'object') {
      completadas += Object.values(this.respuestas.event_type).filter(v => v).length;
    }

    // Item 12: Descripción del evento
    if (this.respuestas.trauma_description && this.respuestas.trauma_description.trim()) completadas++;

    // Item 13: Gravedad
    if (this.respuestas.trauma_severity) completadas++;

    // Item 14: Cuándo ocurrió
    if (this.respuestas.trauma_timing) completadas++;

    // Item 15: Frecuencia
    if (this.respuestas.trauma_frequency && Array.isArray(this.respuestas.trauma_frequency) && this.respuestas.trauma_frequency.length > 0) completadas++;

    // Items 16-26: Características (contar values true/false en object)
    if (this.respuestas.characteristics && typeof this.respuestas.characteristics === 'object') {
      completadas += Object.values(this.respuestas.characteristics).filter(v => v !== undefined && v !== null).length;
    }

    // Items 27-31: Síntomas Reexperimentación
    completadas += this.respuestas.items_27_31.filter(x => x > 0).length;

    // Items 32-33: Síntomas Evitación
    completadas += this.respuestas.items_32_33.filter(x => x > 0).length;

    // Items 34-40: Síntomas Cognitivos
    completadas += this.respuestas.items_34_40.filter(x => x > 0).length;

    // Items 41-46: Síntomas Activación
    completadas += this.respuestas.items_41_46.filter(x => x > 0).length;

    // Items 47-49: Otros síntomas
    completadas += this.respuestas.items_47_49.filter(x => x > 0).length;

    // Item 50: Duración síntomas
    if (this.respuestas.symptom_duration) completadas++;

    // Item 51: Onset síntomas
    if (this.respuestas.symptom_onset) completadas++;

    // Items 52-58: Funcionamiento
    completadas += this.respuestas.items_52_58.filter(x => x > 0).length;

    const porcentaje = Math.round((completadas / 58) * 100);

    // Actualizar barra de progreso (IDs nuevos)
    const fillEl = document.getElementById('pg_bar');
    const itemsEl = document.getElementById('pg_n');

    if (fillEl) fillEl.style.width = porcentaje + '%';
    if (itemsEl) itemsEl.textContent = completadas + ' / 58';

    // Actualizar estadísticas
    const acontecimientosEl = document.getElementById('st_ev');
    const siEl = document.getElementById('st_si');
    const noEl = document.getElementById('st_no');

    // ACONTECIMIENTOS: Contar eventos traumáticos (items 1-11)
    if (acontecimientosEl) {
      const eventosCount = this.respuestas.event_type && typeof this.respuestas.event_type === 'object'
        ? Object.values(this.respuestas.event_type).filter(v => v).length
        : 0;
      acontecimientosEl.textContent = eventosCount;
    }

    // SÍ: Contar TODOS los síntomas con valor > 0 (items 27-58 = 32 síntomas)
    const totalSintomas = (this.respuestas.items_27_31.filter(x => x > 0).length +
                           this.respuestas.items_32_33.filter(x => x > 0).length +
                           this.respuestas.items_34_40.filter(x => x > 0).length +
                           this.respuestas.items_41_46.filter(x => x > 0).length +
                           this.respuestas.items_47_49.filter(x => x > 0).length +
                           (this.respuestas.symptom_duration ? 1 : 0) +
                           (this.respuestas.symptom_onset ? 1 : 0) +
                           this.respuestas.items_52_58.filter(x => x > 0).length);

    if (siEl) siEl.textContent = totalSintomas;

    // NO: Síntomas no respondidos (32 síntomas totales - síntomas respondidos)
    if (noEl) noEl.textContent = 32 - totalSintomas;
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

  calcularCriterioA() {
    // Criterio A: Exposición a acontecimiento traumático
    // Items 1-11: al menos 1 marcado
    // Item 14: debe ser diferente a "En el último mes"
    const traumaMarcado = Object.keys(this.respuestas.event_type || {}).length > 0;
    const tiempoOkDistinto = this.respuestas.trauma_timing && this.respuestas.trauma_timing !== 'ultimomes';
    return traumaMarcado && tiempoOkDistinto ? 'SI' : 'NO';
  },

  calcularCriterioB() {
    // Criterio B: Síntomas Intrusivos (Items 27-31)
    // Requiere: >= 1 síntoma marcado como SÍ
    const sintomasCount = this.respuestas.items_27_31.filter(x => x > 0).length;
    const intensidad = this.respuestas.items_27_31.reduce((a, b) => a + b, 0);
    return sintomasCount >= 1 ? 'SI' : 'NO';
  },

  calcularCriterioC() {
    // Criterio C: Evitación (Items 32-33)
    // Requiere: >= 1 síntoma
    const sintomasCount = this.respuestas.items_32_33.filter(x => x > 0).length;
    return sintomasCount >= 1 ? 'SI' : 'NO';
  },

  calcularCriterioD() {
    // Criterio D: Alteraciones Cognitivas y del Estado de Ánimo (Items 34-40)
    // Requiere: >= 2 síntomas
    const sintomasCount = this.respuestas.items_34_40.filter(x => x > 0).length;
    return sintomasCount >= 2 ? 'SI' : 'NO';
  },

  calcularCriterioE() {
    // Criterio E: Alteraciones en la Activación y Reactividad (Items 41-46)
    // Requiere: >= 2 síntomas
    const sintomasCount = this.respuestas.items_41_46.filter(x => x > 0).length;
    return sintomasCount >= 2 ? 'SI' : 'NO';
  },

  calcularCriterioF() {
    // Criterio F: Duración (Item 50)
    // Requiere: más de 1 mes (no "Desde hace menos de 1 mes")
    return this.respuestas.symptom_duration && this.respuestas.symptom_duration !== '1' ? 'SI' : 'NO';
  },

  calcularCriterioG() {
    // Criterio G: Funcionamiento (Items 52-58)
    // Requiere: >= 2 áreas afectadas
    const areasAfectadas = this.respuestas.items_52_58.filter(x => x > 0).length;
    return areasAfectadas >= 2 ? 'SI' : 'NO';
  },

  calcularIntensidades() {
    // Calcular intensidades por subescala
    return {
      I: this.respuestas.items_27_31.reduce((a, b) => a + b, 0),  // 0-20
      E: this.respuestas.items_32_33.reduce((a, b) => a + b, 0),  // 0-8
      C: this.respuestas.items_34_40.reduce((a, b) => a + b, 0),  // 0-28
      A: this.respuestas.items_41_46.reduce((a, b) => a + b, 0),  // 0-24
      F: this.respuestas.items_52_58.filter(x => x > 0).length    // 0-7
    };
  },

  detectarEspecificaciones() {
    // Especificaciones de presentación del TEPT
    const especificaciones = [];

    // Despersonalización: Item 47 marcado con SÍ
    if (this.respuestas.items_47_49 && this.respuestas.items_47_49[0] > 0) {
      especificaciones.push('Con síntomas disociativos - Despersonalización');
    }

    // Desrealización: Item 48 o 49 marcados con SÍ
    if (this.respuestas.items_47_49 && (this.respuestas.items_47_49[1] > 0 || this.respuestas.items_47_49[2] > 0)) {
      especificaciones.push('Con síntomas disociativos - Desrealización');
    }

    // Expresión retardada: Item 51 = "6 meses o más"
    if (this.respuestas.symptom_onset === '3') {
      especificaciones.push('Con expresión retardada (inicio tras 6+ meses)');
    }

    return especificaciones;
  },

  obtenerPercentil(intensidad, maxIntensidad) {
    // Convertir intensidad a percentil aproximado (escala 0-100)
    // Basado en distribución normal simplificada
    const ratio = intensidad / maxIntensidad;
    if (ratio === 0) return 5;
    if (ratio <= 0.25) return Math.round(ratio * 100);
    if (ratio <= 0.5) return Math.round(ratio * 120);
    if (ratio <= 0.75) return Math.round(ratio * 140);
    return Math.min(99, Math.round(ratio * 180));
  },

  diagnosticarTEPT() {
    // Diagnóstico TEPT: todos los criterios A-G deben cumplirse
    const criterios = {
      A: this.calcularCriterioA(),
      B: this.calcularCriterioB(),
      C: this.calcularCriterioC(),
      D: this.calcularCriterioD(),
      E: this.calcularCriterioE(),
      F: this.calcularCriterioF(),
      G: this.calcularCriterioG()
    };

    const todosCumplen = Object.values(criterios).every(c => c === 'SI');
    const pd = this.calcularIntensidades();
    return {
      tept: todosCumplen ? 'SI' : 'NO',
      criterios: criterios,
      pd: pd,
      intensidades: pd,  // Mantener compatibilidad
      especificaciones: this.detectarEspecificaciones()
    };
  },

  calcularResultados() {
    // Calcular diagnóstico DSM-5
    const resultado = this.diagnosticarTEPT();
    this.mostrarResultados(resultado);
    this.resultados = resultado;
    this.irTab('resultados');
  },

  mostrarResultados(resultado) {
    const { tept, criterios, intensidades, especificaciones } = resultado;
    const totalIntensidad = intensidades.I + intensidades.E + intensidades.C + intensidades.A;

    // 1. DIAGNÓSTICO PRINCIPAL
    const dxText = tept === 'SI' ? '✓ CUMPLE CRITERIOS DSM-5 DE TEPT' : '✗ NO CUMPLE CRITERIOS DE TEPT';
    const diagHTML = `
      <div style="background: ${tept === 'SI' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${tept === 'SI' ? '#4CAF50' : '#F44336'}; backdrop-filter: blur(10px);">
        <div style="font-size: 18px; font-weight: 700; color: ${tept === 'SI' ? '#81C784' : '#EF5350'}; margin-bottom: 12px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${dxText}</div>
        <div style="color: #e6eaf0; font-size: 14px; font-weight: 500;">Puntuación total de síntomas: <strong style="color: #FFD54F; font-size: 16px;">${totalIntensidad}/80</strong></div>
      </div>
    `;
    document.getElementById('egep5-diagnostico').innerHTML = diagHTML;

    // 2. TABLA DE CRITERIOS A-G
    const criteriosDesc = {
      A: 'Exposición a acontecimiento traumático',
      B: 'Síntomas Intrusivos (Items 27-31)',
      C: 'Evitación (Items 32-33)',
      D: 'Alteraciones Cognitivas (Items 34-40)',
      E: 'Alteraciones Activación (Items 41-46)',
      F: 'Duración >1 mes (Item 50)',
      G: 'Impacto Funcional (Items 52-58)'
    };

    let critHTML = '<table style="width: 100%; border-collapse: collapse;">';
    critHTML += '<tr style="background: rgba(107, 76, 122, 0.2);"><th style="text-align: left; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Criterio</th><th style="text-align: left; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Descripción</th><th style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Resultado</th></tr>';

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((k, idx) => {
      const estado = criterios[k];
      const badge = estado === 'SI' ? '<span style="color: #81C784; font-weight: 700; font-size: 15px;">✓ Sí</span>' : '<span style="color: #EF5350; font-weight: 700; font-size: 15px;">✗ No</span>';
      const bgColor = idx % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent';
      critHTML += `<tr style="background: ${bgColor};"><td style="padding: 12px; border: 1px solid var(--border); font-weight: 600; color: #60a5fa; font-size: 14px;">${k}</td><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-size: 14px;">${criteriosDesc[k]}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); font-size: 14px;">${badge}</td></tr>`;
    });

    critHTML += '</table>';
    document.getElementById('egep5-criteria-table').innerHTML = critHTML;

    // 3. TABLA DE INTENSIDADES
    let sympHTML = '<table style="width: 100%; border-collapse: collapse;">';
    sympHTML += '<tr style="background: rgba(107, 76, 122, 0.2);"><th style="text-align: left; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Escala</th><th style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Puntuación Directa</th><th style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0; font-weight: 600;">Máximo</th></tr>';
    sympHTML += `<tr style="background: rgba(0,0,0,0.2);"><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">I - Síntomas Intrusivos</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #FFD54F; font-weight: 600; font-size: 15px;">${intensidades.I}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">20</td></tr>`;
    sympHTML += `<tr><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">E - Evitación</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #FFD54F; font-weight: 600; font-size: 15px;">${intensidades.E}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">8</td></tr>`;
    sympHTML += `<tr style="background: rgba(0,0,0,0.2);"><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">C - Alteraciones Cognitivas</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #FFD54F; font-weight: 600; font-size: 15px;">${intensidades.C}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">28</td></tr>`;
    sympHTML += `<tr><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">A - Alteraciones Activación</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #FFD54F; font-weight: 600; font-size: 15px;">${intensidades.A}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">24</td></tr>`;
    sympHTML += `<tr style="background: rgba(107, 76, 122, 0.3); font-weight: 700;"><td style="padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">TOTAL</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #FFD54F; font-size: 16px;">${totalIntensidad}</td><td style="text-align: center; padding: 12px; border: 1px solid var(--border); color: #e6eaf0;">80</td></tr>`;
    sympHTML += '</table>';
    document.getElementById('egep5-symptoms-summary').innerHTML = sympHTML;

    // 4. FUNCIONAMIENTO
    const areasAfectadas = this.respuestas.items_52_58.filter(x => x > 0).length;
    let funcHTML = `<div style="margin-bottom: 12px;"><strong>Áreas afectadas: ${areasAfectadas}/7</strong></div>`;
    funcHTML += '<ul style="list-style: none; padding: 0;">';
    this.respuestas.items_52_58.forEach((v, i) => {
      if (v > 0) funcHTML += `<li style="padding: 8px; color: var(--text-primary);">✓ ${this.funcionamientoDefinitions[i]}</li>`;
    });
    funcHTML += '</ul>';
    document.getElementById('egep5-functioning-summary').innerHTML = funcHTML;

    // 5. ESPECIFICACIONES
    let specHTML = '<ul style="list-style: none; padding: 0;">';
    if (especificaciones.length === 0) {
      specHTML += '<li style="padding: 8px; color: var(--text-secondary);">Sin especificaciones adicionales</li>';
    } else {
      especificaciones.forEach(spec => {
        specHTML += `<li style="padding: 8px; color: var(--text-primary); border-left: 3px solid #FF9800; padding-left: 12px;">⚠️ ${spec}</li>`;
      });
    }
    specHTML += '</ul>';
    document.getElementById('egep5-specifications').innerHTML = specHTML;

    // 6. BAREMOS - Tabla de conversión PD a Percentil
    let bareHTML = '<div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">Tabla de conversión de Puntuación Directa (PD) a Percentiles (Baremos población española)</div>';
    bareHTML += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
    bareHTML += '<tr style="background: var(--bg-surface-2);"><th style="text-align: center; padding: 10px; border: 1px solid var(--border);">Escala</th><th style="text-align: center; padding: 10px; border: 1px solid var(--border);">PD</th><th style="text-align: center; padding: 10px; border: 1px solid var(--border);">Percentil</th><th style="text-align: center; padding: 10px; border: 1px solid var(--border);">Interpretación</th></tr>';

    const escalas = [
      { nombre: 'I (Intrusivos)', pd: intensidades.I, max: 20 },
      { nombre: 'E (Evitación)', pd: intensidades.E, max: 8 },
      { nombre: 'C (Cognitivas)', pd: intensidades.C, max: 28 },
      { nombre: 'A (Activación)', pd: intensidades.A, max: 24 }
    ];

    escalas.forEach((escala, idx) => {
      const percentil = this.obtenerPercentil(escala.pd, escala.max);
      const interpretacion = percentil >= 75 ? 'Muy elevado' : percentil >= 50 ? 'Elevado' : percentil >= 25 ? 'Promedio' : 'Bajo';
      bareHTML += `<tr><td style="padding: 10px; border: 1px solid var(--border);">${escala.nombre}</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border);">${escala.pd}</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border); font-weight: 600;">${percentil}</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border);">${interpretacion}</td></tr>`;
    });

    const totalPercentil = this.obtenerPercentil(totalIntensidad, 80);
    const totalInterp = totalPercentil >= 75 ? 'Muy elevado' : totalPercentil >= 50 ? 'Elevado' : totalPercentil >= 25 ? 'Promedio' : 'Bajo';
    bareHTML += `<tr style="background: rgba(107, 76, 122, 0.1); font-weight: 700;"><td style="padding: 10px; border: 1px solid var(--border);">TOTAL</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border);">${totalIntensidad}</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border);">${totalPercentil}</td><td style="text-align: center; padding: 10px; border: 1px solid var(--border);">${totalInterp}</td></tr>`;

    bareHTML += '</table>';
    document.getElementById('egep5-baremos').innerHTML = bareHTML;

    // 7. GRÁFICO DEL PERFIL (Tab 4)
    try {
      if (window.EGEP5_GRAFICOS && window.EGEP5_GRAFICOS.generarPerfil) {
        const perfilHTML = window.EGEP5_GRAFICOS.generarPerfil(resultado);
        const perfilEl = document.getElementById('egep5-perfil-grafico');
        if (perfilEl) perfilEl.innerHTML = perfilHTML;
      }
    } catch (e) {
      console.error('Error generando gráfico:', e);
    }

    // 8. INTERPRETACIÓN CLÍNICA (Tab 5)
    try {
      const interpretHTML = this.generarInterpretacion(resultado, intensidades, totalIntensidad);
      const interpEl = document.getElementById('egep5-interpretacion-clinica');
      if (interpEl) interpEl.innerHTML = interpretHTML;
    } catch (e) {
      console.error('Error generando interpretación:', e);
    }

    // 9. HISTOGRAMA DE RESPUESTAS
    try {
      this.generarHistograma();
    } catch (e) {
      console.error('Error generando histograma:', e);
    }
  },

  generarInterpretacion(resultado, intensidades, totalIntensidad) {
    const { tept, criterios } = resultado;
    let html = '<div style="font-size: 14px; line-height: 1.8; color: var(--text-primary);">';

    // Diagnóstico general
    if (tept === 'SI') {
      html += '<div style="background: rgba(76, 175, 80, 0.15); border: 1px solid #4CAF50; border-radius: 8px; padding: 16px; margin-bottom: 20px;">';
      html += '<strong style="color: #FFFFFF; font-size: 15px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">✓ DIAGNÓSTICO: Trastorno por Estrés Postraumático (TEPT)</strong>';
      html += '<p style="margin: 8px 0 0 0; color: #e6eaf0;">El paciente cumple con los criterios DSM-5 para TEPT. La intensidad de síntomas es ' + (totalIntensidad >= 60 ? 'SEVERA' : totalIntensidad >= 40 ? 'MODERADA' : 'LEVE') + '.</p>';
      html += '</div>';
    } else {
      html += '<div style="background: rgba(244, 67, 54, 0.15); border: 1px solid #F44336; border-radius: 8px; padding: 16px; margin-bottom: 20px;">';
      html += '<strong style="color: #FFFFFF; font-size: 15px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">✗ DIAGNÓSTICO: No cumple criterios de TEPT</strong>';
      html += '<p style="margin: 8px 0 0 0; color: #e6eaf0;">El paciente no cumple con los criterios DSM-5 para TEPT. Se recomienda evaluar otros diagnósticos relacionados con trauma.</p>';
      html += '</div>';
    }

    // Síntomas predominantes
    html += '<div style="margin-bottom: 20px;">';
    html += '<h3 style="margin: 0 0 12px 0; color: #e6eaf0; font-weight: 600;">Síntomas Predominantes:</h3>';
    const sintomas = [];
    if (intensidades.I >= 10) sintomas.push('Reexperimentación/Intrusión');
    if (intensidades.E >= 4) sintomas.push('Evitación');
    if (intensidades.C >= 14) sintomas.push('Alteraciones Cognitivas');
    if (intensidades.A >= 12) sintomas.push('Hiperactivación');
    html += '<ul style="margin: 0; padding-left: 20px;">' + sintomas.map(s => `<li>${s}</li>`).join('') + '</ul>';
    html += '</div>';

    // Recomendaciones
    html += '<div style="background: rgba(33, 150, 243, 0.1); border-radius: 8px; padding: 16px;">';
    html += '<h3 style="margin: 0 0 12px 0; color: #60a5fa; font-weight: 600;">Recomendaciones Clínicas:</h3>';
    html += '<ul style="margin: 0; padding-left: 20px;">';
    if (tept === 'SI' && totalIntensidad >= 60) {
      html += '<li>Psicoterapia especializada (TCC, EMDR) inmediata</li>';
      html += '<li>Considerar evaluación psiquiátrica para farmacoterapia</li>';
      html += '<li>Seguimiento clínico mensual</li>';
    } else if (tept === 'SI') {
      html += '<li>Psicoterapia especializada en trauma (TCC o EMDR)</li>';
      html += '<li>Psicoeducación sobre TEPT</li>';
      html += '<li>Seguimiento cada 3 meses</li>';
    } else {
      html += '<li>Continuar seguimiento de síntomas relacionados</li>';
      html += '<li>Evaluación de otros diagnósticos de ansiedad/depresión</li>';
      html += '<li>Seguimiento semestral</li>';
    }
    html += '</ul>';
    html += '</div>';

    html += '</div>';
    return html;
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

          // CARGAR DATOS DE ITEMS 1-26 (si existen)
          if (data.items_1_26) {
            // Items 1-11: event_type (objeto con relación a cada evento)
            if (data.items_1_26.event_type) {
              this.respuestas.event_type = data.items_1_26.event_type;
            }
            // Item 12: trauma_description
            if (data.items_1_26.trauma_description) {
              this.respuestas.trauma_description = data.items_1_26.trauma_description;
            }
            // Item 13: trauma_severity
            if (data.items_1_26.trauma_severity) {
              this.respuestas.trauma_severity = data.items_1_26.trauma_severity;
            }
            // Item 14: trauma_timing
            if (data.items_1_26.trauma_timing) {
              this.respuestas.trauma_timing = data.items_1_26.trauma_timing;
            }
            // Item 15: trauma_frequency (array)
            if (data.items_1_26.trauma_frequency) {
              this.respuestas.trauma_frequency = data.items_1_26.trauma_frequency;
            }
            // Items 16-26: characteristics (objeto con true/false)
            if (data.items_1_26.characteristics) {
              this.respuestas.characteristics = data.items_1_26.characteristics;
            }
          }

          // Mapear respuestas según formato (array o objeto)
          if (Array.isArray(data.respuestas)) {
            // Formato v2.0: array de 32 números
            // Convertir todos los valores a números (pueden venir como strings)
            const respuestasNumeros = data.respuestas.map(v => {
              const num = parseInt(v);
              return isNaN(num) ? 0 : num;
            });

            this.respuestas.items_27_31 = respuestasNumeros.slice(0, 5);
            this.respuestas.items_32_33 = respuestasNumeros.slice(5, 7);
            this.respuestas.items_34_40 = respuestasNumeros.slice(7, 14);
            this.respuestas.items_41_46 = respuestasNumeros.slice(14, 20);
            this.respuestas.items_47_49 = respuestasNumeros.slice(20, 23) || [0,0,0];
            this.respuestas.symptom_duration = respuestasNumeros[23] || 0;
            this.respuestas.symptom_onset = respuestasNumeros[24] || 0;
            this.respuestas.items_52_58 = respuestasNumeros.slice(25, 32) || [0,0,0,0,0,0,0];
          } else {
            // Formato legacy: objeto con propiedades
            this.respuestas = data.respuestas;
          }

          // Cargar metadatos si existen
          if (data.metadatos) {
            if (document.getElementById('m_nombre')) {
              document.getElementById('m_nombre').value = data.metadatos.paciente_nombre || '';
            }
            if (document.getElementById('m_fecha')) {
              document.getElementById('m_fecha').value = data.metadatos.fecha_evaluacion || '';
            }
            if (document.getElementById('m_edad')) {
              document.getElementById('m_edad').value = data.metadatos.edad || '';
            }
            if (document.getElementById('m_sexo')) {
              document.getElementById('m_sexo').value = data.metadatos.sexo || '';
            }
            if (document.getElementById('m_centro')) {
              document.getElementById('m_centro').value = data.metadatos.centro || '';
            }
            if (document.getElementById('m_evaluador')) {
              document.getElementById('m_evaluador').value = data.metadatos.evaluador || '';
            }
          }

          // Actualizar UI: primero renderizar (crear elementos), DESPUÉS cargar respuestas
          this.renderizarEventos();
          this.renderizarCaracteristicas();
          this.renderizarSintomas();
          this.renderizarFuncionamiento();

          // Esperar a que renderizado se complete (browser reflow), LUEGO cargar respuestas
          setTimeout(() => {
            this.cargarItems1_26enDOM(data);
            this.cargarRespuestasEnDOM(data);
          }, 100);

          this.actualizarProgreso();

          // Navegar a Tab 1 (datos) automáticamente
          this.irTab('datos');

          alert(`✅ Archivo "${file.name}" importado correctamente.\n\nItems 1-26 cargados en Tab 1 ✓\nDatos y síntomas cargados en Tab 2 ✓\n\nAhora haz clic en "Calcular Resultados"`);
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
      baremos: 'españa_2024',  // Unicode escape para ñ (safe en cualquier encoding)
      // Items 1-26: Datos del evento y características
      items_1_26: {
        event_type: this.respuestas.event_type || {},
        trauma_description: this.respuestas.trauma_description || '',
        trauma_severity: this.respuestas.trauma_severity || null,
        trauma_timing: this.respuestas.trauma_timing || null,
        trauma_frequency: this.respuestas.trauma_frequency || [],
        characteristics: this.respuestas.characteristics || {}
      },
      // Items 27-58: Síntomas (32 valores)
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
    const blob = new Blob([json], { type: 'application/json; charset=utf-8' });
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

    // Generar informe automáticamente cuando se navega a la pestaña "informe"
    if (tabName === 'informe' && this.resultados) {
      this.generarInformeImprimible();
    }

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

        if (!data.respuestas || data.respuestas.length < 31) {
          throw new Error(`El archivo debe tener al menos 32 respuestas (tiene ${data.respuestas.length})`);
        }

        if (!data.respuestas.slice(0, Math.min(32, data.respuestas.length)).every(r => typeof r === 'number' && r >= 0 && r <= 4)) {
          throw new Error('Las respuestas deben ser números entre 0 y 4');
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

        // 2. Cargar metadatos del paciente
        if (data.metadatos) {
          if (data.metadatos.paciente_nombre) localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
          if (data.metadatos.paciente_id) sessionStorage.setItem('pacienteSeleccionado', data.metadatos.paciente_id);
          if (data.metadatos.evaluador) localStorage.setItem('nombre', data.metadatos.evaluador);
        }

        // 3. Ir a Tab 2 para renderizar elementos antes de cargar respuestas
        this.irTab('test');

        // 4. Esperar a que se rendericen los elementos (1.5s)
        setTimeout(() => {
          this.cargarRespuestasEnDOM(data);

          // 5. Recalcular diagnóstico desde respuestas cargadas
          const resultado = this.diagnosticarTEPT();
          this.resultados = resultado;

          // 6. Mostrar resultados
          this.mostrarResultados(resultado);

          // 7. Navegar a resultados
          this.irTab('resultados');

          // 8. Mostrar éxito
          this.mostrarMensajeExito(`✅ JSON importado correctamente<br>Respuestas cargadas: ${data.respondidas || 58}/58<br>Diagnóstico: ${resultado.tept === 'SI' ? '✓ TEPT PRESENTE' : '✗ TEPT AUSENTE'}`);
        }, 1500);

      } catch (error) {
        this.mostrarMensajeError(`❌ Error: ${error.message}`);
        console.error('Error al importar JSON:', error);
      }
    };
    reader.readAsText(file);
  },

  construirArrayRespuestas() {
    const data = [];
    data.push(...this.respuestas.items_27_31);    // 0-4 (5 items)
    data.push(...this.respuestas.items_32_33);    // 5-6 (2 items)
    data.push(...this.respuestas.items_34_40);    // 7-13 (7 items)
    data.push(...this.respuestas.items_41_46);    // 14-19 (6 items)
    data.push(...this.respuestas.items_47_49);    // 20-22 (3 items) ← AGREGADO
    data.push(this.respuestas.symptom_duration || 0);  // 23
    data.push(this.respuestas.symptom_onset || 0);     // 24
    data.push(...this.respuestas.items_52_58);    // 25-31 (7 items)
    return data;
  },

  cargarItems1_26enDOM(data) {
    console.log('📍 cargarItems1_26enDOM: iniciando carga de items 1-26...');

    if (!data.items_1_26) {
      console.log('⚠️ No hay datos para items 1-26');
      return;
    }

    const items = data.items_1_26;

    // Items 1-11: Marcar radios de eventos traumáticos
    if (items.event_type && typeof items.event_type === 'object') {
      Object.entries(items.event_type).forEach(([eventNum, valor]) => {
        const radio = document.querySelector(`input[name="event_${eventNum}"][value="${valor}"]`);
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Evento ${eventNum} marcado: ${valor}`);
        }
      });
    }

    // Item 12: Llenar descripción del evento
    if (items.trauma_description) {
      const textarea = document.getElementById('test_evento_desc');
      if (textarea) {
        textarea.value = items.trauma_description;
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Descripción del evento cargada');
      }
    }

    // Item 13: Marcar radio de gravedad
    if (items.trauma_severity) {
      const radio = document.querySelector(`input[name="item13"][value="${items.trauma_severity}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Gravedad marcada: ${items.trauma_severity}`);
      }
    }

    // Item 14: Marcar radio de cuándo ocurrió
    if (items.trauma_timing) {
      const radio = document.querySelector(`input[name="item14"][value="${items.trauma_timing}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Cuándo ocurrió marcado: ${items.trauma_timing}`);
      }
    }

    // Item 15: Marcar checkboxes de frecuencia
    if (items.trauma_frequency && Array.isArray(items.trauma_frequency)) {
      items.trauma_frequency.forEach(freq => {
        const checkbox = document.querySelector(`input[name="item15"][value="${freq}"]`);
        if (checkbox) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Frecuencia marcada: ${freq}`);
        }
      });
    }

    // Items 16-26: Marcar radios de características
    if (items.characteristics && typeof items.characteristics === 'object') {
      Object.entries(items.characteristics).forEach(([itemNum, valor]) => {
        const valorStr = valor === true ? 'si' : valor === false ? 'no' : null;
        if (valorStr) {
          const radio = document.querySelector(`input[name="caract_${itemNum}"][value="${valorStr}"]`);
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Característica ${itemNum} marcada: ${valorStr}`);
          }
        }
      });
    }

    console.log('✅ Items 1-26 cargados en DOM');
  },

  cargarRespuestasEnDOM(data) {
    console.log('📍 cargarRespuestasEnDOM: iniciando carga...', data.respuestas.length, 'items');

    // Convertir todos los valores a números (pueden venir como strings)
    const respuestasNumeros = data.respuestas.map(v => {
      const num = parseInt(v);
      return isNaN(num) ? 0 : num;
    });

    // Helper para cargar síntoma con Sí/No Y molestia
    const cargarSintoma = (numero, molestia) => {
      if (molestia > 0) {
        // Si hay molestia, marcar Sí
        const radioSi = document.querySelector(`input[name="symptom_respuesta_${numero}"][value="si"]`);
        if (radioSi) {
          radioSi.checked = true;
          radioSi.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Marcado Sí para item ${numero}`);
        } else {
          console.log(`⚠️ NO encontrado radio Sí para item ${numero}`);
        }
      } else {
        // Si molestia es 0, marcar No
        const radioNo = document.querySelector(`input[name="symptom_respuesta_${numero}"][value="no"]`);
        if (radioNo) {
          radioNo.checked = true;
          radioNo.dispatchEvent(new Event('change', { bubbles: true }));
          console.log(`✅ Marcado No para item ${numero}`);
        } else {
          console.log(`⚠️ NO encontrado radio No para item ${numero}`);
        }
      }
      // Siempre cargar el valor de molestia
      const radioMolestia = document.querySelector(`input[name="symptom_${numero}"][value="${molestia}"]`);
      if (radioMolestia) {
        radioMolestia.checked = true;
        radioMolestia.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`✅ Marcada molestia ${molestia} para item ${numero}`);
      } else {
        console.log(`⚠️ NO encontrado radio molestia ${molestia} para item ${numero}`);
      }
    };

    // Items 27-31 (Síntomas Intrusivos)
    respuestasNumeros.slice(0, 5).forEach((resp, i) => {
      const numero = 27 + i;
      cargarSintoma(numero, resp);
    });

    // Items 32-33 (Evitación)
    respuestasNumeros.slice(5, 7).forEach((resp, i) => {
      const numero = 32 + i;
      cargarSintoma(numero, resp);
    });

    // Items 34-40 (Alteraciones Cognitivas)
    respuestasNumeros.slice(7, 14).forEach((resp, i) => {
      const numero = 34 + i;
      cargarSintoma(numero, resp);
    });

    // Items 41-46 (Activación)
    respuestasNumeros.slice(14, 20).forEach((resp, i) => {
      const numero = 41 + i;
      cargarSintoma(numero, resp);
    });

    // Items 47-49 (Síntomas Disociativos)
    respuestasNumeros.slice(20, 23).forEach((resp, i) => {
      const numero = 47 + i;
      cargarSintoma(numero, resp);
    });

    // Item 50 (Duración) - índice 23
    if (respuestasNumeros[23]) {
      this.respuestas.symptom_duration = respuestasNumeros[23];
    }

    // Item 51 (Onset) - índice 24
    if (respuestasNumeros[24]) {
      this.respuestas.symptom_onset = respuestasNumeros[24];
    }

    // Items 52-58 (Funcionamiento) - índices 25-31
    respuestasNumeros.slice(25, 32).forEach((resp, i) => {
      const numero = 52 + i;
      const radio = document.querySelector(`input[name="item_${numero}"][value="si"]`);
      if (radio && resp === 1) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
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

  crearContenedorPDFCompleto() {
    // Crear contenedor temporal con TODOS los resultados (Tab 3 + 4 + 5)
    const tempContainer = document.createElement('div');
    tempContainer.style.display = 'none';

    // Copiar Tab 3 (Resultados)
    const tab3 = document.getElementById('tab-resultados');
    if (tab3) {
      const tab3Clone = tab3.cloneNode(true);
      // Remover botones del clone
      const botones = tab3Clone.querySelector('.button-group');
      if (botones) botones.remove();
      tempContainer.appendChild(tab3Clone);
    }

    // Copiar Tab 4 (Gráfico)
    const tab4 = document.getElementById('tab-perfil');
    if (tab4) {
      const tab4Clone = tab4.cloneNode(true);
      const instruction = tab4Clone.querySelector('.egep5-instruction');
      if (instruction) instruction.style.pageBreakBefore = 'always';
      tempContainer.appendChild(tab4Clone);
    }

    // Copiar Tab 5 (Interpretación)
    const tab5 = document.getElementById('tab-interpretacion');
    if (tab5) {
      const tab5Clone = tab5.cloneNode(true);
      const instruction = tab5Clone.querySelector('.egep5-instruction');
      if (instruction) instruction.style.pageBreakBefore = 'always';
      tempContainer.appendChild(tab5Clone);
    }

    return tempContainer;
  },

  generarPDF() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }

    const pdfContainer = document.getElementById('egep5-resultados-pdf');
    if (!pdfContainer) {
      alert('❌ No hay contenedor de resultados para PDF');
      return;
    }

    const nombre_paciente = localStorage.getItem('paciente_nombre') || 'Paciente';
    const opt = {
      margin: [7, 7, 7, 7],  // 7mm márgenes (profesional)
      filename: `EGEP-5_${nombre_paciente}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: 'avoid-all' }  // Mantener juntos los elementos
    };

    html2pdf().set(opt).from(pdfContainer).save();
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
    const totalIntensidad = this.resultados.pd.I + this.resultados.pd.E + this.resultados.pd.C + this.resultados.pd.A;
    const subescalas = {
      reexperimentacion: this.resultados.pd.I,
      evitacion: this.resultados.pd.E,
      cognitivas_animo: this.resultados.pd.C,
      activacion: this.resultados.pd.A,
      funcionamiento: this.respuestas.items_52_58.filter(x => x > 0).length,
      intensidad_total: totalIntensidad,
      _criterios_dsm5: this.resultados.criterios,
      _tept_presente: this.resultados.tept,
      _evaluador: localStorage.getItem('nombre') || 'Sin especificar'
    };

    // Guardar via API
    const pacienteId = sessionStorage.getItem('pacienteSeleccionado');
    api.guardarPrueba(
      pacienteId,
      'EGEP-5',
      data,
      totalIntensidad,
      subescalas,
      localStorage.getItem('nombre')
    ).then(resultado => {
      alert('✅ Resultados guardados en expediente correctamente');
      window.history.back();
    }).catch(error => {
      alert('❌ Error al guardar: ' + error.message);
      console.error('Error:', error);
    });
  },

  guardarEnExpediente() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados antes de guardar.');
      return;
    }

    const btn = document.getElementById('btn-egep5-guardar');
    const btnOriginalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';

    // Preparar datos numéricos para guardar
    const data = [];
    data.push(...this.respuestas.items_27_31);
    data.push(...this.respuestas.items_32_33);
    data.push(...this.respuestas.items_34_40);
    data.push(...this.respuestas.items_41_46);
    data.push(this.respuestas.symptom_duration || 0, this.respuestas.symptom_onset || 0);
    data.push(...this.respuestas.items_52_58);

    const totalIntensidad = this.resultados.pd.I + this.resultados.pd.E + this.resultados.pd.C + this.resultados.pd.A;
    const subescalas = {
      reexperimentacion: this.resultados.pd.I,
      evitacion: this.resultados.pd.E,
      cognitivas_animo: this.resultados.pd.C,
      activacion: this.resultados.pd.A,
      funcionamiento: this.respuestas.items_52_58.filter(x => x > 0).length,
      intensidad_total: totalIntensidad,
      _criterios_dsm5: this.resultados.criterios,
      _tept_presente: this.resultados.tept,
      _evaluador: localStorage.getItem('nombre') || 'Sin especificar'
    };

    // Usar api.guardarPrueba() para guardar datos numéricos
    api.guardarPrueba(
      sessionStorage.getItem('pacienteSeleccionado'),
      'EGEP-5',
      data,
      totalIntensidad,
      subescalas,
      localStorage.getItem('nombre')
    ).then(resultado => {
      btn.disabled = false;
      btn.textContent = btnOriginalText;
      alert('✅ Resultados guardados en expediente correctamente');
      // window.history.back();  ← Comentado: mantener ventana abierta para exportar JSON y PDF
    }).catch(error => {
      btn.disabled = false;
      btn.textContent = btnOriginalText;
      alert('❌ Error al guardar: ' + error.message);
      console.error('Error:', error);
    });
  },

  generarHistograma() {
    if (!this.respuestas || Object.keys(this.respuestas).length === 0) return;

    // Contar respuestas por escala (0, 1, 2, 3, 4)
    const respuestasArray = [];
    respuestasArray.push(...this.respuestas.items_27_31 || []);
    respuestasArray.push(...this.respuestas.items_32_33 || []);
    respuestasArray.push(...this.respuestas.items_34_40 || []);
    respuestasArray.push(...this.respuestas.items_41_46 || []);
    respuestasArray.push(this.respuestas.symptom_duration || 0);
    respuestasArray.push(this.respuestas.symptom_onset || 0);
    respuestasArray.push(...this.respuestas.items_52_58 || []);

    const conteos = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    respuestasArray.forEach(r => {
      if (r >= 0 && r <= 4) conteos[r]++;
    });

    const canvas = document.getElementById('egep5-histograma');
    if (!canvas || !window.Chart) return;

    // Destruir gráfico anterior si existe
    if (this.charInstance) this.charInstance.destroy();

    const ctx = canvas.getContext('2d');
    this.charInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No (0)', 'Leve (1)', 'Moderado (2)', 'Severo (3)', 'Muy Severo (4)'],
        datasets: [{
          label: 'Cantidad de respuestas',
          data: [conteos[0], conteos[1], conteos[2], conteos[3], conteos[4]],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'],
          borderColor: ['#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#16a34a'],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12 }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  },

  descargarPDF() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }

    const paciente_nombre = document.getElementById('m_nombre')?.value || localStorage.getItem('paciente_nombre') || 'Paciente';
    const contenedorPDF = document.getElementById('egep5-informe-contenido');

    if (!contenedorPDF) {
      alert('No se encontró el contenedor del informe');
      return;
    }

    const opt = {
      margin: 10,
      filename: `EGEP5_${paciente_nombre}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    html2pdf().set(opt).from(contenedorPDF).save();
  },

  generarInformeImprimible() {
    if (!this.resultados) {
      alert('Por favor, calcula los resultados primero');
      return;
    }

    const paciente_nombre = document.getElementById('m_nombre')?.value || '-';
    const edad = document.getElementById('m_edad')?.value || '-';
    const sexo = document.getElementById('m_sexo')?.value || '-';
    const fecha = document.getElementById('m_fecha')?.value || '-';
    const centro = document.getElementById('m_centro')?.value || '-';
    const evaluador = document.getElementById('m_evaluador')?.value || '-';
    const descripcion = document.getElementById('test_evento_desc')?.value || 'No especificada';

    const pd = this.resultados.pd;
    const total = pd.I + pd.E + pd.C + pd.A;

    // Contar síntomas por escala
    const countI = this.respuestas.items_27_31.filter(x => x > 0).length;
    const countE = this.respuestas.items_32_33.filter(x => x > 0).length;
    const countC = this.respuestas.items_34_40.filter(x => x > 0).length;
    const countA = this.respuestas.items_41_46.filter(x => x > 0).length;
    const countF = this.respuestas.items_52_58.filter(x => x > 0).length;

    // Calcular posiciones Y en el gráfico (SVG) basado en percentiles con interpolación lineal
    const calcYPos = (pd, maxPD) => {
      const pc = Math.min(99, Math.max(1, (pd / maxPD) * 99));

      if (pc >= 85) return 30 + (99 - pc) / (99 - 85) * 100; // 30 a 130
      if (pc >= 60) return 130 + (85 - pc) / (85 - 60) * 110; // 130 a 240
      if (pc >= 40) return 240 + (60 - pc) / (60 - 40) * 100; // 240 a 340
      if (pc >= 15) return 340 + (40 - pc) / (40 - 15) * 60; // 340 a 400
      if (pc >= 10) return 400 + (15 - pc) / (15 - 10) * 50; // 400 a 450
      return 450 + (10 - pc) / 10 * 70; // 450 a 520
    };

    const yI = calcYPos(pd.I, 20);
    const yE = calcYPos(pd.E, 8);
    const yC = calcYPos(pd.C, 28);
    const yA = calcYPos(pd.A, 24);
    const yTotal = calcYPos(total, 80);
    const yF = calcYPos(countF, 7);

    let html = `
    <style>
      :root {
        --primary: #5c1d38;
        --text-dark: #212529;
        --text-muted: #6c757d;
        --border-color: #dee2e6;
        --accent-bg: #f3e8ee;
      }
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      .container { max-width: 1100px; margin: 0 auto; background: white; }
      header { background: var(--primary); color: white; padding: 20px; }
      header h1 { margin: 0; font-size: 1.8em; }
      .subtitle { font-size: 0.9em; opacity: 0.9; }
      .content-grid { display: grid; grid-template-columns: 1fr 350px; gap: 20px; padding: 20px; }
      .section-card { border: 1px solid var(--border-color); border-radius: 6px; padding: 15px; margin-bottom: 15px; }
      .section-title { color: var(--primary); font-weight: bold; border-bottom: 2px solid var(--accent-bg); padding-bottom: 6px; margin-bottom: 10px; font-size: 1em; text-transform: uppercase; }
      .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
      .info-item { font-size: 0.9em; }
      .info-label { font-size: 0.75em; text-transform: uppercase; color: var(--text-muted); font-weight: bold; }
      .info-value { background: #f1f3f5; padding: 5px 8px; border-radius: 3px; margin-top: 3px; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; font-size: 0.9em; margin-top: 8px; }
      th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--border-color); }
      th { background: var(--accent-bg); color: var(--primary); font-weight: bold; font-size: 0.8em; }
      .status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: bold; }
      .status-yes { background: #d4edda; color: #155724; }
      .status-no { background: #f8d7da; color: #721c24; }
      .score-box { display: inline-block; min-width: 24px; text-align: center; font-weight: bold; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
      .profile-container { background: #faf9f9; border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; }
      .chart-wrapper { background: white; border: 1px solid var(--border-color); border-radius: 4px; }
      @media print { .content-grid { display: grid; grid-template-columns: 1fr 1fr; } }
    </style>

    <div class="container">
      <header>
        <h1>EGEP-5</h1>
        <div class="subtitle">Evaluación Global del Estrés Postraumático (DSM-5) · HOJA DE CORRECCIÓN</div>
      </header>

      <div class="content-grid">
        <div>
          <!-- DATOS DEL PACIENTE -->
          <div class="section-card">
            <div class="section-title">Datos del Evaluado</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Nombre / Iniciales</span>
                <span class="info-value">${paciente_nombre}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Edad</span>
                <span class="info-value">${edad}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Sexo</span>
                <span class="info-value">${sexo}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fecha</span>
                <span class="info-value">${fecha}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Centro</span>
                <span class="info-value">${centro}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Evaluador</span>
                <span class="info-value">${evaluador}</span>
              </div>
            </div>
          </div>

          <!-- ACONTECIMIENTO SUFRIDO -->
          <div class="section-card">
            <div class="section-title">Acontecimiento Sufrido</div>
            <p style="font-style: italic; font-size: 0.9em; background: #f8f9fa; padding: 10px; border-left: 4px solid var(--primary); border-radius: 0 4px 4px 0;">
              "${descripcion}"
            </p>
          </div>

          <!-- EVALUACIÓN POR CRITERIOS -->
          <div class="section-card">
            <div class="section-title">Evaluación por Criterios (DSM-5)</div>
            <table>
              <thead>
                <tr>
                  <th>Criterio / Escala</th>
                  <th style="text-align: center; width: 70px;">N.º Síntomas</th>
                  <th style="text-align: center; width: 70px;">Intensidad (PD)</th>
                  <th style="text-align: center; width: 100px;">Cumple Criterio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A. Exposición a Acontecimiento Traumático</strong><br><small style="color:var(--text-muted)">Ítems 1-11 y Ítem 14</small></td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;"><span class="status-badge status-yes">SÍ</span></td>
                </tr>
                <tr>
                  <td><strong>B. Síntomas Intrusivos (I)</strong><br><small style="color:var(--text-muted)">Ítems 27 a 31 (Mínimo: 1)</small></td>
                  <td style="text-align: center;"><span class="score-box">${countI}</span> / 5</td>
                  <td style="text-align: center;"><span class="score-box">${pd.I}</span> / 20</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.B ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.B ? 'SÍ' : 'NO'}</span></td>
                </tr>
                <tr>
                  <td><strong>C. Evitación (E)</strong><br><small style="color:var(--text-muted)">Ítems 32 a 33 (Mínimo: 1)</small></td>
                  <td style="text-align: center;"><span class="score-box">${countE}</span> / 2</td>
                  <td style="text-align: center;"><span class="score-box">${pd.E}</span> / 8</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.C ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.C ? 'SÍ' : 'NO'}</span></td>
                </tr>
                <tr>
                  <td><strong>D. Alteraciones Cognitivas y Ánimo (C)</strong><br><small style="color:var(--text-muted)">Ítems 34 a 40 (Mínimo: 2)</small></td>
                  <td style="text-align: center;"><span class="score-box">${countC}</span> / 7</td>
                  <td style="text-align: center;"><span class="score-box">${pd.C}</span> / 28</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.D ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.D ? 'SÍ' : 'NO'}</span></td>
                </tr>
                <tr>
                  <td><strong>E. Alteraciones Activación / Reactividad (A)</strong><br><small style="color:var(--text-muted)">Ítems 41 a 46 (Mínimo: 2)</small></td>
                  <td style="text-align: center;"><span class="score-box">${countA}</span> / 6</td>
                  <td style="text-align: center;"><span class="score-box">${pd.A}</span> / 24</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.E ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.E ? 'SÍ' : 'NO'}</span></td>
                </tr>
                <tr>
                  <td><strong>F. Duración</strong><br><small style="color:var(--text-muted)">Ítem 50 (> 1 mes)</small></td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.F ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.F ? 'SÍ' : 'NO'}</span></td>
                </tr>
                <tr>
                  <td><strong>G. Funcionamiento (F)</strong><br><small style="color:var(--text-muted)">Ítems 52 a 58 (Mínimo: 2)</small></td>
                  <td style="text-align: center;"><span class="score-box">${countF}</span> / 7</td>
                  <td style="text-align: center;">-</td>
                  <td style="text-align: center;"><span class="status-badge ${this.resultados.criterios?.G ? 'status-yes' : 'status-no'}">${this.resultados.criterios?.G ? 'SÍ' : 'NO'}</span></td>
                </tr>
              </tbody>
            </table>
            <div style="background: var(--accent-bg); border-radius: 6px; padding: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-weight: bold; color: var(--primary);">
              <span>PUNTUACIÓN DIRECTA TOTAL INTENSIDAD SÍNTOMAS:</span>
              <span style="font-size: 1.1em; background: var(--primary); color: white; padding: 2px 10px; border-radius: 3px;">PD = ${total}</span>
            </div>
          </div>

          <!-- DIAGNÓSTICO FINAL -->
          <div class="section-card" style="border-left: 4px solid ${this.resultados.tept === 'SI' ? '#28a745' : '#dc3545'};">
            <div class="section-title" style="color: ${this.resultados.tept === 'SI' ? '#155724' : '#721c24'};">Diagnóstico Global</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: bold; font-size: 1.05em;">DIAGNÓSTICO DE TEPT:</span>
              <span class="status-badge ${this.resultados.tept === 'SI' ? 'status-yes' : 'status-no'}" style="font-size: 0.95em; padding: 6px 14px;">
                ${this.resultados.tept === 'SI' ? 'CUMPLE CRITERIOS (SÍ)' : 'NO CUMPLE CRITERIOS'}
              </span>
            </div>
            <p style="font-size: 0.85em; color: var(--text-muted);">
              ${this.resultados.tept === 'SI' ?
                'Se cumplen satisfactoriamente todos los criterios diagnósticos del A al G según los estándares DSM-5 / EGEP-5.' :
                'El paciente no cumple todos los criterios requeridos para el diagnóstico de TEPT según DSM-5.'}
            </p>
          </div>

          <!-- ESPECIFICACIONES DIAGNÓSTICAS (Solo si cumple TEPT) -->
          ${this.resultados.tept === 'SI' ? `
          <div class="section-card" style="background-color: #faf9f9; border-top: 3px solid var(--primary);">
            <div class="section-title" style="font-size: 0.95em;">Especificaciones Diagnósticas</div>
            <p style="font-size: 0.8em; color: var(--text-muted); margin-bottom: 12px;">
              <em>Evaluadas al cumplirse el diagnóstico completo de TEPT:</em>
            </p>

            <!-- Con Síntomas Disociativos -->
            <div style="margin-bottom: 12px; padding: 8px; background: #fff; border-radius: 4px; border: 1px solid var(--border-color);">
              <strong style="font-size: 0.85em; color: var(--primary);">Con síntomas disociativos:</strong>
              <div style="margin-left: 10px; margin-top: 4px; font-size: 0.85em;">
                <div>
                  <span class="status-badge ${this.respuestas.items_47_49[0] > 0 ? 'status-yes' : 'status-no'}">
                    ${this.respuestas.items_47_49[0] > 0 ? 'SÍ' : 'NO'}
                  </span>
                  <strong>Despersonalización:</strong> Responde afirmativamente al <em>Ítem 47</em>.
                </div>
                <div style="margin-top: 4px;">
                  <span class="status-badge ${(this.respuestas.items_47_49[1] > 0 || this.respuestas.items_47_49[2] > 0) ? 'status-yes' : 'status-no'}">
                    ${(this.respuestas.items_47_49[1] > 0 || this.respuestas.items_47_49[2] > 0) ? 'SÍ' : 'NO'}
                  </span>
                  <strong>Desrealización:</strong> Responde afirmativamente al <em>Ítem 48 o 49</em>.
                </div>
              </div>
            </div>

            <!-- Con Expresión Retardada -->
            <div style="padding: 8px; background: #fff; border-radius: 4px; border: 1px solid var(--border-color);">
              <strong style="font-size: 0.85em; color: var(--primary);">Con expresión retardada:</strong>
              <div style="margin-left: 10px; margin-top: 4px; font-size: 0.85em;">
                <span class="status-badge ${this.respuestas.symptom_onset === '3m' ? 'status-yes' : 'status-no'}">
                  ${this.respuestas.symptom_onset === '3m' ? 'SÍ' : 'NO'}
                </span>
                Ha marcado <em>"6 meses o más después del acontecimiento"</em> en el <em>Ítem 51</em>.
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- GRÁFICO PERFIL PROFESIONAL -->
        <div>
          <div class="profile-container">
            <div class="baremo-header" style="text-align: center; font-size: 0.8em; font-weight: bold; color: white; background: var(--primary); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
              PERFIL BAREMADO DE EVALUACIÓN<br>
              <span style="font-weight: normal; font-size: 0.7em;">España | Baremo Clínico | Varones + Mujeres</span>
            </div>
            <div class="chart-wrapper">
              <svg viewBox="0 0 340 460" width="100%" height="auto" style="font-family: 'Segoe UI', system-ui, sans-serif; background-color: #ffffff; max-width: 100%;">
                <defs>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.25"/>
                  </filter>
                </defs>

                <!-- ZONAS DE SIGNIFICACIÓN CLÍNICA -->
                <rect x="55" y="30" width="270" height="100" fill="#f8d7da" opacity="0.45"/>
                <rect x="55" y="130" width="270" height="110" fill="#fff3cd" opacity="0.45"/>
                <rect x="55" y="240" width="270" height="160" fill="#d1e7dd" opacity="0.35"/>
                <rect x="55" y="400" width="270" height="120" fill="#e2e3e5" opacity="0.4"/>

                <!-- MEDIANA POBLACIONAL (Pc 50) -->
                <rect x="55" y="278" width="270" height="24" fill="#5c1d38" opacity="0.12"/>
                <line x1="55" y1="290" x2="325" y2="290" stroke="#5c1d38" stroke-width="2" stroke-dasharray="4,2"/>
                <text x="328" y="294" font-size="9" font-weight="bold" fill="#5c1d38">Pc 50</text>

                <!-- RETÍCULA DE PERCENTILES -->
                <line x1="55" y1="30" x2="325" y2="30" stroke="#b8daff" stroke-width="1"/>
                <line x1="55" y1="130" x2="325" y2="130" stroke="#adb5bd" stroke-width="1.5"/>
                <line x1="55" y1="240" x2="325" y2="240" stroke="#ccc" stroke-dasharray="2,2"/>
                <line x1="55" y1="340" x2="325" y2="340" stroke="#ccc" stroke-dasharray="2,2"/>
                <line x1="55" y1="400" x2="325" y2="400" stroke="#adb5bd" stroke-width="1.5"/>
                <line x1="55" y1="450" x2="325" y2="450" stroke="#ccc" stroke-dasharray="2,2"/>
                <line x1="55" y1="520" x2="325" y2="520" stroke="#adb5bd" stroke-width="1"/>

                <!-- MARCAS DE PERCENTILES IZQUIERDA -->
                <text x="48" y="34" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">99</text>
                <text x="48" y="134" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">85</text>
                <text x="48" y="244" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">60</text>
                <text x="48" y="294" font-size="10" font-weight="bold" text-anchor="end" fill="#5c1d38">50</text>
                <text x="48" y="344" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">40</text>
                <text x="48" y="404" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">15</text>
                <text x="48" y="454" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">10</text>
                <text x="48" y="524" font-size="10" font-weight="bold" text-anchor="end" fill="#495057">1</text>

                <!-- COLUMNAS VERTICALES -->
                <g stroke="#dee2e6" stroke-width="1">
                  <line x1="80" y1="30" x2="80" y2="520"/>
                  <line x1="125" y1="30" x2="125" y2="520"/>
                  <line x1="170" y1="30" x2="170" y2="520"/>
                  <line x1="215" y1="30" x2="215" y2="520"/>
                  <line x1="260" y1="30" x2="260" y2="520"/>
                  <line x1="305" y1="30" x2="305" y2="520"/>
                </g>

                <!-- ENCABEZADOS DE ESCALAS -->
                <text x="80" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">I</text>
                <text x="125" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">E</text>
                <text x="170" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">C</text>
                <text x="215" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">A</text>
                <text x="260" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">Total</text>
                <text x="305" y="20" font-size="11" font-weight="bold" text-anchor="middle" fill="#5c1d38">F</text>

                <!-- ETIQUETAS DE NIVEL LATERALES -->
                <text x="18" y="80" font-size="10" font-weight="bold" fill="#721c24" transform="rotate(-90 18 80)" text-anchor="middle">ALTO</text>
                <text x="18" y="185" font-size="9" font-weight="bold" fill="#856404" transform="rotate(-90 18 185)" text-anchor="middle">MEDIO-ALTO</text>
                <text x="18" y="320" font-size="9" font-weight="bold" fill="#155724" transform="rotate(-90 18 320)" text-anchor="middle">MEDIO-BAJO</text>
                <text x="18" y="460" font-size="10" font-weight="bold" fill="#383d41" transform="rotate(-90 18 460)" text-anchor="middle">BAJO</text>

                <!-- POLÍGONO DE PERFIL -->
                <polyline points="80,${yI} 125,${yE} 170,${yC} 215,${yA} 260,${yTotal} 305,${yF}"
                          fill="none" stroke="#000000" stroke-width="3" filter="url(#shadow)"/>

                <!-- NODOS INTERACTIVOS -->
                <g fill="#000000" stroke="#ffffff" stroke-width="2">
                  <circle cx="80" cy="${yI}" r="5.5"/>
                  <circle cx="125" cy="${yE}" r="5.5"/>
                  <circle cx="170" cy="${yC}" r="5.5"/>
                  <circle cx="215" cy="${yA}" r="5.5"/>
                  <circle cx="260" cy="${yTotal}" r="5.5"/>
                  <circle cx="305" cy="${yF}" r="5.5"/>
                </g>

                <!-- VALORES PD EN BASE -->
                <rect x="55" y="365" width="270" height="22" fill="#f1f3f5" rx="4"/>
                <text x="80" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${pd.I}</text>
                <text x="125" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${pd.E}</text>
                <text x="170" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${pd.C}</text>
                <text x="215" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${pd.A}</text>
                <text x="260" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${total}</text>
                <text x="305" y="380" font-size="9" font-weight="bold" text-anchor="middle" fill="#212529">PD: ${countF}</text>

                <!-- CUADRO INTERPRETATIVO -->
                <g transform="translate(15, 395)">
                  <rect x="0" y="0" width="310" height="50" fill="#ffffff" stroke="#dee2e6" rx="4"/>
                  <text x="10" y="15" font-size="8.5" font-weight="bold" fill="#5c1d38">CÓMO INTERPRETAR:</text>
                  <circle cx="15" cy="28" r="3" fill="#5c1d38"/>
                  <text x="23" y="31" font-size="7.5" fill="#495057"><tspan font-weight="bold">Línea Punteada (Pc 50):</tspan> Promedio normal.</text>
                  <circle cx="15" cy="39" r="3" fill="#000000"/>
                  <text x="23" y="42" font-size="7.5" fill="#495057"><tspan font-weight="bold">Línea Negra:</tspan> Puntuación real del paciente.</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    document.getElementById('egep5-informe-contenido').innerHTML = html;
  },

};
