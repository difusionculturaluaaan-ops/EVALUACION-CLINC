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
    symptom_duration: null,
    symptom_onset: null,
    items_52_58: [0,0,0,0,0,0,0]
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
    46: 'Ha tenido dificultad en conciliar o mantener el sueño'
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

    console.log('EGEP5 Init - Nombre:', nombre, 'ID:', this.pacienteId);

    this.mostrarPaciente();
    this.renderizarSintomas();
    this.renderizarFuncionamiento();
    this.actualizarProgreso();
    this.actualizarDashboard();
  },

  mostrarPaciente() {
    let nombre = localStorage.getItem('paciente_nombre') || sessionStorage.getItem('paciente_nombre') || 'Paciente';

    // Limpiar prefijo si existe
    if (nombre.includes('Paciente:')) {
      nombre = nombre.split('Paciente:')[1].trim();
    }

    const elementoNombre = document.getElementById('egep5-paciente-nombre');
    if (elementoNombre) {
      elementoNombre.textContent = nombre;
    }
  },

  actualizarDashboard() {
    document.getElementById('egep5-seccion-actual').textContent = `${this.seccionActual} de 3`;

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

    document.getElementById('egep5-respuestas-count').textContent = `${completadas}/58`;
  },

  renderizarSintomas() {
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += this.renderizarItemLikert(27 + i, this.symptomDefinitions[27 + i], i, 'items_27_31');
    }
    document.getElementById('egep5-items-27-31').innerHTML = html;

    html = '';
    for (let i = 0; i < 2; i++) {
      html += this.renderizarItemLikert(32 + i, this.symptomDefinitions[32 + i], i, 'items_32_33');
    }
    document.getElementById('egep5-items-32-33').innerHTML = html;

    html = '';
    for (let i = 0; i < 7; i++) {
      html += this.renderizarItemLikert(34 + i, this.symptomDefinitions[34 + i], i, 'items_34_40');
    }
    document.getElementById('egep5-items-34-40').innerHTML = html;

    html = '';
    for (let i = 0; i < 6; i++) {
      html += this.renderizarItemLikert(41 + i, this.symptomDefinitions[41 + i], i, 'items_41_46');
    }
    document.getElementById('egep5-items-41-46').innerHTML = html;
  },

  renderizarItemLikert(numero, texto, indice, grupo) {
    const opciones = ['Ninguna', 'Leve', 'Moderada', 'Grave', 'Extrema'];
    let html = `<div class="symptom-item"><label class="symptom-text">${numero}. ${texto}</label><div class="likert-scale">`;
    opciones.forEach((opcion, valor) => {
      html += `<label class="likert-option"><input type="radio" name="${numero}" value="${valor}" onchange="tests.egep5.cambiarRespuesta('${grupo}', ${indice}, ${valor})"><span class="likert-label">${opcion}</span></label>`;
    });
    html += `</div></div>`;
    return html;
  },

  renderizarFuncionamiento() {
    let html = '';
    this.funcionamientoDefinitions.forEach((def, indice) => {
      html += `<div class="functioning-item"><label class="checkbox-item"><input type="checkbox" name="item_${52 + indice}" onchange="tests.egep5.cambiarFuncionamiento(${indice}, this.checked)"><span>${52 + indice}. ${def}</span></label></div>`;
    });
    document.getElementById('egep5-items-52-58').innerHTML = html;
  },

  cambiarRespuesta(grupo, indice, valor) {
    this.respuestas[grupo][indice] = parseInt(valor);
    this.actualizarProgreso();
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
    document.getElementById('egep5-progress-fill').style.width = porcentaje + '%';
    document.getElementById('egep5-progress-items').textContent = `${completadas}/58 respuestas`;
  },

  siguienteSeccion() {
    if (this.seccionActual === 1) {
      if (!this.validarSeccion1()) return;
      document.getElementById('egep5-section-1').classList.remove('active');
      document.getElementById('egep5-section-2').classList.add('active');
      this.seccionActual = 2;
      this.actualizarDashboard();
    } else if (this.seccionActual === 2) {
      if (!this.validarSeccion2()) return;
      document.getElementById('egep5-section-2').classList.remove('active');
      document.getElementById('egep5-section-3').classList.add('active');
      this.seccionActual = 3;
      this.actualizarDashboard();
    }
    window.scrollTo(0, 0);
  },

  seccionAnterior() {
    if (this.seccionActual === 2) {
      document.getElementById('egep5-section-2').classList.remove('active');
      document.getElementById('egep5-section-1').classList.add('active');
      this.seccionActual = 1;
      this.actualizarDashboard();
    } else if (this.seccionActual === 3) {
      document.getElementById('egep5-section-3').classList.remove('active');
      document.getElementById('egep5-section-2').classList.add('active');
      this.seccionActual = 2;
      this.actualizarDashboard();
    }
    window.scrollTo(0, 0);
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

  calcularResultados() {
    const reexper = this.respuestas.items_27_31.filter(x => x >= 1).length;
    const evitar = this.respuestas.items_32_33.filter(x => x >= 1).length;
    const cognit = this.respuestas.items_34_40.filter(x => x >= 1).length;
    const activa = this.respuestas.items_41_46.filter(x => x >= 1).length;

    const criterios = {
      a: true,
      b: reexper >= 1,
      c: evitar >= 1,
      d: cognit >= 2,
      e: activa >= 2,
      f: this.respuestas.symptom_duration > 1,
      g: this.respuestas.items_52_58.filter(x => x > 0).length >= 1
    };

    const teptPresente = Object.values(criterios).every(v => v);
    const intensidadTotal = reexper + evitar + cognit + activa;
    let nivelIntensidad = 'Leve';
    if (intensidadTotal >= 15) nivelIntensidad = 'Muy grave';
    else if (intensidadTotal >= 10) nivelIntensidad = 'Grave';
    else if (intensidadTotal >= 5) nivelIntensidad = 'Moderada';

    this.mostrarResultados({ teptPresente, nivelIntensidad, criterios, reexper, evitar, cognit, activa, intensidadTotal });
    this.resultados = { teptPresente, nivelIntensidad, criterios, reexper, evitar, cognit, activa, intensidadTotal };

    document.getElementById('egep5-section-3').classList.remove('active');
    document.getElementById('egep5-section-resultados').classList.add('active');
    window.scrollTo(0, 0);
  },

  mostrarResultados(datos) {
    const diagHTML = `<div class="diagnostic-result ${datos.teptPresente ? 'positive' : 'negative'}"><div class="diagnostic-label">${datos.teptPresente ? '✓ TEPT PRESENTE' : '✗ TEPT AUSENTE'}</div><div class="diagnostic-intensity">Intensidad: ${datos.nivelIntensidad}</div><div class="diagnostic-score">Síntomas totales: ${datos.intensidadTotal}/20</div></div>`;
    document.getElementById('egep5-diagnostico').innerHTML = diagHTML;

    let criteriaHTML = '<table class="criteria-table-content"><tr><th>Criterio</th><th>Estado</th></tr>';
    const criteriaLabels = { a: 'A: Exposición a evento traumático', b: `B: Síntomas intrusivos (≥1): ${datos.reexper}`, c: `C: Evitación (≥1): ${datos.evitar}`, d: `D: Alteraciones cognitivas (≥2): ${datos.cognit}`, e: `E: Activación/reactividad (≥2): ${datos.activa}`, f: 'F: Duración >1 mes', g: 'G: Impacto funcional' };
    Object.entries(datos.criterios).forEach(([key, value]) => {
      const estado = value ? '✓ Cumple' : '✗ No cumple';
      criteriaHTML += `<tr><td>${criteriaLabels[key]}</td><td class="${value ? 'cumple' : 'no-cumple'}">${estado}</td></tr>`;
    });
    criteriaHTML += '</table>';
    document.getElementById('egep5-criteria-table').innerHTML = criteriaHTML;

    let sympHTML = '<table class="symptoms-table-content"><tr><th>Dimensión</th><th>Síntomas</th><th>Total</th></tr>';
    sympHTML += `<tr><td>Reexperimentación</td><td>${datos.reexper}/5</td><td>${Math.round(datos.reexper/5*100)}%</td></tr>`;
    sympHTML += `<tr><td>Evitación</td><td>${datos.evitar}/2</td><td>${Math.round(datos.evitar/2*100)}%</td></tr>`;
    sympHTML += `<tr><td>Alteraciones Cognitivas</td><td>${datos.cognit}/7</td><td>${Math.round(datos.cognit/7*100)}%</td></tr>`;
    sympHTML += `<tr><td>Activación/Reactividad</td><td>${datos.activa}/6</td><td>${Math.round(datos.activa/6*100)}%</td></tr>`;
    sympHTML += '</table>';
    document.getElementById('egep5-symptoms-summary').innerHTML = sympHTML;

    const funcionAfectadas = this.respuestas.items_52_58.filter(x => x > 0).length;
    let funcHTML = `<p><strong>Áreas afectadas: ${funcionAfectadas}/7</strong></p><ul>`;
    this.respuestas.items_52_58.forEach((v, i) => { if (v > 0) funcHTML += `<li>${this.funcionamientoDefinitions[i]}</li>`; });
    funcHTML += '</ul>';
    document.getElementById('egep5-functioning-summary').innerHTML = funcHTML;
  },

  exportarJSON() {
    if (!this.resultados) {
      alert('Primero calcula los resultados');
      return;
    }

    const paciente_nombre = localStorage.getItem('paciente_nombre') || 'Paciente';
    const evaluador = localStorage.getItem('nombre') || 'Sin especificar';

    const data = {
      testType: 'EGEP-5',
      version: '1.0',
      respuestas: this.construirArrayRespuestas(),
      metadatos: {
        paciente_nombre: paciente_nombre,
        paciente_id: sessionStorage.getItem('pacienteSeleccionado'),
        evaluador: evaluador,
        fecha: new Date().toISOString(),
        tipo_trauma: this.respuestas.trauma_type.join(','),
        descripcion_evento: this.respuestas.trauma_description,
        fecha_expediente: this.respuestas.trauma_timing
      },
      criterios_dsm5: this.resultados.criterios,
      diagnostico: {
        tept_presente: this.resultados.teptPresente,
        intensidad: this.resultados.nivelIntensidad,
        intensidad_total: this.resultados.intensidadTotal,
        reexperimentacion: this.resultados.reexper,
        evitacion: this.resultados.evitar,
        cognitivas: this.resultados.cognit,
        activacion: this.resultados.activa
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

    alert('✅ JSON exportado correctamente');
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
        document.getElementById('egep5-section-1').classList.remove('active');
        document.getElementById('egep5-section-2').classList.remove('active');
        document.getElementById('egep5-section-3').classList.remove('active');
        document.getElementById('egep5-section-resultados').classList.add('active');

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
    const html = document.getElementById('egep5-section-resultados').innerHTML;

    const opt = {
      margin: 10,
      filename: `EGEP-5_${nombre_paciente}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(html).save();
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
