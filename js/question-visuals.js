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

  _dimLine(x1, y1, x2, y2, label, opts = {}) {
    const vertical = opts.vertical || Math.abs(x2 - x1) < Math.abs(y2 - y1);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const cls = opts.known === false ? 'geo-dim-label geo-dim-label--calc' : 'geo-dim-label';
    if (vertical) {
      const lx = x1 + (opts.offset ?? -16);
      const ly = my + 4;
      return `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="geo-dim-line"/>
        <text x="${lx}" y="${ly}" text-anchor="middle" transform="rotate(-90, ${lx}, ${ly})" class="${cls}">${label}</text>`;
    }
    const ly = y1 + (opts.offset ?? 14);
    return `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="geo-dim-line"/>
      <text x="${mx}" y="${ly}" text-anchor="middle" class="${cls}">${label}</text>`;
  },

  _mapCompass(x, y, size = 22) {
    const r = size / 2;
    return `
      <g class="geo-map-compass" transform="translate(${x},${y})">
        <circle cx="0" cy="0" r="${r}" class="geo-map-compass-ring"/>
        <polygon points="0,${-r + 2} 3,2 0,0 -3,2" fill="#ef4444"/>
        <text x="0" y="${-r - 3}" text-anchor="middle" class="geo-map-compass-n">北</text>
      </g>`;
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
    const note = opts.note || '';
    const lengthLabel = hideLength ? '長 ?' : `長 ${l} ${unit}`;
    const widthLabel = hideWidth ? '闊 ?' : `闊 ${w} ${unit}`;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 230 145" role="img" aria-label="長方形圖">
        <rect x="${x}" y="${y}" width="${rw}" height="${rh}" class="geo-rect"/>
        ${note ? `<text x="${x + rw / 2}" y="${y - 6}" text-anchor="middle" class="geo-note-label">${note}</text>` : ''}
        ${this._dimLine(x, y + rh + 4, x + rw, y + rh + 4, lengthLabel, { known: !hideLength })}
        ${this._dimLine(x - 4, y, x - 4, y + rh, widthLabel, { vertical: true, known: !hideWidth })}
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
    const sideLabel = hideSide ? '邊長 ?' : `邊長 ${s} ${unit}`;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 200 145" role="img" aria-label="正方形圖">
        <rect x="${x}" y="${y}" width="${sz}" height="${sz}" class="geo-rect"/>
        ${this._dimLine(x, y + sz + 8, x + sz, y + sz + 8, sideLabel, { known: !hideSide })}
        ${areaLabel ? `<text x="${x + sz / 2}" y="${y + sz / 2 + 4}" text-anchor="middle" class="geo-known-label">面積 ${areaLabel}</text>` : ''}
      </svg>
    `);
  },

  circle(radius, unit = 'cm', opts = {}) {
    const r = Number(radius);
    const cx = 110;
    const cy = 100;
    const scale = 75 / Math.max(r, 1);
    const rr = r * scale;
    const hideRadius = opts.hideRadius;
    const diameter = opts.diameter != null ? Number(opts.diameter) : r * 2;
    const showDiameter = opts.diameter != null || opts.showDiameter;
    let dims = '';
    if (showDiameter) {
      dims += this._dimLine(cx - rr, cy, cx + rr, cy, hideRadius ? `直徑 ${diameter} ${unit}` : `直徑 ${diameter} ${unit}`, { known: true });
      if (hideRadius) {
        dims += this._dimLine(cx, cy - rr * 0.55, cx + rr * 0.55, cy - rr * 0.55, '半徑 ?', { known: false, offset: -10 });
      }
    } else if (!hideRadius) {
      dims += this._dimLine(cx, cy, cx + rr, cy, `半徑 ${r} ${unit}`, { known: true, offset: -12 });
      dims += this._dimLine(cx - rr, cy + 18, cx + rr, cy + 18, `直徑 ?`, { known: false });
    } else {
      dims += this._dimLine(cx, cy, cx + rr, cy, '半徑 ?', { known: false, offset: -12 });
    }
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 220 185" role="img" aria-label="圓形圖">
        <circle cx="${cx}" cy="${cy}" r="${rr}" class="geo-circle"/>
        <circle cx="${cx}" cy="${cy}" r="3.5" class="geo-circle-center"/>
        ${dims}
        ${opts.label ? `<text x="${cx}" y="${cy + 5}" text-anchor="middle" class="geo-known-label">${opts.label}</text>` : ''}
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
    const hideBase = opts.hideBase || opts.hideLabels;
    const hideHeight = opts.hideHeight || opts.hideLabels;
    const baseLabel = hideBase ? '底 ?' : `底 ${b} ${unit}`;
    const heightLabel = hideHeight ? '高 ?' : `高 ${h} ${unit}`;
    return this.scene(`
      <svg class="geo-svg geo-svg--wide" viewBox="0 0 260 155" role="img" aria-label="平行四邊形圖">
        <polygon points="${pts}" class="geo-poly"/>
        <line x1="${x0 + bw + skew}" y1="${y0 - hh}" x2="${x0 + bw + skew}" y2="${y0}" class="geo-height-line"/>
        ${this._dimLine(x0, y0 + 8, x0 + bw, y0 + 8, baseLabel, { known: !hideBase })}
        ${this._dimLine(x0 + bw + skew + 4, y0 - hh, x0 + bw + skew + 4, y0, heightLabel, { vertical: true, known: !hideHeight })}
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
    const x0 = (240 - bw) / 2;
    const y0 = 120;
    const pts = `${x0 + (bw - tw) / 2},${y0 - hh} ${x0 + (bw + tw) / 2},${y0 - hh} ${x0 + bw},${y0} ${x0},${y0}`;
    const hide = opts.hideLabels;
    const topLabel = hide ? '上底 ?' : `上底 ${t} ${unit}`;
    const bottomLabel = hide ? '下底 ?' : `下底 ${b} ${unit}`;
    const heightLabel = hide ? '高 ?' : `高 ${h} ${unit}`;
    return this.scene(`
      <svg class="geo-svg geo-svg--wide" viewBox="0 0 260 155" role="img" aria-label="梯形圖">
        <polygon points="${pts}" class="geo-poly"/>
        <line x1="${x0 + bw / 2}" y1="${y0 - hh}" x2="${x0 + bw / 2}" y2="${y0}" class="geo-height-line"/>
        ${this._dimLine(x0 + (bw - tw) / 2, y0 - hh - 8, x0 + (bw + tw) / 2, y0 - hh - 8, topLabel, { known: !hide })}
        ${this._dimLine(x0, y0 + 8, x0 + bw, y0 + 8, bottomLabel, { known: !hide })}
        ${this._dimLine(x0 + bw + 6, y0 - hh, x0 + bw + 6, y0, heightLabel, { vertical: true, known: !hide })}
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

  shapesMcq(options) {
    const items = (options || []).map((name, i) => {
      const letter = String.fromCharCode(65 + i);
      const icon = this.shapeIcon(name).replace('geo-scene', 'geo-shape-inner');
      return `<button type="button" class="mcq-shape-btn" data-mcq-index="${i}" aria-label="選項 ${letter} ${name}">
        <span class="mcq-shape-letter">${letter}</span>
        ${icon}
      </button>`;
    }).join('');
    return `<div class="geo-shapes-mcq" role="group" aria-label="圖形選項">${items}</div>`;
  },

  pieChart(data, unit = '人', opts = {}) {
    const entries = Object.entries(data);
    const total = entries.reduce((s, [, v]) => s + Number(v), 0) || 1;
    const cx = 95;
    const cy = 95;
    const r = 78;
    let angle = -Math.PI / 2;
    const showValues = opts.showValues !== false;
    const slices = entries.map(([label, val], i) => {
      const frac = Number(val) / total;
      const a2 = angle + frac * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const large = frac > 0.5 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      const mid = angle + (a2 - angle) / 2;
      const tx = cx + r * 0.58 * Math.cos(mid);
      const ty = cy + r * 0.58 * Math.sin(mid);
      const valueLabel = showValues && frac >= 0.08
        ? `<text x="${tx}" y="${ty + 3}" text-anchor="middle" class="pie-slice-value">${val}</text>`
        : '';
      angle = a2;
      return `<path d="${d}" fill="${this._colors[i % this._colors.length]}" stroke="#fff" stroke-width="1.5"/>${valueLabel}`;
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
      '北': [110, 42], '南': [110, 148], '東': [178, 95], '西': [42, 95],
      '東北': [162, 52], '東南': [162, 138], '西北': [58, 52], '西南': [58, 138],
      '東北面': [162, 52], '東南面': [162, 138], '西北面': [58, 52], '西南面': [58, 138]
    };
    const cx = 110;
    const cy = 95;
    const markers = Object.entries(places || {}).map(([dir, name]) => {
      const p = pos[dir] || pos[dir.replace('面', '')] || [cx, cy];
      return `
        <line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" class="geo-map-link"/>
        <g>
          <circle cx="${p[0]}" cy="${p[1]}" r="16" class="geo-map-pin"/>
          <text x="${p[0]}" y="${p[1] + 4}" text-anchor="middle" class="geo-map-label">${name}</text>
          <text x="${p[0]}" y="${p[1] + 22}" text-anchor="middle" class="geo-map-dir">${dir}</text>
        </g>`;
    }).join('');
    return this.scene(`
      <svg class="geo-svg geo-svg--map" viewBox="0 0 220 185" role="img" aria-label="方向圖">
        <rect x="12" y="12" width="196" height="158" rx="10" class="geo-map-bg"/>
        <text x="110" y="30" text-anchor="middle" class="geo-map-edge">北 ↑</text>
        <text x="110" y="172" text-anchor="middle" class="geo-map-edge">南 ↓</text>
        <text x="24" y="98" text-anchor="middle" class="geo-map-edge">西</text>
        <text x="196" y="98" text-anchor="middle" class="geo-map-edge">東</text>
        ${markers}
        <circle cx="${cx}" cy="${cy}" r="14" class="geo-map-center"/>
        <text x="${cx}" y="${cy + 4}" text-anchor="middle" class="geo-map-label geo-map-label--center">${center}</text>
        ${this._mapCompass(188, 28)}
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
    const stroke = opts.color || '#2563eb';
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 170 130" role="img" aria-label="角度圖">
        <line x1="${cx}" y1="${cy}" x2="${cx + len}" y2="${cy}" class="geo-angle-line"/>
        <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="geo-angle-line" style="stroke:${stroke}"/>
        <path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax} ${ay}" fill="none" stroke="${stroke}" stroke-width="3"/>
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
    const hideHeight = opts.hideHeight;
    const lengthLabel = hideLabels ? '長 ?' : `長 ${l} ${unit}`;
    const widthLabel = hideLabels ? '闊 ?' : `闊 ${w}`;
    const heightLabel = hideHeight ? '高 ?' : `高 ${h}`;
    const front = `${x},${y} ${x + fw},${y} ${x + fw},${y - fh} ${x},${y - fh}`;
    const top = `${x},${y - fh} ${x + dx},${y - fh + dy} ${x + fw + dx},${y - fh + dy} ${x + fw},${y - fh}`;
    const side = `${x + fw},${y} ${x + fw + dx},${y + dy} ${x + fw + dx},${y - fh + dy} ${x + fw},${y - fh}`;
    return this.scene(`
      <svg class="geo-svg" viewBox="0 0 220 130" role="img" aria-label="長方體圖">
        <polygon points="${side}" class="geo-cuboid-side"/>
        <polygon points="${top}" class="geo-cuboid-top"/>
        <polygon points="${front}" class="geo-cuboid-front"/>
        ${!hideLabels ? `<text x="${x + fw / 2}" y="${y + 16}" text-anchor="middle" class="geo-dim-label">${lengthLabel}</text>` : ''}
        ${!hideLabels ? `<text x="${x + fw + dx + 8}" y="${y - fh / 2}" class="geo-dim-label">${widthLabel}</text>` : ''}
        ${!hideLabels && !hideHeight ? `<text x="${x - 8}" y="${y - fh / 2}" text-anchor="end" class="geo-dim-label">${heightLabel}</text>` : ''}
        ${hideHeight ? `<text x="${x - 8}" y="${y - fh / 2}" text-anchor="end" class="geo-dim-label geo-dim-label--calc">${heightLabel}</text>` : ''}
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
    const arrow = arrows[direction] || '↑';
    return this.scene(`
      <div class="facing-person facing-person--exam">
        <div class="facing-compass-mini">
          <span class="facing-compass-n">北↑</span>
          <span class="facing-compass-w">西</span>
          <span class="facing-compass-e">東</span>
          <span class="facing-compass-s">南↓</span>
        </div>
        <div class="facing-body">
          <div class="facing-arrow">${arrow}</div>
          <div class="facing-icon">🧒</div>
          <div class="facing-label">面向${direction.replace('方', '')}</div>
          <div class="facing-hint">前=${arrow} · 左/右/後需自己判斷</div>
        </div>
      </div>
    `);
  },

  speedDiagram(opts = {}) {
    const speed = opts.speed;
    const time = opts.time;
    const distance = opts.distance;
    const ask = opts.ask || 'distance';
    const row = (label, value, unit, calc) => `
      <div class="speed-row ${calc ? 'speed-row--calc' : ''}">
        <span class="speed-label">${label}</span>
        <span class="speed-value">${calc ? '?' : `${value} ${unit}`}</span>
      </div>`;
    return this.scene(`
      <div class="speed-diagram">
        <div class="speed-formula">距離 = 速度 × 時間</div>
        ${row('速度', speed, 'km/h', ask === 'speed')}
        <span class="speed-op">×</span>
        ${row('時間', time, '小時', ask === 'time')}
        <span class="speed-op">=</span>
        ${row('距離', distance, 'km', ask === 'distance')}
        <div class="speed-road">🚗 ————————————————→</div>
      </div>
    `);
  },

  angleCompare(deg1, deg2, label1 = 'A', label2 = 'B', opts = {}) {
    const colors = ['#2563eb', '#ea580c'];
    const card = (deg, label, color) => {
      const inner = this.angleDiagram(deg, { hideLabel: opts.hideLabel, color }).replace(/<div class="geo-scene"[^>]*>|<\/div>\s*$/g, '');
      return `<div class="geo-angle-card"><div class="geo-angle-title">角 ${label}</div>${inner}</div>`;
    };
    return this.scene(`<div class="geo-angle-compare">${card(deg1, label1, colors[0])}${card(deg2, label2, colors[1])}</div>`);
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

  lShape(totalW, totalH, thick, unit = 'cm', opts = {}) {
    const w = Number(totalW);
    const h = Number(totalH);
    const t = Number(thick);
    const scale = 130 / Math.max(w, h);
    const rw = w * scale;
    const rh = h * scale;
    const rt = t * scale;
    const x = (220 - rw) / 2;
    const y = (145 - rh) / 2 + 8;
    const pts = `${x},${y + rh} ${x + rw},${y + rh} ${x + rw},${y + rh - rt} ${x + rt},${y + rh - rt} ${x + rt},${y} ${x},${y}`;
    const showDims = opts.showDims !== false;
    const dims = showDims ? `
      ${this._dimLine(x, y + rh + 6, x + rw, y + rh + 6, `總闊 ${w} ${unit}`)}
      ${this._dimLine(x - 6, y, x - 6, y + rh, `總高 ${h} ${unit}`, { vertical: true })}
      ${this._dimLine(x + rt + 4, y + rh - rt, x + rw, y + rh - rt, `厚 ${t} ${unit}`)}
    ` : '';
    return this.scene(`
      <svg class="geo-svg geo-svg--wide" viewBox="0 0 220 155" role="img" aria-label="L形圖">
        <polygon points="${pts}" class="geo-poly"/>
        ${dims}
      </svg>
    `);
  },

  overlapSquares(side, overlap, unit = 'cm', opts = {}) {
    const s = Number(side);
    const o = Number(overlap);
    const scale = 90 / s;
    const sz = s * scale;
    const off = (s - o) * scale;
    const x1 = 35;
    const y = 28;
    const x2 = x1 + off;
    const oSz = o * scale;
    const overlapArea = opts.overlapArea;
    const areaText = overlapArea != null ? `${overlapArea} cm²` : '';
    const revealOverlap = opts.revealOverlap === true;
    return this.scene(`
      <svg class="geo-svg geo-svg--wide" viewBox="0 0 240 165" role="img" aria-label="重疊正方形圖">
        <rect x="${x1}" y="${y}" width="${sz}" height="${sz}" class="geo-rect" fill="rgba(219,234,254,0.5)"/>
        <rect x="${x2}" y="${y}" width="${sz}" height="${sz}" class="geo-rect" fill="rgba(59,130,246,0.12)"/>
        <rect x="${x2}" y="${y}" width="${oSz}" height="${oSz}" class="geo-overlap-region"/>
        ${areaText ? `<text x="${x2 + oSz / 2}" y="${y + oSz / 2 + 4}" text-anchor="middle" class="geo-overlap-area">${areaText}</text>` : ''}
        ${this._dimLine(x1, y + sz + 10, x1 + sz, y + sz + 10, `邊長 ${s} ${unit}`)}
        ${this._dimLine(x2, y + sz + 26, x2 + oSz, y + sz + 26, revealOverlap ? `重疊邊 ${o} ${unit}` : '重疊邊 ?', { known: revealOverlap })}
        ${this._dimLine(x1, y - 6, x1 + off, y - 6, revealOverlap ? `${s - o} ${unit}` : '?', { known: revealOverlap })}
        ${this._dimLine(x2 + oSz, y - 6, x2 + sz, y - 6, revealOverlap ? `${s - o} ${unit}` : '?', { known: revealOverlap })}
        <text x="120" y="158" text-anchor="middle" class="geo-caption">虛線框 = 重疊部分${areaText ? `（面積 ${areaText}）` : ''}</text>
      </svg>
    `);
  },

  squareCutout(totalSide, cutW, cutH, unit = 'm', opts = {}) {
    const s = Number(totalSide);
    const cw = Number(cutW);
    const ch = Number(cutH);
    const scale = 90 / s;
    const sz = s * scale;
    const cx = (240 - sz) / 2;
    const cy = (145 - sz) / 2 + 10;
    const hx = cx + (sz - cw * scale) / 2;
    const hy = cy + (sz - ch * scale) / 2;
    const cwPx = cw * scale;
    const chPx = ch * scale;
    return this.scene(`
      <svg class="geo-svg geo-svg--wide" viewBox="0 0 240 155" role="img" aria-label="挖去長方形後的正方形圖">
        <rect x="${cx}" y="${cy}" width="${sz}" height="${sz}" class="geo-rect"/>
        <rect x="${hx}" y="${hy}" width="${cwPx}" height="${chPx}" class="geo-cutout-region"/>
        <text x="${hx + cwPx / 2}" y="${hy + chPx / 2 + 4}" text-anchor="middle" class="geo-cutout-label">挖去</text>
        ${this._dimLine(cx, cy + sz + 10, cx + sz, cy + sz + 10, `邊長 ${s} ${unit}`)}
        ${this._dimLine(hx, hy + chPx + 8, hx + cwPx, hy + chPx + 8, `闊 ${cw} ${unit}`)}
        ${this._dimLine(hx + cwPx + 8, hy, hx + cwPx + 8, hy + chPx, `高 ${ch} ${unit}`, { vertical: true })}
      </svg>
    `);
  }
};
