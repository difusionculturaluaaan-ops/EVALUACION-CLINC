/**
 * Controlador Principal de la Aplicación
 */

const app = {
  pacienteActivo: null,
  testEnEspera: null,
  testsDisponibles: {
    'SCL90R': tests_scl90r,
    'HAMILTON': tests_hamilton,
    'MMPI': {
      nombre: 'MMPI-2 (RF + T-scores)',
      tipo: 'MMPI',
      init() { app.iniciarMMPI('RF'); },
      obtenerRespuestas() {
        // Retornar respuestas del RF si estamos en esa sección
        if (app.mmpiState.seccionActual === 'RF') {
          return tests_mmpi2rf.obtenerRespuestas();
        } else {
          return tests_mmpi2.obtenerRespuestas();
        }
      },
      validar() {
        // Validar la sección actual
        if (app.mmpiState.seccionActual === 'RF') {
          const invalid = tests_mmpi2rf.validar();
          if (invalid.length > 0) {
            return [`Completa todos los 338 ítems (faltan ${invalid.length})`];
          }
        } else {
          const invalid = tests_mmpi2.validar();
          if (invalid.length > 0) return invalid;
        }
        return [];
      },
      calcular() {
        // Calcular ambas secciones
        const resultRF = app.mmpiState.seccionActual === 'RF' ? tests_mmpi2rf.calcular() : { datos: app.mmpiState.datosRF || {} };
        const resultScores = app.mmpiState.seccionActual === 'SCORES' ? tests_mmpi2.calcular() : { datos: app.mmpiState.datosScores || {} };

        // Guardar en memoria
        app.mmpiState.datosRF = resultRF.datos || app.mmpiState.datosRF;
        app.mmpiState.datosScores = resultScores.datos || app.mmpiState.datosScores;

        return {
          total: (resultRF.total || 0) + (resultScores.total || 0),
          datos: { ...app.mmpiState.datosRF, ...app.mmpiState.datosScores },
          rf: resultRF,
          scores: resultScores
        };
      }
    },
    'MMPI2': tests_mmpi2,
    'MMPI2RF': tests_mmpi2rf,
    'TDS': tests_tds,
    'ISRA': {
      nombre: 'ISRA (Cognitivo + Fisiológico + Motor)',
      tipo: 'ISRA',
      items: [], // Placeholder
      init() { app.iniciarISRA('C'); },
      obtenerRespuestas() {
        // PRIMERO: guardar la sección actual antes de retornar
        const actual = app.israState.seccionActual;
        const respuestasActual = app.obtenerRespuestasISRA(
          actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
          `isra-${actual.toLowerCase()}`
        );
        app.israState[`datos${actual}`] = respuestasActual;

        // Retornar todas las secciones (desde memoria + DOM actual)
        const C = app.israState.datosC || app.obtenerRespuestasISRA(tests_isra.items, 'isra-c');
        const F = app.israState.datosF || app.obtenerRespuestasISRA(tests_isra_f.items, 'isra-f');
        const M = app.israState.datosM || app.obtenerRespuestasISRA(tests_isra_m.items, 'isra-m');

        // Guardar las secciones en memoria para acceso posterior
        app.israState._respuestas = { C, F, M };

        // Retornar array combinado: C + F + M (lo que el servidor espera)
        return [...(C || []), ...(F || []), ...(M || [])];
      },
      validar() {
        // Validar usando las respuestas separadas guardadas
        const respuestas = app.israState._respuestas;
        if (!respuestas) {
          // Si no están guardadas, obtenerlas ahora
          const actual = app.israState.seccionActual;
          const respuestasActual = app.obtenerRespuestasISRA(
            actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
            `isra-${actual.toLowerCase()}`
          );
          app.israState[`datos${actual}`] = respuestasActual;

          const C = app.israState.datosC || app.obtenerRespuestasISRA(tests_isra.items, 'isra-c');
          const F = app.israState.datosF || app.obtenerRespuestasISRA(tests_isra_f.items, 'isra-f');
          const M = app.israState.datosM || app.obtenerRespuestasISRA(tests_isra_m.items, 'isra-m');
          app.israState._respuestas = { C, F, M };
        }

        const errores = [];
        const C_respondidos = respuestas.C ? respuestas.C.filter(r => r !== null && r !== undefined).length : 0;
        const F_respondidos = respuestas.F ? respuestas.F.filter(r => r !== null && r !== undefined).length : 0;
        const M_respondidos = respuestas.M ? respuestas.M.filter(r => r !== null && r !== undefined).length : 0;

        if (C_respondidos < tests_isra.items.length) errores.push('Sección C incompleta');
        if (F_respondidos < tests_isra_f.items.length) errores.push('Sección F incompleta');
        if (M_respondidos < tests_isra_m.items.length) errores.push('Sección M incompleta');
        return errores;
      },
      calcular() {
        // Primero obtener respuestas para guardar las secciones
        this.obtenerRespuestas();

        // Usar las respuestas separadas guardadas
        const respuestas = app.israState._respuestas;
        const totalC = respuestas.C ? respuestas.C.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const totalF = respuestas.F ? respuestas.F.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const totalM = respuestas.M ? respuestas.M.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const total = totalC + totalF + totalM;
        return {
          total,
          datos: [totalC, totalF, totalM],
          subescalas: {
            C: { total: totalC, items: respuestas.C },
            F: { total: totalF, items: respuestas.F },
            M: { total: totalM, items: respuestas.M }
          }
        };
      }
    },
    'ISRA_C': tests_isra,
    'ISRA_F': tests_isra_f,
    'ISRA_M': tests_isra_m,
    'PCLR': tests_pclr,
    'EGEP5': tests_egep5,
    'SCID2': tests_scid2,
    'CUIDA': {
      nombre: 'CUIDA (Evaluación de Cuidadores)',
      tipo: 'CUIDA',
      init() { app.iniciarCUIDA(); },
      obtenerRespuestas() { return tests_cuida.obtenerRespuestas(); },
      validar() {
        const sinResponder = tests_cuida.validar();
        if (sinResponder.length > 0) return [`Completa todos los 189 ítems (faltan ${sinResponder.length})`];
        return [];
      },
      calcular() { return tests_cuida.calcular(); }
    }
  },

  // Mapeo de página a test
  pageTestMap: {
    'scl90r': 'SCL90R',
    'hamilton': 'HAMILTON',
    'mmpi': 'MMPI',
    'mmpi2': 'MMPI2',
    'mmpi2rf': 'MMPI2RF',
    'tds': 'TDS',
    'isra': 'ISRA',
    'pclr': 'PCLR',
    'egep5': 'EGEP5',
    'scid2': 'SCID2',
    'cuida': 'CUIDA'
  },

  // Estado actual del ISRA
  israState: {
    seccionActual: 'C', // C, F, M
    datosC: null,
    datosF: null,
    datosM: null
  },

  // Estado actual del MMPI (RF + Scores)
  mmpiState: {
    seccionActual: 'RF', // RF, SCORES
    datosRF: null,
    datosScores: null,
    paginaActual: 0, // Página actual en RF (0-14)
    itemsPorPagina: 24, // Items por página
    totalItems: 338 // Total de items RF
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

    // Cerrar modales al hacer click fuera (en el fondo oscuro)
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
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
    } else if (pageId === 'expedientes') {
      // Cargar expedientes al abrir la página
      this.loadExpedientes();
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
      this.mostrarToast('❌ Primero debes crear o seleccionar un paciente', 'error');
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
  /**
   * Abrir MMPI-2 PRO con paciente seleccionado
   */
  abrirMMPI2Pro() {
    // Si hay paciente activo, pasar su ID; si no, abrir sin ID (registrará en micrositio)
    if (this.pacienteActivo) {
      window.location.href = `/mmpi-pro.html?paciente_id=${this.pacienteActivo.id}`;
    } else {
      window.location.href = `/mmpi-pro.html`;
    }
  },

  iniciarTestConPaciente(pageId) {
    if (!this.pacienteActivo) {
      // Mostrar mensaje y opción de crear paciente
      this.mostrarToast('❌ Primero debes crear o seleccionar un paciente', 'error');
      return;
    }

    // Ir directamente al test
    this.showPage(pageId);
    // Mostrar botón del paciente en la pantalla del test
    setTimeout(() => this.mostrarBotonPaciente(), 100);
  },

  /**
   * Iniciar ISRA en una sección específica (C, F, M)
   */
  iniciarISRA(seccion) {
    this.israState.seccionActual = seccion;
    this.mostrarSeccionISRA(seccion);
  },

  /**
   * Mostrar una sección de ISRA
   */
  mostrarSeccionISRA(seccion) {
    // GUARDAR respuestas de la sección anterior ANTES de cambiar
    const seccionAnterior = this.israState.seccionActual;
    if (seccionAnterior && seccionAnterior !== seccion) {
      const respuestasAnterior = app.obtenerRespuestasISRA(
        seccionAnterior === 'C' ? tests_isra.items : (seccionAnterior === 'F' ? tests_isra_f.items : tests_isra_m.items),
        `isra-${seccionAnterior.toLowerCase()}`
      );
      this.israState[`datos${seccionAnterior}`] = respuestasAnterior;
      const respondidos = respuestasAnterior.filter(r => r !== null).length;
      console.log(`💾 Guardadas respuestas ${seccionAnterior}: ${respondidos} items`);
    }

    // Actualizar sección actual
    this.israState.seccionActual = seccion;

    // Ocultar todas las secciones
    const sC = document.getElementById('isra-section-c');
    const sF = document.getElementById('isra-section-f');
    const sM = document.getElementById('isra-section-m');
    if (sC) sC.style.display = 'none';
    if (sF) sF.style.display = 'none';
    if (sM) sM.style.display = 'none';

    // Mostrar la sección actual
    const sectionEl = document.getElementById(`isra-section-${seccion.toLowerCase()}`);
    if (sectionEl) sectionEl.style.display = 'block';

    // Actualizar tabs
    const tabC = document.getElementById('tab-isra-c');
    const tabF = document.getElementById('tab-isra-f');
    const tabM = document.getElementById('tab-isra-m');
    if (tabC) {
      tabC.style.color = seccion === 'C' ? '#2c5aa0' : '#999';
      tabC.style.borderBottomColor = seccion === 'C' ? '#2c5aa0' : 'transparent';
    }
    if (tabF) {
      tabF.style.color = seccion === 'F' ? '#2c5aa0' : '#999';
      tabF.style.borderBottomColor = seccion === 'F' ? '#2c5aa0' : 'transparent';
    }
    if (tabM) {
      tabM.style.color = seccion === 'M' ? '#2c5aa0' : '#999';
      tabM.style.borderBottomColor = seccion === 'M' ? '#2c5aa0' : 'transparent';
    }

    // Actualizar botones de navegación
    const btnPrev = document.getElementById('isra-prev-btn');
    const btnNext = document.getElementById('isra-next-btn');
    const btnFinish = document.getElementById('isra-finish-btn');

    if (seccion === 'C') {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'block';
      btnFinish.style.display = 'none';
    } else if (seccion === 'F') {
      btnPrev.style.display = 'block';
      btnNext.style.display = 'block';
      btnFinish.style.display = 'none';
    } else if (seccion === 'M') {
      btnPrev.style.display = 'block';
      btnNext.style.display = 'none';
      btnFinish.style.display = 'block';
    }

    // Renderizar items de la sección
    const tests = {
      'C': tests_isra,
      'F': tests_isra_f,
      'M': tests_isra_m
    };
    const testObj = tests[seccion];
    const prefix = `isra-${seccion.toLowerCase()}`;

    if (testObj && testObj.items) {
      testRenderer.renderLikert04(`isra-container`, testObj.items, prefix);

      // RESTAURAR respuestas guardadas de esta sección
      setTimeout(() => {
        const respuestasGuardadas = this.israState[`datos${seccion}`];
        if (respuestasGuardadas && Array.isArray(respuestasGuardadas)) {
          respuestasGuardadas.forEach((valor, idx) => {
            if (valor !== null && valor !== undefined) {
              const input = document.querySelector(`input[name="${prefix}_r${idx}"][value="${valor}"]`);
              if (input) {
                input.checked = true;
              }
            }
          });
          console.log(`✓ Restauradas ${respuestasGuardadas.filter(r => r !== null).length} respuestas de Sección ${seccion}`);
        }
      }, 100);
    }
  },

  /**
   * Verificar si una sección de ISRA está completa
   */
  validarSeccionISRA(seccion) {
    const itemsTotal = seccion === 'C' ? tests_isra.items.length : (seccion === 'F' ? tests_isra_f.items.length : tests_isra_m.items.length);
    const respuestas = app.obtenerRespuestasISRA(
      seccion === 'C' ? tests_isra.items : (seccion === 'F' ? tests_isra_f.items : tests_isra_m.items),
      `isra-${seccion.toLowerCase()}`
    );
    const respondidos = respuestas.filter(r => r !== null && r !== undefined).length;
    return respondidos === itemsTotal;
  },

  /**
   * Cambiar a una sección de ISRA desde las tabs
   */
  cambiarSeccionISRA(seccion) {
    // Verificar si la sección actual está completa antes de cambiar
    const actual = this.israState.seccionActual;
    if (actual && actual !== seccion) {
      if (!this.validarSeccionISRA(actual)) {
        const itemsTotal = actual === 'C' ? tests_isra.items.length : (actual === 'F' ? tests_isra_f.items.length : tests_isra_m.items.length);
        this.mostrarToast(`⚠️ Completa todos los items de la Sección ${actual} (${itemsTotal} items)`, 'warning');
        return;
      }

      // Guardar la sección actual después de validar
      const respuestasActual = app.obtenerRespuestasISRA(
        actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
        `isra-${actual.toLowerCase()}`
      );
      this.israState[`datos${actual}`] = respuestasActual;
      console.log(`✓ Guardadas respuestas ${actual}:`, respuestasActual.filter(r => r !== null).length, 'items');
    }
    this.mostrarSeccionISRA(seccion);
  },

  /**
   * Ir a la siguiente sección de ISRA
   */
  irSeccionISRASiguiente() {
    const actual = this.israState.seccionActual;

    // Validar que la sección actual esté completa
    if (!this.validarSeccionISRA(actual)) {
      const itemsTotal = actual === 'C' ? tests_isra.items.length : (actual === 'F' ? tests_isra_f.items.length : tests_isra_m.items.length);
      const respondidos = app.obtenerRespuestasISRA(
        actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
        `isra-${actual.toLowerCase()}`
      ).filter(r => r !== null && r !== undefined).length;
      this.mostrarToast(`⚠️ Faltan ${itemsTotal - respondidos} items por responder en Sección ${actual}`, 'warning');
      return;
    }

    // Guardar respuestas de la sección actual
    const respuestasActual = app.obtenerRespuestasISRA(
      actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
      `isra-${actual.toLowerCase()}`
    );
    this.israState[`datos${actual}`] = respuestasActual;

    if (actual === 'C') {
      this.mostrarSeccionISRA('F');
    } else if (actual === 'F') {
      this.mostrarSeccionISRA('M');
    }
  },

  /**
   * Ir a la sección anterior de ISRA
   */
  irSeccionISRAAnterior() {
    const actual = this.israState.seccionActual;

    // Guardar respuestas de la sección actual (no validar al retroceder)
    const respuestasActual = app.obtenerRespuestasISRA(
      actual === 'C' ? tests_isra.items : (actual === 'F' ? tests_isra_f.items : tests_isra_m.items),
      `isra-${actual.toLowerCase()}`
    );
    this.israState[`datos${actual}`] = respuestasActual;

    if (actual === 'M') {
      this.mostrarSeccionISRA('F');
    } else if (actual === 'F') {
      this.mostrarSeccionISRA('C');
    }
  },

  /**
   * Obtener respuestas de ISRA para una sección
   */
  obtenerRespuestasISRA(items, prefix) {
    if (!items || items.length === 0) return [];
    const data = [];
    for (let i = 0; i < items.length; i++) {
      const sel = document.querySelector(`input[name="${prefix}_r${i}"]:checked`);
      data.push(sel ? parseInt(sel.value) : null);
    }
    return data;
  },

  /**
   * Iniciar MMPI (RF o Scores)
   */
  iniciarMMPI(seccion) {
    this.mmpiState.seccionActual = seccion;
    if (seccion === 'RF') {
      // Limpiar localStorage viejo del MMPI
      for (let i = 1; i <= 338; i++) {
        localStorage.removeItem(`mmpi_r${i}`);
      }
      // Resetear contador de página
      this.mmpiState.paginaActual = 0;
      // Construir paginación
      this.construirPaginasMMPI();
      this.mmpiActualizarProgreso();
      tests_mmpi2rf.init();
    } else {
      tests_mmpi2.init();
    }
    this.mostrarSeccionMMPI(seccion);
  },

  /**
   * Cambiar entre secciones de MMPI
   */
  cambiarSeccionMMPI(seccion) {
    // Guardar respuestas de la sección actual
    if (this.mmpiState.seccionActual === 'RF') {
      this.mmpiState.datosRF = tests_mmpi2rf.obtenerRespuestas();
    } else if (this.mmpiState.seccionActual === 'SCORES') {
      this.mmpiState.datosScores = tests_mmpi2.obtenerRespuestas();
    }

    // Validar que la sección actual esté completa (solo para avanzar)
    if (this.mmpiState.seccionActual === 'RF' && seccion === 'SCORES') {
      // Validar desde localStorage (más confiable)
      let respondidos = 0;
      for (let i = 1; i <= this.mmpiState.totalItems; i++) {
        const resp = localStorage.getItem(`mmpi_r${i}`);
        if (resp && (resp === 'V' || resp === 'F')) {
          respondidos++;
        }
      }

      if (respondidos < this.mmpiState.totalItems) {
        this.mostrarToast(`⚠️ Faltan ${this.mmpiState.totalItems - respondidos} ítems por responder`, 'warning');
        return;
      }

      // Calcular T-scores automáticamente desde las respuestas del RF
      const resultRF = tests_mmpi2rf.calcular();
      this.mmpiState.datosRF = resultRF.datos;

      // Mostrar toast de éxito
      this.mostrarToast('✅ T-scores calculados automáticamente. Revisa y ajusta si es necesario.', 'success');
    }

    this.mmpiState.seccionActual = seccion;
    this.mostrarSeccionMMPI(seccion);
  },

  /**
   * Mostrar sección de MMPI
   */
  mostrarSeccionMMPI(seccion) {
    // Ocultar todas las secciones
    const rfSection = document.getElementById('mmpi-rf-section');
    const scoresSection = document.getElementById('mmpi-scores-section');
    const rfProgress = document.getElementById('mmpi-rf-progress-container');

    if (rfSection) rfSection.style.display = 'none';
    if (scoresSection) scoresSection.style.display = 'none';
    if (rfProgress) rfProgress.style.display = 'none';

    // Mostrar la sección actual
    if (seccion === 'RF') {
      if (rfSection) rfSection.style.display = 'block';
      if (rfProgress) rfProgress.style.display = 'block';
      // No llamar a init aquí, ya se llamó en iniciarMMPI
    } else if (seccion === 'SCORES') {
      if (scoresSection) scoresSection.style.display = 'block';
      tests_mmpi2.init();
    }

    // Actualizar tabs
    const tabRF = document.getElementById('tab-mmpi-rf');
    const tabScores = document.getElementById('tab-mmpi-scores');

    if (tabRF) {
      tabRF.style.color = seccion === 'RF' ? '#2c5aa0' : '#999';
      tabRF.style.borderBottomColor = seccion === 'RF' ? '#2c5aa0' : 'transparent';
    }
    if (tabScores) {
      tabScores.style.color = seccion === 'SCORES' ? '#2c5aa0' : '#999';
      tabScores.style.borderBottomColor = seccion === 'SCORES' ? '#2c5aa0' : 'transparent';
    }
  },

  /**
   * Iniciar CUIDA en micrositio
   */
  iniciarCUIDA() {
    if (!this.pacienteActivo) {
      this.mostrarToast('❌ Primero debes crear o seleccionar un paciente', 'error');
      return;
    }
    tests_cuida.init();
    const token = localStorage.getItem('auth_token') || '';
    window.location.href = `/cuida.html?paciente_id=${this.pacienteActivo.id}&token=${encodeURIComponent(token)}`;
  },

  /**
   * Construir páginas del MMPI-2-RF (paginación)
   */
  construirPaginasMMPI() {
    const container = document.getElementById('mmpi-pages-container');
    if (!container) return;

    container.innerHTML = '';
    const totalPaginas = Math.ceil(this.mmpiState.totalItems / this.mmpiState.itemsPorPagina);

    for (let pag = 0; pag < totalPaginas; pag++) {
      const inicio = pag * this.mmpiState.itemsPorPagina + 1;
      const fin = Math.min(inicio + this.mmpiState.itemsPorPagina - 1, this.mmpiState.totalItems);

      const pagDiv = document.createElement('div');
      pagDiv.id = `mmpi-page-${pag}`;
      pagDiv.style.display = pag === 0 ? 'block' : 'none';

      // Card para la página
      const card = document.createElement('div');
      card.style.cssText = 'background: #fff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; margin-bottom: 16px;';

      // Header de la página
      const header = document.createElement('div');
      header.style.cssText = 'background: #f9f9f9; padding: 12px 16px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;';
      header.innerHTML = `
        <h3 style="margin: 0; font-size: 14px; color: #2c5aa0; font-weight: bold;">Ítems ${inicio} - ${fin}</h3>
        <span style="font-size: 11px; color: #999;">Página ${pag + 1} de ${totalPaginas}</span>
      `;
      card.appendChild(header);

      // Items
      const itemsDiv = document.createElement('div');
      itemsDiv.style.padding = '0';
      for (let i = inicio; i <= fin; i++) {
        const itemEl = this.crearElementoItemMMPI(i);
        itemsDiv.appendChild(itemEl);
      }
      card.appendChild(itemsDiv);
      pagDiv.appendChild(card);
      container.appendChild(pagDiv);
    }

    this.mmpiActualizarPagina();
  },

  /**
   * Crear elemento para un item del MMPI-2-RF
   */
  crearElementoItemMMPI(itemNum) {
    const itemEl = document.createElement('div');
    itemEl.className = 'test-item';
    itemEl.id = `mmpi-item-${itemNum}`;
    itemEl.style.cssText = 'display: grid; grid-template-columns: 40px 1fr 90px; align-items: center; gap: 14px; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; transition: background 0.15s;';

    // Obtener texto del item (si está disponible)
    const textoItem = tests_mmpi2rf?.items?.[itemNum - 1] || `Ítem ${itemNum}`;

    const respuestaActual = localStorage.getItem(`mmpi_r${itemNum}`) || '';

    itemEl.innerHTML = `
      <div style="font-family: monospace; font-size: 10px; color: #999; text-align: right; line-height: 1;">${itemNum}.</div>
      <div style="font-size: 13px; line-height: 1.5; color: #333;">${textoItem}</div>
      <div style="display: flex; gap: 6px; justify-content: flex-end;">
        <button type="button" class="vf-btn ${respuestaActual === 'V' ? 'sel-v' : ''}"
          onclick="app.marcarRespuestaMMPI(${itemNum}, 'V')"
          style="width: 38px; height: 34px; border-radius: 4px; border: 1px solid #ddd; background: #fff; color: #666; font-family: monospace; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.12s;">V</button>
        <button type="button" class="vf-btn ${respuestaActual === 'F' ? 'sel-f' : ''}"
          onclick="app.marcarRespuestaMMPI(${itemNum}, 'F')"
          style="width: 38px; height: 34px; border-radius: 4px; border: 1px solid #ddd; background: #fff; color: #666; font-family: monospace; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.12s;">F</button>
      </div>
    `;

    return itemEl;
  },

  /**
   * Marcar respuesta MMPI y actualizar UI
   */
  marcarRespuestaMMPI(itemNum, valor) {
    // Guardar en localStorage
    localStorage.setItem(`mmpi_r${itemNum}`, valor);

    // Actualizar botones del item actual
    const item = document.getElementById(`mmpi-item-${itemNum}`);
    if (item) {
      const btns = item.querySelectorAll('.vf-btn');
      if (btns[0]) {
        btns[0].className = valor === 'V' ? 'vf-btn sel-v' : 'vf-btn';
        btns[0].style.background = valor === 'V' ? 'rgba(39, 174, 96, 0.2)' : '#fff';
        btns[0].style.borderColor = valor === 'V' ? '#27ae60' : '#ddd';
        btns[0].style.color = valor === 'V' ? '#27ae60' : '#666';
      }
      if (btns[1]) {
        btns[1].className = valor === 'F' ? 'vf-btn sel-f' : 'vf-btn';
        btns[1].style.background = valor === 'F' ? 'rgba(231, 76, 60, 0.15)' : '#fff';
        btns[1].style.borderColor = valor === 'F' ? '#e74c3c' : '#ddd';
        btns[1].style.color = valor === 'F' ? '#e74c3c' : '#666';
      }
      item.style.background = valor ? '#f0f7ff' : '#fff';
      item.style.borderLeft = valor ? '3px solid #2c5aa0' : '0';
    }

    this.mmpiActualizarProgreso();
  },

  /**
   * Actualizar progreso del MMPI-2-RF
   */
  mmpiActualizarProgreso() {
    let respondidos = 0;
    let verdaderos = 0;
    let falsos = 0;

    // Contar respuestas desde localStorage
    for (let i = 1; i <= this.mmpiState.totalItems; i++) {
      const resp = localStorage.getItem(`mmpi_r${i}`);
      if (resp && (resp === 'V' || resp === 'F')) {
        respondidos++;
        if (resp === 'V') verdaderos++;
        else if (resp === 'F') falsos++;
      }
    }

    const porcentaje = (respondidos / this.mmpiState.totalItems) * 100;

    // Actualizar contadores (antiguos elementos)
    const counter = document.getElementById('mmpi-resp-counter');
    if (counter) counter.textContent = `${respondidos}/${this.mmpiState.totalItems}`;

    const countV = document.getElementById('mmpi-count-v');
    if (countV) countV.textContent = verdaderos;

    const countF = document.getElementById('mmpi-count-f');
    if (countF) countF.textContent = falsos;

    const progBar = document.getElementById('mmpi2rf-progress');
    if (progBar) progBar.style.width = `${porcentaje}%`;

    const progPct = document.getElementById('mmpi-progress-pct');
    if (progPct) progPct.textContent = `${Math.round(porcentaje)}%`;

    // Actualizar contadores (nuevos elementos del sistema de 5 pestañas)
    const testProgCount = document.getElementById('mmpi-test-prog-count');
    if (testProgCount) testProgCount.textContent = `${respondidos} / 338 respondidos`;

    const testCountV = document.getElementById('mmpi-test-count-v');
    if (testCountV) testCountV.textContent = verdaderos;

    const testCountF = document.getElementById('mmpi-test-count-f');
    if (testCountF) testCountF.textContent = falsos;

    const testProgBar = document.getElementById('mmpi-test-prog-bar');
    if (testProgBar) testProgBar.style.width = `${porcentaje}%`;

    // Activar botón de calcular si está COMPLETO
    const btnCalcular = document.getElementById('mmpi-btn-calcular');
    if (btnCalcular) {
      const esCompleto = respondidos === this.mmpiState.totalItems;
      if (esCompleto) {
        btnCalcular.style.opacity = '1';
        btnCalcular.style.pointerEvents = 'auto';
        btnCalcular.style.cursor = 'pointer';
        btnCalcular.textContent = '⚡ Calcular Resultados';
        btnCalcular.className = 'btn btn-primary';
      } else {
        btnCalcular.style.opacity = '0.35';
        btnCalcular.style.pointerEvents = 'none';
        btnCalcular.style.cursor = 'not-allowed';
        btnCalcular.textContent = `⏳ Completa los ${this.mmpiState.totalItems - respondidos} restantes`;
      }
    }

    // Activar botón de finalizar si está COMPLETO (anterior)
    const btnFinish = document.getElementById('mmpi-btn-finish');
    if (btnFinish) {
      const esCompleto = respondidos === this.mmpiState.totalItems;
      if (esCompleto) {
        btnFinish.style.opacity = '1';
        btnFinish.style.pointerEvents = 'auto';
        btnFinish.style.cursor = 'pointer';
        btnFinish.textContent = '✓ Todas respondidas (338/338) - Validar T-scores →';
        btnFinish.className = 'btn btn-primary btn-lg';
      } else {
        btnFinish.style.opacity = '0.35';
        btnFinish.style.pointerEvents = 'none';
        btnFinish.style.cursor = 'not-allowed';
        btnFinish.textContent = `⏳ Completa los ${this.mmpiState.totalItems - respondidos} restantes`;
      }
    }

    // Log para debugging
    console.log(`📊 MMPI Progreso: ${respondidos}/${this.mmpiState.totalItems} (${Math.round(porcentaje)}%) - V:${verdaderos}, F:${falsos}`);
  },

  /**
   * Validar que todos los items de la página actual estén respondidos
   */
  validarPaginaMMPI() {
    const pag = this.mmpiState.paginaActual;
    const inicio = pag * this.mmpiState.itemsPorPagina + 1;
    const fin = Math.min(inicio + this.mmpiState.itemsPorPagina - 1, this.mmpiState.totalItems);

    for (let i = inicio; i <= fin; i++) {
      const resp = localStorage.getItem(`mmpi_r${i}`);
      if (!resp) {
        const faltantes = [];
        for (let j = inicio; j <= fin; j++) {
          if (!localStorage.getItem(`mmpi_r${j}`)) {
            faltantes.push(j);
          }
        }
        this.mostrarToast(`⚠️ Completa los ítems faltantes: ${faltantes.join(', ')}`, 'warning');
        return false;
      }
    }
    return true;
  },

  /**
   * Activar una pestaña del sistema de 5 pestañas (0-4)
   */
  mmpiActivarPestana(numPestana) {
    // Ocultar todas las pestañas
    for (let i = 0; i < 5; i++) {
      const tab = document.getElementById(`mmpi-tab-${i}`);
      if (tab) tab.style.display = 'none';

      const btn = document.querySelectorAll('.mmpi-tab-btn')[i];
      if (btn) {
        btn.style.color = '#666';
        btn.style.borderBottomColor = 'transparent';
      }
    }

    // Mostrar pestaña seleccionada
    const tabActiva = document.getElementById(`mmpi-tab-${numPestana}`);
    if (tabActiva) tabActiva.style.display = 'block';

    // Marcar botón activo
    const btnActivo = document.querySelectorAll('.mmpi-tab-btn')[numPestana];
    if (btnActivo) {
      btnActivo.style.color = '#2c5aa0';
      btnActivo.style.borderBottomColor = '#2c5aa0';
    }

    console.log(`📑 Pestaña MMPI activada: ${numPestana}`);
  },

  /**
   * Calcular resultados del MMPI-2-RF y mostrarlos en las pestañas 2-4
   */
  mmpiCalcularYMostrar() {
    console.log('⚙️  Calculando resultados MMPI-2-RF...');

    // Validar que todos los items estén respondidos
    let respondidos = 0;
    for (let i = 1; i <= 338; i++) {
      const resp = localStorage.getItem(`mmpi_r${i}`);
      if (resp && (resp === 'V' || resp === 'F')) {
        respondidos++;
      }
    }

    if (respondidos < 338) {
      this.mostrarToast(`⚠️ Faltan ${338 - respondidos} ítems por responder`, 'warning');
      return;
    }

    // Obtener respuestas y calcular
    const respuestas = tests_mmpi2rf.obtenerRespuestas();
    const resultado = tests_mmpi2rf.calcular();
    this.mmpiState.datosRF = resultado.datos;

    // Mostrar mensaje de éxito
    this.mostrarToast('✅ Resultados calculados exitosamente', 'success');

    // Rellenar pestaña 1 (Ingreso de Datos) - resumen
    const datosResumen = document.getElementById('mmpi-datos-resumen');
    if (datosResumen) {
      const now = new Date().toLocaleDateString('es-ES');
      datosResumen.innerHTML = `
        <div>
          <label style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600;">Paciente</label>
          <p style="margin: 4px 0 0 0; color: #333;">${this.pacienteActivo?.nombre || 'Paciente'}</p>
        </div>
        <div>
          <label style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600;">Fecha de Evaluación</label>
          <p style="margin: 4px 0 0 0; color: #333;">${now}</p>
        </div>
        <div>
          <label style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600;">Total de Items</label>
          <p style="margin: 4px 0 0 0; color: #333;">338</p>
        </div>
        <div>
          <label style="font-size: 11px; color: #999; text-transform: uppercase; font-weight: 600;">Items Respondidos</label>
          <p style="margin: 4px 0 0 0; color: #27ae60; font-weight: 600;">338 ✓</p>
        </div>
      `;
    }

    // Rellenar pestaña 2 (Resultados) - tabla de escalas
    const resultadosContent = document.getElementById('mmpi-resultados-contenedor');
    if (resultadosContent && resultado.datos) {
      let html = `<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="background: #f0f0f0; border-bottom: 2px solid #ddd;">
            <th style="padding: 10px; text-align: left; font-weight: 600;">Escala</th>
            <th style="padding: 10px; text-align: center; font-weight: 600;">PD</th>
            <th style="padding: 10px; text-align: center; font-weight: 600;">T</th>
            <th style="padding: 10px; text-align: left; font-weight: 600;">Interpretación</th>
          </tr>
        </thead>
        <tbody>`;

      // Iterar sobre los resultados
      for (const [escala, datos] of Object.entries(resultado.datos)) {
        if (typeof datos === 'object' && datos.t !== undefined) {
          const tScore = Math.round(datos.t || 50);
          let color = '#666';
          let nivel = 'Normal';
          if (tScore >= 70) { color = '#e74c3c'; nivel = 'MUY ALTO'; }
          else if (tScore >= 60) { color = '#f39c12'; nivel = 'ALTO'; }
          else if (tScore >= 45) { color = '#3498db'; nivel = 'Promedio'; }
          else { color = '#27ae60'; nivel = 'Bajo'; }

          html += `<tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 8px 10px; font-weight: 600;">${escala}</td>
            <td style="padding: 8px 10px; text-align: center;">${datos.pd || '—'}</td>
            <td style="padding: 8px 10px; text-align: center; color: ${color}; font-weight: 600;">${tScore}</td>
            <td style="padding: 8px 10px; color: ${color};">${nivel}</td>
          </tr>`;
        }
      }
      html += '</tbody></table>';
      resultadosContent.innerHTML = html;
    }

    // Rellenar pestaña 3 (Perfil Visual) - gráfico placeholder
    const perfilContent = document.getElementById('mmpi-perfil-contenedor');
    if (perfilContent) {
      perfilContent.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <p style="font-size: 14px; font-weight: 600; color: #2c5aa0;">Perfil Gráfico MMPI-2-RF</p>
          <p style="color: #999; font-size: 12px; margin: 12px 0;">Gráfico de barras con comparación de escalas</p>
          <div style="background: #f0f0f0; height: 250px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-top: 20px;">
            <p style="color: #999;">Visualización en desarrollo</p>
          </div>
        </div>
      `;
    }

    // Rellenar pestaña 4 (Interpretación) - resumen interpretativo
    const interpContent = document.getElementById('mmpi-interp-contenedor');
    if (interpContent) {
      interpContent.innerHTML = `
        <div style="padding: 16px; background: #f9f9f9; border-left: 4px solid #2c5aa0; border-radius: 4px; margin-bottom: 16px;">
          <p style="margin: 0; color: #333; font-size: 13px;"><strong>⚠️ Nota Clínica:</strong> Este informe es una guía automática. La interpretación final siempre debe ser realizada por un psicólogo con formación en evaluación psicoló. El software no reemplaza el juicio clínico profesional.</p>
        </div>
        <div style="background: white; border-radius: 6px; border: 1px solid #ddd; padding: 16px;">
          <h4 style="margin: 0 0 12px 0; color: #2c5aa0;">Resumen de Interpretación</h4>
          <p style="color: #666; font-size: 13px; line-height: 1.6;">
            Se han calculado automáticamente los puntajes T de las 49 escalas del MMPI-2-RF basados en las 338 respuestas proporcionadas.
            Cada escala proporciona información sobre diferentes aspectos de la personalidad y sintomatología psicológica del evaluado.
          </p>
          <p style="color: #666; font-size: 13px; margin-top: 12px; line-height: 1.6;">
            Los resultados pueden ser revisados en la pestaña de "Resultados". Para una interpretación detallada de cada escala,
            consulte con el profesional evaluador.
          </p>
        </div>
      `;
    }

    // Activar pestaña de resultados (2)
    this.mmpiActivarPestana(2);

    // Habilitar botón de guardar
    const btnGuardar = document.getElementById('mmpi-btn-guardar');
    if (btnGuardar) {
      btnGuardar.style.opacity = '1';
      btnGuardar.style.pointerEvents = 'auto';
      btnGuardar.style.cursor = 'pointer';
      btnGuardar.textContent = '💾 Guardar Evaluación Completa';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /**
   * Ir a página anterior del MMPI-2-RF
   */
  mmpiPaginaAnterior() {
    if (this.mmpiState.paginaActual > 0) {
      this.mmpiState.paginaActual--;
      this.mmpiActualizarPagina();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Ir a página siguiente del MMPI-2-RF
   */
  mmpiPaginaSiguiente() {
    const totalPaginas = Math.ceil(this.mmpiState.totalItems / this.mmpiState.itemsPorPagina);

    // Validar que la página actual esté completa antes de avanzar
    if (!this.validarPaginaMMPI()) {
      return;
    }

    if (this.mmpiState.paginaActual < totalPaginas - 1) {
      this.mmpiState.paginaActual++;
      this.mmpiActualizarPagina();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  /**
   * Actualizar visualización de página
   */
  mmpiActualizarPagina() {
    const totalPaginas = Math.ceil(this.mmpiState.totalItems / this.mmpiState.itemsPorPagina);
    const pag = this.mmpiState.paginaActual;

    // Ocultar todas las páginas
    for (let i = 0; i < totalPaginas; i++) {
      const pageEl = document.getElementById(`mmpi-page-${i}`);
      if (pageEl) pageEl.style.display = 'none';
    }

    // Mostrar página actual
    const pageActual = document.getElementById(`mmpi-page-${pag}`);
    if (pageActual) pageActual.style.display = 'block';

    // Actualizar indicador
    const inicio = pag * this.mmpiState.itemsPorPagina + 1;
    const fin = Math.min(inicio + this.mmpiState.itemsPorPagina - 1, this.mmpiState.totalItems);
    const pageInd = document.getElementById('mmpi-page-indicator');
    if (pageInd) pageInd.textContent = `Página ${pag + 1} de ${totalPaginas}`;

    const pageInfo = document.getElementById('mmpi-page-info');
    if (pageInfo) pageInfo.textContent = `Página ${pag + 1} de ${totalPaginas} (ítems ${inicio}-${fin})`;

    // Actualizar botones de navegación
    const btnPrev = document.getElementById('mmpi-btn-prev');
    const btnNext = document.getElementById('mmpi-btn-next');

    if (btnPrev) {
      if (pag === 0) {
        btnPrev.style.opacity = '0.35';
        btnPrev.style.pointerEvents = 'none';
      } else {
        btnPrev.style.opacity = '1';
        btnPrev.style.pointerEvents = 'auto';
      }
    }

    if (btnNext) {
      if (pag === totalPaginas - 1) {
        btnNext.textContent = 'Finalizar ✓';
        btnNext.style.opacity = '0.35';
        btnNext.style.pointerEvents = 'none';
      } else {
        btnNext.textContent = 'Siguiente →';
        btnNext.style.opacity = '1';
        btnNext.style.pointerEvents = 'auto';
      }
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

      // PARA MMPI-2: Si existe PDF guardado como base64, mostrar SOLO ese PDF
      if (prueba.tipo === 'MMPI2' || prueba.tipo === 'MMPI') {
        let pdfBase64 = prueba.pdf_base64;

        // Si no está en prueba, buscar en subescalas
        if (!pdfBase64 && prueba.subescalas) {
          let subescalas = prueba.subescalas;
          if (typeof subescalas === 'string') {
            try {
              subescalas = JSON.parse(subescalas);
            } catch (e) {
              console.log('Error parseando subescalas:', e);
              subescalas = {};
            }
          }
          pdfBase64 = subescalas?.pdf_base64;
        }

        if (pdfBase64) {
          console.log('✅ Mostrando PDF MMPI-2 desde base64');
          console.log('   Tamaño base64:', pdfBase64.length);

          // Crear blob desde base64 (compatible con archivos grandes)
          try {
            const binaryString = atob(pdfBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            console.log('✅ Blob URL creado:', blobUrl);

            // Usar <object> en lugar de <iframe> para mejor compatibilidad
            contenido.innerHTML = `
              <object
                data="${blobUrl}"
                type="application/pdf"
                style="width: 100%; height: 85vh; border: none;">
                <p>Tu navegador no puede mostrar PDFs. <a href="${blobUrl}" download="MMPI-2.pdf">Descargar PDF</a></p>
              </object>
            `;
            modal.classList.add('active');

            // Ocultar botón "Descargar Reporte" SOLO para MMPI-2
            const btnDescargar = document.getElementById('btn-descargar-reporte');
            if (btnDescargar) {
              btnDescargar.style.display = 'none';
            }

            console.log('✅ Modal abierto con object tag');
            return;
          } catch (error) {
            console.error('❌ Error al procesar PDF:', error);
            contenido.innerHTML = '<p style="color: red; padding: 20px;">Error al cargar PDF: ' + error.message + '</p>';
            modal.style.display = 'block';
          }
        } else {
          console.log('❌ No se encontró pdf_base64');
          console.log('   prueba.pdf_base64:', prueba.pdf_base64);
          console.log('   prueba.subescalas:', prueba.subescalas);
        }
      }

      // PARA CUIDA: Mostrar SOLO PDF del micrositio (como MMPI-2)
      if (prueba.tipo === 'CUIDA') {
        console.log('📋 CUIDA - Estructura completa de prueba:', prueba);
        console.log('📋 CUIDA - Keys en prueba:', Object.keys(prueba));

        const btnDescargar = document.getElementById('btn-descargar-reporte');
        if (btnDescargar) {
          btnDescargar.style.display = 'none';
        }

        // Buscar PDF guardado en la estructura de prueba
        let pdfBase64 = prueba.pdf_base64;
        console.log('🔍 CUIDA - Buscando pdfBase64 en prueba.pdf_base64:', !!pdfBase64);

        // Si no está en prueba, buscar en subescalas
        if (!pdfBase64 && prueba.subescalas) {
          let subescalas = prueba.subescalas;
          console.log('🔍 CUIDA - subescalas tipo:', typeof subescalas);

          if (typeof subescalas === 'string') {
            try {
              subescalas = JSON.parse(subescalas);
              console.log('✅ CUIDA - subescalas parseada');
            } catch (e) {
              console.log('❌ CUIDA - Error parseando subescalas:', e);
              subescalas = {};
            }
          }
          pdfBase64 = subescalas?.pdf_base64;
          console.log('🔍 CUIDA - pdfBase64 en subescalas:', !!pdfBase64);
        }

        if (pdfBase64) {
          console.log('✅ Mostrando PDF CUIDA desde base64');
          console.log('   Tamaño base64:', pdfBase64.length);

          // Crear blob desde base64
          try {
            const binaryString = atob(pdfBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            console.log('✅ Blob URL creado:', blobUrl);

            // Mostrar PDF en viewer
            contenido.innerHTML = `
              <object
                data="${blobUrl}"
                type="application/pdf"
                style="width: 100%; height: 85vh; border: none;">
                <p>Tu navegador no puede mostrar PDFs. <a href="${blobUrl}" download="CUIDA.pdf">Descargar PDF</a></p>
              </object>
            `;
            modal.classList.add('active');

            console.log('✅ Modal abierto con PDF CUIDA');
            return;
          } catch (error) {
            console.error('❌ Error al procesar PDF CUIDA:', error);
            contenido.innerHTML = '<p style="color: red; padding: 20px;">Error al cargar PDF: ' + error.message + '</p>';
            modal.classList.add('active');
            return;
          }
        } else {
          console.warn('⚠️ CUIDA - No se encontró pdfBase64, mostrando error');
          contenido.innerHTML = '<p style="color: orange; padding: 20px;">⚠️ El PDF del test CUIDA aún no se ha generado. Por favor, completa el test primero.</p>';
          modal.classList.add('active');
          return;
        }
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

        <!-- VALIDACIÓN PROFESIONAL (después de datos del paciente) -->
        ${this.generarValidacionProfesional()}

        <!-- PRUEBA REALIZADA -->
        <div style="background: #f0f4f8; padding: 6px; margin-bottom: 10px; border-radius: 3px;">
          <h3 style="margin: 0; color: #2c5aa0; font-size: 10px; font-weight: bold;">PRUEBA: ${prueba.tipo}</h3>
        </div>

        <!-- RESULTADOS + INTERPRETACIÓN (AGRUPADOS) -->
        <div style="page-break-inside: avoid; margin-bottom: 10px;">
          <!-- Gráfico PCL-R -->
          <div style="margin-bottom: 20px; font-size: 9px;">
            ${prueba.tipo === 'SCL90R' ? this.generarReporteSCL(prueba, subescalas) : prueba.tipo === 'PCLR' ? this.generarReportePCLR(prueba, subescalas) : prueba.tipo === 'SCID2' ? this.generarReporteSCID2(prueba, subescalas) : (prueba.tipo === 'MMPI2' || prueba.tipo === 'MMPI') ? this.generarReporteMMPI2(prueba, subescalas) : prueba.tipo === 'CUIDA' ? this.generarReporteCUIDA(prueba, subescalas) : prueba.tipo === 'ISRA' ? this.generarReporteISRA(prueba, subescalas) : this.generarReporteGenerico(prueba, subescalas)}
          </div>

          <!-- INTERPRETACIÓN (dentro del contenedor principal) -->
          ${subescalas && subescalas.interpretacion ? `
          <div style="background: #f9f9f9; padding: 8px; border-left: 3px solid #2c5aa0; margin-bottom: 10px; border-radius: 3px;">
            <h3 style="margin: 0 0 4px 0; color: #2c5aa0; font-size: 9px; font-weight: bold;">INTERPRETACIÓN</h3>
            <p style="margin: 0; font-size: 8px; line-height: 1.4;">
              ${typeof subescalas.interpretacion === 'object' ? (subescalas.interpretacion.label || subescalas.interpretacion.texto || '') : subescalas.interpretacion}
            </p>
          </div>
          ` : ''}
        </div>

        <!-- FOOTER -->
        <div style="padding-top: 4px; margin-top: 6px; font-size: 7px; color: #999; text-align: center;">
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
      if (prueba.tipo === 'CUIDA') {
        this.renderGraficoCUIDA(prueba, subescalas);
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

      // **CASO ESPECIAL: ISRA - Gráfico de Perfil con Centiles**
      if (prueba.tipo === 'ISRA') {
        // Obtener respuestas guardadas
        const respuestas = app.israState._respuestas || {};
        const totalC = respuestas.C ? respuestas.C.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const totalF = respuestas.F ? respuestas.F.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const totalM = respuestas.M ? respuestas.M.reduce((a, b) => a + (Number(b) || 0), 0) : 0;
        const totalT = totalC + totalF + totalM;

        // Determinar sexo del paciente
        const sexo = (this.pacienteActivo?.sexo || 'mujeres').toLowerCase().includes('hombre') ? 'varones' : 'mujeres';

        // Obtener centiles usando los baremos
        const centilC = interpretacion.isra.obtenerCentil(totalC, 'C', sexo);
        const centilF = interpretacion.isra.obtenerCentil(totalF, 'F', sexo);
        const centilM = interpretacion.isra.obtenerCentil(totalM, 'M', sexo);
        const centilT = interpretacion.isra.obtenerCentil(totalT, 'T', sexo);

        // Crear gráfico de perfil ISRA
        const ctx = canvasElement.getContext('2d');
        const labels = ['C\n(Cognitivo)', 'F\n(Fisiológico)', 'M\n(Motor)', 'T\n(Total)'];
        const centiles = [centilC, centilF, centilM, centilT];

        canvasElement.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Centil del Paciente',
              data: centiles,
              backgroundColor: centiles.map(c => {
                if (c >= 99) return '#8B0000'; // Rojo oscuro - Extrema
                if (c >= 75) return '#FF8C00'; // Naranja - Severa
                if (c >= 25) return '#FFD700'; // Amarillo - Normal
                return '#228B22'; // Verde - Sin ansiedad
              }),
              borderColor: '#333',
              borderWidth: 2,
              barPercentage: 0.7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Percentil' },
                ticks: {
                  font: { size: 10 },
                  callback: function(value) { return value; }
                },
                grid: { color: 'rgba(0,0,0,0.1)' }
              },
              x: {
                ticks: { font: { size: 11, weight: 'bold' } }
              }
            }
          },
          plugins: [{
            id: 'zonas-fondo',
            afterDatasetsDraw(chart) {
              const ctx = chart.ctx;
              const yAxis = chart.scales.y;
              const chartArea = chart.chartArea;

              // Zonas de color de fondo
              const zonas = [
                { min: 0, max: 25, color: 'rgba(34, 139, 34, 0.1)' }, // Verde
                { min: 25, max: 75, color: 'rgba(255, 215, 0, 0.1)' }, // Amarillo
                { min: 75, max: 99, color: 'rgba(255, 140, 0, 0.1)' }, // Naranja
                { min: 99, max: 100, color: 'rgba(139, 0, 0, 0.1)' }  // Rojo
              ];

              zonas.forEach(zona => {
                const yStart = yAxis.getPixelForValue(zona.max);
                const yEnd = yAxis.getPixelForValue(zona.min);
                const height = yEnd - yStart;

                ctx.fillStyle = zona.color;
                ctx.fillRect(chartArea.left, yStart, chartArea.width, height);
              });

              // Líneas de percentiles
              [25, 50, 75, 99].forEach(pc => {
                const y = yAxis.getPixelForValue(pc);

                // Línea de Población Normal (Pc 50)
                if (pc === 50) {
                  ctx.strokeStyle = '#228B22'; // Verde - Población Normal
                  ctx.lineWidth = 3;
                  ctx.setLineDash([8, 4]); // Punteada más visible
                  ctx.beginPath();
                  ctx.moveTo(chartArea.left, y);
                  ctx.lineTo(chartArea.right, y);
                  ctx.stroke();
                  ctx.setLineDash([]);

                  // Etiqueta para Población Normal
                  ctx.fillStyle = '#228B22';
                  ctx.font = 'bold 10px Arial';
                  ctx.textAlign = 'right';
                  ctx.fillText('Población Normal', chartArea.left - 5, y - 5);
                } else {
                  // Otras líneas de percentiles (25, 75, 99)
                  ctx.strokeStyle = '#e0e0e0';
                  ctx.lineWidth = 1;
                  ctx.setLineDash([]);
                  ctx.beginPath();
                  ctx.moveTo(chartArea.left, y);
                  ctx.lineTo(chartArea.right, y);
                  ctx.stroke();

                  // Etiqueta
                  ctx.fillStyle = '#999';
                  ctx.font = '8px Arial';
                  ctx.textAlign = 'right';
                  ctx.fillText(`Pc ${pc}`, chartArea.left - 5, y + 3);
                }
              });
            }
          }]
        });

        // Convertir a imagen para PDF (PATRÓN CONSISTENTE)
        setTimeout(() => {
          if (canvasElement.chartInstance && canvasElement.parentNode) {
            const imgSrc = canvasElement.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = '100%';
            img.style.height = '100%';  // Altura dinámica del contenedor
            img.style.display = 'block';

            const parentElement = canvasElement.parentNode;
            const containerHeight = parentElement.offsetHeight;
            parentElement.replaceChild(img, canvasElement);
            console.log(`✓ Gráfico ISRA convertido a imagen (${containerHeight}px)`);
          }
        }, 500);  // 500ms para que Chart.js termine completamente
        return;
      }

      // Obtener normas del archivo local basadas en tipo de test
      const normasLocales = this.getNormasLocales(prueba.tipo);

      let promedioPaciente = 0;
      let promedioReferencia = 0;

      // Procesar según tipo de test - calcular promedios
      if (prueba.tipo === 'SCL90R') {
        // SCL-90-R: promedio de subescalas
        const escalas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
        const valores = escalas.map(e => Number(subescalas[e]) || 0);
        const referencias = escalas.map(e => {
          const norma = normasLocales?.escalas?.find(esc => esc.id === e);
          return norma?.media || 0.3;
        });
        promedioPaciente = (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
        promedioReferencia = (referencias.reduce((a, b) => a + b, 0) / referencias.length).toFixed(2);
      } else if (prueba.tipo === 'MMPI2' || prueba.tipo === 'MMPI') {
        // MMPI-2: promedio de escalas
        if (Array.isArray(data) && data.length > 0) {
          promedioPaciente = (data.reduce((a, b) => a + (Number(b) || 0), 0) / data.length).toFixed(1);
          const referencias = data.map((_, idx) => normasLocales?.escalas?.[idx]?.media || 50);
          promedioReferencia = (referencias.reduce((a, b) => a + b, 0) / referencias.length).toFixed(1);
        }
      } else if (['PCLR', 'EGEP5'].includes(prueba.tipo)) {
        // PCL-R y EGEP-5: total o promedio
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((a, b) => a + (Number(b) || 0), 0);
          promedioPaciente = total.toFixed(1);
          const mediaRef = (data.length * (prueba.tipo === 'PCLR' ? 0.2 : 0.2)).toFixed(1);
          promedioReferencia = mediaRef;
        }
      } else if (['HAMILTON', 'ISRA', 'TDS'].includes(prueba.tipo)) {
        // Hamilton, ISRA, TDS: total
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((a, b) => a + (Number(b) || 0), 0);
          promedioPaciente = total.toFixed(1);
          const mediaRef = (data.length * (normasLocales?.media_por_item || 0.5)).toFixed(1);
          promedioReferencia = mediaRef;
        }
      } else if (prueba.tipo === 'SCID2') {
        // SCID-II: gráfico de 12 escalas (A-L) con Paciente vs Referencia
        const escalasData = this.calcularRespuestasPorEscalaSCID2(data);
        const labels = Object.entries(escalasData).map(([_, e]) => e.label);
        const valoresPaciente = Object.entries(escalasData).map(([_, e]) => e.count);
        const valoresReferencia = Object.entries(escalasData).map(([_, e]) => e.minimo);

        const maxValor = Math.max(...valoresPaciente, ...valoresReferencia) + 2;
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
                borderWidth: 1
              },
              {
                label: 'Referencia (Mínimo)',
                data: valoresReferencia,
                backgroundColor: '#27ae60',
                borderColor: '#229954',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { font: { size: 10 }, padding: 10 }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: maxValor,
                ticks: { font: { size: 8 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
              },
              x: {
                ticks: { font: { size: 9 } }
              }
            }
          }
        });

        setTimeout(() => {
          if (canvasElement.chartInstance && canvasElement.parentNode) {
            const imgSrc = canvasElement.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = '100%';
            img.style.height = '100%';  // Altura dinámica del contenedor
            img.style.display = 'block';

            const parentElement = canvasElement.parentNode;
            const containerHeight = parentElement.offsetHeight;
            parentElement.replaceChild(img, canvasElement);
            console.log(`✓ Gráfico SCID-II convertido a imagen (${containerHeight}px)`);
          }
        }, 500);  // 500ms para que Chart.js termine completamente
        return;
      } else if (prueba.tipo === 'MMPI2' || prueba.tipo === 'MMPI') {
        // MMPI-2: gráfico de 13 escalas con Paciente vs Referencia (T=50)
        const escalasInfo = [
          { id: 'L', label: 'L' },
          { id: 'F', label: 'F' },
          { id: 'K', label: 'K' },
          { id: 'Hs', label: 'Hs' },
          { id: 'D', label: 'D' },
          { id: 'Hy', label: 'Hy' },
          { id: 'Pd', label: 'Pd' },
          { id: 'Mf', label: 'Mf' },
          { id: 'Pa', label: 'Pa' },
          { id: 'Pt', label: 'Pt' },
          { id: 'Sc', label: 'Sc' },
          { id: 'Ma', label: 'Ma' },
          { id: 'Si', label: 'Si' }
        ];

        const dataObj = typeof data === 'string' ? JSON.parse(data) : (typeof data === 'object' ? data : {});
        const labels = escalasInfo.map(e => e.label);
        const valoresPaciente = escalasInfo.map(e => Number(dataObj[e.id]) || 0);
        const valoresReferencia = Array(13).fill(50);

        const maxValor = Math.max(...valoresPaciente, ...valoresReferencia) + 5;
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
                borderWidth: 1
              },
              {
                label: 'Referencia (T=50)',
                data: valoresReferencia,
                backgroundColor: '#27ae60',
                borderColor: '#229954',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { font: { size: 10 }, padding: 10 }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: maxValor,
                ticks: { font: { size: 8 } },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
              },
              x: {
                ticks: { font: { size: 9 } }
              }
            }
          }
        });

        setTimeout(() => {
          if (canvasElement.chartInstance && canvasElement.parentNode) {
            const imgSrc = canvasElement.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = '100%';
            img.style.height = '100%';  // Altura dinámica del contenedor
            img.style.display = 'block';

            const parentElement = canvasElement.parentNode;
            const containerHeight = parentElement.offsetHeight;
            parentElement.replaceChild(img, canvasElement);
            console.log(`✓ Gráfico MMPI-2 convertido a imagen (${containerHeight}px)`);
          }
        }, 500);  // 500ms para que Chart.js termine completamente
        return;
      } else {
        // Fallback: promedio simple
        if (Array.isArray(data) && data.length > 0) {
          promedioPaciente = (data.reduce((a, b) => a + (Number(b) || 0), 0) / data.length).toFixed(1);
          promedioReferencia = 0.5;
        }
      }

      // Labels simplificados: solo Paciente y Referencia
      const labels = ['Paciente', 'Referencia'];
      const valoresPaciente = [Number(promedioPaciente)];
      const valoresReferencia = [Number(promedioReferencia)];

      const maxValor = Math.max(Number(promedioPaciente), Number(promedioReferencia), 2) + 1;
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
              barPercentage: 0.6
            },
            {
              label: 'Población Normal',
              data: valoresReferencia,
              backgroundColor: '#27ae60',
              borderColor: '#229954',
              borderWidth: 2,
              barPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: false },
          onHover: false,
          animation: {
            duration: 0
          },
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

      // Convertir a imagen estática después de renderizar (PATRÓN CONSISTENTE)
      setTimeout(() => {
        if (canvasElement.chartInstance) {
          const imagenDataUrl = canvasElement.toDataURL('image/png');
          const img = document.createElement('img');
          img.src = imagenDataUrl;
          img.style.width = '100%';
          img.style.height = '100%';  // Altura dinámica del contenedor
          img.style.display = 'block';

          const parentElement = canvasElement.parentNode;
          const containerHeight = parentElement.offsetHeight;
          parentElement.replaceChild(img, canvasElement);
          canvasElement.chartInstance.destroy();
          console.log(`✓ Gráfico convertido a imagen (${containerHeight}px)`);
        }
      }, 500);  // 500ms para que Chart.js termine completamente

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
      // Encontrar canvas de gráfico de perfil (ID estático: chartPerfilComparativo)
      const canvas = document.getElementById('chartPerfilComparativo');
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
        // SCL-90-R: extraer solo las 9 escalas (sin índices globales)
        const escalas = ['SOM', 'OC', 'SI', 'DEP', 'ANX', 'HOS', 'PHOB', 'PAR', 'PSY'];
        const subescalasData = typeof subescalas === 'string' ? JSON.parse(subescalas) : subescalas;
        escalas.forEach(escala => {
          if (subescalasData.subescalas && subescalasData.subescalas[escala]) {
            datos[escala] = subescalasData.subescalas[escala];
          } else if (subescalasData[escala]) {
            datos[escala] = subescalasData[escala];
          } else {
            datos[escala] = { media: 0 };
          }
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

        // Convertir a imagen estática después de renderizar (PATRÓN PCL-R)
        // Esto asegura que el gráfico se vea en el PDF
        setTimeout(() => {
          try {
            const imagenDataUrl = canvas.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = imagenDataUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = 'block';

            const parent = canvas.parentNode;
            const containerHeight = parent.offsetHeight; // Usar altura real del contenedor
            parent.replaceChild(img, canvas);
            console.log(`✓ Gráfico de perfil convertido a imagen (${containerHeight}px)`);
          } catch (convertError) {
            console.warn('No se pudo convertir canvas a imagen:', convertError);
          }
        }, 500);
      }

    } catch (error) {
      console.error('Error al renderizar gráfico de perfil:', error);
    }
  },

  /**
   * Renderizar gráfico CUIDA: Barras de escalas primarias con puntos de eneatipo
   */
  renderGraficoCUIDA(prueba, subescalas) {
    try {
      const container = document.getElementById('chartCUIDA');
      if (!container) return;

      const rawData = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : subescalas || {};
      // Acceder a la propiedad escalas si existe, sino usar el objeto completo
      const datos = rawData.escalas || rawData;

      console.log('🔍 renderGraficoCUIDA - datos recibidos:', { rawData, datos });

      // Escalas primarias (14 escalas)
      const escalas = [
        { abbr: 'Al', name: 'Altruismo' },
        { abbr: 'Ap', name: 'Apertura' },
        { abbr: 'As', name: 'Asertividad' },
        { abbr: 'At', name: 'Autoestima' },
        { abbr: 'Rp', name: 'C. de resolver problemas' },
        { abbr: 'Em', name: 'Empatía' },
        { abbr: 'Ee', name: 'Equilibrio emocional' },
        { abbr: 'In', name: 'Independencia' },
        { abbr: 'Fl', name: 'Flexibilidad' },
        { abbr: 'Rf', name: 'Responsabilidad' },
        { abbr: 'Sc', name: 'Solución de conflictos' },
        { abbr: 'Tf', name: 'Tolerancia a la frustración' },
        { abbr: 'Ag', name: 'Agresividad' },
        { abbr: 'Dl', name: 'Disconformidad' }
      ];

      const barHeight = 26;
      const barWidth = 280;
      const svg = [];
      svg.push(`<svg viewBox="0 0 900 ${escalas.length * (barHeight + 4) + 40}" style="width: 100%; height: auto; max-width: 100%; border: 1px solid #ddd; border-radius: 3px; margin: 10px 0;">`);

      // Leyenda
      svg.push(`<text x="10" y="18" style="font-size: 12px; font-weight: bold; fill: #333;">Perfil Gráfico — Eneatipos (1=Bajo, 5=Normal, 9=Alto)</text>`);

      escalas.forEach((esc, idx) => {
        const y = 35 + idx * (barHeight + 4);
        const en = datos[esc.abbr]?.en || null;
        const pd = datos[esc.abbr]?.pd !== undefined ? Math.round(datos[esc.abbr].pd) : '–';
        const pct = en ? Math.round((en - 1) / 8 * 100) : null;

        // Nombre y valores
        svg.push(`<text x="10" y="${y + 17}" style="font-size: 11px; fill: #333; font-weight: 500;">${esc.abbr}</text>`);
        svg.push(`<text x="50" y="${y + 17}" style="font-size: 10px; fill: #666;">PD: ${pd}</text>`);
        svg.push(`<text x="110" y="${y + 17}" style="font-size: 11px; fill: #333; font-weight: bold;">En: ${en || '–'}</text>`);

        // Barra con zonas de color
        const barStartX = 170;
        svg.push(`<rect x="${barStartX}" y="${y + 2}" width="${barWidth}" height="${barHeight - 4}" fill="white" stroke="#ddd" stroke-width="1" rx="3"/>`);

        // Zona Bajo (1-3) - 25% azul claro
        svg.push(`<rect x="${barStartX}" y="${y + 2}" width="${barWidth * 0.25}" height="${barHeight - 4}" fill="#dbeafe" rx="3 0 0 3"/>`);

        // Zona Normal (4-6) - 50% verde claro
        svg.push(`<rect x="${barStartX + barWidth * 0.25}" y="${y + 2}" width="${barWidth * 0.5}" height="${barHeight - 4}" fill="#d1fae5"/>`);

        // Zona Alto (7-9) - 25% amarillo claro
        svg.push(`<rect x="${barStartX + barWidth * 0.75}" y="${y + 2}" width="${barWidth * 0.25}" height="${barHeight - 4}" fill="#fef3c7" rx="0 3 3 0"/>`);

        // Marcas verticales
        for (let i = 0; i <= 4; i++) {
          const xPos = barStartX + (barWidth * i / 4);
          svg.push(`<line x1="${xPos}" y1="${y + 2}" x2="${xPos}" y2="${y + barHeight - 2}" stroke="rgba(255,255,255,0.7)" stroke-width="1"/>`);
        }

        // Punto azul indicador del eneatipo
        if (pct !== null) {
          const dotX = barStartX + (barWidth * pct / 100);
          svg.push(`<circle cx="${dotX}" cy="${y + barHeight / 2}" r="5" fill="#0369a1" stroke="white" stroke-width="2" style="box-shadow: 0 1px 4px rgba(0,0,0,0.3);"/>`);
        }
      });

      // Eje de números
      svg.push(`<text x="175" y="${35 + escalas.length * (barHeight + 4) + 5}" style="font-size: 10px; fill: #999;">1</text>`);
      svg.push(`<text x="305" y="${35 + escalas.length * (barHeight + 4) + 5}" style="font-size: 10px; fill: #999;">3</text>`);
      svg.push(`<text x="430" y="${35 + escalas.length * (barHeight + 4) + 5}" style="font-size: 10px; fill: #999;">5</text>`);
      svg.push(`<text x="555" y="${35 + escalas.length * (barHeight + 4) + 5}" style="font-size: 10px; fill: #999;">7</text>`);
      svg.push(`<text x="675" y="${35 + escalas.length * (barHeight + 4) + 5}" style="font-size: 10px; fill: #999;">9</text>`);

      svg.push(`</svg>`);

      container.innerHTML = svg.join('');
      console.log('✓ Gráfico CUIDA SVG generado');

    } catch (error) {
      console.error('Error al renderizar gráfico CUIDA:', error);
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

      // Convertir a imagen estática después de renderizar (PATRÓN CONSISTENTE)
      setTimeout(() => {
        if (canvasElement.chartInstance) {
          const imagenDataUrl = canvasElement.toDataURL('image/png');
          const img = document.createElement('img');
          img.src = imagenDataUrl;
          img.style.width = '100%';
          img.style.height = '100%';  // Altura dinámica del contenedor
          img.style.display = 'block';

          const parentElement = canvasElement.parentNode;
          const containerHeight = parentElement.offsetHeight;
          parentElement.replaceChild(img, canvasElement);
          canvasElement.chartInstance.destroy();
          console.log(`✓ Gráfico PCL-R convertido a imagen (${containerHeight}px)`);
        }
      }, 500);  // 500ms para que Chart.js termine completamente
    } catch (error) {
      console.error('Error al renderizar gráfica comparativa PCL-R:', error);
    }
  },

  /**
   * Generar reporte específico para SCL-90-R (formato PDF)
   */
  generarReporteSCL(prueba, subescalas) {
    const escalasMap = {
      'SOM': 'Somatización', 'OC': 'Obsesión-Compulsión', 'SI': 'Sensibilidad Interpersonal',
      'DEP': 'Depresión', 'ANX': 'Ansiedad', 'HOS': 'Hostilidad', 'PHOB': 'Ansiedad Fóbica',
      'PAR': 'Ideación Paranoide', 'PSY': 'Psicoticismo'
    };

    // Verificar si hay datos reales (valores > 0 en al menos una escala)
    const subescalasData = subescalas?.subescalas || subescalas || {};
    const escalasOrdenadas = ['SOM', 'OC', 'SI', 'DEP', 'ANX', 'HOS', 'PHOB', 'PAR', 'PSY'];
    const tieneData = escalasOrdenadas.some(e => {
      const valor = subescalasData[e]?.media || 0;
      return Number(valor) > 0;
    });

    let html = '';

    // Si no hay datos, mostrar mensaje
    if (!tieneData) {
      html = `
        <div style="margin: 10px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 3px; color: #856404;">
          <p style="margin: 0; font-size: 9px; font-weight: bold;">⚠️ Test sin completar</p>
          <p style="margin: 4px 0 0 0; font-size: 8px;">Para visualizar resultados y gráficos comparativos, complete el cuestionario con todas las respuestas.</p>
        </div>
      `;
    } else {
      // Si hay datos, mostrar tablas y gráfico
      html = `
      <div style="margin: 4px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #00bcd4; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 8px; font-weight: bold;">Escalas</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Paciente</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">Media Norm.</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 8px; font-weight: bold;">D. Est.</th>
          </tr>`;

      const escalasOrdenadas = ['SOM', 'OC', 'SI', 'DEP', 'ANX', 'HOS', 'PHOB', 'PAR', 'PSY'];
      const normas = {
        'SOM': { media: 0.47, ds: 0.52 }, 'OC': { media: 0.59, ds: 0.55 },
        'SI': { media: 0.47, ds: 0.52 }, 'DEP': { media: 0.59, ds: 0.59 },
        'ANX': { media: 0.39, ds: 0.44 }, 'HOS': { media: 0.46, ds: 0.55 },
        'PHOB': { media: 0.15, ds: 0.31 }, 'PAR': { media: 0.47, ds: 0.52 },
        'PSY': { media: 0.19, ds: 0.36 }
      };

      escalasOrdenadas.forEach((escala, idx) => {
        const valor = subescalasData[escala]?.media || 0;
        const norma = normas[escala];
        const bgColor = '#ffffff';
        html += `<tr style="background: ${bgColor};">
          <td style="border: 1px solid #ddd; padding: 3px; font-weight: bold; font-size: 8px;">${escalasMap[escala]}</td>
          <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${Number(valor).toFixed(2)}</td>
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
              <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>IST (GSI)</strong></td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${(subescalas.IST || 0).toFixed(3)}</td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${subescalas.indicesGlobales?.GSI?.media || 0.44}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>TSP (PST)</strong></td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${subescalas.TSP || 0}</td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${subescalas.indicesGlobales?.PST?.media || 26.9}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;"><strong>MRSP (PSDI)</strong></td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${(subescalas.MRSP || 0).toFixed(3)}</td>
              <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">${subescalas.indicesGlobales?.PSDI?.media || 1.55}</td>
            </tr>
          </table>
        </div>

        <div style="margin: 4px 0 14px 0; padding: 6px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 3px; color: #333; page-break-inside: avoid;" class="reporte-analisis">
          <h4 style="color: #333; font-size: 8px; margin: 0 0 4px 0; font-weight: bold;">Perfil de Subescalas (Paciente vs Población Normal)</h4>
          <div style="position: relative; width: 100%; height: 260px;">
            <canvas id="chartPerfilComparativo" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      `;
    }

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
      <div style="margin: 4px 0 15px 0; padding: 4px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333; page-break-after: avoid; page-break-inside: avoid;" class="reporte-analisis">
        <div style="position: relative; width: 100%; height: 320px;">
          <canvas id="chartComparativoPCLR" style="width: 100%; height: 100%;"></canvas>
        </div>

        <!-- TABLA DE MÉTRICAS (PCL-R específico) -->
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 8px;">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-size: 10px;">Métrica</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 10px;">Paciente</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 10px;">Población</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-size: 10px;">Diferencia</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 3px; font-weight: bold; font-size: 10px;">Puntaje Total</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 10px;">${totalPaciente.toFixed(1)}/60</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 10px;">${normas.totalMedio.toFixed(1)}/60</td>
            <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 10px; ${totalPaciente > normas.totalMedio ? 'color: #dc2626; font-weight: bold;' : 'color: #276749;'}">${(totalPaciente - normas.totalMedio).toFixed(1)}</td>
          </tr>
        </table>
      </div>
    `;

    return html;
  },

  /**
   * Generar reporte SCID-II con tabla de escalas
   */
  generarReporteSCID2(prueba, subescalas) {
    const escalasInfo = [
      { letra: 'A', preguntas: '1 - 7', minimo: 4, nombre: 'TPE - Trastorno de la personalidad por evitación' },
      { letra: 'B', preguntas: '8 - 15', minimo: 5, nombre: 'TPD - Trastorno de la personalidad por dependencia' },
      { letra: 'C', preguntas: '16 - 26', minimo: 5, nombre: 'TOC - Trastorno obsesivo - compulsivo' },
      { letra: 'D', preguntas: '27 - 35', minimo: 5, nombre: 'PA - Pasivo - agresivo' },
      { letra: 'E', preguntas: '36 - 48', minimo: 5, nombre: 'AUT - Autodestructivo' },
      { letra: 'F', preguntas: '49 - 56', minimo: 4, nombre: 'TPP - Trastorno paranoide de la personalidad' },
      { letra: 'G', preguntas: '57 - 64', minimo: 5, nombre: 'TEZ - Trastorno esquizotípico de la personalidad' },
      { letra: 'H', preguntas: '65 - 69', minimo: 4, nombre: 'TES - Trastorno esquizoide de la personalidad' },
      { letra: 'I', preguntas: '70 - 79', minimo: 4, nombre: 'TH - Trastorno histriónico de la personalidad' },
      { letra: 'J', preguntas: '80 - 90', minimo: 6, nombre: 'TN - Trastorno narcisista de la personalidad' },
      { letra: 'K', preguntas: '91 - 108', minimo: 5, nombre: 'TL - Trastorno límite de la personalidad' },
      { letra: 'L', preguntas: '109 - 120', minimo: 3, nombre: 'TA - Trastorno antisocial de la personalidad' }
    ];

    let html = `
      <!-- GRÁFICO SCID-II -->
      <div style="margin: 4px 0; padding: 4px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333; page-break-inside: avoid;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 3px 0; font-weight: bold;">ANÁLISIS: SCID-II</h4>
        <div style="position: relative; width: 100%; height: 320px;">
          <canvas id="chartReporte" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>

      <!-- TABLA DE ESCALAS -->
      <div style="margin: 4px 0; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333;">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 6px 0; font-weight: bold;">ESCALA DE TRASTORNOS DE LA PERSONALIDAD</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 7px;">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Escala</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Preguntas</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Mínimo</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-weight: bold;">Trastorno de la Personalidad</th>
          </tr>`;

    escalasInfo.forEach((escala, idx) => {
      const bgColor = idx % 2 === 0 ? '#f9f9f9' : 'white';
      html += `<tr style="background: ${bgColor};">
        <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${escala.letra}</td>
        <td style="border: 1px solid #999; padding: 3px; text-align: center;">${escala.preguntas}</td>
        <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${escala.minimo}</td>
        <td style="border: 1px solid #999; padding: 3px; text-align: left;">${escala.nombre}</td>
      </tr>`;
    });

    html += `</table>
        <p style="margin: 4px 0 0 0; font-size: 6px; color: #666; font-style: italic;">Nota: Se consideran presentes cuando se alcanza o supera el número mínimo de respuestas afirmativas para cada escala.</p>
      </div>
    `;

    return html;
  },

  /**
   * MMPI-2: Mostrar PDF del micrositio si está disponible
   */
  generarReporteMMPI2(prueba, subescalas) {
    // Si existe PDF guardado como base64, mostrarlo en un iframe SOLAMENTE
    let pdfBase64 = prueba.pdf_base64;

    // Si no está en prueba.pdf_base64, buscar en subescalas
    if (!pdfBase64 && subescalas) {
      if (typeof subescalas === 'string') {
        try {
          const parsed = JSON.parse(subescalas);
          pdfBase64 = parsed.pdf_base64;
        } catch (e) {}
      } else {
        pdfBase64 = subescalas.pdf_base64;
      }
    }

    if (pdfBase64) {
      try {
        // Convertir base64 a blob
        const binaryString = atob(pdfBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        return `
          <object
            data="${blobUrl}"
            type="application/pdf"
            style="width: 100%; height: 100vh; border: none;">
            <p>Tu navegador no puede mostrar PDFs. <a href="${blobUrl}" download="MMPI-2.pdf">Descargar PDF</a></p>
          </object>
        `;
      } catch (error) {
        console.error('Error al mostrar PDF MMPI-2:', error);
        return `<div style="padding: 20px; color: red;">Error al cargar PDF: ${error.message}</div>`;
      }
    }

    // Si no hay PDF, mostrar opción para abrir micrositio
    const data = typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || {};
    const tScores = Object.entries(data).map(([key, val]) => `${key}: ${val}`).join(', ');

    return `
      <div style="margin: 10px 0; padding: 15px; background: #e8f4f8; border-left: 4px solid #2c5aa0; border-radius: 3px; color: #333;">
        <p style="margin: 0 0 8px 0; font-size: 10px; font-weight: bold;">📋 MMPI-2 Forma Reestructurada (RF)</p>
        <p style="margin: 0; font-size: 9px;">T-Scores: ${tScores}</p>
        <p style="margin: 5px 0 0 0; font-size: 9px; font-style: italic;">Para ver el gráfico completo del micrositio, abre el test nuevamente.</p>
      </div>
    `;
  },

  /**
   * Generar reporte CUIDA con tabla de escalas y eneatipos
   */
  generarReporteCUIDA(prueba, subescalas) {
    // Usar subescalas.escalas si existe, sino usar prueba.data
    const rawData = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : subescalas || {};
    const datos = rawData.escalas || (typeof prueba.data === 'string' ? JSON.parse(prueba.data) : prueba.data || {});

    // Escalas primarias
    const escalas_prim = [
      'Al', 'Ap', 'As', 'At', 'Rp', 'Em', 'Ee', 'In', 'Fl', 'Rf', 'Sc', 'Tf', 'Ag', 'Dl'
    ];

    // Nombres de escalas y su interpretación
    const nombres = {
      'Al': 'Altruismo', 'Ap': 'Apertura', 'As': 'Asertividad', 'At': 'Autoestima',
      'Rp': 'C. resolver problemas', 'Em': 'Empatía', 'Ee': 'Equilibrio emocional', 'In': 'Independencia',
      'Fl': 'Flexibilidad', 'Rf': 'Reflexividad', 'Sc': 'Sociabilidad', 'Tf': 'Tolerancia frustración',
      'Ag': 'C. vínculos afectivos', 'Dl': 'C. resolución duelo',
      'Cre': 'Cuidado responsable', 'Caf': 'Cuidado afectivo', 'Sen': 'Sensibilidad', 'Agr': 'Agresividad'
    };

    const interpretaciones = {
      'bajo': 'Puntuación baja: Necesita desarrollo en esta área',
      'medio': 'Puntuación media: Competencia adecuada',
      'alto': 'Puntuación alta: Competencia consolidada'
    };

    const colorizar = (en) => {
      if (!en) return '#999';
      if (en <= 3) return '#0369a1'; // Bajo
      if (en <= 6) return '#065f46'; // Medio
      return '#92400e'; // Alto
    };

    const getNivelTexto = (en) => {
      if (!en) return '–';
      if (en <= 3) return 'Bajo';
      if (en <= 6) return 'Medio';
      return 'Alto';
    };

    // Datos del evaluador
    const evaluador = localStorage.getItem('nombre') || 'No especificado';
    const fecha = new Date(prueba.fecha || Date.now()).toLocaleDateString('es-ES');

    // Placeholder para gráfico (se renderiza después con renderGraficoCUIDA)
    const generarGraficoBarras = () => {
      return '<canvas id="chartCUIDA" style="max-width: 100%; height: 250px; display: block; margin: 10px 0; border: 1px solid #ddd; border-radius: 3px;"></canvas>';
    };

    let html = `
      <div style="margin: 10px 0; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 3px; color: #333;">
        <h4 style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; color: #111827;">📋 CUIDA - Evaluación de Cuidadores</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; font-size: 8px;">
          <div><strong>Evaluador:</strong> ${evaluador}</div>
          <div><strong>Fecha:</strong> ${fecha}</div>
        </div>

        <h5 style="margin: 10px 0 8px 0; font-size: 9px; font-weight: bold; color: #111827;">Perfil Gráfico de Escalas Primarias</h5>
        ${generarGraficoBarras()}

        <h5 style="margin: 10px 0 6px 0; font-size: 9px; font-weight: bold; color: #111827;">Escalas Primarias - Resultados Detallados</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 7.5px; margin-bottom: 10px;">
          <tr style="background: #e5eee8;">
            <th style="padding: 4px 6px; text-align: left; border: 1px solid #d1d5db;">Escala</th>
            <th style="padding: 4px 6px; text-align: center; border: 1px solid #d1d5db;">PD</th>
            <th style="padding: 4px 6px; text-align: center; border: 1px solid #d1d5db;">En</th>
            <th style="padding: 4px 6px; text-align: center; border: 1px solid #d1d5db;">Nivel</th>
          </tr>
    `;

    escalas_prim.forEach(esc => {
      const d = datos[esc];
      const pd = d?.pd !== null ? Math.round(d?.pd || 0) : '–';
      const en = d?.en || '–';
      const nivel = getNivelTexto(en);
      const color = colorizar(en);
      html += `
        <tr>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db;">${nombres[esc]}</td>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db; text-align: center;">${pd}</td>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db; text-align: center; font-weight: bold; color: ${color};">${en}</td>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db; text-align: center; font-size: 7px;">${nivel}</td>
        </tr>
      `;
    });

    html += `
        </table>

        <h5 style="margin: 10px 0 6px 0; font-size: 9px; font-weight: bold; color: #111827;">Escalas Secundarias (Factores)</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 7.5px; margin-bottom: 10px;">
          <tr style="background: #dcfce7;">
            <th style="padding: 4px 6px; text-align: left; border: 1px solid #d1d5db;">Factor</th>
            <th style="padding: 4px 6px; text-align: center; border: 1px solid #d1d5db;">En</th>
            <th style="padding: 4px 6px; text-align: center; border: 1px solid #d1d5db;">Nivel</th>
          </tr>
    `;

    ['Cre', 'Caf', 'Sen', 'Agr'].forEach(esc => {
      const d = datos[esc];
      const en = d?.en || '–';
      const nivel = getNivelTexto(en);
      const color = colorizar(en);
      html += `
        <tr>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db;">${nombres[esc]}</td>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db; text-align: center; font-weight: bold; color: ${color};">${en}</td>
          <td style="padding: 3px 6px; border: 1px solid #d1d5db; text-align: center; font-size: 7px;">${nivel}</td>
        </tr>
      `;
    });

    const invalidez = datos.Inv?.pd || 0;
    html += `
        </table>

        <h5 style="margin: 10px 0 6px 0; font-size: 9px; font-weight: bold; color: #111827;">Análisis de Validez</h5>
        <div style="padding: 8px; background: #fef3c7; border: 1px solid #fcd34d; border-radius: 3px; font-size: 8px;">
          <strong>Validez:</strong> ${invalidez === 0 ? 'Normal - Protocolo válido' : 'Revisar - Ítems inválidos: ' + invalidez}<br/>
          <strong>Items completados:</strong> 189/189 (100%)<br/>
          <strong>Fecha de aplicación:</strong> ${fecha}
        </div>

        <h5 style="margin: 10px 0 6px 0; font-size: 9px; font-weight: bold; color: #111827;">Informe Interpretativo</h5>
        <p style="margin: 0 0 6px 0; font-size: 8px; color: #4b5563; line-height: 1.4;">
          El perfil CUIDA evalúa 14 habilidades fundamentales de cuidador distribuidas en cuatro factores de segundo orden.
          Los eneatipos oscilan entre 1 (bajo) y 9 (alto), con media=5 y desviación típica=2.
        </p>

        <div style="margin: 6px 0; padding: 6px; background: #f3f4f6; border-radius: 3px; font-size: 8px;">
          <strong style="color: #111827;">Fortalezas identificadas:</strong><br/>`;

    // Enumerar fortalezas (escalas con En >= 7)
    const fortalezas = escalas_prim.filter(esc => datos[esc]?.en >= 7);
    if (fortalezas.length > 0) {
      html += fortalezas.map(esc => `• ${nombres[esc]}: Eneatipo ${datos[esc].en}`).join('<br/>');
    } else {
      html += 'Sin puntuaciones muy altas registradas.';
    }

    html += `<br/><br/><strong style="color: #111827;">Áreas de desarrollo:</strong><br/>`;

    // Enumerar áreas de desarrollo (escalas con En <= 3)
    const desarrollo = escalas_prim.filter(esc => datos[esc]?.en <= 3);
    if (desarrollo.length > 0) {
      html += desarrollo.map(esc => `• ${nombres[esc]}: Eneatipo ${datos[esc].en}`).join('<br/>');
    } else {
      html += 'Sin puntuaciones muy bajas registradas.';
    }

    html += `
        </div>

        <p style="margin: 6px 0 0 0; font-size: 8px; color: #4b5563; line-height: 1.4;">
          <strong>Recomendación:</strong> Las competencias con puntuaciones bajas pueden mejorarse mediante formación,
          práctica y retroalimentación. Se sugiere enfoque en aquellas áreas identificadas como de desarrollo.
        </p>
      </div>
    `;

    return html;
  },

  /**
   * Generar reporte ISRA con gráfico de perfil y tabla comparativa
   */
  generarReporteISRA(prueba, subescalas) {
    // Obtener totales desde subescalas (que vienen de la BD)
    const totalC = (subescalas?.C?.total) || (prueba.subescalas?.C?.total) || 0;
    const totalF = (subescalas?.F?.total) || (prueba.subescalas?.F?.total) || 0;
    const totalM = (subescalas?.M?.total) || (prueba.subescalas?.M?.total) || 0;
    const totalT = prueba.total || (totalC + totalF + totalM) || 0;

    // Determinar sexo del paciente
    const sexo = (this.pacienteActivo?.sexo || 'mujeres').toLowerCase().includes('hombre') ? 'varones' : 'mujeres';

    // Obtener centiles
    const centilC = interpretacion.isra.obtenerCentil(totalC, 'C', sexo);
    const centilF = interpretacion.isra.obtenerCentil(totalF, 'F', sexo);
    const centilM = interpretacion.isra.obtenerCentil(totalM, 'M', sexo);
    const centilT = interpretacion.isra.obtenerCentil(totalT, 'T', sexo);

    // Función para obtener interpretación según centil
    const obtenerInterpretacion = (centil) => {
      if (centil >= 99) return { texto: 'Extrema', color: 'color: #8B0000;' };
      if (centil >= 75) return { texto: 'Severa', color: 'color: #FF8C00;' };
      if (centil >= 25) return { texto: 'Normal', color: 'color: #228B22;' };
      return { texto: 'Sin ansiedad', color: 'color: #228B22;' };
    };

    const interpC = obtenerInterpretacion(centilC);
    const interpF = obtenerInterpretacion(centilF);
    const interpM = obtenerInterpretacion(centilM);
    const interpT = obtenerInterpretacion(centilT);

    let html = `
      <!-- GRÁFICO ISRA -->
      <div style="margin: 4px 0; padding: 4px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333; page-break-inside: avoid;" class="reporte-analisis">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 3px 0; font-weight: bold;">ANÁLISIS: ISRA (Perfil de Centiles)</h4>
        <div style="position: relative; width: 100%; height: 320px;">
          <canvas id="chartReporte" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>

      <!-- TABLA COMPARATIVA ISRA -->
      <div style="margin: 4px 0; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 3px; color: #333;">
        <h4 style="color: #333; font-size: 9px; margin: 0 0 6px 0; font-weight: bold;">DATOS COMPARATIVOS</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 7px;">
          <tr style="background: #2c5aa0; color: white;">
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-weight: bold;">Escala</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Valor</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Ref.</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">Centil</th>
            <th style="border: 1px solid #999; padding: 3px; text-align: left; font-weight: bold;">Estado</th>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="border: 1px solid #999; padding: 3px; font-weight: bold;">C (Cognitivo)</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">${totalC}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">71.78</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${centilC}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: left; ${interpC.color}">${interpC.texto}</td>
          </tr>
          <tr style="background: white;">
            <td style="border: 1px solid #999; padding: 3px; font-weight: bold;">F (Fisiológico)</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">${totalF}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">33.36</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${centilF}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: left; ${interpF.color}">${interpF.texto}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="border: 1px solid #999; padding: 3px; font-weight: bold;">M (Motor)</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">${totalM}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">49.84</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${centilM}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: left; ${interpM.color}">${interpM.texto}</td>
          </tr>
          <tr style="background: white; font-weight: bold;">
            <td style="border: 1px solid #999; padding: 3px; font-weight: bold;">TOTAL</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">${totalT}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center;">154.98</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: center; font-weight: bold;">${centilT}</td>
            <td style="border: 1px solid #999; padding: 3px; text-align: left; ${interpT.color}">${interpT.texto}</td>
          </tr>
        </table>
        <p style="margin: 4px 0 0 0; font-size: 6px; color: #666; font-style: italic;">Nota: Ref. = Media población normal. Centil indica posición respecto a población general.</p>
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

    if (prueba.tipo === 'SCID2') {
      const total = prueba.total || 0;
      const porcentajeSi = ((total / 119) * 100).toFixed(1);
      const estado = this.compararConReferencia(porcentajeSi, 30);
      filas += `<tr>
        <td style="border: 1px solid #ddd; padding: 3px; font-size: 8px;">Respuestas Afirmativas</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-weight: bold; font-size: 8px;">${total}/119</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 8px;">30%</td>
        <td style="border: 1px solid #ddd; padding: 3px; text-align: center; font-size: 7px; ${estado.color}">${porcentajeSi}%</td>
      </tr>`;
    } else if (prueba.tipo === 'SCL90R') {
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
    } else if (prueba.tipo === 'MMPI2' || prueba.tipo === 'MMPI') {
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
        <!-- VALIDACIÓN -->
        <div id="validacion-profesional-section" style="background: #f0f4f8; padding: 8px; margin-top: 15px; margin-bottom: 10px; border: 1px solid #2c5aa0; border-radius: 3px;">
          <h3 style="margin: 0 0 6px 0; color: #2c5aa0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #2c5aa0; padding-bottom: 4px; text-decoration: underline;">VALIDACIÓN</h3>

          <table style="width: 100%; font-size: 13px; border-collapse: collapse; line-height: 1.4; table-layout: fixed;">
            <tr>
              <td style="width: 30%; padding: 3px; color: #000; font-weight: bold; word-wrap: break-word;"><strong>Evaluador:</strong></td>
              <td style="padding: 3px; color: #000; word-wrap: break-word;">${nombre || '—'}</td>
              <td style="width: 20%; padding: 3px; color: #000; font-weight: bold; word-wrap: break-word;"><strong>Cédula:</strong></td>
              <td style="padding: 3px; color: #000; word-wrap: break-word;">${cedula || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; color: #000; font-weight: bold; word-wrap: break-word;"><strong>Especialidad:</strong></td>
              <td colspan="3" style="padding: 3px; color: #000; word-wrap: break-word;">${especialidad || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 3px; vertical-align: top; color: #000; font-weight: bold; word-wrap: break-word;"><strong>Diagnóstico:</strong></td>
              <td colspan="3" style="padding: 3px; font-size: 13px; color: #000; word-wrap: break-word; white-space: normal; max-height: none;">${diagnostico || '—'}</td>
            </tr>
          </table>

          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #ddd; text-align: center;">
            <p style="margin: 0; font-size: 9px; color: #666;">Validado</p>
            <p style="margin: 2px 0 0 0; font-size: 8px; color: #999;">El evaluador se responsabiliza del contenido de este reporte</p>
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
   * Calcular respuestas afirmativas por escala SCID-II (A-L)
   */
  calcularRespuestasPorEscalaSCID2(data) {
    const data_array = Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []);

    // Definir rangos de preguntas por escala (1-indexado en base de datos)
    const escalas = {
      'A': { rango: [0, 6], label: 'TPE', minimo: 4 },
      'B': { rango: [7, 14], label: 'TPD', minimo: 5 },
      'C': { rango: [15, 25], label: 'TOC', minimo: 5 },
      'D': { rango: [26, 34], label: 'PA', minimo: 5 },
      'E': { rango: [35, 47], label: 'AUT', minimo: 5 },
      'F': { rango: [48, 55], label: 'TPP', minimo: 4 },
      'G': { rango: [56, 63], label: 'TEZ', minimo: 5 },
      'H': { rango: [64, 68], label: 'TES', minimo: 4 },
      'I': { rango: [69, 78], label: 'TH', minimo: 4 },
      'J': { rango: [79, 89], label: 'TN', minimo: 6 },
      'K': { rango: [90, 107], label: 'TL', minimo: 5 },
      'L': { rango: [108, 119], label: 'TA', minimo: 3 }
    };

    const resultado = {};
    for (const [key, escala] of Object.entries(escalas)) {
      const [inicio, fin] = escala.rango;
      let count = 0;
      for (let i = inicio; i <= fin; i++) {
        if (data_array[i] === 1) count++;
      }
      resultado[key] = { count, minimo: escala.minimo, label: escala.label };
    }
    return resultado;
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

    const pageBreak = prueba.tipo === 'SCID2' ? '' : 'page-break-before: always;';
    let html = `
      <div style="${pageBreak} font-family: Arial, sans-serif; color: #333; line-height: 1.2; max-width: 21.59cm; margin: 0 auto; padding: 1.27cm;">
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
    // Mostrar botón "Descargar Reporte" nuevamente (por si estaba oculto por MMPI-2)
    const btnDescargar = document.getElementById('btn-descargar-reporte');
    if (btnDescargar) {
      btnDescargar.style.display = 'block';
    }
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
            <h3 style="margin-top: 0;">✓ VALIDACIÓN</h3>
            <p><strong>Evaluador:</strong> ${datosValidacion.nombre}</p>
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

      // PARA MMPI-2: Si existe PDF guardado como base64, descargarlo desde el blob
      if (this.pruebaActiva?.tipo === 'MMPI2' || this.pruebaActiva?.tipo === 'MMPI') {
        let pdfBase64 = this.pruebaActiva.pdf_base64;

        if (!pdfBase64 && this.pruebaActiva.subescalas) {
          let subescalas = this.pruebaActiva.subescalas;
          if (typeof subescalas === 'string') {
            try {
              subescalas = JSON.parse(subescalas);
            } catch (e) {}
          }
          pdfBase64 = subescalas?.pdf_base64;
        }

        if (pdfBase64) {
          // Convertir base64 a blob y descargar
          try {
            const binaryString = atob(pdfBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `MMPI-2_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            this.mostrarToast('✅ PDF descargado correctamente', 'success');
            return;
          } catch (error) {
            console.error('Error al descargar PDF MMPI-2:', error);
            this.mostrarToast('Error al descargar PDF', 'error');
            return;
          }
        }
      }

      // PARA CUIDA: Si existe PDF guardado como base64, descargarlo desde el blob
      if (this.pruebaActiva?.tipo === 'CUIDA') {
        let pdfBase64 = this.pruebaActiva.pdf_base64;

        if (!pdfBase64 && this.pruebaActiva.subescalas) {
          let subescalas = this.pruebaActiva.subescalas;
          if (typeof subescalas === 'string') {
            try {
              subescalas = JSON.parse(subescalas);
            } catch (e) {}
          }
          pdfBase64 = subescalas?.pdf_base64;
        }

        if (pdfBase64) {
          // Convertir base64 a blob y descargar
          try {
            const binaryString = atob(pdfBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `CUIDA_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            this.mostrarToast('✅ PDF descargado correctamente', 'success');
            return;
          } catch (error) {
            console.error('Error al descargar PDF CUIDA:', error);
            this.mostrarToast('Error al descargar PDF', 'error');
            return;
          }
        }
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

      // ESPERAR A QUE LOS GRÁFICOS ESTÉN COMPLETAMENTE RENDERIZADOS
      await new Promise(resolve => setTimeout(resolve, 500));

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
        // Convertir chart principal (altura según tipo: MMPI-2/SCID-II=320px, genérico=500px)
        const canvasOriginal = document.querySelector('canvas#chartReporte');
        const canvasClonado = elemento.querySelector('canvas#chartReporte');

        if (canvasOriginal && canvasClonado) {
          const imagenDataUrl = await this.capturarCanvasAltaResolucion(canvasOriginal);
          console.log('✓ Canvas principal convertido a alta resolución');

          // Detectar tipo de gráfico por el H4 anterior
          const h4Anterior = canvasClonado.parentNode?.previousElementSibling;
          const textoH4 = h4Anterior?.textContent || '';

          // Altura según tipo de gráfico
          let alturaGrafico = 400;  // Por defecto para genéricos
          if (textoH4.includes('MMPI-2') || textoH4.includes('SCID-II')) {
            alturaGrafico = 500;  // Más alto para gráficos de múltiples escalas
          }

          const img = document.createElement('img');
          img.src = imagenDataUrl;
          img.style.width = '100%';
          img.style.height = `${alturaGrafico}px`;  // Altura FIJA según tipo
          img.style.display = 'block';

          canvasClonado.parentNode.replaceChild(img, canvasClonado);
          console.log(`✓ Canvas principal reemplazado por imagen (${alturaGrafico}px)`);
        }

        // Convertir chart comparativo (PCL-R) - PATRÓN SCL-90R: altura 100%
        const canvasComparativoOriginal = document.querySelector('canvas#chartComparativoPCLR');
        const canvasComparativoClonado = elemento.querySelector('canvas#chartComparativoPCLR');

        if (canvasComparativoOriginal && canvasComparativoClonado) {
          const imagenComparativaUrl = await this.capturarCanvasAltaResolucion(canvasComparativoOriginal);
          console.log('✓ Canvas comparativo PCL-R convertido a alta resolución');

          const imgComparativa = document.createElement('img');
          imgComparativa.src = imagenComparativaUrl;
          imgComparativa.style.width = '100%';
          imgComparativa.style.height = '100%';  // ALTURA DINÁMICA
          imgComparativa.style.display = 'block';

          const containerHeight = canvasComparativoClonado.parentNode?.offsetHeight;
          canvasComparativoClonado.parentNode.replaceChild(imgComparativa, canvasComparativoClonado);
          console.log(`✓ Canvas comparativo reemplazado por imagen (${containerHeight}px)`);
        }

        // Convertir gráfico de perfil (Paciente vs Población Normal) - PATRÓN SCL-90R: altura 100%
        const canvasPerfilOriginal = document.getElementById('chartPerfilComparativo');
        const canvasPerfilClonado = elemento.getElementById('chartPerfilComparativo');

        if (canvasPerfilOriginal && canvasPerfilClonado) {
          const imagenPerfilUrl = await this.capturarCanvasAltaResolucion(canvasPerfilOriginal);
          console.log('✓ Canvas de perfil convertido a alta resolución');

          const imgPerfil = document.createElement('img');
          imgPerfil.src = imagenPerfilUrl;
          imgPerfil.style.width = '100%';
          imgPerfil.style.height = '100%';  // ALTURA DINÁMICA
          imgPerfil.style.display = 'block';

          const containerHeight = canvasPerfilClonado.parentNode?.offsetHeight;
          canvasPerfilClonado.parentNode.replaceChild(imgPerfil, canvasPerfilClonado);
          console.log(`✓ Canvas de perfil reemplazado por imagen (${containerHeight}px)`);
        } else {
          console.warn('Canvas de perfil no encontrado - original:', !!canvasPerfilOriginal, 'clonado:', !!canvasPerfilClonado);
        }

        // Convertir gráfico CUIDA - Barras de escalas primarias
        const canvasCUIDAsync = document.getElementById('chartCUIDA');
        const canvasCUIDClonado = elemento.getElementById('chartCUIDA');

        if (canvasCUIDAsync && canvasCUIDClonado) {
          const imagenCUIDUrl = await this.capturarCanvasAltaResolucion(canvasCUIDAsync);
          console.log('✓ Canvas CUIDA convertido a alta resolución');

          const imgCUIDA = document.createElement('img');
          imgCUIDA.src = imagenCUIDUrl;
          imgCUIDA.style.width = '100%';
          imgCUIDA.style.height = '250px';  // Altura fija para CUIDA
          imgCUIDA.style.display = 'block';
          imgCUIDA.style.border = '1px solid #ddd';
          imgCUIDA.style.borderRadius = '3px';
          imgCUIDA.style.margin = '10px 0';

          canvasCUIDClonado.parentNode.replaceChild(imgCUIDA, canvasCUIDClonado);
          console.log('✓ Canvas CUIDA reemplazado por imagen (250px)');
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

      // Verificar si hay datos reales
      const subescalas = typeof pruebaSCL.subescalas === 'string'
        ? JSON.parse(pruebaSCL.subescalas)
        : pruebaSCL.subescalas;

      const escalas = ['SOM', 'OBS', 'INT', 'DEP', 'ANS', 'HOS', 'FOB', 'PAR', 'PSI'];
      const tieneData = escalas.some(e => Number(subescalas[e]) > 0);

      if (!tieneData) {
        document.getElementById('dashboard-chart-section').style.display = 'none';
        return;
      }

      document.getElementById('dashboard-chart-section').style.display = 'block';
      document.getElementById('chart-title').textContent = `${paciente.nombre} · SCL-90-R`;
      document.getElementById('chart-subtitle').textContent = 'Comparativa contra norma poblacional';

      // Crear gráfica SVG simple
      const container = document.getElementById('dashboard-chart-container');
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
   * Abrir reporte de una prueba específica
   */
  async abrirReportePrueba(pruebaId) {
    try {
      const response = await fetch(`/api/pruebas/${pruebaId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });

      if (!response.ok) {
        this.mostrarToast('Error al cargar el reporte', 'error');
        return;
      }

      const prueba = await response.json();
      await this.mostrarReporteDetallado(prueba, this.pacienteActivo);
    } catch (error) {
      console.error('Error al abrir reporte:', error);
      this.mostrarToast('Error al cargar el reporte', 'error');
    }
  },

  /**
   * Generar interpretación basada en el tipo de test y puntuación
   */
  generarInterpretacion(tipoTest, total) {
    try {
      // MMPI-2 no tiene interpretación simple (se interpreta por escalas)
      if (tipoTest === 'MMPI2' || tipoTest === 'MMPI') {
        return null;
      }

      // Mapeo de tipos de test a métodos de interpretación
      const mapeoInterpretacion = {
        'HAMILTON': 'hamD17',
        'SCL90R': 'scl90R',
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
            <button class="btn-ver-reporte" data-prueba-id="${prueba.id}" onclick="app.abrirReportePrueba(this.getAttribute('data-prueba-id'))">
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
   * Modal: Crear Paciente
   */
  mostrarModalCrearPaciente() {
    // Limpiar formulario
    document.getElementById('crear-nombre').value = '';
    document.getElementById('crear-edad').value = '';
    document.getElementById('crear-sexo').value = '';
    document.getElementById('crear-email').value = '';
    document.getElementById('crear-telefono').value = '';
    document.getElementById('crear-notas').value = '';

    // Mostrar modal (agregar clase "active")
    const modal = document.getElementById('modal-crear-paciente');
    if (modal) {
      modal.classList.add('active');
      // Focus en nombre
      setTimeout(() => document.getElementById('crear-nombre').focus(), 300);
    }
  },

  cerrarModalCrearPaciente() {
    const modal = document.getElementById('modal-crear-paciente');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  async guardarNuevoPaciente() {
    // Función async para manejar la creación de paciente
    const nombre = document.getElementById('crear-nombre').value.trim();
    const edad = parseInt(document.getElementById('crear-edad').value) || null;
    const sexo = document.getElementById('crear-sexo').value;
    const email = document.getElementById('crear-email').value.trim();
    const telefono = document.getElementById('crear-telefono').value.trim();
    const notas = document.getElementById('crear-notas').value.trim();

    // Validaciones
    if (!nombre) {
      this.mostrarToast('❌ El nombre es requerido', 'error');
      document.getElementById('crear-nombre').focus();
      return;
    }

    if (!edad || edad < 0 || edad > 150) {
      this.mostrarToast('❌ Ingresa una edad válida (0-150)', 'error');
      document.getElementById('crear-edad').focus();
      return;
    }

    if (!sexo) {
      this.mostrarToast('❌ Selecciona un sexo', 'error');
      document.getElementById('crear-sexo').focus();
      return;
    }

    try {
      // Llamar API para crear paciente
      const nuevoPaciente = await api.crearPaciente({
        nombre,
        edad,
        sexo,
        email: email || null,
        telefono: telefono || null,
        observaciones: notas || null
      });

      this.mostrarToast(`✅ Paciente "${nombre}" creado correctamente`, 'success');

      // Cerrar modal
      this.cerrarModalCrearPaciente();

      // Recargar expedientes
      this.loadExpedientes();

      // Seleccionar el nuevo paciente automáticamente
      if (nuevoPaciente && nuevoPaciente.id) {
        this.pacienteActivo = nuevoPaciente;
        this.mostrarToast(`Paciente ${nombre} seleccionado`, 'info');
      }

    } catch (error) {
      console.error('Error al crear paciente:', error);
      this.mostrarToast(`❌ Error: ${error.message}`, 'error');
    }
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
