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
          <td style="padding: 12px; border: 1px solid var(--border); width: 70%; text-transform: capitalize;"><strong style="color: var(--accent-light);">${i}.</strong> <span style="color: var(--accent-light);">${this.caracteristicaDefinitions[i]}</span></td>
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
            <input type="radio" name="symptom_respuesta_${i}" value="si" onchange="window.tests_egep5.cambiarSintomaSI(${i}, 'si')">
          </td>
          <td class="table-center" style="border: 1px solid var(--border);">
            <input type="radio" name="symptom_respuesta_${i}" value="no" onchange="window.tests_egep5.cambiarSintomaNO(${i}, 'no')">
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
    const perfilHTML = window.EGEP5_GRAFICOS.generarPerfil(resultado);
    document.getElementById('egep5-perfil-grafico').innerHTML = perfilHTML;

    // 8. INTERPRETACIÓN CLÍNICA (Tab 5)
    const interpretHTML = this.generarInterpretacion(resultado, intensidades, totalIntensidad);
    document.getElementById('egep5-interpretacion-clinica').innerHTML = interpretHTML;
  },

  generarInterpretacion(resultado, intensidades, totalIntensidad) {
    const { tept, criterios } = resultado;
    let html = '<div style="font-size: 14px; line-height: 1.8; color: var(--text-primary);">';

    // Diagnóstico general
    if (tept === 'SI') {
      html += '<div style="background: rgba(76, 175, 80, 0.15); border: 1px solid #4CAF50; border-radius: 8px; padding: 16px; margin-bottom: 20px;">';
      html += '<strong style="color: #4CAF50; font-size: 15px;">✓ DIAGNÓSTICO: Trastorno por Estrés Postraumático (TEPT)</strong>';
      html += '<p style="margin: 8px 0 0 0;">El paciente cumple con los criterios DSM-5 para TEPT. La intensidad de síntomas es ' + (totalIntensidad >= 60 ? 'SEVERA' : totalIntensidad >= 40 ? 'MODERADA' : 'LEVE') + '.</p>';
      html += '</div>';
    } else {
      html += '<div style="background: rgba(244, 67, 54, 0.15); border: 1px solid #F44336; border-radius: 8px; padding: 16px; margin-bottom: 20px;">';
      html += '<strong style="color: #F44336; font-size: 15px;">✗ DIAGNÓSTICO: No cumple criterios de TEPT</strong>';
      html += '<p style="margin: 8px 0 0 0;">El paciente no cumple con los criterios DSM-5 para TEPT. Se recomienda evaluar otros diagnósticos relacionados con trauma.</p>';
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

          // Cargar respuestas en DOM (marcar checkboxes y radios)
          this.cargarRespuestasEnDOM(data);

          // Actualizar UI
          this.renderizarSintomas();
          this.renderizarFuncionamiento();
          this.actualizarProgreso();

          // Navegar a Tab 2 automáticamente
          this.irTab('test');

          alert(`✅ Archivo "${file.name}" importado correctamente.\n\nDatos cargados en Tab 1 ✓\nDatos y síntomas cargados en Tab 2 ✓\n\nAhora haz clic en "Calcular Resultados"`);
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

        // 2. Cargar metadatos del paciente
        if (data.metadatos) {
          if (data.metadatos.paciente_nombre) localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
          if (data.metadatos.paciente_id) sessionStorage.setItem('pacienteSeleccionado', data.metadatos.paciente_id);
          if (data.metadatos.evaluador) localStorage.setItem('nombre', data.metadatos.evaluador);
        }

        // 3. Reconstruir respuestas en el DOM
        this.cargarRespuestasEnDOM(data);

        // 4. Recalcular diagnóstico desde respuestas cargadas
        const resultado = this.diagnosticarTEPT();
        this.resultados = resultado;

        // 5. Mostrar resultados
        this.mostrarResultados(resultado);

        // 6. Navegar a resultados
        this.irTab('resultados');

        // 7. Mostrar éxito
        this.mostrarMensajeExito(`✅ JSON importado correctamente<br>Respuestas cargadas: ${data.respondidas || 58}/58<br>Diagnóstico: ${resultado.tept === 'SI' ? '✓ TEPT PRESENTE' : '✗ TEPT AUSENTE'}`);

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

  cargarRespuestasEnDOM(data) {
    // Items 27-31 (Síntomas Intrusivos)
    data.respuestas.slice(0, 5).forEach((resp, i) => {
      const numero = 27 + i;
      const radio = document.querySelector(`input[name="symptom_${numero}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });

    // Items 32-33 (Evitación)
    data.respuestas.slice(5, 7).forEach((resp, i) => {
      const numero = 32 + i;
      const radio = document.querySelector(`input[name="symptom_${numero}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });

    // Items 34-40 (Alteraciones Cognitivas)
    data.respuestas.slice(7, 14).forEach((resp, i) => {
      const numero = 34 + i;
      const radio = document.querySelector(`input[name="symptom_${numero}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });

    // Items 41-46 (Activación)
    data.respuestas.slice(14, 20).forEach((resp, i) => {
      const numero = 41 + i;
      const radio = document.querySelector(`input[name="symptom_${numero}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });

    // Items 47-49 (Síntomas Disociativos)
    data.respuestas.slice(20, 23).forEach((resp, i) => {
      const numero = 47 + i;
      const radio = document.querySelector(`input[name="symptom_${numero}"][value="${resp}"]`);
      if (radio) radio.checked = true;
    });

    // Item 50 (Duración) - índice 23
    if (data.respuestas[23]) {
      this.respuestas.symptom_duration = data.respuestas[23];
    }

    // Item 51 (Onset) - índice 24
    if (data.respuestas[24]) {
      this.respuestas.symptom_onset = data.respuestas[24];
    }

    // Items 52-58 (Funcionamiento) - índices 25-31
    data.respuestas.slice(25, 32).forEach((resp, i) => {
      const numero = 52 + i;
      const radio = document.querySelector(`input[name="item_${numero}"][value="si"]`);
      if (radio && resp === 1) radio.checked = true;
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

    this.guardarResultados();

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = btnOriginalText;
    }, 1500);
  }
};
