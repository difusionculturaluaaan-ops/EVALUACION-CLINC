/**
 * Tenant Branding - Logo Injection para PDFs
 * Uso: Incluir en todos los micrositios que generen PDFs
 *
 * Ejemplo:
 *   <script src="/js/tenant-branding.js"></script>
 *   <div id="pdf-logo-header">...</div>
 */

const TenantBranding = {
  /**
   * Inicializar branding del tenant
   */
  init() {
    this.loadTenantLogo();
  },

  /**
   * Cargar logo del tenant desde localStorage o API
   */
  loadTenantLogo() {
    // Intentar cargar de localStorage primero
    let logoUrl = localStorage.getItem('tenant_logo_url');

    if (!logoUrl) {
      // Si no está en localStorage, intentar obtener de API
      const tenantId = localStorage.getItem('tenant_id');
      if (tenantId) {
        fetch(`/api/tenants/${tenantId}`)
          .then(r => r.json())
          .then(tenant => {
            if (tenant.logo_url) {
              localStorage.setItem('tenant_logo_url', tenant.logo_url);
              this.applyLogo(tenant.logo_url);
            }
          })
          .catch(e => console.log('Logo no disponible'));
      }
    } else {
      this.applyLogo(logoUrl);
    }
  },

  /**
   * Aplicar logo a elemento pdf-logo-header
   */
  applyLogo(logoUrl) {
    const logoImg = document.getElementById('pdf-logo-img');
    if (logoImg) {
      logoImg.src = logoUrl;
      logoImg.onerror = () => {
        console.warn('No se pudo cargar logo:', logoUrl);
        document.getElementById('pdf-logo-header').style.display = 'none';
      };
    }
  },

  /**
   * Mostrar logo antes de generar PDF
   */
  showLogoForPDF() {
    const logoUrl = localStorage.getItem('tenant_logo_url');
    if (logoUrl) {
      const logoHeader = document.getElementById('pdf-logo-header');
      const logoImg = document.getElementById('pdf-logo-img');
      if (logoHeader && logoImg) {
        logoImg.src = logoUrl;
        logoHeader.style.display = 'block';
        return true;
      }
    }
    return false;
  },

  /**
   * Ocultar logo después de generar PDF (no afecta pantalla)
   */
  hideLogoAfterPDF() {
    const logoHeader = document.getElementById('pdf-logo-header');
    if (logoHeader) {
      logoHeader.style.display = 'none';
    }
  }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TenantBranding.init());
} else {
  TenantBranding.init();
}
