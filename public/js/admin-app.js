// Admin SCID-II - Interfaz de Referencia
const adminApp = {
  token: null,
  usuario: null,
  escalas: [],
  mapeo: [],
  expandedEscalas: {},

  // Preguntas SCID-II (119 total)
  preguntasSCID2: [
    '¿Ha evitado trabajos o tareas que implicaban tener que tratar con mucha gente?',
    '¿Evita entablar relación con otras personas a menos que esté seguro de que les va a caer bien?',
    '¿Le resulta difícil ser "abierto" incluso con las personas con las que se mantiene una relación cercana?',
    '¿Le preocupa con frecuencia ser criticado o rechazado en situaciones sociales?',
    '¿Permanece generalmente callado cuando conoce gente nueva?',
    '¿Cree usted que no es tan bueno, tan listo o tan atractivo como la mayoría de las personas?',
    '¿Le da miedo intentar cosas nuevas?',
    '¿Necesita usted dejarse aconsejar y desangustiar mucho por parte de otras personas antes de poder tomar decisiones cotidianas?',
    '¿Depende usted de otras personas para controlar áreas importantes de su vida?',
    '¿Le resulta difícil mostrarse en desacuerdo con otras personas incluso cuando considera que están equivocadas?',
    '¿Le cuesta empezar o realizar tareas cuando no hay nadie que le ayude?',
    '¿Se ha ofrecido con frecuencia voluntario para realizar tareas desagradables?',
    '¿Se siente usted generalmente incómodo cuando está solo?',
    'Cuando finaliza una relación de pareja, ¿siente usted que tiene que encontrar inmediatamente a otra persona que le cuide?',
    '¿Le preocupa mucho que le abandonen y que tenga que cuidar de sí mismo?',
    '¿Es usted la clase de persona que se fija en los detalles, el orden y la organización?',
    '¿Tiene problemas a la hora de finalizar tareas debido a que emplea demasiado tiempo tratando de hacer las cosas de forma perfecta?',
    '¿Le parece a usted que está tan dedicado a su trabajo que no le queda tiempo para nadie más?',
    '¿Tiene usted unos valores muy estrictos sobre lo que está bien y lo que está mal?',
    '¿Le cuesta a usted mucho tirar las cosas porque algún día podrían serle útiles?',
    '¿Le cuesta dejar que otras personas le ayuden a menos que hagan las cosas exactamente como usted quiere?',
    '¿Le cuesta a usted mucho gastar dinero en usted mismo o en otros?',
    '¿Está a menudo tan seguro de tener razón que no le importa lo que digan los demás?',
    '¿Le han comentado otras personas que usted es terco o rígido?',
    'Cuando alguien le pide que haga algo que usted no quiere hacer, ¿dice que sí pero luego lo hace despacio o mal?',
    'Cuando no quiere hacer algo, ¿suele simplemente "olvidarse" de hacerlo?',
    '¿Siente con frecuencia que los demás no le comprenden o que no aprecian lo mucho que usted hace?',
    '¿Está usted a menudo de mal humor o tiende a discutir?',
    '¿Le parece a usted que la mayoría de sus jefes, profesores, supervisores, médicos o personas supuestamente expertas realmente no lo son?',
    '¿Piensa a menudo que no es justo que otras personas tengan más que usted?',
    '¿Se queja usted a menudo de haber tenido más mala suerte de lo normal?',
    '¿Rehúsa a menudo con enfado hacer lo que quieren los demás, luego se siente mal y se disculpa?',
    '¿Se siente habitualmente infeliz, o como si la vida no fuese agradable?',
    '¿Cree usted ser una persona básicamente incapaz y con frecuencia no se siente bien consigo mismo?',
    '¿Se descalifica a sí mismo con frecuencia?',
    '¿Piensa mucho en cosas malas que han sucedido en el pasado o se preocupa por las que podrían suceder en el futuro?',
    '¿Juzga a menudo a los demás con dureza y les encuentra defectos con facilidad?',
    '¿Cree usted que la mayoría de las personas no son buenas?',
    '¿Espera usted casi siempre que las cosas vayan mal?',
    '¿Se siente usted a menudo culpable de cosas que ha hecho o dejado de hacer?',
    '¿Tiene a menudo que estar alerta para evitar que los demás abusen de usted?',
    '¿Pasa usted mucho tiempo preguntándose si puede fiarse de sus amigos o compañeros de trabajo?',
    '¿Cree usted que es mejor no dejar que otras personas sepan mucho sobre usted?',
    '¿Detecta usted a menudo amenazas o insultos ocultos en lo que la gente dice o hace?',
    '¿Es usted la clase de persona que guarda rencor o tarda mucho tiempo en perdonar?',
    '¿Hay muchas personas a las que no puede perdonar por algo que le hicieron?',
    '¿Con que frecuencia se enfada o se pone furioso cuando alguien le critica?',
    '¿Ha sospechado a menudo que su pareja le es o era infiel?',
    'Cuando está en público y ve personas hablando, ¿a menudo le parece que están hablando de usted?',
    '¿Tiene con frecuencia la impresión de que cosas sin significado especial contienen un mensaje especial para usted?',
    'Cuando está entre la gente, ¿tiene a menudo la sensación de que lo están observando?',
    '¿Ha sentido alguna vez que podría hacer que sucedieran cosas simplemente formulando un deseo?',
    '¿Ha tenido experiencias personales de tipo sobrenatural?',
    '¿Cree tener un "sexto sentido" que le permite conocer y predecir cosas?',
    '¿Le ha parecido a menudo como si los objetos o las sombras fueran realmente personas o animales?',
    '¿Ha tenido la sensación de que alguna persona o fuerza se hallaba alrededor de usted?',
    '¿Ve con frecuencia auras o campos de energía alrededor de las personas?',
    '¿Hay muy pocas personas a las que se sienta próximo aparte de su familia inmediata?',
    '¿Se siente con frecuencia nervioso cuando está con otras personas?',
    '¿Es poco importante para usted si tiene o no relaciones personales?',
    '¿Prefiere usted casi siempre hacer las cosas solo?',
    '¿Podría estar satisfecho sin tener jamás ninguna relación sexual?',
    '¿Hay realmente muy pocas cosas que le proporcionen placer?',
    '¿Le es totalmente indiferente lo que otras personas piensen de usted?',
    '¿Cree que no hay nada que ponga ni muy contento ni muy triste?',
    '¿Le gusta ser el centro de atención?',
    '¿Coquetea mucho?',
    '¿Se da cuenta a menudo de que se está comportando de forma seductora con otras personas?',
    '¿Trata de llamar la atención a través de su forma de vestir o su aspecto físico?',
    '¿Se muestra muy a menudo como una persona dramática y pintoresca?',
    '¿Cambia a menudo de opinión según las personas con las que esté?',
    '¿Tiene usted muchos amigos a los que se siente muy próximo?',
    '¿Considera que a menudo los demás no saben apreciar su talento o sus cualidades?',
    '¿Le han comentado otras personas que tiene una opinión demasiado elevada de sí mismo?',
    '¿Piensa mucho en que algún día alcanzará el poder, la fama o el reconocimiento?',
    '¿Pasa usted mucho tiempo pensado en que algún día disfrutará de un romance perfecto?',
    'Cuando tiene un problema, ¿insiste casi siempre en ver al máximo responsable?',
    '¿Considera usted que es importante dedicar el tiempo a personas especiales o influyentes?',
    '¿Es muy importante para usted que la gente le preste atención o le admire?',
    '¿Cree usted que no es necesario respetar ciertas reglas o convenciones sociales?',
    '¿Considera usted que es la clase de persona que merece un trato especial?',
    '¿A menudo le resulta necesario aprovecharse de otros para conseguir lo que quiere?',
    '¿Tiene con frecuencia que anteponer sus necesidades a las de otras personas?',
    '¿Espera a menudo que otras personas hagan lo que les pide sin vacilar?',
    '¿A usted realmente no le interesan los problemas y sentimientos de los demás?',
    '¿Se han quejado algunas personas de que usted no le escucha?',
    '¿Tiene a menudo envidia de otras personas?',
    '¿Cree usted que los demás a menudo le envidian?',
    '¿Le parece que hay pocas personas que merezcan que usted les dedique su tiempo?',
    '¿Se ha puesto furioso con frecuencia cuando ha creído que alguien iba a abandonarlo?',
    'Las relaciones con las personas que verdaderamente quiere, ¿tienen muchos altibajos extremos?',
    '¿Cambia a veces de repente su sentido de quién es usted?',
    '¿Cambia a menudo dramáticamente su sentido de quién es?',
    '¿Es usted diferente con diferentes personas, de tal manera que a veces no sabe quién es usted en realidad?',
    '¿Se han producido muchos cambios bruscos en sus metas, planes profesionales?',
    '¿Ha hecho a menudo cosas impulsivas?',
    '¿Ha tratado de hacerse daño o matarse, o amenazado con hacerlo?',
    '¿Alguna vez se ha cortado, quemado o herido a sí mismo a propósito?',
    '¿Experimenta usted muchos cambios repentinos de estado de ánimo?',
    '¿Se siente con frecuencia vacío por dentro?',
    '¿Tiene usted a menudo arranques de cólera o se enfurece tanto que pierde el control?',
    'Cuando se enfada, ¿golpea usted a las personas o arroja objetos?',
    '¿Se pone muy furioso incluso por cosas sin importancia?',
    'Cuando se halla bajo gran tensión, ¿se vuelve suspicaz con otras personas?',
    'Antes de los 15 años, ¿intimidaba o amenazaba a otros niños?',
    'Antes de los 15 años, ¿provocaba usted peleas?',
    'Antes de los 15 años, ¿hirió o amenazó a alguien con un arma?',
    'Antes de los 15 años, ¿torturó deliberadamente a alguien?',
    'Antes de los 15 años, ¿torturó o hirió animales a propósito?',
    'Antes de los 15 años, ¿robó, atracó o arrebató por la fuerza algo?',
    'Antes de los 15 años, ¿forzó a alguien a tener relaciones sexuales?',
    'Antes de los 15 años, ¿provocó algún incendio?',
    'Antes de los 15 años, ¿destruyó deliberadamente cosas que no eran suyas?',
    'Antes de los 15 años, ¿irrumpió en casas, otros edificios o coches?',
    'Antes de los 15 años, ¿mentía mucho o estafaba a otras personas?',
    'Antes de los 15 años, ¿robaba cosas o falsificaba la firma de otras personas?',
    'Antes de los 15 años, ¿se escapó de casa y pasó la noche fuera?',
    'Antes de los 13 años, ¿permanecía mucho tiempo fuera de casa?',
    'Antes de los 13 años, ¿faltaba a menudo a clase?'
  ],

  async init() {
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!this.token || !userStr) {
      window.location.href = '/';
      return;
    }

    this.usuario = JSON.parse(userStr);
    document.getElementById('username').textContent = this.usuario.nombre;

    // Verificar que sea admin (puede ser profesional pero mostrar alert)
    if (!['admin', 'profesional'].includes(this.usuario.rol)) {
      document.querySelector('.content').innerHTML = `
        <div class="no-permissions">
          <h2>❌ Acceso Denegado</h2>
          <p>Se requiere rol de Administrador o Profesional para acceder a esta página.</p>
          <p>Tu rol actual: <strong>${this.usuario.rol}</strong></p>
        </div>
      `;
      return;
    }

    await this.cargarEscalas();
    await this.cargarMapeo();
    this.renderizarEscalas();
    this.renderizarMapeo();
  },

  async cargarEscalas() {
    try {
      const response = await fetch('/api/admin/scid2-escalas', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        this.escalas = data.data || [];
      }
    } catch (error) {
      console.error('Error al cargar escalas:', error);
    }
  },

  async cargarMapeo() {
    try {
      const response = await fetch('/api/admin/scid2-mapeo', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        this.mapeo = data.data || [];
      }
    } catch (error) {
      console.error('Error al cargar mapeo:', error);
    }
  },

  renderizarEscalas() {
    const html = this.escalas.map(escala => `
      <div class="config-card">
        <h3>Escala ${escala.escala}</h3>
        <div style="margin-bottom: 15px;">
          <div style="margin-bottom: 8px;">
            <strong style="color: #2c3e50;">Trastorno:</strong><br>
            ${escala.trastorno}
          </div>
          <div style="margin-bottom: 8px;">
            <strong style="color: #2c3e50;">Preguntas:</strong><br>
            ${escala.numero_pregunta_inicio} - ${escala.numero_pregunta_fin}
          </div>
          <div>
            <strong style="color: #667eea;">Cutoff Mínimo:</strong><br>
            <span style="font-size: 20px; color: #667eea; font-weight: bold;">≥ ${escala.cutoff_minimo}</span>
          </div>
        </div>
        <p style="color: #999; font-size: 12px; margin: 0;">
          ⚠️ Estándar DSM-IV (no modificable)
        </p>
      </div>
    `).join('');
    document.getElementById('escalasGrid').innerHTML = html;
  },

  renderizarMapeo() {
    const mapeoAgrupado = {};
    this.escalas.forEach(escala => {
      mapeoAgrupado[escala.escala] = {
        ...escala,
        preguntas: []
      };
    });

    this.mapeo.forEach(item => {
      if (mapeoAgrupado[item.escala]) {
        mapeoAgrupado[item.escala].preguntas.push(item);
      }
    });

    const html = Object.values(mapeoAgrupado)
      .sort((a, b) => a.escala.localeCompare(b.escala))
      .map(escala => `
        <div class="config-card">
          <h3 style="margin-bottom: 15px; color: #667eea;">
            Escala ${escala.escala} - ${escala.trastorno}
          </h3>
          <button class="btn btn-secondary" style="margin-bottom: 15px; width: 100%;" onclick="adminApp.toggleEscala('${escala.escala}')">
            ${this.expandedEscalas[escala.escala] ? '▼ Contraer' : '▶ Expandir'} (${escala.preguntas.length} preguntas)
          </button>
          ${this.expandedEscalas[escala.escala] ? `
            <div style="max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 10px;">
              ${escala.preguntas.map((p, i) => `
                <div style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                  <strong>${p.numero_pregunta}.</strong> ${p.pregunta_texto}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('');

    document.getElementById('mapeoGrid').innerHTML = html;
  },

  toggleEscala(escala) {
    this.expandedEscalas[escala] = !this.expandedEscalas[escala];
    this.renderizarMapeo();
  },

  filterQuestions() {
    // Placeholder para búsqueda futura
  }
};

function switchPage(page, element) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(page).classList.add('active');
  element.classList.add('active');
}

function filterQuestions() {
  adminApp.filterQuestions();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
  adminApp.init();
});
