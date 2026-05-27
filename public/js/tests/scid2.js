/**
 * SCID-II: Entrevista Clínica Estructurada para los Trastornos de la Personalidad
 * Eje II del DSM-IV
 * 119 ítems - Respuestas Sí/No
 */

const tests_scid2 = {
  nombre: 'SCID-II (Trastornos de Personalidad)',
  tipo: 'SCID2',

  items: [
    '1. ¿Ha evitado trabajos o tareas que implicaban tener que tratar con mucha gente?',
    '2. ¿Evita entablar relación con otras personas a menos que esté seguro de que les va a caer bien?',
    '3. ¿Le resulta difícil ser "abierto" incluso con las personas con las que se mantiene una relación cercana?',
    '4. ¿Le preocupa con frecuencia ser criticado o rechazado en situaciones sociales?',
    '5. ¿Permanece generalmente callado cuando conoce gente nueva?',
    '6. ¿Cree usted que no es tan bueno, tan listo o tan atractivo como la mayoría de las personas?',
    '7. ¿Le da miedo intentar cosas nuevas?',
    '8. ¿Necesita usted dejarse aconsejar y desangustiar mucho por parte de otras personas antes de poder tomar decisiones cotidianas?',
    '9. ¿Depende usted de otras personas para controlar áreas importantes de su vida?',
    '10. ¿Le resulta difícil mostrarse en desacuerdo con otras personas incluso cuando considera que están equivocadas?',
    '11. ¿Le cuesta empezar o realizar tareas cuando no hay nadie que le ayude?',
    '12. ¿Se ha ofrecido con frecuencia voluntario para realizar tareas desagradables?',
    '13. ¿Se siente usted generalmente incómodo cuando está solo?',
    '14. Cuando finaliza una relación de pareja, ¿siente usted que tiene que encontrar inmediatamente a otra persona que le cuide?',
    '15. ¿Le preocupa mucho que le abandonen y que tenga que cuidar de sí mismo?',
    '16. ¿Es usted la clase de persona que se fija en los detalles, el orden y la organización?',
    '17. ¿Tiene problemas a la hora de finalizar tareas debido a que emplea demasiado tiempo tratando de hacer las cosas de forma perfecta?',
    '18. ¿Le parece a usted que está tan dedicado a su trabajo que no le queda tiempo para nadie más?',
    '19. ¿Tiene usted unos valores muy estrictos sobre lo que está bien y lo que está mal?',
    '20. ¿Le cuesta a usted mucho tirar las cosas porque algún día podrían serle útiles?',
    '21. ¿Le cuesta dejar que otras personas le ayuden a menos que hagan las cosas exactamente como usted quiere?',
    '22. ¿Le cuesta a usted mucho gastar dinero en usted mismo o en otros?',
    '23. ¿Está a menudo tan seguro de tener razón que no le importa lo que digan los demás?',
    '24. ¿Le han comentado otras personas que usted es terco o rígido?',
    '25. Cuando alguien le pide que haga algo que usted no quiere hacer, ¿dice que sí pero luego lo hace despacio o mal?',
    '26. Cuando no quiere hacer algo, ¿suele simplemente "olvidarse" de hacerlo?',
    '27. ¿Siente con frecuencia que los demás no le comprenden o que no aprecian lo mucho que usted hace?',
    '28. ¿Está usted a menudo de mal humor o tiende a discutir?',
    '29. ¿Le parece a usted que la mayoría de sus jefes, profesores, supervisores, médicos o personas supuestamente expertas realmente no lo son?',
    '30. ¿Piensa a menudo que no es justo que otras personas tengan más que usted?',
    '31. ¿Se queja usted a menudo de haber tenido más mala suerte de lo normal?',
    '32. ¿Rehúsa a menudo con enfado hacer lo que quieren los demás, luego se siente mal y se disculpa?',
    '33. ¿Se siente habitualmente infeliz, o como si la vida no fuese agradable?',
    '34. ¿Cree usted ser una persona básicamente incapaz y con frecuencia no se siente bien consigo mismo?',
    '35. ¿Se descalifica a sí mismo con frecuencia?',
    '36. ¿Piensa mucho en cosas malas que han sucedido en el pasado o se preocupa por las que podrían suceder en el futuro?',
    '37. ¿Juzga a menudo a los demás con dureza y les encuentra defectos con facilidad?',
    '38. ¿Cree usted que la mayoría de las personas no son buenas?',
    '39. ¿Espera usted casi siempre que las cosas vayan mal?',
    '40. ¿Se siente usted a menudo culpable de cosas que ha hecho o dejado de hacer?',
    '41. ¿Tiene a menudo que estar alerta para evitar que los demás abusen de usted?',
    '42. ¿Pasa usted mucho tiempo preguntándose si puede fiarse de sus amigos o compañeros de trabajo?',
    '43. ¿Cree usted que es mejor no dejar que otras personas sepan mucho sobre usted?',
    '44. ¿Detecta usted a menudo amenazas o insultos ocultos en lo que la gente dice o hace?',
    '45. ¿Es usted la clase de persona que guarda rencor o tarda mucho tiempo en perdonar?',
    '46. ¿Hay muchas personas a las que no puede perdonar por algo que le hicieron?',
    '47. ¿Con que frecuencia se enfada o se pone furioso cuando alguien le critica?',
    '48. ¿Ha sospechado a menudo que su pareja le es o era infiel?',
    '49. Cuando está en público y ve personas hablando, ¿a menudo le parece que están hablando de usted?',
    '50. ¿Tiene con frecuencia la impresión de que cosas sin significado especial contienen un mensaje especial para usted?',
    '51. Cuando está entre la gente, ¿tiene a menudo la sensación de que lo están observando?',
    '52. ¿Ha sentido alguna vez que podría hacer que sucedieran cosas simplemente formulando un deseo?',
    '53. ¿Ha tenido experiencias personales de tipo sobrenatural?',
    '54. ¿Cree tener un "sexto sentido" que le permite conocer y predecir cosas?',
    '55. ¿Le ha parecido a menudo como si los objetos o las sombras fueran realmente personas o animales?',
    '56. ¿Ha tenido la sensación de que alguna persona o fuerza se hallaba alrededor de usted?',
    '57. ¿Ve con frecuencia auras o campos de energía alrededor de las personas?',
    '58. ¿Hay muy pocas personas a las que se sienta próximo aparte de su familia inmediata?',
    '59. ¿Se siente con frecuencia nervioso cuando está con otras personas?',
    '60. ¿Es poco importante para usted si tiene o no relaciones personales?',
    '61. ¿Prefiere usted casi siempre hacer las cosas solo?',
    '62. ¿Podría estar satisfecho sin tener jamás ninguna relación sexual?',
    '63. ¿Hay realmente muy pocas cosas que le proporcionen placer?',
    '64. ¿Le es totalmente indiferente lo que otras personas piensen de usted?',
    '65. ¿Cree que no hay nada que ponga ni muy contento ni muy triste?',
    '66. ¿Le gusta ser el centro de atención?',
    '67. ¿Coquetea mucho?',
    '68. ¿Se da cuenta a menudo de que se está comportando de forma seductora con otras personas?',
    '69. ¿Trata de llamar la atención a través de su forma de vestir o su aspecto físico?',
    '70. ¿Se muestra muy a menudo como una persona dramática y pintoresca?',
    '71. ¿Cambia a menudo de opinión según las personas con las que esté?',
    '72. ¿Tiene usted muchos amigos a los que se siente muy próximo?',
    '73. ¿Considera que a menudo los demás no saben apreciar su talento o sus cualidades?',
    '74. ¿Le han comentado otras personas que tiene una opinión demasiado elevada de sí mismo?',
    '75. ¿Piensa mucho en que algún día alcanzará el poder, la fama o el reconocimiento?',
    '76. ¿Pasa usted mucho tiempo pensado en que algún día disfrutará de un romance perfecto?',
    '77. Cuando tiene un problema, ¿insiste casi siempre en ver al máximo responsable?',
    '78. ¿Considera usted que es importante dedicar el tiempo a personas especiales o influyentes?',
    '79. ¿Es muy importante para usted que la gente le preste atención o le admire?',
    '80. ¿Cree usted que no es necesario respetar ciertas reglas o convenciones sociales?',
    '81. ¿Considera usted que es la clase de persona que merece un trato especial?',
    '82. ¿A menudo le resulta necesario aprovecharse de otros para conseguir lo que quiere?',
    '83. ¿Tiene con frecuencia que anteponer sus necesidades a las de otras personas?',
    '84. ¿Espera a menudo que otras personas hagan lo que les pide sin vacilar?',
    '85. ¿A usted realmente no le interesan los problemas y sentimientos de los demás?',
    '86. ¿Se han quejado algunas personas de que usted no le escucha?',
    '87. ¿Tiene a menudo envidia de otras personas?',
    '88. ¿Cree usted que los demás a menudo le envidian?',
    '89. ¿Le parece que hay pocas personas que merezcan que usted les dedique su tiempo?',
    '90. ¿Se ha puesto furioso con frecuencia cuando ha creído que alguien iba a abandonarlo?',
    '91. Las relaciones con las personas que verdaderamente quiere, ¿tienen muchos altibajos extremos?',
    '92. ¿Cambia a veces de repente su sentido de quién es usted?',
    '93. ¿Cambia a menudo dramáticamente su sentido de quién es?',
    '94. ¿Es usted diferente con diferentes personas, de tal manera que a veces no sabe quién es usted en realidad?',
    '95. ¿Se han producido muchos cambios bruscos en sus metas, planes profesionales?',
    '96. ¿Ha hecho a menudo cosas impulsivas?',
    '97. ¿Ha tratado de hacerse daño o matarse, o amenazado con hacerlo?',
    '98. ¿Alguna vez se ha cortado, quemado o herido a sí mismo a propósito?',
    '99. ¿Experimenta usted muchos cambios repentinos de estado de ánimo?',
    '100. ¿Se siente con frecuencia vacío por dentro?',
    '101. ¿Tiene usted a menudo arranques de cólera o se enfurece tanto que pierde el control?',
    '102. Cuando se enfada, ¿golpea usted a las personas o arroja objetos?',
    '103. ¿Se pone muy furioso incluso por cosas sin importancia?',
    '104. Cuando se halla bajo gran tensión, ¿se vuelve suspicaz con otras personas?',
    '105. Antes de los 15 años, ¿intimidaba o amenazaba a otros niños?',
    '106. Antes de los 15 años, ¿provocaba usted peleas?',
    '107. Antes de los 15 años, ¿hirió o amenazó a alguien con un arma?',
    '108. Antes de los 15 años, ¿torturó deliberadamente a alguien?',
    '109. Antes de los 15 años, ¿torturó o hirió animales a propósito?',
    '110. Antes de los 15 años, ¿robó, atracó o arrebató por la fuerza algo?',
    '111. Antes de los 15 años, ¿forzó a alguien a tener relaciones sexuales?',
    '112. Antes de los 15 años, ¿provocó algún incendio?',
    '113. Antes de los 15 años, ¿destruyó deliberadamente cosas que no eran suyas?',
    '114. Antes de los 15 años, ¿irrumpió en casas, otros edificios o coches?',
    '115. Antes de los 15 años, ¿mentía mucho o estafaba a otras personas?',
    '116. Antes de los 15 años, ¿robaba cosas o falsificaba la firma de otras personas?',
    '117. Antes de los 15 años, ¿se escapó de casa y pasó la noche fuera?',
    '118. Antes de los 13 años, ¿permanecía mucho tiempo fuera de casa?',
    '119. Antes de los 13 años, ¿faltaba a menudo a clase?'
  ],

  init() {
    testRenderer.renderYesNo('scid2-container', this.items, 'scid2');
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('scid2-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('scid2', this.items.length);
    });
  },

  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('scid2', this.items.length);
  },

  validar() {
    return testRenderer.validarCompleto('scid2', this.items.length);
  },

  calcular() {
    const data = this.obtenerRespuestas();
    const totalSi = data.filter(r => r === 1).length;
    const totalNo = data.filter(r => r === 0).length;
    const porcentajeSi = ((totalSi / this.items.length) * 100).toFixed(1);

    // Interpretación preliminar (se actualizará con normas científicas)
    let nivel, label, color, texto;

    if (porcentajeSi < 20) {
      nivel = 0;
      label = 'Bajo riesgo de trastorno de personalidad';
      color = '#276749';
      texto = `Respuestas afirmativas: ${totalSi}/119 (${porcentajeSi}%) - Pocas características de trastorno de personalidad detectadas.`;
    } else if (porcentajeSi < 40) {
      nivel = 1;
      label = 'Riesgo leve';
      color = '#0284c7';
      texto = `Respuestas afirmativas: ${totalSi}/119 (${porcentajeSi}%) - Algunas características de trastorno de personalidad presentes.`;
    } else if (porcentajeSi < 60) {
      nivel = 2;
      label = 'Riesgo moderado';
      color = '#f97316';
      texto = `Respuestas afirmativas: ${totalSi}/119 (${porcentajeSi}%) - Características significativas de trastorno de personalidad.`;
    } else if (porcentajeSi < 80) {
      nivel = 3;
      label = 'Riesgo alto';
      color = '#d97706';
      texto = `Respuestas afirmativas: ${totalSi}/119 (${porcentajeSi}%) - Características muy significativas de trastorno de personalidad.`;
    } else {
      nivel = 4;
      label = 'Riesgo muy alto';
      color = '#dc2626';
      texto = `Respuestas afirmativas: ${totalSi}/119 (${porcentajeSi}%) - Requiere evaluación clínica detallada para diagnóstico diferencial.`;
    }

    return {
      total: totalSi,
      totalSi,
      totalNo,
      porcentajeSi,
      nivel,
      label,
      color,
      texto
    };
  }
};
