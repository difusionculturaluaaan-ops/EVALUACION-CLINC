/**
 * EGEP-5 Corrector: Motor de corrección según DSM-5
 * Portado del sistema EGEP-5_sistema.html
 * Calcula criterios, puntajes, diagnóstico e interpretación
 */

window.EGEP5_CORRECTOR = {
  // Estructura de escalas DSM-5
  ESCALAS: {
    I: {
      nom: 'Síntomas intrusivos',
      items: [27, 28, 29, 30, 31],
      max: 20,
      crit: 'B',
      umbral: 1,
      color: '#60a5fa'
    },
    E: {
      nom: 'Evitación',
      items: [32, 33],
      max: 8,
      crit: 'C',
      umbral: 1,
      color: '#34d399'
    },
    C: {
      nom: 'Alteraciones cognitivas y del estado de ánimo',
      items: [34, 35, 36, 37, 38, 39, 40],
      max: 28,
      crit: 'D',
      umbral: 2,
      color: '#fbbf24'
    },
    A: {
      nom: 'Alteraciones en la activación y reactividad',
      items: [41, 42, 43, 44, 45, 46],
      max: 24,
      crit: 'E',
      umbral: 2,
      color: '#f87171'
    }
  },

  DISOC: [47, 48, 49],
  FUNC: [52, 53, 54, 55, 56, 57, 58],
  SN1626: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],

  // Descripciones de criterios DSM-5
  CRIT_DESC: {
    A: 'Exposición a acontecimiento traumático',
    B: 'Síntomas intrusivos (I)',
    C: 'Evitación (E)',
    D: 'Alteraciones cognitivas y del estado de ánimo (C)',
    E: 'Alteraciones en la activación y reactividad (A)',
    F: 'Duración',
    G: 'Funcionamiento (F)'
  },

  CRIT_REGLA: {
    A: '≥1 acontecimiento en ítems 1–11 y el ítem 14 no es «En el último mes»',
    B: '≥1 síntoma (ítems 27–31)',
    C: '≥1 síntoma (ítems 32–33)',
    D: '≥2 síntomas (ítems 34–40)',
    E: '≥2 síntomas (ítems 41–46)',
    F: 'El ítem 50 no es «Desde hace menos de 1 mes»',
    G: '≥2 áreas afectadas (ítems 52–58)'
  },

  /**
   * Obtener valor de respuesta (maneja objetos y valores simples)
   */
  valOf(n, respuestas) {
    const r = respuestas[n];
    return r && typeof r === 'object' ? r.si : r;
  },

  /**
   * Calcular síntomas que cumplen criterio (SI/NO/INC)
   */
  critSint(items, umbral, respuestas) {
    const si = items.filter(n => this.valOf(n, respuestas) === 'SI').length;
    const pend = items.some(n => !this.valOf(n, respuestas));
    if (si >= umbral) return { r: 'SI', n: si };
    if (pend) return { r: 'INC', n: si };
    return { r: 'NO', n: si };
  },

  /**
   * Calcular puntaje directo (PD) de una escala
   */
  pdEscala(items, respuestas) {
    return items.reduce((s, n) => {
      const r = respuestas[n];
      return s + (r && r.si === 'SI' && typeof r.g === 'number' ? r.g : 0);
    }, 0);
  },

  /**
   * Contar eventos marcados (ítems 1-11)
   */
  nEventos(eventos) {
    let c = 0;
    for (let i = 1; i <= 11; i++) {
      const e = eventos[i] || {};
      if (e.s || e.p || e.c) c++;
    }
    return c;
  },

  /**
   * FUNCIÓN PRINCIPAL: Corregir según DSM-5
   * @param {Object} data - { respuestas, eventos }
   * @returns {Object} Resultado con crit, pd, diagnostico, etc.
   */
  corregir(data) {
    const { respuestas = {}, eventos = {} } = data;
    const o = {
      crit: {},
      pd: {},
      nsint: {}
    };

    // Criterio A: ≥1 acontecimiento (1-11) Y ítem 14 ≠ "último_mes"
    const nEv = this.nEventos(eventos);
    o.nEv = nEv;
    if (!respuestas[14]) {
      o.crit.A = { r: 'INC' };
    } else {
      o.crit.A = {
        r: nEv >= 1 && respuestas[14] !== 'ultimo_mes' ? 'SI' : 'NO'
      };
    }

    // Criterios B–E (escalas de síntomas)
    for (const k of ['I', 'E', 'C', 'A']) {
      const e = this.ESCALAS[k];
      const c = this.critSint(e.items, e.umbral, respuestas);
      o.crit[e.crit] = { r: c.r };
      o.nsint[k] = c.n;
      o.pd[k] = this.pdEscala(e.items, respuestas);
    }
    o.pd.Total = o.pd.I + o.pd.E + o.pd.C + o.pd.A;

    // Criterio F: Ítem 50 ≠ "menos1m"
    o.crit.F = !respuestas[50]
      ? { r: 'INC' }
      : { r: respuestas[50] !== 'menos1m' ? 'SI' : 'NO' };

    // Criterio G: ≥2 áreas afectadas (52-58)
    const g = this.critSint(this.FUNC, 2, respuestas);
    o.crit.G = { r: g.r };
    o.pd.F = g.n;

    // Diagnóstico: se cumplen todos los criterios
    const rs = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(k => o.crit[k].r);
    o.tept = rs.includes('NO')
      ? 'NO'
      : rs.includes('INC')
        ? 'INC'
        : 'SI';

    // Especificaciones
    o.desper = this.valOf(47, respuestas) === 'SI';
    o.desreal = this.valOf(48, respuestas) === 'SI' || this.valOf(49, respuestas) === 'SI';
    o.disoc = o.desper || o.desreal;
    o.retard = respuestas[51] === '6m_mas';

    return o;
  },

  /**
   * Generar texto diagnóstico basado en resultados
   */
  generarDiagnostico(resultados) {
    const { tept, crit } = resultados;

    if (tept === 'SI') {
      let texto = 'Cumple los siete criterios (A–G) del DSM-5 para trastorno de estrés postraumático.';
      const es = [];
      if (resultados.desper) es.push('despersonalización');
      if (resultados.desreal) es.push('desrealización');
      if (es.length) {
        texto += ` Especificación: con síntomas disociativos (${es.join(' y ')}).`;
      }
      if (resultados.retard) {
        texto += ' Especificación: con expresión retardada.';
      }
      return texto;
    } else if (tept === 'NO') {
      const fallan = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].filter(k => crit[k].r === 'NO');
      return `No se cumplen los criterios diagnósticos. Criterios no alcanzados: ${fallan.join(', ')}.`;
    } else {
      const incompl = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].filter(k => crit[k].r === 'INC');
      return `Información incompleta. Criterios sin resolver: ${incompl.join(', ')}.`;
    }
  }
};
