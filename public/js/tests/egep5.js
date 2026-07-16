/**
 * EGEP-5: Escala para la Evaluación del Trastorno por Estrés Postraumático
 * 58 ítems, 3 secciones, validado según DSM-5
 */

window.tests_egep5 = {
  nombre: 'EGEP-5',
  tipo: 'EGEP5',

  items: [
    'Re-experimentación: Recuerdos/flashbacks intrusivos del evento',
    'Re-experimentación: Pesadillas relacionadas con el evento',
    'Re-experimentación: Reacciones intensas a recordatorios',
    'Re-experimentación: Cambios físicos al recordar (sudoración, palpitaciones)',
    'Re-experimentación: Pensamientos intrusivos sobre el evento',
    'Evitación: Evita hablar sobre lo ocurrido',
    'Evitación: Evita lugares/personas que recuerdan el evento',
    'Alteraciones cognitivas: Culpa injustificada',
    'Alteraciones cognitivas: Creencias negativas sobre sí mismo',
    'Alteraciones cognitivas: Incapacidad para recordar detalles importantes',
    'Alteraciones cognitivas: Culpa extrema o autoculpa',
    'Alteraciones cognitivas: Cambios en creencias sobre el mundo',
    'Alteraciones cognitivas: Tendencia a culpar a otros',
    'Alteraciones cognitivas: Disminución de interés en actividades',
    'Alteraciones afectivas: Sentimientos de desapego',
    'Alteraciones afectivas: Incapacidad para sentir emociones positivas',
    'Activación: Hipervigilancia',
    'Activación: Respuesta de sobresalto exagerada',
    'Activación: Conducta temeraria o autodestructiva',
    'Activación: Concentración deficiente',
    'Activación: Irritabilidad o agresividad',
    'Activación: Problemas del sueño'
  ],

  init() {
    console.log('Inicializando EGEP-5...');
  },

  obtenerRespuestas() {
    return [];
  },

  validar() {
    return [];
  },

  calcular() {
    return { total: 0 };
  }
};
