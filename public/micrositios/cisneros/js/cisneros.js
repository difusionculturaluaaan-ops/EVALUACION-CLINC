/**
 * CISNEROS: ESCALA DE VALORACIÓN DEL MOBBING
 * 44 ítems (43 + 1 chequeo), 5 dimensiones, 3 autores
 * Escala: 0-6 (Nunca a Todos los días)
 * Validado: Iñaki Piñuel y Zabala (2001)
 *
 * ESTRUCTURA AISLADA - NO COMPARTE CON OTROS TESTS
 */

window.tests_cisneros = {
  nombre: 'CISNEROS',
  tipo: 'CISNEROS',
  totalItems: 44,  // 43 ítems + 1 pregunta filtro
  seccionActual: 1,
  pacienteId: null,
  resultados: null,

  // Estructura de respuestas
  respuestas: {
    // 44 ítems (índices 1-44)
    items: Array(45).fill(0),

    // Autor del acoso (por cada ítem)
    autores: Array(45).fill([]),  // [1=Jefe, 2=Compañeros, 3=Subordinados]

    // Dimensiones
    demerito: 0,          // Ítems: 5,15,16,17,18,19,24,26,39
    obstaculizacion: 0,   // Ítems: 6,7,8,9,10,33,34
    intimidacion: 0,      // Ítems: 20,27,28,29,30,36,37
    aislamiento: 0,       // Ítems: 2,14,21
    acosoPersonal: 0      // Ítems: 25,31,32,35,41,42,43
  },

  // Definiciones de ítems (44 items)
  itemDefinitions: {
    1: "Mi superior restringe mis posibilidades de comunicarme, hablar o reunirme con él",
    2: "Me ignoran, me excluyen o me hacen el vacío, fingen no verme o me hacen «invisible»",
    3: "Me interrumpen continuamente impidiendo expresarme",
    4: "Me fuerzan a realizar trabajos que van contra mis principios o mi ética",
    5: "Evalúan mi trabajo de manera inequitativa o de forma sesgada",
    6: "Me dejan sin ningún trabajo que hacer, ni siquiera a iniciativa propia",
    7: "Me asignan tareas o trabajos absurdos o sin sentido",
    8: "Me asignan tareas o trabajos por debajo de mi capacidad profesional o mis competencias",
    9: "Me asignan tareas rutinarias o sin valor o interés alguno",
    10: "Me abruman con una carga de trabajo insoportable de manera malintencionada",
    11: "Me asignan tareas que ponen en peligro mi integridad física o mi salud a propósito",
    12: "Me impiden que adopte las medidas de seguridad necesarias para realizar mi trabajo con la debida seguridad",
    13: "Se me ocasionan gastos con intención de perjudicarme económicamente",
    14: "Prohíben a mis compañeros o colegas hablar conmigo",
    15: "Minusvaloran y echan por tierra mi trabajo, no importa lo que haga",
    16: "Me acusan injustificadamente de incumplimientos, errores, fallos",
    17: "Recibo críticas y reproches por cualquier cosa que haga o decisión que tome en mi trabajo",
    18: "Se amplifican y dramatizan de manera injustificada errores pequeños o intrascendentes",
    19: "Me humillan, desprecian o minusvaloran en público ante otros colegas o ante terceros",
    20: "Me amenazan con usar instrumentos disciplinarios (rescisión, expedientes, despido, traslados)",
    21: "Intentan aislarme de mis compañeros dándome trabajos o tareas que me alejan físicamente",
    22: "Distorsionan malintencionadamente lo que digo o hago en mi trabajo",
    23: "Se intenta buscarme las cosquillas para «hacerme explotar»",
    24: "Me menosprecian personal o profesionalmente",
    25: "Hacen burla de mí o bromas intentando ridiculizar mi forma de hablar, de andar, etc.",
    26: "Recibo feroces e injustas críticas acerca de aspectos de mi vida personal",
    27: "Recibo amenazas verbales o mediante gestos intimidatorios",
    28: "Recibo amenazas por escrito o por teléfono en mi domicilio",
    29: "Me chillan o gritan, o elevan la voz de manera a intimidarme",
    30: "Me zarandean, empujan o avasallan físicamente para intimidarme",
    31: "Se hacen bromas inapropiadas y crueles acerca de mí",
    32: "Inventan y difunden rumores y calumnias acerca de mí de manera malintencionada",
    33: "Me privan de información imprescindible y necesaria para hacer mi trabajo",
    34: "Limitan malintencionadamente mi acceso a cursos, promociones, ascensos",
    35: "Me atribuyen malintencionadamente conductas ilícitas o antiéticas para perjudicar mi imagen",
    36: "Recibo una presión indebida para sacar adelante el trabajo",
    37: "Me asignan plazos de ejecución o cargas de trabajo irrazonables",
    38: "Modifican mis responsabilidades o las tareas a ejecutar sin decirme nada",
    39: "Desvaloran continuamente mi esfuerzo profesional",
    40: "Intentan persistentemente desmoralizarme",
    41: "Utilizan varias formas de hacerme incurrir en errores profesionales de manera malintencionada",
    42: "Controlan aspectos de mi trabajo de forma malintencionada para intentar «pillarme en algún renuncio»",
    43: "Me lanzan insinuaciones o proposiciones sexuales directas o indirectas",
    44: "¿Ha sido Ud víctima de por lo menos alguna de las anteriores formas de maltrato psicológico de manera continuada (más de 1 vez por semana)?"
  },

  // Escala de frecuencia
  escalaFrequencia: [
    { valor: 0, label: "Nunca" },
    { valor: 1, label: "Pocas veces al año o menos" },
    { valor: 2, label: "Una vez al mes o menos" },
    { valor: 3, label: "Algunas veces al mes" },
    { valor: 4, label: "Una vez a la semana" },
    { valor: 5, label: "Varias veces a la semana" },
    { valor: 6, label: "Todos los días" }
  ],

  // Autores del acoso
  autoresAcoso: [
    { valor: 1, label: "Jefes o supervisores" },
    { valor: 2, label: "Compañeros de trabajo" },
    { valor: 3, label: "Subordinados" }
  ],

  // Dimensiones del mobbing
  dimensiones: {
    demerito: {
      nombre: "Demérito",
      items: [5, 15, 16, 17, 18, 19, 24, 26, 39],
      descripcion: "Desprestigio profesional y laboral"
    },
    obstaculizacion: {
      nombre: "Obstaculización",
      items: [6, 7, 8, 9, 10, 33, 34],
      descripcion: "Impedimento para realizar el trabajo"
    },
    intimidacion: {
      nombre: "Intimidación",
      items: [20, 27, 28, 29, 30, 36, 37],
      descripcion: "Amenazas y presión coercitiva"
    },
    aislamiento: {
      nombre: "Aislamiento",
      items: [2, 14, 21],
      descripcion: "Exclusión social y comunicativa"
    },
    acosoPersonal: {
      nombre: "Acoso Personal",
      items: [25, 31, 32, 35, 41, 42, 43],
      descripcion: "Ataques personales e intimidación"
    }
  },

  init() {
    this.pacienteId = sessionStorage.getItem('pacienteSeleccionado') || localStorage.getItem('paciente_id');

    let nombre = localStorage.getItem('paciente_nombre') || sessionStorage.getItem('paciente_nombre');
    if (!nombre) {
      nombre = 'Paciente sin especificar';
      localStorage.setItem('paciente_nombre', nombre);
    }

    this.renderizarItems();
    this.cargarDatosPaciente();
    this.inicializarImportador();
    this.actualizarProgreso();
  },

  async cargarDesdePrueba(pruebaId, token) {
    try {
      const response = await fetch(`/api/pruebas/${pruebaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        alert('❌ Error al cargar la prueba');
        return;
      }

      const prueba = await response.json();
      console.log('🔍 Prueba cargada:', prueba);

      const subescalas = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : prueba.subescalas;

      // Cargar respuestas: primero desde prueba.data, sino desde _json en subescalas
      let dataArray = prueba.data;
      if (typeof dataArray === 'string') {
        dataArray = JSON.parse(dataArray);
      }

      // Si no viene prueba.data, extraer desde _json
      if (!dataArray || !Array.isArray(dataArray)) {
        if (subescalas && subescalas._json) {
          const jsonData = typeof subescalas._json === 'string' ? JSON.parse(subescalas._json) : subescalas._json;
          dataArray = jsonData.respuestas;
        }
      }

      console.log('📊 dataArray:', dataArray);

      if (dataArray && Array.isArray(dataArray)) {
        console.log('✅ Cargando respuestas:', dataArray);
        this.respuestas.items = [0, ...dataArray];
      } else {
        console.warn('❌ No hay datos válidos:', dataArray);
      }

      // Cargar metadatos: desde _json en subescalas (patrón CUIDA)
      let metadatos = null;
      if (subescalas && subescalas._json) {
        const jsonData = typeof subescalas._json === 'string' ? JSON.parse(subescalas._json) : subescalas._json;
        metadatos = jsonData.metadatos;
      }

      if (metadatos) {
        if (document.getElementById('c_nombre')) document.getElementById('c_nombre').value = metadatos.paciente_nombre || '';
        if (document.getElementById('c_edad')) document.getElementById('c_edad').value = metadatos.edad || '';
        if (document.getElementById('c_sexo')) document.getElementById('c_sexo').value = metadatos.sexo || '';
        if (document.getElementById('c_empresa')) document.getElementById('c_empresa').value = metadatos.empresa || '';
        if (document.getElementById('c_evaluador')) document.getElementById('c_evaluador').value = metadatos.evaluador || '';
        if (document.getElementById('c_fecha')) document.getElementById('c_fecha').value = metadatos.fecha_evaluacion || '';
      }

      // Renderizar nuevamente con los valores cargados
      this.renderizarItems();

      this.calcularResultados();
      this.mostrarResultados();
      this.actualizarProgreso();

      alert('✅ Prueba cargada correctamente');
    } catch (error) {
      console.error('Error al cargar prueba:', error);
      alert('❌ Error al cargar la prueba: ' + error.message);
    }
  },


  cargarDatosPaciente() {
    const nombre = sessionStorage.getItem('paciente_nombre') || localStorage.getItem('paciente_nombre') || '';
    const edad = sessionStorage.getItem('paciente_edad') || localStorage.getItem('paciente_edad') || '';
    const sexo = sessionStorage.getItem('paciente_sexo') || localStorage.getItem('paciente_sexo') || '';
    const empresa = sessionStorage.getItem('clinica_nombre') || localStorage.getItem('clinica_nombre') || '';
    const evaluador = sessionStorage.getItem('usuario_nombre') || localStorage.getItem('nombre') || localStorage.getItem('usuario_nombre') || '';

    if (document.getElementById('c_nombre')) document.getElementById('c_nombre').value = nombre;
    if (document.getElementById('c_edad')) document.getElementById('c_edad').value = edad;
    if (document.getElementById('c_sexo')) document.getElementById('c_sexo').value = sexo;
    if (document.getElementById('c_empresa')) document.getElementById('c_empresa').value = empresa;
    if (document.getElementById('c_evaluador')) document.getElementById('c_evaluador').value = evaluador;

    const hoy = new Date().toISOString().split('T')[0];
    if (document.getElementById('c_fecha')) document.getElementById('c_fecha').value = hoy;
  },

  renderizarItems() {
    const container = document.getElementById('cisneros-items-container');
    if (!container) return;

    let html = `
      <div class="cisneros-instruction">
        <p><strong>Instrucciones:</strong>
        Indique cuál es su experiencia durante los últimos 6 meses con respecto a cada uno de los comportamientos listados.
        Para cada comportamiento, marque: (1) la frecuencia con que ocurre y (2) quién/es lo realizan (Jefe, Compañeros, Subordinados).
        </p>
      </div>

      <div style="background: rgba(249, 115, 22, 0.05); border: 1px solid #f97316; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 13px; color: #8b949e;">
          <strong style="color: #f97316;">Nota:</strong> Este test mide acoso laboral deliberado. La pregunta 44 es un chequeo final sobre si ha experimentado maltrato psicológico continuado.
        </p>
      </div>

      <table class="cisneros-items-table" style="width: 100%; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="width: 50%; text-align: left; padding: 12px; border: 1px solid var(--border);">Comportamiento</th>
            <th colspan="7" style="text-align: center; padding: 12px; border: 1px solid var(--border);">Frecuencia (0-6)</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 1; i <= 43; i++) {
      const dimension = this.obtenerDimensionItem(i);
      const bgColor = dimension === 'Demérito' ? 'background: rgba(239, 68, 68, 0.05);' :
                      dimension === 'Obstaculización' ? 'background: rgba(249, 115, 22, 0.05);' :
                      dimension === 'Intimidación' ? 'background: rgba(245, 158, 11, 0.05);' :
                      dimension === 'Aislamiento' ? 'background: rgba(59, 130, 246, 0.05);' :
                      'background: rgba(139, 92, 246, 0.05);';

      html += `
        <tr style="${bgColor}">
          <td style="padding: 12px; border: 1px solid var(--border);">
            <strong style="color: #f97316;">${i}.</strong>
            <span style="color: #f97316; font-size: 13px;">
              ${this.itemDefinitions[i]}
            </span>
            <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">${dimension}</div>
          </td>
      `;

      for (let valor = 0; valor <= 6; valor++) {
        const checked = this.respuestas.items[i] === valor ? 'checked' : '';
        html += `
          <td style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">
            <input type="radio"
                   name="cisneros_item_${i}"
                   value="${valor}"
                   ${checked}
                   onchange="window.tests_cisneros.cambiarRespuesta(${i}, ${valor})">
            ${valor}
          </td>
        `;
      }

      html += `</tr>`;
    }

    // Pregunta filtro 44
    html += `
      <tr style="background: rgba(22, 163, 74, 0.05); font-weight: 600;">
        <td style="padding: 12px; border: 1px solid var(--border);">
          <strong style="color: #22c55e;">44.</strong>
          <span style="color: #22c55e; font-size: 13px;">
            ${this.itemDefinitions[44]}
          </span>
          <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">Chequeo Final</div>
        </td>
        <td colspan="7" style="text-align: center; padding: 12px; border: 1px solid var(--border);">
          <label style="margin-right: 20px;">
            <input type="radio" name="cisneros_44" value="si" onchange="window.tests_cisneros.cambiarRespuesta(44, 'si')">
            SÍ
          </label>
          <label>
            <input type="radio" name="cisneros_44" value="no" onchange="window.tests_cisneros.cambiarRespuesta(44, 'no')">
            NO
          </label>
        </td>
      </tr>
    `;

    html += `
        </tbody>
      </table>

      <div class="button-group" style="margin-top: 20px;">
        <button onclick="window.tests_cisneros.irTab('resultados'); window.tests_cisneros.calcularResultados();" class="btn btn-primary">⊡ Calcular Resultados</button>
        <button onclick="window.tests_cisneros.exportarJSON()" class="btn btn-secondary">↓ Exportar JSON</button>
        <button onclick="document.getElementById('cisneros-file-input').click()" class="btn btn-secondary">↑ Importar JSON</button>
        <button onclick="window.tests_cisneros.limpiar()" class="btn btn-danger">✕ Limpiar</button>
      </div>
    `;

    container.innerHTML = html;
  },

  obtenerDimensionItem(numero) {
    for (const [key, dim] of Object.entries(this.dimensiones)) {
      if (dim.items.includes(numero)) return dim.nombre;
    }
    return "General";
  },

  cambiarRespuesta(numero, valor) {
    if (numero === 44) {
      this.respuestas.items[44] = valor;
    } else {
      this.respuestas.items[numero] = valor;
    }
    this.actualizarProgreso();
  },

  actualizarProgreso() {
    const respondidas = this.respuestas.items.slice(1, 44).filter(v => v > 0).length;
    const total = 43;
    const porcentaje = Math.round((respondidas / total) * 100);

    const progressEl = document.querySelector('[data-metric="respondidas"]');
    if (progressEl) {
      progressEl.textContent = `${respondidas} / ${total}`;
    }

    const porcentajeEl = document.querySelector('[data-metric="porcentaje"]');
    if (porcentajeEl) {
      porcentajeEl.textContent = `${porcentaje}%`;
    }
  },

  calcularResultados() {
    // TODO: Implementar cálculo de puntuaciones por dimensión
    // TODO: Implementar diagnóstico de mobbing
    // TODO: Implementar interpretación clínica
    alert('📊 Cálculo en desarrollo — próximamente');
  },

  generarPDF() {
    alert('📄 PDF en desarrollo');
  },

  generarJSON() {
    if (!this.resultados) return null;

    const paciente_nombre = document.getElementById('c_nombre')?.value || localStorage.getItem('paciente_nombre') || 'Paciente';
    const evaluador = document.getElementById('c_evaluador')?.value || localStorage.getItem('nombre') || 'Sin especificar';
    const edad = document.getElementById('c_edad')?.value || '';
    const sexo = document.getElementById('c_sexo')?.value || '';
    const empresa = document.getElementById('c_empresa')?.value || localStorage.getItem('clinica_nombre') || 'No especificado';
    const fecha_eval = document.getElementById('c_fecha')?.value || new Date().toISOString().split('T')[0];

    return {
      testType: 'CISNEROS',
      version: '1.0',
      respuestas: this.respuestas.items.slice(1, 44),
      metadatos: {
        paciente_nombre,
        paciente_id: sessionStorage.getItem('pacienteSeleccionado'),
        evaluador,
        fecha_evaluacion: fecha_eval,
        edad,
        sexo,
        empresa
      },
      puntuaciones: {
        demérito: this.resultados.demerito,
        obstaculización: this.resultados.obstaculizacion,
        intimidación: this.resultados.intimidacion,
        aislamiento: this.resultados.aislamiento,
        acoso_personal: this.resultados.acosoPersonal
      },
      diagnostico: {
        intensidad: this.resultados.intensidad
      },
      respondidas: this.respuestas.items.slice(1, 44).filter(x => x > 0).length,
      timestamp: new Date().toISOString()
    };
  },

  exportarJSON() {
    const data = this.generarJSON();
    if (!data) {
      alert('Primero calcula los resultados');
      return;
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CISNEROS_${data.metadatos.paciente_nombre}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  inicializarImportador() {
    const fileInput = document.getElementById('cisneros-file-input');
    if (!fileInput) return;
    fileInput.addEventListener('change', (e) => {
      alert('⬆️ Import en desarrollo');
    });
  },

  guardarEnExpediente() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados antes de guardar.');
      return;
    }

    const pacienteId = sessionStorage.getItem('pacienteSeleccionado');
    if (!pacienteId) {
      alert('❌ No hay paciente seleccionado. Vuelve al expediente.');
      return;
    }

    const data = this.respuestas.items.slice(1, 44);
    const { demerito, obstaculizacion, intimidacion, aislamiento, acosoPersonal } = this.resultados;

    // Generar PDF desde el contenedor de resultados
    const element = document.getElementById('cisneros-resultados');
    if (!element) {
      alert('❌ No hay resultados para guardar');
      return;
    }

    const opt = {
      margin: 10,
      filename: 'CISNEROS-' + new Date().toISOString().split('T')[0] + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      // Convertir PDF a base64
      const pdfData = pdf.output('datauristring');

      const subescalas = {
        demérito: demerito,
        obstaculización: obstaculizacion,
        intimidación: intimidacion,
        aislamiento: aislamiento,
        acoso_personal: acosoPersonal,
        intensidad: this.resultados.intensidad,
        _pdf_base64: pdfData
      };

      const totalScore = demerito + obstaculizacion + intimidacion + aislamiento + acosoPersonal;

      return api.guardarPrueba(
        pacienteId,
        'CISNEROS',
        data,
        totalScore,
        subescalas,
        localStorage.getItem('nombre')
      );
    }).then(() => {
      const successMsg = document.createElement('div');
      successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
      successMsg.innerHTML = `✅ PDF guardado en expediente`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      console.log('✅ PDF CISNEROS guardado en expediente');
      setTimeout(() => window.location.href = '/expedientes', 1500);
    }).catch(error => {
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 15px; border-radius: 8px; z-index: 9999;';
      errorMsg.textContent = `❌ Error: ${error.message}`;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 5000);

      console.error('Error:', error);
    });
  },

  limpiar() {
    if (confirm('¿Estás seguro que deseas limpiar todas las respuestas?')) {
      this.respuestas.items = Array(45).fill(0);
      this.resultados = null;
      this.renderizarItems();
      this.actualizarProgreso();
    }
  },

  irTab(tab) {
    const tabs = document.querySelectorAll('.cisneros-tab-content');
    tabs.forEach(t => t.classList.remove('active'));

    const tabContent = document.getElementById(`tab-${tab}`);
    if (tabContent) {
      tabContent.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
