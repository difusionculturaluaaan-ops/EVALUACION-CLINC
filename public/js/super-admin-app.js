const superAdminApp = {
  async login(event) {
    event.preventDefault();
    try {
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;

      const data = await superAdminApi.login(email, password);
      document.getElementById('admin-nombre').textContent = data.nombre;

      document.getElementById('login-page').style.display = 'none';
      document.getElementById('admin-panel').style.display = 'flex';

      this.loadDashboard();
    } catch (error) {
      document.getElementById('login-error').textContent = error.message;
      document.getElementById('login-error').style.display = 'block';
    }
  },

  async loadDashboard() {
    try {
      const data = await superAdminApi.getDashboard();
      document.getElementById('stat-tenants-activos').textContent = data.tenants_activos || 0;
      document.getElementById('stat-tenants-total').textContent = data.total_tenants || 0;
      document.getElementById('stat-psicologos').textContent = data.total_psicologos || 0;
      document.getElementById('stat-pacientes').textContent = data.total_pacientes || 0;
    } catch (error) {
      console.error(error);
      alert('Error al cargar dashboard: ' + error.message);
    }
  },

  async loadTenants() {
    try {
      const tenants = await superAdminApi.getTenants();
      const tbody = document.querySelector('#tenants-table tbody');
      tbody.innerHTML = tenants.map(t => `
        <tr>
          <td>${t.nombre}</td>
          <td>${t.email_contacto || 'N/A'}</td>
          <td>
            <select onchange="superAdminApp.changeTenantStatus('${t.id}', this.value)">
              <option value="activo" ${t.estado === 'activo' ? 'selected' : ''}>Activo</option>
              <option value="suspendido" ${t.estado === 'suspendido' ? 'selected' : ''}>Suspendido</option>
              <option value="cancelado" ${t.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
          </td>
          <td>${new Date(t.fecha_creacion).toLocaleDateString('es-CO')}</td>
          <td>${t.psicologos || 0}</td>
          <td>${t.pacientes || 0}</td>
          <td>
            <button class="btn-small" onclick="superAdminApp.deleteTenant('${t.id}', '${t.nombre}')">Eliminar</button>
          </td>
        </tr>
      `).join('');
    } catch (error) {
      console.error(error);
      alert('Error al cargar tenants: ' + error.message);
    }
  },

  showCreateTenant() {
    document.getElementById('create-tenant-modal').style.display = 'block';
  },

  async createTenant(event) {
    event.preventDefault();
    try {
      const nombre = document.getElementById('tenant-nombre').value;
      const slug = document.getElementById('tenant-slug').value;
      const email_contacto = document.getElementById('tenant-email').value;

      if (!nombre || !slug) {
        alert('Nombre y slug son requeridos');
        return;
      }

      await superAdminApi.createTenant({
        nombre,
        slug,
        email_contacto: email_contacto || null
      });

      document.getElementById('create-tenant-modal').style.display = 'none';
      document.getElementById('tenant-nombre').value = '';
      document.getElementById('tenant-slug').value = '';
      document.getElementById('tenant-email').value = '';

      this.loadTenants();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  },

  async changeTenantStatus(id, estado) {
    try {
      await superAdminApi.editTenant(id, { estado });
      this.loadTenants();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  },

  async deleteTenant(id, nombre) {
    if (!confirm(`¿Confirmar eliminación de "${nombre}"?`)) return;

    try {
      await superAdminApi.deleteTenant(id);
      this.loadTenants();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  },

  async loadAuditLog() {
    try {
      const logs = await superAdminApi.getAuditLog();
      const tbody = document.querySelector('#audit-table tbody');
      tbody.innerHTML = logs.map(l => `
        <tr>
          <td>${new Date(l.timestamp).toLocaleString('es-CO')}</td>
          <td>${l.accion}</td>
          <td>${l.tenant_id || '-'}</td>
          <td><small>${l.detalles || '-'}</small></td>
        </tr>
      `).join('');
    } catch (error) {
      console.error(error);
      alert('Error al cargar auditoría: ' + error.message);
    }
  },

  logout() {
    localStorage.removeItem('super-admin-token');
    location.reload();
  }
};

// Setup navigation and initialization
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const pageId = `page-${e.target.dataset.page}`;
    document.getElementById(pageId).classList.add('active');

    if (e.target.dataset.page === 'tenants') superAdminApp.loadTenants();
    if (e.target.dataset.page === 'audit') superAdminApp.loadAuditLog();
  });
});

// Check if token exists on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('super-admin-token');
  if (token) {
    superAdminApi.token = token;
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';
    // Try to load dashboard, if token is invalid, logout
    superAdminApp.loadDashboard().catch(() => {
      superAdminApp.logout();
    });
  }
});

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('create-tenant-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
