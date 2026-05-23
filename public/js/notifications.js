/**
 * Sistema de notificaciones Toast
 * Notificaciones elegantes, accesibles, con auto-dismiss
 */

class NotificationSystem {
  constructor() {
    this.container = null;
    this.createContainer();
    this.queue = [];
    this.isShowing = false;
  }

  createContainer() {
    // Crear contenedor si no existe
    if (document.getElementById('notifications-container')) {
      this.container = document.getElementById('notifications-container');
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'notifications-container';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Notificaciones del sistema');
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.container);
  }

  /**
   * Mostrar notificación
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - Tiempo en ms antes de desaparecer (0 = manual)
   */
  show(message, type = 'info', duration = 4000) {
    const notification = this.createNotification(message, type);
    this.container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(notification);
      }, duration);
    }

    return notification;
  }

  createNotification(message, type) {
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    div.setAttribute('role', 'status');

    const icon = this.getIcon(type);
    const textColor = this.getTextClass(type);

    div.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${this.escapeHtml(message)}</span>
        <button class="notification-close" aria-label="Cerrar notificación">
          ✕
        </button>
      </div>
    `;

    // Agregar evento de cierre
    div.querySelector('.notification-close').addEventListener('click', () => {
      this.dismiss(div);
    });

    return div;
  }

  dismiss(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  getTextClass(type) {
    const classes = {
      success: 'text-success',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info'
    };
    return classes[type] || classes.info;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Métodos convenientes
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

// Instancia global
const notifications = new NotificationSystem();
