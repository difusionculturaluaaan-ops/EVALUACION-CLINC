/**
 * Controlador Principal de la Aplicación
 */

const app = {
  pacienteActivo: null,
  testEnEspera: null,
  testsDisponibles: {
    'SCL90R': tests_scl90r,
    'HAMILTON': tests_hamilton,
    'MMPI2': tests_mmpi2,
    'TDS': tests_tds,
    'ISRA': tests_isra,
    'PCLR': tests_pclr,
    'EGEP5': tests_egep5
  },

  // Mapeo de página a test
  pageTestMap: {
    'scl90r': 'SCL90R',
    'hamilton': 'HAMILTON',
    'mmpi2': 'MMPI2',
    'tds': 'TDS',
    'isra': 'ISRA',
    'pclr': 'PCLR',
    'egep5': 'EGEP5'
  },

  /**
   * Inicializar la aplicación
   */
  async init() {
    // Verificar autenticación
    if (!this.checkAuth()) {
      return; // Redirigir a login (se hace en checkAuth)
    }

    console.log('Inicializando Evaluación Clínica...');

    this.setupTheme();
    this.setupEventListeners();
    this.setupAuth();

    // Mostrar dashboard por defecto
    this.showPage('inicio');

    // Inicializar los módulos de tests (sin renderizar aún)
    console.log('✓ Aplicación inicializada correctamente');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  checkAuth() {
    const token = localStorage.getItem('auth_token');
    const tenantId = localStorage.getItem('tenant_id');

    if (!token || !tenantId) {
      // No autenticado, redirigir a login
      window.location.href = '/auth.html';
      return false;
    }

    return true;
  },

  /**
   * Configurar elementos de autenticación
   */
  setupAuth() {
    const usuario = localStorage.getItem('auth_usuario');
    if (!usuario) return;

    try {
      const usuarioData = JSON.parse(usuario);

      // Actualizar nombre en header
      const userNameEl = document.getElementById('user-name');
      if (userNameEl) {
        userNameEl.textContent = usuarioData.nombre;
      }

      // Agregar evento al botón de logout
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  },

  /**
   * Logout
   */
  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      api.logout();
    }
  },

  /**
   * Configurar tema claro/oscuro
   */
  setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const newTheme = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  },

  /**
   * Configurar event listeners globales
   */
  setupEventListeners() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    sidebarToggle?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });

    // Cerrar sidebar al hacer click en un nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        sidebar?.classList.remove('open');
      });
    });

    // Búsqueda de expedientes
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      this.buscarExpedientes(e.target.value);
    });

    // Filtros de status
    document.querySelectorAll('input[name="status-filter"]').forEach(input => {
      input.addEventListener('change', () => {
        this.loadExpedientes();
      });
    });
  },

  /**
   * Mostrar página específica
   */
  showPage(pageId) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Actualizar nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === pageId) {
        item.classList.add('active');
      }
    });

    // Mostrar página solicitada
    const page = document.getElementById(`page-${pageId}`);
    if (!page) {
      console.error(`Página page-${pageId} no encontrada`);
      return;
    }

    page.classList.add('active');

    // Cargar contenido específico
    if (pageId === 'inicio') {
      this.loadDashboard();
    } else if (this.pageTestMap[pageId]) {
      this.initTest(pageId);
    }
  },

  /**
   * Inicializar un test cuando se abre su página
   */
  initTest(pageId) {
    const testType = this.pageTestMap[pageId];
    const test = this.testsDisponibles[testType];

    if (!test) {
      console.error(`Test ${testType} no encontrado`);
      return;
    }

    if (!this.pacienteActivo) {
      this.mostrarToast('⚠️ Debe crear o seleccionar un paciente primero', 'warning');
      this.showPage('nuevo');
      return;
    }

    // Renderizar el test
    test.init();
  },

  /**
   * Crear o actualizar paciente
   */
  async crearPaciente() {
    const nombre = document.getElementById('f-nombre').value.trim();
    const edad = parseInt(document.getElementById('f-edad').value) || null;
    const sexo = document.getElementById('f-sexo').value;
    const civil = document.getElementById('f-civil').value;
    const meds = document.getElementById('f-meds').value;
    const obs = document.getElementById('f-obs').value;

    if (!nombre) {
      this.mostrarToast('El nombre es requerido', 'error');
      return;
    }

    try {
      let paciente;

      // Si hay paciente activo con ID, es actualización
      if (this.pacienteActivo && this.pacienteActivo.id) {
        paciente = await api.actualizarPaciente(this.pacienteActivo.id, {
          nombre,
          edad,
          sexo,
          estado_civil: civil,
          medicamentos: meds,
          observaciones: obs
        });
        this.mostrarToast(`✓ Paciente ${nombre} actualizado correctamente`, 'success');
      } else {
        // Si no hay ID, es creación
        paciente = await api.crearPaciente({
          nombre,
          edad,
          sexo,
          estado_civil: civil,
          medicamentos: meds,
          observaciones: obs
        });
        this.mostrarToast(`✓ Paciente ${nombre} registrado correctamente`, 'success');
      }

      this.pacienteActivo = paciente;
      localStorage.setItem('pacienteActivo', JSON.stringify(paciente));
      document.getElementById('form-paciente').reset();

      // Si hay un test en espera, ir a ese test
      if (this.testEnEspera) {
        const testPendiente = this.testEnEspera;
        this.testEnEspera = null;
        this.showPage(testPendiente);
      } else {
        this.showPage('expedientes');
        await this.loadExpedientes();
      }
    } catch (error) {
      this.mostrarToast(`Error al crear paciente: ${error.message}`, 'error');
    }
  },

  /**
   * Iniciar un test - crear/seleccionar paciente primero
   */
  iniciarTestConPaciente(pageId) {
    if (this.pacienteActivo) {
      // Si hay paciente activo, ir directamente al test
      this.showPage(pageId);
    } else {
      // Si no hay paciente, guardar el test y abrir formulario de nueva ficha
      this.testEnEspera = pageId;

      // Obtener nombre del test
      const testType = this.pageTestMap[pageId];
      const test = this.testsDisponibles[testType];
      const testNombre = test?.nombre || pageId;

      // Actualizar título y botón del formulario
      const formTitulo = document.getElementById('form-titulo');
      const btnContinuar = document.getElementById('btn-continuar');
      if (formTitulo) {
        formTitulo.textContent = `Registrar Paciente para ${testNombre}`;
      }
      if (btnContinuar) {
        btnContinuar.textContent = `Registrar y Comenzar ${testNombre}`;
      }

      this.showPage('nuevo');
      // Enfocar en el campo de nombre para mejor UX
      setTimeout(() => {
        document.getElementById('f-nombre')?.focus();
      }, 300);
    }
  },

  /**
   * Guardar prueba completada
   */
  async guardarPrueba(testType) {
    if (!this.pacienteActivo) {
      this.mostrarToast('Error: Paciente no seleccionado', 'error');
      return;
    }

    const test = this.testsDisponibles[testType];
    if (!test) {
      this.mostrarToast('Error: Test no encontrado', 'error');
      return;
    }

    // Validar que todos los ítems tengan respuesta
    const sinResponder = test.validar();
    if (sinResponder.length > 0) {
      this.mostrarToast(`⚠️ Complete los ítems: ${sinResponder.join(', ')}`, 'warning');
      return;
    }

    try {
      const data = test.obtenerRespuestas();
      const resultado = test.calcular();

      const pruebaGuardada = await api.guardarPrueba(
        this.pacienteActivo.id,
        testType,
        data,
        resultado.total,
        resultado
      );

      this.mostrarToast(`✓ ${test.nombre} guardado correctamente`, 'success');

      // Mostrar reporte detallado con datos del paciente
      this.pruebaActual = pruebaGuardada;
      await this.mostrarReporteDetallado(pruebaGuardada, this.pacienteActivo);

      await this.loadExpedientes();
    } catch (error) {
      console.error('Error en guardarPrueba:', error);
      this.mostrarToast(`Error al guardar: ${error.message}`, 'error');
    }
  },

  /**
   * Mostrar reporte de prueba
   */
  mostrarReporte(resultado, testType) {
    const modal = document.getElementById('modal-reporte');
    const contenido = document.getElementById('reporte-contenido');

    if (!modal || !contenido) return;

    const badge = resultado.label || `${resultado.total} PUNTOS`;
    const color = resultado.color || '#2c5aa0';

    let html = `
      <div class="reporte">
        <div class="reporte-header">
          <h2>${this.testsDisponibles[testType]?.nombre || testType}</h2>
          <p class="reporte-fecha">${new Date().toLocaleDateString('es-CO')}</p>
        </div>

        <div class="reporte-seccion">
          <div style="text-align: center; margin: 20px 0;">
            <div class="reporte-badge" style="border-color: ${color}; color: ${color};">
              ${badge}
            </div>
          </div>
        </div>
    `;

    if (resultado.texto) {
      html += `
        <div class="reporte-seccion">
          <p class="reporte-contenido">${resultado.texto}</p>
        </div>
      `;
    }

    if (resultado.interpretacion) {
      const interpretacionText = typeof resultado.interpretacion === 'object'
        ? (resultado.interpretacion.label || resultado.interpretacion.texto || '')
        : resultado.interpretacion;

      if (interpretacionText) {
        html += `
          <div class="reporte-seccion">
            <div class="reporte-titulo">Interpretación</div>
            <p class="reporte-contenido">${interpretacionText}</p>
          </div>
        `;
      }
    }

    html += '</div>';

    contenido.innerHTML = html;
    modal.classList.add('active');
  },

  /**
   * Mostrar reporte detallado de una prueba guardada (válido legalmente)
   */
  async mostrarReporteDetallado(prueba, paciente) {
    try {
      console.log('Mostrando reporte detallado:', { prueba, paciente });

      const modal = document.getElementById('modal-reporte');
      const contenido = document.getElementById('reporte-contenido');

      if (!modal || !contenido) {
        console.error('Modal o contenido no encontrado');
        return;
      }

    // Parsear datos si están en JSON
    const subescalas = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : prueba.subescalas;

    // Obtener normas de población general para este test
    let normasMap = {};
    try {
      const normas = await api.getNormasPoblacion(prueba.tipo);
      if (normas && Array.isArray(normas)) {
        normas.forEach(norma => {
          normasMap[norma.escala] = norma;
        });
      }
    } catch (error) {
      console.log('No hay normas disponibles para', prueba.tipo);
    }

    let html = `
      <div class="reporte" style="font-family: Arial, sans-serif; color: #333; line-height: 1.3;">
        <!-- ENCABEZADO PROFESIONAL -->
        <div style="border-bottom: 3px solid #2c5aa0; padding-bottom: 8px; margin-bottom: 10px;">
          <h1 style="color: #2c5aa0; margin: 0; font-size: 18px;">REPORTE DE EVALUACIÓN CLÍNICA PSICOLÓGICA</h1>
        </div>

        <!-- DATOS DEL PACIENTE -->
        <div style="background: #f9f9f9; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <h3 style="margin: 0 0 8px 0; color: #2c5aa0; font-size: 12px;">DATOS DEL PACIENTE</h3>
          <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
              <td style="width: 20%; padding: 3px;"><strong>Nombre:</strong></td>
              <td style="padding: 3px; width: 30%;">${paciente ? paciente.nombre : 'N/A'}</td>
              <td style="width: 20%; padding: 3px;"><strong>Edad:</strong></td>
              <td style="padding: 3px;">${paciente && paciente.edad ? paciente.edad + ' años' : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 3px;"><strong>Sexo:</strong></td>
              <td style="padding: 3px;">${paciente && paciente.sexo ? paciente.sexo : 'N/A'}</td>
              <td style="padding: 3px;"><strong>Estado Civil:</strong></td>
              <td style="padding: 3px;">${paciente && paciente.estado_civil ? paciente.estado_civil : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 3px;"><strong>Medicamentos:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 10px;">${paciente && paciente.medicamentos ? paciente.medicamentos : 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 3px;"><strong>Fecha:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 10px;">${new Date(prueba.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <!-- PRUEBA REALIZADA -->
        <div style="background: #f0f4f8; padding: 8px; margin-bottom: 10px; border-radius: 4px;">
          <h3 style="margin: 0 0 5px 0; color: #2c5aa0; font-size: 12px;">PRUEBA: ${prueba.tipo}</h3>
        </div>

        <!-- RESULTADOS -->
        <div style="margin-bottom: 10px;">
          <!-- GRÁFICA -->
          <div style="margin: 8px 0; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
            <h4 style="color: #333; font-size: 11px; margin: 0 0 8px 0;">ANÁLISIS: ${prueba.tipo}</h4>
            <div style="position: relative; width: 100%; height: 320px; overflow-x: auto;">
              <canvas id="chartReporte" style="width: 100%; height: 100%; min-width: 600px;"></canvas>
            </div>
          </div>

          <!-- TABLA DE DATOS -->
          <div style="margin-top: 8px;">
            <h4 style="color: #333; font-size: 11px; margin: 0 0 5px 0;">Detalles por Escala</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
              <tr style="background: #2c5aa0; color: white;">
                <th style="border: 1px solid #ddd; padding: 4px; text-align: left;">Escala</th>
                <th style="border: 1px solid #ddd; padding: 4px; text-align: center;">Valor</th>
                <th style="border: 1px solid #ddd; padding: 4px; text-align: center;">Media Normal</th>
                <th style="border: 1px solid #ddd; padding: 4px; text-align: center;">Interpretación</th>
              </tr>
              ${this.generarFilasTabla(prueba, subescalas)}
            </table>
          </div>
        </div>

        <!-- INTERPRETACIÓN -->
        ${subescalas && subescalas.interpretacion ? `
        <div style="background: #f9f9f9; padding: 8px; border-left: 3px solid #2c5aa0; margin-bottom: 8px; border-radius: 4px;">
          <h3 style="margin: 0 0 5px 0; color: #2c5aa0; font-size: 11px;">INTERPRETACIÓN</h3>
          <p style="margin: 0; font-size: 10px; line-height: 1.4;">
            ${typeof subescalas.interpretacion === 'object' ? (subescalas.interpretacion.label || subescalas.interpretacion.texto || '') : subescalas.interpretacion}
          </p>
        </div>
        ` : ''}

        <!-- FOOTER -->
        <div style="border-top: 1px solid #ddd; padding-top: 5px; margin-top: 8px; font-size: 9px; color: #999; text-align: center;">
          <p style="margin: 0;">Reporte de evaluación psicológica generado por Evaluación Clínica.</p>
          <p style="margin: 2px 0 0 0;">Generado: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}</p>
        </div>
      </div>
    `;

    contenido.innerHTML = html;
    modal.classList.add('active');

    // Renderizar gráfica después de que el DOM esté actualizado
    setTimeout(() => {
      this.renderChartReporte(prueba);
    }, 300);

    console.log('✓ Reporte detallado renderizado');
    } catch (error) {
      console.error('❌ Error en mostrarReporteDetallado:', error);
      this.mostrarToast(`Error al mostrar reporte: ${error.message}`, 'error');
    }
  },

  /**
   * Renderizar gráfica comparativa: Paciente vs Población Normal
   */
  async renderChartReporte(prueba) {
    const canvasElement = document.getElementById('chartReporte');
    if (!canvasElement || typeof Chart === 'undefined') return;

    if (canvasElement.chartInstance) {
      canvasElement.chartInstance.destroy();
      canvasElement.chartInstance = null;
    }

    try {
      const subescalas = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : prueba.subescalas || {};
      const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];

      let labels = [];
      let valoresPaciente = [];
      let valoresPoblacion = [];

      // Obtener normas del archivo local basadas en tipo de test
      const normasLocales = this.getNormasLocales(prueba.tipo);

      // Procesar según tipo de test
      if (prueba.tipo === 'SCL90R') {
        // SCL-90-R: mostrar 9 escalas
        const escalasOrdenadas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
        const escalasMap = {
          'SOM': 'Somatización', 'OBS': 'Obsesivo-Compulsivo', 'INT': 'Susceptibilidad Interpersonal',
          'DEP': 'Depresión', 'ANS': 'Ansiedad', 'HOS': 'Hostilidad', 'FOB': 'Ansiedad Fóbica',
          'PAR': 'Ideación Paranoide', 'PSI': 'Psicotisismo'
        };
        escalasOrdenadas.forEach(escala => {
          labels.push(escalasMap[escala]);
          valoresPaciente.push(Number(subescalas[escala]) || 0);
          const norma = normasLocales?.escalas?.find(e => e.id === escala);
          valoresPoblacion.push(norma?.media || 0.3);
        });
      } else if (prueba.tipo === 'MMPI2') {
        // MMPI-2: mostrar escalas clínicas
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            const norma = normasLocales?.escalas?.[idx];
            labels.push(norma?.nombre || `Escala ${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(norma?.media || 50);
          });
        }
      } else if (['PCLR', 'EGEP5'].includes(prueba.tipo)) {
        // PCL-R y EGEP-5: mostrar ítems con nombres descriptivos
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            const norma = normasLocales?.escalas?.[idx];
            labels.push(norma?.nombre || `Ítem ${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(norma?.media || (prueba.tipo === 'PCLR' ? 0.2 : 0.2));
          });
        }
      } else if (['HAMILTON', 'ISRA', 'TDS'].includes(prueba.tipo)) {
        // Hamilton, ISRA, TDS: mostrar ítems numerados
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`Ítem ${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(normasLocales?.media_por_item || 0.5);
          });
        }
      } else {
        // Fallback: mostrar ítems si hay datos
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`Ítem ${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(0.5);
          });
        }
      }

      if (labels.length === 0) {
        console.warn('No hay datos para graficar');
        return;
      }

      const maxValor = Math.max(...valoresPaciente, ...valoresPoblacion, 2);
      const ctx = canvasElement.getContext('2d');

      canvasElement.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Paciente',
              data: valoresPaciente,
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#e74c3c',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Población Normal',
              data: valoresPoblacion,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              tension: 0.4,
              fill: true,
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { size: 12 }, padding: 15, usePointStyle: true }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: { size: 11 },
              bodyFont: { size: 10 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: maxValor,
              ticks: { stepSize: Math.ceil(maxValor / 5), font: { size: 10 } },
              grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 0 }
            }
          }
        }
      });

      console.log('✓ Gráfica comparativa renderizada para', prueba.tipo);
    } catch (error) {
      console.error('Error al renderizar gráfica:', error);
    }
  },

  /**
   * Generar filas de tabla con datos de prueba (resumen solo)
   */
  generarFilasTabla(prueba, subescalas) {
    const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
    let filas = '';

    if (prueba.tipo === 'SCL90R') {
      // SCL-90-R: mostrar 3 índices principales
      const indices = [
        { label: 'Índice de Severidad Total', key: 'IST', valor: subescalas.IST || subescalas.total || 0 },
        { label: 'Total Síntomas Positivos', key: 'TSP', valor: subescalas.TSP || 0 },
        { label: 'Malestar Referido a Sint. Positivos', key: 'MRSP', valor: subescalas.MRSP || 0 }
      ];
      indices.forEach(idx => {
        filas += `<tr>
          <td style="border: 1px solid #ddd; padding: 4px;">${idx.label}</td>
          <td style="border: 1px solid #ddd; padding: 4px; text-align: center; font-weight: bold;">${Number(idx.valor).toFixed(2)}</td>
          <td style="border: 1px solid #ddd; padding: 4px; text-align: center; color: #666;">—</td>
          <td style="border: 1px solid #ddd; padding: 4px; text-align: left; font-size: 9px;">—</td>
        </tr>`;
      });
    } else if (['EGEP5', 'PCLR', 'HAMILTON', 'ISRA', 'TDS', 'MMPI2'].includes(prueba.tipo)) {
      // Todos: mostrar solo TOTAL
      const total = prueba.total || (Array.isArray(data) ? data.reduce((a, b) => a + (b || 0), 0) : 0);
      filas += `<tr>
        <td style="border: 1px solid #ddd; padding: 4px;">Total</td>
        <td style="border: 1px solid #ddd; padding: 4px; text-align: center; font-weight: bold;">${total}</td>
        <td style="border: 1px solid #ddd; padding: 4px; text-align: center; color: #666;">—</td>
        <td style="border: 1px solid #ddd; padding: 4px; text-align: left; font-size: 9px;">—</td>
      </tr>`;
    }

    return filas || '<tr><td colspan="4" style="border: 1px solid #ddd; padding: 4px; text-align: center; color: #999;">Sin datos disponibles</td></tr>';
  },

  /**
   * Obtener normas locales del test
   */
  getNormasLocales(tipoTest) {
    const normas = {
      'SCL90R': {
        escalas: [
          { id: 'SOM', nombre: 'Somatización', media: 0.36 },
          { id: 'OBS', nombre: 'Obsesivo-Compulsivo', media: 0.39 },
          { id: 'INT', nombre: 'Susceptibilidad Interpersonal', media: 0.29 },
          { id: 'DEP', nombre: 'Depresión', media: 0.36 },
          { id: 'ANS', nombre: 'Ansiedad', media: 0.30 },
          { id: 'HOS', nombre: 'Hostilidad', media: 0.30 },
          { id: 'FOB', nombre: 'Ansiedad Fóbica', media: 0.13 },
          { id: 'PAR', nombre: 'Ideación Paranoide', media: 0.34 },
          { id: 'PSI', nombre: 'Psicotisismo', media: 0.14 }
        ]
      },
      'MMPI2': {
        escalas: [
          { id: 'L', nombre: 'L (Mentira)', media: 50 },
          { id: 'F', nombre: 'F (Infrecuencia)', media: 50 },
          { id: 'K', nombre: 'K (Corrección)', media: 50 },
          { id: 'Hs', nombre: 'Hs (Hipocondría)', media: 50 },
          { id: 'D', nombre: 'D (Depresión)', media: 50 },
          { id: 'Hy', nombre: 'Hy (Histeria)', media: 50 },
          { id: 'Pd', nombre: 'Pd (Desviación Psicopática)', media: 50 },
          { id: 'Mf', nombre: 'Mf (Masculinidad/Feminidad)', media: 50 },
          { id: 'Pa', nombre: 'Pa (Paranoia)', media: 50 },
          { id: 'Pt', nombre: 'Pt (Psicastenia)', media: 50 },
          { id: 'Sc', nombre: 'Sc (Esquizofrenia)', media: 50 },
          { id: 'Ma', nombre: 'Ma (Hipomanía)', media: 50 },
          { id: 'Si', nombre: 'Si (Introversión Social)', media: 50 }
        ]
      },
      'PCLR': {
        media_por_item: 0.2,
        escalas: [
          { id: 1, nombre: 'Locuacidad/Encanto superficial', media: 0.2 },
          { id: 2, nombre: 'Grandiosidad', media: 0.2 },
          { id: 3, nombre: 'Necesidad de estimulación', media: 0.3 },
          { id: 4, nombre: 'Mentira patológica', media: 0.2 },
          { id: 5, nombre: 'Manipulación', media: 0.2 },
          { id: 6, nombre: 'Falta de remordimiento', media: 0.2 },
          { id: 7, nombre: 'Afecto superficial', media: 0.2 },
          { id: 8, nombre: 'Insensibilidad', media: 0.2 },
          { id: 9, nombre: 'Parasitismo', media: 0.2 },
          { id: 10, nombre: 'Control de conducta', media: 0.3 },
          { id: 11, nombre: 'Conducta sexual promiscua', media: 0.2 },
          { id: 12, nombre: 'Impulsividad', media: 0.3 },
          { id: 13, nombre: 'Falta de metas realistas', media: 0.3 },
          { id: 14, nombre: 'Impulsividad/Actuación', media: 0.3 },
          { id: 15, nombre: 'Irresponsabilidad', media: 0.3 },
          { id: 16, nombre: 'Negación de responsabilidad', media: 0.3 },
          { id: 17, nombre: 'Relaciones amorosas transitorias', media: 0.2 },
          { id: 18, nombre: 'Conducta delictiva juvenil', media: 0.1 },
          { id: 19, nombre: 'Revocación de libertad condicional', media: 0.1 },
          { id: 20, nombre: 'Conducta criminal versátil', media: 0.1 }
        ]
      },
      'EGEP5': {
        media_por_item: 0.2,
        escalas: [
          { id: 1, nombre: 'Recuerdos intrusivos', media: 0.2 },
          { id: 2, nombre: 'Pesadillas', media: 0.2 },
          { id: 3, nombre: 'Reacciones flashback', media: 0.2 },
          { id: 4, nombre: 'Malestar con recordatorios', media: 0.2 },
          { id: 5, nombre: 'Respuestas físicas', media: 0.2 },
          { id: 6, nombre: 'Evitar pensamientos', media: 0.2 },
          { id: 7, nombre: 'Evitar recordatorios', media: 0.2 },
          { id: 8, nombre: 'Amnesia del evento', media: 0.1 },
          { id: 9, nombre: 'Creencias negativas', media: 0.3 },
          { id: 10, nombre: 'Culpa/Responsabilidad', media: 0.3 },
          { id: 11, nombre: 'Culpa excesiva', media: 0.2 },
          { id: 12, nombre: 'Cambios cognitivos', media: 0.3 },
          { id: 13, nombre: 'Culpa de otros', media: 0.2 },
          { id: 14, nombre: 'Pérdida de interés', media: 0.2 },
          { id: 15, nombre: 'Sentimientos de desapego', media: 0.1 },
          { id: 16, nombre: 'Afecto positivo limitado', media: 0.2 },
          { id: 17, nombre: 'Hipervigilancia', media: 0.2 },
          { id: 18, nombre: 'Sobresalto exagerado', media: 0.2 },
          { id: 19, nombre: 'Conducta arriesgada', media: 0.1 },
          { id: 20, nombre: 'Concentración deficiente', media: 0.3 },
          { id: 21, nombre: 'Irritabilidad', media: 0.3 },
          { id: 22, nombre: 'Problemas del sueño', media: 0.4 }
        ]
      },
      'HAMILTON': { media_por_item: 1.5 },
      'ISRA': { media_por_item: 0.5 },
      'TDS': { media_por_item: 0.8 }
    };
    return normas[tipoTest] || {};
  },

  /**
   * Cerrar modal
   */
  cerrarModal() {
    document.getElementById('modal-reporte')?.classList.remove('active');
  },

  /**
   * Descargar reporte en diferentes formatos
   */
  async descargarReporte(formato) {
    try {
      const prueba = this.pruebaActual;
      if (!prueba) {
        this.mostrarToast('No hay prueba cargada', 'error');
        return;
      }

      switch(formato) {
        case 'png':
          this.descargarGrafiaPNG();
          break;
        case 'jpg':
          this.descargarGrafiaJPG();
          break;
        case 'excel':
          this.descargarExcel();
          break;
        case 'word':
          this.descargarWord();
          break;
        default:
          this.mostrarToast('Formato no soportado', 'error');
      }
    } catch (error) {
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Descargar gráfica como PNG
   */
  descargarGrafiaPNG() {
    const canvas = document.getElementById('chartReporte');
    if (!canvas) {
      this.mostrarToast('No hay gráfica para descargar', 'error');
      return;
    }
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `grafica-${this.pruebaActual.tipo}-${Date.now()}.png`;
    link.click();
    this.mostrarToast('✓ Gráfica descargada como PNG', 'success');
  },

  /**
   * Descargar gráfica como JPG
   */
  descargarGrafiaJPG() {
    const canvas = document.getElementById('chartReporte');
    if (!canvas) {
      this.mostrarToast('No hay gráfica para descargar', 'error');
      return;
    }
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.download = `grafica-${this.pruebaActual.tipo}-${Date.now()}.jpg`;
    link.click();
    this.mostrarToast('✓ Gráfica descargada como JPG', 'success');
  },

  /**
   * Descargar datos como Excel
   */
  async descargarExcel() {
    try {
      const prueba = this.pruebaActual;
      const paciente = this.pacienteActivo;
      const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];

      // Crear CSV (Excel compatible)
      let csv = 'REPORTE DE EVALUACIÓN CLÍNICA - ' + prueba.tipo + '\n';
      csv += 'Paciente,' + paciente.nombre + '\n';
      csv += 'Edad,' + paciente.edad + '\n';
      csv += 'Sexo,' + paciente.sexo + '\n';
      csv += 'Fecha,' + new Date(prueba.fecha).toLocaleDateString('es-CO') + '\n\n';

      csv += 'DATOS DE RESPUESTA POR ÍTEM\n';
      csv += 'Ítem,Valor\n';
      data.forEach((valor, idx) => {
        csv += `Ítem ${idx + 1},${valor}\n`;
      });

      csv += '\n\nRESUMEN\n';
      csv += 'Total,' + prueba.total + '\n';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evaluacion-${prueba.tipo}-${Date.now()}.csv`;
      link.click();
      this.mostrarToast('✓ Datos descargados como Excel', 'success');
    } catch (error) {
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Descargar como Word
   */
  async descargarWord() {
    try {
      const prueba = this.pruebaActual;
      const paciente = this.pacienteActivo;

      // Crear HTML para Word
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c5aa0; border-bottom: 3px solid #2c5aa0; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background: #2c5aa0; color: white; padding: 8px; text-align: left; }
            td { border: 1px solid #ddd; padding: 8px; }
            .header { background: #f0f4f8; padding: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>REPORTE DE EVALUACIÓN CLÍNICA PSICOLÓGICA</h1>

          <div class="header">
            <h3>DATOS DEL PACIENTE</h3>
            <p><strong>Nombre:</strong> ${paciente.nombre}</p>
            <p><strong>Edad:</strong> ${paciente.edad} años</p>
            <p><strong>Sexo:</strong> ${paciente.sexo}</p>
            <p><strong>Estado Civil:</strong> ${paciente.estado_civil || 'N/A'}</p>
            <p><strong>Medicamentos:</strong> ${paciente.medicamentos || 'No especificado'}</p>
            <p><strong>Fecha:</strong> ${new Date(prueba.fecha).toLocaleDateString('es-CO')}</p>
          </div>

          <div class="header">
            <h3>PRUEBA: ${prueba.tipo}</h3>
            <p><strong>Total:</strong> ${prueba.total}</p>
          </div>

          <h3>DATOS POR ÍTEM</h3>
          <table>
            <tr>
              <th>Ítem</th>
              <th>Valor</th>
            </tr>
      `;

      const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
      data.forEach((valor, idx) => {
        html += `<tr><td>Ítem ${idx + 1}</td><td>${valor}</td></tr>`;
      });

      html += `
          </table>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            Reporte generado por Evaluación Clínica - ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}
          </p>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'application/msword' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evaluacion-${prueba.tipo}-${Date.now()}.doc`;
      link.click();
      this.mostrarToast('✓ Reporte descargado como Word', 'success');
    } catch (error) {
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Descargar PDF
   */
  async descargarPDF() {
    try {
      console.log('Iniciando descarga de PDF...');

      const contenido = document.getElementById('reporte-contenido');
      if (!contenido || !contenido.innerHTML) {
        this.mostrarToast('No hay reporte para descargar', 'error');
        return;
      }

      // Obtener nombre del paciente del reporte
      let nombrePaciente = 'Reporte';
      const tablaTexto = contenido.innerText;
      const nombreMatch = tablaTexto.match(/Nombre:\s*([^\n]+)/);
      if (nombreMatch) {
        nombrePaciente = nombreMatch[1].trim();
      }

      console.log('Verificando html2pdf...');
      if (typeof window.html2pdf === 'undefined') {
        throw new Error('html2pdf no está cargado');
      }

      this.mostrarToast('Generando PDF...', 'info');

      // Clonar el contenido
      const elemento = contenido.cloneNode(true);
      console.log('Contenido clonado');

      // Intentar convertir canvas a imagen
      try {
        const canvasOriginal = document.querySelector('canvas#chartReporte');
        const canvasClonado = elemento.querySelector('canvas#chartReporte');

        if (canvasOriginal && canvasClonado) {
          const imagenDataUrl = canvasOriginal.toDataURL('image/png');
          console.log('Canvas convertido a imagen');

          const img = document.createElement('img');
          img.src = imagenDataUrl;
          img.style.width = '100%';
          img.style.height = '180px';

          canvasClonado.parentNode.replaceChild(img, canvasClonado);
          console.log('Canvas reemplazado por imagen');
        }
      } catch (canvasError) {
        console.warn('Advertencia: no se pudo procesar el canvas:', canvasError.message);
      }

      const filename = `Reporte_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      console.log('Generando PDF:', filename);

      const opt = {
        margin: [5, 8, 5, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const html2pdf = window.html2pdf;
      await html2pdf().set(opt).from(elemento).save();

      console.log('✓ PDF generado exitosamente');
      this.mostrarToast('✓ PDF descargado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Abrir modal de validación profesional
   */
  abrirValidacionProfesional() {
    const modal = document.getElementById('modal-validacion-profesional');
    if (modal) {
      // Cargar datos del profesional guardados si existen
      const profesional = localStorage.getItem('datos_profesional');
      if (profesional) {
        const datos = JSON.parse(profesional);
        document.getElementById('prof-nombre').value = datos.nombre || '';
        document.getElementById('prof-cedula').value = datos.cedula || '';
        document.getElementById('prof-especialidad').value = datos.especialidad || '';
        document.getElementById('prof-firma').value = datos.firma || '';
      }
      modal.classList.add('active');
    }
  },

  /**
   * Cerrar modal de validación
   */
  cerrarValidacionProfesional() {
    const modal = document.getElementById('modal-validacion-profesional');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  /**
   * Descargar PDF con validación profesional
   */
  async descargarPDFConValidacion() {
    const nombre = document.getElementById('prof-nombre').value.trim();
    const cedula = document.getElementById('prof-cedula').value.trim();
    const especialidad = document.getElementById('prof-especialidad').value.trim();
    const diagnostico = document.getElementById('prof-diagnostico').value.trim();
    const firma = document.getElementById('prof-firma').value.trim();

    if (!nombre || !cedula || !especialidad || !diagnostico) {
      this.mostrarToast('Complete todos los campos obligatorios', 'warning');
      return;
    }

    // Guardar datos del profesional para futuras descargas
    localStorage.setItem('datos_profesional', JSON.stringify({
      nombre,
      cedula,
      especialidad,
      firma
    }));

    // Guardar datos en el contexto de la prueba actual
    this.datosValidacionProfesional = {
      nombre,
      cedula,
      especialidad,
      diagnostico,
      firma,
      fecha: new Date().toLocaleDateString('es-CO')
    };

    this.mostrarToast('✓ Datos profesionales registrados. Generando PDF...', 'success');
    this.cerrarValidacionProfesional();

    // Generar PDF con los datos de validación
    setTimeout(() => this.descargarPDF(), 500);
  },

  /**
   * Cargar expedientes
   */
  /**
   * Cargar datos del dashboard
   */
  async loadDashboard() {
    try {
      const pacientes = await api.getPacientes();

      // Pacientes recientes (últimos 5)
      const recientes = pacientes.slice(0, 5);
      this.renderPacientesRecientes(recientes);

      // Estadísticas
      const activos = pacientes.filter(p => p.status === 'activo').length;
      const pendientes = pacientes.filter(p => !p.completado).length;
      const completados = pacientes.filter(p => p.completado).length;

      document.getElementById('stat-activos').textContent = activos;
      document.getElementById('stat-pendientes').textContent = pendientes;
      document.getElementById('stat-completados').textContent = completados;

      // Saludo personalizado
      const usuario = JSON.parse(localStorage.getItem('auth_usuario') || '{}');
      const nombre = usuario.nombre || 'Psicólogo/a';
      const subtitle = `${activos} pacientes activos · ${pendientes} evaluaciones pendientes esta semana`;
      document.getElementById('dashboard-subtitle').textContent = subtitle;

      // Si hay pacientes, mostrar gráfica del más reciente con SCL-90-R
      if (recientes.length > 0) {
        await this.mostrarGraficaDashboard(recientes[0]);
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      document.getElementById('dashboard-subtitle').textContent = 'Error al cargar los datos';
    }
  },

  /**
   * Renderizar pacientes recientes
   */
  async renderPacientesRecientes(pacientes) {
    const container = document.getElementById('pacientes-recientes');
    if (!container) return;

    if (pacientes.length === 0) {
      container.innerHTML = '<p class="empty-state">No hay pacientes registrados</p>';
      return;
    }

    container.innerHTML = pacientes.map(p => {
      const initials = p.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const colorBg = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][pacientes.indexOf(p) % 5];
      const statusBadge = p.status === 'activo' ? '🟢 Activo' : '⏸️ En pausa';

      return `
        <div class="paciente-item-wrapper">
          <div class="paciente-item" onclick="app.selectPacienteDesde('${p.id}')">
            <div class="paciente-avatar" style="background: linear-gradient(135deg, ${colorBg}, ${colorBg}dd);">
              ${initials}
            </div>
            <div class="paciente-info">
              <p class="paciente-nombre">${p.nombre}</p>
              <p class="paciente-status">${statusBadge}</p>
            </div>
            <button class="btn-expand" onclick="app.toggleDetallesPaciente('${p.id}'); event.stopPropagation();" title="Ver detalles">
              ▼
            </button>
          </div>
          <div class="paciente-detalles" id="detalles-${p.id}" style="display: none;">
            <div class="detalles-contenido">
              <div class="detalle-fila">
                <span class="detalle-label">Edad:</span>
                <span class="detalle-valor">${p.edad || '-'} años</span>
              </div>
              <div class="detalle-fila">
                <span class="detalle-label">Sexo:</span>
                <span class="detalle-valor">${p.sexo || '-'}</span>
              </div>
              <div class="detalle-fila">
                <span class="detalle-label">Estado:</span>
                <span class="detalle-valor">${p.status === 'activo' ? '🟢 Activo' : '⏸️ En pausa'}</span>
              </div>
              <div class="detalle-fila">
                <span class="detalle-label">Medicamentos:</span>
                <span class="detalle-valor">${p.medicamentos || 'No registrados'}</span>
              </div>
              <div class="detalle-fila">
                <span class="detalle-label">Observaciones:</span>
                <span class="detalle-valor">${p.observaciones || 'Sin observaciones'}</span>
              </div>
              <div class="detalle-divider"></div>
              <button class="btn btn-primary btn-sm" onclick="app.selectPacienteDesde('${p.id}')" style="width: 100%; margin-top: 8px;">
                📋 Ver expediente completo
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Alternar detalles del paciente
   */
  toggleDetallesPaciente(pacienteId) {
    const detalles = document.getElementById(`detalles-${pacienteId}`);
    if (detalles) {
      const isVisible = detalles.style.display !== 'none';
      detalles.style.display = isVisible ? 'none' : 'block';
    }
  },

  /**
   * Mostrar gráfica comparativa en dashboard
   */
  async mostrarGraficaDashboard(paciente) {
    try {
      const pruebas = await api.getPruebasDelPaciente(paciente.id);
      const pruebaSCL = pruebas.find(p => p.tipo === 'SCL90R');

      if (!pruebaSCL) {
        document.getElementById('dashboard-chart-section').style.display = 'none';
        return;
      }

      document.getElementById('dashboard-chart-section').style.display = 'block';
      document.getElementById('chart-title').textContent = `${paciente.nombre} · SCL-90-R`;
      document.getElementById('chart-subtitle').textContent = 'Comparativa contra norma poblacional';

      // Crear gráfica SVG simple
      const container = document.getElementById('dashboard-chart-container');
      const subescalas = typeof pruebaSCL.subescalas === 'string'
        ? JSON.parse(pruebaSCL.subescalas)
        : pruebaSCL.subescalas;

      const chartHTML = this.generarGraficaSCL(subescalas);
      container.innerHTML = chartHTML;
    } catch (error) {
      console.log('No hay datos SCL-90-R para mostrar:', error);
      document.getElementById('dashboard-chart-section').style.display = 'none';
    }
  },

  /**
   * Generar gráfica SVG de SCL-90-R
   */
  generarGraficaSCL(subescalas) {
    const escalas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
    const valores = escalas.map(e => subescalas[e] || 0);
    const maxAltura = 130;

    let svg = `
      <svg viewBox="0 0 600 200" style="width: 100%; height: auto; min-height: 250px;" role="img" aria-label="Gráfica SCL-90-R">
        <line x1="40" y1="20" x2="40" y2="150" stroke="#d3d1c7" stroke-width="0.5"/>
        <line x1="40" y1="150" x2="590" y2="150" stroke="#d3d1c7" stroke-width="0.5"/>

        <text x="35" y="153" font-size="9" fill="#888780" text-anchor="end">0</text>
        <text x="35" y="120" font-size="9" fill="#888780" text-anchor="end">0.5</text>
        <text x="35" y="88" font-size="9" fill="#888780" text-anchor="end">1.0</text>
        <text x="35" y="56" font-size="9" fill="#888780" text-anchor="end">1.5</text>
    `;

    valores.forEach((valor, i) => {
      const x = 55 + (i * 60);
      const altura = (valor / 1.5) * maxAltura;
      const y = 150 - altura;

      svg += `
        <g transform="translate(${x},0)">
          <rect x="0" y="${y}" width="18" height="${altura}" fill="#2c5aa0" rx="2" opacity="0.8"/>
          <text x="9" y="165" font-size="9" fill="#5f5e5a" text-anchor="middle">${escalas[i]}</text>
        </g>
      `;
    });

    svg += '</svg>';
    return svg;
  },

  /**
   * Seleccionar paciente y mostrar detalle
   */
  async selectPaciente(pacienteId) {
    try {
      const paciente = await api.getPaciente(pacienteId);
      if (paciente) {
        this.pacienteActivo = paciente;
        localStorage.setItem('pacienteActivo', JSON.stringify(paciente));
        await this.mostrarDetallePaciente(paciente);
      }
    } catch (error) {
      this.mostrarToast(`Error al cargar paciente: ${error.message}`, 'error');
    }
  },

  /**
   * Seleccionar paciente desde el dashboard
   */
  selectPacienteDesde(pacienteId) {
    this.selectPaciente(pacienteId);
  },

  /**
   * Mostrar detalle del expediente del paciente
   */
  async mostrarDetallePaciente(paciente) {
    try {
      // Llenar datos del paciente
      document.getElementById('detail-nombre').textContent = paciente.nombre;
      document.getElementById('detail-edad').textContent = paciente.edad || '-';
      document.getElementById('detail-sexo').textContent = paciente.sexo || '-';
      document.getElementById('detail-civil').textContent = paciente.estado_civil || '-';
      document.getElementById('detail-meds').textContent = paciente.medicamentos || 'No registrados';
      document.getElementById('detail-obs').textContent = paciente.observaciones || 'Sin observaciones';

      // Cargar pruebas del paciente
      const pruebas = await api.getPruebasDelPaciente(paciente.id);
      this.renderizarEstudios(pruebas);

      // Mostrar página de detalle
      this.showPage('detalle-expediente');
    } catch (error) {
      console.error('Error al mostrar detalle:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Abrir modal de edición de paciente
   */
  abrirEdicionPaciente() {
    if (!this.pacienteActivo) {
      this.mostrarToast('No hay paciente seleccionado', 'error');
      return;
    }

    // Llenar formulario con datos del paciente
    document.getElementById('edit-nombre').value = this.pacienteActivo.nombre || '';
    document.getElementById('edit-edad').value = this.pacienteActivo.edad || '';
    document.getElementById('edit-sexo').value = this.pacienteActivo.sexo || '';
    document.getElementById('edit-civil').value = this.pacienteActivo.estado_civil || '';
    document.getElementById('edit-meds').value = this.pacienteActivo.medicamentos || '';
    document.getElementById('edit-obs').value = this.pacienteActivo.observaciones || '';

    // Mostrar modal
    const modal = document.getElementById('modal-editar-paciente');
    if (modal) {
      modal.classList.add('active');
    }
  },

  /**
   * Cerrar modal de edición
   */
  cerrarModalEdicion() {
    const modal = document.getElementById('modal-editar-paciente');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  /**
   * Guardar cambios del paciente
   */
  async guardarEdicionPaciente() {
    const nombre = document.getElementById('edit-nombre').value.trim();
    const edad = parseInt(document.getElementById('edit-edad').value) || null;
    const sexo = document.getElementById('edit-sexo').value;
    const civil = document.getElementById('edit-civil').value;
    const meds = document.getElementById('edit-meds').value;
    const obs = document.getElementById('edit-obs').value;

    if (!nombre) {
      this.mostrarToast('El nombre es requerido', 'error');
      return;
    }

    try {
      const pacienteActualizado = await api.actualizarPaciente(this.pacienteActivo.id, {
        nombre,
        edad,
        sexo,
        estado_civil: civil,
        medicamentos: meds,
        observaciones: obs
      });

      this.pacienteActivo = pacienteActualizado;
      localStorage.setItem('pacienteActivo', JSON.stringify(pacienteActualizado));

      this.mostrarToast(`✓ Datos de ${nombre} actualizados correctamente`, 'success');
      this.cerrarModalEdicion();

      // Actualizar la vista
      await this.mostrarDetallePaciente(pacienteActualizado);
    } catch (error) {
      this.mostrarToast(`Error al actualizar: ${error.message}`, 'error');
    }
  },

  /**
   * Generar interpretación basada en el tipo de test y puntuación
   */
  generarInterpretacion(tipoTest, total) {
    try {
      // Mapeo de tipos de test a métodos de interpretación
      const mapeoInterpretacion = {
        'HAMILTON': 'hamD17',
        'SCL90R': 'scl90R',
        'MMPI2': 'mmpi2',
        'ISRA': 'isra',
        'TDS': 'tds',
        'PCLR': 'pclR',
        'EGEP5': 'egep5'
      };

      const metodo = mapeoInterpretacion[tipoTest];
      if (!metodo || !interpretacion[metodo]) {
        return null;
      }

      return interpretacion[metodo].calcular(total);
    } catch (error) {
      console.error('Error al generar interpretación:', error);
      return null;
    }
  },

  /**
   * Renderizar estudios realizados
   */
  renderizarEstudios(pruebas) {
    const container = document.getElementById('estudios-container');
    if (!container) return;

    if (!pruebas || pruebas.length === 0) {
      container.innerHTML = '<div class="empty-estudios">No hay estudios realizados aún</div>';
      return;
    }

    const iconos = {
      'SCL90R': '📊',
      'HAMILTON': '😔',
      'MMPI2': '🧠',
      'ISRA': '😰',
      'TDS': '😴',
      'PCLR': '⚠️',
      'EGEP5': '🚨'
    };

    const nombres = {
      'SCL90R': 'SCL-90-R',
      'HAMILTON': 'Hamilton (HAM-D)',
      'MMPI2': 'MMPI-2',
      'ISRA': 'ISRA (Ansiedad)',
      'TDS': 'TDS (Sueño)',
      'PCLR': 'PCL-R (Psicopatía)',
      'EGEP5': 'EGEP-5 (TEPT)'
    };

    container.innerHTML = pruebas.map(prueba => {
      // Obtener fecha - el campo es 'fecha' en la base de datos
      let fecha = 'Fecha pendiente';
      if (prueba.fecha) {
        const dateObj = new Date(prueba.fecha);
        if (!isNaN(dateObj.getTime())) {
          fecha = dateObj.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }

      const icono = iconos[prueba.tipo] || '📋';
      const nombre = nombres[prueba.tipo] || prueba.tipo;

      // Generar interpretación basada en la puntuación
      let interpretacionText = 'Revisión pendiente';
      if (prueba.total !== null && prueba.total !== undefined) {
        const result = this.generarInterpretacion(prueba.tipo, prueba.total);
        interpretacionText = result ? result.texto : 'Revisión pendiente';
      }

      return `
        <div class="estudio-card">
          <div class="estudio-header">
            <div>
              <h3 class="estudio-title">${nombre}</h3>
              <p class="estudio-fecha">${fecha}</p>
            </div>
            <span class="estudio-icon">${icono}</span>
          </div>

          <div class="estudio-resultado">
            <p class="estudio-puntuacion">${prueba.total || '–'}</p>
            <p class="estudio-label">Puntuación Total</p>
          </div>

          <div class="estudio-interpretacion">
            ${interpretacionText}
          </div>

          <div class="estudio-actions">
            <button class="btn-ver-reporte" onclick="app.mostrarReporteDetallado(${JSON.stringify(prueba).replace(/"/g, '&quot;')}, ${JSON.stringify(this.pacienteActivo).replace(/"/g, '&quot;')})">
              📋 Ver Reporte
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  async loadExpedientes() {
    try {
      const pacientes = await api.getPacientes();
      const status = document.querySelector('input[name="status-filter"]:checked')?.value || 'all';

      const filtrados = status === 'all'
        ? pacientes
        : pacientes.filter(p => p.status === status);

      await expedientes.renderizar(filtrados);
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Buscar expedientes
   */
  async buscarExpedientes(query) {
    if (!query.trim()) {
      this.loadExpedientes();
      return;
    }

    try {
      const pacientes = await api.getPacientes(query);
      await expedientes.renderizar(pacientes);
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  },

  /**
   * Mostrar notificación toast
   */
  mostrarToast(mensaje, tipo = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.className = `toast show ${tipo}`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  },

  /**
   * Seleccionar paciente
   */
};

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(error => {
    console.error('Error al inicializar:', error);
  });
});
