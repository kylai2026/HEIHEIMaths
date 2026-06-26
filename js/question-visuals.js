/** 圖形題共用視覺圖 */
const QuestionVisuals = {
  scene(inner) {
    return `<div class="geo-scene" aria-hidden="true">${inner}</div>`;
  },

  withVisual(text, visual) {
    if (!visual) return text;
    const hasVisual = ['geo-scene', 'triangle-scene', 'bar-chart-scene', 'clock-scene',
      'count-object-grid', 'pie-chart', 'capacity-compare', 'ten-bond-frame', 'pos-lr-scene', 'pos-ud-scene']
      .some(cls => text.includes(cls));
    if (hasVisual) return text;
    const body = text.startsWith('<p>') ? text : `<p>看圖：${text}</p>`;
    return `${body}${visual}`;
  },

  _colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'],

  fractionCircle(num, den) {
    const n = Number(num);
    const d = Number(den);
    const cx = 90;
    const cy = 90;
    const r = 72;
    const slices = [];
    for (let i = 0; i < d; i++) {
      const a1 = (i / d) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / d) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const large = (a2 - a1) > Math.PI ? 1 : 0;
      const fill = i < n ? '#60a5fa' : '#e2e8f0';
      slices.push(`<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${fill}" stroke="#fff" stroke-width="1.5"/>`);
    }
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 180 180" role="img" aria-label="分數圓圖">
        ${slices.join('')}
      </svg>
    `);
  },

  rectangle(length, width, unit = 'cm', opts = {}) {
    const l = Number(length);
    const w = Number(width);
    const scale = 120 / Math.max(l, w);
    const rw = l * scale;
    const rh = w * scale;
    const x = (230 - rw) / 2;
    const y = (130 - rh) / 2 + 8;
    const hideLength = opts.hideLength;
    const hideWidth = opts.hideWidth;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 230 145" role="img" aria-label="長方形圖">
        <rect x="${x}" y="${y}" width="${rw}" height="${rh}" class="geo-rect"/>
        ${!hideLength ? `<text x="${x + rw / 2}" y="${y + rh + 18}" text-anchor="middle" class="geo-label">長 ${l} ${unit}</text>` : ''}
        ${!hideWidth ? `<text x="${x - 10}" y="${y + rh / 2}" text-anchor="end" class="geo-label">闊 ${w} ${unit}</text>` : ''}
      </svg>
    `);
  },

  square(side, unit = 'cm', opts = {}) {
    const s = Number(side);
    const scale = 100 / Math.max(s, 1);
    const sz = s * scale;
    const x = (200 - sz) / 2;
    const y = (120 - sz) / 2 + 10;
    const areaLabel = opts.areaLabel || '';
    const hideSide = opts.hideSide;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 135" role="img" aria-label="正方形圖">
        <rect x="${x}" y="${y}" width="${sz}" height="${sz}" class="geo-rect"/>
        ${!hideSide ? `<text x="${x + sz / 2}" y="${y + sz + 18}" text-anchor="middle" class="geo-label">邊長 ${s} ${unit}</text>` : ''}
        ${areaLabel ? `<text x="${x + sz / 2}" y="${y + sz / 2}" text-anchor="middle" class="geo-label">面積 ${areaLabel}</text>` : ''}
      </svg>
    `);
  },

  circle(radius, unit = 'cm', opts = {}) {
    const r = Number(radius);
    const cx = 100;
    const cy = 95;
    const scale = 70 / Math.max(r, 1);
    const rr = r * scale;
    const hideRadius = opts.hideRadius;
    const diameter = opts.diameter;
    const dLine = diameter ? `
        <line x1="${cx - rr}" y1="${cy}" x2="${cx + rr}" y2="${cy}" class="geo-radius-line"/>
        <text x="${cx}" y="${cy - 10}" text-anchor="middle" class="geo-label">直徑 ${diameter} ${unit}</text>` : '';
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 170" role="img" aria-label="圓形圖">
        <circle cx="${cx}" cy="${cy}" r="${rr}" class="geo-circle"/>
        ${!hideRadius ? `<line x1="${cx}" y1="${cy}" x2="${cx + rr}" y2="${cy}" class="geo-radius-line"/>
        <text x="${cx + rr / 2}" y="${cy - 6}" text-anchor="middle" class="geo-label">半徑 ${r} ${unit}</text>` : ''}
        ${dLine}
        ${opts.label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" class="geo-label">${opts.label}</text>` : ''}
      </svg>
    `);
  },

  parallelogram(base, height, unit = 'cm', opts = {}) {
    const b = Number(base);
    const h = Number(height);
    const scale = 110 / Math.max(b, h);
    const bw = b * scale;
    const hh = h * scale;
    const skew = hh * 0.35;
    const x0 = 40;
    const y0 = 120;
    const pts = `${x0 + skew},${y0 - hh} ${x0 + bw + skew},${y0 - hh} ${x0 + bw},${y0} ${x0},${y0}`;
    const hideLabels = opts.hideLabels;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 240 145" role="img" aria-label="平行四邊形圖">
        <polygon points="${pts}" class="geo-poly"/>
        <line x1="${x0 + bw + skew}" y1="${y0 - hh}" x2="${x0 + bw + skew}" y2="${y0}" class="geo-height-line"/>
        ${!hideLabels ? `<text x="${x0 + bw / 2}" y="${y0 + 16}" text-anchor="middle" class="geo-label">底 ${b} ${unit}</text>
        <text x="${x0 + bw + skew + 12}" y="${y0 - hh / 2}" class="geo-label">高 ${h} ${unit}</text>` : ''}
      </svg>
    `);
  },

  trapezoid(top, bottom, height, unit = 'cm', opts = {}) {
    const t = Number(top);
    const b = Number(bottom);
    const h = Number(height);
    const scale = 100 / Math.max(b, h);
    const bw = b * scale;
    const tw = t * scale;
    const hh = h * scale;
    const x0 = (220 - bw) / 2;
    const y0 = 120;
    const pts = `${x0 + (bw - tw) / 2},${y0 - hh} ${x0 + (bw + tw) / 2},${y0 - hh} ${x0 + bw},${y0} ${x0},${y0}`;
    const hideLabels = opts.hideLabels;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 240 145" role="img" aria-label="梯形圖">
        <polygon points="${pts}" class="geo-poly"/>
        <line x1="${x0 + bw / 2}" y1="${y0 - hh}" x2="${x0 + bw / 2}" y2="${y0}" class="geo-height-line"/>
        ${!hideLabels ? `<text x="${x0 + bw / 2}" y="${y0 - hh - 6}" text-anchor="middle" class="geo-label">上底 ${t} ${unit}</text>
        <text x="${x0 + bw / 2}" y="${y0 + 16}" text-anchor="middle" class="geo-label">下底 ${b} ${unit}</text>
        <text x="${x0 + bw + 14}" y="${y0 - hh / 2}" class="geo-label">高 ${h} ${unit}</text>` : ''}
      </svg>
    `);
  },

  quadShape(name, opts = {}) {
    const hide = { hideLabels: true, hideLength: true, hideWidth: true, hideSide: true, ...opts };
    const map = {
      '梯形': () => this.trapezoid(6, 10, 5, 'cm', hide),
      '平行四邊形': () => this.parallelogram(10, 6, 'cm', hide),
      '長方形': () => this.rectangle(10, 6, 'cm', hide),
      '正方形': () => this.square(8, 'cm', hide),
      '菱形': () => this.scene(`
        <svg class="geo-svg" viewBox="0 0 200 150" role="img" aria-label="菱形圖">
          <polygon points="100,20 170,75 100,130 30,75" class="geo-poly"/>
          <text x="100" y="145" text-anchor="middle" class="geo-label">菱形</text>
        </svg>`),
      '五邊形': () => this.polygon(5, '五邊形'),
      '六邊形': () => this.polygon(6, '六邊形'),
      '八邊形': () => this.polygon(8, '八邊形')
    };
    return (map[name] || map['長方形'])();
  },

  polygon(sides, label) {
    const n = Number(sides);
    const cx = 100;
    const cy = 90;
    const r = 62;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 150" role="img" aria-label="${label}">
        <polygon points="${pts}" class="geo-poly"/>
        <text x="${cx}" y="${cy + 5}" text-anchor="middle" class="geo-label">${label}</text>
      </svg>
    `);
  },

  shapeIcon(name) {
    const map = {
      '圓形': () => this.scene(`
        <svg class="geo-svg geo-svg--icon" viewBox="0 0 120 120" role="img" aria-label="圓形">
          <circle cx="60" cy="60" r="46" class="geo-circle"/>
        </svg>`),
      '三角形': () => this.scene(`
        <svg class="geo-svg geo-svg--icon" viewBox="0 0 120 120" role="img" aria-label="三角形">
          <polygon points="60,15 15,105 105,105" class="geo-poly"/>
        </svg>`),
      '正方形': () => this.scene(`
        <svg class="geo-svg geo-svg--icon" viewBox="0 0 120 120" role="img" aria-label="正方形">
          <rect x="22" y="22" width="76" height="76" class="geo-rect"/>
        </svg>`),
      '長方形': () => this.scene(`
        <svg class="geo-svg geo-svg--icon" viewBox="0 0 140 100" role="img" aria-label="長方形">
          <rect x="15" y="20" width="110" height="60" class="geo-rect"/>
        </svg>`)
    };
    return (map[name] || map['三角形'])();
  },

  shapesRow(names) {
    const icons = (names || ['圓形', '三角形', '正方形', '長方形']).map(n => this.shapeIcon(n).replace('geo-scene', 'geo-shape-item'));
    return `<div class="geo-shapes-row" aria-hidden="true">${icons.join('')}</div>`;
  },

  pieChart(data, unit = '人') {
    const entries = Object.entries(data);
    const total = entries.reduce((s, [, v]) => s + Number(v), 0) || 1;
    const cx = 95;
    const cy = 95;
    const r = 78;
    let angle = -Math.PI / 2;
    const slices = entries.map(([label, val], i) => {
      const frac = Number(val) / total;
      const a2 = angle + frac * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const large = frac > 0.5 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      angle = a2;
      return `<path d="${d}" fill="${this._colors[i % this._colors.length]}" stroke="#fff" stroke-width="1.5"/>`;
    });
    const legend = entries.map(([label, val], i) =>
      `<span class="pie-legend-item"><i style="background:${this._colors[i % this._colors.length]}"></i>${label} ${val}${unit}</span>`
    ).join('');
    return this.scene(`
      <div class="pie-chart-wrap">
        <svg class="geo-svg" viewBox="0 0 190 190" role="img" aria-label="圓形圖">${slices.join('')}</svg>
        <div class="pie-legend">${legend}</div>
      </div>
    `);
  },

  pictograph(symbol, perSymbol, count, category) {
    const cells = Array.from({ length: count }, () =>
      `<span class="pictograph-symbol">${symbol}</span>`
    ).join('');
    return this.scene(`
      <div class="pictograph-chart">
        <div class="pictograph-key">每個 ${symbol} = ${perSymbol} 個${category}</div>
        <div class="pictograph-row"><span class="pictograph-label">${category}</span><div class="pictograph-symbols">${cells}</div></div>
      </div>
    `);
  },

  compassRose() {
    return this.scene(`
      <svg class="geo-svg geo-compass" viewBox="0 0 160 160" role="img" aria-label="指南針">
        <circle cx="80" cy="80" r="58" class="geo-compass-ring"/>
        <polygon points="80,18 88,68 80,58 72,68" fill="#ef4444"/>
        <polygon points="80,142 88,92 80,102 72,92" fill="#94a3b8"/>
        <text x="80" y="12" text-anchor="middle" class="geo-compass-label">北</text>
        <text x="80" y="156" text-anchor="middle" class="geo-compass-label">南</text>
        <text x="148" y="84" text-anchor="middle" class="geo-compass-label">東</text>
        <text x="12" y="84" text-anchor="middle" class="geo-compass-label">西</text>
      </svg>
    `);
  },

  directionMap(center, places) {
    const pos = {
      '北': [80, 22], '南': [80, 118], '東': [128, 70], '西': [32, 70],
      '東北': [112, 32], '東南': [112, 108], '西北': [48, 32], '西南': [48, 108],
      '東北面': [112, 32], '東南面': [112, 108], '西北面': [48, 32], '西南面': [48, 108]
    };
    const markers = Object.entries(places || {}).map(([dir, name]) => {
      const p = pos[dir] || pos[dir.replace('面', '')] || [80, 70];
      return `<g><circle cx="${p[0]}" cy="${p[1]}" r="14" class="geo-map-pin"/><text x="${p[0]}" y="${p[1] + 4}" text-anchor="middle" class="geo-map-label">${name}</text></g>`;
    }).join('');
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 160 140" role="img" aria-label="方向圖">
        <rect x="8" y="8" width="144" height="124" rx="8" class="geo-map-bg"/>
        <circle cx="80" cy="70" r="12" class="geo-map-center"/><text x="80" y="74" text-anchor="middle" class="geo-map-label">${center}</text>
        ${markers}
        <text x="80" y="136" text-anchor="middle" class="geo-caption">↑ 北</text>
      </svg>
    `);
  },

  angleDiagram(deg, opts = {}) {
    if (typeof opts === 'boolean') opts = { rightAngle: opts };
    if (opts.mode === 'straight') {
      return this.scene(`
        <svg class="geo-svg" viewBox="0 0 170 130" role="img" aria-label="平角圖">
          <line x1="20" y1="95" x2="150" y2="95" class="geo-angle-line"/>
          <circle cx="85" cy="95" r="4" fill="#2563eb"/>
        </svg>
      `);
    }
    if (opts.mode === 'full') {
      return this.scene(`
        <svg class="geo-svg" viewBox="0 0 170 130" role="img" aria-label="周角圖">
          <circle cx="85" cy="70" r="42" class="geo-circle" fill="none"/>
          <path d="M 127 70 A 42 42 0 1 1 126 72" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow)"/>
        </svg>
      `);
    }
    const d = Number(deg);
    const cx = 40;
    const cy = 110;
    const len = 80;
    const rad = (d * Math.PI) / 180;
    const x = cx + len * Math.cos(-rad);
    const y = cy + len * Math.sin(-rad);
    const arcR = 28;
    const ax = cx + arcR * Math.cos(-rad);
    const ay = cy + arcR * Math.sin(-rad);
    const hideLabel = opts.hideLabel;
    const rightAngle = opts.rightAngle;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 170 130" role="img" aria-label="角度圖">
        <line x1="${cx}" y1="${cy}" x2="${cx + len}" y2="${cy}" class="geo-angle-line"/>
        <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="geo-angle-line"/>
        <path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax} ${ay}" fill="none" stroke="#2563eb" stroke-width="2"/>
        ${!hideLabel ? `<text x="${cx + 36}" y="${cy - 10}" class="geo-label">${d}°</text>` : ''}
        ${rightAngle ? `<rect x="${cx}" y="${cy - 12}" width="12" height="12" class="geo-right-angle"/>` : ''}
      </svg>
    `);
  },

  triangleAngles(a, b, opts = {}) {
    const A = { x: 30, y: 120 };
    const B = { x: 150, y: 120 };
    const C = { x: 90, y: 25 };
    let labels;
    if (opts.mode === 'vertex') {
      labels = `
        <text x="42" y="112" class="geo-label">?</text>
        <text x="118" y="112" class="geo-label">?</text>
        <text x="84" y="48" class="geo-label">${a}°</text>`;
    } else {
      labels = `
        ${a != null ? `<text x="42" y="112" class="geo-label">${a}°</text>` : ''}
        ${b != null ? `<text x="118" y="112" class="geo-label">${b}°</text>` : ''}
        <text x="84" y="48" class="geo-label">?</text>`;
    }
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 180 135" role="img" aria-label="三角形角度圖">
        <polygon points="${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}" class="geo-poly"/>
        ${labels}
      </svg>
    `);
  },

  cuboid(length, width, height, unit = 'cm', opts = {}) {
    const l = Number(length);
    const w = Number(width);
    const h = Number(height);
    const dx = 22;
    const dy = -18;
    const x = 35;
    const y = 95;
    const fw = 90;
    const fh = 45;
    const hideLabels = opts.hideLabels;
    const front = `${x},${y} ${x + fw},${y} ${x + fw},${y - fh} ${x},${y - fh}`;
    const top = `${x},${y - fh} ${x + dx},${y - fh + dy} ${x + fw + dx},${y - fh + dy} ${x + fw},${y - fh}`;
    const side = `${x + fw},${y} ${x + fw + dx},${y + dy} ${x + fw + dx},${y - fh + dy} ${x + fw},${y - fh}`;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 220 130" role="img" aria-label="長方體圖">
        <polygon points="${side}" class="geo-cuboid-side"/>
        <polygon points="${top}" class="geo-cuboid-top"/>
        <polygon points="${front}" class="geo-cuboid-front"/>
        ${!hideLabels ? `<text x="${x + fw / 2}" y="${y + 16}" text-anchor="middle" class="geo-label">長 ${l} ${unit}</text>
        <text x="${x + fw + dx + 8}" y="${y - fh / 2}" class="geo-label">闊 ${w}</text>
        <text x="${x - 8}" y="${y - fh / 2}" text-anchor="end" class="geo-label">高 ${h}</text>` : ''}
      </svg>
    `);
  },

  lengthCompare(aVal, aUnit, bVal, bUnit) {
    const max = Math.max(aVal, bVal);
    const bar = (val, label, color) => {
      const pct = Math.max(10, Math.round((val / max) * 100));
      return `<div class="geo-compare-row"><span>${label}</span><div class="geo-compare-track"><div class="geo-compare-bar" style="width:${pct}%;background:${color}"></div></div><span>${val} ${bUnit || aUnit}</span></div>`;
    };
    return this.scene(`
      <div class="geo-compare">${bar(aVal, `${aVal} ${aUnit}`, '#3b82f6')}${bar(bVal, `${bVal} ${bUnit}`, '#22c55e')}</div>
    `);
  },

  capacityJugs(aL, bMl) {
    const aPct = Math.min(95, aL * 12 + 20);
    const bPct = Math.min(95, bMl / 10 + 15);
    return this.scene(`
      <div class="capacity-compare">
        <div class="capacity-jug"><div class="capacity-fill" style="height:${aPct}%"></div><span>${aL} 升</span></div>
        <div class="capacity-jug capacity-jug--small"><div class="capacity-fill" style="height:${bPct}%"></div><span>${bMl} 毫升</span></div>
      </div>
    `);
  },

  capacityBottles(count, mlEach) {
    const show = Math.min(count, 6);
    const pct = Math.min(92, mlEach / 6 + 18);
    const bottles = Array.from({ length: show }, () =>
      `<div class="capacity-jug capacity-jug--small"><div class="capacity-fill" style="height:${pct}%"></div><span>${mlEach} mL</span></div>`
    ).join('');
    const more = count > show ? `<div class="capacity-more">共 ${count} 瓶</div>` : '';
    return this.scene(`<div class="capacity-bottles">${bottles}${more}</div>`);
  },

  facingPerson(direction) {
    const arrows = { '北方': '↑', '北': '↑', '東方': '→', '東': '→', '南方': '↓', '南': '↓', '西方': '←', '西': '←' };
    return this.scene(`
      <div class="facing-person">
        <div class="facing-arrow">${arrows[direction] || '↑'}</div>
        <div class="facing-icon">🧒</div>
        <div class="facing-label">面向${direction}</div>
      </div>
    `);
  },

  angleCompare(deg1, deg2, label1 = 'A', label2 = 'B', opts = {}) {
    const card = (deg, label) => {
      const inner = this.angleDiagram(deg, { hideLabel: opts.hideLabel }).replace(/<div class="geo-scene"[^>]*>|<\/div>\s*$/g, '');
      return `<div class="geo-angle-card"><div class="geo-angle-title">角 ${label}</div>${inner}</div>`;
    };
    return this.scene(`<div class="geo-angle-compare">${card(deg1, label1)}${card(deg2, label2)}</div>`);
  },

  pieChartPercent(label, pct, opts = {}) {
    const other = 100 - pct;
    const data = opts.hideOther ? { [label]: pct } : { [label]: pct, '其他': other };
    return this.pieChart(data, '%');
  },

  fractionComparePair(n1, d1, n2, d2) {
    const cell = (n, d, label) => {
      const inner = this.fractionCircle(n, d).replace(/<div class="geo-scene"[^>]*>|<\/div>\s*$/g, '');
      return `<div class="frac-compare-item"><div class="frac-compare-label">${label}</div>${inner}</div>`;
    };
    return this.scene(`<div class="frac-compare-row">${cell(n1, d1, '甲')}${cell(n2, d2, '乙')}</div>`);
  },

  objectGrid(n, emoji, cols = 5) {
    const cells = Array.from({ length: n }, () => `<span class="count-object-item">${emoji}</span>`).join('');
    return this.scene(`<div class="count-object-grid" style="--cols:${cols}">${cells}</div>`);
  },

  tenBond(filled, total = 10) {
    const dots = Array.from({ length: total }, (_, i) =>
      `<span class="ten-bond-dot${i < filled ? ' ten-bond-dot--on' : ''}"></span>`
    ).join('');
    return this.scene(`<div class="ten-bond-frame" aria-hidden="true">${dots}</div>`);
  },

  teenBond(teen) {
    const ones = teen % 10;
    const tensDots = Array.from({ length: 10 }, () =>
      `<span class="ten-bond-dot ten-bond-dot--on"></span>`
    ).join('');
    const onesDots = Array.from({ length: 10 }, (_, i) =>
      `<span class="ten-bond-dot${i < ones ? ' ten-bond-dot--on' : ''}"></span>`
    ).join('');
    return this.scene(`
      <div class="teen-bond-row">
        <div class="teen-bond-block"><span class="teen-bond-title">10</span><div class="ten-bond-frame">${tensDots}</div></div>
        <span class="teen-bond-plus">+</span>
        <div class="teen-bond-block"><span class="teen-bond-title">個位</span><div class="ten-bond-frame">${onesDots}</div></div>
      </div>`);
  },

  lShape(totalW, totalH, thick, unit = 'cm') {
    const w = Number(totalW);
    const h = Number(totalH);
    const t = Number(thick);
    const scale = 130 / Math.max(w, h);
    const rw = w * scale;
    const rh = h * scale;
    const rt = t * scale;
    const x = (200 - rw) / 2;
    const y = (120 - rh) / 2 + 10;
    const pts = `${x},${y + rh} ${x + rw},${y + rh} ${x + rw},${y + rt} ${x + rt},${y + rt} ${x + rt},${y} ${x},${y}`;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 135" role="img" aria-label="L形圖">
        <polygon points="${pts}" class="geo-poly"/>
      </svg>
    `);
  },

  overlapSquares(side, overlap, unit = 'cm') {
    const s = Number(side);
    const o = Number(overlap);
    const scale = 100 / s;
    const sz = s * scale;
    const off = (s - o) * scale;
    const x1 = 30;
    const y = 25;
    const x2 = x1 + off;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 135" role="img" aria-label="重疊正方形圖">
        <rect x="${x1}" y="${y}" width="${sz}" height="${sz}" class="geo-rect" fill="none"/>
        <rect x="${x2}" y="${y}" width="${sz}" height="${sz}" class="geo-rect" fill="rgba(59,130,246,0.15)"/>
        <rect x="${x2}" y="${y}" width="${o * scale}" height="${o * scale}" class="geo-rect" fill="rgba(59,130,246,0.35)" stroke="#2563eb" stroke-dasharray="4 2"/>
      </svg>
    `);
  },

  squareCutout(totalSide, cutW, cutH, unit = 'm') {
    const s = Number(totalSide);
    const cw = Number(cutW);
    const ch = Number(cutH);
    const scale = 90 / s;
    const sz = s * scale;
    const cx = (200 - sz) / 2;
    const cy = (120 - sz) / 2 + 8;
    const hx = cx + (sz - cw * scale) / 2;
    const hy = cy + (sz - ch * scale) / 2;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 135" role="img" aria-label="挖去長方形後的正方形圖">
        <rect x="${cx}" y="${cy}" width="${sz}" height="${sz}" class="geo-rect"/>
        <rect x="${hx}" y="${hy}" width="${cw * scale}" height="${ch * scale}" fill="#fff" stroke="#ef4444" stroke-dasharray="5 3"/>
      </svg>
    `);
  }
};
