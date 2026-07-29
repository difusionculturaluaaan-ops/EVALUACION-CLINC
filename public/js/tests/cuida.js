/**
 * CUIDA: Cuestionario para la Evaluación de Adoptantes, Cuidadores, Tutores y Mediadores
 * 189 items - Respuestas en escala 1-4
 * 14 escalas primarias + 4 secundarias (composites)
 * Eneatipos: Media=5, DT=2
 */

const tests_cuida = {
  nombre: 'CUIDA',
  tipo: 'CUIDA',

  items: [
    "Me gusta conocer gente nueva",
    "Tengo problemas para dormir",
    "Estoy satisfecho de cómo soy",
    "Si alguien me insulta intento averiguar por qué lo hace",
    "A veces juzgo a los demás sin conocerlos",
    "Me disgusta mi aspecto físico",
    "Tengo cambios de humor con bastante facilidad",
    "Me gusta reunirme con mis amigos y conversar",
    "Siempre hago lo que digo",
    "Me gusta participar en experiencias nuevas",
    "Soy una persona tranquila",
    "Intento no herir los sentimientos de los demás",
    "No me molesta cambiar a última hora los planes previstos para las vacaciones",
    "Comprometerme con la gente necesitada me sirve para encontrar un sentido a la vida",
    "Cuando coordino alguna tarea renuncio si los demás no siguen mis instrucciones",
    "Me gustan los cambios porque rompen la monotonía",
    "Sé leer y escribir",
    "No soporto que me lleven la contraria",
    "Me apena pensar en las relaciones amorosas que tuve en el pasado",
    "Cuando alguien me necesita dejo de hacer lo que estoy haciendo en ese momento para ayudarle",
    "No hago las cosas sólo para satisfacer a los demás",
    "La gente que me rodea raramente me hace partícipe de sus problemas",
    "Cuando dejo una relación importante, tardo muchos años en olvidarla",
    "Intento ponerme en el lugar de los demás para comprenderles mejor",
    "Tiendo a abarcar tantas cosas que acabo agotado",
    "No me gusta hacerme cargo de los problemas y de la economía familiar",
    "Hago todo lo posible por salirme con la mía",
    "Me cuesta mucho participar en reuniones de grupo",
    "Ya no me resulta doloroso pensar en las cosas a las que he tenido que renunciar con los años",
    "Cuando voy de viaje evito relacionarme con otros viajeros",
    "Me cuesta aceptar que mi relación de pareja no sea como al principio",
    "Desconfío de las personas demasiado generosas",
    "Mi actitud ante la vida me ha impedido resolver los problemas adecuadamente",
    "Me relaciono fácilmente con otras personas, aunque no tengamos intereses comunes",
    "Cuando emprendo alguna acción antes he valorado los pros y los contras",
    "Nunca me he quedado con dinero de más al recibir el vuelto de una compra",
    "Me altero fácilmente cuando algo inesperado perturba mi vida cotidiana",
    "Los sentimientos de los demás no me preocupan",
    "Abandono fácilmente las tareas cuando me encuentro con ciertas dificultades",
    "Me pongo nervioso cuando alguien me halaga",
    "Habitualmente compro cosas que no necesito sólo porque me apetece",
    "Me siento angustiado cuando en mi vida ocurre algo que no tengo previsto",
    "Si presto algo y me lo devuelven estropeado, soy incapaz de decirlo",
    "Tan pronto me siento lleno de vitalidad como profundamente cansado",
    "Sigue siendo difícil para mí vivir con la ausencia de un ser querido",
    "Tengo facilidad para ponerme en el lugar de los demás",
    "Cuando alguien me critica injustamente me defiendo dialogando",
    "Creo que las despedidas me resultan más difíciles que al resto de las personas",
    "Me cuesta darme cuenta de si una persona se siente bien o no",
    "En situaciones de emergencia soy capaz de pensar con tranquilidad",
    "Nunca he visto a nadie que tuviese los ojos marrones",
    "Evito realizar una acción cuando no tengo muy claras sus consecuencias",
    "Me resulta bastante fácil intimar con las personas",
    "Cuando no consigo mi objetivo la situación me resulta insoportable",
    "Raramente pienso que me gustaría volver a la infancia",
    "Creo que nunca superaré del todo la pérdida de esa persona que fue tan importante para mí",
    "Suelo llevar a cabo las decisiones que previamente he tomado",
    "A veces me entusiasmo tanto con alguna idea nueva que ni pienso en los inconvenientes que puede tener",
    "Me siento incómodo cuando alguien se acerca demasiado",
    "Tengo tendencia a enojarme cuando las cosas no me salen bien",
    "Las dificultades de otros países no nos incumben, es algo que deben de solucionar sólo ellos",
    "Soy una persona a la que los demás utilizan",
    "Me es fácil conectar con la gente",
    "No me preocupa ser rechazado por los demás",
    "Cuando doy una fiesta consigo que mis invitados se relacionen bien entre sí",
    "Respeto los sentimientos y emociones de los demás, aunque sean diferentes a los míos",
    "Me comporto según lo que pienso en lugar de actuar como esperan los demás",
    "Pienso que no hay nada en mí que merezca la pena",
    "Suelo disfrutar con la mayoría de los actos sociales a los que me invitan",
    "Necesito ayudar a los demás",
    "En un grupo en que no conozco a nadie me cuesta trabajo iniciar la conversación",
    "No suelo ponerme nervioso cuando tengo que esperar para hacer algo",
    "Cuando surge algún imprevisto no me importa dejar lo que esté haciendo en ese momento",
    "Me cuesta trabajo probar comidas nuevas",
    "Cuando me censuran en presencia de otros me siento muy lastimado",
    "Me cuesta encontrar nuevas soluciones a los problemas habituales",
    "En ocasiones se me saltan las lágrimas cuando recuerdo acontecimientos tristes de mi pasado",
    "Me comprometo a hacer tantas cosas que luego me arrepiento de haberlas aceptado",
    "Cuando se me acumulan los problemas me bloqueo y no sé qué hacer",
    "Identifico fácilmente tanto las emociones negativas como positivas de los demás",
    "En una boda, me siento incómodo cuando comparto mesa con personas desconocidas",
    "Para formarme una opinión tengo en cuenta los diferentes puntos de vista que me ofrecen",
    "Me preocupa que los demás no me quieran",
    "Cuando surge un problema prefiero que lo resuelva otro",
    "Me cuesta mucho pedir favores",
    "Cuando estoy ocupado en algo acepto con tranquilidad cualquier interrupción",
    "A veces pienso que no valgo para nada",
    "En general me gusta la gente",
    "Nunca bebo líquidos",
    "Me encanta organizar fiestas con amigos",
    "En alguna ocasión me he quedado con algo que no era mío",
    "No me cuesta trabajo asumir los cambios de mi cuerpo",
    "Cuando estoy solo me siento triste",
    "Antes de tomar una decisión suelo tener en cuenta todas las posibilidades",
    "Si mi hijo adolescente me propusiera algo excepcional, en principio estaría dispuesto a escucharle",
    "Considero que tengo menos cualidades que el resto de las personas",
    "Necesito sentirme arropado por alguien",
    "Es muy raro que algo o alguien me haga perder los estribos",
    "Me siento incómodo con la gente que es diferente a mí",
    "Alguna vez he llegado tarde a trabajar por haberme quedado dormido",
    "No suelo responder ante las provocaciones",
    "Si alguien me pide ayuda por cualquier motivo intento poner una excusa",
    "Las cosas sin importancia me alteran más de lo que debieran",
    "Cuando creo tener razón impongo mi criterio",
    "Me resulta frustrante que las cosas no salgan como espero",
    "Los demás me consideran una persona en quien pueden confiar sus intimidades",
    "Me atraen mucho las situaciones que resultan nuevas e inesperadas",
    "Cuando hago favores a los demás deben agradecérmelo",
    "Con frecuencia pienso que no he hecho las cosas debidamente",
    "Desde siempre me han atraído las culturas que son diferentes a la mía",
    "Me resulta difícil respetar el turno de palabra cuando alguien está hablando",
    "No he visto ningún coche",
    "Nunca será suficiente todo lo que podamos hacer por los más desfavorecidos",
    "Suelo valorarme positivamente",
    "Me conmueve mucho observar el sufrimiento de los más débiles",
    "Conecto fácilmente con los sentimientos de las personas",
    "Me cuesta mucho desprenderme de los objetivos de mi infancia",
    "No me importa lo que piensen los demás sobre mis opiniones",
    "El que haya organizaciones que presten ayuda a otros países me parece un gasto innecesario",
    "Suelo reaccionar sin pensar mucho en lo que hago",
    "Los límites y las normas nunca deben ser cuestionados o negociados con los hijos",
    "Ante situaciones problemáticas o peligrosas me altero menos que los demás",
    "No me suelo alterar por pequeñeces",
    "Sufro cuando deseo tener o comprar algo que no puedo",
    "Solo me interesan aquellas cosas que están relacionadas con mi campo de interés",
    "Si en un restaurante recibo un mal servicio hago la reclamación oportuna",
    "Suelo reconocer las cualidades positivas que tengo",
    "Pienso que los demás van a estar a mi lado cuando les necesite",
    "No entiendo cómo algunas personas pueden llorar delante de otras",
    "Alguna vez me han dado ganas de pegar a alguien",
    "Cuando viajo me gusta ir a lugares que no conozco",
    "Si pierdo algo que me gusta mucho, enseguida consigo olvidarme de ello",
    "Me cuesta detectar cuál es el estado de ánimo de los demás",
    "Pienso que, en general, soy un fracasado",
    "Todo el mundo debería colaborar con asociaciones humanitarias o benéficas",
    "No me cuesta comprometerme emocionalmente con otras personas",
    "Acepto con naturalidad que alguien diga cosas positivas de mí",
    "Me cuesta comprender otras religiones",
    "Si alguien me atrae encuentro la forma de establecer comunicación con él",
    "Hago las cosas sin pararme a pensar",
    "Como espero demasiado de los demás, enseguida me desilusiono",
    "No me molesta que las personas se tomen mucho tiempo para explicar las cosas",
    "Cuando creo en algo lo defiendo con argumentos, sin enfrentarme",
    "Cuando me siento mal busco inmediatamente la ayuda de alguien",
    "Me altero con facilidad cuando alguna situación rompe mi rutina",
    "No me cuesta sobreponerme ante la pérdida de algo que quiero",
    "Me siento aliviado cuando evito comprometerme emocionalmente con otras personas",
    "Cuando alguien hace algo que no me agrada se lo digo abiertamente",
    "Nunca he deteriorado o roto nada que no fuese mío",
    "Antes de tomar cualquier decisión necesito comunicárselo a mi familia y amigos para que me den su aprobación",
    "Mis hábitos son siempre buenos y deseables",
    "Las normas que se establecen con los hijos se deben mantener en cualquier circunstancia",
    "Me molesta que las personas que me rodean no hagan bien sus tareas",
    "Aunque no consiga lo que quiero, me quedo tranquilo",
    "Mis éxitos son la justa recompensa de mi esfuerzo y mi trabajo",
    "Nunca me han interesado la forma de vida y la cultura de otros pueblos",
    "Cuando consigo información privilegiada la comparto con todo aquel que la necesita",
    "No tengo cambios de humor sin un motivo que los justifique",
    "Estoy de acuerdo con la expresión: \"Más vale lo malo conocido que lo bueno por conocer\"",
    "No me suelo preocupar por cosas sin importancia",
    "Tengo mucha dificultad para expresar mis opiniones",
    "Siempre hay personas en quien se puede confiar completamente",
    "La ausencia de algunos seres queridos no me impide disfrutar plenamente de las cosas",
    "Solo deberían interesarnos los problemas propios y no tanto los ajenos",
    "Soy capaz de organizar el tiempo cuando tengo que realizar más de una tarea",
    "Últimamente lloro con bastante facilidad",
    "Nunca hablo mal de nadie",
    "Cuando no alcanzo un objetivo que me he propuesto me cuesta mucho aceptarlo",
    "Me siento bien dejándome llevar por los demás",
    "Puedo hacer las cosas sin necesitar la aprobación de los demás",
    "Me cuesta aceptar que mis padres se hagan viejos",
    "Ante una situación límite mantengo la calma",
    "Me resulta difícil establecer nuevas relaciones",
    "Me enfurezco cuando alguien dice algo negativo de mí",
    "Cuando tengo problemas intento evadirme",
    "Tengo muchas razones para sentirme contento conmigo mismo",
    "Me cuesta mucho decir que no",
    "En situaciones difíciles considero las diferentes alternativas que hay para afrontarlas",
    "En alguna ocasión he revelado algo que me habían confiado en secreto",
    "A veces miento",
    "Me cuesta mucho percibir las cualidades positivas que tengo",
    "Suelo hablar sin pensar demasiado lo que digo",
    "Me siento mal cuando no tengo relaciones afectivas duraderas con otras personas",
    "Sé controlar mis sentimientos y no dejo que estos me desborden",
    "No me importa que los demás piensen de mí",
    "Me considero capaz de hacer las cosas tan bien como los demás",
    "Ni en situaciones muy tensas me irrito",
    "Me cuesta trabajo relacionarme con la gente cuando estoy en algún acto social",
    "Con la cantidad de niños que necesitan un hogar es absurdo traer un hijo al mundo"
  ],

  // Definición de escalas (items incluidos)
  escalas: {
    Al: { items: [14,20,61,70,102,113,115,119,135,157,164], denom: 44, nombre: 'Altruismo' },
    Ap: { items: [10,16,74,99,107,110,131,138,156,159], denom: 40, nombre: 'Apertura' },
    As: { items: [4,12,40,43,47,85,111,126,137,143,148,161,177], denom: 52, nombre: 'Asertividad' },
    At: { items: [3,6,68,87,92,96,109,114,127,134,176,181,186], denom: 52, nombre: 'Autoestima' },
    Rp: { items: [22,33,35,50,76,79,84,102,122,165,172,178], denom: 48, nombre: 'C. de resolver problemas' },
    Em: { items: [24,38,46,49,65,66,80,106,116,133], denom: 40, nombre: 'Empatía' },
    Ee: { items: [2,7,37,44,72,93,98,103,158,160,166,174,184], denom: 52, nombre: 'Equilibrio emocional' },
    In: { items: [21,62,64,67,83,97,118,169,170,185], denom: 40, nombre: 'Independencia' },
    Fl: { items: [13,15,18,42,73,86,121,125,145,152,153,187], denom: 48, nombre: 'Flexibilidad' },
    Rf: { items: [32,52,57,58,82,94,101,104,120,140,142,182], denom: 48, nombre: 'Reflexividad' },
    Sc: { items: [1,8,28,30,34,53,63,69,71,81,90,173,188], denom: 52, nombre: 'Sociabilidad' },
    Tf: { items: [39,54,60,75,105,124,141,154,168,175], denom: 40, nombre: 'Tolerancia a la frustración' },
    Ag: { items: [26,55,117,128,136,139,144,147,150,171,183], denom: 44, nombre: 'C. vínculos afectivos / apego' },
    Dl: { items: [19,23,29,31,45,48,56,77,132,146,163], denom: 44, nombre: 'C. resolución del duelo' },
    Ds: { items: [5,9,25,36,41], denom: 20, nombre: 'Deseabilidad social' },
  },

  // Items inversados
  inversosItems: new Set([2,6,7,9,11,15,18,19,22,23,26,27,28,30,31,32,37,38,39,40,41,42,43,44,45,48,49,54,56,58,60,61,62,68,71,74,75,76,77,78,79,81,85,87,88,89,91,93,95,96,97,99,100,102,103,104,105,108,109,117,119,120,121,124,128,129,134,138,140,141,145,147,149,150,151,153,156,159,161,164,166,168,171,173,174,175,177,179,181,182,188]),

  // Tabla conversión PD -> Eneatipo
  pdToEn: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,8,8,8,8,8,8,9,9,9,9,9,9,9,9],

  init() {
    // Verificar si viene en modo cargar (desde expediente)
    const params = new URLSearchParams(window.location.search);
    const modo = params.get('modo');
    const pruebaId = params.get('prueba_id');
    const token = params.get('token');

    if (modo === 'cargar' && pruebaId && token) {
      console.log('🔄 Cargando CUIDA desde expediente...');
      this.cargarDesdePrueba(pruebaId, token);
      return;
    }

    // Limpiar localStorage anterior si existe
    for (let i = 1; i <= this.items.length; i++) {
      if (!localStorage.getItem(`cuida_r${i}`)) {
        localStorage.setItem(`cuida_r${i}`, '0');
      }
    }
  },

  async cargarDesdePrueba(pruebaId, token) {
    try {
      const response = await fetch(`/api/pruebas/${pruebaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const prueba = await response.json();
      console.log('✅ Prueba cargada:', prueba);

      // Extraer datos del paciente
      const subescalas = typeof prueba.subescalas === 'string' ? JSON.parse(prueba.subescalas) : prueba.subescalas;

      if (subescalas && subescalas._datos_paciente) {
        const dp = subescalas._datos_paciente;
        console.log('👤 Datos del paciente:', dp);
        if (dp.nombre) document.getElementById('paciente_nombre').value = dp.nombre;
        if (dp.edad) document.getElementById('paciente_edad').value = dp.edad;
        if (dp.sexo) document.getElementById('paciente_sexo').value = dp.sexo;
        if (dp.fecha) document.getElementById('paciente_fecha').value = dp.fecha;
      }

      // Cargar respuestas desde prueba.data
      if (prueba.data && Array.isArray(prueba.data)) {
        console.log('📝 Cargando respuestas:', prueba.data);
        for (let i = 0; i < prueba.data.length && i < this.items.length; i++) {
          localStorage.setItem(`cuida_r${i + 1}`, prueba.data[i] || '0');
        }
      }

      console.log('✅ CUIDA cargado desde expediente');
    } catch (error) {
      console.error('❌ Error cargando CUIDA:', error);
      alert('❌ Error: ' + error.message);
    }
  },

  obtenerRespuestas() {
    const respuestas = [];
    for (let i = 1; i <= this.items.length; i++) {
      const valor = localStorage.getItem(`cuida_r${i}`) || '0';
      respuestas.push(parseInt(valor));
    }
    return respuestas;
  },

  validar() {
    const sinResponder = [];
    for (let i = 1; i <= this.items.length; i++) {
      const valor = localStorage.getItem(`cuida_r${i}`) || '0';
      if (parseInt(valor) === 0) {
        sinResponder.push(i);
      }
    }
    return sinResponder;
  },

  calcular() {
    try {
      const respuestas = this.obtenerRespuestas();
      const escalasResult = {};

      // Calcular escalas primarias
      for (const [abbr, def] of Object.entries(this.escalas)) {
        let sum = 0, answered = 0;
        for (const item of def.items) {
          const valor = respuestas[item - 1];
          if (valor > 0) {
            const scored = this.inversosItems.has(item) ? (5 - valor) : valor;
            sum += scored;
            answered++;
          }
        }
        const pd = answered > 0 ? Math.round(sum / def.denom * 100) : null;
        const en = pd !== null ? this.pdToEn[Math.min(100, Math.max(0, pd))] : null;
        escalasResult[abbr] = {
          nombre: def.nombre,
          pd: pd,
          en: en,
          answered: answered,
          total: def.items.length
        };
      }

      // Calcular escalas secundarias (composites)
      const e = k => escalasResult[k]?.en || 0;
      const avg = (...keys) => {
        const vs = keys.map(e).filter(v => v > 0);
        return vs.length ? Math.round(vs.reduce((a,b) => a+b, 0) / vs.length) : null;
      };

      escalasResult.Cre = { nombre: 'Cuidado responsable', en: avg('In','Rf','Tf','Ee','Fl','At'), pd: null };
      escalasResult.Caf = { nombre: 'Cuidado afectivo', en: avg('Em','Ee','Ag','Ag','As','Dl','Rp'), pd: null };
      escalasResult.Sen = { nombre: 'Sensibilidad hacia los demás', en: avg('Ee','Fl','Em','Ag','Ag','Al','Ap'), pd: null };
      const agr_en = avg('As','In','Rf','Tf');
      escalasResult.Agr = { nombre: 'Agresividad', en: agr_en ? Math.max(1, Math.min(9, 10 - agr_en)) : null, pd: null };

      // Índice de invalidez (items imposibles)
      const invItems = [17, 51, 112];
      let invScore = 0;
      for (const item of invItems) {
        if (respuestas[item - 1] >= 3) invScore++;
      }

      return {
        datos: escalasResult,
        total: respuestas.filter(r => r > 0).length,
        escalas: escalasResult,
        invalidez: invScore,
        validez: invScore === 0 ? 'Normal' : 'Revisar'
      };
    } catch (error) {
      console.error('Error al calcular CUIDA:', error);
      return { datos: {}, total: 0, escalas: {}, invalidez: 0, validez: 'Error' };
    }
  }
};
