/**
 * MBI: INVENTARIO DE BURNOUT DE MASLACH
 * 22 ítems, 3 subescalas (Agotamiento Emocional, Despersonalización, Realización Personal)
 * Escala: 1-5 (Nunca a Diariamente)
 * Validado: Maslach & Jackson (1981)
 */

window.tests_mbi = {
  nombre: 'MBI',
  tipo: 'MBI',
  totalItems: 22,
  seccionActual: 1,
  pacienteId: null,
  resultados: null,

  // Estructura de respuestas
  respuestas: {
    // 22 ítems (índices 1-22)
    items: Array(23).fill(0),

    // Subescalas
    agotamientoEmocional: 0,    // Ítems: 1,2,3,6,8,13,14,16,20
    despersonalizacion: 0,       // Ítems: 5,10,11,15,22
    realizacionPersonal: 0       // Ítems: 4,7,9,12,17,18,19,21
  },

  // Definiciones de ítems
  itemDefinitions: {
    1: "Me siento emocionalmente defraudado en mi trabajo",
    2: "Cuando termino mi jornada de trabajo me siento agotado",
    3: "Cuando me levanto por la mañana y me enfrento a otra jornada de trabajo me siento agotado",
    4: "Siento que puedo entender fácilmente a las personas que tengo que atender",
    5: "Siento que estoy tratando a algunos beneficiados de mí, como si fuesen objetos impersonales",
    6: "Siento que trabajar todo el día con la gente me cansa",
    7: "Siento que trato con mucha efectividad los problemas de las personas a las que tengo que atender",
    8: "Siento que mi trabajo me está desgastando",
    9: "Siento que estoy influyendo positivamente en las vidas de otras personas a través de mi trabajo",
    10: "Siento que me he hecho más duro con la gente",
    11: "Me preocupa que este trabajo me está endureciendo emocionalmente",
    12: "Me siento muy enérgico en mi trabajo",
    13: "Me siento frustrado por el trabajo",
    14: "Siento que estoy demasiado tiempo en mi trabajo",
    15: "Siento que realmente no me importa lo que les ocurra a las personas a las que tengo que atender profesionalmente",
    16: "Siento que trabajar en contacto directo con la gente me cansa",
    17: "Siento que puedo crear con facilidad un clima agradable en mi trabajo",
    18: "Me siento estimulado después de haber trabajado íntimamente con quienes tengo que atender",
    19: "Creo que consigo muchas cosas valiosas en este trabajo",
    20: "Me siento como si estuviera al límite de mis posibilidades",
    21: "Siento que en mi trabajo los problemas emocionales son tratados de forma adecuada",
    22: "Me parece que los beneficiarios de mi trabajo me culpan de algunos problemas"
  },

  // Subescalas y ítems asociados
  escalas: {
    agotamientoEmocional: {
      nombre: "Agotamiento Emocional",
      items: [1, 2, 3, 6, 8, 13, 14, 16, 20],
      minimo: 0,
      maximo: 45,
      baremos: {
        bajo: { min: 0, max: 16, nivel: "Bajo", color: "#22c55e" },
        moderado: { min: 17, max: 26, nivel: "Moderado", color: "#eab308" },
        alto: { min: 27, max: 45, nivel: "Alto", color: "#ef4444" }
      }
    },
    despersonalizacion: {
      nombre: "Despersonalización",
      items: [5, 10, 11, 15, 22],
      minimo: 0,
      maximo: 25,
      baremos: {
        bajo: { min: 0, max: 6, nivel: "Bajo", color: "#22c55e" },
        moderado: { min: 7, max: 12, nivel: "Moderado", color: "#eab308" },
        alto: { min: 13, max: 25, nivel: "Alto", color: "#ef4444" }
      }
    },
    realizacionPersonal: {
      nombre: "Realización Personal",
      items: [4, 7, 9, 12, 17, 18, 19, 21],
      minimo: 0,
      maximo: 40,
      // ⚠️ INVERTIDA: puntuaciones altas = bajo burnout
      baremos: {
        altoBurnout: { min: 0, max: 17, nivel: "Alto burnout (Malo)", color: "#ef4444" },
        moderado: { min: 18, max: 29, nivel: "Moderado", color: "#eab308" },
        bajoBurnout: { min: 30, max: 40, nivel: "Bajo burnout (Bueno)", color: "#22c55e" }
      }
    }
  },

  // Escala de frecuencia
  escalaFrequencia: [
    { valor: 1, label: "Nunca" },
    { valor: 2, label: "Algunas veces al año" },
    { valor: 3, label: "Algunas veces al mes" },
    { valor: 4, label: "Algunas veces a la semana" },
    { valor: 5, label: "Diariamente" }
  ],

  init() {
    this.pacienteId = sessionStorage.getItem('pacienteSeleccionado') || localStorage.getItem('paciente_id');

    // Cargar nombre de paciente
    let nombre = localStorage.getItem('paciente_nombre') || sessionStorage.getItem('paciente_nombre');
    if (!nombre) {
      nombre = 'Paciente sin especificar';
      localStorage.setItem('paciente_nombre', nombre);
    }

    // Renderizar tabla de ítems
    this.renderizarItems();

    // Cargar datos del paciente en formulario
    this.cargarDatosPaciente();

    // Inicializar importador JSON
    this.inicializarImportador();

    // Actualizar progreso
    this.actualizarProgreso();
  },

  cargarDatosPaciente() {
    const nombre = sessionStorage.getItem('paciente_nombre') || localStorage.getItem('paciente_nombre') || '';
    const edad = sessionStorage.getItem('paciente_edad') || localStorage.getItem('paciente_edad') || '';
    const sexo = sessionStorage.getItem('paciente_sexo') || localStorage.getItem('paciente_sexo') || '';
    const centro = sessionStorage.getItem('clinica_nombre') || localStorage.getItem('clinica_nombre') || '';
    const evaluador = sessionStorage.getItem('usuario_nombre') || localStorage.getItem('nombre') || localStorage.getItem('usuario_nombre') || '';

    if (document.getElementById('m_nombre')) document.getElementById('m_nombre').value = nombre;
    if (document.getElementById('m_edad')) document.getElementById('m_edad').value = edad;
    if (document.getElementById('m_sexo')) document.getElementById('m_sexo').value = sexo;
    if (document.getElementById('m_centro')) document.getElementById('m_centro').value = centro;
    if (document.getElementById('m_evaluador')) document.getElementById('m_evaluador').value = evaluador;

    const hoy = new Date().toISOString().split('T')[0];
    if (document.getElementById('m_fecha')) document.getElementById('m_fecha').value = hoy;
  },

  renderizarItems() {
    const container = document.getElementById('mbi-items-container');
    if (!container) return;

    let html = `
      <div class="mbi-instruction">
        <p><strong>Instrucciones:</strong> Indique con qué frecuencia experimenta cada sentimiento usando la escala del 1 (Nunca) al 5 (Diariamente).</p>
      </div>

      <table class="mbi-items-table">
        <thead>
          <tr>
            <th style="width: 50%; text-align: left; padding: 12px; border: 1px solid var(--border);">Enunciado</th>
            <th colspan="5" style="text-align: center; padding: 12px; border: 1px solid var(--border);">Frecuencia</th>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px; border: 1px solid var(--border);"></th>
            <th style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">1</th>
            <th style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">2</th>
            <th style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">3</th>
            <th style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">4</th>
            <th style="text-align: center; padding: 8px; border: 1px solid var(--border); font-size: 12px;">5</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 1; i <= 22; i++) {
      const escala = this.obtenerEscalaItem(i);
      const bgColor = escala === 'A.E.' ? 'background: rgba(239, 68, 68, 0.05);' :
                      escala === 'D.' ? 'background: rgba(245, 158, 11, 0.05);' :
                      'background: rgba(34, 197, 94, 0.05);';

      html += `
        <tr style="${bgColor}">
          <td style="padding: 12px; border: 1px solid var(--border);">
            <strong style="color: #60a5fa;">${i}.</strong>
            <span style="color: #60a5fa; font-size: 13px;">
              ${this.itemDefinitions[i]}
            </span>
            <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">${escala}</div>
          </td>
      `;

      for (let valor = 1; valor <= 5; valor++) {
        const checked = this.respuestas.items[i] === valor ? 'checked' : '';
        html += `
          <td style="text-align: center; padding: 8px; border: 1px solid var(--border);">
            <input type="radio"
                   name="mbi_item_${i}"
                   value="${valor}"
                   ${checked}
                   onchange="window.tests_mbi.cambiarRespuesta(${i}, ${valor})">
          </td>
        `;
      }

      html += `</tr>`;
    }

    html += `
        </tbody>
      </table>

      <div class="button-group" style="margin-top: 20px;">
        <button onclick="window.tests_mbi.irTab('resultados'); window.tests_mbi.calcularResultados();" class="btn btn-primary">⊡ Calcular Resultados</button>
        <button onclick="window.tests_mbi.exportarJSON()" class="btn btn-secondary">↓ Exportar JSON</button>
        <button onclick="document.getElementById('mbi-file-input').click()" class="btn btn-secondary">↑ Importar JSON</button>
        <button onclick="window.tests_mbi.limpiar()" class="btn btn-danger">✕ Limpiar</button>
      </div>
    `;

    container.innerHTML = html;
  },

  obtenerEscalaItem(numero) {
    if ([1, 2, 3, 6, 8, 13, 14, 16, 20].includes(numero)) return "A.E. (Agotamiento)";
    if ([5, 10, 11, 15, 22].includes(numero)) return "D. (Despersonalización)";
    return "R.P. (Realización Personal)";
  },

  cambiarRespuesta(numero, valor) {
    this.respuestas.items[numero] = valor;
    this.actualizarProgreso();
  },

  actualizarProgreso() {
    const respondidas = this.respuestas.items.filter(v => v > 0).length;
    const total = 22;
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
    // Calcular puntuaciones por escala
    const ae = this.escalas.agotamientoEmocional.items.reduce((sum, i) => sum + (this.respuestas.items[i] || 0), 0);
    const d = this.escalas.despersonalizacion.items.reduce((sum, i) => sum + (this.respuestas.items[i] || 0), 0);
    const rp = this.escalas.realizacionPersonal.items.reduce((sum, i) => sum + (this.respuestas.items[i] || 0), 0);

    // Determinar niveles
    const nivelAE = ae <= 16 ? 'bajo' : ae <= 26 ? 'moderado' : 'alto';
    const nivelD = d <= 6 ? 'bajo' : d <= 12 ? 'moderado' : 'alto';
    const nivelRP = rp >= 30 ? 'bajoBurnout' : rp >= 18 ? 'moderado' : 'altoBurnout';

    // Contar escalas elevadas para diagnóstico
    let contadorAltos = 0;
    if (nivelAE === 'alto') contadorAltos++;
    if (nivelD === 'alto') contadorAltos++;
    if (nivelRP === 'altoBurnout') contadorAltos++;

    let diagnostico = '';
    if (contadorAltos === 0) diagnostico = 'SIN BURNOUT';
    else if (contadorAltos === 1) diagnostico = 'BURNOUT LEVE';
    else if (contadorAltos === 2) diagnostico = 'BURNOUT MODERADO';
    else diagnostico = 'BURNOUT SEVERO';

    this.resultados = {
      ae,
      d,
      rp,
      nivelAE,
      nivelD,
      nivelRP,
      diagnostico
    };

    this.mostrarResultados();
  },

  mostrarResultados() {
    const containerPDF = document.getElementById('mbi-resultados-pdf');
    const containerBotones = document.getElementById('mbi-resultados-botones');
    if (!containerPDF || !containerBotones) return;

    const { ae, d, rp, nivelAE, nivelD, nivelRP, diagnostico } = this.resultados;
    const baremosAE = this.escalas.agotamientoEmocional.baremos[nivelAE];
    const baremosD = this.escalas.despersonalizacion.baremos[nivelD];
    const baremosRP = this.escalas.realizacionPersonal.baremos[nivelRP];

    const colorDiagnostico = diagnostico === 'SIN BURNOUT' ? '#22c55e' :
                            diagnostico === 'BURNOUT LEVE' ? '#eab308' :
                            diagnostico === 'BURNOUT MODERADO' ? '#f97316' : '#ef4444';

    const nombre = document.getElementById('m_nombre')?.value || sessionStorage.getItem('paciente_nombre') || 'Paciente';
    const edad = document.getElementById('m_edad')?.value || sessionStorage.getItem('paciente_edad') || '';
    const sexo = document.getElementById('m_sexo')?.value || sessionStorage.getItem('paciente_sexo') || '';
    const centro = document.getElementById('m_centro')?.value || sessionStorage.getItem('clinica_nombre') || '';
    const evaluador = document.getElementById('m_evaluador')?.value || sessionStorage.getItem('usuario_nombre') || localStorage.getItem('nombre') || '';
    const fecha = document.getElementById('m_fecha')?.value || new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    let html = `
      <!-- DATOS DEL PACIENTE -->
      <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">DATOS DEL PACIENTE Y EVALUADOR</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
          <div><span style="font-weight: 600; color: #4b5563;">Paciente:</span> <span style="color: #1f2937;">${nombre}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Edad:</span> <span style="color: #1f2937;">${edad} años</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Sexo:</span> <span style="color: #1f2937;">${sexo}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Centro:</span> <span style="color: #1f2937;">${centro}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Evaluador:</span> <span style="color: #1f2937;">${evaluador}</span></div>
          <div><span style="font-weight: 600; color: #4b5563;">Fecha/Hora:</span> <span style="color: #1f2937;">${fecha} ${hora}</span></div>
        </div>
      </div>

      <div style="background: ${colorDiagnostico}20; border-left: 4px solid ${colorDiagnostico}; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: ${colorDiagnostico}; margin: 0 0 8px 0;">🔍 DIAGNÓSTICO</h2>
        <p style="font-size: 24px; font-weight: bold; color: ${colorDiagnostico}; margin: 0;">${diagnostico}</p>
        <p style="color: #8b949e; margin: 8px 0 0 0; font-size: 14px;">Evaluado: ${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px;">

        <!-- Agotamiento Emocional -->
        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid #ef4444; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #ef4444;">Agotamiento Emocional</h3>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="font-size: 32px; font-weight: bold; color: #ef4444;">${ae}</div>
            <div>
              <div style="font-size: 12px; color: #8b949e;">de 45 puntos</div>
              <div style="font-size: 14px; font-weight: 600; color: ${baremosAE.color};">${baremosAE.nivel}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: #1f2937; background: #e5e7eb; padding: 8px; border-radius: 4px;">
            Rango: ${baremosAE.min}-${baremosAE.max} puntos
          </div>
        </div>

        <!-- Despersonalización -->
        <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #f59e0b;">Despersonalización</h3>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="font-size: 32px; font-weight: bold; color: #f59e0b;">${d}</div>
            <div>
              <div style="font-size: 12px; color: #8b949e;">de 25 puntos</div>
              <div style="font-size: 14px; font-weight: 600; color: ${baremosD.color};">${baremosD.nivel}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: #1f2937; background: #e5e7eb; padding: 8px; border-radius: 4px;">
            Rango: ${baremosD.min}-${baremosD.max} puntos
          </div>
        </div>

        <!-- Realización Personal -->
        <div style="background: rgba(34, 197, 94, 0.05); border: 1px solid #22c55e; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; color: #22c55e;">Realización Personal</h3>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="font-size: 32px; font-weight: bold; color: #22c55e;">${rp}</div>
            <div>
              <div style="font-size: 12px; color: #8b949e;">de 40 puntos</div>
              <div style="font-size: 14px; font-weight: 600; color: ${baremosRP.color};">${baremosRP.nivel}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: #1f2937; background: #e5e7eb; padding: 8px; border-radius: 4px;">
            ⚠️ Escala invertida: puntuaciones altas = bajo burnout
          </div>
        </div>

      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px;">📊 Comparación vs Persona Normal</h3>
        <div id="mbi-grafico-comparativo" style="width: 100%; min-height: 300px; display: flex; justify-content: center; align-items: center; background: white; border-radius: 6px;">
          <!-- SVG del gráfico se renderiza aquí -->
        </div>
        <p style="margin-top: 12px; font-size: 12px; color: #6b7280; text-align: center;">
          Azul: Tu puntuación | Verde: Promedio Normal | Rojo: Riesgo Alto
        </p>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937;">Interpretación Clínica</h3>
        <p style="color: #374151; line-height: 1.6; margin: 0; font-size: 14px;">
          ${this.generarInterpretacion()}
        </p>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937;">Recomendaciones</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px; font-size: 14px;">
          ${this.generarRecomendaciones()}
        </ul>
      </div>
    `;

    const htmlBotones = `
      <button onclick="window.tests_mbi.generarPDF()" class="btn btn-primary">📄 Generar PDF</button>
      <button class="btn btn-primary" id="btn-mbi-guardar" onclick="window.tests_mbi.guardarEnExpediente()" style="background:#27ae60">⊡ Guardar en Expediente</button>
      <button onclick="window.tests_mbi.exportarJSON()" class="btn btn-secondary">💾 Exportar JSON</button>
    `;

    // Renderizar: contenido en PDF container, botones separados
    containerPDF.innerHTML = html;
    containerBotones.innerHTML = htmlBotones;
    containerBotones.style.display = 'flex';

    // Renderizar gráfico comparativo después de cargar el HTML
    setTimeout(() => this.renderizarGraficoComparativo(), 0);
  },

  renderizarGraficoComparativo() {
    const graficoContainer = document.getElementById('mbi-grafico-comparativo');
    if (!graficoContainer || !this.resultados) return;

    const { ae, d, rp } = this.resultados;

    // Normas oficiales MBI (Maslach & Jackson)
    const normaAE = 26;      // Media en población general
    const normaD = 9;        // Media en población general
    const normaRP = 34;      // Media en población general (alta = bueno)

    const width = 600;
    const height = 300;
    const barWidth = 60;
    const barGap = 80;
    const maxValue = 50;

    // Escala Y (altura de barras)
    const scaleY = (height - 60) / maxValue;

    let svg = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="max-width: 100%; margin: 0 auto;">
        <!-- Línea de base -->
        <line x1="50" y1="${height - 40}" x2="${width - 20}" y2="${height - 40}" stroke="#d1d5db" stroke-width="2"/>

        <!-- Etiquetas Y -->
        <text x="40" y="${height - 35}" font-size="12" fill="#6b7280">0</text>
        <text x="35" y="${(height - 40) - (25 * scaleY) + 4}" font-size="12" fill="#6b7280">25</text>
        <text x="35" y="${(height - 40) - (50 * scaleY) + 4}" font-size="12" fill="#6b7280">50</text>

        <!-- AGOTAMIENTO EMOCIONAL (max 45) -->
        <!-- Norma -->
        <rect x="80" y="${(height - 40) - (normaAE * scaleY * 0.9)}" width="${barWidth}" height="${normaAE * scaleY * 0.9}" fill="#22c55e" opacity="0.6"/>
        <!-- Paciente -->
        <rect x="${80 + barWidth + 10}" y="${(height - 40) - (ae * scaleY * 0.9)}" width="${barWidth}" height="${ae * scaleY * 0.9}" fill="#3b82f6" opacity="0.8"/>

        <text x="${80 + barWidth / 2}" y="${height - 15}" text-anchor="middle" font-size="12" fill="#1f2937" font-weight="500">A.E.</text>
        <text x="${80 + barWidth / 2}" y="${(height - 40) - (normaAE * scaleY * 0.9) - 8}" text-anchor="middle" font-size="11" fill="#6b7280">${normaAE}</text>
        <text x="${80 + barWidth + 10 + barWidth / 2}" y="${(height - 40) - (ae * scaleY * 0.9) - 8}" text-anchor="middle" font-size="11" fill="#3b82f6">${ae}</text>

        <!-- DESPERSONALIZACIÓN (max 25) -->
        <!-- Norma -->
        <rect x="${250}" y="${(height - 40) - (normaD * scaleY)}" width="${barWidth}" height="${normaD * scaleY}" fill="#22c55e" opacity="0.6"/>
        <!-- Paciente -->
        <rect x="${250 + barWidth + 10}" y="${(height - 40) - (d * scaleY)}" width="${barWidth}" height="${d * scaleY}" fill="#3b82f6" opacity="0.8"/>

        <text x="${250 + barWidth / 2}" y="${height - 15}" text-anchor="middle" font-size="12" fill="#1f2937" font-weight="500">D.</text>
        <text x="${250 + barWidth / 2}" y="${(height - 40) - (normaD * scaleY) - 8}" text-anchor="middle" font-size="11" fill="#6b7280">${normaD}</text>
        <text x="${250 + barWidth + 10 + barWidth / 2}" y="${(height - 40) - (d * scaleY) - 8}" text-anchor="middle" font-size="11" fill="#3b82f6">${d}</text>

        <!-- REALIZACIÓN PERSONAL (max 40, invertida) -->
        <!-- Norma -->
        <rect x="${420}" y="${(height - 40) - (normaRP * scaleY * 0.8)}" width="${barWidth}" height="${normaRP * scaleY * 0.8}" fill="#22c55e" opacity="0.6"/>
        <!-- Paciente -->
        <rect x="${420 + barWidth + 10}" y="${(height - 40) - (rp * scaleY * 0.8)}" width="${barWidth}" height="${rp * scaleY * 0.8}" fill="#3b82f6" opacity="0.8"/>

        <text x="${420 + barWidth / 2}" y="${height - 15}" text-anchor="middle" font-size="12" fill="#1f2937" font-weight="500">R.P.</text>
        <text x="${420 + barWidth / 2}" y="${(height - 40) - (normaRP * scaleY * 0.8) - 8}" text-anchor="middle" font-size="11" fill="#6b7280">${normaRP}</text>
        <text x="${420 + barWidth + 10 + barWidth / 2}" y="${(height - 40) - (rp * scaleY * 0.8) - 8}" text-anchor="middle" font-size="11" fill="#3b82f6">${rp}</text>

        <!-- Leyenda -->
        <rect x="80" y="10" width="10" height="10" fill="#22c55e" opacity="0.6"/>
        <text x="100" y="19" font-size="11" fill="#6b7280">Promedio Normal</text>

        <rect x="280" y="10" width="10" height="10" fill="#3b82f6" opacity="0.8"/>
        <text x="300" y="19" font-size="11" fill="#6b7280">Tu Puntuación</text>
      </svg>
    `;

    graficoContainer.innerHTML = svg;
  },

  generarInterpretacion() {
    const { ae, d, rp, diagnostico } = this.resultados;

    if (diagnostico === 'SIN BURNOUT') {
      return `Niveles bajos en todas las dimensiones de burnout. La persona mantiene un equilibrio saludable
              entre el trabajo y su bienestar personal, con alta realización profesional y baja
              despersonalización. Continuar con prácticas de autocuidado y prevención.`;
    } else if (diagnostico === 'BURNOUT LEVE') {
      return `Síntomas iniciales de burnout en una de las dimensiones. Requiere atención preventiva
              para evitar progresión. Se recomienda implementar estrategias de afrontamiento y
              manejo del estrés.`;
    } else if (diagnostico === 'BURNOUT MODERADO') {
      return `Síndrome de burnout moderado con afectación en dos dimensiones. Hay signos claros de
              agotamiento y/o despersonalización. Se requiere intervención profesional para evitar
              deterioro de la salud mental.`;
    } else {
      return `Síndrome de burnout severo en todas las dimensiones. Situación crítica que requiere
              intervención urgente. Se recomienda evaluación psicológica completa y posible derivación
              a especialista. Considerar cambios en la situación laboral.`;
    }
  },

  generarRecomendaciones() {
    const { diagnostico } = this.resultados;
    let recomendaciones = [];

    if (diagnostico === 'SIN BURNOUT') {
      recomendaciones = [
        "Registrar en expediente como evaluación normal",
        "Realizar evaluaciones de seguimiento anual",
        "Monitorear indicadores de bienestar laboral",
        "Documentar factores protectores identificados"
      ];
    } else if (diagnostico === 'BURNOUT LEVE') {
      recomendaciones = [
        "Diseñar intervención preventiva individualizada",
        "Reevaluación con MBI en 2-3 meses",
        "Recomendar evaluación de ambiente laboral",
        "Considerar consejería ocupacional",
        "Documentar plan de seguimiento en expediente"
      ];
    } else if (diagnostico === 'BURNOUT MODERADO') {
      recomendaciones = [
        "Diseñar programa de intervención psicológica",
        "Solicitar evaluación de carga laboral organizacional",
        "Reevaluación mensual con MBI",
        "Considerar derivación a medicina ocupacional",
        "Evaluación de factores organizacionales que contribuyen",
        "Documentar en expediente clínico con plan de intervención"
      ];
    } else {
      recomendaciones = [
        "Intervención psicológica inmediata (urgente)",
        "Solicitar evaluación médica y ocupacional",
        "Considerar recomendación de cambio de rol laboral",
        "Establecer seguimiento semanal o quincenal",
        "Evaluar riesgo biopsicosocial completo",
        "Derivar a especialista si hay comorbilidad",
        "Documentar en expediente con protocolo de crisis"
      ];
    }

    return recomendaciones.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('');
  },

  generarPDF() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }

    const nombre_paciente = localStorage.getItem('paciente_nombre') || 'Paciente';
    const resultContainer = document.getElementById('mbi-resultados-pdf');

    if (!resultContainer) {
      alert('No se encontró el contenedor de resultados');
      return;
    }

    const opt = {
      margin: 10,
      filename: `MBI_${nombre_paciente}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    html2pdf().set(opt).from(resultContainer).save();
    alert('✅ PDF descargado correctamente');
  },

  exportarJSON() {
    if (!this.resultados) {
      alert('Primero calcula los resultados');
      return;
    }

    const paciente_nombre = localStorage.getItem('paciente_nombre') || 'Paciente';
    const evaluador = document.getElementById('m_evaluador')?.value || localStorage.getItem('nombre') || 'Sin especificar';
    const fecha_eval = new Date().toISOString().split('T')[0];

    const data = {
      testType: 'MBI',
      version: '1.0',
      respuestas: this.respuestas.items.slice(1), // Excluir índice 0
      metadatos: {
        paciente_nombre,
        paciente_id: sessionStorage.getItem('pacienteSeleccionado'),
        evaluador,
        fecha_evaluacion: fecha_eval,
        centro: localStorage.getItem('clinica_nombre') || 'No especificado'
      },
      puntuaciones: {
        agotamiento_emocional: this.resultados.ae,
        despersonalizacion: this.resultados.d,
        realizacion_personal: this.resultados.rp
      },
      diagnostico: {
        burnout: this.resultados.diagnostico,
        niveles: {
          agotamiento_emocional: this.resultados.nivelAE,
          despersonalizacion: this.resultados.nivelD,
          realizacion_personal: this.resultados.nivelRP
        }
      },
      respondidas: this.respuestas.items.filter(x => x > 0).length,
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MBI_${paciente_nombre}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  inicializarImportador() {
    const fileInput = document.getElementById('mbi-file-input');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);

          if (!data.respuestas || !Array.isArray(data.respuestas)) {
            throw new Error('Formato de JSON inválido');
          }

          // Convertir a números (pueden venir como strings)
          const respuestasNumeros = data.respuestas.map(v => {
            const num = parseInt(v);
            return isNaN(num) ? 0 : num;
          });

          // Cargar en respuestas (agregar 0 al inicio)
          this.respuestas.items = [0, ...respuestasNumeros];

          // Cargar metadatos
          if (data.metadatos) {
            if (data.metadatos.paciente_nombre) {
              localStorage.setItem('paciente_nombre', data.metadatos.paciente_nombre);
            }
          }

          // Cargar respuestas en DOM
          this.cargarRespuestasEnDOM(data);

          // Actualizar UI
          this.renderizarItems();
          this.actualizarProgreso();

          alert(`✅ Archivo "${file.name}" importado correctamente.\n\nAhora haz clic en "Calcular Resultados"`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          alert('❌ Error al parsear JSON: ' + error.message);
          console.error('Parse error:', error);
        }
      };
      reader.readAsText(file);
    });
  },

  cargarRespuestasEnDOM(data) {
    if (!data.respuestas || !Array.isArray(data.respuestas)) return;

    data.respuestas.forEach((resp, index) => {
      const numero = index + 1;
      if (numero <= 22) {
        const radio = document.querySelector(`input[name="mbi_item_${numero}"][value="${resp}"]`);
        if (radio) radio.checked = true;
      }
    });
  },

  guardarEnExpediente() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados antes de guardar.');
      return;
    }

    const btn = document.getElementById('btn-mbi-guardar');
    const btnOriginalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';

    const pacienteId = sessionStorage.getItem('pacienteSeleccionado');
    const { ae, d, rp, diagnostico } = this.resultados;

    const data = this.respuestas.items.slice(1);
    const subescalas = {
      agotamiento_emocional: ae,
      despersonalizacion: d,
      realizacion_personal: rp,
      diagnostico: diagnostico,
      _evaluador: localStorage.getItem('nombre') || 'Sin especificar'
    };

    api.guardarPrueba(
      pacienteId,
      'MBI',
      data,
      ae + d + rp, // Score total (0-110)
      subescalas,
      localStorage.getItem('nombre')
    ).then(resultado => {
      alert('✅ Resultados guardados en expediente correctamente');
      window.history.back();
    }).catch(error => {
      alert('❌ Error al guardar: ' + error.message);
      console.error('Error:', error);
    }).finally(() => {
      btn.disabled = false;
      btn.textContent = btnOriginalText;
    });
  },

  limpiar() {
    if (confirm('¿Estás seguro que deseas limpiar todas las respuestas?')) {
      this.respuestas.items = Array(23).fill(0);
      this.resultados = null;
      this.renderizarItems();
      this.actualizarProgreso();
    }
  },

  irTab(tab) {
    const tabs = document.querySelectorAll('.mbi-tab-content');
    tabs.forEach(t => t.classList.remove('active'));

    const tabContent = document.getElementById(`tab-${tab}`);
    if (tabContent) {
      tabContent.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
