/**
 * EGEP-5 Gráficos: Renderizado SVG del perfil de síntomas
 * Portado del sistema EGEP-5_sistema.html
 */

window.EGEP5_GRAFICOS = {
  /**
   * Generar SVG del perfil de intensidad
   * @param {Object} resultados - Resultado de corregir()
   * @param {Object} baremos - Datos de baremos (opcional)
   * @returns {string} HTML con SVG
   */
  generarPerfil(resultados, baremos = null) {
    try {
      const usaPc = !!baremos;
      const ESC = window.EGEP5_CORRECTOR?.ESCALAS || {};

      // Seguridad: verificar que pd existe
      if (!resultados || !resultados.pd) {
        return '<div style="padding: 20px; color: #ef5350;">⚠️ Datos insuficientes para generar el gráfico.</div>';
      }

      const pd = resultados.pd;
      const Total = (pd.I || 0) + (pd.E || 0) + (pd.C || 0) + (pd.A || 0);

      // Preparar datos de columnas
      const cols = [
        { k: 'I', l: 'I', n: ESC.I?.nom || 'Intrusivos', v: pd.I || 0, max: 20, c: ESC.I?.color || '#60a5fa' },
        { k: 'E', l: 'E', n: ESC.E?.nom || 'Evitación', v: pd.E || 0, max: 8, c: ESC.E?.color || '#34d399' },
        { k: 'C', l: 'C', n: ESC.C?.nom || 'Cognitivas', v: pd.C || 0, max: 28, c: ESC.C?.color || '#fbbf24' },
        { k: 'A', l: 'A', n: ESC.A?.nom || 'Activación', v: pd.A || 0, max: 24, c: ESC.A?.color || '#f87171' },
        { k: 'Total', l: 'Total', n: 'Puntuación total', v: Total, max: 80, c: '#c084fc' },
        { k: 'F', l: 'F', n: 'Funcionamiento', v: pd.F || 0, max: 7, c: '#a78bfa' }
      ];

    // Calcular percentiles si hay baremos
    cols.forEach(c => {
      c.pc = usaPc ? this.pcDe(c.k, c.v, baremos) : null;
      c.y = usaPc ? c.pc : Math.round(c.v / c.max * 100);
    });

    // Dimensiones
    const W = 760, H = 380, ML = 52, MR = 22, MT = 22, MB = 64;
    const pw = W - ML - MR, ph = H - MT - MB;
    const X = i => ML + pw * (i + 0.5) / cols.length;
    const Y = v => MT + ph - (ph * Math.min(Math.max(v, 0), 100) / 100);

    // Generar SVG
    let g = '';

    // Bandas de color de fondo
    const bandas = [
      [85, 100, 'rgba(248,113,113,.07)'],
      [60, 85, 'rgba(251,191,36,.05)'],
      [15, 40, 'rgba(96,165,250,.05)'],
      [0, 15, 'rgba(52,211,153,.05)']
    ];
    bandas.forEach(([a, b, c]) => {
      g += `<rect x="${ML}" y="${Y(b)}" width="${pw}" height="${Y(a) - Y(b)}" fill="${c}"/>`;
    });

    // Grid de fondo
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(v => {
      g += `<line x1="${ML}" y1="${Y(v)}" x2="${W - MR}" y2="${Y(v)}" stroke="${v === 50 ? '#2f3947' : '#1a2029'}" stroke-width="1" ${v === 50 ? 'stroke-dasharray="4 4"' : ''}/>`;
      g += `<text x="${ML - 9}" y="${Y(v) + 4}" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="9" fill="#5d6675">${v}</text>`;
    });

    // Línea de perfil
    const pts = cols.map((c, i) => `${X(i)},${Y(c.y)}`).join(' ');
    g += `<polyline points="${pts}" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-linejoin="round" opacity=".55"/>`;

    // Barras + puntos
    cols.forEach((c, i) => {
      const bw = Math.min(46, pw / cols.length - 16);
      g += `<rect x="${X(i) - bw / 2}" y="${Y(c.y)}" width="${bw}" height="${MT + ph - Y(c.y)}" fill="${c.c}" opacity=".16" rx="3"/>`;
      g += `<line x1="${X(i) - bw / 2}" y1="${Y(c.y)}" x2="${X(i) + bw / 2}" y2="${Y(c.y)}" stroke="${c.c}" stroke-width="2.5"/>`;
      g += `<circle cx="${X(i)}" cy="${Y(c.y)}" r="4" fill="${c.c}" stroke="#ffffff" stroke-width="1.5"/>`;
      g += `<text x="${X(i)}" y="${Y(c.y) - 11}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10.5" font-weight="700" fill="${c.c}">${usaPc ? (c.pc === null ? '–' : c.pc) : c.v}</text>`;
      g += `<text x="${X(i)}" y="${MT + ph + 20}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="700" fill="#111827">${c.l}</text>`;
      g += `<text x="${X(i)}" y="${MT + ph + 36}" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="9.5" fill="#6b7280">PD ${c.v}/${c.max}</text>`;
    });

    g += `<line x1="${ML}" y1="${MT + ph}" x2="${W - MR}" y2="${MT + ph}" stroke="#e5e7eb" stroke-width="1"/>`;
    g += `<text x="14" y="${MT + ph / 2}" text-anchor="middle" transform="rotate(-90 14 ${MT + ph / 2})" font-family="DM Sans,sans-serif" font-size="10" fill="#6b7280" letter-spacing="1">${usaPc ? 'PERCENTIL' : '% DEL MÁXIMO'}</text>`;

    // HTML con SVG
    let html = `<div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">`;
    if (!usaPc) {
      html += `<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; margin-bottom: 14px; font-size: 12px; color: #1e40af; line-height: 1.5;">
        <strong>⚠️ Perfil sin baremar.</strong> Sin los baremos, el eje representa el porcentaje sobre la puntuación máxima. Cargue baremos del manual para obtener percentiles reales.
      </div>`;
    }
    html += `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; display: block;">${g}</svg>`;
    html += `<div style="display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; margin-top: 14px; font-size: 12px; color: #6b7280;">
      <span><span style="display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: rgba(248,113,113,.5); margin-right: 6px; vertical-align: middle;"></span>Alto (Pc ≥ 85)</span>
      <span><span style="display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: rgba(251,191,36,.5); margin-right: 6px; vertical-align: middle;"></span>Medio-alto (60–84)</span>
      <span><span style="display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: rgba(139,149,165,.4); margin-right: 6px; vertical-align: middle;"></span>Medio (40–59)</span>
      <span><span style="display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: rgba(96,165,250,.5); margin-right: 6px; vertical-align: middle;"></span>Medio-bajo (15–39)</span>
      <span><span style="display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: rgba(52,211,153,.5); margin-right: 6px; vertical-align: middle;"></span>Bajo (< 15)</span>
    </div>`;
    html += `</div>`;

    return html;
  },

  /**
   * Obtener percentil desde baremos
   */
  pcDe(escala, pd, baremos) {
    if (!baremos || !Array.isArray(baremos.filas)) return null;
    for (const f of baremos.filas) {
      const r = this.rango(f[escala]);
      if (r && pd >= r[0] && pd <= r[1]) return f.pc;
    }
    return null;
  },

  /**
   * Parsear rango de texto ("13-14" o "13")
   */
  rango(v) {
    if (v === null || v === undefined || v === '') return null;
    const s = String(v).trim();
    if (s === '-' || s === '–') return null;
    const m = s.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (m) return [+m[1], +m[2]];
    if (/^\d+$/.test(s)) return [+s, +s];
    return null;
  },

  /**
   * Obtener banda interpretativa (Alto/Medio-alto/etc)
   */
  banda(pc) {
    if (pc === null) return { t: '–', c: '#6b7280' };
    if (pc >= 85) return { t: 'Alto', c: '#dc2626' };
    if (pc >= 60) return { t: 'Medio-alto', c: '#d97706' };
    if (pc >= 40) return { t: 'Medio', c: '#6b7280' };
    if (pc >= 15) return { t: 'Medio-bajo', c: '#2563eb' };
    return { t: 'Bajo', c: '#16a34a' };
  }
};
