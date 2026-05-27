/**
 * ISRA: Inventario de Situaciones y Respuestas de Ansiedad
 * Sección M - Motor-Conductual: 56 ítems + 7 subitems del ítem 57
 * Escala: 0-4 (Casi nunca a Casi siempre)
 * Tobal & Cano Vindel
 */

const tests_isra_m = {
  nombre: 'ISRA - Sección M',
  tipo: 'ISRA',
  seccion: 'M',
  sistema: 'Motor-Conductual',

  items: [
    '1. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '2. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante me muevo y hago cosas sin una finalidad concreta.',
    '3. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante quedo paralizado o mis movimientos son torpes.',
    '4. Cuando voy a llegar tarde a una cita realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '5. Cuando voy a llegar tarde a una cita me muevo y hago cosas sin una finalidad concreta.',
    '6. Cuando pienso en las muchas cosas que tengo que hacer lloro con facilidad.',
    '7. Cuando pienso en las muchas cosas que tengo que hacer realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '8. Cuando pienso en las muchas cosas que tengo que hacer fumo, como o bebo demasiado.',
    '9. Cuando pienso en las muchas cosas que tengo que hacer me muevo y hago cosas sin una finalidad concreta.',
    '10. Cuando pienso en las muchas cosas que tengo que hacer quedo paralizado o mis movimientos son torpes.',
    '11. Cuando pienso en las muchas cosas que tengo que hacer tartamudeo o tengo otras dificultades de expresión verbal.',
    '12. A la hora de tomar una decisión o resolver un problema difícil fumo, como o bebo demasiado.',
    '13. A la hora de tomar una decisión o resolver un problema difícil me muevo y hago cosas sin una finalidad concreta.',
    '14. A la hora de tomar una decisión o resolver un problema difícil tartamudeo o tengo otras dificultades de expresión verbal.',
    '15. En mi trabajo o cuando estudio lloro con facilidad.',
    '16. En mi trabajo o cuando estudio fumo, como o bebo demasiado.',
    '17. En mi trabajo o cuando estudio quedo paralizado o mis movimientos son torpes.',
    '18. Cuando espero a alguien en un lugar concurrido fumo, como o bebo demasiado.',
    '19. Cuando espero a alguien en un lugar concurrido trato de evitar o rehuir la situación.',
    '20. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima fumo, como o bebo demasiado.',
    '21. Cuando alguien me molesta o cuando discuto realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '22. Cuando alguien me molesta o cuando discuto fumo, como o bebo demasiado.',
    '23. Cuando alguien me molesta o cuando discuto quedo paralizado o mis movimientos son torpes.',
    '24. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '25. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente fumo, como o bebo demasiado.',
    '26. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente quedo paralizado o mis movimientos son torpes.',
    '27. Si tengo que hablar en público fumo, como o bebo demasiado.',
    '28. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '29. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado fumo, como o bebo demasiado.',
    '30. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado me muevo y hago cosas sin una finalidad concreta.',
    '31. Cuando tengo que viajar en avión o en barco realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '32. Cuando tengo que viajar en avión o en barco trato de evitar o rehuir la situación.',
    '33. Cuando tengo que viajar en avión o en barco me muevo y hago cosas sin una finalidad concreta.',
    '34. Cuando tengo que viajar en avión o en barco quedo paralizado o mis movimientos son torpes.',
    '35. Después de haber cometido algún error lloro con facilidad.',
    '36. Después de haber cometido algún error fumo, como o bebo demasiado.',
    '37. Ante la consulta del dentista, las inyecciones, las heridas o la sangre me muevo y hago cosas sin una finalidad concreta.',
    '38. Ante la consulta del dentista, las inyecciones, las heridas o la sangre tartamudeo o tengo otras dificultades de expresión verbal.',
    '39. Cuando voy a una cita con una persona del otro sexo trato de evitar o rehuir la situación.',
    '40. Cuando pienso en mi futuro o en dificultades y problemas futuros realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '41. Cuando pienso en mi futuro o en dificultades y problemas futuros fumo, como o bebo demasiado.',
    '42. En medio de multitudes o en espacios cerrados lloro con facilidad.',
    '43. En medio de multitudes o en espacios cerrados realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '44. En medio de multitudes o en espacios cerrados fumo, como o bebo demasiado.',
    '45. En medio de multitudes o en espacios cerrados me muevo y hago cosas sin una finalidad concreta.',
    '46. En medio de multitudes o en espacios cerrados quedo paralizado o mis movimientos son torpes.',
    '47. Cuando tengo que asistir a una reunión social o conocer gente nueva lloro con facilidad.',
    '48. Cuando tengo que asistir a una reunión social o conocer gente nueva fumo, como o bebo demasiado.',
    '49. Cuando tengo que asistir a una reunión social o conocer gente nueva trato de evitar o rehuir la situación.',
    '50. Cuando tengo que asistir a una reunión social o conocer gente nueva quedo paralizado o mis movimientos son torpes.',
    '51. Cuando tengo que asistir a una reunión social o conocer gente nueva tartamudeo o tengo otras dificultades de expresión verbal.',
    '52. En lugares altos, o ante aguas profundas quedo paralizado o mis movimientos son torpes.',
    '53. Al observar escenas violentas fumo, como o bebo demasiado.',
    '54. Al observar escenas violentas me muevo y hago cosas sin una finalidad concreta.',
    '55. Por nada en concreto tartamudeo o tengo otras dificultades de expresión verbal.',
    '56. A la hora de dormir me muevo y hago cosas sin una finalidad concreta.',
    '57. Describa una situación en la que usted manifiesta frecuentemente alguna de estas respuestas o conductas:'
  ],

  subitems57: [
    '57.1 - Lloro con facilidad.',
    '57.2 - Realizo movimientos repetitivos con alguna parte de mi cuerpo (rascarme, tocarme, movimientos rítmicos con pies o manos, etc.)',
    '57.3 - Fumo, como o bebo demasiado.',
    '57.4 - Trato de evitar o rehuir la situación.',
    '57.5 - Me muevo y hago cosas sin una finalidad concreta.',
    '57.6 - Quedo paralizado o mis movimientos son torpes.',
    '57.7 - Tartamudeo o tengo otras dificultades de expresión verbal.'
  ],

  init() {
    testRenderer.renderLikert04('isra-m-container', this.items, 'isra-m', ['Casi nunca', 'Pocas veces', 'Unas veces sí, otras no', 'Muchas veces', 'Casi siempre']);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('isra-m-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('isra-m', this.items.length + this.subitems57.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('isra-m', this.items.length);
  },

  obtenerRespuestas57() {
    return testRenderer.obtenerRespuestas('isra-m-57', this.subitems57.length);
  },

  validar() {
    return testRenderer.validarCompleto('isra-m', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const totalM = data.reduce((a, b) => a + (b || 0), 0);

    const norma = interpretacion.isra.normasSistemas.M;
    const z = ((totalM - norma.media) / norma.ds).toFixed(2);

    let nivel, label, color;
    if (totalM < 16) {
      nivel = 0;
      label = 'Bajo';
      color = '#276749';
    } else if (totalM < 60) {
      nivel = 1;
      label = 'Normal';
      color = '#0284c7';
    } else if (totalM < 104) {
      nivel = 2;
      label = 'Moderado';
      color = '#f97316';
    } else if (totalM < 148) {
      nivel = 3;
      label = 'Alto';
      color = '#d97706';
    } else {
      nivel = 4;
      label = 'Muy alto';
      color = '#dc2626';
    }

    return {
      sistema: this.sistema,
      seccion: this.seccion,
      total: totalM,
      totalM: totalM,
      media: norma.media,
      ds: norma.ds,
      zScore: z,
      nivel,
      label,
      color,
      texto: `Puntuación motor-conductual: ${totalM}/272 (Z=${z})`
    };
  }
};
