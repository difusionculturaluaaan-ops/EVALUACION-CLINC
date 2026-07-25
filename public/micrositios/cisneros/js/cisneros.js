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

  // Definiciones de ítems (44 items) con clasificación Mobbing/Bossing
  itemDefinitions: {
    1: { texto: "Mi superior restringe mis posibilidades de comunicarme, hablar o reunirme con él", tipo: "Bossing" },
    2: { texto: "Me ignoran, me excluyen o me hacen el vacío, fingen no verme o me hacen «invisible»", tipo: "Mobbing" },
    3: { texto: "Me interrumpen continuamente impidiendo expresarme", tipo: "Mobbing" },
    4: { texto: "Me fuerzan a realizar trabajos que van contra mis principios o mi ética", tipo: "Bossing" },
    5: { texto: "Evalúan mi trabajo de manera inequitativa o de forma sesgada", tipo: "Bossing" },
    6: { texto: "Me dejan sin ningún trabajo que hacer, ni siquiera a iniciativa propia", tipo: "Mobbing" },
    7: { texto: "Me asignan tareas o trabajos absurdos o sin sentido", tipo: "Bossing" },
    8: { texto: "Me asignan tareas o trabajos por debajo de mi capacidad profesional o mis competencias", tipo: "Bossing" },
    9: { texto: "Me asignan tareas rutinarias o sin valor o interés alguno", tipo: "Bossing" },
    10: { texto: "Me abruman con una carga de trabajo insoportable de manera malintencionada", tipo: "Mobbing" },
    11: { texto: "Me asignan tareas que ponen en peligro mi integridad física o mi salud a propósito", tipo: "Bossing" },
    12: { texto: "Me impiden que adopte las medidas de seguridad necesarias para realizar mi trabajo con la debida seguridad", tipo: "Bossing" },
    13: { texto: "Se me ocasionan gastos con intención de perjudicarme económicamente", tipo: "Bossing" },
    14: { texto: "Prohíben a mis compañeros o colegas hablar conmigo", tipo: "Mobbing" },
    15: { texto: "Minusvaloran y echan por tierra mi trabajo, no importa lo que haga", tipo: "Bossing" },
    16: { texto: "Me acusan injustificadamente de incumplimientos, errores, fallos", tipo: "Mobbing" },
    17: { texto: "Recibo críticas y reproches por cualquier cosa que haga o decisión que tome en mi trabajo", tipo: "Mobbing" },
    18: { texto: "Se amplifican y dramatizan de manera injustificada errores pequeños o intrascendentes", tipo: "Mobbing" },
    19: { texto: "Me humillan, desprecian o minusvaloran en público ante otros colegas o ante terceros", tipo: "Mobbing" },
    20: { texto: "Me amenazan con usar instrumentos disciplinarios (rescisión, expedientes, despido, traslados)", tipo: "Bossing" },
    21: { texto: "Intentan aislarme de mis compañeros dándome trabajos o tareas que me alejan físicamente", tipo: "Bossing" },
    22: { texto: "Distorsionan malintencionadamente lo que digo o hago en mi trabajo", tipo: "Mobbing" },
    23: { texto: "Se intenta buscarme las cosquillas para «hacerme explotar»", tipo: "Mobbing" },
    24: { texto: "Me menosprecian personal o profesionalmente", tipo: "Mobbing" },
    25: { texto: "Hacen burla de mí o bromas intentando ridiculizar mi forma de hablar, de andar, etc.", tipo: "Mobbing" },
    26: { texto: "Recibo feroces e injustas críticas acerca de aspectos de mi vida personal", tipo: "Mobbing" },
    27: { texto: "Recibo amenazas verbales o mediante gestos intimidatorios", tipo: "Mobbing" },
    28: { texto: "Recibo amenazas por escrito o por teléfono en mi domicilio", tipo: "Mobbing" },
    29: { texto: "Me chillan o gritan, o elevan la voz de manera a intimidarme", tipo: "Mobbing" },
    30: { texto: "Me zarandean, empujan o avasallan físicamente para intimidarme", tipo: "Mobbing" },
    31: { texto: "Se hacen bromas inapropiadas y crueles acerca de mí", tipo: "Mobbing" },
    32: { texto: "Inventan y difunden rumores y calumnias acerca de mí de manera malintencionada", tipo: "Mobbing" },
    33: { texto: "Me privan de información imprescindible y necesaria para hacer mi trabajo", tipo: "Mobbing" },
    34: { texto: "Limitan malintencionadamente mi acceso a cursos, promociones, ascensos", tipo: "Mobbing" },
    35: { texto: "Me atribuyen malintencionadamente conductas ilícitas o antiéticas para perjudicar mi imagen", tipo: "Mobbing" },
    36: { texto: "Recibo una presión indebida para sacar adelante el trabajo", tipo: "Bossing" },
    37: { texto: "Me asignan plazos de ejecución o cargas de trabajo irrazonables", tipo: "Bossing" },
    38: { texto: "Modifican mis responsabilidades o las tareas a ejecutar sin decirme nada", tipo: "Bossing" },
    39: { texto: "Desvaloran continuamente mi esfuerzo profesional", tipo: "Bossing" },
    40: { texto: "Intentan persistentemente desmoralizarme", tipo: "Mobbing" },
    41: { texto: "Utilizan varias formas de hacerme incurrir en errores profesionales de manera malintencionada", tipo: "Mobbing" },
    42: { texto: "Controlan aspectos de mi trabajo de forma malintencionada para intentar «pillarme en algún renuncio»", tipo: "Mobbing" },
    43: { texto: "Me lanzan insinuaciones o proposiciones sexuales directas o indirectas", tipo: "Mobbing" },
    44: { texto: "¿Ha sido Ud víctima de por lo menos alguna de las anteriores formas de maltrato psicológico de manera continuada (más de 1 vez por semana)?", tipo: "Filtro" }
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

      const tipo = this.itemDefinitions[i].tipo;
      const tipoLabel = tipo === 'Mobbing' ? '<span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">MOBBING</span>' :
                        tipo === 'Bossing' ? '<span style="background: #2563eb; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">BOSSING</span>' : '';

      html += `
        <tr style="${bgColor}">
          <td style="padding: 12px; border: 1px solid var(--border);">
            <strong style="color: #f97316;">${i}.</strong>
            <span style="color: #f97316; font-size: 13px;">
              ${this.itemDefinitions[i].texto}
            </span>
            <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">${dimension} ${tipoLabel}</div>
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
            ${this.itemDefinitions[44].texto}
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
    const items = this.respuestas.items.slice(1, 44);

    // Calcular puntuaciones por dimensión
    const demerito = [1, 2, 3, 4, 5, 6, 7].reduce((s, i) => s + (items[i] || 0), 0);
    const obstaculizacion = [8, 9, 10, 11, 12, 13, 14].reduce((s, i) => s + (items[i] || 0), 0);
    const intimidacion = [15, 16, 17, 18, 19, 20, 21].reduce((s, i) => s + (items[i] || 0), 0);
    const aislamiento = [22, 23, 24, 25, 26, 27].reduce((s, i) => s + (items[i] || 0), 0);
    const acosoPersonal = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37].reduce((s, i) => s + (items[i] || 0), 0);

    const totalScore = demerito + obstaculizacion + intimidacion + aislamiento + acosoPersonal;
    const intensidad = totalScore > 90 ? 'SEVERO' : totalScore > 60 ? 'MODERADO' : totalScore > 30 ? 'LEVE' : 'SIN MOBBING';

    // Calcular índices oficiales CISNEROS
    // IGAP: Índice Global de Acoso Psicológico (promedio de todas las puntuaciones)
    const IGAP = totalScore / 43;

    // IMAP: Índice Medio de Acoso (promedio solo de ítems con puntuación ≥3)
    const itemsAlerta = items.filter(val => (val || 0) >= 3);
    const IMAP = itemsAlerta.length > 0 ? itemsAlerta.reduce((s, v) => s + v, 0) / itemsAlerta.length : 0;

    // NEAP: Número de Estrategias de Acoso (cantidad de ítems con puntuación ≥3)
    const NEAP = itemsAlerta.length;

    // Contar Mobbing vs Bossing
    let mobbingCount = 0;
    let bossingCount = 0;
    for (let i = 1; i <= 43; i++) {
      if ((items[i] || 0) >= 3) {
        const tipo = this.itemDefinitions[i].tipo;
        if (tipo === 'Mobbing') mobbingCount++;
        else if (tipo === 'Bossing') bossingCount++;
      }
    }

    this.resultados = {
      demerito,
      obstaculizacion,
      intimidacion,
      aislamiento,
      acosoPersonal,
      totalScore,
      intensidad,
      IGAP: parseFloat(IGAP.toFixed(2)),
      IMAP: parseFloat(IMAP.toFixed(2)),
      NEAP,
      mobbingCount,
      bossingCount
    };

    this.mostrarResultados();
  },

  mostrarResultados() {
    const container = document.getElementById('cisneros-resultados');
    if (!container || !this.resultados) return;

    const nombre = document.getElementById('c_nombre')?.value || localStorage.getItem('paciente_nombre') || 'Paciente';
    const edad = document.getElementById('c_edad')?.value || '';
    const sexo = document.getElementById('c_sexo')?.value || '';
    const empresa = document.getElementById('c_empresa')?.value || '';
    const evaluador = document.getElementById('c_evaluador')?.value || localStorage.getItem('nombre') || '';
    const fecha = document.getElementById('c_fecha')?.value || new Date().toISOString().split('T')[0];

    const { demerito, obstaculizacion, intimidacion, aislamiento, acosoPersonal, totalScore, intensidad } = this.resultados;

    const colorIntensidad = intensidad === 'SIN MOBBING' ? '#22c55e' :
                           intensidad === 'LEVE' ? '#eab308' :
                           intensidad === 'MODERADO' ? '#f97316' : '#ef4444';

    let html = `
      <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">DATOS DEL PACIENTE Y EVALUADOR</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
          <div><span style="font-weight: 600; color: #4b5563;">Paciente:</span> <span>${nombre}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Edad:</span> <span>${edad} años</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Sexo:</span> <span>${sexo}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Empresa:</span> <span>${empresa}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Evaluador:</span> <span>${evaluador}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Fecha:</span> <span>${fecha}</span></div>
        </div>
      </div>

      <div style="background: ${colorIntensidad}20; border-left: 4px solid ${colorIntensidad}; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
          <h2 style="color: ${colorIntensidad}; margin: 0; font-size: 14px;">🔍 DIAGNÓSTICO</h2>
          <p style="font-size: 24px; font-weight: bold; color: ${colorIntensidad}; margin: 0;">${intensidad}</p>
        </div>
        <p style="color: #8b949e; margin: 0; font-size: 14px;">Puntuación Total: ${totalScore}/258</p>
      </div>

      ${this.generarGraficoIndices()}

      ${this.generarGraficoMobbingBossing()}

      ${this.generarTablaRespuestas()}

      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 14px;">
        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid #ef4444; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #ef4444; font-size: 12px; font-weight: 600;">Demérito</h3>
          <div style="font-size: 18px; font-weight: bold; color: #ef4444;">${demerito}</div>
          <div style="font-size: 10px; color: #8b949e;">de 42</div>
        </div>
        <div style="background: rgba(249, 115, 22, 0.05); border: 1px solid #f97316; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #f97316; font-size: 12px; font-weight: 600;">Obstaculización</h3>
          <div style="font-size: 18px; font-weight: bold; color: #f97316;">${obstaculizacion}</div>
          <div style="font-size: 10px; color: #8b949e;">de 42</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid #f59e0b; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #f59e0b; font-size: 12px; font-weight: 600;">Intimidación</h3>
          <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">${intimidacion}</div>
          <div style="font-size: 10px; color: #8b949e;">de 42</div>
        </div>
        <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid #3b82f6; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #3b82f6; font-size: 12px; font-weight: 600;">Aislamiento</h3>
          <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${aislamiento}</div>
          <div style="font-size: 10px; color: #8b949e;">de 36</div>
        </div>
        <div style="background: rgba(139, 92, 246, 0.05); border: 1px solid #8b5cf6; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #8b5cf6; font-size: 12px; font-weight: 600;">Acoso Personal</h3>
          <div style="font-size: 18px; font-weight: bold; color: #8b5cf6;">${acosoPersonal}</div>
          <div style="font-size: 10px; color: #8b949e;">de 60</div>
        </div>
        <div style="background: rgba(156, 163, 175, 0.1); border: 1px solid #9ca3af; border-radius: 6px; padding: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #4b5563; font-size: 12px; font-weight: 600;">Total</h3>
          <div style="font-size: 18px; font-weight: bold; color: #4b5563;">${totalScore}</div>
          <div style="font-size: 10px; color: #8b949e;">de 258</div>
        </div>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px;">📋 Interpretación</h3>
        <p style="color: #374151; line-height: 1.6; margin: 0; font-size: 13px;">
          ${this.generarInterpretacion(intensidad, totalScore)}
        </p>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px;">
        <button id="btn-cisneros-pdf" class="btn btn-secondary" onclick="window.tests_cisneros.generarPDF()" style="flex: 1; min-width: 150px;">
          📄 Generar PDF
        </button>
        <button id="btn-cisneros-guardar" class="btn btn-primary" onclick="window.tests_cisneros.guardarEnExpediente()" style="flex: 1; min-width: 150px;">
          💾 Guardar en Expediente
        </button>
        <button id="btn-cisneros-exportar" class="btn btn-secondary" onclick="window.tests_cisneros.exportarJSON()" style="flex: 1; min-width: 150px;">
          ↓ Exportar JSON
        </button>
      </div>
    `;

    container.innerHTML = html;
  },

  generarTablaRespuestas() {
    const coloresRespuesta = {
      0: '#f3f4f6',
      1: '#fed7aa',
      2: '#fed7aa',
      3: '#bfdbfe',
      4: '#bfdbfe',
      5: '#86efac',
      6: '#fca5a5'
    };

    let html = `<div style="margin-bottom: 20px; page-break-inside: avoid; overflow-x: auto; width: 100%;">
      <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 13px; font-weight: 600;">TABLA DE RESPUESTAS (43 ÍTEMS)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 8px; background: white;">
        <tr style="background: #f3f4f6; border-bottom: 1px solid #d1d5db;">
          <td style="border: 1px solid #e5e7eb; padding: 2px 3px; text-align: center; font-weight: 600; color: #1f2937; width: 5%; font-size: 7px;">Ítem</td>`;

    for (let i = 1; i <= 43; i++) {
      html += `<td style="border: 1px solid #e5e7eb; padding: 1px 2px; text-align: center; font-weight: 600; color: #4b5563; font-size: 7px; width: 2.2%;">${i}</td>`;
    }
    html += `</tr>`;

    html += `<tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="border: 1px solid #e5e7eb; padding: 2px 3px; text-align: center; font-weight: 600; color: #1f2937; background: #f9fafb; font-size: 7px;">Resp.</td>`;

    for (let i = 1; i <= 43; i++) {
      const respuesta = this.respuestas.items[i] || 0;
      const color = coloresRespuesta[respuesta] || '#ffffff';
      const textColor = respuesta > 0 ? '#1f2937' : '#9ca3af';
      html += `<td style="border: 1px solid #e5e7eb; padding: 1px 2px; text-align: center; background: ${color}; font-weight: 600; color: ${textColor}; font-size: 7px;">${respuesta || '-'}</td>`;
    }
    html += `</tr>`;

    html += `<tr style="background: #f9fafb; border-top: 1px solid #d1d5db;">
      <td colspan="44" style="border: 1px solid #e5e7eb; padding: 3px 4px; font-size: 7px;">
        <span style="display: inline-block; background: #fed7aa; border: 1px solid #d1d5db; padding: 1px 3px; margin-right: 4px; border-radius: 2px; font-size: 7px;">0-2</span>
        <span style="display: inline-block; background: #bfdbfe; border: 1px solid #d1d5db; padding: 1px 3px; margin-right: 4px; border-radius: 2px; font-size: 7px;">3-4</span>
        <span style="display: inline-block; background: #86efac; border: 1px solid #d1d5db; padding: 1px 3px; margin-right: 4px; border-radius: 2px; font-size: 7px;">5</span>
        <span style="display: inline-block; background: #fca5a5; border: 1px solid #d1d5db; padding: 1px 3px; border-radius: 2px; font-size: 7px;">6</span>
      </td>
    </tr>
    </table>
    </div>`;

    return html;
  },

  generarInterpretacion(intensidad, totalScore) {
    if (intensidad === 'SIN MOBBING') {
      return 'No se detecta evidencia de mobbing. La persona no ha experimentado conductas de acoso laboral significativas.';
    } else if (intensidad === 'LEVE') {
      return 'Se detectan algunas conductas de acoso, pero de baja intensidad. Se recomienda vigilancia y documentación de incidentes.';
    } else if (intensidad === 'MODERADO') {
      return 'Se evidencia acoso laboral de intensidad moderada. Se recomienda intervención psicológica y recursos humanos.';
    } else {
      return 'Se detecta mobbing severo. Se recomienda intervención inmediata: apoyo psicológico, mediación laboral, y revisión de políticas de empresa.';
    }
  },

  generarGraficoIndices() {
    if (!this.resultados) return '';

    const { IGAP, IMAP, NEAP } = this.resultados;

    // Umbrales específicos
    const umbralNEAP_visual = 4;      // Umbral NEAP para visualización
    const umbralIGAP = 1.23;          // Umbral IGAP
    const umbralIMAP = 2.80;          // Umbral IMAP

    const width = 700;
    const height = 280;
    const barWidth = 55;
    const startX = 70;
    const gapBars = 160;
    const maxValueNEAP = 43;          // Max número de estrategias
    const maxValueIGAP = 5;           // Max escala IGAP
    const maxValueIMAP = 6;           // Max escala IMAP

    // Escalas Y diferentes por índice
    const scaleY_NEAP = (height - 80) / maxValueNEAP;
    const scaleY_IGAP = (height - 80) / maxValueIGAP;
    const scaleY_IMAP = (height - 80) / maxValueIMAP;

    let svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="max-width: 100%; margin: 0 auto;">
        <!-- Línea de base -->
        <line x1="60" y1="${height - 50}" x2="${width - 30}" y2="${height - 50}" stroke="#d1d5db" stroke-width="2"/>

        <!-- ========== NEAP (Izquierda) ========== -->
        <!-- Barra NEAP -->
        <rect x="${startX}" y="${(height - 50) - (NEAP * scaleY_NEAP)}" width="${barWidth}" height="${Math.max(NEAP * scaleY_NEAP, 2)}" fill="#22c55e" opacity="0.9"/>
        <!-- Umbral NEAP (DESPUÉS de la barra, para que aparezca encima) -->
        <line x1="${startX}" y1="${(height - 50) - (umbralNEAP_visual * scaleY_NEAP)}" x2="${startX + barWidth}" y2="${(height - 50) - (umbralNEAP_visual * scaleY_NEAP)}" stroke="#000000" stroke-width="2" stroke-dasharray="5,5"/>
        <!-- Etiqueta NEAP -->
        <text x="${startX + barWidth / 2}" y="${height - 20}" text-anchor="middle" font-size="14" fill="#1f2937" font-weight="700">NEAP</text>
        <text x="${startX + barWidth / 2}" y="${(height - 50) - (NEAP * scaleY_NEAP) - 20}" text-anchor="middle" font-size="14" fill="#22c55e" font-weight="700">${NEAP}</text>
        <text x="${startX + barWidth / 2}" y="${(height - 50) - (NEAP * scaleY_NEAP) - 5}" text-anchor="middle" font-size="10" fill="#6b7280">estrategias</text>

        <!-- ========== IGAP (Centro) ========== -->
        <!-- Etiquetas Y IGAP -->
        <text x="50" y="${height - 45}" font-size="11" fill="#6b7280">0</text>
        <text x="40" y="${(height - 50) - (2.5 * scaleY_IGAP) + 4}" font-size="11" fill="#6b7280">2.5</text>
        <text x="45" y="${(height - 50) - (5 * scaleY_IGAP) + 4}" font-size="11" fill="#6b7280">5</text>
        <!-- Barra IGAP -->
        <rect x="${startX + gapBars}" y="${(height - 50) - (IGAP * scaleY_IGAP)}" width="${barWidth}" height="${Math.max(IGAP * scaleY_IGAP, 2)}" fill="#3b82f6" opacity="0.9"/>
        <!-- Umbral IGAP (DESPUÉS de la barra, para que aparezca encima) -->
        <line x1="${startX + gapBars}" y1="${(height - 50) - (umbralIGAP * scaleY_IGAP)}" x2="${startX + gapBars + barWidth}" y2="${(height - 50) - (umbralIGAP * scaleY_IGAP)}" stroke="#000000" stroke-width="2" stroke-dasharray="5,5"/>
        <!-- Etiqueta IGAP -->
        <text x="${startX + gapBars + barWidth / 2}" y="${height - 20}" text-anchor="middle" font-size="14" fill="#1f2937" font-weight="700">IGAP</text>
        <text x="${startX + gapBars + barWidth / 2}" y="${(height - 50) - (IGAP * scaleY_IGAP) - 20}" text-anchor="middle" font-size="14" fill="#3b82f6" font-weight="700">${IGAP}</text>
        <text x="${startX + gapBars + barWidth / 2}" y="${(height - 50) - (IGAP * scaleY_IGAP) - 5}" text-anchor="middle" font-size="10" fill="#6b7280">grado agresión</text>

        <!-- ========== IMAP (Derecha) ========== -->
        <!-- Barra IMAP -->
        <rect x="${startX + gapBars * 2}" y="${(height - 50) - (IMAP * scaleY_IMAP)}" width="${barWidth}" height="${Math.max(IMAP * scaleY_IMAP, 2)}" fill="#f59e0b" opacity="0.9"/>
        <!-- Umbral IMAP (DESPUÉS de la barra, para que aparezca encima) -->
        <line x1="${startX + gapBars * 2}" y1="${(height - 50) - (umbralIMAP * scaleY_IMAP)}" x2="${startX + gapBars * 2 + barWidth}" y2="${(height - 50) - (umbralIMAP * scaleY_IMAP)}" stroke="#000000" stroke-width="2" stroke-dasharray="5,5"/>
        <!-- Etiqueta IMAP -->
        <text x="${startX + gapBars * 2 + barWidth / 2}" y="${height - 20}" text-anchor="middle" font-size="14" fill="#1f2937" font-weight="700">IMAP</text>
        <text x="${startX + gapBars * 2 + barWidth / 2}" y="${(height - 50) - (IMAP * scaleY_IMAP) - 20}" text-anchor="middle" font-size="14" fill="#f59e0b" font-weight="700">${IMAP}</text>
        <text x="${startX + gapBars * 2 + barWidth / 2}" y="${(height - 50) - (IMAP * scaleY_IMAP) - 5}" text-anchor="middle" font-size="10" fill="#6b7280">máx/mín</text>

        <!-- Leyenda (más a la izquierda, cerca de las barras) -->
        <line x1="380" y1="30" x2="400" y2="30" stroke="#000000" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="410" y="35" font-size="10" fill="#6b7280">Umbral de Alerta</text>

        <rect x="380" y="48" width="10" height="10" fill="#22c55e" opacity="0.9"/>
        <text x="410" y="56" font-size="10" fill="#6b7280">NEAP: Estrategias</text>

        <rect x="380" y="68" width="10" height="10" fill="#3b82f6" opacity="0.9"/>
        <text x="410" y="76" font-size="10" fill="#6b7280">IGAP: Grado agresión</text>

        <rect x="380" y="88" width="10" height="10" fill="#f59e0b" opacity="0.9"/>
        <text x="410" y="96" font-size="10" fill="#6b7280">IMAP: Comparación</text>
      </svg>
    `;

    return `
      <div id="cisneros-grafico-indices" style="width: 100%; min-height: 270px; display: flex; justify-content: center; align-items: center; background: white; border-radius: 6px; page-break-inside: avoid; break-inside: avoid; margin-bottom: 12px;">
        ${svg}
      </div>
    `;
  },

  generarGraficoMobbingBossing() {
    if (!this.resultados) return '';

    const { mobbingCount, bossingCount, NEAP } = this.resultados;

    const width = 550;
    const height = 350;
    const padding = 50;
    const graphWidth = width - (padding * 2);
    const graphHeight = height - (padding * 2);

    // Máximo para escalar
    const maxValue = Math.max(mobbingCount, bossingCount, 15);

    // Escala
    const scaleX = graphWidth / maxValue;
    const scaleY = graphHeight / maxValue;

    // Coordenadas del punto
    const pointX = padding + (mobbingCount * scaleX);
    const pointY = height - padding - (bossingCount * scaleY);

    // Colores
    const colorMobbing = '#dc2626';  // Rojo
    const colorBossing = '#2563eb';  // Azul

    let svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="max-width: 100%; margin: 0 auto;">
        <!-- Ejes -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#d1d5db" stroke-width="2"/>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#d1d5db" stroke-width="2"/>

        <!-- Grid -->
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect x="${padding}" y="${padding}" width="${graphWidth}" height="${graphHeight}" fill="url(#grid)"/>

        <!-- Marcas de eje X (Mobbing) -->
        <text x="${width - padding}" y="${height - padding + 25}" text-anchor="middle" font-size="12" fill="#6b7280" font-weight="600">MOBBING (Horizontal)</text>

        <!-- Marcas de eje Y (Bossing) -->
        <text x="${padding - 35}" y="${padding}" text-anchor="middle" font-size="12" fill="#6b7280" font-weight="600" transform="rotate(-90 ${padding - 35} ${padding})">BOSSING (Vertical)</text>

        <!-- Números en ejes -->
        <text x="${padding - 8}" y="${height - padding + 4}" text-anchor="end" font-size="11" fill="#8b949e">0</text>
        <text x="${padding - 8}" y="${padding + 4}" text-anchor="end" font-size="11" fill="#8b949e">${maxValue}</text>
        <text x="${width - padding}" y="${height - padding + 15}" text-anchor="middle" font-size="11" fill="#8b949e">${maxValue}</text>

        <!-- Líneas de referencia (cuadrantes) -->
        <line x1="${padding + graphWidth / 2}" y1="${padding}" x2="${padding + graphWidth / 2}" y2="${height - padding}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="${padding}" y1="${height - padding - graphHeight / 2}" x2="${width - padding}" y2="${height - padding - graphHeight / 2}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>

        <!-- Punto de paciente -->
        <circle cx="${pointX}" cy="${pointY}" r="8" fill="#f97316" opacity="0.9" stroke="white" stroke-width="2"/>

        <!-- Líneas desde ejes al punto -->
        <line x1="${pointX}" y1="${height - padding}" x2="${pointX}" y2="${pointY}" stroke="${colorMobbing}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
        <line x1="${padding}" y1="${pointY}" x2="${pointX}" y2="${pointY}" stroke="${colorBossing}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>

        <!-- Etiqueta del punto -->
        <text x="${pointX + 15}" y="${pointY - 15}" text-anchor="start" font-size="13" fill="#1f2937" font-weight="700">
          Paciente
        </text>
        <text x="${pointX + 15}" y="${pointY}" text-anchor="start" font-size="12" fill="#8b949e">
          B: ${bossingCount} | M: ${mobbingCount}
        </text>

        <!-- Total NEAP (arriba al centro) -->
        <text x="${width / 2}" y="30" text-anchor="middle" font-size="13" fill="#1f2937" font-weight="700">
          TOTAL ESTRATEGIAS DE ACOSO: ${NEAP}
        </text>

        <!-- Leyenda (arriba a la derecha, sin caja, independiente) -->
        <!-- Línea 1: MOBBING -->
        <rect x="${width - 120}" y="8" width="10" height="10" fill="${colorMobbing}" opacity="0.9"/>
        <text x="${width - 105}" y="16" font-size="11" fill="#1f2937" font-weight="500">MOBBING: ${mobbingCount}</text>

        <!-- Línea 2: BOSSING -->
        <rect x="${width - 120}" y="23" width="10" height="10" fill="${colorBossing}" opacity="0.9"/>
        <text x="${width - 105}" y="31" font-size="11" fill="#1f2937" font-weight="500">BOSSING: ${bossingCount}</text>
      </svg>
    `;

    return `
      <div id="cisneros-grafico-mobbing-bossing" style="width: 100%; min-height: 320px; display: flex; justify-content: center; align-items: center; background: white; border-radius: 6px; page-break-inside: avoid; break-inside: avoid; margin-bottom: 12px;">
        ${svg}
      </div>
    `;
  },

  generarPDF() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }

    const element = document.getElementById('cisneros-resultados');
    if (!element) {
      alert('❌ No hay resultados para generar PDF');
      return;
    }

    // Ocultar botones antes de generar PDF
    const buttons = element.querySelectorAll('button');
    const buttonStyles = [];
    buttons.forEach(btn => {
      buttonStyles.push(btn.style.display);
      btn.style.display = 'none';
    });

    // Detectar tenant y agregar logo si es Claudia Martín del Campo
    const tenantName = localStorage.getItem('clinica_nombre') || '';
    const isClaudioMartinDelCampo = tenantName.toLowerCase().includes('claudia') &&
                                     tenantName.toLowerCase().includes('martín');

    let elementToConvert = element;
    let tempContainer = null;

    if (isClaudioMartinDelCampo) {
      // Crear contenedor temporal con logo
      tempContainer = document.createElement('div');
      tempContainer.style.position = 'relative';
      tempContainer.style.width = '100%';
      tempContainer.innerHTML = element.innerHTML;

      // Agregar logo en esquina superior derecha
      const logoDiv = document.createElement('div');
      logoDiv.style.position = 'absolute';
      logoDiv.style.top = '10px';
      logoDiv.style.right = '10px';
      logoDiv.style.width = '120px';
      logoDiv.style.height = '90px';
      logoDiv.style.zIndex = '1000';

      const logoImg = document.createElement('img');
      logoImg.src = '/logos/claudia-martin-del-campo.svg';
      logoImg.style.width = '100%';
      logoImg.style.height = '100%';
      logoImg.style.objectFit = 'contain';

      logoDiv.appendChild(logoImg);
      tempContainer.appendChild(logoDiv);

      elementToConvert = tempContainer;
    }

    const opt = {
      margin: [7, 7, 7, 7],
      filename: 'CISNEROS-' + new Date().toISOString().split('T')[0] + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: 'avoid-all' }
    };

    html2pdf().set(opt).from(elementToConvert).save().then(() => {
      // Restaurar visibilidad de botones
      buttons.forEach((btn, idx) => {
        btn.style.display = buttonStyles[idx];
      });

      // Limpiar contenedor temporal si fue creado
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    });
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
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }

    const data = this.generarJSON();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([new TextEncoder().encode(json)], { type: 'application/json;charset=utf-8' });
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
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);

          if (!data.respuestas || !Array.isArray(data.respuestas)) {
            throw new Error('Formato de JSON inválido: falta array "respuestas"');
          }

          // Convertir a números (pueden venir como strings)
          const respuestasNumeros = data.respuestas.map(v => {
            const num = parseInt(v);
            return isNaN(num) ? 0 : num;
          });

          // Cargar en respuestas (agregar 0 al inicio)
          this.respuestas.items = [0, ...respuestasNumeros];

          // Guardar en localStorage
          localStorage.setItem('CISNEROS_respuestas', JSON.stringify(this.respuestas));

          // Cargar metadatos EN LOCALSTORAGE (no en DOM, como MBI)
          if (data.metadatos && typeof data.metadatos === 'object') {
            if (data.metadatos.paciente_nombre) {
              localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
            }
            if (data.metadatos.edad) {
              localStorage.setItem('paciente_edad', data.metadatos.edad);
            }
            if (data.metadatos.sexo) {
              localStorage.setItem('paciente_sexo', data.metadatos.sexo);
            }
            if (data.metadatos.empresa) {
              localStorage.setItem('clinica_nombre', data.metadatos.empresa);
            }
            if (data.metadatos.evaluador) {
              localStorage.setItem('usuario_nombre', data.metadatos.evaluador);
            }
            if (data.metadatos.fecha_evaluacion) {
              localStorage.setItem('paciente_fecha', data.metadatos.fecha_evaluacion);
            }
          }

          // 🔑 CLAVE: Cargar respuestas en DOM (marcar radio buttons como checked)
          this.cargarRespuestasEnDOM(data);

          // Renderizar items para mostrar radio buttons seleccionados (como MBI)
          this.renderizarItems();

          // Cargar datos de paciente en formulario (desde localStorage)
          this.cargarDatosPaciente();

          alert(`✅ Archivo "${file.name}" importado correctamente.\n\nAhora haz clic en "Calcular Resultados"`);
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Actualizar progreso
          this.actualizarProgreso();
        } catch (error) {
          console.error('Error al importar JSON:', error, error.stack);
          alert('❌ Error al importar: ' + error.message);
        }
      };
      reader.readAsText(file);
    });
  },

  cargarRespuestasEnDOM(data) {
    if (!data.respuestas || !Array.isArray(data.respuestas)) return;

    data.respuestas.forEach((resp, index) => {
      const numero = index + 1;
      if (numero <= 43) {
        const radio = document.querySelector(`input[name="cisneros_item_${numero}"][value="${resp}"]`);
        if (radio) radio.checked = true;
      }
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

    const btn = document.querySelector('button[onclick*="guardarEnExpediente"]');
    const btnOriginalText = btn?.textContent || 'Guardar';
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Generando PDF...';
    }

    const data = this.respuestas.items.slice(1, 44);
    const { demerito, obstaculizacion, intimidacion, aislamiento, acosoPersonal } = this.resultados;
    const fecha = document.getElementById('c_fecha')?.value || new Date().toISOString().split('T')[0];

    // Generar PDF desde el contenedor de resultados
    const element = document.getElementById('cisneros-resultados');
    if (!element) {
      alert('❌ No hay resultados para guardar');
      if (btn) {
        btn.disabled = false;
        btn.textContent = btnOriginalText;
      }
      return;
    }

    const opt = {
      margin: 10,
      filename: 'CISNEROS-' + fecha + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      // Convertir PDF a base64 (sin prefijo)
      const pdfDataUri = pdf.output('datauristring');
      const pdfBase64 = pdfDataUri.split(',')[1]; // Quitar "data:application/pdf;base64,"

      console.log('📄 PDF generado:', pdfBase64.substring(0, 50) + '...');

      const totalScore = demerito + obstaculizacion + intimidacion + aislamiento + acosoPersonal;

      const subescalas = {
        demérito: demerito,
        obstaculización: obstaculizacion,
        intimidación: intimidacion,
        aislamiento: aislamiento,
        acoso_personal: acosoPersonal,
        intensidad: this.resultados.intensidad
      };

      const bodyToSend = {
        paciente_id: pacienteId,
        tipo: 'CISNEROS',
        data: data,
        total: totalScore,
        subescalas: subescalas,
        pdf_base64: pdfBase64
      };

      console.log('💾 Enviando a servidor:', { paciente_id: pacienteId, tipo: 'CISNEROS', pdf_size: pdfBase64.length });

      return fetch('/api/pruebas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(bodyToSend)
      });
    }).then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.error || `HTTP ${response.status}`);
        });
      }
      return response.json();
    }).then(result => {
      const successMsg = document.createElement('div');
      successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; z-index: 9999; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
      successMsg.innerHTML = `✅ Resultados guardados en expediente`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      console.log('✅ CISNEROS guardado en expediente:', result);

      // Regresar al dashboard del paciente después de 2 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }).catch(error => {
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 15px; border-radius: 8px; z-index: 9999;';
      errorMsg.textContent = `❌ Error: ${error.message}`;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 5000);

      console.error('Error:', error);
      if (btn) {
        btn.disabled = false;
        btn.textContent = btnOriginalText;
      }
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
    // Remover active de todos los contenidos
    const tabs = document.querySelectorAll('.cisneros-tab-content');
    tabs.forEach(t => t.classList.remove('active'));

    // Remover active de todos los botones de tab
    const tabButtons = document.querySelectorAll('.cisneros-tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Agregar active al contenido correcto
    const tabContent = document.getElementById(`tab-${tab}`);
    if (tabContent) {
      tabContent.classList.add('active');
    }

    // Agregar active al botón de tab correcto
    const tabButton = document.querySelector(`.cisneros-tab[data-tab="${tab}"]`);
    if (tabButton) {
      tabButton.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
