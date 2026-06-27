/* 心光數學小三、小四課題練習題 */
const P34Questions = {
  TIER_POOLS: {
    'p3-five-digit': { easy: ['fiveDigitRead', 'fiveDigitOrder'], medium: ['fiveDigitCompare', 'fiveDigitOrder'], hard: ['fiveDigitCompare', 'fiveDigitValue'] },
    'p3-multiply': { easy: ['multiply2x1'], medium: ['multiply2x1', 'multiply3x1'], hard: ['multiply3x1', 'multiply3x1'] },
    'p3-divide': { easy: ['divide2x1'], medium: ['divide2x1', 'divide3x1'], hard: ['divide3x1', 'divideRemainder'] },
    'p3-mixed-addsub': { easy: ['addSubChain'], medium: ['addSubBracket'], hard: ['addSubBracket', 'addSubWord'] },
    'p3-mixed-mul': { easy: ['mulAdd'], medium: ['mulSub', 'mulAdd'], hard: ['mulSub', 'mulAddWord'] },
    'p3-frac-basic': { easy: ['fracShade', 'fracCompare'], medium: ['fracCompare', 'fracUnit'], hard: ['fracCompare', 'fracGroup'] },
    'p3-length': { easy: ['kmToM'], medium: ['mmToCm', 'lengthCompare'], hard: ['lengthWord', 'lengthCompare'] },
    'p3-capacity': { easy: ['capacityCompare'], medium: ['capacityAdd'], hard: ['capacityWord'] },
    'p3-triangle': { easy: ['triangleAngles', 'triangleEdgeCount'], medium: ['triangleType', 'triangleSides'], hard: ['triangleSides', 'triangleEquilateralPerim'] },
    'p3-quad': { easy: ['quadIdentify', 'quadSidesCount'], medium: ['quadParallel', 'quadPerim'], hard: ['quadPerim', 'quadIdentify'] },
    'p3-barchart': { easy: ['barChart'], medium: ['barChart'], hard: ['barChart'] },
    'p4-multiply': { easy: ['multiply2x2'], medium: ['multiply2x2', 'multiplyDistribute'], hard: ['multiply2x2', 'multiplyDistribute'] },
    'p4-mixed-ops': { easy: ['mixedMulDiv'], medium: ['mixedFourOps', 'mixedBracket'], hard: ['mixedBracket', 'mixedFourOps'] },
    'p4-factor': { easy: ['listFactors'], medium: ['findLcm', 'isPrime'], hard: ['commonFactors', 'isPrime'] },
    'p4-frac-types': { easy: ['improperToMixed'], medium: ['mixedToImproper', 'simplifyFrac'], hard: ['simplifyFrac', 'expandFrac'] },
    'p4-frac-addsub': { easy: ['sameDenomAdd'], medium: ['sameDenomSub', 'sameDenomAdd'], hard: ['sameDenomMixed', 'sameDenomSub'] },
    'p4-decimal': { easy: ['decimalCompare'], medium: ['decimalAdd', 'decimalRead'], hard: ['decimalAdd', 'decimalToFrac'] },
    'p4-area': { easy: ['rectArea'], medium: ['rectAreaWord', 'squareArea'], hard: ['rectAreaWord', 'areaToSide'] },
    'p4-direction': { easy: ['mapDirection'], medium: ['mapDirection'], hard: ['mapDirection'] },
    'p4-word-money': { easy: ['moneyChange'], medium: ['moneyTotal', 'moneyUnit'], hard: ['moneyTotal', 'moneyDiscount'] },
    'p4-word-logic': { easy: ['halfDozenRemain'], medium: ['ribbonRect', 'timesMore'], hard: ['perPersonDiscount', 'halfDozenRemain'] },
    'p4-word-frac': { easy: ['fracWater'], medium: ['fracOrder', 'fracWeight'], hard: ['fracRunEach', 'fracOrder'] }
  },

  generate(topicId, tier = 'medium') {
    QuestionPool.init();
    return QuestionPool.draw(topicId, tier);
  },

  generateRaw(topicId, tier = 'medium') {
    const pools = this.TIER_POOLS[topicId];
    if (pools && pools[tier]) {
      const method = MathUtils.randomChoice(pools[tier]);
      const q = this[method]();
      q.tier = tier;
      q.topicId = topicId;
      return q;
    }
    const method = MathUtils.randomChoice(this.TIER_POOLS[topicId]?.medium || ['multiply2x1']);
    const q = this[method]();
    q.tier = tier;
    q.topicId = topicId;
    return q;
  },

  base(topicId, question, answer, answerDisplay, hint, solution, tier = 'medium', extra = {}) {
    const t = DIFFICULTY_TIERS[tier] || DIFFICULTY_TIERS.medium;
    return {
      topicId, question, answer, answerDisplay, hint, solution,
      tier, tierLabel: t.name, tierPoints: t.points, ...extra
    };
  },

  pick(fns) { return MathUtils.randomChoice(fns)(); },

  _renderBarChart(data, unit = '', opts = {}) {
    const cellUnit = opts.cellUnit ?? 1;
    const showValues = opts.showValues === true;
    const entries = Object.entries(data);
    if (!entries.length) return '';
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];
    const values = entries.map(([, v]) => Number(v) || 0);
    const maxValue = Math.max(...values, cellUnit);
    const maxCells = Math.ceil(maxValue / cellUnit);
    const yTicks = Array.from({ length: maxCells + 1 }, (_, i) => i * cellUnit);
    const yAxis = yTicks.slice().reverse().map(tick =>
      `<span class="bar-chart-ytick">${tick}</span>`
    ).join('');
    const bars = entries.map(([label, value], i) => {
      const num = Number(value) || 0;
      const filledCells = Math.round(num / cellUnit);
      const color = colors[i % colors.length];
      const cells = Array.from({ length: maxCells }, (_, row) => {
        const level = row + 1;
        const filled = level <= filledCells;
        return `<div class="bar-chart-cell${filled ? ' bar-chart-cell--filled' : ''}" style="--cell-color:${color}"></div>`;
      }).join('');
      return `
        <div class="bar-chart-col">
          ${showValues ? `<div class="bar-chart-value">${num}</div>` : ''}
          <div class="bar-chart-grid" style="--max-cells:${maxCells}">
            <div class="bar-chart-cells">${cells}</div>
          </div>
          <div class="bar-chart-label">${label}</div>
        </div>`;
    }).join('');
    const scaleNote = cellUnit > 1
      ? `<div class="bar-chart-scale">每格代表 ${cellUnit} ${unit || '格'}</div>`
      : '';
    return `
      <div class="bar-chart-scene" aria-hidden="true">
        <div class="bar-chart-wrap">
          <div class="bar-chart-yaxis" style="--max-cells:${maxCells}">${yAxis}</div>
          <div class="bar-chart-bars">${bars}</div>
        </div>
        ${scaleNote}
        ${unit ? `<div class="bar-chart-unit">（單位：${unit}）</div>` : ''}
      </div>`;
  },

  _computeTriangleLayout(sides) {
    const s = sides.map(Number);
    const baseVal = Math.max(...s);
    const bi = s.indexOf(baseVal);
    const leftVal = s[(bi + 1) % 3];
    const rightVal = s[(bi + 2) % 3];
    const x = (baseVal * baseVal + leftVal * leftVal - rightVal * rightVal) / (2 * baseVal);
    const y = Math.sqrt(Math.max(0.01, leftVal * leftVal - x * x));
    const pad = 34;
    const vw = 250;
    const vh = 175;
    const scale = Math.min((vw - pad * 2) / baseVal, (vh - pad * 2) / y) * 0.82;
    const A = { x: pad, y: vh - pad };
    const B = { x: pad + baseVal * scale, y: vh - pad };
    const C = { x: pad + x * scale, y: vh - pad - y * scale };
    const edgeLabels = [
      { p1: A, p2: C, label: `${leftVal}` },
      { p1: C, p2: B, label: `${rightVal}` },
      { p1: A, p2: B, label: `${baseVal}` }
    ];
    return { A, B, C, edgeLabels, vw, vh };
  },

  _triangleEdgeLabel(p1, p2, text, offset = 14) {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const lx = mx + nx * offset;
    const ly = my + ny * offset;
    return `<text x="${lx}" y="${ly}" class="triangle-edge-label" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  },

  _renderTriangleSides(sides, unit = 'cm') {
    const layout = this._computeTriangleLayout(sides);
    const { A, B, C, edgeLabels, vw, vh } = layout;
    const labels = edgeLabels.map(e =>
      this._triangleEdgeLabel(e.p1, e.p2, `${e.label} ${unit}`)
    ).join('');
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="三角形圖">
          <polygon points="${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}" class="triangle-shape" />
          ${labels}
        </svg>
      </div>`;
  },

  _renderTriangleSimple() {
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 250 175" role="img" aria-label="三角形圖">
          <polygon points="125,30 35,145 215,145" class="triangle-shape" />
        </svg>
      </div>`;
  },

  _renderIsoscelesTriangle() {
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 250 175" role="img" aria-label="等腰三角形圖">
          <polygon points="125,28 45,145 205,145" class="triangle-shape" />
          <text x="78" y="118" class="triangle-edge-label">等長</text>
          <text x="158" y="118" class="triangle-edge-label">等長</text>
        </svg>
      </div>`;
  },

  _renderRightTriangle() {
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 250 175" role="img" aria-label="直角三角形圖">
          <polygon points="45,145 45,45 205,145" class="triangle-shape" />
          <rect x="45" y="133" width="12" height="12" class="triangle-right-angle" />
        </svg>
      </div>`;
  },

  _renderEquilateralTriangle(side, unit = 'cm') {
    const s = Number(side);
    const vw = 250;
    const vh = 175;
    const pad = 34;
    const scale = (vw - pad * 2) / s;
    const h = (Math.sqrt(3) / 2) * s * scale;
    const cx = vw / 2;
    const top = { x: cx, y: pad };
    const left = { x: cx - (s * scale) / 2, y: pad + h };
    const right = { x: cx + (s * scale) / 2, y: pad + h };
    const label = `${s} ${unit}`;
    const labels = [
      this._triangleEdgeLabel(top, left, label, 16),
      this._triangleEdgeLabel(top, right, label, 16),
      this._triangleEdgeLabel(left, right, label, -18)
    ].join('');
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="等邊三角形圖">
          <polygon points="${top.x},${top.y} ${left.x},${left.y} ${right.x},${right.y}" class="triangle-shape" />
          ${labels}
        </svg>
      </div>`;
  },

  _renderTriangleArea(base, height, unit = 'cm', opts = {}) {
    const b = Number(base);
    const h = Number(height);
    const vw = 250;
    const vh = 175;
    const pad = 30;
    const scale = Math.min((vw - pad * 2) / b, (vh - pad * 2) / h) * 0.78;
    const A = { x: pad, y: vh - pad };
    const B = { x: pad + b * scale, y: vh - pad };
    const C = { x: pad + (b * scale) / 2, y: vh - pad - h * scale };
    const foot = { x: C.x, y: A.y };
    const baseLabel = opts.hideBase
      ? `<text x="${(A.x + B.x) / 2}" y="${A.y + 16}" class="triangle-edge-label triangle-edge-label--calc" text-anchor="middle">底 ?</text>`
      : this._triangleEdgeLabel(A, B, `底 ${b} ${unit}`, -16);
    const heightLabel = opts.hideHeight
      ? `<text x="${C.x + 14}" y="${(C.y + foot.y) / 2}" class="triangle-edge-label triangle-edge-label--calc" dominant-baseline="middle">高 ?</text>`
      : `<text x="${C.x + 14}" y="${(C.y + foot.y) / 2}" class="triangle-edge-label" dominant-baseline="middle">高 ${h} ${unit}</text>`;
    return `
      <div class="triangle-scene" aria-hidden="true">
        <svg class="triangle-svg" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="三角形面積圖">
          <polygon points="${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}" class="triangle-shape" />
          <line x1="${C.x}" y1="${C.y}" x2="${foot.x}" y2="${foot.y}" class="triangle-height-line" />
          <rect x="${foot.x}" y="${foot.y - 8}" width="8" height="8" class="triangle-right-angle" />
          ${baseLabel}
          ${heightLabel}
        </svg>
      </div>`;
  },

  _renderTriangleTypeGallery() {
    return `<div class="triangle-triple">${this._renderEquilateralTriangle(8)}${this._renderIsoscelesTriangle()}${this._renderRightTriangle()}</div>`;
  },

  // ── 小三：五位數 ──
  fiveDigitRead() {
    const n = MathUtils.randomInt(10000, 99999);
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const wan = Math.floor(n / 10000);
    const qian = Math.floor((n % 10000) / 1000);
    const bai = Math.floor((n % 1000) / 100);
    const shi = Math.floor((n % 100) / 10);
    const ge = n % 10;
    let cn = `${chars[wan]}萬`;
    if (qian) cn += `${chars[qian]}千`;
    if (bai) cn += `${chars[bai]}百`;
    if (shi) cn += `${chars[shi]}十`;
    if (ge) cn += `${chars[ge]}`;
    return this.base('p3-five-digit',
      `「${cn}」寫成阿拉伯數字是？`,
      { type: 'decimal', value: n }, String(n),
      '提示：由高位至低位寫',
      `<h4>📖 解法</h4><p>答案 = <strong>${n}</strong></p>`
    );
  },

  fiveDigitCompare() {
    const a = MathUtils.randomInt(10000, 99999);
    let b = MathUtils.randomInt(10000, 99999);
    while (b === a) b = MathUtils.randomInt(10000, 99999);
    const bigger = Math.max(a, b);
    return this.base('p3-five-digit',
      `${a} 和 ${b} 哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：由萬位開始比較',
      `<h4>📖 解法</h4><p>比較後較大的是 <strong>${bigger}</strong></p>`
    );
  },

  fiveDigitOrder() {
    const nums = MathUtils.shuffle(Array.from({ length: 4 }, () => MathUtils.randomInt(10000, 99999)));
    const sorted = [...nums].sort((a, b) => a - b);
    return this.base('p3-five-digit',
      `將以下數字由小至大排列，最小的是哪一個？<br>${nums.join('、')}`,
      { type: 'decimal', value: sorted[0] }, String(sorted[0]),
      '提示：逐位比較大小',
      `<h4>📖 解法</h4><p>由小至大：${sorted.join(' < ')}，最小是 <strong>${sorted[0]}</strong></p>`
    );
  },

  fiveDigitValue() {
    const n = MathUtils.randomInt(10000, 99999);
    const pos = MathUtils.randomChoice(['千', '百', '十']);
    const map = { '千': Math.floor((n % 10000) / 1000), '百': Math.floor((n % 1000) / 100), '十': Math.floor((n % 100) / 10) };
    return this.base('p3-five-digit',
      `在 ${n} 中，${pos}位的數字是？`,
      { type: 'decimal', value: map[pos] }, String(map[pos]),
      '提示：由右數起：個、十、百、千、萬',
      `<h4>📖 解法</h4><p>${pos}位數字是 <strong>${map[pos]}</strong></p>`
    );
  },

  // ── 小三：乘除法 ──
  multiply2x1() {
    const a = MathUtils.randomInt(12, 99);
    const b = MathUtils.randomInt(2, 9);
    const ans = a * b;
    return this.base('p3-multiply',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：用直式計算',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`
    );
  },

  multiply3x1() {
    const a = MathUtils.randomInt(100, 999);
    const b = MathUtils.randomInt(2, 9);
    const ans = a * b;
    return this.base('p3-multiply',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：從個位開始乘，記得進位',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`
    );
  },

  divide2x1() {
    const b = MathUtils.randomInt(2, 9);
    const ans = MathUtils.randomInt(11, 99);
    const a = ans * b;
    return this.base('p3-divide',
      `計算：${a} ÷ ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：想想乘法表',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = <strong>${ans}</strong></p>`
    );
  },

  divide3x1() {
    const b = MathUtils.randomInt(2, 9);
    const ans = MathUtils.randomInt(100, 999);
    const a = ans * b;
    return this.base('p3-divide',
      `計算：${a} ÷ ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：從最高位除起',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = <strong>${ans}</strong></p>`
    );
  },

  divideRemainder() {
    const b = MathUtils.randomInt(3, 9);
    const q = MathUtils.randomInt(10, 50);
    const r = MathUtils.randomInt(1, b - 1);
    const a = q * b + r;
    return this.base('p3-divide',
      `計算：${a} ÷ ${b} = ?（商，唔計餘數）`,
      { type: 'decimal', value: q }, String(q),
      '提示：除唔盡時，答案係商',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = ${q} 餘 ${r}，商是 <strong>${q}</strong></p>`
    );
  },

  // ── 小三：加減混合 ──
  addSubChain() {
    const a = MathUtils.randomInt(20, 80);
    const b = MathUtils.randomInt(10, 40);
    const sum = a + b;
    const c = MathUtils.randomInt(1, Math.min(30, sum - 1));
    const ans = sum - c;
    return this.base('p3-mixed-addsub',
      `計算：${a} + ${b} - ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：由左至右計算',
      `<h4>📖 解法</h4><p>${a} + ${b} = ${a + b}，${a + b} - ${c} = <strong>${ans}</strong></p>`
    );
  },

  addSubBracket() {
    const a = MathUtils.randomInt(10, 50);
    const b = MathUtils.randomInt(10, 50);
    const sum = a + b;
    const c = MathUtils.randomInt(1, Math.min(40, sum - 1));
    const ans = sum - c;
    return this.base('p3-mixed-addsub',
      `計算：(${a} + ${b}) - ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先計括號入面',
      `<h4>📖 解法</h4><p>${a} + ${b} = ${a + b}，${a + b} - ${c} = <strong>${ans}</strong></p>`
    );
  },

  addSubWord() {
    const had = MathUtils.randomInt(50, 200);
    const got = MathUtils.randomInt(20, 80);
    const used = MathUtils.randomInt(10, had + got - 5);
    const ans = had + got - used;
    return this.base('p3-mixed-addsub',
      `商店原有 ${had} 個麵包，上午賣出 ${used} 個，下午又補貨 ${got} 個。現在有多少個？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：原有 - 賣出 + 補貨',
      `<h4>📖 解法</h4><p>${had} - ${used} + ${got} = <strong>${ans}</strong> 個</p>`
    );
  },

  // ── 小三：乘加乘減 ──
  mulAdd() {
    const a = MathUtils.randomInt(2, 9);
    const b = MathUtils.randomInt(3, 12);
    const c = MathUtils.randomInt(5, 30);
    const ans = a * b + c;
    return this.base('p3-mixed-mul',
      `計算：${a} × ${b} + ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先乘後加',
      `<h4>📖 解法</h4><p>${a} × ${b} = ${a * b}，${a * b} + ${c} = <strong>${ans}</strong></p>`
    );
  },

  mulSub() {
    const a = MathUtils.randomInt(3, 9);
    const b = MathUtils.randomInt(4, 12);
    const c = MathUtils.randomInt(2, a * b - 1);
    const ans = a * b - c;
    return this.base('p3-mixed-mul',
      `計算：${a} × ${b} - ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先乘後減',
      `<h4>📖 解法</h4><p>${a} × ${b} = ${a * b}，${a * b} - ${c} = <strong>${ans}</strong></p>`
    );
  },

  mulAddWord() {
    const packs = MathUtils.randomInt(3, 8);
    const each = MathUtils.randomInt(4, 12);
    const extra = MathUtils.randomInt(2, 10);
    const ans = packs * each + extra;
    return this.base('p3-mixed-mul',
      `每盒有 ${each} 枝鉛筆，買了 ${packs} 盒，另外多買 ${extra} 枝。共有多少枝？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先算盒裡的，再加額外的',
      `<h4>📖 解法</h4><p>${packs} × ${each} + ${extra} = <strong>${ans}</strong> 枝</p>`
    );
  },

  // ── 小三：分數認識 ──
  fracShade() {
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8]);
    const num = MathUtils.randomInt(1, den - 1);
    return this.base('p3-frac-basic',
      QuestionVisuals.withVisual(
        `一個圓形平均分成 ${den} 份。看圖：塗色部分佔整個圓形的幾分之幾？（格式：分子/分母）`,
        QuestionVisuals.fractionCircle(num, den)
      ),
      { type: 'fraction', num, den },
      `${num}/${den}`,
      '提示：分母=總份數，分子=塗了幾份',
      `<h4>📖 解法</h4><p>答案 = <strong>${num}/${den}</strong></p>`
    );
  },

  fracCompare() {
    const den = MathUtils.randomChoice([4, 5, 6, 8, 10]);
    let n1 = MathUtils.randomInt(1, den - 1);
    let n2 = MathUtils.randomInt(1, den - 1);
    while (n1 === n2) n2 = MathUtils.randomInt(1, den - 1);
    const bigger = n1 > n2 ? n1 : n2;
    const QV = QuestionVisuals;
    return this.base('p3-frac-basic',
      QV.withVisual(
        `比較 ${MathUtils.formatFractionHTML(n1, den)} 和 ${MathUtils.formatFractionHTML(n2, den)}，較大的是？（填較大分數，如 3/5）`,
        QV.fractionComparePair(n1, den, n2, den)
      ),
      { type: 'fraction', num: bigger, den },
      `${bigger}/${den}`,
      '提示：同分母時，分子大=分數大',
      `<h4>📖 解法</h4><p>同分母 ${den}，${bigger}/${den} 較大</p>`
    );
  },

  fracUnit() {
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8, 10]);
    return this.base('p3-frac-basic',
      `單位分數 ${MathUtils.formatFractionHTML(1, den)} 表示把整體平均分成幾份？`,
      { type: 'decimal', value: den }, String(den),
      '提示：單位分數的分母就是等分的份數',
      `<h4>📖 解法</h4><p>平均分成 <strong>${den}</strong> 份</p>`
    );
  },

  fracGroup() {
    const total = MathUtils.randomChoice([8, 10, 12, 15, 20]);
    const den = MathUtils.randomChoice([2, 3, 4, 5]);
    const num = total / den;
    const QV = QuestionVisuals;
    return this.base('p3-frac-basic',
      QV.withVisual(
        `有 ${total} 個蘋果，平均分成 ${den} 份，每份有幾個？`,
        QV.objectGrid(total, '🍎', 5)
      ),
      { type: 'decimal', value: num }, String(num),
      '提示：用除法計算',
      `<h4>📖 解法</h4><p>${total} ÷ ${den} = <strong>${num}</strong> 個</p>`
    );
  },

  // ── 小三：長度 ──
  kmToM() {
    const km = MathUtils.randomInt(1, 9);
    const ans = km * 1000;
    return this.base('p3-length',
      `${km} 公里 = ? 米`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：1 公里 = 1000 米',
      `<h4>📖 解法</h4><p>${km} × 1000 = <strong>${ans}</strong> 米</p>`
    );
  },

  mmToCm() {
    const mm = MathUtils.randomChoice([10, 20, 30, 50, 80, 100, 150, 200]);
    const ans = mm / 10;
    return this.base('p3-length',
      `${mm} 毫米 = ? 厘米`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：1 厘米 = 10 毫米',
      `<h4>📖 解法</h4><p>${mm} ÷ 10 = <strong>${ans}</strong> 厘米</p>`
    );
  },

  lengthCompare() {
    const a = MathUtils.randomInt(2, 8);
    const b = MathUtils.randomInt(500, 900);
    const aM = a * 1000;
    const bigger = aM > b ? aM : b;
    const display = bigger === aM ? `${a}公里` : `${b}米`;
    return this.base('p3-length',
      QuestionVisuals.withVisual(
        `${a} 公里和 ${b} 米，哪一個較長？（填較長的數值，單位用米）`,
        QuestionVisuals.lengthCompare(a, '公里', b, '米')
      ),
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：先把公里化成米',
      `<h4>📖 解法</h4><p>${a} 公里 = ${aM} 米，較長是 <strong>${bigger}</strong> 米（${display}）</p>`
    );
  },

  lengthWord() {
    const km = MathUtils.randomInt(2, 5);
    const walked = MathUtils.randomInt(500, km * 1000 - 200);
    const ans = km * 1000 - walked;
    return this.base('p3-length',
      `小明要走 ${km} 公里的路，已走了 ${walked} 米，還剩多少米？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先統一單位',
      `<h4>📖 解法</h4><p>${km} 公里 = ${km * 1000} 米，${km * 1000} - ${walked} = <strong>${ans}</strong> 米</p>`
    );
  },

  // ── 小三：容量 ──
  capacityCompare() {
    const a = MathUtils.randomInt(2, 8);
    const b = MathUtils.randomInt(500, 900);
    const aMl = a * 1000;
    const bigger = Math.max(aMl, b);
    return this.base('p3-capacity',
      QuestionVisuals.withVisual(
        `${a} 升和 ${b} 毫升，哪一個較多？（填較多的毫升數）`,
        QuestionVisuals.capacityJugs(a, b)
      ),
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：1 升 = 1000 毫升',
      `<h4>📖 解法</h4><p>${a} 升 = ${aMl} 毫升，較多是 <strong>${bigger}</strong> 毫升</p>`
    );
  },

  capacityAdd() {
    const a = MathUtils.randomInt(1, 3);
    const b = MathUtils.randomInt(200, 800);
    const ans = a * 1000 + b;
    return this.base('p3-capacity',
      QuestionVisuals.withVisual(
        `${a} 升 ${b} 毫升 = ? 毫升`,
        QuestionVisuals.capacityJugs(a, b)
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：先把升化成毫升',
      `<h4>📖 解法</h4><p>${a} × 1000 + ${b} = <strong>${ans}</strong> 毫升</p>`
    );
  },

  capacityWord() {
    const total = MathUtils.randomInt(3, 8);
    const each = MathUtils.randomInt(250, 500);
    const ans = total * each;
    const QV = QuestionVisuals;
    return this.base('p3-capacity',
      QV.withVisual(
        `每瓶果汁 ${each} 毫升，買了 ${total} 瓶，共有多少毫升？`,
        QV.capacityBottles(total, each)
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：用乘法',
      `<h4>📖 解法</h4><p>${total} × ${each} = <strong>${ans}</strong> 毫升</p>`
    );
  },

  // ── 小三：三角形 ──
  triangleAngles() {
    const variants = [
      { q: '一個三角形有幾個角？', a: 3, hint: '每個三角形都有三個角' },
      { q: '一個三角形有幾個頂點？', a: 3, hint: '頂點數量等於角的數量' },
      { q: '兩個三角形共有幾個角？', a: 6, hint: '一個三角形3個角，兩個就是6個' },
      { q: '一個三角形最少有幾條邊？', a: 3, hint: '三角形一定有三條邊' }
    ];
    const v = MathUtils.randomChoice(variants);
    const chart = v.a === 6
      ? `<div class="triangle-double">${this._renderTriangleSimple()}${this._renderTriangleSimple()}</div>`
      : this._renderTriangleSimple();
    return this.base('p3-triangle',
      `<p>看圖：${v.q}</p>${chart}`,
      { type: 'decimal', value: v.a }, String(v.a),
      `提示：${v.hint}`,
      `<h4>📖 解法</h4><p>答案 = <strong>${v.a}</strong></p>`
    );
  },

  triangleEdgeCount() {
    const chart = this._renderTriangleSimple();
    const asks = [
      { q: '一個三角形有幾條邊？', hint: '三角形「三」角形，有三條邊', sol: '三角形有 <strong>3</strong> 條邊' },
      { q: '一個三角形有幾個角？', hint: '數一數圖中的角', sol: '三角形有 <strong>3</strong> 個角' },
      { q: '一個三角形有幾個頂點？', hint: '頂點就是角的尖端', sol: '三角形有 <strong>3</strong> 個頂點' }
    ];
    const ask = MathUtils.randomChoice(asks);
    return this.base('p3-triangle',
      `<p>看圖：${ask.q}</p>${chart}`,
      { type: 'decimal', value: 3 }, '3',
      `提示：${ask.hint}`,
      `<h4>📖 解法</h4><p>${ask.sol}</p>`
    );
  },

  triangleEquilateralPerim() {
    const side = MathUtils.randomInt(3, 15);
    const ans = side * 3;
    const chart = this._renderEquilateralTriangle(side);
    return this.base('p3-triangle',
      `<p>看圖：一個等邊三角形，周界是多少 cm？</p>${chart}`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：等邊三角形三邊相等',
      `<h4>📖 解法</h4><p>${side} × 3 = <strong>${ans}</strong> cm</p>`
    );
  },

  triangleType() {
    const types = [
      { name: '等邊三角形', desc: '三邊相等' },
      { name: '等腰三角形', desc: '兩邊相等' },
      { name: '直角三角形', desc: '有一個直角' }
    ];
    const correct = MathUtils.randomChoice(types);
    const options = MathUtils.shuffle(types.map(t => t.name));
    const chart = this._renderTriangleTypeGallery();
    return {
      topicId: 'p3-triangle',
      question: `<p>看圖：圖中有三種三角形。哪種${correct.desc}？</p>${chart}`,
      type: 'mcq',
      options,
      correctIndex: options.indexOf(correct.name),
      answer: { type: 'decimal', value: options.indexOf(correct.name) },
      answerDisplay: correct.name,
      hint: '提示：認識不同三角形',
      solution: `<h4>📖 解法</h4><p>答案是 <strong>${correct.name}</strong></p>`
    };
  },

  triangleSides() {
    let a, b, c;
    do {
      a = MathUtils.randomInt(3, 12);
      b = MathUtils.randomInt(3, 12);
      c = MathUtils.randomInt(3, 12);
    } while (a + b <= c || a + c <= b || b + c <= a);
    const ans = a + b + c;
    const chart = this._renderTriangleSides([a, b, c]);
    return this.base('p3-triangle',
      `<p>看圖：三角形三邊長如圖所示，周界是多少 cm？</p>${chart}`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：周界 = 三邊相加',
      `<h4>📖 解法</h4><p>${a} + ${b} + ${c} = <strong>${ans}</strong> cm</p>`
    );
  },

  // ── 小三：四邊形 ──
  quadIdentify() {
    const items = [
      { q: '只有一組對邊平行的四邊形是？', a: '梯形' },
      { q: '兩組對邊都平行的四邊形是？', a: '平行四邊形' },
      { q: '四條邊都一樣長的四邊形是？', a: '正方形' },
      { q: '四個角都是直角的四邊形是？', a: '長方形' },
      { q: '對邊平行且四邊相等，但角不一定是直角的四邊形是？', a: '菱形' }
    ];
    const s = MathUtils.randomChoice(items);
    const wrong = ['長方形', '正方形', '菱形', '梯形', '平行四邊形'].filter(x => x !== s.a);
    const options = MathUtils.shuffle([s.a, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return {
      topicId: 'p3-quad',
      question: s.q,
      type: 'mcq',
      options,
      correctIndex: options.indexOf(s.a),
      answer: { type: 'decimal', value: options.indexOf(s.a) },
      answerDisplay: s.a,
      hint: '提示：留意邊是否平行',
      solution: `<h4>📖 解法</h4><p>答案是 <strong>${s.a}</strong></p>`
    };
  },

  quadParallel() {
    const items = [
      { shape: '梯形', pairs: 1 },
      { shape: '平行四邊形', pairs: 2 },
      { shape: '長方形', pairs: 2 },
      { shape: '菱形', pairs: 2 }
    ];
    const s = MathUtils.randomChoice(items);
    return this.base('p3-quad',
      QuestionVisuals.withVisual(`一個${s.shape}有幾組平行邊？`, QuestionVisuals.quadShape(s.shape)),
      { type: 'decimal', value: s.pairs }, String(s.pairs),
      '提示：留意對邊是否平行',
      `<h4>📖 解法</h4><p>${s.shape}有 <strong>${s.pairs}</strong> 組平行邊</p>`
    );
  },

  quadSidesCount() {
    const shapes = ['平行四邊形', '梯形', '長方形', '正方形', '菱形'];
    const shape = MathUtils.randomChoice(shapes);
    return this.base('p3-quad',
      QuestionVisuals.withVisual(`一個${shape}有幾條邊？`, QuestionVisuals.quadShape(shape)),
      { type: 'decimal', value: 4 }, '4',
      '提示：四邊形都有四條邊',
      `<h4>📖 解法</h4><p>${shape}有 <strong>4</strong> 條邊</p>`
    );
  },

  quadPerim() {
    const l = MathUtils.randomInt(5, 18);
    const w = MathUtils.randomInt(3, 12);
    const ans = 2 * (l + w);
    const shapes = ['長方形', '平行四邊形'];
    const shape = MathUtils.randomChoice(shapes);
    const visual = shape === '長方形'
      ? QuestionVisuals.rectangle(l, w, 'cm')
      : QuestionVisuals.parallelogram(l, w, 'cm');
    return this.base('p3-quad',
      QuestionVisuals.withVisual(`一個${shape}，長 ${l} cm，闊 ${w} cm，周界是多少 cm？`, visual),
      { type: 'decimal', value: ans }, String(ans),
      '提示：周界 = 2 × (長 + 闊)',
      `<h4>📖 解法</h4><p>2 × (${l} + ${w}) = <strong>${ans}</strong> cm</p>`
    );
  },

  quadCount() {
    return this.quadSidesCount();
  },

  // ── 小三：棒形圖 ──
  barChart() {
    const items = MathUtils.shuffle(['蘋果', '橙', '香蕉', '葡萄', '西瓜', '芒果', '梨', '草莓']).slice(0, 4);
    const cellUnit = MathUtils.randomChoice([1, 2, 5]);
    const maxCells = MathUtils.randomInt(8, 12);
    const data = {};
    items.forEach(name => { data[name] = MathUtils.randomInt(2, maxCells) * cellUnit; });
    const chart = this._renderBarChart(data, '個', { cellUnit });
    const names = Object.keys(data);
    const vals = names.map(n => data[n]);
    const a = names[0]; const b = names[1]; const c = names[2]; const d = names[3];
    const types = [
      () => {
        const ans = Math.abs(data[d] - data[c]);
        return { q: `<p>看圖：棒形圖顯示各水果銷量。${d}和${c}相差多少個？</p>${chart}`, a: ans };
      },
      () => {
        const ans = vals.reduce((s, n) => s + n, 0);
        return { q: `<p>看圖：棒形圖顯示各水果銷量。共賣出多少個？</p>${chart}`, a: ans };
      },
      () => {
        const item = MathUtils.randomChoice(names);
        const price = MathUtils.randomChoice([2, 3, 5, 8, 10]);
        const mw = MathUtils.itemClassifier(item);
        const ans = data[item] * price;
        return { q: `<p>看圖：棒形圖顯示各水果銷量。${item}每${mw} ${price} 元，${item}共賣了多少元？</p>${chart}`, a: ans };
      },
      () => {
        const ans = Math.max(...vals) - Math.min(...vals);
        return { q: `<p>看圖：棒形圖顯示各水果銷量。最多同最少相差多少個？</p>${chart}`, a: ans };
      },
      () => {
        const ans = data[a] + data[b];
        return { q: `<p>看圖：棒形圖顯示各水果銷量。${a}和${b}共賣了多少個？</p>${chart}`, a: ans };
      }
    ];
    const t = MathUtils.randomChoice(types)();
    return this.base('p3-barchart', t.q,
      { type: 'decimal', value: t.a }, String(t.a),
      '提示：仔細閱讀棒形圖數據',
      `<h4>📖 解法</h4><p>${cellUnit > 1 ? `每格代表 ${cellUnit} 個，先數格再計算。` : '逐格數出各水果的格數。'}答案 = <strong>${t.a}</strong></p>`
    );
  },

  // ── 小四：乘法 ──
  multiply2x2() {
    const a = MathUtils.randomInt(12, 49);
    const b = MathUtils.randomInt(12, 49);
    const ans = a * b;
    return this.base('p4-multiply',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：用直式，注意進位',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`
    );
  },

  multiplyDistribute() {
    const a = MathUtils.randomInt(20, 40);
    const b = MathUtils.randomInt(3, 8);
    const c = MathUtils.randomInt(2, 9);
    const ans = a * (b + c);
    return this.base('p4-multiply',
      `用分配性質計算：${a} × (${b} + ${c}) = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：a × (b + c) = a × b + a × c',
      `<h4>📖 解法</h4><p>${a} × ${b} + ${a} × ${c} = ${a * b} + ${a * c} = <strong>${ans}</strong></p>`
    );
  },

  // ── 小四：四則混合 ──
  mixedMulDiv() {
    const a = MathUtils.randomInt(20, 80);
    const b = MathUtils.randomInt(2, 9);
    const c = MathUtils.randomInt(2, 5);
    const ans = a / b * c;
    if (!Number.isInteger(ans)) return this.mixedFourOps();
    return this.base('p4-mixed-ops',
      `計算：${a} ÷ ${b} × ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：由左至右計算乘除',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = ${a / b}，${a / b} × ${c} = <strong>${ans}</strong></p>`
    );
  },

  mixedFourOps() {
    const templates = [
      () => {
        const a = MathUtils.randomInt(2, 9);
        const b = MathUtils.randomInt(3, 12);
        const c = MathUtils.randomInt(5, 30);
        const ans = a * b + c;
        return { q: `計算：${a} × ${b} + ${c} = ?`, ans, sol: `${a} × ${b} = ${a * b}，${a * b} + ${c} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(2, 9);
        const b = MathUtils.randomInt(3, 12);
        const c = MathUtils.randomInt(2, a * b - 1);
        const ans = a * b - c;
        return { q: `計算：${a} × ${b} - ${c} = ?`, ans, sol: `${a} × ${b} = ${a * b}，${a * b} - ${c} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(10, 40);
        const b = MathUtils.randomInt(2, 9);
        const c = MathUtils.randomInt(2, 9);
        const ans = a + b * c;
        return { q: `計算：${a} + ${b} × ${c} = ?`, ans, sol: `${b} × ${c} = ${b * c}，${a} + ${b * c} = ${ans}` };
      },
      () => {
        const b = MathUtils.randomInt(2, 9);
        const c = MathUtils.randomInt(2, 9);
        const product = b * c;
        const a = MathUtils.randomInt(product, product + 40);
        const ans = a - product;
        return { q: `計算：${a} - ${b} × ${c} = ?`, ans, sol: `${b} × ${c} = ${product}，${a} - ${product} = ${ans}` };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p4-mixed-ops', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：先乘除，後加減',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  mixedBracket() {
    let a; let b; let c; let d; let ans;
    do {
      a = MathUtils.randomInt(2, 8);
      b = MathUtils.randomInt(3, 10);
      c = MathUtils.randomInt(2, 6);
      d = MathUtils.randomInt(5, 20);
      ans = a * (b + c) - d;
    } while (ans < 0);
    return this.base('p4-mixed-ops',
      `計算：${a} × (${b} + ${c}) - ${d} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先括號，再乘，最後減',
      `<h4>📖 解法</h4><p>${b} + ${c} = ${b + c}，${a} × ${b + c} = ${a * (b + c)}，${a * (b + c)} - ${d} = <strong>${ans}</strong></p>`
    );
  },

  // ── 小四：倍數因數 ──
  listFactors() {
    const n = MathUtils.randomChoice([8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 27, 28, 30, 32, 36]);
    const factors = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
    const nonFactors = [];
    for (let i = 2; i < n; i++) if (n % i !== 0) nonFactors.push(i);
    const isFactor = Math.random() > 0.4;
    const ask = isFactor
      ? MathUtils.randomChoice(factors.filter(f => f > 1 && f < n))
      : MathUtils.randomChoice(nonFactors.slice(0, 8));
    return this.base('p4-factor',
      `${ask} 是 ${n} 的因數嗎？（是填1，否填0）`,
      { type: 'decimal', value: isFactor ? 1 : 0 },
      isFactor ? '1' : '0',
      `提示：用試除法檢查能否整除`,
      `<h4>📖 解法</h4><p>${n} ${isFactor ? `÷ ${ask} = ${n / ask}，是` : `不能被 ${ask} 整除，不是`}因數</p>`
    );
  },

  findLcm() {
    const pairs = [[4, 6], [4, 8], [6, 8], [6, 9], [6, 12], [8, 12], [9, 12], [4, 10], [5, 10], [8, 10], [3, 5], [3, 7], [5, 8], [9, 15]];
    const [a, b] = MathUtils.randomChoice(pairs);
    const ans = MathUtils.lcm(a, b);
    return this.base('p4-factor',
      `${a} 和 ${b} 的最小公倍數是？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：列出倍數找最小的共同倍數',
      `<h4>📖 解法</h4><p>最小公倍數 = <strong>${ans}</strong></p>`
    );
  },

  isPrime() {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21];
    const isPrime = Math.random() > 0.5;
    const n = isPrime ? MathUtils.randomChoice(primes) : MathUtils.randomChoice(composites);
    return this.base('p4-factor',
      `${n} 是質數嗎？（是填1，否填0）`,
      { type: 'decimal', value: isPrime ? 1 : 0 },
      isPrime ? '1' : '0',
      '提示：質數只有1和自己兩個因數',
      `<h4>📖 解法</h4><p>${n} ${isPrime ? '是' : '不是'}質數</p>`
    );
  },

  commonFactors() {
    const a = MathUtils.randomChoice([12, 18, 24, 30]);
    const b = MathUtils.randomChoice([18, 24, 36, 48]);
    const ans = MathUtils.gcd(a, b);
    return this.base('p4-factor',
      `${a} 和 ${b} 的最大公因數是？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：找兩數共同的因數中最大的',
      `<h4>📖 解法</h4><p>最大公因數 = <strong>${ans}</strong></p>`
    );
  },

  // ── 小四：分數類型 ──
  improperToMixed() {
    const den = MathUtils.randomChoice([3, 4, 5, 6, 8]);
    const whole = MathUtils.randomInt(1, 4);
    const num = MathUtils.randomInt(1, den - 1);
    const improper = whole * den + num;
    return this.base('p4-frac-types',
      `把假分數 ${MathUtils.formatFractionHTML(improper, den)} 化為帶分數（格式：整數 分子/分母）`,
      { type: 'fraction', num: improper, den },
      `${whole} ${num}/${den}`,
      '提示：分子 ÷ 分母',
      `<h4>📖 解法</h4><p>${improper} ÷ ${den} = ${whole} 餘 ${num}，即 <strong>${whole} ${num}/${den}</strong></p>`
    );
  },

  mixedToImproper() {
    const den = MathUtils.randomChoice([3, 4, 5, 6, 8]);
    const whole = MathUtils.randomInt(1, 4);
    const num = MathUtils.randomInt(1, den - 1);
    const improper = whole * den + num;
    return this.base('p4-frac-types',
      `把帶分數 ${whole} ${MathUtils.formatFractionHTML(num, den)} 化為假分數（格式：分子/分母）`,
      { type: 'fraction', num: improper, den },
      `${improper}/${den}`,
      '提示：整數 × 分母 + 分子',
      `<h4>📖 解法</h4><p>${whole} × ${den} + ${num} = ${improper}，即 <strong>${improper}/${den}</strong></p>`
    );
  },

  simplifyFrac() {
    const den = MathUtils.randomChoice([6, 8, 10, 12]);
    const g = MathUtils.randomChoice([2, 3]);
    const sn = MathUtils.randomInt(1, den / g - 1);
    const num = sn * g;
    const sd = den;
    const s = MathUtils.simplify(num, sd);
    return this.base('p4-frac-types',
      `把 ${MathUtils.formatFractionHTML(num, sd)} 約分至最簡分數`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：找分子分母的公因數',
      `<h4>📖 解法</h4><p>約分後 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`
    );
  },

  expandFrac() {
    const num = MathUtils.randomInt(1, 4);
    const den = MathUtils.randomInt(2, 6);
    const factor = MathUtils.randomChoice([2, 3]);
    const ans = { num: num * factor, den: den * factor };
    return this.base('p4-frac-types',
      `把 ${MathUtils.formatFractionHTML(num, den)} 擴分，使分母變成 ${den * factor}`,
      { type: 'fraction', num: ans.num, den: ans.den },
      `${ans.num}/${ans.den}`,
      '提示：分子分母同乘一個數',
      `<h4>📖 解法</h4><p>${num} × ${factor} = ${ans.num}，${den} × ${factor} = ${ans.den}，即 <strong>${ans.num}/${ans.den}</strong></p>`
    );
  },

  // ── 小四：同分母分數加減 ──
  sameDenomAdd() {
    const den = MathUtils.randomChoice([4, 5, 6, 8, 10, 12]);
    const n1 = MathUtils.randomInt(1, den - 2);
    const n2 = MathUtils.randomInt(1, den - n1 - 1);
    const ans = MathUtils.simplify(n1 + n2, den);
    return this.base('p4-frac-addsub',
      `計算：${MathUtils.formatFractionHTML(n1, den)} + ${MathUtils.formatFractionHTML(n2, den)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：分母不變，分子相加',
      `<h4>📖 解法</h4><p>${n1} + ${n2} = ${n1 + n2}，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  sameDenomSub() {
    const den = MathUtils.randomChoice([4, 5, 6, 8, 10, 12]);
    const n1 = MathUtils.randomInt(3, den - 1);
    const n2 = MathUtils.randomInt(1, n1 - 1);
    const ans = MathUtils.simplify(n1 - n2, den);
    return this.base('p4-frac-addsub',
      `計算：${MathUtils.formatFractionHTML(n1, den)} - ${MathUtils.formatFractionHTML(n2, den)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：分母不變，分子相減',
      `<h4>📖 解法</h4><p>${n1} - ${n2} = ${n1 - n2}，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  sameDenomMixed() {
    const den = MathUtils.randomChoice([6, 8, 10, 12]);
    const w = MathUtils.randomInt(1, 3);
    const n1 = MathUtils.randomInt(1, den - 2);
    const n2 = MathUtils.randomInt(1, den - 2);
    const total = w * den + n1 + n2;
    const ans = MathUtils.simplify(total, den);
    return this.base('p4-frac-addsub',
      `計算：${w} ${MathUtils.formatFractionHTML(n1, den)} + ${MathUtils.formatFractionHTML(n2, den)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den, true),
      '提示：先化假分數再相加',
      `<h4>📖 解法</h4><p>化假分數後相加，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den, true)}</strong></p>`
    );
  },

  // ── 小四：小數 ──
  decimalCompare() {
    const a = MathUtils.roundTo(Math.random() * 9 + 0.1, 1);
    let b = MathUtils.roundTo(Math.random() * 9 + 0.1, 1);
    while (b === a) b = MathUtils.roundTo(Math.random() * 9 + 0.1, 1);
    const bigger = Math.max(a, b);
    return this.base('p4-decimal',
      `${a} 和 ${b}，哪一個較大？（填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：由左至右比較',
      `<h4>📖 解法</h4><p>較大的是 <strong>${bigger}</strong></p>`
    );
  },

  decimalAdd() {
    const a = MathUtils.roundTo(Math.random() * 5 + 1, 1);
    const b = MathUtils.roundTo(Math.random() * 5 + 1, 1);
    const ans = MathUtils.roundTo(a + b, 1);
    return this.base('p4-decimal',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：小數點對齊',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`
    );
  },

  decimalRead() {
    const whole = MathUtils.randomInt(0, 9);
    const tenth = MathUtils.randomInt(1, 9);
    const val = whole + tenth / 10;
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const cn = whole ? `${chars[whole]}點${chars[tenth]}` : `零點${chars[tenth]}`;
    return this.base('p4-decimal',
      `「${cn}」寫成小數是？`,
      { type: 'decimal', value: val }, String(val),
      '提示：點後第一位是十分位',
      `<h4>📖 解法</h4><p>答案 = <strong>${val}</strong></p>`
    );
  },

  decimalToFrac() {
    const tenth = MathUtils.randomChoice([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const val = tenth / 10;
    const s = MathUtils.simplify(tenth, 10);
    return this.base('p4-decimal',
      `把 ${val} 化為最簡分數`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：0.幾 = 十分之幾',
      `<h4>📖 解法</h4><p>${val} = ${tenth}/10 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`
    );
  },

  // ── 小四：面積 ──
  rectArea() {
    const l = MathUtils.randomInt(5, 20);
    const w = MathUtils.randomInt(3, 15);
    const ans = l * w;
    return this.base('p4-area',
      QuestionVisuals.withVisual(
        `一個長方形，長 ${l} cm，闊 ${w} cm，面積是多少 cm²？`,
        QuestionVisuals.rectangle(l, w, 'cm')
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：面積 = 長 × 闊',
      `<h4>📖 解法</h4><p>${l} × ${w} = <strong>${ans}</strong> cm²</p>`
    );
  },

  squareArea() {
    const side = MathUtils.randomInt(4, 15);
    const ans = side * side;
    return this.base('p4-area',
      QuestionVisuals.withVisual(
        `一個正方形邊長 ${side} cm，面積是多少 cm²？`,
        QuestionVisuals.square(side, 'cm')
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：正方形面積 = 邊長 × 邊長',
      `<h4>📖 解法</h4><p>${side} × ${side} = <strong>${ans}</strong> cm²</p>`
    );
  },

  rectAreaWord() {
    const l = MathUtils.randomInt(6, 15);
    const w = MathUtils.randomInt(4, 10);
    const price = MathUtils.randomInt(5, 20);
    const ans = l * w * price;
    return this.base('p4-area',
      QuestionVisuals.withVisual(
        `一塊長 ${l} m、闊 ${w} m 的地毯，每平方米 ${price} 元，鋪滿要多少元？`,
        QuestionVisuals.rectangle(l, w, 'm')
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：先算面積，再乘單價',
      `<h4>📖 解法</h4><p>面積 = ${l * w} m²，費用 = ${l * w} × ${price} = <strong>${ans}</strong> 元</p>`
    );
  },

  areaToSide() {
    const side = MathUtils.randomInt(4, 12);
    const area = side * side;
    return this.base('p4-area',
      QuestionVisuals.withVisual(
        `一個正方形面積是 ${area} cm²，邊長是多少 cm？`,
        QuestionVisuals.square(side, 'cm', { areaLabel: `${area} cm²`, hideSide: true })
      ),
      { type: 'decimal', value: side }, String(side),
      '提示：邊長 × 邊長 = 面積',
      `<h4>📖 解法</h4><p>${side} × ${side} = ${area}，邊長 = <strong>${side}</strong> cm</p>`
    );
  },

  // ── 小四：方向 ──
  mapDirection() {
    const bank = this.getDirectionBank();
    const q = MathUtils.randomChoice(bank);
    const QV = QuestionVisuals;
    let visual = '';
    if (q.map) visual = QV.directionMap(q.map.center, q.map.places);
    else if (q.facing) visual = QV.facingPerson(q.facing);
    else visual = QV.compassRose();
    return {
      topicId: 'p4-direction',
      question: QV.withVisual(q.q, visual),
      type: 'mcq',
      options: q.options,
      correctIndex: q.correct,
      answer: { type: 'decimal', value: q.correct },
      answerDisplay: q.options[q.correct],
      hint: '提示：對照指南針八個方向',
      solution: `<h4>📖 解法</h4><p>${q.solution}</p>`
    };
  },

  getDirectionBank() {
    if (this._directionBank) return this._directionBank;
    const bank = [];
    const dirs = ['東', '南', '西', '北'];
    const facingMap = {
      '北方': { right: '東方', left: '西方', back: '南方' },
      '東方': { right: '南方', left: '北方', back: '西方' },
      '南方': { right: '西方', left: '東方', back: '北方' },
      '西方': { right: '北方', left: '南方', back: '東方' }
    };
    Object.entries(facingMap).forEach(([face, d]) => {
      ['right', 'left', 'back'].forEach(side => {
        const labels = { right: '右面', left: '左面', back: '後面' };
        const correct = d[side];
        const options = MathUtils.shuffle(['東方', '西方', '南方', '北方']);
        bank.push({
          q: `小光面向${face}，他的${labels[side]}是哪個方向？`,
          facing: face,
          options,
          correct: options.indexOf(correct),
          solution: `面向${face}時，${labels[side]}是${correct}。`
        });
      });
    });
    const relQuestions = [
      { q: '圖書館在學校的東面，公園在學校的北面。圖書館在公園的哪個方向？', options: ['東北面', '東南面', '西北面', '西南面'], correct: 0, solution: '圖書館在學校東面，公園在學校北面，所以圖書館在公園的東北面。', map: { center: '學校', places: { '東': '圖書館', '北': '公園' } } },
      { q: '商店在中心的東面，泳池在中心的西北面。商店在泳池的哪個方向？', options: ['東南面', '東北面', '西北面', '西南面'], correct: 0, solution: '商店在中心東面，泳池在中心西北面，商店在泳池的東南面。', map: { center: '中心', places: { '東': '商店', '西北': '泳池' } } },
      { q: 'A在B的北面，C在B的東面。A在C的哪個方向？', options: ['西北面', '東北面', '西南面', '東南面'], correct: 0, solution: 'A在B北，C在B東，A在C的西北面。', map: { center: 'B', places: { '北': 'A', '東': 'C' } } },
      { q: '郵局在車站的西面，醫院在車站的南面。郵局在醫院的哪個方向？', options: ['西北面', '西南面', '東北面', '東南面'], correct: 0, solution: '郵局在車站西，醫院在車站南，郵局在醫院西北面。', map: { center: '車站', places: { '西': '郵局', '南': '醫院' } } },
      { q: '從中心向北走可到公園，向東走可到圖書館。圖書館在公園的哪個方向？', options: ['東南面', '東北面', '西北面', '西南面'], correct: 0, solution: '圖書館在中心東，公園在中心北，圖書館在公園東南面。', map: { center: '中心', places: { '北': '公園', '東': '圖書館' } } },
      { q: '小明面向南方，向左轉後面向哪個方向？', options: ['東方', '西方', '北方', '南方'], correct: 0, solution: '面向南向左轉，面向東方。' },
      { q: '小明面向西方，向右轉後面向哪個方向？', options: ['北方', '南方', '東方', '西方'], correct: 0, solution: '面向西向右轉，面向北方。' },
      { q: '由北向南走，右面是哪個方向？', options: ['西方', '東方', '南方', '北方'], correct: 0, solution: '面向南方時，右面是西方。' },
      { q: '由東向西走，左面是哪個方向？', options: ['南方', '北方', '東方', '西方'], correct: 0, solution: '面向西方時，左面是南方。' },
      { q: '東北的相反方向是？', options: ['西南', '西北', '東南', '東北'], correct: 0, solution: '東北的相反方向是西南。' },
      { q: '西北的相反方向是？', options: ['東南', '西南', '東北', '西北'], correct: 0, solution: '西北的相反方向是東南。' },
      { q: '東南的相反方向是？', options: ['西北', '西南', '東北', '東南'], correct: 0, solution: '東南的相反方向是西北。' },
      { q: '西南的相反方向是？', options: ['東北', '西北', '東南', '西南'], correct: 0, solution: '西南的相反方向是東北。' },
      { q: '面向東方，向右轉後面向？', options: ['南方', '北方', '西方', '東方'], correct: 0, solution: '面向東向右轉，面向南方。' },
      { q: '面向北方，向左轉後面向？', options: ['西方', '東方', '南方', '北方'], correct: 0, solution: '面向北向左轉，面向西方。' },
      { q: '面向西方，向左轉後面向？', options: ['南方', '北方', '東方', '西方'], correct: 0, solution: '面向西向左轉，面向南方。' },
      { q: '面向南方，向右轉後面向？', options: ['西方', '東方', '北方', '南方'], correct: 0, solution: '面向南向右轉，面向西方。' }
    ];
    relQuestions.forEach(q => bank.push(q));
    const relPairs = [
      ['東', '北', '東北面'], ['東', '南', '東南面'], ['西', '北', '西北面'], ['西', '南', '西南面'],
      ['北', '東', '東北面'], ['南', '東', '東南面'], ['北', '西', '西北面'], ['南', '西', '西南面']
    ];
    const placeSets = [
      ['學校', '圖書館', '公園'], ['車站', '郵局', '醫院'], ['中心', '泳池', '商店'],
      ['大廈', '超級市場', '巴士站'], ['屋苑', '球場', '泳池']
    ];
    placeSets.forEach(([base, a, b]) => {
      relPairs.forEach(([d1, d2, ans]) => {
        const options = MathUtils.shuffle(['東北面', '東南面', '西南面', '西北面']);
        bank.push({
          q: `${a}在${base}的${d1}面，${b}在${base}的${d2}面。${a}在${b}的哪個方向？`,
          map: { center: base, places: { [d1]: a, [d2]: b } },
          options,
          correct: options.indexOf(ans),
          solution: `${a}在${d1}面，${b}在${d2}面，所以${a}在${b}的${ans}。`
        });
      });
    });
    this._directionBank = bank;
    return bank;
  },

  // ── 小四：應用題 ──
  moneyChange() {
    const paid = MathUtils.randomChoice([50, 100, 200]);
    const price = MathUtils.randomInt(10, paid - 5);
    const ans = paid - price;
    return this.base('p4-word-money',
      `買東西付 ${paid} 元，東西售價 ${price} 元，應找回多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：找回 = 付的 - 售價',
      `<h4>📖 解法</h4><p>${paid} - ${price} = <strong>${ans}</strong> 元</p>`
    );
  },

  moneyTotal() {
    const items = MathUtils.shuffle(['書', '文具', '零食', '玩具', '貼紙', '飲料']).slice(0, 3);
    const prices = items.map(() => MathUtils.randomInt(8, 60));
    const ans = prices.reduce((a, b) => a + b, 0);
    const parts = items.map((name, i) => `${name} ${prices[i]} 元`).join('、');
    return this.base('p4-word-money',
      `小明買${parts}，共花了多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：把三項加起來',
      `<h4>📖 解法</h4><p>${prices.join(' + ')} = <strong>${ans}</strong> 元</p>`
    );
  },

  moneyUnit() {
    const packs = MathUtils.randomInt(3, 8);
    const each = MathUtils.randomInt(8, 25);
    const ans = packs * each;
    return this.base('p4-word-money',
      `每包餅乾 ${each} 元，買 ${packs} 包要多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：單價 × 數量',
      `<h4>📖 解法</h4><p>${each} × ${packs} = <strong>${ans}</strong> 元</p>`
    );
  },

  moneyDiscount() {
    const original = MathUtils.randomInt(50, 200);
    const discount = MathUtils.randomChoice([0.9, 0.8, 0.5]);
    const ans = Math.round(original * discount);
    const label = discount === 0.9 ? '九折' : discount === 0.8 ? '八折' : '半價';
    return this.base('p4-word-money',
      `一件衣服原價 ${original} 元，${label}後售價多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：用乘法計算折扣',
      `<h4>📖 解法</h4><p>${original} × ${discount} = <strong>${ans}</strong> 元</p>`
    );
  },

  halfDozenRemain() {
    const dozen = MathUtils.randomInt(2, 5);
    const total = dozen * 12;
    const perBox = MathUtils.randomChoice([5, 6, 8]);
    const boxes = Math.floor(total / perBox);
    const remain = total % perBox;
    return this.base('p4-word-logic',
      `${dozen} 打（1打=12個）蘋果，每盒裝 ${perBox} 個，最多可裝滿幾盒？`,
      { type: 'decimal', value: boxes },
      String(boxes),
      '提示：總數 ÷ 每盒，商是盒數',
      `<h4>📖 解法</h4><p>總數 = ${total}，${total} ÷ ${perBox} = ${boxes} 餘 ${remain}，可裝 <strong>${boxes}</strong> 盒</p>`
    );
  },

  ribbonRect() {
    const l = MathUtils.randomInt(8, 15);
    const w = MathUtils.randomInt(5, 10);
    const perim = 2 * (l + w);
    return this.base('p4-word-logic',
      QuestionVisuals.withVisual(
        `一條繩子圍成一個長 ${l} cm、闊 ${w} cm 的長方形，繩子長多少 cm？`,
        QuestionVisuals.rectangle(l, w, 'cm')
      ),
      { type: 'decimal', value: perim }, String(perim),
      '提示：繩子長 = 周界',
      `<h4>📖 解法</h4><p>周界 = 2 × (${l} + ${w}) = <strong>${perim}</strong> cm</p>`
    );
  },

  timesMore() {
    const small = MathUtils.randomInt(5, 15);
    const times = MathUtils.randomInt(2, 5);
    const big = small * times;
    return this.base('p4-word-logic',
      `小華有 ${small} 張貼紙，小美有 ${big} 張。小美的貼紙是小華的幾倍？`,
      { type: 'decimal', value: times }, String(times),
      '提示：大的 ÷ 小的',
      `<h4>📖 解法</h4><p>${big} ÷ ${small} = <strong>${times}</strong> 倍</p>`
    );
  },

  perPersonDiscount() {
    const people = MathUtils.randomInt(3, 6);
    const each = MathUtils.randomInt(20, 50);
    const total = people * each;
    return this.base('p4-word-logic',
      `${people} 人各付 ${each} 元，一共付了多少元？`,
      { type: 'decimal', value: total }, String(total),
      '提示：每人付的 × 人數',
      `<h4>📖 解法</h4><p>${each} × ${people} = <strong>${total}</strong> 元</p>`
    );
  },

  fracWater() {
    const total = MathUtils.randomChoice([12, 16, 20, 24]);
    const den = MathUtils.randomChoice([2, 4]);
    const drank = total / den;
    const ans = total - drank;
    return this.base('p4-word-frac',
      `一桶水有 ${total} 升，用去 ${MathUtils.formatFractionHTML(1, den)}，還剩多少升？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先算用去多少',
      `<h4>📖 解法</h4><p>用去 ${drank} 升，剩下 ${total} - ${drank} = <strong>${ans}</strong> 升</p>`
    );
  },

  fracOrder() {
    const den = MathUtils.randomChoice([4, 5, 6, 8]);
    const ate1 = MathUtils.randomInt(1, den - 2);
    const ate2 = MathUtils.randomInt(1, den - ate1 - 1);
    const total = ate1 + ate2;
    return this.base('p4-word-frac',
      `一個蛋糕平均分 ${den} 份，哥哥吃了 ${MathUtils.formatFractionHTML(ate1, den)}，弟弟吃了 ${MathUtils.formatFractionHTML(ate2, den)}，兩人共吃了幾分之幾？`,
      { type: 'fraction', num: total, den },
      `${total}/${den}`,
      '提示：同分母分數相加',
      `<h4>📖 解法</h4><p>${ate1} + ${ate2} = ${total}，共吃了 <strong>${total}/${den}</strong></p>`
    );
  },

  fracWeight() {
    const den = MathUtils.randomChoice([4, 5, 8, 10]);
    const num = MathUtils.randomInt(1, den - 1);
    const total = den * MathUtils.randomInt(2, 5);
    const ans = total * num / den;
    return this.base('p4-word-frac',
      `一袋米重 ${total} kg，用去 ${MathUtils.formatFractionHTML(num, den)}，用去多少 kg？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：總重量 × 分數',
      `<h4>📖 解法</h4><p>${total} × ${num}/${den} = <strong>${ans}</strong> kg</p>`
    );
  },

  fracRunEach() {
    const students = 5;
    const each = MathUtils.randomInt(4, 12);
    const ans = each * students;
    return this.base('p4-word-frac',
      `${students} 位同學平分一袋糖，每人得到 ${MathUtils.formatFractionHTML(1, students)} 袋，每人 ${each} 粒。一袋糖共有多少粒？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：每人粒數 × 人數',
      `<h4>📖 解法</h4><p>${each} × ${students} = <strong>${ans}</strong> 粒</p>`
    );
  },

  generateMCQ(topicId, tier = 'medium') {
    QuestionPool.init();
    const q = QuestionPool.draw(topicId, tier);
    return this.toMCQ(q, topicId);
  },

  toMCQ(q, topicId) {
    const tid = topicId || q.topicId;
    if (q.type === 'mcq' && q.options) {
      return { ...q, topicName: getTopicName(tid), correctIndex: q.correctIndex, type: 'mcq' };
    }
    if (!q.answer || q.answer.type === 'text') {
      return { ...q, type: q.type || 'input' };
    }
    const correct = q.answerDisplay;
    const wrongAnswers = new Set();
    let attempts = 0;
    while (wrongAnswers.size < 3 && attempts < 30) {
      attempts++;
      const offset = MathUtils.randomChoice([-5, -3, -2, -1, 1, 2, 3, 5]);
      let wrong;
      if (q.answer.type === 'fraction') {
        const newNum = q.answer.num + offset;
        if (newNum > 0) wrong = MathUtils.fractionToString(newNum, q.answer.den);
      } else if (q.answer.type === 'decimal' && typeof q.answer.value === 'number') {
        wrong = String(MathUtils.roundTo(q.answer.value + offset, 2));
      }
      if (wrong && wrong !== correct) wrongAnswers.add(wrong);
    }
    while (wrongAnswers.size < 3) {
      wrongAnswers.add(String(MathUtils.randomInt(1, 50)));
    }
    const options = MathUtils.shuffle([correct, ...wrongAnswers]);
    return { ...q, topicName: getTopicName(tid), options, correctIndex: options.indexOf(correct), type: 'mcq' };
  }
};

function getTopicName(id) {
  const t = TOPICS.find(x => x.id === id);
  return t ? t.name : id;
}
