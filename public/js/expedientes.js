/**
 * Gestión de Expedientes Clínicos
 */

const expedientes = {
  /**
   * Renderizar grid de expedientes
   */
  async renderizar(pacientes) {
    const grid = document.getElementById('expedientes-grid');
    if (!grid) return;

    if (pacientes.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
          <p style="color: var(--color-text-muted); font-size: 14px;">
            No hay expedientes. <a href="#" onclick="app.showPage('nuevo'); return false;" style="color: var(--color-primary); text-decoration: underline;">Crear nuevo</a>
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = pacientes.map(paciente => this.crearTarjeta(paciente)).join('');

    // Agregar event listeners
    grid.querySelectorAll('.expediente-card').forEach(card => {
      card.addEventListener('click', () => {
        const pacienteId = card.dataset.id;
        this.seleccionarPaciente(pacienteId);
      });
    });

    // Botones de acción
    grid.querySelectorAll('.btn-icon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pacienteId = btn.dataset.id;
        const accion = btn.dataset.accion;

        if (accion === 'editar') {
          this.editarPaciente(pacienteId);
        } else if (accion === 'toggle') {
          this.toggleStatus(pacienteId);
        }
      });
    });

    // Cargar pruebas para cada paciente
    for (const paciente of pacientes) {
      this.cargarPruebasPaciente(paciente.id);
    }
  },

  /**
   * Cargar pruebas de un paciente en su tarjeta
   */
  async cargarPruebasPaciente(pacienteId) {
    try {
      const pruebas = await api.getPruebasPaciente(pacienteId);
      const card = document.querySelector(`[data-id="${pacienteId}"]`);
      if (!card) return;

      const testContainer = card.querySelector('.expediente-tests');
      if (!testContainer) return;

      if (pruebas.length === 0) {
        testContainer.innerHTML = '<span style="font-size: 12px; color: var(--color-text-muted);">Sin evaluaciones</span>';
        return;
      }

      const testsByType = {};
      pruebas.forEach(p => {
        if (!testsByType[p.tipo]) testsByType[p.tipo] = [];
        testsByType[p.tipo].push(p);
      });

      testContainer.innerHTML = Object.entries(testsByType)
        .map(([tipo, items]) => `<span class="test-badge" data-test-type="${tipo}" data-paciente-id="${pacienteId}" style="cursor: pointer;">${tipo} (${items.length})</span>`)
        .join('');

      // Event listeners para ver resultados
      testContainer.querySelectorAll('.test-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          const testType = badge.dataset.testType;
          const pId = badge.dataset.pacienteId;
          this.verResultadosPrueba(pId, testType);
        });
      });
    } catch (error) {
      console.error(`Error cargando pruebas del paciente ${pacienteId}:`, error);
    }
  },

  /**
   * Ver resultados de una prueba guardada
   */
  async verResultadosPrueba(pacienteId, tipoTest) {
    try {
      const paciente = await api.getPaciente(pacienteId);
      const pruebas = await api.getPruebasPaciente(pacienteId);
      const prueba = pruebas.find(p => p.tipo === tipoTest);

      if (!prueba) {
        app.mostrarToast('Evaluación no encontrada', 'error');
        return;
      }

      // Mostrar reporte con resultados completos y datos del paciente
      app.mostrarReporteDetallado(prueba, paciente);
    } catch (error) {
      app.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Crear tarjeta de expediente
   */
  crearTarjeta(paciente) {
    const edad = paciente.edad ? `${paciente.edad} años` : 'Sin especificar';
    const sexo = paciente.sexo || '-';
    const estadoClass = paciente.status === 'standby' ? 'is-standby' : '';

    return `
      <div class="expediente-card ${estadoClass}" data-id="${paciente.id}">
        <div class="expediente-header">
          <div>
            <div class="expediente-nombre">📋 ${this.escape(paciente.nombre)}</div>
            <div class="expediente-info">${edad} • ${sexo}</div>
          </div>
          <div class="expediente-actions">
            <button class="btn-icon" data-id="${paciente.id}" data-accion="editar" title="Editar">
              ✏️
            </button>
            <button class="btn-icon" data-id="${paciente.id}" data-accion="toggle" title="${paciente.status === 'standby' ? 'Reactivar' : 'Pausar'}">
              ${paciente.status === 'standby' ? '▶️' : '⏸️'}
            </button>
          </div>
        </div>
        <div class="expediente-tests">
          <!-- Se llena con pruebas si están disponibles -->
        </div>
      </div>
    `;
  },

  /**
   * Seleccionar paciente y navegar
   */
  async seleccionarPaciente(pacienteId) {
    try {
      const paciente = await api.getPaciente(pacienteId);
      app.pacienteActivo = paciente;
      localStorage.setItem('pacienteActivo', JSON.stringify(paciente));
      app.mostrarToast(`✓ ${paciente.nombre} seleccionado`, 'success');
      app.showPage('scl90r');
    } catch (error) {
      app.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Editar paciente
   */
  async editarPaciente(pacienteId) {
    try {
      const paciente = await api.getPaciente(pacienteId);
      document.getElementById('f-nombre').value = paciente.nombre;
      document.getElementById('f-edad').value = paciente.edad || '';
      document.getElementById('f-sexo').value = paciente.sexo || '';
      document.getElementById('f-civil').value = paciente.estado_civil || '';
      document.getElementById('f-meds').value = paciente.medicamentos || '';
      document.getElementById('f-obs').value = paciente.observaciones || '';

      app.pacienteActivo = paciente;
      app.showPage('nuevo');
      app.mostrarToast('⚠️ Funcionalidad de edición aún en desarrollo', 'warning');
    } catch (error) {
      app.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Toggle status del paciente
   */
  async toggleStatus(pacienteId) {
    try {
      await api.toggleStatusPaciente(pacienteId);
      app.mostrarToast('✓ Status actualizado', 'success');
      await app.loadExpedientes();
    } catch (error) {
      app.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Escapar HTML
   */
  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
