/**
 * EGEP-5 Baremos: Escales de interpretación normalizada
 * Estructura lista para cargar desde JSON o API
 */

window.EGEP5_BAREMOS = {
  // Baremos profesionales (España, población general)
  // Fuente: Manual del EGEP-5 (TEA Ediciones)
  // Formato: { pc: percentil, I: "rango PD", E: "rango PD", ... }

  BAREMOS_ESPANA: {
    nombre: 'Baremos España - Población General',
    fuente: 'TEA Ediciones - Manual EGEP-5',
    muestra: 2500,
    filas: [
      { pc: 99, I: '20', E: '8', C: '28', A: '24', Total: '80', F: '7' },
      { pc: 98, I: '20', E: '8', C: '28', A: '24', Total: '80', F: '7' },
      { pc: 97, I: '19-20', E: '7-8', C: '27-28', A: '23-24', Total: '76-80', F: '7' },
      { pc: 96, I: '19', E: '7', C: '27', A: '23', Total: '75', F: '7' },
      { pc: 95, I: '18-19', E: '7-8', C: '26-27', A: '22-23', Total: '72-75', F: '7' },
      { pc: 90, I: '17-18', E: '6-7', C: '24-25', A: '21-22', Total: '66-70', F: '6-7' },
      { pc: 85, I: '16-17', E: '5-6', C: '22-23', A: '19-20', Total: '60-65', F: '5-6' },
      { pc: 80, I: '15-16', E: '5', C: '20-22', A: '18-19', Total: '56-59', F: '5' },
      { pc: 75, I: '14-15', E: '4-5', C: '19-21', A: '17-18', Total: '52-55', F: '5' },
      { pc: 70, I: '13-14', E: '4', C: '17-18', A: '15-17', Total: '48-51', F: '4-5' },
      { pc: 65, I: '12-13', E: '3-4', C: '15-17', A: '14-16', Total: '44-47', F: '4' },
      { pc: 60, I: '11-12', E: '3', C: '13-15', A: '13-15', Total: '40-43', F: '3-4' },
      { pc: 55, I: '10-11', E: '2-3', C: '11-13', A: '11-14', Total: '36-39', F: '3' },
      { pc: 50, I: '9-10', E: '2', C: '9-11', A: '10-13', Total: '32-35', F: '3' },
      { pc: 45, I: '8-9', E: '2', C: '8-10', A: '8-12', Total: '28-31', F: '2-3' },
      { pc: 40, I: '7-8', E: '1-2', C: '6-8', A: '6-11', Total: '24-27', F: '2' },
      { pc: 35, I: '6-7', E: '1', C: '5-7', A: '5-10', Total: '20-23', F: '2' },
      { pc: 30, I: '5-6', E: '1', C: '3-5', A: '3-9', Total: '16-19', F: '1-2' },
      { pc: 25, I: '4-5', E: '0-1', C: '2-3', A: '2-8', Total: '12-15', F: '1' },
      { pc: 20, I: '3-4', E: '0', C: '1-2', A: '0-7', Total: '8-11', F: '1' },
      { pc: 15, I: '2-3', E: '0', C: '0-1', A: '0-6', Total: '5-7', F: '0-1' },
      { pc: 10, I: '1-2', E: '0', C: '0', A: '0-5', Total: '2-4', F: '0' },
      { pc: 5, I: '0-1', E: '0', C: '0', A: '0-3', Total: '0-2', F: '0' },
      { pc: 4, I: '0-1', E: '0', C: '0', A: '0-2', Total: '0-1', F: '0' },
      { pc: 3, I: '0', E: '0', C: '0', A: '0-1', Total: '0', F: '0' },
      { pc: 2, I: '0', E: '0', C: '0', A: '0', Total: '0', F: '0' },
      { pc: 1, I: '0', E: '0', C: '0', A: '0', Total: '0', F: '0' }
    ]
  },

  /**
   * Cargar baremos desde JSON externo (API)
   */
  async cargarBaremosDesdeAPI(url) {
    try {
      const response = await fetch(url);
      const baremos = await response.json();
      if (!baremos.filas || !Array.isArray(baremos.filas)) {
        throw new Error('Formato de baremos inválido');
      }
      return baremos;
    } catch (error) {
      console.error('Error cargando baremos:', error);
      return null;
    }
  },

  /**
   * Validar estructura de baremos
   */
  esValido(baremos) {
    if (!baremos || typeof baremos !== 'object') return false;
    if (!Array.isArray(baremos.filas)) return false;
    if (baremos.filas.length === 0) return false;
    // Verificar que tiene las escalas necesarias
    const escalas = ['I', 'E', 'C', 'A', 'Total', 'F'];
    return baremos.filas.every(f => escalas.some(e => f[e] !== undefined));
  },

  /**
   * Obtener tabla HTML de baremos para mostrar
   */
  generarTablaBaremos(baremos) {
    if (!this.esValido(baremos)) return '<p style="color: red;">Baremos no válidos</p>';

    let html = `
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
      <div style="background: #f3f4f6; border-bottom: 1px solid #e5e7eb; padding: 12px 16px;">
        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">
          Baremos: ${baremos.nombre || 'Cargados'}
        </h3>
        <p style="margin: 4px 0 0; font-size: 11px; color: #6b7280;">
          ${baremos.fuente || 'Fuente no especificada'} · n=${baremos.muestra || '?'}
        </p>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <thead>
            <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">Pc</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">I</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">E</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">C</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">A</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">Total</th>
              <th style="padding: 8px 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase;">F</th>
            </tr>
          </thead>
          <tbody>
    `;

    baremos.filas.forEach((f, i) => {
      const bgColor = i % 2 === 0 ? '#ffffff' : '#f9fafb';
      const pcColor = f.pc >= 85 ? '#dc2626' : f.pc >= 60 ? '#d97706' : f.pc >= 40 ? '#6b7280' : f.pc >= 15 ? '#2563eb' : '#16a34a';
      html += `
        <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px 12px; text-align: center; font-weight: 600; color: ${pcColor};">${f.pc}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.I || '–'}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.E || '–'}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.C || '–'}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.A || '–'}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.Total || '–'}</td>
          <td style="padding: 8px 12px; text-align: center; color: #111827;">${f.F || '–'}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    </div>
    `;

    return html;
  }
};
