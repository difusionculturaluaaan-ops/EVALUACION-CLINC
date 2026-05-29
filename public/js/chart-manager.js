/**
 * Gestor de Chart.js para evitar múltiples instancias en el mismo canvas
 */

let chartInstance = null;

const chartManager = {
  /**
   * Crear o actualizar gráfica, destruyendo la anterior si existe
   */
  create(canvasId, config) {
    // Destruir la instancia anterior si existe
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas con ID "${canvasId}" no encontrado`);
      return null;
    }

    try {
      const ctx = canvas.getContext('2d');
      chartInstance = new Chart(ctx, config);
      return chartInstance;
    } catch (error) {
      console.error('Error al crear Chart.js:', error);
      return null;
    }
  },

  /**
   * Obtener la instancia actual
   */
  get() {
    return chartInstance;
  },

  /**
   * Destruir la instancia actual
   */
  destroy() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  },

  /**
   * Crear gráfica de perfil clínico (línea con puntos)
   */
  crearGraficaPerfil(canvasId, labels, data, titulo = 'Perfil de Evaluación', tipoTest = 'HAM') {
    return this.create(canvasId, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: titulo,
          data: data,
          backgroundColor: '#2c5aa0',
          borderColor: '#1a3a5c',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            borderColor: '#2c5aa0',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              title: (context) => {
                if (context && context[0]) {
                  return labels[context[0].dataIndex] || 'Ítem';
                }
                return '';
              },
              label: (context) => {
                const valor = context.raw || 0;
                return [`Puntaje: ${valor}`, `Click para ver interpretación`];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: tipoTest === 'MMPI' ? 100 : tipoTest === 'HAM' ? 25 : 4,
            ticks: {
              color: '#4a5568',
              font: { size: 11 },
              stepSize: tipoTest === 'MMPI' ? 10 : tipoTest === 'HAM' ? 5 : 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              color: '#4a5568',
              font: { size: 10, weight: 'bold' },
              maxRotation: 90,
              minRotation: 45,
              autoSkip: false
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  },

  /**
   * Crear gráfica de evolución (histórico)
   */
  crearGraficaEvolucion(canvasId, fechas, puntajes, titulo = 'Evolución del Paciente') {
    return this.create(canvasId, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: titulo,
          data: puntajes,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.05)',
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#0284c7',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              color: '#1a202c',
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            borderColor: '#0284c7',
            borderWidth: 1,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#4a5568',
              font: { size: 11 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              color: '#4a5568',
              font: { size: 10 },
              maxRotation: 45,
              minRotation: 0
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
};
