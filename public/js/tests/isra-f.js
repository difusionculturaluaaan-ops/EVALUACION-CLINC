/**
 * ISRA: Inventario de Situaciones y Respuestas de Ansiedad
 * Sección F - Fisiológica: 112 ítems + 10 subitems del ítem 113
 * Escala: 0-4 (Casi nunca a Casi siempre)
 * Tobal & Cano Vindel
 */

const tests_isra_f = {
  nombre: 'ISRA - Sección F',
  tipo: 'ISRA',
  seccion: 'F',
  sistema: 'Fisiológico',

  items: [
    '1. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante me tiemblan las manos o las piernas.',
    '2. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante me duele la cabeza.',
    '3. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante mi cuerpo está en tensión.',
    '4. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante me falta el aire y mi respiración es agitada.',
    '5. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante siento náuseas o mareo.',
    '6. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante se me seca la boca y tengo dificultades para tragar.',
    '7. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante tengo escalofríos y tirito aunque no haga mucho frío.',
    '8. Cuando voy a llegar tarde a una cita siento molestias en el estómago.',
    '9. Cuando voy a llegar tarde a una cita me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '10. Cuando voy a llegar tarde a una cita me tiemblan las manos o las piernas.',
    '11. Cuando voy a llegar tarde a una cita me duele la cabeza.',
    '12. Cuando voy a llegar tarde a una cita tengo palpitaciones, el corazón me late muy deprisa.',
    '13. Cuando voy a llegar tarde a una cita me falta el aire y mi respiración es agitada.',
    '14. Cuando voy a llegar tarde a una cita se me seca la boca y tengo dificultades para tragar.',
    '15. Cuando pienso en las muchas cosas que tengo que hacer siento molestias en el estómago.',
    '16. Cuando pienso en las muchas cosas que tengo que hacer me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '17. Cuando pienso en las muchas cosas que tengo que hacer me tiemblan las manos o las piernas.',
    '18. Cuando pienso en las muchas cosas que tengo que hacer me duele la cabeza.',
    '19. Cuando pienso en las muchas cosas que tengo que hacer tengo palpitaciones, el corazón me late muy deprisa.',
    '20. Cuando pienso en las muchas cosas que tengo que hacer me falta el aire y mi respiración es agitada.',
    '21. Cuando pienso en las muchas cosas que tengo que hacer siento náuseas o mareo.',
    '22. Cuando pienso en las muchas cosas que tengo que hacer se me seca la boca y tengo dificultades para tragar.',
    '23. A la hora de tomar una decisión o resolver un problema difícil me duele la cabeza.',
    '24. En mi trabajo o cuando estudio siento molestias en el estómago.',
    '25. En mi trabajo o cuando estudio me duele la cabeza.',
    '26. En mi trabajo o cuando estudio tengo palpitaciones, el corazón me late muy deprisa.',
    '27. En mi trabajo o cuando estudio se me seca la boca y tengo dificultades para tragar.',
    '28. Cuando espero a alguien en un lugar concurrido siento molestias en el estómago.',
    '29. Cuando espero a alguien en un lugar concurrido mi cuerpo está en tensión.',
    '30. Cuando espero a alguien en un lugar concurrido me falta el aire y mi respiración es agitada.',
    '31. Cuando espero a alguien en un lugar concurrido se me seca la boca y tengo dificultades para tragar.',
    '32. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima me tiemblan las manos o las piernas.',
    '33. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima tengo palpitaciones, el corazón me late muy deprisa.',
    '34. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima me falta el aire y mi respiración es agitada.',
    '35. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima siento náuseas o mareo.',
    '36. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima se me seca la boca y tengo dificultades para tragar.',
    '37. Cuando alguien me molesta o cuando discuto siento molestias en el estómago.',
    '38. Cuando alguien me molesta o cuando discuto me tiemblan las manos o las piernas.',
    '39. Cuando alguien me molesta o cuando discuto me duele la cabeza.',
    '40. Cuando alguien me molesta o cuando discuto tengo palpitaciones, el corazón me late muy deprisa.',
    '41. Cuando alguien me molesta o cuando discuto me falta el aire y mi respiración es agitada.',
    '42. Cuando alguien me molesta o cuando discuto siento náuseas o mareo.',
    '43. Cuando alguien me molesta o cuando discuto se me seca la boca y tengo dificultades para tragar.',
    '44. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente me tiemblan las manos o las piernas.',
    '45. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente me falta el aire y mi respiración es agitada.',
    '46. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente siento náuseas o mareo.',
    '47. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente se me seca la boca y tengo dificultades para tragar.',
    '48. Si tengo que hablar en público siento molestias en el estómago.',
    '49. Si tengo que hablar en público me tiemblan las manos o las piernas.',
    '50. Si tengo que hablar en público me duele la cabeza.',
    '51. Si tengo que hablar en público tengo palpitaciones, el corazón me late muy deprisa.',
    '52. Si tengo que hablar en público me falta el aire y mi respiración es agitada.',
    '53. Si tengo que hablar en público siento náuseas o mareo.',
    '54. Si tengo que hablar en público se me seca la boca y tengo dificultades para tragar.',
    '55. Si tengo que hablar en público tengo escalofríos y tirito aunque no haga mucho frío.',
    '56. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado mi cuerpo está en tensión.',
    '57. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado tengo palpitaciones, el corazón me late muy deprisa.',
    '58. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado me falta el aire y mi respiración es agitada.',
    '59. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado tengo escalofríos y tirito aunque no haga mucho frío.',
    '60. Cuando tengo que viajar en avión o en barco me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '61. Cuando tengo que viajar en avión o en barco me tiemblan las manos o las piernas.',
    '62. Cuando tengo que viajar en avión o en barco me duele la cabeza.',
    '63. Cuando tengo que viajar en avión o en barco tengo palpitaciones, el corazón me late muy deprisa.',
    '64. Cuando tengo que viajar en avión o en barco me falta el aire y mi respiración es agitada.',
    '65. Cuando tengo que viajar en avión o en barco siento náuseas o mareo.',
    '66. Cuando tengo que viajar en avión o en barco se me seca la boca y tengo dificultades para tragar.',
    '67. Después de haber cometido algún error me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '68. Después de haber cometido algún error me tiemblan las manos o las piernas.',
    '69. Después de haber cometido algún error me duele la cabeza.',
    '70. Después de haber cometido algún error me falta el aire y mi respiración es agitada.',
    '71. Después de haber cometido algún error tengo escalofríos y tirito aunque no haga mucho frío.',
    '72. Ante la consulta del dentista, las inyecciones, las heridas o la sangre me duele la cabeza.',
    '73. Ante la consulta del dentista, las inyecciones, las heridas o la sangre me falta el aire y mi respiración es agitada.',
    '74. Ante la consulta del dentista, las inyecciones, las heridas o la sangre tengo escalofríos y tirito aunque no haga mucho frío.',
    '75. Cuando voy a una cita con una persona del otro sexo me tiemblan las manos o las piernas.',
    '76. Cuando voy a una cita con una persona del otro sexo me duele la cabeza.',
    '77. Cuando voy a una cita con una persona del otro sexo me falta el aire y mi respiración es agitada.',
    '78. Cuando voy a una cita con una persona del otro sexo se me seca la boca y tengo dificultades para tragar.',
    '79. Cuando pienso en mi futuro o en dificultades y problemas futuros me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '80. Cuando pienso en mi futuro o en dificultades y problemas futuros me tiemblan las manos o las piernas.',
    '81. Cuando pienso en mi futuro o en dificultades y problemas futuros me duele la cabeza.',
    '82. Cuando pienso en mi futuro o en dificultades y problemas futuros mi cuerpo está en tensión.',
    '83. Cuando pienso en mi futuro o en dificultades y problemas futuros me falta el aire y mi respiración es agitada.',
    '84. Cuando pienso en mi futuro o en dificultades y problemas futuros se me seca la boca y tengo dificultades para tragar.',
    '85. En medio de multitudes o en espacios cerrados siento molestias en el estómago.',
    '86. En medio de multitudes o en espacios cerrados me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '87. En medio de multitudes o en espacios cerrados me tiemblan las manos o las piernas.',
    '88. En medio de multitudes o en espacios cerrados me duele la cabeza.',
    '89. En medio de multitudes o en espacios cerrados me falta el aire y mi respiración es agitada.',
    '90. Cuando tengo que asistir a una reunión social o conocer gente nueva siento molestias en el estómago.',
    '91. Cuando tengo que asistir a una reunión social o conocer gente nueva me tiemblan las manos o las piernas.',
    '92. Cuando tengo que asistir a una reunión social o conocer gente nueva me duele la cabeza.',
    '93. Cuando tengo que asistir a una reunión social o conocer gente nueva me falta el aire y mi respiración es agitada.',
    '94. Cuando tengo que asistir a una reunión social o conocer gente nueva se me seca la boca y tengo dificultades para tragar.',
    '95. En lugares altos, o ante aguas profundas me tiemblan las manos o las piernas.',
    '96. En lugares altos, o ante aguas profundas tengo palpitaciones, el corazón me late muy deprisa.',
    '97. En lugares altos, o ante aguas profundas me falta el aire y mi respiración es agitada.',
    '98. En lugares altos, o ante aguas profundas siento náuseas o mareo.',
    '99. En lugares altos, o ante aguas profundas se me seca la boca y tengo dificultades para tragar.',
    '100. En lugares altos, o ante aguas profundas tengo escalofríos y tirito aunque no haga mucho frío.',
    '101. Al observar escenas violentas siento molestias en el estómago.',
    '102. Al observar escenas violentas tengo palpitaciones, el corazón me late muy deprisa.',
    '103. Al observar escenas violentas me falta el aire y mi respiración es agitada.',
    '104. Al observar escenas violentas siento náuseas o mareo.',
    '105. Por nada en concreto siento molestias en el estómago.',
    '106. Por nada en concreto me tiemblan las manos o las piernas.',
    '107. Por nada en concreto me duele la cabeza.',
    '108. Por nada en concreto tengo palpitaciones, el corazón me late muy deprisa.',
    '109. Por nada en concreto me falta el aire y mi respiración es agitada.',
    '110. Por nada en concreto siento náuseas o mareo.',
    '111. Por nada en concreto se me seca la boca y tengo dificultades para tragar.',
    '112. A la hora de dormir me duele la cabeza.',
    '113. Describa una situación en la que usted manifiesta frecuentemente alguna de estas respuestas o conductas:'
  ],

  subitems113: [
    '113.1 - Siento molestias en el estómago.',
    '113.2 - Me sudan las manos u otra parte del cuerpo hasta en días fríos.',
    '113.3 - Me tiemblan las manos o las piernas.',
    '113.4 - Me duele la cabeza.',
    '113.5 - Mi cuerpo está en tensión.',
    '113.6 - Tengo palpitaciones, el corazón me late muy deprisa.',
    '113.7 - Me falta el aire y mi respiración es agitada.',
    '113.8 - Siento náuseas o mareo.',
    '113.9 - Se me seca la boca y tengo dificultades para tragar.',
    '113.10 - Tengo escalofríos y tirito aunque no haga mucho frío.'
  ],

  init() {
    testRenderer.renderLikert04('isra-f-container', this.items, 'isra-f', ['Casi nunca', 'Pocas veces', 'Unas veces sí, otras no', 'Muchas veces', 'Casi siempre']);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('isra-f-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('isra-f', this.items.length + this.subitems113.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('isra-f', this.items.length);
  },

  obtenerRespuestas113() {
    return testRenderer.obtenerRespuestas('isra-f-113', this.subitems113.length);
  },

  validar() {
    return testRenderer.validarCompleto('isra-f', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const totalF = data.reduce((a, b) => a + (b || 0), 0);

    const norma = interpretacion.isra.normasSistemas.F;
    const z = ((totalF - norma.media) / norma.ds).toFixed(2);

    let nivel, label, color;
    if (totalF < 19) {
      nivel = 0;
      label = 'Bajo';
      color = '#276749';
    } else if (totalF < 69) {
      nivel = 1;
      label = 'Normal';
      color = '#0284c7';
    } else if (totalF < 119) {
      nivel = 2;
      label = 'Moderado';
      color = '#f97316';
    } else if (totalF < 169) {
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
      total: totalF,
      totalF: totalF,
      media: norma.media,
      ds: norma.ds,
      zScore: z,
      nivel,
      label,
      color,
      texto: `Puntuación fisiológica: ${totalF}/272 (Z=${z})`
    };
  }
};
