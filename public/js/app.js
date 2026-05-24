/**
 * Controlador Principal de la Aplicación
 */

const app = {
  pacienteActivo: null,
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
    await this.loadExpedientes();

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

    // Si es una página de test, renderizar el test
    if (this.pageTestMap[pageId]) {
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
      this.showPage('expedientes');
      await this.loadExpedientes();
    } catch (error) {
      this.mostrarToast(`Error al crear paciente: ${error.message}`, 'error');
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
      const resultado = test.calcular();

      await api.guardarPrueba(
        this.pacienteActivo.id,
        testType,
        resultado.data || [],
        resultado.total,
        resultado
      );

      this.mostrarToast(`✓ ${test.nombre} guardado correctamente`, 'success');
      this.mostrarReporte(resultado, testType);
      await this.loadExpedientes();
    } catch (error) {
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
      html += `
        <div class="reporte-seccion">
          <div class="reporte-titulo">Interpretación</div>
          <p class="reporte-contenido">${resultado.interpretacion.label}</p>
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
  mostrarReporteDetallado(prueba, paciente) {
    const modal = document.getElementById('modal-reporte');
    const contenido = document.getElementById('reporte-contenido');

    if (!modal || !contenido) return;

    // Parsear datos si están en JSON
    const subescalas = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : prueba.subescalas;

    let html = `
      <div class="reporte" style="font-family: Arial, sans-serif; color: #333;">
        <!-- ENCABEZADO PROFESIONAL -->
        <div style="border-bottom: 3px solid #2c5aa0; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #2c5aa0; margin: 0; font-size: 20px;">REPORTE DE EVALUACIÓN CLÍNICA PSICOLÓGICA</h1>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">Evaluación Clínica - Sistema de Evaluación Psicológica</p>
        </div>

        <!-- DATOS DEL PACIENTE -->
        <div style="background: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #2c5aa0; font-size: 14px;">DATOS DEL PACIENTE</h3>
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="width: 30%; padding: 5px;"><strong>Nombre:</strong></td>
              <td style="padding: 5px;">${paciente ? paciente.nombre : 'N/A'}</td>
              <td style="width: 30%; padding: 5px;"><strong>Edad:</strong></td>
              <td style="padding: 5px;">${paciente && paciente.edad ? paciente.edad + ' años' : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Sexo:</strong></td>
              <td style="padding: 5px;">${paciente && paciente.sexo ? paciente.sexo : 'N/A'}</td>
              <td style="padding: 5px;"><strong>Estado Civil:</strong></td>
              <td style="padding: 5px;">${paciente && paciente.estado_civil ? paciente.estado_civil : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Fecha Evaluación:</strong></td>
              <td colspan="3" style="padding: 5px;">${new Date(prueba.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <!-- PRUEBA REALIZADA -->
        <div style="background: #f0f4f8; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #2c5aa0; font-size: 14px;">PRUEBA APLICADA</h3>
          <p style="margin: 0; font-size: 13px;"><strong>${prueba.tipo}</strong></p>
        </div>

        <!-- RESULTADOS -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2c5aa0; font-size: 14px; margin-top: 0;">RESULTADOS</h3>

          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; border: 3px solid #2c5aa0; border-radius: 8px; padding: 20px 40px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Puntuación Total</div>
              <div style="font-size: 36px; color: #2c5aa0; font-weight: bold;">${prueba.total || '—'}</div>
            </div>
          </div>

          ${subescalas && typeof subescalas === 'object' && Object.keys(subescalas).length > 0 ? `
          <div style="margin-top: 20px;">
            <h4 style="color: #333; font-size: 13px; margin-bottom: 10px;">Detalles por Escala</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr style="background: #2c5aa0; color: white;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Escala</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Valor</th>
              </tr>
              ${Object.entries(subescalas)
                .filter(([key]) => !['interpretacion', 'label', 'color'].includes(key.toLowerCase()))
                .map(([key, value]) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;">${key}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold;">
                    ${typeof value === 'object' ? (value.valor || value.total || '—') : value}
                  </td>
                </tr>
              `).join('')}
            </table>
          </div>
          ` : ''}
        </div>

        <!-- INTERPRETACIÓN -->
        ${subescalas && subescalas.interpretacion ? `
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2c5aa0; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #2c5aa0; font-size: 14px;">INTERPRETACIÓN CLÍNICA</h3>
          <p style="margin: 0; font-size: 13px; line-height: 1.6;">
            ${subescalas.interpretacion.label || subescalas.interpretacion}
          </p>
        </div>
        ` : ''}

        <!-- FOOTER -->
        <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; font-size: 11px; color: #999; text-align: center;">
          <p style="margin: 0;">Este documento es un reporte de evaluación psicológica generado por el sistema de Evaluación Clínica.</p>
          <p style="margin: 5px 0 0 0;">Fecha de generación: ${new Date().toLocaleDateString('es-CO')} a las ${new Date().toLocaleTimeString('es-CO')}</p>
        </div>
      </div>
    `;

    contenido.innerHTML = html;
    modal.classList.add('active');
  },

  /**
   * Cerrar modal
   */
  cerrarModal() {
    document.getElementById('modal-reporte')?.classList.remove('active');
  },

  /**
   * Descargar PDF
   */
  async descargarPDF() {
    try {
      if (!this.pacienteActivo) {
        this.mostrarToast('No hay paciente seleccionado', 'error');
        return;
      }

      // Obtener los datos que están en el modal
      const contenido = document.getElementById('reporte-contenido');
      if (!contenido || !contenido.innerHTML) {
        this.mostrarToast('No hay reporte para descargar', 'error');
        return;
      }

      this.mostrarToast('Generando PDF...', 'info');

      // Esperar a que html2pdf esté disponible
      if (typeof window.html2pdf === 'undefined') {
        throw new Error('html2pdf no está disponible');
      }

      const elemento = contenido.cloneNode(true);

      const config = {
        margin: [10, 10, 10, 10],
        filename: `Reporte_${this.pacienteActivo.nombre}_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(config).from(elemento).save();
      this.mostrarToast('✓ PDF descargado correctamente', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Cargar expedientes
   */
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
  selectPaciente(pacienteId) {
    const paciente = JSON.parse(localStorage.getItem(`paciente_${pacienteId}`));
    if (paciente) {
      this.pacienteActivo = paciente;
      localStorage.setItem('pacienteActivo', JSON.stringify(paciente));
      this.mostrarToast(`✓ ${paciente.nombre} seleccionado`, 'success');
      this.showPage('scl90r'); // Ir al primer test
    }
  }
};

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(error => {
    console.error('Error al inicializar:', error);
  });
});
