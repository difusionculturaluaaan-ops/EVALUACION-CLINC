/**
 * AuthManager - Gestión de autenticación multitenant
 * Maneja login, registro, tokens y sesiones
 */

class AuthManager {
  constructor() {
    this.baseURL = '/api';
    this.tokenKey = 'auth_token';
    this.tenantKey = 'tenant_id';
    this.usuarioKey = 'auth_usuario';

    this.setupEventListeners();
    this.checkLoggedIn();
  }

  // ==================== Setup ====================

  setupEventListeners() {
    // Forms
    document.getElementById('clinicaForm')?.addEventListener('submit', e => this.handleClinicaLogin(e));
    document.getElementById('adminForm')?.addEventListener('submit', e => this.handleAdminLogin(e));
  }

  switchTab(tab) {
    // Actualizar tabs activos
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Actualizar forms activos
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(tab + 'Form')?.classList.add('active');

    // Limpiar errores
    this.clearErrors();
  }

  // ==================== Autenticación ====================

  async handleClinicaLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;

    try {
      const email = document.getElementById('clinicaEmail').value.trim();
      const password = document.getElementById('clinicaPassword').value;

      if (!email || !password) {
        throw new Error('Email y contraseña requeridos');
      }

      // Mostrar cargando
      btn.disabled = true;
      btnText.innerHTML = '<span class="loading"></span>Autenticando...';

      // Hacer request
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en login');
      }

      // Guardar datos
      this.setAuthData(data.token, data.tenant_id, data.usuario);

      // Notificar y redirigir
      notifications.success(`¡Bienvenido ${data.usuario.nombre}!`);
      console.log('✓ Login exitoso:', data.usuario.nombre);
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 500);

    } catch (error) {
      notifications.error(error.message);
      document.getElementById('clinicaError').textContent = error.message;
      document.getElementById('clinicaError').classList.add('show');
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;

    try {
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;

      if (!email || !password) {
        throw new Error('Email y contraseña requeridos');
      }

      // Mostrar cargando
      btn.disabled = true;
      btnText.innerHTML = '<span class="loading"></span>Autenticando...';

      // Hacer request a endpoint de super admin
      const response = await fetch(`${this.baseURL}/super-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Guardar datos de super admin
      localStorage.setItem('super-admin-token', data.token);
      localStorage.setItem('super-admin-usuario', data.usuario?.nombre || email);

      // Notificar y redirigir
      notifications.success(`¡Bienvenido Admin!`);
      console.log('✓ Login super admin exitoso');
      setTimeout(() => {
        window.location.href = '/admin-simple.html';
      }, 500);

    } catch (error) {
      notifications.error(error.message);
      document.getElementById('adminError').textContent = error.message;
      document.getElementById('adminError').classList.add('show');
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  }

  async handleRegistro(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    const btnText = btn.querySelector('span');
    const originalText = btnText.textContent;

    try {
      const nombre_clinica = document.getElementById('clinicaName').value.trim();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;
      const nombre_admin = document.getElementById('adminName').value.trim();

      // Validaciones
      if (!nombre_clinica) throw new Error('Nombre de clínica requerido');
      if (!email) throw new Error('Email requerido');
      if (password.length < 6) throw new Error('Contraseña mínimo 6 caracteres');
      if (!nombre_admin) throw new Error('Nombre del admin requerido');

      // Mostrar cargando
      btn.disabled = true;
      btnText.innerHTML = '<span class="loading"></span>Creando clínica...';

      // Hacer request
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_clinica,
          email,
          password,
          nombre_admin
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear clínica');
      }

      // Guardar datos
      this.setAuthData(data.token, data.tenant_id, data.usuario);

      // Notificar y redirigir
      notifications.success(`¡Clínica creada! Bienvenido ${data.usuario.nombre}`);
      console.log('✓ Clínica creada exitosamente:', data.usuario.nombre);
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 500);

    } catch (error) {
      notifications.error(error.message);
      btn.disabled = false;
      btnText.textContent = originalText;
    }
  }

  // ==================== Almacenamiento ====================

  setAuthData(token, tenantId, usuario) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tenantKey, tenantId);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getTenantId() {
    return localStorage.getItem(this.tenantKey);
  }

  getUsuario() {
    const data = localStorage.getItem(this.usuarioKey);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn() {
    return !!this.getToken() && !!this.getTenantId();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tenantKey);
    localStorage.removeItem(this.usuarioKey);
    window.location.href = '/auth.html';
  }

  // ==================== Validaciones ====================

  checkLoggedIn() {
    const isAuthPage = window.location.pathname.includes('auth.html');
    const isLoggedIn = this.isLoggedIn();

    if (isLoggedIn && isAuthPage) {
      // Ya autenticado, redirigir a app
      window.location.href = '/index.html';
    } else if (!isLoggedIn && !isAuthPage) {
      // No autenticado, redirigir a login
      window.location.href = '/auth.html';
    }
  }

  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }

  // ==================== UI Helpers ====================

  showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
  }
}

// Función global para cambiar pestañas
function switchTab(tab) {
  if (window.authManager) {
    window.authManager.switchTab(tab);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});
