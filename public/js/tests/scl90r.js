/**
 * SCL-90-R: Symptom Checklist-90 Revised
 * 90 ítems, escala Likert 0-4
 */

const tests_scl90r = {
  nombre: 'SCL-90-R',
  tipo: 'SCL90R',
  items: [
    'Dolores de cabeza', 'Nerviosismo o agitación interior', 'Pensamientos recurrentes o insistentes',
    'Desmayos o mareos', 'Pérdida de interés sexual', 'Sensación de ser criticado', 'Miedo de estar en multitudes o en espacios públicos',
    'Dificultad para concentrarse', 'Miedo a estar solo', 'Dificultad para tomar decisiones',
    'Miedo de perder el control', 'Dificultad para respirar', 'Sofocación o sensación de ahogo', 'Flashbacks de eventos traumáticos',
    'Sentimientos de culpa', 'Dolor en el pecho o corazón', 'Miedo a morir', 'Terrores nocturnos',
    'Apetito deficiente', 'Dificultad para dormir', 'Sentimiento de tristeza', 'Pérdida de energía',
    'Pesadillas', 'Irritabilidad o mal carácter', 'Dificultad para sentir placer', 'Problemas de salud',
    'Pensamientos suicidas', 'Inestabilidad emocional', 'Cambios de humor frecuentes', 'Incapacidad para trabajar',
    'Problemas de memoria', 'Preocupación excesiva por la salud', 'Desinterés en actividades', 'Incapacidad para tomar iniciativa',
    'Ansiedad generalizada', 'Sentimientos de desesperación', 'Pánico', 'Rigidez muscular',
    'Temblores', 'Sensibilidad al ruido', 'Sensibilidad a la luz', 'Sofocos o escalofríos',
    'Hormigueo o entumecimiento', 'Dolor de nuca o cuello rígido', 'Pesadez de extremidades', 'Debilidad muscular',
    'Pérdida de apetito', 'Náuseas o molestias estomacales', 'Problemas digestivos', 'Dolor abdominal',
    'Diarrea', 'Estreñimiento', 'Quejas vagas sobre el cuerpo', 'Sensación de que algo malo ocurrirá',
    'Palpitaciones cardíacas', 'Sudoración excesiva', 'Mareos o vértigo', 'Debilidad o cansancio',
    'Rigidez articular o muscular', 'Problemas menstruales', 'Relaciones sexuales dolorosas', 'Falta de interés en el sexo',
    'Miedo a espacios cerrados', 'Miedo a viajar', 'Miedo a viajar en autobús, tren o auto', 'Miedo de salir de casa',
    'Pensamientos sobre la muerte o el morir', 'Impulso de golpear a alguien', 'Rompimiento de cosas', 'Sentimientos de ira no controlada',
    'Pelear con otros frecuentemente', 'Acusaciones de ser desleal', 'Sentimientos de soledad extrema', 'Sentimiento de que otros no lo entienden',
    'Sentimiento de ser diferente a otros', 'Sentimiento de inferioridad', 'Culpa por las acciones de otros', 'Arrepentimiento por sus errores',
    'Preocupación de que algo malo ocurrirá', 'Sensación de que está siendo perseguido', 'Sensación de que está siendo manipulado',
    'Creencias extrañas o inusuales', 'Comportamiento irresponsable', 'Necesidad excesiva de controlar todo'
  ],

  init() {
    testRenderer.renderLikert04('scl-container', this.items, 'scl');
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('scl-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('scl', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('scl', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('scl', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const total = data.reduce((a, b) => a + (b || 0), 0);
    const subescalas = interpretacion.scl90r.calcular(data);
    return { total, ...subescalas };
  }
};
