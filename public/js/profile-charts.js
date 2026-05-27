/**
 * Gestor de Gráficos de Perfil (Paciente vs Población Normal)
 * Crea visualizaciones tipo línea para comparar puntuaciones del paciente
 * contra normas poblacionales de cada test psicométrico
 */

const profileCharts = {
  // Instancia actual del gráfico
  currentChart: null,

  // Configuraciones por tipo de test
  configs: {
    SCL90R: {
      title: 'Perfil SCL-90-R (Subescalas)',
      labels: ['Somatización', 'Obsesión-Compulsión', 'Sensibilidad Interp.', 'Depresión', 'Ansiedad',
               'Hostilidad', 'Ansiedad Fóbica', 'Ideación Paranoide', 'Psicoticismo'],
      yMax: 4,
      yLabel: 'Puntuación Media',
      colorPaciente: '#dc2626',
      colorNormal: '#16a34a',
      datasetPacienteKey: 'subescalas',
      dataNormalValues: [0.47, 0.59, 0.47, 0.59, 0.39, 0.46, 0.15, 0.47, 0.19]
    },

    MMPI2: {
      title: 'Perfil MMPI-2 (Escalas Clínicas)',
      labels: ['Hs', 'D', 'Hy', 'Pd', 'Mf', 'Pa', 'Pt', 'Sc', 'Ma', 'Si'],
      yMax: 100,
      yLabel: 'T-Score',
      colorPaciente: '#2563eb',
      colorNormal: '#f59e0b',
      datasetPacienteKey: 'escalasClinicas',
      dataNormalValues: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
    },

    HAMILTON: {
      title: 'Perfil HAM-D 17 (Ítems)',
      labels: ['Humor deprimido', 'Sentimientos culpa', 'Suicidio', 'Insomnio inicial', 'Insomnio medio',
               'Insomnio terminal', 'Trabajo/Actividades', 'Retardo', 'Agitación', 'Ansiedad psíquica',
               'Ansiedad somática', 'Síntomas somáticos GI', 'Síntomas somáticos gen.', 'Síntomas genitales',
               'Hipocondría', 'Pérdida de peso', 'Insight'],
      yMax: 4,
      yLabel: 'Puntuación',
      colorPaciente: '#7c3aed',
      colorNormal: '#06b6d4',
      datasetPacienteKey: 'items',
      dataNormalValues: [1, 0.5, 0.2, 0.8, 0.7, 0.6, 1, 0.9, 0.5, 0.7, 0.6, 0.4, 0.5, 0.3, 0.4, 0.3, 0.2]
    },

    ISRA: {
      title: 'Perfil ISRA (Sistemas de Respuesta)',
      labels: ['Cognitivo', 'Fisiológico', 'Motor-Conductual'],
      yMax: 272,
      yLabel: 'Puntuación',
      colorPaciente: '#059669',
      colorNormal: '#f59e0b',
      datasetPacienteKey: 'sistemas',
      dataNormalValues: [55, 44, 38]
    }
  },

  /**
   * Crear gráfico de perfil
   * @param {string} elementId - ID del elemento canvas
   * @param {string} testType - Tipo de test (SCL90R, MMPI2, HAMILTON, ISRA)
   * @param {object} pacienteData - Datos del paciente (subescalas, items, etc.)
   * @param {object} options - Opciones adicionales (altura, ancho, etc.)
   */
  crearGraficoPerfil(elementId, testType, pacienteData, options = {}) {
    const config = this.configs[testType];
    if (!config) {
      console.error(`Configuración no encontrada para test: ${testType}`);
      return null;
    }

    // Destruir gráfico anterior si existe
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    // Preparar datos
    const dataPaciente = this.extraerDatosTest(testType, pacienteData);
    const dataNormal = config.dataNormalValues;

    // Crear contexto canvas
    const canvas = document.getElementById(elementId);
    if (!canvas) {
      console.error(`Canvas con ID ${elementId} no encontrado`);
      return null;
    }

    const ctx = canvas.getContext('2d');

    // Configurar gráfico Chart.js
    this.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: config.labels,
        datasets: [
          {
            label: 'Paciente',
            data: dataPaciente,
            borderColor: config.colorPaciente,
            backgroundColor: config.colorPaciente + '10',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: config.colorPaciente,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Población Normal',
            data: dataNormal,
            borderColor: config.colorNormal,
            backgroundColor: config.colorNormal + '10',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 4,
            pointBackgroundColor: config.colorNormal,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: config.title,
            font: { size: 14, weight: 'bold' },
            color: '#1f2937',
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
            borderColor: '#e5e7eb',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                label += context.parsed.y.toFixed(2);
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: config.yMax,
            title: {
              display: true,
              text: config.yLabel,
              font: { size: 12, weight: 'bold' },
              color: '#6b7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: true
            },
            ticks: {
              font: { size: 11 },
              color: '#6b7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: { size: 11 },
              color: '#6b7280',
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    });

    return this.currentChart;
  },

  /**
   * Extraer datos del test según su tipo
   */
  extraerDatosTest(testType, data) {
    switch (testType) {
      case 'SCL90R':
        // Espera objeto con keys: SOM, OC, SI, DEP, ANX, HOS, PHOB, PAR, PSY
        return [
          data.SOM?.media || 0,
          data.OC?.media || 0,
          data.SI?.media || 0,
          data.DEP?.media || 0,
          data.ANX?.media || 0,
          data.HOS?.media || 0,
          data.PHOB?.media || 0,
          data.PAR?.media || 0,
          data.PSY?.media || 0
        ];

      case 'MMPI2':
        // Espera array o objeto con escalas clínicas
        if (Array.isArray(data.escalasClinicas)) {
          return data.escalasClinicas;
        }
        return data.escalasClinicas ? Object.values(data.escalasClinicas) : [];

      case 'HAMILTON':
        // Espera array de puntajes de ítems
        return Array.isArray(data) ? data : data.items || [];

      case 'ISRA':
        // Espera objeto con C, F, M (sistemas)
        return [
          data.C || 0,
          data.F || 0,
          data.M || 0
        ];

      default:
        return [];
    }
  },

  /**
   * Exportar gráfico a imagen (para PDF)
   * @returns {string} Data URL de imagen PNG
   */
  exportarAImagen(dpi = 300) {
    if (!this.currentChart || !this.currentChart.canvas) {
      console.error('No hay gráfico para exportar');
      return null;
    }

    // Crear canvas temporal con alta resolución
    const canvas = document.createElement('canvas');
    const scale = dpi / 96; // 96 DPI es estándar en navegadores

    canvas.width = this.currentChart.canvas.width * scale;
    canvas.height = this.currentChart.canvas.height * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Copiar contenido del gráfico
    ctx.drawImage(this.currentChart.canvas, 0, 0);

    return canvas.toDataURL('image/png');
  },

  /**
   * Limpiar recursos
   */
  destruir() {
    if (this.currentChart) {
      this.currentChart.destroy();
      this.currentChart = null;
    }
  }
};
