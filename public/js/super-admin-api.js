const superAdminApi = {
  baseURL: '/api/super-admin',
  token: null,

  async login(email, password) {
    const res = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }
    const data = await res.json();
    this.token = data.token;
    localStorage.setItem('super-admin-token', data.token);
    return data;
  },

  async getDashboard() {
    return this.fetch(`${this.baseURL}/dashboard`);
  },

  async getTenants() {
    return this.fetch(`${this.baseURL}/tenants`);
  },

  async createTenant(data) {
    return this.fetch(`${this.baseURL}/tenants`, {
      method: 'POST',
      body: data
    });
  },

  async editTenant(id, data) {
    return this.fetch(`${this.baseURL}/tenants/${id}`, {
      method: 'PATCH',
      body: data
    });
  },

  async deleteTenant(id) {
    return this.fetch(`${this.baseURL}/tenants/${id}`, {
      method: 'DELETE'
    });
  },

  async getAuditLog() {
    return this.fetch(`${this.baseURL}/audit-log`);
  },

  async fetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Error en la solicitud');
    }
    return res.json();
  }
};
