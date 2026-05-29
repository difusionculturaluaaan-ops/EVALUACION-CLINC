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
    'ISRA_C': tests_isra,
    'ISRA_F': tests_isra_f,
    'ISRA_M': tests_isra_m,
    'PCLR': tests_pclr,
    'EGEP5': tests_egep5,
    'SCID2': tests_scid2
  },

  // Mapeo de página a test
  pageTestMap: {
    'scl90r': 'SCL90R',
    'hamilton': 'HAMILTON',
    'mmpi2': 'MMPI2',
    'tds': 'TDS',
    'isra-c': 'ISRA_C',
    'isra-f': 'ISRA_F',
    'isra-m': 'ISRA_M',
    'pclr': 'PCLR',
    'egep5': 'EGEP5',
    'scid2': 'SCID2'
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

      // Cargar tests habilitados para este usuario
      this.cargarTestsHabilitados(usuarioData.id);

      // Cargar logo del tenant
      const tenantId = usuarioData.tenant_id;
      if (tenantId) {
        fetch(`/api/tenants/${tenantId}`)
          .then(r => r.json())
          .then(tenant => {
            if (tenant.logo_url) {
              const logoEl = document.getElementById('tenant-logo');
              if (logoEl) {
                logoEl.src = tenant.logo_url;
                logoEl.style.display = 'block';
                // Guardar logo en localStorage para PDF
                localStorage.setItem('tenant_logo_url', tenant.logo_url);
              }
            }
          })
          .catch(e => console.log('Logo no disponible'));
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
   * Cargar tests habilitados y filtrar sidebar
   */
  async cargarTestsHabilitados(usuarioId) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/usuario-tests/${usuarioId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        console.warn('No se pudieron cargar tests habilitados');
        return;
      }

      const tests = await response.json();
      const testHabilitados = new Set(
        tests.filter(t => t.habilitado).map(t => t.test_tipo)
      );

      // Guardar en localStorage para referencia
      localStorage.setItem('tests_habilitados', JSON.stringify(Array.from(testHabilitados)));

      // Mapeo: test_tipo → data-page
      const testPageMap = {
        'scl90r': 'scl90r',
        'hamilton': 'hamilton',
        'mmpi2': 'mmpi2',
        'tds': 'tds',
        'isra-c': 'isra-c',
        'isra-f': 'isra-f',
        'isra-m': 'isra-m',
        'pclr': 'pclr',
        'egep5': 'egep5',
        'scid2': 'scid2'
      };

      // Filtrar elementos del sidebar
      document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
        const page = btn.getAttribute('data-page');
        const testTipo = Object.keys(testPageMap).find(k => testPageMap[k] === page);

        if (testTipo && !testHabilitados.has(testTipo)) {
          // Ocultar y deshabilitar test no habilitado
          btn.style.display = 'none';
        }
      });
    } catch (error) {
      console.error('Error al cargar tests habilitados:', error);
      // Si hay error, mostrar todos los tests (fallback)
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
      // Reset del sistema - limpiar paciente activo y estado
      this.pacienteActivo = null;
      this.testEnEspera = null;
      this.pruebaActual = null;
      localStorage.removeItem('pacienteActivo');
      this.limpiarBotonPaciente();
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
      // Mostrar botón del paciente en la pantalla del test
      setTimeout(() => this.mostrarBotonPaciente(), 100);
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
   * Mostrar botón del paciente en sidebar
   */
  mostrarBotonPaciente() {
    if (!this.pacienteActivo) return;

    const container = document.getElementById('paciente-sidebar-container');
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    // Crear botón del paciente con estilo nav-item
    const btn = document.createElement('button');
    btn.className = 'nav-item paciente-nav-item';
    btn.type = 'button';
    btn.title = 'Paciente en evaluación: ' + this.pacienteActivo.nombre;
    btn.onclick = (e) => {
      e.preventDefault();
      this.volverAlExpediente();
    };
    btn.innerHTML = `
      <span class="icon">👤</span>
      <span class="label">${this.pacienteActivo.nombre}</span>
    `;

    container.appendChild(btn);

    // Agregar divisor
    const divider = document.createElement('div');
    divider.className = 'nav-divider';
    divider.textContent = 'Tests Disponibles';
    container.appendChild(divider);
  },

  /**
   * Limpiar botón del paciente del sidebar
   */
  limpiarBotonPaciente() {
    const container = document.getElementById('paciente-sidebar-container');
    if (container) {
      container.innerHTML = '';
    }
  },

  /**
   * Volver al expediente del paciente activo
   */
  async volverAlExpediente() {
    if (this.pacienteActivo) {
      await this.mostrarDetallePaciente(this.pacienteActivo);
    }
  },

  /**
   * Cambiar estado de una prueba (Borrador <-> Oficial)
   */
  async cambiarEstadoPrueba(pruebaId, nuevoEstado) {
    try {
      const token = api.getToken();
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/pruebas/${pruebaId}/estado`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar estado');
      }

      const mensaje = nuevoEstado === 'oficial' ?
        '✅ Prueba marcada como Oficial' :
        '📝 Prueba convertida a Borrador';
      this.mostrarToast(mensaje, 'success');

      // Recargar expediente
      if (this.pacienteActivo) {
        await this.mostrarDetallePaciente(this.pacienteActivo);
      }
    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Eliminar una prueba (solo borradores)
   */
  async eliminarPrueba(pruebaId) {
    if (!confirm('¿Deseas eliminar esta prueba? No se puede deshacer.')) return;

    try {
      const token = api.getToken();
      const headers = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/pruebas/${pruebaId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      this.mostrarToast('✓ Prueba eliminada', 'success');

      // Recargar expediente
      if (this.pacienteActivo) {
        await this.mostrarDetallePaciente(this.pacienteActivo);
      }
    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
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

    // Mostrar factores si existen (ej: TDS, SCL-90-R)
    if (resultado.factores) {
      html += `
        <div class="reporte-seccion">
          <div class="reporte-titulo">Análisis por Factores</div>
          <table class="reporte-tabla-factores">
            <thead>
              <tr>
                <th>Factor</th>
                <th>Puntaje</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
      `;

      for (const [key, factor] of Object.entries(resultado.factores)) {
        const estadoClass = factor.estado === 'Alerta Clínica' ? 'alerta' : 'normal';
        html += `
          <tr class="factor-row ${estadoClass}">
            <td>${factor.nombre}</td>
            <td>${factor.suma || 0}</td>
            <td style="color: ${factor.color}; font-weight: 600;">${factor.estado}</td>
          </tr>
        `;
      }

      html += `
            </tbody>
          </table>
        </div>
      `;
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
      <div class="reporte-carta" style="font-family: Arial, sans-serif; color: #333; line-height: 1.2; max-width: 21.59cm; margin: 0 auto; padding: 1.27cm;">
        <!-- ENCABEZADO PROFESIONAL -->
        <div style="border-bottom: 2px solid #2c5aa0; padding-bottom: 6px; margin-bottom: 8px;">
          <h1 style="color: #2c5aa0; margin: 0; font-size: 14px; font-weight: bold;">REPORTE DE EVALUACIÓN PSICOLÓGICA</h1>
        </div>

        <!-- DATOS DEL PACIENTE -->
        <div style="background: #f9f9f9; padding: 8px; margin-bottom: 10px; border-radius: 3px;">
          <h3 style="margin: 0 0 6px 0; color: #2c5aa0; font-size: 12px; font-weight: bold; text-decoration: underline;">DATOS DEL PACIENTE</h3>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse; line-height: 1.4;">
            <tr>
              <td style="width: 18%; padding: 3px; color: #000; font-weight: bold;"><strong>Nombre:</strong></td>
              <td style="padding: 3px; width: 32%; color: #000;">${paciente ? paciente.nombre : 'N/A'}</td>
              <td style="width: 15%; padding: 3px; color: #000; font-weight: bold;"><strong>Edad:</strong></td>
              <td style="padding: 3px; color: #000;">${paciente && paciente.edad ? paciente.edad : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; color: #000; font-weight: bold;"><strong>Sexo:</strong></td>
              <td style="padding: 3px; color: #000;">${paciente && paciente.sexo ? paciente.sexo : 'N/A'}</td>
              <td style="padding: 3px; color: #000; font-weight: bold;"><strong>E. Civil:</strong></td>
              <td style="padding: 3px; color: #000;">${paciente && paciente.estado_civil ? paciente.estado_civil : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; color: #000; font-weight: bold;"><strong>Medicamentos:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 13px; color: #000;">${paciente && paciente.medicamentos ? paciente.medicamentos : 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; color: #000; font-weight: bold;"><strong>Fecha:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 13px; color: #000;">${new Date(prueba.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <!-- PRUEBA REALIZADA -->
        <div style="background: #f0f4f8; padding: 6px; margin-bottom: 10px; border-radius: 3px;">
          <h3 style="margin: 0; color: #2c5aa0; font-size: 10px; font-weight: bold;">PRUEBA: ${prueba.tipo}</h3>
        </div>

        <!-- RESULTADOS -->
        <div style="margin-bottom: 10px; font-size: 9px;">
          ${prueba.tipo === 'SCL90R' ? this.generarReporteSCL(prueba, subescalas) : prueba.tipo === 'PCLR' ? this.generarReportePCLR(prueba, subescalas) : this.generarReporteGenerico(prueba, subescalas)}
        </div>

        <!-- INTERPRETACIÓN -->
        ${subescalas && subescalas.interpretacion ? `
        <div style="background: #f9f9f9; padding: 8px; border-left: 3px solid #2c5aa0; margin-bottom: 10px; border-radius: 3px;">
          <h3 style="margin: 0 0 4px 0; color: #2c5aa0; font-size: 9px; font-weight: bold;">INTERPRETACIÓN</h3>
          <p style="margin: 0; font-size: 8px; line-height: 1.4;">
            ${typeof subescalas.interpretacion === 'object' ? (subescalas.interpretacion.label || subescalas.interpretacion.texto || '') : subescalas.interpretacion}
          </p>
        </div>
        ` : ''}

        ${this.generarValidacionProfesional()}

        <!-- FOOTER -->
        <div style="border-top: 1px solid #ddd; padding-top: 6px; margin-top: 10px; font-size: 7px; color: #999; text-align: center;">
          <p style="margin: 0;">Evaluación Clínica Psicológica | Generado: ${new Date().toLocaleDateString('es-CO')}</p>
        </div>
      </div>
    `;

    // Agregar segunda página con detalle de ítems
    html += this.generarDetalleItems(prueba, this.testsDisponibles[this.pageTestMap[prueba.tipo.toLowerCase()]]);

    contenido.innerHTML = html;
    modal.classList.add('active');

    // Renderizar gráfica después de que el DOM esté actualizado
    setTimeout(() => {
      this.renderChartReporte(prueba);
      this.renderGraficoPerfil(prueba, subescalas);
      if (prueba.tipo === 'PCLR') {
        this.renderChartComparativoPCLR(prueba);
      }
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
        // SCL-90-R: mostrar 9 escalas con nombres
        const escalasOrdenadas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
        const escalasMap = {
          'SOM': 'Somatización', 'OBS': 'Obsesivo-Compulsivo', 'INT': 'Susceptibilidad',
          'DEP': 'Depresión', 'ANS': 'Ansiedad', 'HOS': 'Hostilidad', 'FOB': 'Ansiedad Fóbica',
          'PAR': 'Ideación Paranoide', 'PSI': 'Psicotisismo'
        };
        escalasOrdenadas.forEach((escala, idx) => {
          labels.push(escalasMap[escala]);
          valoresPaciente.push(Number(subescalas[escala]) || 0);
          const norma = normasLocales?.escalas?.find(e => e.id === escala);
          valoresPoblacion.push(norma?.media || 0.3);
        });
      } else if (prueba.tipo === 'MMPI2') {
        // MMPI-2: mostrar solo números (13 escalas)
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            const norma = normasLocales?.escalas?.[idx];
            valoresPoblacion.push(norma?.media || 50);
          });
        }
      } else if (['PCLR', 'EGEP5'].includes(prueba.tipo)) {
        // PCL-R y EGEP-5: mostrar solo números
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(normasLocales?.escalas?.[idx]?.media || (prueba.tipo === 'PCLR' ? 0.2 : 0.2));
          });
        }
      } else if (['HAMILTON', 'ISRA', 'TDS'].includes(prueba.tipo)) {
        // Hamilton, ISRA, TDS: mostrar solo números
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(normasLocales?.media_por_item || 0.5);
          });
        }
      } else {
        // Fallback: mostrar números
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((valor, idx) => {
            labels.push(`${idx + 1}`);
            valoresPaciente.push(Number(valor) || 0);
            valoresPoblacion.push(0.5);
          });
        }
      }

      if (labels.length === 0) {
        console.warn('No hay datos para graficar');
        return;
      }

      const maxValor = Math.max(...valoresPaciente, ...valoresPoblacion, 2) + 0.5;
      const ctx = canvasElement.getContext('2d');

      canvasElement.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Paciente',
              data: valoresPaciente,
              backgroundColor: '#e74c3c',
              borderColor: '#c0392b',
              borderWidth: 2,
              barPercentage: 0.8
            },
            {
              label: 'Población Normal',
              data: valoresPoblacion,
              backgroundColor: '#27ae60',
              borderColor: '#229954',
              borderWidth: 2,
              barPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: false },
          onHover: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { size: 13 }, padding: 15, usePointStyle: true }
            },
            tooltip: {
              enabled: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: maxValor,
              ticks: { stepSize: Math.ceil(maxValor / 5), font: { size: 11 } },
              grid: { color: 'rgba(0, 0, 0, 0.08)' }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 0 }
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
   * Renderizar gráfico de perfil: Paciente vs Población Normal
   */
  renderGraficoPerfil(prueba, subescalas) {
    try {
      // Encontrar canvas de gráfico de perfil
      const canvas = document.querySelector('[id^="chartPerfil"]');
      if (!canvas || typeof Chart === 'undefined') return;

      const testType = {
        'SCL90R': 'SCL90R',
        'MMPI2': 'MMPI2',
        'HAMILTON': 'HAMILTON',
        'ISRA_C': 'ISRA',
        'ISRA_F': 'ISRA',
        'ISRA_M': 'ISRA'
      }[prueba.tipo];

      if (!testType || !profileCharts || !profileCharts.configs[testType]) {
        console.log(`Gráfico de perfil no configurado para: ${prueba.tipo}`);
        return;
      }

      // Preparar datos según tipo de test
      let datos = {};
      if (testType === 'SCL90R') {
        // SCL-90-R: usar subescalas
        const escalas = ['SOM', 'OC', 'SI', 'DEP', 'ANX', 'HOS', 'PHOB', 'PAR', 'PSY'];
        escalas.forEach(escala => {
          datos[escala] = subescalas[escala] || { media: 0 };
        });
      } else if (testType === 'MMPI2') {
        // MMPI-2: usar escalas clínicas T-scores
        datos.escalasClinicas = subescalas.escalasClinicas || [];
      } else if (testType === 'HAMILTON') {
        // Hamilton: usar items
        datos = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
      } else if (testType === 'ISRA') {
        // ISRA: usar sistemas C, F, M
        datos = {
          C: subescalas.totalC || 0,
          F: subescalas.totalF || 0,
          M: subescalas.totalM || 0
        };
      }

      // Renderizar gráfico de perfil
      if (profileCharts && canvas) {
        profileCharts.crearGraficoPerfil(canvas.id, testType, datos);
      }

    } catch (error) {
      console.error('Error al renderizar gráfico de perfil:', error);
    }
  },

  /**
   * Renderizar gráfica comparativa PCL-R: Paciente vs Población General
   */
  async renderChartComparativoPCLR(prueba) {
    const canvasElement = document.getElementById('chartComparativoPCLR');
    if (!canvasElement || typeof Chart === 'undefined') return;

    if (canvasElement.chartInstance) {
      canvasElement.chartInstance.destroy();
      canvasElement.chartInstance = null;
    }

    try {
      const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
      const normas = interpretacion.pclr.obtenerNormasPoblacion();

      const labels = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
      const valoresPaciente = Array.isArray(data) ? data.slice(0, 20) : [];
      const valoresPoblacion = labels.map((_, i) => normas.items[i + 1] || 0.3);

      const ctx = canvasElement.getContext('2d');
      canvasElement.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Paciente',
              data: valoresPaciente,
              backgroundColor: 'rgba(220, 38, 38, 0.7)',
              borderColor: '#dc2626',
              borderWidth: 1
            },
            {
              label: 'Población General',
              data: valoresPoblacion,
              backgroundColor: 'rgba(39, 103, 73, 0.7)',
              borderColor: '#276749',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'x',
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { size: 10 }, padding: 10 }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 8,
              titleFont: { size: 10 },
              bodyFont: { size: 9 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 3.5,
              ticks: { font: { size: 8 } },
              grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
              ticks: { font: { size: 8 } }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error al renderizar gráfica comparativa PCL-R:', error);
    }
  },

  /**
   * Generar reporte específico para SCL-90-R (formato PDF)
   */
  generarReporteSCL(prueba, subescalas) {
    const escalasMap = {
      'SOM': 'Somatización', 'OBS': 'Obsesivo – Compulsivo', 'INT': 'Susceptibilidad Interpersonal',
      'DEP': 'Depresión', 'ANS': 'Ansiedad', 'HOS': 'Hostilidad', 'FOB': 'Ansiedad Fóbica',
      'PAR': 'Ideación Paranoide', 'PSI': 'Psicotisismo'
    };

    let html = `
      <div style="margin: 4px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #00bcd4; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 8px; font-weight: bold;">Escalas</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Paciente</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Media Norm.</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">D. Est.</th>
          </tr>`;

    const escalasOrdenadas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
    const normas = {
      'SOM': { media: 0.36, ds: 0.42 }, 'OBS': { media: 0.39, ds: 0.45 },
      'INT': { media: 0.29, ds: 0.39 }, 'DEP': { media: 0.36, ds: 0.44 },
      'ANS': { media: 0.30, ds: 0.37 }, 'HOS': { media: 0.30, ds: 0.40 },
      'FOB': { media: 0.13, ds: 0.31 }, 'PAR': { media: 0.34, ds: 0.44 },
      'PSI': { media: 0.14, ds: 0.25 }
    };

    escalasOrdenadas.forEach((escala, idx) => {
      const valor = Number(subescalas[escala]) || 0;
      const norma = normas[escala];
      const bgColor = '#ffffff';
      html += `<tr style="background: ${bgColor};">
        <td style="border: 1px solid #ddd; padding: 3px; font-weight: bold; font-size: 8px;">${escalasMap[escala]}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${valor.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${norma.media.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${norma.ds.toFixed(2)}</td>
      </tr>`;
    });

    html += `</table>
      </div>

      <div style="margin: 4px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #666; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 8px; font-weight: bold;">Índices</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Paciente</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Ref.</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>IST</strong></td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${(subescalas.IST || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">0.31</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>TSP</strong></td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${prueba.total || 0}</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">19.29</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>MRSP</strong></td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${(subescalas.MRSP || 0).toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">1.32</td>
          </tr>
        </table>
      </div>

      <div style="margin: 4px 0; padding: 4px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 3px; color: #333;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 3px 0; font-weight: bold;">Perfil de Subescalas (Paciente vs Población Normal)</h4>
        <div style="position: relative; width: 100%; height: 250px;">
          <canvas id="chartPerfil-${Date.now()}" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>
    `;

    return html;
  },

  /**
   * Generar reporte genérico para otros tests
   */
  generarReporteGenerico(prueba, subescalas) {
    return `
      <div style="margin: 4px 0; padding: 3px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">ANÁLISIS: ${prueba.tipo}</h4>
        <div style="position: relative; width: 100%; height: 400px; margin-bottom: 0;">
          <canvas id="chartReporte" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>
      </div>

      <div style="margin: 4px 0; padding: 3px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 3px; color: #333;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 11px; margin: 0 0 3px 0; font-weight: bold;">Perfil (Paciente vs Población Normal)</h4>
        <div style="position: relative; width: 100%; height: 380px; margin-bottom: 0;">
          <canvas id="chartPerfilComparativo" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>
      </div>

      <div style="margin-top: 4px; margin-bottom: 30px; page-break-inside: avoid;">
        <table style="width: 100%; border-collapse: collapse;" class="reporte-tabla-resultados">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 8px; font-weight: bold;">Métrica</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Valor</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Ref.</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Estado</th>
          </tr>
          ${this.generarFilasTabla(prueba, subescalas)}
        </table>
      </div>
    `;
  },

  /**
   * Generar reporte PCL-R con gráfica comparativa vs población general
   */
  generarReportePCLR(prueba, subescalas) {
    const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
    const normas = interpretacion.pclr.obtenerNormasPoblacion();
    const totalPaciente = prueba.total || (Array.isArray(data) ? data.reduce((a, b) => a + (b || 0), 0) : 0);

    let html = `
      <div style="margin: 4px 0; padding: 4px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 3px 0; font-weight: bold;">ANÁLISIS COMPARATIVO: PCL-R vs Población General</h4>
        <div style="position: relative; width: 100%; height: 200px; margin-bottom: 8px;">
          <canvas id="chartComparativoPCLR" style="width: 100%; height: 100%;"></canvas>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 2px; text-align: left;">Métrica</th>
            <th style="border: 1px solid #999; padding: 2px; text-align: center;">Paciente</th>
            <th style="border: 1px solid #999; padding: 2px; text-align: center;">Población</th>
            <th style="border: 1px solid #999; padding: 2px; text-align: center;">Diferencia</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 2px; font-weight: bold;">Puntaje Total</td>
            <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${totalPaciente.toFixed(1)}/60</td>
            <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${normas.totalMedio.toFixed(1)}/60</td>
            <td style="border: 1px solid #ddd; padding: 2px; text-align: center; ${totalPaciente > normas.totalMedio ? 'color: #dc2626; font-weight: bold;' : 'color: #276749;'}">${(totalPaciente - normas.totalMedio).toFixed(1)}</td>
          </tr>
        </table>
      </div>
    `;

    return html;
  },

  /**
   * Generar filas de tabla con datos de prueba (resumen solo)
   */
  generarFilasTabla(prueba, subescalas) {
    const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];
    const normasLocales = this.getNormasLocales(prueba.tipo);
    let filas = '';

    if (prueba.tipo === 'SCL90R') {
      const indices = [
        { label: 'IST', valor: subescalas.IST || subescalas.total || 0, ref: 0.31 },
        { label: 'TSP', valor: subescalas.TSP || 0, ref: 19.29 },
        { label: 'MRSP', valor: subescalas.MRSP || 0, ref: 1.32 }
      ];
      indices.forEach(idx => {
        const estado = this.compararConReferencia(idx.valor, idx.ref);
        filas += `<tr>
          <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">${idx.label}</td>
          <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${Number(idx.valor).toFixed(2)}</td>
          <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${Number(idx.ref).toFixed(2)}</td>
          <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 7px; ${estado.color}">${estado.texto}</td>
        </tr>`;
      });
    } else if (['PCLR', 'EGEP5'].includes(prueba.tipo)) {
      const total = prueba.total || (Array.isArray(data) ? data.reduce((a, b) => a + (b || 0), 0) : 0);
      const mediaRef = data.length * (prueba.tipo === 'PCLR' ? 0.2 : 0.2);
      const estado = this.compararConReferencia(total, mediaRef);
      filas += `<tr>
        <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">Total</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${total}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${Number(mediaRef).toFixed(1)}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 7px; ${estado.color}">${estado.texto}</td>
      </tr>`;
    } else if (['HAMILTON', 'ISRA', 'TDS'].includes(prueba.tipo)) {
      const total = prueba.total || (Array.isArray(data) ? data.reduce((a, b) => a + (b || 0), 0) : 0);
      const mediaRef = data.length * (normasLocales?.media_por_item || 0.5);
      const estado = this.compararConReferencia(total, mediaRef);
      filas += `<tr>
        <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">Total</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${total}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${Number(mediaRef).toFixed(1)}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 7px; ${estado.color}">${estado.texto}</td>
      </tr>`;
    } else if (prueba.tipo === 'MMPI2') {
      const total = prueba.total || (Array.isArray(data) ? data.reduce((a, b) => a + (b || 0), 0) : 0);
      const refTotal = data.length * 50;
      const estado = this.compararConReferencia(total, refTotal);
      filas += `<tr>
        <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">Total</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${total}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${Number(refTotal).toFixed(0)}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 7px; ${estado.color}">${estado.texto}</td>
      </tr>`;
    }

    return filas || '<tr><td colspan="4" style="border: 1px solid #ddd; padding: 3px; text-align: center; color: #999; font-size: 8px;">Sin datos</td></tr>';
  },

  /**
   * Generar sección de validación profesional
   */
  generarValidacionProfesional() {
    // Primero intentar obtener de this.datosValidacionProfesional (datos actuales del modal)
    let datosValidacion = this.datosValidacionProfesional;

    // Si no está disponible, intentar obtener de localStorage
    if (!datosValidacion) {
      const datosGuardados = localStorage.getItem('datos_profesional') || localStorage.getItem('validacion_profesional');
      if (!datosGuardados) return '';
      datosValidacion = JSON.parse(datosGuardados);
    }

    try {
      const { nombre, cedula, especialidad, diagnostico } = datosValidacion;

      return `
        <!-- VALIDACIÓN PROFESIONAL -->
        <div id="validacion-profesional-section" style="background: #f0f4f8; padding: 8px; margin-bottom: 10px; border: 1px solid #2c5aa0; border-radius: 3px;">
          <h3 style="margin: 0 0 6px 0; color: #2c5aa0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #2c5aa0; padding-bottom: 4px; text-decoration: underline;">VALIDACIÓN PROFESIONAL</h3>

          <table style="width: 100%; font-size: 13px; border-collapse: collapse; line-height: 1.4;">
            <tr>
              <td style="width: 30%; padding: 3px; color: #000; font-weight: bold;"><strong>Profesional:</strong></td>
              <td style="padding: 3px; color: #000;">${nombre || '—'}</td>
              <td style="width: 20%; padding: 3px; color: #000; font-weight: bold;"><strong>Cédula:</strong></td>
              <td style="padding: 3px; color: #000;">${cedula || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; color: #000; font-weight: bold;"><strong>Especialidad:</strong></td>
              <td colspan="3" style="padding: 3px; color: #000;">${especialidad || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; vertical-align: top; color: #000; font-weight: bold;"><strong>Diagnóstico:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 13px; color: #000;">${diagnostico || '—'}</td>
            </tr>
          </table>

          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #ddd; text-align: center;">
            <p style="margin: 0; font-size: 9px; color: #666;">Validado profesionalmente</p>
            <p style="margin: 2px 0 0 0; font-size: 8px; color: #999;">El profesional se responsabiliza profesionalmente del contenido de este reporte</p>
          </div>
        </div>
      `;
    } catch (error) {
      return '';
    }
  },

  /**
   * Comparar valor del paciente con la referencia (media normal)
   */
  compararConReferencia(valor, referencia) {
    const diferencia = valor - referencia;
    const porcentajeDif = Math.abs(diferencia / referencia) * 100;

    let texto = '';
    let color = '';

    if (porcentajeDif < 10) {
      // Dentro del rango normal (±10%)
      texto = 'Normal';
      color = 'color: #2ecc71;'; // Verde
    } else if (diferencia > 0) {
      // Por encima de la referencia
      if (porcentajeDif < 30) {
        texto = 'Ligeramente Elevado';
        color = 'color: #f39c12;'; // Naranja
      } else {
        texto = 'Elevado';
        color = 'color: #e74c3c;'; // Rojo
      }
    } else {
      // Por debajo de la referencia
      if (porcentajeDif < 30) {
        texto = 'Ligeramente Bajo';
        color = 'color: #3498db;'; // Azul
      } else {
        texto = 'Bajo';
        color = 'color: #2980b9;'; // Azul oscuro
      }
    }

    return { texto, color };
  },

  /**
   * Generar segunda página con detalle de todos los ítems
   */
  generarDetalleItems(prueba, testObj) {
    if (!testObj) return '';

    // Obtener items según la estructura del test
    let items = [];
    let data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];

    if (testObj.factores && typeof testObj.factores === 'object') {
      // Para TDS y otros tests con estructura de factores
      for (const [factorKey, factor] of Object.entries(testObj.factores)) {
        if (factor.items && Array.isArray(factor.items)) {
          items.push(...factor.items);
        }
      }
    } else if (testObj.items && Array.isArray(testObj.items)) {
      items = testObj.items;
    } else if (testObj.escalas && Array.isArray(testObj.escalas)) {
      // Para MMPI2 que usa 'escalas' en lugar de 'items'
      items = testObj.escalas;
      // Para MMPI2, los datos están en objeto keyed por ID
      if (typeof data === 'object' && !Array.isArray(data)) {
        const escalasObj = testObj.escalas;
        data = escalasObj.map(escala => data[escala.id] || 0);
      }
    }

    if (!items || items.length === 0) {
      return '';
    }

    let html = `
      <div style="page-break-before: always; font-family: Arial, sans-serif; color: #333; line-height: 1.2; max-width: 21.59cm; margin: 0 auto; padding: 1.27cm;">
        <!-- ENCABEZADO SEGUNDA PÁGINA -->
        <div style="border-bottom: 2px solid #2c5aa0; padding-bottom: 6px; margin-bottom: 8px;">
          <h2 style="color: #2c5aa0; margin: 0; font-size: 12px; font-weight: bold;">DETALLE DE ÍTEMS - ${prueba.tipo}</h2>
        </div>

        <!-- TABLA DE ÍTEMS -->
        <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold; width: 5%;">N°</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 8px; font-weight: bold;">Ítem</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold; width: 12%;">Puntuación</th>
          </tr>`;

    // Generar filas según el tipo de test
    items.forEach((item, idx) => {
      let itemText = '';

      // Extraer el texto del ítem según su formato
      if (typeof item === 'string') {
        itemText = item;
      } else if (item.q) {
        itemText = item.q; // Hamilton
      } else if (item.texto) {
        itemText = item.texto; // PCL-R
      } else if (item.nombre) {
        itemText = item.nombre; // MMPI2 escalas
      } else {
        itemText = `Ítem ${idx + 1}`;
      }

      const puntuacion = data[idx] !== undefined ? data[idx] : '—';
      const bgColor = idx % 2 === 0 ? '#f9f9f9' : 'white';

      html += `<tr style="background: ${bgColor};">
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${idx + 1}</td>
        <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">${itemText}</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${puntuacion}</td>
      </tr>`;
    });

    html += `</table>

        <!-- FOOTER -->
        <div style="border-top: 1px solid #ddd; padding-top: 6px; margin-top: 10px; font-size: 7px; color: #999; text-align: center;">
          <p style="margin: 0;">Evaluación Clínica Psicológica | Detalle de ítems</p>
        </div>
      </div>
    `;

    return html;
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
   * Descargar reporte con validación profesional
   */
  async descargarConValidacion(formato) {
    try {
      // Validar que los datos obligatorios estén completos
      const nombre = document.getElementById('prof-nombre')?.value;
      const cedula = document.getElementById('prof-cedula')?.value;
      const especialidad = document.getElementById('prof-especialidad')?.value;
      const diagnostico = document.getElementById('prof-diagnostico')?.value;

      if (!nombre || !cedula || !especialidad || !diagnostico) {
        this.mostrarToast('Complete todos los campos obligatorios', 'error');
        return;
      }

      const prueba = this.pruebaActual;
      if (!prueba) {
        this.mostrarToast('No hay prueba cargada', 'error');
        return;
      }

      // Guardar datos de validación
      const datosValidacion = { nombre, cedula, especialidad, diagnostico };
      localStorage.setItem('validacion_profesional', JSON.stringify(datosValidacion));

      switch(formato) {
        case 'png':
          this.descargarGrafiaPNG();
          break;
        case 'jpg':
          this.descargarGrafiaJPG();
          break;
        case 'excel':
          this.descargarExcelConValidacion(datosValidacion);
          return; // Excel cierra el modal por sí solo
        case 'word':
          this.descargarWordConValidacion(datosValidacion);
          return; // Word cierra el modal por sí solo
        default:
          this.mostrarToast('Formato no soportado', 'error');
          return;
      }

      // Cerrar modal después de descargar (para PNG y JPG)
      setTimeout(() => {
        this.cerrarValidacionProfesional();
      }, 500);
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
   * Descargar datos como Excel (sin validación)
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
   * Descargar Excel con validación profesional
   */
  async descargarExcelConValidacion(datosValidacion) {
    try {
      const prueba = this.pruebaActual;
      const paciente = this.pacienteActivo;
      const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || [];

      let csv = 'REPORTE DE EVALUACIÓN CLÍNICA - ' + prueba.tipo + '\n\n';
      csv += 'DATOS DEL PACIENTE\n';
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
      csv += 'Total,' + prueba.total + '\n\n';

      csv += 'VALIDACIÓN PROFESIONAL\n';
      csv += 'Profesional,' + datosValidacion.nombre + '\n';
      csv += 'Cédula,' + datosValidacion.cedula + '\n';
      csv += 'Especialidad,' + datosValidacion.especialidad + '\n';
      csv += 'Diagnóstico/Conclusiones,' + datosValidacion.diagnostico + '\n';
      csv += 'Fecha de Validación,' + new Date().toLocaleDateString('es-CO') + '\n';

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evaluacion-${prueba.tipo}-validada-${Date.now()}.csv`;
      link.click();
      this.mostrarToast('✓ Excel descargado con validación', 'success');
    } catch (error) {
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Descargar como Word (sin validación)
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
   * Descargar Word con validación profesional
   */
  async descargarWordConValidacion(datosValidacion) {
    try {
      const prueba = this.pruebaActual;
      const paciente = this.pacienteActivo;

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c5aa0; border-bottom: 3px solid #2c5aa0; padding-bottom: 10px; }
            h3 { color: #2c5aa0; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background: #2c5aa0; color: white; padding: 8px; text-align: left; }
            td { border: 1px solid #ddd; padding: 8px; }
            .header { background: #f0f4f8; padding: 10px; margin: 10px 0; }
            .validation { background: #e8f5e9; padding: 12px; margin-top: 20px; border-left: 4px solid #4caf50; }
            .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
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

          <div class="validation">
            <h3 style="margin-top: 0;">✓ VALIDACIÓN PROFESIONAL</h3>
            <p><strong>Profesional:</strong> ${datosValidacion.nombre}</p>
            <p><strong>Cédula/Licencia:</strong> ${datosValidacion.cedula}</p>
            <p><strong>Especialidad:</strong> ${datosValidacion.especialidad}</p>
            <p><strong>Diagnóstico/Conclusiones:</strong></p>
            <p style="margin: 10px 0; padding: 10px; background: white; border-left: 2px solid #2c5aa0;">${datosValidacion.diagnostico}</p>
            <p><strong>Fecha de Validación:</strong> ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}</p>
          </div>

          <div class="footer">
            <p>Reporte profesional validado por Evaluación Clínica - Certificado por profesional autorizado</p>
            <p>Este reporte es un documento oficial de evaluación clínica psicológica.</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'application/msword' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evaluacion-${prueba.tipo}-validada-${Date.now()}.doc`;
      link.click();
      this.mostrarToast('✓ Word validado descargado', 'success');
      this.cerrarValidacionProfesional();
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

      // Verificar si hay datos de validación profesional
      const datosGuardados = localStorage.getItem('datos_profesional');
      if (!datosGuardados && !this.datosValidacionProfesional) {
        // Abrir modal para que llene los datos del profesional
        this.abrirValidacionProfesional();
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

      // Actualizar la sección de validación profesional si hay datos disponibles
      if (this.datosValidacionProfesional) {
        const validacionDiv = elemento.querySelector('#validacion-profesional-section');
        if (validacionDiv) {
          const validacionHTML = this.generarValidacionProfesional();
          if (validacionHTML) {
            validacionDiv.outerHTML = validacionHTML;
            console.log('✓ Sección de validación actualizada');
          }
        }
      }

      // Intentar convertir canvas a imagen de alta resolución
      try {
        // Convertir chart principal
        const canvasOriginal = document.querySelector('canvas#chartReporte');
        const canvasClonado = elemento.querySelector('canvas#chartReporte');

        if (canvasOriginal && canvasClonado) {
          const imagenDataUrl = await this.capturarCanvasAltaResolucion(canvasOriginal);
          console.log('✓ Canvas principal convertido a alta resolución');

          const img = document.createElement('img');
          img.src = imagenDataUrl;
          img.style.width = '100%';
          img.style.height = '300px';

          canvasClonado.parentNode.replaceChild(img, canvasClonado);
          console.log('✓ Canvas principal reemplazado por imagen');
        }

        // Convertir chart comparativo (PCL-R)
        const canvasComparativoOriginal = document.querySelector('canvas#chartComparativoPCLR');
        const canvasComparativoClonado = elemento.querySelector('canvas#chartComparativoPCLR');

        if (canvasComparativoOriginal && canvasComparativoClonado) {
          const imagenComparativaUrl = await this.capturarCanvasAltaResolucion(canvasComparativoOriginal);
          console.log('✓ Canvas comparativo PCL-R convertido a alta resolución');

          const imgComparativa = document.createElement('img');
          imgComparativa.src = imagenComparativaUrl;
          imgComparativa.style.width = '100%';
          imgComparativa.style.height = '320px';

          canvasComparativoClonado.parentNode.replaceChild(imgComparativa, canvasComparativoClonado);
          console.log('✓ Canvas comparativo reemplazado por imagen');
        }

        // Convertir gráfico de perfil (Paciente vs Población Normal)
        const canvasPerfilOriginal = document.getElementById('chartPerfilComparativo');
        const canvasPerfilClonado = elemento.getElementById('chartPerfilComparativo');

        if (canvasPerfilOriginal && canvasPerfilClonado) {
          const imagenPerfilUrl = await this.capturarCanvasAltaResolucion(canvasPerfilOriginal);
          console.log('✓ Canvas de perfil convertido a alta resolución');

          const imgPerfil = document.createElement('img');
          imgPerfil.src = imagenPerfilUrl;
          imgPerfil.style.width = '100%';
          imgPerfil.style.height = '300px';

          canvasPerfilClonado.parentNode.replaceChild(imgPerfil, canvasPerfilClonado);
          console.log('✓ Canvas de perfil reemplazado por imagen');
        } else {
          console.warn('Canvas de perfil no encontrado - original:', !!canvasPerfilOriginal, 'clonado:', !!canvasPerfilClonado);
        }
      } catch (canvasError) {
        console.warn('Advertencia: no se pudo procesar los canvas:', canvasError.message);
      }

      const filename = `Reporte_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      console.log('Generando PDF:', filename);

      const opt = {
        margin: [5, 8, 5, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.99 },
        html2canvas: { scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', logging: false },
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
   * Capturar canvas - simplemente convierte a imagen
   */
  async capturarCanvasAltaResolucion(canvas) {
    return new Promise((resolve) => {
      resolve(canvas.toDataURL('image/png'));
    });
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
    // Cerrar también el modal de reporte de atrás
    const modalReporte = document.getElementById('modal-reporte');
    if (modalReporte) {
      modalReporte.classList.remove('active');
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
      const estado = prueba.estado || 'borrador';
      const estadoLabel = estado === 'oficial' ? '✅ Oficial' : '📝 Borrador';
      const estadoColor = estado === 'oficial' ? '#276749' : '#d97706';

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
              <span class="estudio-estado" style="color: ${estadoColor}; font-weight: 600; font-size: 12px;">${estadoLabel}</span>
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
            ${estado === 'borrador' ? `
              <button class="btn-estado btn-oficial" onclick="app.cambiarEstadoPrueba(${prueba.id}, 'oficial')">
                ✓ Marcar Oficial
              </button>
              <button class="btn-eliminar" onclick="app.eliminarPrueba(${prueba.id})">
                🗑️ Eliminar
              </button>
            ` : `
              <button class="btn-estado btn-borrador" onclick="app.cambiarEstadoPrueba(${prueba.id}, 'borrador')">
                ↩️ Convertir a Borrador
              </button>
            `}
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
