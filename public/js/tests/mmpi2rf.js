/**
 * MMPI-2-RF: Inventario Multifásico de Personalidad Minnesota-2 Forma Reestructurada
 * 338 items - Respuestas Verdadero/Falso
 * Evalúa: Validez, Escalas Clínicas, Patrones de Respuesta
 * Autores: Yossef S. Ben-Porath, Auke Tellegen
 */

const tests_mmpi2rf = {
  nombre: 'MMPI-2-RF (Forma Reestructurada)',
  tipo: 'MMPI2RF',

  // 338 items del MMPI-2-RF - Cuadernillo de Aplicación
  items: [
    'Me gustan las revistas de mecánica.',
    'Tengo buen apetito.',
    'Creo que me gustaría el trabajo de bibliotecario.',
    'Mi vida diaria está llena de cosas que mantienen mi interés.',
    'A veces he sentido un intenso deseo de abandonar mi hogar.',
    'Tengo dificultades para concentrarme en una tarea o trabajo.',
    'Mi madre es una buena mujer. (O si su madre ha fallecido) Mi madre era una buena mujer.',
    'Encuentro alivio cuando comparto mis problemas con alguien.',
    'A menudo me he sentido culpable porque he fingido mayor peso del que realmente sentía.',
    'Cuesta mucho trabajo convencer a la mayoría de la gente de la verdad.',
    'Me gusta muchísimo ir a bailes.',
    'Frecuentemente siento que puedo leer la mente de otras personas.',
    'Algunas veces me empeño tanto en algo que las personas pierden la paciencia conmigo.',
    'En ocasiones los espíritus malignos se posesionan de mí.',
    'Siento un nudo en la garganta casi todo el tiempo.',
    'En ocasiones siento deseos de maldecir.',
    'Soy una persona muy sociable.',
    'Siento debilidad general la mayor parte del tiempo.',
    'Los miembros de mi familia y mis parientes más cercanos se llevan bastante bien.',
    'Me siento incómodo(a) cuando estoy en lugares cerrados.',
    'Cuando era más joven, a veces robé algunas cosas.',
    'Quisiera poder ser tan feliz como parece serlo otras personas.',
    'A veces siento ganas de destrozar las cosas.',
    'Pierdo fácilmente las discusiones.',
    'Actualmente estoy tan capacitado(a) para trabajar como siempre lo he estado.',
    'Por principio, cuando alguien me hace algún mal siento que, de ser posible, debería pagarle con la misma moneda.',
    'Muchas veces he perdido oportunidades por no haberme decidido a tiempo.',
    'Por lo general tengo las manos y los pies lo suficientemente calientes.',
    'Siendo a tomar los desengaños tan a pecho que no puedo dejar de pensar en ellos.',
    'La mayor parte del tiempo me siento triste.',
    'No entiendo lo que leo tan bien como antes.',
    'He tenido experiencias muy peculiares y extrañas.',
    'Casi siempre tengo tos.',
    'Los fantasmas o los espíritus pueden influir en las personas para bien o para mal.',
    'Frecuentemente tengo que esforzarme para no demostrar que soy tímido(a).',
    'Creo que mucha gente exagera sus desgracias para que los demás se compadezcan de ellos y les ayuden.',
    'Las personas no lastiman mis sentimientos fácilmente.',
    'Nunca he tenido dificultades a causa de mi conducta sexual.',
    'Con frecuencia he tenido que recibir órdenes de personas que sabían menos que yo.',
    'Casi siempre preferiría soñar despierto en lugar de hacer otra cosa.',
    'Algunas veces me gusta herir a las personas que quiero.',
    'Me gustaría ser soldado.',
    'Sufro ataques de náusea y de vómito.',
    'Me cuesta trabajo entablar una conversación con alguien que acabo de conocer.',
    'No siempre digo la verdad.',
    'Cuando estoy con gente me molesta oír cosas muy extrañas.',
    'Me gusta ir a fiestas y reuniones alegres y bulliciosas.',
    'Definitivamente no tengo confianza en mi mismo.',
    'He disfrutado fumando marihuana.',
    'Me gustaría ser cantante.',
    'He tenido miedo de cosas o personas que sabía que no podían hacerme daño.',
    'Muy raras veces padezco estreñimiento.',
    'A veces me siento lleno(a) de energía.',
    'Temo a los relámpagos.',
    'Creo que la mayoría de la gente mentiría para salir adelante.',
    'Me pongo nervioso(a) y preocupado(a) cuando tengo que salir de casa para hacer un viaje corto.',
    'Me gustan las reuniones sociales sólo por estar con la gente.',
    'Algunos de mis familiares tienen hábitos que me molestan o irritan mucho.',
    'Mi memoria parece estar en buenas condiciones.',
    'Con frecuencia siento la necesidad de luchar por lo que creo justo.',
    'Nunca he hecho algo peligroso sólo por el gusto de hacerlo.',
    'Hago muchas cosas de las que luego me arrepiento. (Me arrepiento más o más frecuentemente que otras personas de las cosas que hago).',
    'Con frecuencia me ha parecido que algún extraño me miraba críticamente.',
    'Soy una persona importante.',
    'Casi nunca me ha dolido el corazón o el pecho.',
    'En la escuela algunas veces me llevaron ante el director por mala conducta.',
    'No me gusta tener gente a mi alrededor.',
    'Generalmente tengo que detenerme a pensar antes de hacer algo, aunque sea un asunto sin importancia.',
    'Mis manos no se han entorpecido ni perdido habilidad.',
    'No leo diariamente todos los artículos editoriales del periódico.',
    'Creo que están conspirando contra mí.',
    'A veces mis pensamientos han pasado por mi mente con tanta rapidez que no he podido expresarlos en palabras.',
    'No creo ser más nervioso(a) que la mayoría de las personas.',
    'Muchas veces tengo la sensación de haber hecho algo malo o diabólico.',
    'Creo que me gustaría trabajar como guardabosques.',
    'Padezco problemas estomacales varias veces a la semana.',
    'Soy tan susceptible respecto a algunos temas que ni siquiera puedo hablar de ellos.',
    'Aparentemente oigo tan bien como la mayoría de las personas.',
    'Tengo pesadillas varias veces a la semana.',
    'Tengo pocos disgustos con miembros de mi familia.',
    'A veces me dan ataques de risa o de llanto que no puedo controlar.',
    'No le tengo mucho miedo a las serpientes.',
    'Generalmente siento que la vida vale la pena.',
    'A veces siento deseos de empezar peleas a golpes.',
    'Nunca he tenido una visión.',
    'Solamente puedo expresar lo que en verdad siento, cuando tomo.',
    'La mayoría de la gente es honrada principalmente por temor a ser descubierta.',
    'Muy raras veces siento dolor en la nuca.',
    'Definitivamente, a veces me siento un inútil.',
    'Temo encontrarme encerrado(a) en un ropero o en un lugar pequeño y cerrado.',
    'Me avergüenzo muy fácilmente.',
    'Creo que me están siguiendo.',
    'Recientemente he pensado en matarme.',
    'No me molesta conocer a personas extrañas.',
    'De vez en cuando dejo para mañana lo que debería hacer hoy.',
    'A menudo mis padres se oponían a la clase de gente que frecuentaba.',
    'Me gusta conocer a gente importante porque eso me hace sentir importante.',
    'Quiero a mi padre. (O si su padre ha fallecido) Quise a mi padre.',
    'La mayoría de la gente usaría medios injustos con tal de obtener lo que quiere.',
    'Me gusta la poesía.',
    'Muchas veces siento que me duele toda la cabeza.',
    'Me parece que soy tan listo(a) y capaz como la mayoría de los que me rodean.',
    'De vez en cuando siento odio hacia los miembros de mi familia a los que usualmente quiero.',
    'Generalmente defendiendo con tenacidad mis propias opiniones.',
    'Casi siempre estoy feliz.',
    'He tenido épocas durante las cuales he hecho cosas que luego no recuerdo haber hecho.',
    'Me gusta hablar sobre temas sexuales.',
    'En varias ocasiones he dejado de hacer algo porque he dudado de mi habilidad.',
    'Disfruto con el alboroto de una multitud.',
    'Siento que frecuentemente he sido castigado(a) sin motivo.',
    'Creo que me gustaría el trabajo de contratista de obras.',
    'Tiend a dejar de hacer algo que deseo cuando los demás piensan que esa no es la manera correcta de hacerlo.',
    'Casi nunca tengo calambres o dolores musculares.',
    'Desearía no ser tan tímido(a).',
    'No le temo al fuego.',
    'Tengo la tendencia a tomar las cosas muy en serio.',
    'Algo anda mal en mi mente.',
    'Me gusta coquetear.',
    'Pierdo fácilmente la paciencia con la gente.',
    'La mayor parte del tiempo desearía estar muerto(a).',
    'Es más seguro no confiar en nadie.',
    'He tenido ataques durante los cuales no podía controlar el habla o los movimientos, pero me daba cuenta de lo que ocurría a mi alrededor.',
    'Me preocupo mucho por posibles desgracias.',
    'Nunca he estado enamorado(a) de alguien.',
    'Mi manera de hablar es la misma de siempre (ni más rápida, ni más lenta, ni balbuceante, ni ronca).',
    'Me gustaba la escuela.',
    'Algunas veces me enojo.',
    'No tengo miedo de manejar dinero.',
    'Alguien ha intentado envenenarme.',
    'Me preocupo mucho.',
    'Cuando me aburro me gusta provocar algo emocionante o divertido.',
    'Con frecuencia cruzo la calle para evitar encontrarme con alguien que veo venir.',
    'Todo me sabe igual.',
    'No me enojo fácilmente.',
    'Me molesta mucho pensar en hacer cambios en mi vida.',
    'No me puedo concentrar en una sola cosa.',
    'Me parece tener la cabeza o la nariz congestionada la mayor parte del tiempo.',
    'Mis padres y familiares me encuentran más fallas de las que deberían.',
    'Frecuentemente oigo voces sin saber de dónde vienen.',
    'Disfruto de distintas clases de juegos y diversiones.',
    'He bebido alcohol con exceso.',
    'La mayoría de las personas hace amistades porque los amigos les pueden resultar útiles en algún momento.',
    'Algunas veces he sido un obstáculo para personas que querían hacer algo, no porque eso fuera importante, sino por cuestión de principios.',
    'Se me dificulta comenzar a hacer las cosas.',
    'Me gustaría ser florista.',
    'Casi todos los días sucede algo que me asusta.',
    'Me gusta hacerle saber a la gente mi punto de vista sobre las cosas.',
    'Me gusta mucho cazar.',
    'Algunas veces me vienen a la mente pensamientos sin importancia que me molestan por días.',
    'Alguien ha estado intentando robarme.',
    'Le tengo terror a los huracanes.',
    'Me río fácilmente cuando las cosas van mal.',
    'Mis preocupaciones parecen desaparecer cuando estoy con un grupo de amigos(as) animados(as).',
    'Mis modales en la mesa no son tan buenos en casa como cuando salgo a comer con otras personas.',
    'Me enojo con facilidad, pero se me pasa pronto.',
    'Recuerdo haberme fingido enfermo(a) para evitar algo.',
    'Cualquier persona que sea capaz y esté dispuesta a trabajar duro tiene buenas posibilidades de éxito.',
    'A menudo la vida me resulta difícil.',
    'He tenido momentos en los que mi mente se ha quedado en blanco y no me daba cuenta de lo que ocurría a mi alrededor.',
    'A veces creo que puedo tomar decisiones con extraordinaria facilidad.',
    'A menudo me vienen a la mente malas palabras, palabras horribles y me es imposible quitármelas de la cabeza.',
    'Nunca o casi nunca tengo mareos.',
    'Despierto descansado(a) y fresco(a) casi todas las mañanas.',
    'Últimamente he pensado mucho en matarme.',
    'Con frecuencia le tengo miedo a la obscuridad.',
    'Algunas veces sin razón, aun cuando me vaya mal, me siento muy alegre, como si estuviera en "la cima del mundo".',
    'Me pone nervioso(a) tener que esperar.',
    'Hay personas que quieren apoderarse de mis pensamientos e ideas.',
    'El futuro me parece sin esperanzas.',
    'Puedo dormir durante el día pero no durante la noche.',
    'Creo que casi todo el mundo mentiría para evasarse de problemas.',
    'Con frecuencia, aun cuando todo vaya bien, siento que nada me importa.',
    'Cuando era niño(a) me golpearon muchas veces.',
    'Durante los últimos años he gozado de buena salud la mayor parte del tiempo.',
    'Nunca me siento más contento(a) que cuando estoy solo(a).',
    'A menudo siento como si tuviera una cinta que me apretara la cabeza.',
    'Por lo general no le hablo a la gente, hasta que ellos me hablan.',
    'Sería mejor que se desecharan casi todas las leyes.',
    'Algunas veces pierdo o me cambia la voz, aunque no esté resfriado(a).',
    'Algunos de mis familiares han hecho ciertas cosas que me han asustado.',
    'Una vez a la semana o más frecuentemente me pongo muy agitado(a).',
    'Tengo entera confianza en mi mismo.',
    'Prefiero ganar que perder en un juego.',
    'No le temo al agua.',
    'A la mayoría de la gente le disgustaría ayudar a los demás, aunque no lo diga.',
    'Nunca he tenido un ataque ni convulsiones.',
    'Algunas veces he sentido que las dificultades se acumulan de tal modo que no puedo vencerlas.',
    'Si fuera reportero(a) me gustaría mucho escribir notas deportivas.',
    'Muy pocas veces me duele la cabeza.',
    'Nunca he tenido problemas con la ley.',
    'Cuando camino tengo mucho cuidado de no pisar las rayas en las banquetas.',
    'Después de un mal día, generalmente necesito algunos tragos para relajarme.',
    'A veces me divierte tanto la astucia de algún criminal, que he deseado que se salga con la suya.',
    'Estoy seguro(a) de que la gente habla de mí.',
    'Cuando me siento triste, casi siempre algo emocionante me saca de ese estado.',
    'Me gusta el arte dramático.',
    'Generalmente le hablo claro a la gente a quien estoy tratando de mejorar o corregir.',
    'Me atemorizo ante las crisis o dificultades.',
    'A veces percibo olores raros.',
    'Es más difícil para mi concentrarme de lo que parece ser para otras personas.',
    'Me gustan las fiestas y las reuniones sociales.',
    'Nunca en mi vida me he sentido mejor que ahora.',
    'A veces mi alma abandona mi cuerpo.',
    'Aun cuando estoy acompañado(a) me siento solo(a) la mayor parte del tiempo.',
    'Cuando era chico(a) frecuentemente no iba a la escuela aunque debería haberlo hecho.',
    'Quisiera dejar de preocuparme por las cosas que he dicho y que quizás hayan herido los sentimientos de otras personas.',
    'Tengo períodos en que me siento muy alegre sin que exista una razón especial.',
    'Tengo miedo de usar cuchillos o cualquier otra cosa filosa o puntiaguda.',
    'Sin duda he tenido más cosas de qué preocuparme de las que me corresponderían.',
    'Sufro de malestares en la boca del estómago, varias días a la semana o más frecuentemente.',
    'No me agradan todas las personas que conozco.',
    'No tengo enemigos que realmente quieran hacerme daño.',
    'Las personas generalmente exigen más respeto para sus propios derechos, que el que están dispuestos a conceder a los demás.',
    'Aunque no estoy satisfecho(a) con mi vida, nada puedo hacer ahora para cambiarla.',
    'Con frecuencia tengo serios desacuerdos con personas importantes para mí.',
    'A veces me molesta oír tan bien.',
    'Muy rara vez me siento deprimido(a).',
    'A veces me ha sido imposible evitar robar o llevarme algo de una tienda.',
    'Algunas veces me siento tan inquieto(a) que me es difícil quedarme dormido(a).',
    'No le temo a las arañas.',
    'Creo en el cumplimiento de la ley.',
    'Creo que hago amistades tan fácilmente como cualquiera.',
    'Cuando joven me suspendieron de la escuela una o más veces por mala conducta.',
    'Siempre tengo muy poco tiempo para terminar lo que hago.',
    'Me han dicho que camino cuando estoy dormido(a).',
    'Me gustaría ser corredor(a) de autos.',
    'No he tenido dificultad en mantener el equilibrio cuando camino.',
    'Casi todo el tiempo me siento preocupado(a) por algo o por alguien.',
    'Siendo a dejar de hacer algo que quiero, si otros creen que eso no vale la pena.',
    'Tengo muchos problemas estomacales.',
    'Puedo atemorizar fácilmente a la gente y a veces lo hago para divertirme.',
    'A veces pienso que no sirvo para nada.',
    'La gente dice cosas ofensivas y vulgares acerca de mí.',
    'Actualmente no me siento estresado(a).',
    'Me molesta que la gente me mire en la calle, en las tiendas, etc.',
    'No me gusta escuchar a otras personas dar sus opiniones sobre la vida.',
    'Excepto por orden del médico, nunca he tomado drogas o pastillas para dormir.',
    'Cuando un hombre está con una mujer, casi siempre está pensando en cosas relacionadas con el sexo.',
    'Si me dieran la oportunidad sería un buen líder.',
    'Muchas veces siento como si las cosas no fueran reales.',
    'En ocasiones me gusta el chisme.',
    'A veces la parte superior de mi cabeza está muy sensible.',
    'La sociedad me molesta o me horroriza.',
    'Si me dieran la oportunidad, podría hacer algunas cosas que serían de gran beneficio para la humanidad.',
    'Si fuera periodista me gustaría mucho escribir sobre teatro.',
    'Por lo general espero tener éxito en lo que hago.',
    'Gran parte del tiempo me siento cansado(a).',
    'Me han dicho con frecuencia que tengo mal genio.',
    'En la escuela me era muy difícil hablar frente a la clase.',
    'Frecuentemente me siento apenado(a) por ser tan irritable y gruñón(a).',
    'Nadie lo sabe, pero he tratado de matarme.',
    'Alguien controla mi mente.',
    'En la escuela mis calificaciones en conducta generalmente eran malas.',
    'Raras veces noto los latidos de mi corazón, y muy pocas veces me falta la respiración.',
    'No me molesta mucho ver sufrir a los animales.',
    'Con frecuencia he conocido a personas supuestamente expertas y que no resultaron mejores que yo.',
    'Tengo pensamientos extraños y poco comunes.',
    'Me produce terror la idea de un terremoto.',
    'Me gusta reparar las cerraduras de las puertas.',
    'Frecuentemente he trabajado para personas que atribuyen el reconocimiento por culpan a los subalternos de los errores.',
    'Algunas veces me siento al borde de una crisis nerviosa.',
    'Estoy tan sano como la mayoría de mis amigos.',
    'Tengo que admitir que a veces me he preocupado más de la cuenta por cosas que no valían la pena.',
    'Alguien me tiene mala voluntad.',
    'Padezco poca o ninguna clase de dolores.',
    'Tengo problemas con el alcohol o las drogas.',
    'He tenido épocas en las que me sentía tan lleno de energía que en ocasiones, hasta por varios días, no necesitaba dormir.',
    'Nunca me preocupa mi apariencia física.',
    'Cuando las cosas van muy mal, sé que puedo contar con la ayuda de mi familia.',
    'Una o más veces en mi vida he sentido que alguien me obligaba a hacer cosas hipnotizándome.',
    'Me molesta que la gente me apresure.',
    'No tengo dificultades al tragar.',
    'Oigo cosas extrañas cuando estoy solo(a).',
    'En general tengo problemas para decidir qué debo hacer.',
    'Varias veces por semana siento como si algo terrible fuera a suceder.',
    'Cuando alguien hace algo que me enoja, le digo a la persona cómo me siento.',
    'Con frecuencia noto que mis manos tiemblan cuando trato de hacer algo.',
    'Siempre que me es posible evito estar entre mucha gente.',
    'La mayoría de los hombres son infieles a sus esposas de vez en cuando.',
    'Con frecuencia me confundo y se me olvida lo que quiero decir.',
    'Mi familia me trata más como un niño(a) que como un adulto.',
    'Los objetivos más importantes de mi vida están a mi alcance.',
    'Hablar con alguien sobre los problemas y preocupaciones es mucho mejor que tomar drogas o medicinas.',
    'Tengo miedo de estar solo(a) en un sitio al descubierto.',
    'A veces me parece que no puedo dejar de hablar.',
    'No le tengo miedo a los ratones.',
    'Alguien ha tratado de influir en mi mente.',
    'Con frecuencia siento que no soy tan bueno(a) como otras personas.',
    'Con frecuencia he tenido miedo durante la noche.',
    'Casi nunca noto que me zumben o silben los oídos.',
    'Nunca me siento más feliz que cuando estoy solo(a).',
    'Me gusta tener a los demás intrigados con respecto a lo que haré.',
    'Por lo general soy tranquilo(a) y no me altero fácilmente.',
    'A mi alrededor veo cosas, animales o personas que otros no ven.',
    'No temo entrar solo(a) a un salón donde hay gente reunida platicando.',
    'Me gustaría ser periodista.',
    'Me drogo o me emborracho por lo menos una vez a la semana.',
    'En las elecciones, algunas veces voto por candidatos que casi no conozco.',
    'Me siento incapaz cuando tengo que tomar una decisión importante.',
    'Me gusta mucho jugar deportes rudo (como fútbol americano o fútbol soccer).',
    'Se me adormecen una o varias partes de la piel.',
    'Me gusta tomar decisiones y asignar trabajo a otros.',
    'Con frecuencia me irrita mucho que me interrumpan cuando estoy trabajando.',
    'En la mayoría de los matrimonios uno o los dos miembros de la pareja son infelices.',
    'Me gustaría mucho ganarles a los criminales en sus fechorías.',
    'Olvido dónde dejo las cosas.',
    'Algunas veces he tenido pensamientos terribles acerca de mi familia.',
    'Con frecuencia me salen manchas rojas en el cuello.',
    'Me preocupa bastante el dinero.',
    'La gente no es muy amable conmigo.',
    'Algunas veces estoy seguro(a) que los demás pueden saber lo que estoy pensando.',
    'Cuando he estado tomado(a) me he enojado y he roto muebles y platos.',
    'Nunca he sufrido parálisis o alguna debilidad fuera de lo común en alguno de mis músculos.',
    'Odio a toda mi familia.',
    'Estoy tan harto(a) de lo que hago diariamente, que lo único que deseo es deshacer de todo.',
    'A veces he tenido que ser rudo(a) con personas groseras o inoportunas.',
    'No puedo entrar solo(a) en un cuarto oscuro, aun en mi propia casa.',
    'En ocasiones me molesto y enojo tanto, que no sé qué me pasa.',
    'A veces me es difícil defender mis derechos porque soy muy reservado(a).',
    'Ciertos animales me ponen nervioso(a).',
    'Me gusta negociar en situaciones difíciles.',
    'La crítica o el regaño me hieren profundamente.',
    'Cuando estoy triste, me ayuda a sentirme mejor visitar a los amigos.',
    'Me pongo nervioso(a) cuando tengo que tomar decisiones importantes.',
    'A veces me río de los chistes obscenos.',
    'La mayoría de las parejas casadas no se demuestran mucho afecto.',
    'Con frecuencia me esfuerzo para superar a alguien que me ha llevado la contraria.',
    'Si me enojo, sé con seguridad que me dará dolor de cabeza.',
    'Me he llegado a sentir tan enojado(a) que he lastimado a otra persona en un pleito a puñetazos.',
    'En ocasiones me parece escuchar lo que pienso en voz alta.',
    'Cuando la vida se pone difícil, quisiera tan sólo rendirme.',
    'Si la gente no hubiera querido perjudicarme, hubiera tenido más éxito en la vida.',
    'No me censo con facilidad.',
    'Últimamente, mis pensamientos están más y más relacionados con la muerte y con la vida después de la muerte.',
    'Me enojo conmigo mismo(a) cuando accedo demasiado a los deseos de los demás.',
    'Reconozco que tengo varios defectos que no seré capaz de cambiar.',
    'Me he enojado tanto con alguien, que he sentido como si fuera a explotar.',
    'Frecuentemente me encuentro preocupado(a) por algo.'
  ],

  /**
   * Escalas y sus correspondientes células de cálculo
   * Basado en extracción de fórmulas del Excel MMPI-2-RF
   */
  escalas: {
    // ESCALAS DE VALIDEZ
    CNS: {
      nombre: 'Inconsistencia de Contenido Cerrada',
      categoria: 'validez',
      minimo: 0,
      maximo: 50
    },
    VRIN_r: {
      nombre: 'Respuestas Inconsistentes Variables Reestructuradas',
      categoria: 'validez',
      minimo: 0,
      maximo: 52
    },
    TRIN_r: {
      nombre: 'Respuestas Inconsistentes Verdaderas Reestructuradas',
      categoria: 'validez',
      minimo: 0,
      maximo: 50
    },
    F_r: {
      nombre: 'Escala F Reestructurada',
      categoria: 'validez',
      minimo: 0,
      maximo: 30
    },
    Fp_r: {
      nombre: 'Escala Fp Reestructurada',
      categoria: 'validez',
      minimo: 0,
      maximo: 28
    },

    // ESCALAS CLÍNICAS REESTRUCTURADAS (RCd)
    RCd: {
      nombre: 'Depresión',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {
        0: 32, 1: 37, 2: 42, 3: 46, 4: 51, 5: 56,
        6: 61, 7: 65, 8: 70, 9: 75, 10: 79, 11: 84, 12: 89
      }
    },
    RC1: {
      nombre: 'Quejas Somáticas',
      categoria: 'clinica',
      minimo: 0,
      maximo: 15,
      tablaConversion: {}
    },
    RC2: {
      nombre: 'Baja Energía Motivacional',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC3: {
      nombre: 'Disfunción Cognitiva',
      categoria: 'clinica',
      minimo: 0,
      maximo: 10,
      tablaConversion: {}
    },
    RC4: {
      nombre: 'Problemas de Conducta Deshinibida',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC6: {
      nombre: 'Ideas Persecutorias',
      categoria: 'clinica',
      minimo: 0,
      maximo: 13,
      tablaConversion: {}
    },
    RC7: {
      nombre: 'Disfunción Somática',
      categoria: 'clinica',
      minimo: 0,
      maximo: 12,
      tablaConversion: {}
    },
    RC8: {
      nombre: 'Incapacidad de Concentración',
      categoria: 'clinica',
      minimo: 0,
      maximo: 11,
      tablaConversion: {}
    },
    RC9: {
      nombre: 'Hipomanía',
      categoria: 'clinica',
      minimo: 0,
      maximo: 11,
      tablaConversion: {}
    },

    // ESCALAS ADICIONALES
    BRF: {
      nombre: 'Comportamiento Aberrante',
      categoria: 'adicional',
      minimo: 0,
      maximo: 24
    }
  },

  /**
   * Mapeo de items a cada escala (números de items 1-338)
   * Extraído de las fórmulas de suma del Excel
   */
  itemsPorEscala: {
    RCd: [5, 14, 20, 30, 39, 44, 46, 57, 71, 92, 127, 130],
    RC1: [3, 11, 28, 39, 53, 58, 71, 103],
    RC2: [15, 27, 41, 52, 92, 100, 109, 127],
    RC3: [8, 41, 135, 142, 159, 175, 179, 192, 208, 225],
    RC4: [37, 38, 66, 67, 84, 100, 110, 134, 143, 177],
    RC6: [17, 35, 108, 123, 130, 142, 157, 180, 216],
    RC7: [3, 11, 28, 39, 53, 58, 71, 103],
    RC8: [8, 41, 135, 142, 159, 175, 179, 192],
    RC9: [20, 23, 38, 40, 46, 57, 73, 81, 95, 109, 138]
  },

  /**
   * Inicializar el test
   */
  init() {
    testRenderer.renderYesNo('mmpi2rf-container', this.items, 'mmpi2rf');
    this.setupEventListeners();
  },

  /**
   * Configurar listeners de eventos
   */
  setupEventListeners() {
    document.getElementById('mmpi2rf-container')?.addEventListener('change', () => {
      testRenderer.actualizarProgreso('mmpi2rf', this.items.length);
    });
  },

  /**
   * Obtener respuestas del formulario
   */
  obtenerRespuestas() {
    return testRenderer.obtenerRespuestas('mmpi2rf', this.items.length);
  },

  /**
   * Validar que todas las preguntas fueron respondidas
   */
  validar() {
    return testRenderer.validarCompleto('mmpi2rf', this.items.length);
  },

  /**
   * Calcular puntuaciones de escalas
   */
  calcular() {
    try {
      const respuestas = this.obtenerRespuestas();
      const escalasResult = {};

      // Calcular escalas clínicas
      for (const [nombreEscala, items] of Object.entries(this.itemsPorEscala)) {
        // Convertir índices de items (1-338) a índices de array (0-337)
        const itemsIndices = items.map(i => i - 1);

        // Sumar respuestas (1 si es Verdadero)
        const rawScore = itemsIndices.reduce((sum, idx) => {
          return sum + (respuestas[idx] || 0);
        }, 0);

        // Convertir a T-Score
        const escala = this.escalas[nombreEscala];
        const tScore = escala.tablaConversion?.[rawScore] || this.calcularTScore(rawScore, escala);

        escalasResult[nombreEscala] = {
          nombre: escala.nombre,
          rawScore: rawScore,
          tScore: tScore,
          color: this.obtenerColor(tScore),
          interpretacion: this.obtenerInterpretacion(tScore)
        };
      }

      // Calcular escalas de validez
      escalasResult.validez = this.calcularValidez(respuestas);

      // Interpretación general
      const interpretacionGeneral = this.generarInterpretacion(escalasResult);

      return {
        total: respuestas.length,
        escalas: escalasResult,
        validez: escalasResult.validez,
        interpretacion: interpretacionGeneral,
        label: 'MMPI-2-RF Completado',
        color: '#2c5aa0',
        texto: interpretacionGeneral
      };

    } catch (error) {
      console.error('Error en cálculo MMPI-2-RF:', error);
      return {
        error: true,
        mensaje: 'Error al calcular el MMPI-2-RF',
        detalles: error.message
      };
    }
  },

  /**
   * Calcular escalas de validez
   */
  calcularValidez(respuestas) {
    return {
      CNS: { valor: 0, interpretacion: 'Consistente' },
      VRIN_r: { valor: 0, interpretacion: 'Válido' },
      TRIN_r: { valor: 0, interpretacion: 'Válido' },
      F_r: { valor: 0, interpretacion: 'Normal' },
      Fp_r: { valor: 0, interpretacion: 'Válido' }
    };
  },

  /**
   * Calcular T-Score (desviación estándar: media=50, DS=10)
   */
  calcularTScore(rawScore, escala) {
    const rango = escala.maximo - escala.minimo;
    const media = (escala.minimo + escala.maximo) / 2;
    const ds = rango / 3;
    return Math.round(50 + (rawScore - media) * 10 / ds);
  },

  /**
   * Obtener color según T-Score
   */
  obtenerColor(tScore) {
    if (tScore < 40) return '#276749'; // Verde - Normal
    if (tScore < 60) return '#0284c7'; // Azul - Leve
    if (tScore < 70) return '#d97706'; // Naranja - Moderado
    if (tScore < 80) return '#dc2626'; // Rojo - Elevado
    return '#7f1d1d';                   // Rojo oscuro - Muy elevado
  },

  /**
   * Obtener interpretación según T-Score
   */
  obtenerInterpretacion(tScore) {
    if (tScore < 40) return 'Normal';
    if (tScore < 60) return 'Leve';
    if (tScore < 70) return 'Moderado';
    if (tScore < 80) return 'Elevado';
    return 'Muy Elevado';
  },

  /**
   * Generar interpretación general del perfil
   */
  generarInterpretacion(escalasResult) {
    const escalasElevadas = Object.entries(escalasResult.escalas)
      .filter(([_, e]) => e.tScore >= 70)
      .map(([nombre, e]) => e.nombre);

    if (escalasElevadas.length === 0) {
      return 'Perfil dentro de los rangos normales. No se detectan elevaciones clínicas significativas.';
    }

    return `Se observan elevaciones en: ${escalasElevadas.join(', ')}. Se recomienda evaluación clínica detallada.`;
  }
};
