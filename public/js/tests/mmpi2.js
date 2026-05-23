/**
 * MMPI-2: Inventario Multifásico de Personalidad de Minnesota
 * 13 escalas (3 de validez + 10 clínicas)
 */

const tests_mmpi2 = {
  nombre: 'MMPI-2',
  tipo: 'MMPI2',
  escalas: [
    { id: 'L',  nombre: 'L — Mentira (Lie)' },
    { id: 'F',  nombre: 'F — Infrecuencia (Infrequency)' },
    { id: 'K',  nombre: 'K — Corrección (Correction)' },
    { id: 'Hs', nombre: 'Hs — Hipocondría (Scale 1)' },
    { id: 'D',  nombre: 'D — Depresión (Scale 2)' },
    { id: 'Hy', nombre: 'Hy — Histeria (Scale 3)' },
    { id: 'Pd', nombre: 'Pd — Desviación Psicopática (Scale 4)' },
    { id: 'Mf', nombre: 'Mf — Masculinidad/Feminidad (Scale 5)' },
    { id: 'Pa', nombre: 'Pa — Paranoia (Scale 6)' },
    { id: 'Pt', nombre: 'Pt — Psicastenia (Scale 7)' },
    { id: 'Sc', nombre: 'Sc — Esquizofrenia (Scale 8)' },
    { id: 'Ma', nombre: 'Ma — Hipomanía (Scale 9)' },
    { id: 'Si', nombre: 'Si — Introversión Social (Scale 0)' }
  ],

  init() {
    testRenderer.renderMMPI2('mmpi-container', this.escalas);
  },

  obtenerRespuestas() {
    const datos = {};
    this.escalas.forEach(escala => {
      const input = document.getElementById(`mmpi_${escala.id}`);
      datos[escala.id] = input ? parseInt(input.value) || 0 : 0;
    });
    return datos;
  },

  validar() {
    const datos = this.obtenerRespuestas();
    if (Object.values(datos).some(v => v === 0)) {
      return ['Ingrese T-scores para todas las escalas'];
    }
    return [];
  },

  calcular() {
    const datos = this.obtenerRespuestas();
    const advertencias = interpretacion.mmpi2.validarPerfil(datos);

    const escalasInterpretadas = {};
    this.escalas.forEach(escala => {
      escalasInterpretadas[escala.id] = {
        nombre: escala.nombre,
        tScore: datos[escala.id],
        interpretacion: interpretacion.mmpi2.interpretarTScore(datos[escala.id])
      };
    });

    const total = Object.values(datos).reduce((a, b) => a + b, 0);

    return {
      total,
      datos,
      escalas: escalasInterpretadas,
      advertencias
    };
  }
};
