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

    // Inicializar importador JSON
    this.inicializarImportador();

    // Actualizar progreso
    this.actualizarProgreso();
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
    const container = document.getElementById('mbi-resultados');
    if (!container) return;

    const { ae, d, rp, nivelAE, nivelD, nivelRP, diagnostico } = this.resultados;
    const baremosAE = this.escalas.agotamientoEmocional.baremos[nivelAE];
    const baremosD = this.escalas.despersonalizacion.baremos[nivelD];
    const baremosRP = this.escalas.realizacionPersonal.baremos[nivelRP];

    const colorDiagnostico = diagnostico === 'SIN BURNOUT' ? '#22c55e' :
                            diagnostico === 'BURNOUT LEVE' ? '#eab308' :
                            diagnostico === 'BURNOUT MODERADO' ? '#f97316' : '#ef4444';

    let html = `
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
          <div style="font-size: 12px; color: #8b949e; background: #161b2299; padding: 8px; border-radius: 4px;">
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
          <div style="font-size: 12px; color: #8b949e; background: #161b2299; padding: 8px; border-radius: 4px;">
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
          <div style="font-size: 12px; color: #8b949e; background: #161b2299; padding: 8px; border-radius: 4px;">
            ⚠️ Escala invertida: puntuaciones altas = bajo burnout
          </div>
        </div>

      </div>

      <div style="background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0;">Interpretación Clínica</h3>
        <p style="color: #e6edf3; line-height: 1.6; margin: 0;">
          ${this.generarInterpretacion()}
        </p>
      </div>

      <div style="background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 16px;">
        <h3 style="margin: 0 0 12px 0;">Recomendaciones</h3>
        <ul style="color: #e6edf3; margin: 0; padding-left: 20px;">
          ${this.generarRecomendaciones()}
        </ul>
      </div>

      <div class="button-group" style="margin-top: 20px;">
        <button onclick="window.tests_mbi.generarPDF()" class="btn btn-primary">📄 Generar PDF</button>
        <button class="btn btn-primary" id="btn-mbi-guardar" onclick="window.tests_mbi.guardarEnExpediente()" style="background:#27ae60">⊡ Guardar en Expediente</button>
        <button onclick="window.tests_mbi.exportarJSON()" class="btn btn-secondary">💾 Exportar JSON</button>
      </div>
    `;

    container.innerHTML = html;
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
        "Mantener las prácticas actuales de autocuidado",
        "Realizar evaluaciones periódicas (anual)",
        "Continuar con actividades que favorezcan la realización personal"
      ];
    } else if (diagnostico === 'BURNOUT LEVE') {
      recomendaciones = [
        "Implementar técnicas de manejo del estrés",
        "Establecer límites saludables entre trabajo y vida personal",
        "Considerar actividades recreativas o de ocio",
        "Realizar reevaluación en 2-3 meses"
      ];
    } else if (diagnostico === 'BURNOUT MODERADO') {
      recomendaciones = [
        "Consulta con profesional de la salud mental",
        "Evaluar carga laboral y redistribución de tareas",
        "Implementar programa de intervención psicológica",
        "Considerar cambios organizacionales",
        "Seguimiento mensual recomendado"
      ];
    } else {
      recomendaciones = [
        "Intervención psicológica inmediata",
        "Evaluación médica completa",
        "Considerar licencia o reducción de jornada",
        "Revisión profunda de las condiciones laborales",
        "Posible derivación a especialista en psicopatología",
        "Seguimiento semanal o quincenal según severidad"
      ];
    }

    return recomendaciones.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('');
  },

  generarPDF() {
    if (!this.resultados) {
      alert('⚠️ Primero calcula los resultados');
      return;
    }
    alert('📄 PDF en desarrollo');
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
      (ae + d + rp) / 3, // Score promedio
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
