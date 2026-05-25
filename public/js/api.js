/**
 * Cliente HTTP para comunicarse con la API del servidor con autenticación
 */

const api = {
  baseURL: '/api',
  tokenKey: 'auth_token',

  /**
   * Obtener token JWT del localStorage
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  },

  /**
   * Realizar una solicitud HTTP genérica con autenticación
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const token = this.getToken();

      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      // Agregar token si está disponible (para rutas protegidas)
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, config);

      // Si es 401, token expiró - redirigir a login
      if (response.status === 401) {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('tenant_id');
        localStorage.removeItem('auth_usuario');
        window.location.href = '/auth.html';
        return null;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Logout - eliminar token y redirigir
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('auth_usuario');
    window.location.href = '/auth.html';
  },

  // ===== PACIENTES =====

  /**
   * Obtener lista de pacientes
   */
  async getPacientes(query = '') {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/pacientes${params}`);
  },

  /**
   * Obtener un paciente por ID
   */
  async getPaciente(id) {
    return this.request(`/pacientes/${id}`);
  },

  /**
   * Crear nuevo paciente
   */
  async crearPaciente(datos) {
    return this.request('/pacientes', {
      method: 'POST',
      body: datos
    });
  },

  /**
   * Actualizar paciente
   */
  async actualizarPaciente(id, datos) {
    return this.request(`/pacientes/${id}`, {
      method: 'PUT',
      body: datos
    });
  },

  /**
   * Cambiar status del paciente (activo/standby)
   */
  async toggleStatusPaciente(id) {
    return this.request(`/pacientes/${id}/status`, {
      method: 'PATCH'
    });
  },

  /**
   * Eliminar paciente y todos sus tests
   */
  async deletePaciente(id) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Obtener pruebas de un paciente
   */
  async getPruebasPaciente(pacienteId) {
    return this.request(`/pacientes/${pacienteId}/pruebas`);
  },

  // ===== PRUEBAS =====

  /**
   * Guardar una prueba
   */
  async guardarPrueba(pacienteId, tipo, data, total, subescalas = {}) {
    return this.request('/pruebas', {
      method: 'POST',
      body: {
        paciente_id: pacienteId,
        tipo,
        data,
        total,
        subescalas
      }
    });
  },

  /**
   * Obtener una prueba por ID
   */
  async getPrueba(id) {
    return this.request(`/pruebas/${id}`);
  },

  /**
   * Obtener historial comparativo de un tipo de prueba
   */
  async getPruebasComparativo(pacienteId, tipo) {
    return this.request(`/pruebas/comparativo/${pacienteId}/${tipo}`);
  },

  /**
   * Obtener todas las pruebas de un paciente
   */
  async getPruebasDelPaciente(pacienteId) {
    try {
      return this.request(`/pacientes/${pacienteId}/pruebas`);
    } catch (error) {
      console.warn(`No hay pruebas para paciente ${pacienteId}`);
      return [];
    }
  },

  // ===== NORMAS =====

  /**
   * Obtener todas las normas de un test
   */
  async getNormasTest(tipoTest) {
    try {
      return await this.request(`/pruebas/normas/${tipoTest}`);
    } catch (error) {
      console.warn(`No hay normas disponibles para ${tipoTest}`);
      return [];
    }
  },

  /**
   * Obtener normas de población general para un test
   */
  async getNormasPoblacion(tipoTest) {
    try {
      return await this.request(`/pruebas/normas-poblacion/${tipoTest}`);
    } catch (error) {
      console.warn(`No hay normas de población disponibles para ${tipoTest}`);
      return [];
    }
  },

  /**
   * Comprobar salud del servidor
   */
  async health() {
    return this.request('/health');
  }
};
