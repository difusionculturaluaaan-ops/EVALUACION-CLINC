/**
 * ISRA: Inventario de Situaciones y Respuestas de Ansiedad
 * Sección C - Cognitiva: 57 ítems + 7 subitems del ítem 57
 * Escala: 0-4 (Casi nunca a Casi siempre)
 * Tobal & Cano Vindel
 */

const tests_isra = {
  nombre: 'ISRA',
  tipo: 'ISRA',
  seccion: 'C',
  sistema: 'Cognitivo',

  items: [
    '1. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante, me preocupo fácilmente.',
    '2. Ante un examen en el que me juego mucho, o si voy a ser entrevistado para un trabajo importante, me cuesta concentrarme.',
    '3. Cuando voy a llegar tarde a una cita, me preocupo facilmente.',
    '4. Cuando pienso en las muchas cosas que tengo que hacer doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '5. Cuando pienso en las muchas cosas que tengo que hacer me cuesta concentrarme.',
    '6. A la hora de tomar una decisión o resolver un problema difícil me preocupo facilmente.',
    '7. A la hora de tomar una decisión o resolver un problema difícil me cuesta concentrarme.',
    '8. En mi trabajo o cuando estudio me siento inseguro de mí mismo.',
    '9. En mi trabajo o cuando estudio doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '10. Cuando espero a alguien en un lugar concurrido me preocupo facilmente.',
    '11. Cuando espero a alguien en un lugar concurrido tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '12. Cuando espero a alguien en un lugar concurrido doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '13. Cuando espero a alguien en un lugar concurrido pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '14. Si una persona del otro sexo está muy cerca de mí, rozándome, o si estoy en una situación sexual íntima doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '15. Cuando alguien me molesta o cuando discuto tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '16. Cuando alguien me molesta o cuando discuto pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '17. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente me cuesta concentrarme.',
    '18. Cuando soy observado o mi trabajo es supervisado, cuando recibo críticas, o siempre que pueda ser evaluado negativamente pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '19. Si tengo que hablar en público me preocupo facilmente.',
    '20. Si tengo que hablar en público doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '21. Si tengo que hablar en público me cuesta concentrarme.',
    '22. Si tengo que hablar en público pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '23. Cuando pienso en experiencias recientes en las que me he sentido ridículo, tímido, humillado, solo o rechazado me cuesta concentrarme.',
    '24. Cuando tengo que viajar en avión o en barco me siento inseguro de mí mismo.',
    '25. Cuando tengo que viajar en avión o en barco siento miedo.',
    '26. Cuando tengo que viajar en avión o en barco me cuesta concentrarme.',
    '27. Después de haber cometido algún error doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '28. Después de haber cometido algún error siento miedo.',
    '29. Después de haber cometido algún error me cuesta concentrarme.',
    '30. Después de haber cometido algún error pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '31. Ante la consulta del dentista, las inyecciones, las heridas o la sangre me preocupo facilmente.',
    '32. Cuando voy a una cita con una persona del otro sexo siento miedo.',
    '33. Cuando pienso en mi futuro o en dificultades y problemas futuros me cuesta concentrarme.',
    '34. En medio de multitudes o en espacios cerrados me preocupo facilmente.',
    '35. En medio de multitudes o en espacios cerrados tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '36. En medio de multitudes o en espacios cerrados siento miedo.',
    '37. En medio de multitudes o en espacios cerrados me cuesta concentrarme.',
    '38. En medio de multitudes o en espacios cerrados pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '39. Cuando tengo que asistir a una reunión social o conocer gente nueva me siento inseguro de mí mismo.',
    '40. Cuando tengo que asistir a una reunión social o conocer gente nueva me cuesta concentrarme.',
    '41. En lugares altos, o ante aguas profundas me preocupo facilmente.',
    '42. En lugares altos, o ante aguas profundas tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '43. En lugares altos, o ante aguas profundas me siento inseguro de mí mismo.',
    '44. En lugares altos, o ante aguas profundas siento miedo.',
    '45. En lugares altos, o ante aguas profundas pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '46. Al observar escenas violentas me preocupo facilmente.',
    '47. Al observar escenas violentas tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '48. Al observar escenas violentas siento miedo.',
    '49. Por nada en concreto me preocupo facilmente.',
    '50. Por nada en concreto tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '51. Por nada en concreto me siento inseguro de mí mismo.',
    '52. Por nada en concreto doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '53. Por nada en concreto siento miedo.',
    '54. A la hora de dormir me preocupo facilmente.',
    '55. A la hora de dormir tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '56. A la hora de dormir pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.',
    '57. Describa una situación en la que usted manifiesta frecuentemente alguna de estas respuestas o conductas:'
  ],

  subitems57: [
    '57.1 - Me preocupo facilmente.',
    '57.2 - Tengo pensamientos o sentimientos negativos sobre mí, tales como "inferior" a los demás, "torpe", etc.',
    '57.3 - Me siento inseguro de mí mismo.',
    '57.4 - Doy demasiadas vueltas a las cosas sin llegar a decidirme.',
    '57.5 - Siento miedo.',
    '57.6 - Me cuesta concentrarme.',
    '57.7 - Pienso que la gente se dará cuenta de mis problemas o de la torpeza de mis actos.'
  ],

  init() {
    testRenderer.renderLikert04('isra-container', this.items, 'isra', ['Casi nunca', 'Pocas veces', 'Unas veces sí, otras no', 'Muchas veces', 'Casi siempre']);
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('isra-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('isra', this.items.length + this.subitems57.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('isra', this.items.length);
  },

  obtenerRespuestas57() {
    return testRenderer.obtenerRespuestas('isra-57', this.subitems57.length);
  },

  validar() {
    return testRenderer.validarCompleto('isra', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const totalC = data.reduce((a, b) => a + (b || 0), 0);

    const norma = interpretacion.isra.normasSistemas.C;
    const z = ((totalC - norma.media) / norma.ds).toFixed(2);

    let nivel, label, color;
    if (totalC < 27) {
      nivel = 0;
      label = 'Bajo';
      color = '#276749';
    } else if (totalC < 83) {
      nivel = 1;
      label = 'Normal';
      color = '#0284c7';
    } else if (totalC < 139) {
      nivel = 2;
      label = 'Moderado';
      color = '#f97316';
    } else if (totalC < 195) {
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
      total: totalC,
      totalC: totalC,
      media: norma.media,
      ds: norma.ds,
      zScore: z,
      nivel,
      label,
      color,
      texto: `Puntuación cognitiva: ${totalC}/272 (Z=${z})`
    };
  }
};
