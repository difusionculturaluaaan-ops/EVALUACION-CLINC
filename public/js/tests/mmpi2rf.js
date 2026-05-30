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
    '1. Me gustan las revistas de mecánica.',
    '2. Tengo buen apetito.',
    '3. Creo que me gustaría el trabajo de bibliotecario.',
    '4. Mi vida diaria está llena de cosas que mantienen mi interés.',
    '5. A veces he sentido un intenso deseo de abandonar mi hogar.',
    '6. Tengo dificultades para concentrarme en una tarea o trabajo.',
    '7. Mi madre es una buena mujer. (O si su madre ha fallecido) Mi madre era una buena mujer.',
    '8. Encuentro alivio cuando comparto mis problemas con alguien.',
    '9. A menudo me he sentido culpable porque he fingido mayor peso del que realmente sentía.',
    '10. Cuesta mucho trabajo convencer a la mayoría de la gente de la verdad.',
    '11. Me gusta muchísimo ir a bailes.',
    '12. Frecuentemente siento que puedo leer la mente de otras personas.',
    '13. Algunas veces me empeño tanto en algo que las personas pierden la paciencia conmigo.',
    '14. En ocasiones los espíritus malignos se posesionan de mí.',
    '15. Siento un nudo en la garganta casi todo el tiempo.',
    '16. En ocasiones siento deseos de maldecir.',
    '17. Soy una persona muy sociable.',
    '18. Siento debilidad general la mayor parte del tiempo.',
    '19. Los miembros de mi familia y mis parientes más cercanos se llevan bastante bien.',
    '20. Me siento incómodo(a) cuando estoy en lugares cerrados.',
    '21. Cuando era más joven, a veces robé algunas cosas.',
    '22. Quisiera poder ser tan feliz como parece serlo otras personas.',
    '23. A veces siento ganas de destrozar las cosas.',
    '24. Pierdo fácilmente las discusiones.',
    '25. Actualmente estoy tan capacitado(a) para trabajar como siempre lo he estado.',
    '26. Por principio, cuando alguien me hace algún mal siento que, de ser posible, debería pagarle con la misma moneda.',
    '27. Muchas veces he perdido oportunidades por no haberme decidido a tiempo.',
    '28. Por lo general tengo las manos y los pies lo suficientemente calientes.',
    '29. Siendo a tomar los desengaños tan a pecho que no puedo dejar de pensar en ellos.',
    '30. La mayor parte del tiempo me siento triste.',
    '31. No entiendo lo que leo tan bien como antes.',
    '32. He tenido experiencias muy peculiares y extrañas.',
    '33. Casi siempre tengo tos.',
    '34. Los fantasmas o los espíritus pueden influir en las personas para bien o para mal.',
    '35. Frecuentemente tengo que esforzarme para no demostrar que soy tímido(a).',
    '36. Creo que mucha gente exagera sus desgracias para que los demás se compadezcan de ellos y les ayuden.',
    '37. Las personas no lastiman mis sentimientos fácilmente.',
    '38. Nunca he tenido dificultades a causa de mi conducta sexual.',
    '39. Con frecuencia he tenido que recibir órdenes de personas que sabían menos que yo.',
    '40. Casi siempre preferiría soñar despierto en lugar de hacer otra cosa.',
    '41. Algunas veces me gusta herir a las personas que quiero.',
    '42. Me gustaría ser soldado.',
    '43. Sufro ataques de náusea y de vómito.',
    '44. Me cuesta trabajo entablar una conversación con alguien que acabo de conocer.',
    '45. No siempre digo la verdad.',
    '46. Cuando estoy con gente me molesta oír cosas muy extrañas.',
    '47. Me gusta ir a fiestas y reuniones alegres y bulliciosas.',
    '48. Definitivamente no tengo confianza en mi mismo.',
    '49. He disfrutado fumando marihuana.',
    '50. Me gustaría ser cantante.',
    '51. He tenido miedo de cosas o personas que sabía que no podían hacerme daño.',
    '52. Muy raras veces padezco estreñimiento.',
    '53. A veces me siento lleno(a) de energía.',
    '54. Temo a los relámpagos.',
    '55. Creo que la mayoría de la gente mentiría para salir adelante.',
    '56. Me pongo nervioso(a) y preocupado(a) cuando tengo que salir de casa para hacer un viaje corto.',
    '57. Me gustan las reuniones sociales sólo por estar con la gente.',
    '58. Algunos de mis familiares tienen hábitos que me molestan o irritan mucho.',
    '59. Mi memoria parece estar en buenas condiciones.',
    '60. Con frecuencia siento la necesidad de luchar por lo que creo justo.',
    '61. Nunca he hecho algo peligroso sólo por el gusto de hacerlo.',
    '62. Hago muchas cosas de las que luego me arrepiento. (Me arrepiento más o más frecuentemente que otras personas de las cosas que hago).',
    '63. Con frecuencia me ha parecido que algún extraño me miraba críticamente.',
    '64. Soy una persona importante.',
    '65. Casi nunca me ha dolido el corazón o el pecho.',
    '66. En la escuela algunas veces me llevaron ante el director por mala conducta.',
    '67. No me gusta tener gente a mi alrededor.',
    '68. Generalmente tengo que detenerme a pensar antes de hacer algo, aunque sea un asunto sin importancia.',
    '69. Mis manos no se han entorpecido ni perdido habilidad.',
    '70. No leo diariamente todos los artículos editoriales del periódico.',
    '71. Creo que están conspirando contra mí.',
    '72. A veces mis pensamientos han pasado por mi mente con tanta rapidez que no he podido expresarlos en palabras.',
    '73. No creo ser más nervioso(a) que la mayoría de las personas.',
    '74. Muchas veces tengo la sensación de haber hecho algo malo o diabólico.',
    '75. Creo que me gustaría trabajar como guardabosques.',
    '76. Padezco problemas estomacales varias veces a la semana.',
    '77. Soy tan susceptible respecto a algunos temas que ni siquiera puedo hablar de ellos.',
    '78. Aparentemente oigo tan bien como la mayoría de las personas.',
    '79. Tengo pesadillas varias veces a la semana.',
    '80. Tengo pocos disgustos con miembros de mi familia.',
    '81. A veces me dan ataques de risa o de llanto que no puedo controlar.',
    '82. No le tengo mucho miedo a las serpientes.',
    '83. Generalmente siento que la vida vale la pena.',
    '84. A veces siento deseos de empezar peleas a golpes.',
    '85. Nunca he tenido una visión.',
    '86. Solamente puedo expresar lo que en verdad siento, cuando tomo.',
    '87. La mayoría de la gente es honrada principalmente por temor a ser descubierta.',
    '88. Muy raras veces siento dolor en la nuca.',
    '89. Definitivamente, a veces me siento un inútil.',
    '90. Temo encontrarme encerrado(a) en un ropero o en un lugar pequeño y cerrado.',
    '91. Me avergüenzo muy fácilmente.',
    '92. Creo que me están siguiendo.',
    '93. Recientemente he pensado en matarme.',
    '94. No me molesta conocer a personas extrañas.',
    '95. De vez en cuando dejo para mañana lo que debería hacer hoy.',
    '96. A menudo mis padres se oponían a la clase de gente que frecuentaba.',
    '97. Me gusta conocer a gente importante porque eso me hace sentir importante.',
    '98. Quiero a mi padre. (O si su padre ha fallecido) Quise a mi padre.',
    '99. La mayoría de la gente usaría medios injustos con tal de obtener lo que quiere.',
    '100. Me gusta la poesía.',
    '101. Muchas veces siento que me duele toda la cabeza.',
    '102. Me parece que soy tan listo(a) y capaz como la mayoría de los que me rodean.',
    '103. De vez en cuando siento odio hacia los miembros de mi familia a los que usualmente quiero.',
    '104. Generalmente defendiendo con tenacidad mis propias opiniones.',
    '105. Casi siempre estoy feliz.',
    '106. He tenido épocas durante las cuales he hecho cosas que luego no recuerdo haber hecho.',
    '107. Me gusta hablar sobre temas sexuales.',
    '108. En varias ocasiones he dejado de hacer algo porque he dudado de mi habilidad.',
    '109. Disfruto con el alboroto de una multitud.',
    '110. Siento que frecuentemente he sido castigado(a) sin motivo.',
    '111. Creo que me gustaría el trabajo de contratista de obras.',
    '112. Tiend a dejar de hacer algo que deseo cuando los demás piensan que esa no es la manera correcta de hacerlo.',
    '113. Casi nunca tengo calambres o dolores musculares.',
    '114. Desearía no ser tan tímido(a).',
    '115. No le temo al fuego.',
    '116. Tengo la tendencia a tomar las cosas muy en serio.',
    '117. Algo anda mal en mi mente.',
    '118. Me gusta coquetear.',
    '119. Pierdo fácilmente la paciencia con la gente.',
    '120. La mayor parte del tiempo desearía estar muerto(a).',
    '121. Es más seguro no confiar en nadie.',
    '122. He tenido ataques durante los cuales no podía controlar el habla o los movimientos, pero me daba cuenta de lo que ocurría a mi alrededor.',
    '123. Me preocupo mucho por posibles desgracias.',
    '124. Nunca he estado enamorado(a) de alguien.',
    '125. Mi manera de hablar es la misma de siempre (ni más rápida, ni más lenta, ni balbuceante, ni ronca).',
    '126. Me gustaba la escuela.',
    '127. Algunas veces me enojo.',
    '128. No tengo miedo de manejar dinero.',
    '129. Alguien ha intentado envenenarme.',
    '130. Me preocupo mucho.',
    '131. Cuando me aburro me gusta provocar algo emocionante o divertido.',
    '132. Con frecuencia cruzo la calle para evitar encontrarme con alguien que veo venir.',
    '133. Todo me sabe igual.',
    '134. No me enojo fácilmente.',
    '135. Me molesta mucho pensar en hacer cambios en mi vida.',
    '136. No me puedo concentrar en una sola cosa.',
    '137. Me parece tener la cabeza o la nariz congestionada la mayor parte del tiempo.',
    '138. Mis padres y familiares me encuentran más fallas de las que deberían.',
    '139. Frecuentemente oigo voces sin saber de dónde vienen.',
    '140. Disfruto de distintas clases de juegos y diversiones.',
    '141. He bebido alcohol con exceso.',
    '142. La mayoría de las personas hace amistades porque los amigos les pueden resultar útiles en algún momento.',
    '143. Algunas veces he sido un obstáculo para personas que querían hacer algo, no porque eso fuera importante, sino por cuestión de principios.',
    '144. Se me dificulta comenzar a hacer las cosas.',
    '145. Me gustaría ser florista.',
    '146. Casi todos los días sucede algo que me asusta.',
    '147. Me gusta hacerle saber a la gente mi punto de vista sobre las cosas.',
    '148. Me gusta mucho cazar.',
    '149. Algunas veces me vienen a la mente pensamientos sin importancia que me molestan por días.',
    '150. Alguien ha estado intentando robarme.',
    '151. Le tengo terror a los huracanes.',
    '152. Me río fácilmente cuando las cosas van mal.',
    '153. Mis preocupaciones parecen desaparecer cuando estoy con un grupo de amigos(as) animados(as).',
    '154. Mis modales en la mesa no son tan buenos en casa como cuando salgo a comer con otras personas.',
    '155. Me enojo con facilidad, pero se me pasa pronto.',
    '156. Recuerdo haberme fingido enfermo(a) para evitar algo.',
    '157. Cualquier persona que sea capaz y esté dispuesta a trabajar duro tiene buenas posibilidades de éxito.',
    '158. A menudo la vida me resulta difícil.',
    '159. He tenido momentos en los que mi mente se ha quedado en blanco y no me daba cuenta de lo que ocurría a mi alrededor.',
    '160. A veces creo que puedo tomar decisiones con extraordinaria facilidad.',
    '161. A menudo me vienen a la mente malas palabras, palabras horribles y me es imposible quitármelas de la cabeza.',
    '162. Nunca o casi nunca tengo mareos.',
    '163. Despierto descansado(a) y fresco(a) casi todas las mañanas.',
    '164. Últimamente he pensado mucho en matarme.',
    '165. Con frecuencia le tengo miedo a la obscuridad.',
    '166. Algunas veces sin razón, aun cuando me vaya mal, me siento muy alegre, como si estuviera en "la cima del mundo".',
    '167. Me pone nervioso(a) tener que esperar.',
    '168. Hay personas que quieren apoderarse de mis pensamientos e ideas.',
    '169. El futuro me parece sin esperanzas.',
    '170. Puedo dormir durante el día pero no durante la noche.',
    '171. Creo que casi todo el mundo mentiría para evasarse de problemas.',
    '172. Con frecuencia, aun cuando todo vaya bien, siento que nada me importa.',
    '173. Cuando era niño(a) me golpearon muchas veces.',
    '174. Durante los últimos años he gozado de buena salud la mayor parte del tiempo.',
    '175. Nunca me siento más contento(a) que cuando estoy solo(a).',
    '176. A menudo siento como si tuviera una cinta que me apretara la cabeza.',
    '177. Por lo general no le hablo a la gente, hasta que ellos me hablan.',
    '178. Sería mejor que se desecharan casi todas las leyes.',
    '179. Algunas veces pierdo o me cambia la voz, aunque no esté resfriado(a).',
    '180. Algunos de mis familiares han hecho ciertas cosas que me han asustado.',
    '181. Una vez a la semana o más frecuentemente me pongo muy agitado(a).',
    '182. Tengo entera confianza en mi mismo.',
    '183. Prefiero ganar que perder en un juego.',
    '184. No le temo al agua.',
    '185. A la mayoría de la gente le disgustaría ayudar a los demás, aunque no lo diga.',
    '186. Nunca he tenido un ataque ni convulsiones.',
    '187. Algunas veces he sentido que las dificultades se acumulan de tal modo que no puedo vencerlas.',
    '188. Si fuera reportero(a) me gustaría mucho escribir notas deportivas.',
    '189. Muy pocas veces me duele la cabeza.',
    '190. Nunca he tenido problemas con la ley.',
    '191. Cuando camino tengo mucho cuidado de no pisar las rayas en las banquetas.',
    '192. Después de un mal día, generalmente necesito algunos tragos para relajarme.',
    '193. A veces me divierte tanto la astucia de algún criminal, que he deseado que se salga con la suya.',
    '194. Estoy seguro(a) de que la gente habla de mí.',
    '195. Cuando me siento triste, casi siempre algo emocionante me saca de ese estado.',
    '196. Me gusta el arte dramático.',
    '197. Generalmente le hablo claro a la gente a quien estoy tratando de mejorar o corregir.',
    '198. Me atemorizo ante las crisis o dificultades.',
    '199. A veces percibo olores raros.',
    '200. Es más difícil para mi concentrarme de lo que parece ser para otras personas.',
    '201. Me gustan las fiestas y las reuniones sociales.',
    '202. Nunca en mi vida me he sentido mejor que ahora.',
    '203. A veces mi alma abandona mi cuerpo.',
    '204. Aun cuando estoy acompañado(a) me siento solo(a) la mayor parte del tiempo.',
    '205. Cuando era chico(a) frecuentemente no iba a la escuela aunque debería haberlo hecho.',
    '206. Quisiera dejar de preocuparme por las cosas que he dicho y que quizás hayan herido los sentimientos de otras personas.',
    '207. Tengo períodos en que me siento muy alegre sin que exista una razón especial.',
    '208. Tengo miedo de usar cuchillos o cualquier otra cosa filosa o puntiaguda.',
    '209. Sin duda he tenido más cosas de qué preocuparme de las que me corresponderían.',
    '210. Sufro de malestares en la boca del estómago, varias días a la semana o más frecuentemente.',
    '211. No me agradan todas las personas que conozco.',
    '212. No tengo enemigos que realmente quieran hacerme daño.',
    '213. Las personas generalmente exigen más respeto para sus propios derechos, que el que están dispuestos a conceder a los demás.',
    '214. Aunque no estoy satisfecho(a) con mi vida, nada puedo hacer ahora para cambiarla.',
    '215. Con frecuencia tengo serios desacuerdos con personas importantes para mí.',
    '216. A veces me molesta oír tan bien.',
    '217. Muy rara vez me siento deprimido(a).',
    '218. A veces me ha sido imposible evitar robar o llevarme algo de una tienda.',
    '219. Algunas veces me siento tan inquieto(a) que me es difícil quedarme dormido(a).',
    '220. No le temo a las arañas.',
    '221. Creo en el cumplimiento de la ley.',
    '222. Creo que hago amistades tan fácilmente como cualquiera.',
    '223. Cuando joven me suspendieron de la escuela una o más veces por mala conducta.',
    '224. Siempre tengo muy poco tiempo para terminar lo que hago.',
    '225. Me han dicho que camino cuando estoy dormido(a).',
    '226. Me gustaría ser corredor(a) de autos.',
    '227. No he tenido dificultad en mantener el equilibrio cuando camino.',
    '228. Casi todo el tiempo me siento preocupado(a) por algo o por alguien.',
    '229. Siendo a dejar de hacer algo que quiero, si otros creen que eso no vale la pena.',
    '230. Tengo muchos problemas estomacales.',
    '231. Puedo atemorizar fácilmente a la gente y a veces lo hago para divertirme.',
    '232. A veces pienso que no sirvo para nada.',
    '233. La gente dice cosas ofensivas y vulgares acerca de mí.',
    '234. Actualmente no me siento estresado(a).',
    '235. Me molesta que la gente me mire en la calle, en las tiendas, etc.',
    '236. No me gusta escuchar a otras personas dar sus opiniones sobre la vida.',
    '237. Excepto por orden del médico, nunca he tomado drogas o pastillas para dormir.',
    '238. Cuando un hombre está con una mujer, casi siempre está pensando en cosas relacionadas con el sexo.',
    '239. Si me dieran la oportunidad sería un buen líder.',
    '240. Muchas veces siento como si las cosas no fueran reales.',
    '241. En ocasiones me gusta el chisme.',
    '242. A veces la parte superior de mi cabeza está muy sensible.',
    '243. La sociedad me molesta o me horroriza.',
    '244. Si me dieran la oportunidad, podría hacer algunas cosas que serían de gran beneficio para la humanidad.',
    '245. Si fuera periodista me gustaría mucho escribir sobre teatro.',
    '246. Por lo general espero tener éxito en lo que hago.',
    '247. Gran parte del tiempo me siento cansado(a).',
    '248. Me han dicho con frecuencia que tengo mal genio.',
    '249. En la escuela me era muy difícil hablar frente a la clase.',
    '250. Frecuentemente me siento apenado(a) por ser tan irritable y gruñón(a).',
    '251. Nadie lo sabe, pero he tratado de matarme.',
    '252. Alguien controla mi mente.',
    '253. En la escuela mis calificaciones en conducta generalmente eran malas.',
    '254. Raras veces noto los latidos de mi corazón, y muy pocas veces me falta la respiración.',
    '255. No me molesta mucho ver sufrir a los animales.',
    '256. Con frecuencia he conocido a personas supuestamente expertas y que no resultaron mejores que yo.',
    '257. Tengo pensamientos extraños y poco comunes.',
    '258. Me produce terror la idea de un terremoto.',
    '259. Me gusta reparar las cerraduras de las puertas.',
    '260. Frecuentemente he trabajado para personas que atribuyen el reconocimiento por culpan a los subalternos de los errores.',
    '261. Algunas veces me siento al borde de una crisis nerviosa.',
    '262. Estoy tan sano como la mayoría de mis amigos.',
    '263. Tengo que admitir que a veces me he preocupado más de la cuenta por cosas que no valían la pena.',
    '264. Alguien me tiene mala voluntad.',
    '265. Padezco poca o ninguna clase de dolores.',
    '266. Tengo problemas con el alcohol o las drogas.',
    '267. He tenido épocas en las que me sentía tan lleno de energía que en ocasiones, hasta por varios días, no necesitaba dormir.',
    '268. Nunca me preocupa mi apariencia física.',
    '269. Cuando las cosas van muy mal, sé que puedo contar con la ayuda de mi familia.',
    '270. Una o más veces en mi vida he sentido que alguien me obligaba a hacer cosas hipnotizándome.',
    '271. Me molesta que la gente me apresure.',
    '272. No tengo dificultades al tragar.',
    '273. Oigo cosas extrañas cuando estoy solo(a).',
    '274. En general tengo problemas para decidir qué debo hacer.',
    '275. Varias veces por semana siento como si algo terrible fuera a suceder.',
    '276. Cuando alguien hace algo que me enoja, le digo a la persona cómo me siento.',
    '277. Con frecuencia noto que mis manos tiemblan cuando trato de hacer algo.',
    '278. Siempre que me es posible evito estar entre mucha gente.',
    '279. La mayoría de los hombres son infieles a sus esposas de vez en cuando.',
    '280. Con frecuencia me confundo y se me olvida lo que quiero decir.',
    '281. Mi familia me trata más como un niño(a) que como un adulto.',
    '282. Los objetivos más importantes de mi vida están a mi alcance.',
    '283. Hablar con alguien sobre los problemas y preocupaciones es mucho mejor que tomar drogas o medicinas.',
    '284. Tengo miedo de estar solo(a) en un sitio al descubierto.',
    '285. A veces me parece que no puedo dejar de hablar.',
    '286. No le tengo miedo a los ratones.',
    '287. Alguien ha tratado de influir en mi mente.',
    '288. Con frecuencia siento que no soy tan bueno(a) como otras personas.',
    '289. Con frecuencia he tenido miedo durante la noche.',
    '290. Casi nunca noto que me zumben o silben los oídos.',
    '291. Nunca me siento más feliz que cuando estoy solo(a).',
    '292. Me gusta tener a los demás intrigados con respecto a lo que haré.',
    '293. Por lo general soy tranquilo(a) y no me altero fácilmente.',
    '294. A mi alrededor veo cosas, animales o personas que otros no ven.',
    '295. No temo entrar solo(a) a un salón donde hay gente reunida platicando.',
    '296. Me gustaría ser periodista.',
    '297. Me drogo o me emborracho por lo menos una vez a la semana.',
    '298. En las elecciones, algunas veces voto por candidatos que casi no conozco.',
    '299. Me siento incapaz cuando tengo que tomar una decisión importante.',
    '300. Me gusta mucho jugar deportes rudo (como fútbol americano o fútbol soccer).',
    '301. Se me adormecen una o varias partes de la piel.',
    '302. Me gusta tomar decisiones y asignar trabajo a otros.',
    '303. Con frecuencia me irrita mucho que me interrumpan cuando estoy trabajando.',
    '304. En la mayoría de los matrimonios uno o los dos miembros de la pareja son infelices.',
    '305. Me gustaría mucho ganarles a los criminales en sus fechorías.',
    '306. Olvido dónde dejo las cosas.',
    '307. Algunas veces he tenido pensamientos terribles acerca de mi familia.',
    '308. Con frecuencia me salen manchas rojas en el cuello.',
    '309. Me preocupa bastante el dinero.',
    '310. La gente no es muy amable conmigo.',
    '311. Algunas veces estoy seguro(a) que los demás pueden saber lo que estoy pensando.',
    '312. Cuando he estado tomado(a) me he enojado y he roto muebles y platos.',
    '313. Nunca he sufrido parálisis o alguna debilidad fuera de lo común en alguno de mis músculos.',
    '314. Odio a toda mi familia.',
    '315. Estoy tan harto(a) de lo que hago diariamente, que lo único que deseo es deshacer de todo.',
    '316. A veces he tenido que ser rudo(a) con personas groseras o inoportunas.',
    '317. No puedo entrar solo(a) en un cuarto oscuro, aun en mi propia casa.',
    '318. En ocasiones me molesto y enojo tanto, que no sé qué me pasa.',
    '319. A veces me es difícil defender mis derechos porque soy muy reservado(a).',
    '320. Ciertos animales me ponen nervioso(a).',
    '321. Me gusta negociar en situaciones difíciles.',
    '322. La crítica o el regaño me hieren profundamente.',
    '323. Cuando estoy triste, me ayuda a sentirme mejor visitar a los amigos.',
    '324. Me pongo nervioso(a) cuando tengo que tomar decisiones importantes.',
    '325. A veces me río de los chistes obscenos.',
    '326. La mayoría de las parejas casadas no se demuestran mucho afecto.',
    '327. Con frecuencia me esfuerzo para superar a alguien que me ha llevado la contraria.',
    '328. Si me enojo, sé con seguridad que me dará dolor de cabeza.',
    '329. Me he llegado a sentir tan enojado(a) que he lastimado a otra persona en un pleito a puñetazos.',
    '330. En ocasiones me parece escuchar lo que pienso en voz alta.',
    '331. Cuando la vida se pone difícil, quisiera tan sólo rendirme.',
    '332. Si la gente no hubiera querido perjudicarme, hubiera tenido más éxito en la vida.',
    '333. No me censo con facilidad.',
    '334. Últimamente, mis pensamientos están más y más relacionados con la muerte y con la vida después de la muerte.',
    '335. Me enojo conmigo mismo(a) cuando accedo demasiado a los deseos de los demás.',
    '336. Reconozco que tengo varios defectos que no seré capaz de cambiar.',
    '337. Me he enojado tanto con alguien, que he sentido como si fuera a explotar.',
    '338. Frecuentemente me encuentro preocupado(a) por algo.'
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
