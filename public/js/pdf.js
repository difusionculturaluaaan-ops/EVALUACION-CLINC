/**
 * Generador de PDF Profesional
 */

const pdfGenerator = {
  /**
   * Generar reporte PDF profesional
   */
  async generarPDF(paciente, prueba, resultado) {
    try {
      const elemento = document.createElement('div');
      const logoUrl = localStorage.getItem('tenant_logo_url');
      elemento.innerHTML = this.generarHTML(paciente, prueba, resultado, logoUrl);

      const opciones = {
        margin: 15,
        filename: `Reporte_${paciente.nombre}_${prueba.tipo}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Mostrar cuando inicia
      app.mostrarToast('Generando PDF...', 'info');

      // Generar PDF
      await html2pdf().set(opciones).from(elemento).save();

      app.mostrarToast('✓ PDF descargado correctamente', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      app.mostrarToast(`Error: ${error.message}`, 'error');
    }
  },

  /**
   * Generar HTML del reporte
   */
  generarHTML(paciente, prueba, resultado, logoUrl) {
    const fecha = new Date().toLocaleDateString('es-CO');
    const badge = resultado.label || `${resultado.total} Puntos`;
    const color = resultado.color || '#2c5aa0';

    const logoHTML = logoUrl ? `<img src="${logoUrl}" style="width: 2cm; height: 2cm; object-fit: contain; margin-right: 15px;">` : '';

    return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #2c5aa0; padding-bottom: 20px; margin-bottom: 30px;">
          ${logoUrl ? `<div style="text-align: center; margin-bottom: 10px;">${logoHTML}</div>` : ''}
          <h1 style="color: #2c5aa0; margin: 0 0 10px 0; font-size: 24px;">
            REPORTE DE EVALUACIÓN CLÍNICA
          </h1>
          <p style="color: #666; margin: 5px 0; font-size: 12px;">
            Evaluación Clínica Psicológica PRO v2.0
          </p>
          <p style="color: #999; margin: 5px 0; font-size: 11px;">
            ${fecha}
          </p>
        </div>

        <!-- Datos del Paciente -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5aa0; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
            Datos del Paciente
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="padding: 8px; background: #f5f5f5; font-weight: bold; width: 25%;">PACIENTE:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${this.escape(paciente.nombre)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">EDAD:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${paciente.edad || 'No especificada'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">SEXO:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${paciente.sexo || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">ESTADO CIVIL:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${paciente.estado_civil || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">MEDICAMENTOS:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${paciente.medicamentos || 'Ninguno'}</td>
            </tr>
          </table>
        </div>

        <!-- Resultado del Test -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5aa0; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
            Test Aplicado
          </h2>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid ${color};">
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold;">
              ${this.getTestNombre(prueba.tipo)}
            </p>
            <div style="text-align: center; margin: 15px 0;">
              <div style="display: inline-block; padding: 12px 30px; border: 2px solid ${color}; color: ${color}; font-size: 18px; font-weight: bold; border-radius: 5px;">
                ${badge}
              </div>
            </div>
            ${resultado.texto ? `<p style="margin: 10px 0 0 0; font-size: 12px; line-height: 1.6; color: #555;">${resultado.texto}</p>` : ''}
          </div>
        </div>

        <!-- Análisis por Factores -->
        ${resultado.factores ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c5aa0; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
              Análisis por Factores
            </h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 8px; text-align: left; font-weight: bold; border-bottom: 2px solid #2c5aa0;">Factor</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold; border-bottom: 2px solid #2c5aa0;">Puntaje</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold; border-bottom: 2px solid #2c5aa0;">Estado</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(resultado.factores).map(([key, factor]) => {
                  const rowStyle = factor.estado === 'Alerta Clínica'
                    ? 'background: rgba(220, 38, 38, 0.08);'
                    : '';
                  return `
                    <tr style="${rowStyle}">
                      <td style="padding: 8px; border-bottom: 1px solid #eee;">${factor.nombre}</td>
                      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee; font-weight: bold;">${factor.suma || 0}</td>
                      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee; color: ${factor.color}; font-weight: bold;">${factor.estado}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- Observaciones Clínicas -->
        ${paciente.observaciones ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c5aa0; font-size: 14px; text-transform: uppercase; margin: 0 0 15px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
              Observaciones Clínicas
            </h2>
            <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #555;">
              ${this.escape(paciente.observaciones)}
            </p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999;">
          <p style="margin: 0;">Este reporte fue generado por Evaluación Clínica Psicológica PRO v2.0</p>
          <p style="margin: 5px 0 0 0;">Para uso profesional exclusivamente. Confidencial.</p>
        </div>
      </div>
    `;
  },

  /**
   * Obtener nombre del test
   */
  getTestNombre(tipo) {
    const nombres = {
      'SCL90R': 'SCL-90-R (Symptom Checklist-90 Revised)',
      'HAMILTON': 'Escala Hamilton de Depresión (HAM-D 17)',
      'MMPI2': 'MMPI-2 (Inventario Multifásico de Personalidad)',
      'TDS': 'Test de Trastornos del Sueño (TDS)',
      'ISRA': 'Inventario de Situaciones y Respuestas de Ansiedad (ISRA)',
      'PCLR': 'PCL-R (Hare Psychopathy Checklist-Revised)',
      'EGEP5': 'Escala de Gravedad de TEPT (EGEP-5, DSM-5)'
    };
    return nombres[tipo] || tipo;
  },

  /**
   * Escapar HTML
   */
  escape(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
