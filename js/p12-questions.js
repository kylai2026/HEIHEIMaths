/* 心光數學小一、小二課題練習題 */
const P12Questions = {
  TIER_POOLS: {
    'p1-position': { easy: ['posLeftRight', 'posUpDown'], medium: ['posLeftRight', 'posUpDown', 'posBetween'], hard: ['posLeftRight', 'posUpDown', 'posBetween'] },
    'p1-numbers20': { easy: ['countObjects'], medium: ['countObjects', 'compareWithin20', 'orderWithin20'], hard: ['compareWithin20', 'orderWithin20'] },
    'p1-decompose': { easy: ['bondsTo10'], medium: ['bondsTo10', 'bondsMake10', 'bondsTeens'], hard: ['bondsMake10', 'bondsTeens'] },
    'p1-length': { easy: ['compareLength'], medium: ['compareLength', 'longerShorter'], hard: ['longerShorter'] },
    'p1-add': { easy: ['addWithin10'], medium: ['addWithin10', 'addWithin18', 'addWordSimple'], hard: ['addWithin18', 'addWordSimple'] },
    'p1-sub': { easy: ['subWithin10'], medium: ['subWithin10', 'subWithin18', 'subWordSimple'], hard: ['subWithin18', 'subWordSimple'] },
    'p1-numbers100': { easy: ['tensOnes'], medium: ['tensOnes', 'compareWithin100', 'countByTen'], hard: ['compareWithin100', 'countByTen'] },
    'p1-time': { easy: ['clockHour'], medium: ['clockHour', 'clockHalf', 'weekDays'], hard: ['clockHalf', 'weekDays'] },
    'p1-shapes': { easy: ['shapeName'], medium: ['shapeName', 'shapeSides'], hard: ['shapeSides'] },
    'p1-addsub-2d': { easy: ['add2dNoCarry'], medium: ['add2dNoCarry', 'add2dCarry', 'sub2dNoBorrow'], hard: ['add2dCarry', 'sub2dNoBorrow'] },
    'p1-money': { easy: ['coinValue'], medium: ['coinValue', 'coinTotal', 'cmMeasure'], hard: ['coinTotal', 'cmMeasure'] },
    'p2-hundreds': { easy: ['hundredsRead'], medium: ['hundredsRead', 'hundredsCompare', 'hundredsOrder'], hard: ['hundredsCompare', 'hundredsOrder'] },
    'p2-add': { easy: ['add3dNoCarry'], medium: ['add3dNoCarry', 'add3dCarry', 'add3numbers'], hard: ['add3dCarry', 'add3numbers'] },
    'p2-sub': { easy: ['sub2d'], medium: ['sub2d', 'sub3d', 'subWord'], hard: ['sub3d', 'subWord'] },
    'p2-angles': { easy: ['rightAngle'], medium: ['rightAngle', 'acuteObtuse', 'compareAngles'], hard: ['acuteObtuse', 'compareAngles'] },
    'p2-direction': { easy: ['fourDirections'], medium: ['fourDirections', 'compassDir'], hard: ['compassDir'] },
    'p2-multiply': { easy: ['mulTable'], medium: ['mulTable', 'mulWord', 'mulZeroOne'], hard: ['mulWord', 'mulZeroOne'] },
    'p2-time': { easy: ['timeMin'], medium: ['timeMin', 'timeInterval', 'monthDays'], hard: ['timeInterval', 'monthDays'] },
    'p2-thousands': { easy: ['thousandsRead'], medium: ['thousandsRead', 'thousandsCompare'], hard: ['thousandsCompare'] },
    'p2-money': { easy: ['noteValue'], medium: ['noteValue', 'moneyChange'], hard: ['moneyChange'] },
    'p2-mixed': { easy: ['addSubMixed'], medium: ['addSubMixed', 'addSubMixedWord'], hard: ['addSubMixedWord'] },
    'p2-divide': { easy: ['divideBasic'], medium: ['divideBasic', 'divideRemain', 'pictographRead'], hard: ['divideRemain', 'pictographRead'] }
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
    const method = MathUtils.randomChoice(this.TIER_POOLS[topicId]?.medium || ['countObjects']);
    const q = this[method]();
    q.tier = tier;
    q.topicId = topicId;
    return q;
  },

  base(...args) { return P34Questions.base(...args); },

  pick(fns) { return MathUtils.randomChoice(fns)(); },

  _mcq(topicId, question, options, correct, hint, solution, tier = 'medium') {
    const correctIndex = options.indexOf(correct);
    return this.base(topicId, question,
      { type: 'decimal', value: correctIndex }, correct,
      hint, solution, tier,
      { type: 'mcq', options, correctIndex });
  },

  _numToCn(n) {
    const c = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (n === 0) return '零';
    if (n < 10) return c[n];
    if (n < 20) return n === 10 ? '十' : `十${c[n % 10]}`;
    if (n < 100) {
      const t = Math.floor(n / 10);
      const o = n % 10;
      return `${c[t]}十${o ? c[o] : ''}`;
    }
    if (n < 1000) {
      const b = Math.floor(n / 100);
      const rest = n % 100;
      let s = `${c[b]}百`;
      if (rest === 0) return s;
      if (rest < 10) return s + '零' + c[rest];
      if (rest < 20) return s + '一十' + (rest % 10 ? c[rest % 10] : '');
      return s + this._numToCn(rest);
    }
    const q = Math.floor(n / 1000);
    const rest = n % 1000;
    let s = `${c[q]}千`;
    if (rest === 0) return s;
    if (rest < 100) return s + '零' + this._numToCn(rest);
    return s + this._numToCn(rest);
  },

  _p1Emoji(name) {
    const map = {
      '蘋果': '🍎', '橙': '🍊', '梨': '🍐', '車': '🚗', '球': '⚽',
      '書': '📚', '花': '🌸', '筆': '✏️', '杯': '🥤', '熊': '🧸',
      '星星': '⭐', '圓點': '🔵', '小鴨': '🐤', '積木': '🧱',
      '花朵': '🌸', '糖果': '🍬', '氣球': '🎈',
      '太陽': '☀️', '月亮': '🌙', '鳥': '🐦', '魚': '🐟', '雲': '☁️',
      '樹': '🌳', '星': '⭐', '雨': '🌧️',
      '鉛筆': '✏️', '尺子': '📏', '繩子': '🪢', '絲帶': '🎀', '筷子': '🥢', '蠟筆': '🖍️',
      '紅繩': '🟥', '藍繩': '🟦', '書本': '📖', '梳子': '🪮', '膠尺': '📏', '畫筆': '🖌️'
    };
    return map[name] || '🔹';
  },

  _clockAngles(hour, minute = 0) {
    const h = hour % 12;
    return {
      hourDeg: h * 30 + minute * 0.5,
      minuteDeg: minute * 6
    };
  },

  _renderClock(hour, minute = 0) {
    const { hourDeg, minuteDeg } = this._clockAngles(hour, minute);
    const nums = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const marks = nums.map((n, i) =>
      `<span class="clock-n" style="--i:${i}">${n}</span>`
    ).join('');
    return `
      <div class="clock-scene" aria-hidden="true">
        <div class="clock-face">
          <div class="clock-nums">${marks}</div>
          <div class="clock-hand clock-minute" style="--deg:${minuteDeg}"></div>
          <div class="clock-hand clock-hour" style="--deg:${hourDeg}"></div>
          <div class="clock-center"></div>
        </div>
      </div>`;
  },

  _rulerObjectKind(label) {
    const map = {
      '尺子': 'ruler', '膠尺': 'ruler',
      '絲帶': 'ribbon',
      '繩子': 'rope', '紅繩': 'rope-red', '藍繩': 'rope-blue',
      '鉛筆': 'pencil', '蠟筆': 'crayon', '畫筆': 'brush', '筷子': 'chopstick'
    };
    return map[label] || 'default';
  },

  _renderObjectOnRuler(label, lenCm, maxCm, opts = {}) {
    const emoji = this._p1Emoji(label);
    const kind = this._rulerObjectKind(label);
    const cells = Array.from({ length: maxCm }, (_, i) => {
      const filled = i < lenCm;
      return `<div class="ruler-scale-cell${filled ? ' ruler-scale-cell--mark' : ''}"></div>`;
    }).join('');
    const nums = Array.from({ length: maxCm + 1 }, (_, i) =>
      `<span class="ruler-scale-num" style="--i:${i}">${i}</span>`
    ).join('');
    const cmLabel = opts.hideCm ? '' : `<div class="ruler-row-cm">${lenCm} cm</div>`;
    return `
      <div class="ruler-on-scale-row">
        <div class="ruler-on-scale-label">${emoji}<span>${label}</span></div>
        <div class="ruler-scale-panel" style="--max-cells:${maxCm}">
          <div class="ruler-scale-bed">
            <div class="ruler-scale-cells">${cells}</div>
            <div class="ruler-object-on-scale ruler-object-on-scale--${kind}" style="--len:${lenCm};--max:${maxCm}">
              <span class="ruler-object-icon" aria-hidden="true">${emoji}</span>
              <div class="ruler-object-body"></div>
            </div>
          </div>
          <div class="ruler-scale-nums">${nums}</div>
        </div>
        ${cmLabel}
      </div>`;
  },

  _renderRulerRow(label, lenCm, maxCm, opts = {}) {
    return this._renderObjectOnRuler(label, lenCm, maxCm, opts);
  },

  _renderLengthCompare(itemA, lenA, itemB, lenB, opts = {}) {
    const maxCm = Math.min(22, Math.max(lenA, lenB, 8) + 2);
    return `
      <div class="length-compare-scene" aria-hidden="true">
        ${this._renderObjectOnRuler(itemA, lenA, maxCm, opts)}
        ${this._renderObjectOnRuler(itemB, lenB, maxCm, opts)}
      </div>`;
  },

  _renderRulerMeasure(obj, lenCm) {
    const maxCm = Math.min(22, Math.max(lenCm + 2, 12));
    const row = this._renderObjectOnRuler(obj, lenCm, maxCm, { hideCm: true });
    return `
      <div class="ruler-measure-scene" aria-hidden="true">
        ${row}
        <p class="ruler-measure-hint">看間尺上物件的長度，數一數有幾格</p>
      </div>`;
  },

  _renderCountGrid(n, obj) {
    const emoji = this._p1Emoji(obj);
    const cells = Array.from({ length: n }, () =>
      `<span class="count-object-item">${emoji}</span>`
    ).join('');
    return `<div class="count-object-grid" aria-hidden="true">${cells}</div>`;
  },

  _renderLeftRightScene(left, right) {
    const e = name => this._p1Emoji(name);
    return `
      <div class="pos-lr-scene" aria-hidden="true">
        <div class="pos-lr-side pos-lr-left">
          <span class="pos-lr-label">左</span>
          <span class="pos-lr-item">${e(left)}<small>${left}</small></span>
        </div>
        <div class="pos-lr-person">🧒<small>小明</small></div>
        <div class="pos-lr-side pos-lr-right">
          <span class="pos-lr-label">右</span>
          <span class="pos-lr-item">${e(right)}<small>${right}</small></span>
        </div>
      </div>`;
  },

  _renderUpDownScene(top, bottom) {
    const e = name => this._p1Emoji(name);
    return `
      <div class="pos-ud-scene" aria-hidden="true">
        <div class="pos-ud-item">${e(top)}<small>${top}</small></div>
        <div class="pos-ud-divider"></div>
        <div class="pos-ud-item">${e(bottom)}<small>${bottom}</small></div>
      </div>`;
  },

  // ── 小一：位置 ──
  posLeftRight() {
    const items = ['蘋果', '橙', '梨', '車', '球', '書', '花', '筆', '杯', '熊'];
    const left = MathUtils.randomChoice(items);
    let right = MathUtils.randomChoice(items);
    while (right === left) right = MathUtils.randomChoice(items);
    const askLeft = MathUtils.randomChoice([true, false]);
    const correct = askLeft ? left : right;
    const qText = askLeft
      ? `<p>小明面向前方，看圖回答：哪一樣在<strong>左邊</strong>？</p>${this._renderLeftRightScene(left, right)}`
      : `<p>小明面向前方，看圖回答：哪一樣在<strong>右邊</strong>？</p>${this._renderLeftRightScene(left, right)}`;
    const wrong = items.filter(x => x !== correct);
    const options = MathUtils.shuffle([correct, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-position', qText, options, correct,
      '提示：伸出雙手，想想哪邊是左、哪邊是右',
      `<h4>📖 解法</h4><p>答案是 <strong>${correct}</strong></p>`);
  },

  posUpDown() {
    const items = ['太陽', '月亮', '鳥', '魚', '雲', '樹', '星', '雨'];
    const top = MathUtils.randomChoice(items);
    let bottom = MathUtils.randomChoice(items);
    while (bottom === top) bottom = MathUtils.randomChoice(items);
    const askUp = MathUtils.randomChoice([true, false]);
    const correct = askUp ? top : bottom;
    const qText = askUp
      ? `<p>看圖：哪一樣在<strong>上面</strong>？</p>${this._renderUpDownScene(top, bottom)}`
      : `<p>看圖：哪一樣在<strong>下面</strong>？</p>${this._renderUpDownScene(top, bottom)}`;
    const wrong = items.filter(x => x !== correct);
    const options = MathUtils.shuffle([correct, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-position', qText, options, correct,
      '提示：上面係較高嘅位置，下面係較低嘅位置',
      `<h4>📖 解法</h4><p>答案是 <strong>${correct}</strong></p>`);
  },

  posBetween() {
    const items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const trio = MathUtils.shuffle(items).slice(0, 3);
    const [left, mid, right] = trio;
    const askTypes = [
      { q: '最左邊的是哪一個？', answer: left, hint: '最左邊係排第一個' },
      { q: '最右邊的是哪一個？', answer: right, hint: '最右邊係排最後一個' },
      { q: '中間的是哪一個？', answer: mid, hint: '中間唔係最左，亦唔係最右' },
      { q: `哪一個在 ${left} 的右邊？`, answer: mid, hint: '由左邊數過去，緊鄰的下一個' },
      { q: `哪一個在 ${right} 的左邊？`, answer: mid, hint: '由右邊數過去，緊鄰的前一個' },
      { q: `哪一個在 ${mid} 的左邊？`, answer: left, hint: '中間那一個的左邊鄰居' },
      { q: `哪一個在 ${mid} 的右邊？`, answer: right, hint: '中間那一個的右邊鄰居' }
    ];
    const chosen = MathUtils.randomChoice(askTypes);
    const qText = `
      <p><strong>${left}</strong>、<strong>${mid}</strong>、<strong>${right}</strong> 三個字母由左至右排成一行：</p>
      <div class="pos-between-row" aria-hidden="true">
        <span class="pos-between-item">${left}</span>
        <span class="pos-between-item">${mid}</span>
        <span class="pos-between-item">${right}</span>
      </div>
      <p>${chosen.q}</p>`;
    const wrong = items.filter(x => x !== chosen.answer);
    const options = MathUtils.shuffle([chosen.answer, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-position', qText, options, chosen.answer,
      `提示：${chosen.hint}`,
      `<h4>📖 解法</h4><p>由左至右係 <strong>${left}</strong> → <strong>${mid}</strong> → <strong>${right}</strong>，答案是 <strong>${chosen.answer}</strong></p>`);
  },

  // ── 小一：20以內的數 ──
  countObjects() {
    const n = MathUtils.randomInt(1, 20);
    const obj = MathUtils.randomChoice(['蘋果', '星星', '圓點', '小鴨', '積木', '花朵', '糖果', '氣球']);
    const qText = `<p>數一數，圖中有幾${MathUtils.itemClassifier(obj)}${obj}？</p>${this._renderCountGrid(n, obj)}`;
    return this.base('p1-numbers20', qText,
      { type: 'decimal', value: n }, String(n),
      '提示：用手指逐個數',
      `<h4>📖 解法</h4><p>共有 <strong>${n}</strong> ${MathUtils.itemClassifier(obj)}</p>`);
  },

  compareWithin20() {
    const a = MathUtils.randomInt(1, 20);
    let b = MathUtils.randomInt(1, 20);
    while (b === a) b = MathUtils.randomInt(1, 20);
    const bigger = Math.max(a, b);
    return this.base('p1-numbers20',
      `${a} 和 ${b}，哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：數字愈大，數量愈多',
      `<h4>📖 解法</h4><p>比較後較大的是 <strong>${bigger}</strong></p>`);
  },

  orderWithin20() {
    const nums = MathUtils.shuffle(Array.from({ length: 4 }, () => MathUtils.randomInt(1, 20)));
    const sorted = [...nums].sort((x, y) => x - y);
    const ask = MathUtils.randomChoice(['min', 'max']);
    const ans = ask === 'min' ? sorted[0] : sorted[sorted.length - 1];
    const qText = ask === 'min'
      ? `將以下數字由小至大排列，最小的是哪一個？<br>${nums.join('、')}`
      : `將以下數字由大至小排列，最大的是哪一個？<br>${nums.join('、')}`;
    return this.base('p1-numbers20', qText,
      { type: 'decimal', value: ans }, String(ans),
      '提示：逐個比較大小',
      `<h4>📖 解法</h4><p>由小至大：${sorted.join(' < ')}，答案是 <strong>${ans}</strong></p>`);
  },

  // ── 小一：數的組合 ──
  bondsTo10() {
    const a = MathUtils.randomInt(1, 9);
    const b = 10 - a;
    const templates = [
      () => `${a} + □ = 10，□ 是多少？`,
      () => `□ + ${a} = 10，□ 是多少？`,
      () => `10 = ${a} + □，□ 是多少？`,
      () => `10 可以分成 ${a} 和 □，□ 是多少？`
    ];
    const qText = MathUtils.randomChoice(templates)();
    const QV = QuestionVisuals;
    return this.base('p1-decompose',
      QV.withVisual(qText, QV.tenBond(a)),
      { type: 'decimal', value: b }, String(b),
      '提示：想想 10 可以分成兩部分',
      `<h4>📖 解法</h4><p>${a} + ${b} = 10，所以 □ = <strong>${b}</strong></p>`);
  },

  bondsMake10() {
    const a = MathUtils.randomInt(1, 9);
    const b = 10 - a;
    const wrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== b);
    const options = MathUtils.shuffle([String(b), ...MathUtils.shuffle(wrongs).slice(0, 3).map(String)]);
    const correct = String(b);
    return this._mcq('p1-decompose',
      QuestionVisuals.withVisual(`哪個數和 ${a} 合起來是 10？`, QuestionVisuals.tenBond(a)),
      options, correct,
      '提示：兩個數加起來要等於 10',
      `<h4>📖 解法</h4><p>${a} + ${b} = 10，答案是 <strong>${b}</strong></p>`);
  },

  bondsTeens() {
    const teen = MathUtils.randomInt(11, 19);
    const ones = teen % 10;
    const variant = MathUtils.randomChoice(['ones', 'teen', 'split', 'add']);
    if (variant === 'ones') {
      return this.base('p1-decompose',
        QuestionVisuals.withVisual(
          `10 + □ = ${teen}，□ 是多少？`,
          QuestionVisuals.teenBond(teen)
        ),
        { type: 'decimal', value: ones }, String(ones),
        '提示：十幾的數 = 10 + 個位',
        `<h4>📖 解法</h4><p>10 + ${ones} = ${teen}，□ = <strong>${ones}</strong></p>`);
    }
    if (variant === 'split') {
      return this.base('p1-decompose',
        QuestionVisuals.withVisual(
          `把 ${teen} 分成 10 和 □，□ 是多少？`,
          QuestionVisuals.teenBond(teen)
        ),
        { type: 'decimal', value: ones }, String(ones),
        '提示：十幾的數可以拆成 10 和個位',
        `<h4>📖 解法</h4><p>${teen} = 10 + <strong>${ones}</strong></p>`);
    }
    if (variant === 'add') {
      const base = MathUtils.randomInt(11, 18);
      const ans = base + 1;
      return this.base('p1-decompose',
        `${base} 的後一個數是？`,
        { type: 'decimal', value: ans }, String(ans),
        '提示：後一個數大 1',
        `<h4>📖 解法</h4><p>${base} 之後是 <strong>${ans}</strong></p>`);
    }
    return this.base('p1-decompose',
      QuestionVisuals.withVisual(
        `${teen} = 10 + □，□ 是多少？`,
        QuestionVisuals.teenBond(teen)
      ),
      { type: 'decimal', value: ones }, String(ones),
      '提示：把個位數填進去',
      `<h4>📖 解法</h4><p>${teen} = 10 + <strong>${ones}</strong></p>`);
  },

  // ── 小一：長度 ──
  compareLength() {
    const a = MathUtils.randomInt(3, 18);
    let b = MathUtils.randomInt(3, 18);
    while (b === a) b = MathUtils.randomInt(3, 18);
    const longer = Math.max(a, b);
    const visual = this._renderLengthCompare('紅繩', a, '藍繩', b, { hideCm: true });
    return this.base('p1-length',
      `<p>看圖：紅繩和藍繩哪一條較長？較長的是多少 cm？（只填較長的長度）</p>${visual}`,
      { type: 'decimal', value: longer }, String(longer),
      '提示：在間尺上數一數較長那條有幾格',
      `<h4>📖 解法</h4><p>較長的是 <strong>${longer}</strong> cm</p>`);
  },

  longerShorter() {
    const items = ['鉛筆', '尺子', '繩子', '絲帶', '筷子', '蠟筆'];
    const a = MathUtils.randomChoice(items);
    let b = MathUtils.randomChoice(items);
    while (b === a) b = MathUtils.randomChoice(items);
    const lenA = MathUtils.randomInt(5, 20);
    let lenB = MathUtils.randomInt(5, 20);
    while (lenA === lenB) lenB = MathUtils.randomInt(5, 20);
    const longer = lenA > lenB ? a : b;
    const visual = this._renderLengthCompare(a, lenA, b, lenB, { hideCm: true });
    const qText = `<p>看圖比較長度：哪一樣較長？</p>${visual}`;
    const wrong = items.filter(x => x !== longer);
    const options = MathUtils.shuffle([longer, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-length', qText, options, longer,
      '提示：比較尺上兩條的長度',
      `<h4>📖 解法</h4><p>${lenA > lenB ? a : b} 較長（<strong>${longer}</strong>）</p>`);
  },

  // ── 小一：加法 ──
  addWithin10() {
    const a = MathUtils.randomInt(1, 9);
    const b = MathUtils.randomInt(1, 10 - a);
    const ans = a + b;
    return this.base('p1-add',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：可以用手指幫手數',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  addWithin18() {
    const ans = MathUtils.randomInt(11, 18);
    const a = MathUtils.randomInt(2, ans - 1);
    const b = ans - a;
    return this.base('p1-add',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先湊 10 再計',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  addWordSimple() {
    const a = MathUtils.randomInt(2, 12);
    const b = MathUtils.randomInt(1, 18 - a);
    const ans = a + b;
    const items = ['糖果', '貼紙', '積木', '鉛筆', '蘋果', '珠子'];
    const item = MathUtils.randomChoice(items);
    const names = ['小明', '小華', '小美', '小玲', '小杰'];
    const name = MathUtils.randomChoice(names);
    const mw = MathUtils.itemClassifier(item);
    return this.base('p1-add',
      `${name}有 ${a} ${mw}${item}，媽媽再給他 ${b} ${mw}。${name}現在共有多少${mw}？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：原有 + 得到 = 共有',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong> ${mw}</p>`);
  },

  // ── 小一：減法 ──
  subWithin10() {
    const a = MathUtils.randomInt(2, 10);
    const b = MathUtils.randomInt(1, a - 1);
    const ans = a - b;
    return this.base('p1-sub',
      `計算：${a} - ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：從總數中拿走一部分',
      `<h4>📖 解法</h4><p>${a} - ${b} = <strong>${ans}</strong></p>`);
  },

  subWithin18() {
    const a = MathUtils.randomInt(11, 18);
    const b = MathUtils.randomInt(2, a - 1);
    const ans = a - b;
    return this.base('p1-sub',
      `計算：${a} - ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：可以分拆成兩步減',
      `<h4>📖 解法</h4><p>${a} - ${b} = <strong>${ans}</strong></p>`);
  },

  subWordSimple() {
    const total = MathUtils.randomInt(8, 18);
    const used = MathUtils.randomInt(2, total - 1);
    const ans = total - used;
    const items = ['餅乾', '氣球', '圖畫', '玩具', '書本'];
    const item = MathUtils.randomChoice(items);
    const mw = MathUtils.itemClassifier(item);
    return this.base('p1-sub',
      `桌上有 ${total} ${mw}${item}，拿走了 ${used} ${mw}。還剩多少${mw}？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：原有 - 拿走 = 剩下',
      `<h4>📖 解法</h4><p>${total} - ${used} = <strong>${ans}</strong> ${mw}</p>`);
  },

  // ── 小一：100以內的數 ──
  tensOnes() {
    const n = MathUtils.randomInt(11, 99);
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const ask = MathUtils.randomChoice(['tens', 'ones', 'value']);
    if (ask === 'tens') {
      return this.base('p1-numbers100',
        `在 ${n} 中，十位上的數字是？`,
        { type: 'decimal', value: tens }, String(tens),
        '提示：十位在個位的左邊',
        `<h4>📖 解法</h4><p>十位數字是 <strong>${tens}</strong></p>`);
    }
    if (ask === 'ones') {
      return this.base('p1-numbers100',
        `在 ${n} 中，個位上的數字是？`,
        { type: 'decimal', value: ones }, String(ones),
        '提示：個位是最右邊那位',
        `<h4>📖 解法</h4><p>個位數字是 <strong>${ones}</strong></p>`);
    }
    return this.base('p1-numbers100',
      `${tens} 個十和 ${ones} 個一合起來是多少？`,
      { type: 'decimal', value: n }, String(n),
      '提示：十位 × 10 + 個位',
      `<h4>📖 解法</h4><p>${tens} × 10 + ${ones} = <strong>${n}</strong></p>`);
  },

  compareWithin100() {
    const a = MathUtils.randomInt(10, 99);
    let b = MathUtils.randomInt(10, 99);
    while (b === a) b = MathUtils.randomInt(10, 99);
    const bigger = Math.max(a, b);
    return this.base('p1-numbers100',
      `${a} 和 ${b}，哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：先比十位，再比個位',
      `<h4>📖 解法</h4><p>較大的是 <strong>${bigger}</strong></p>`);
  },

  countByTen() {
    const start = MathUtils.randomChoice([10, 20, 30, 40, 50, 60]);
    const seq = [start, start + 10, start + 20];
    const ans = start + 30;
    return this.base('p1-numbers100',
      `按十數數：${seq.join('、')}、？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：每次加 10',
      `<h4>📖 解法</h4><p>${seq[2]} + 10 = <strong>${ans}</strong></p>`);
  },

  // ── 小一：時間 ──
  clockHour() {
    const h = MathUtils.randomInt(1, 12);
    const clock = this._renderClock(h, 0);
    const variants = [
      `<p>看圖：時鐘顯示幾點？</p>${clock}`,
      `<p>看圖：長針指着 12，短針指着幾？</p>${clock}`,
      `<p>看圖：短針指着數字幾？</p>${clock}`,
      `<p>看圖：現在是幾點正？</p>${clock}`
    ];
    const qText = MathUtils.randomChoice(variants);
    return this.base('p1-time', qText,
      { type: 'decimal', value: h }, String(h),
      '提示：短針指着幾就是幾點',
      `<h4>📖 解法</h4><p>答案是 <strong>${h}</strong> 點</p>`);
  },

  clockHalf() {
    const h = MathUtils.randomInt(1, 11);
    const display = `${h} 點半`;
    const clock = this._renderClock(h, 30);
    const variants = [
      `<p>看圖：長針指着 6，短針在兩個數字之間，是幾點幾分？（只填「點」前的數字）</p>${clock}`,
      `<p>看圖：時鐘顯示幾點幾分？（只填小時數）</p>${clock}`,
      `<p>看圖：現在是幾點半？（只填小時數）</p>${clock}`
    ];
    const qText = MathUtils.randomChoice(variants);
    return this.base('p1-time', qText,
      { type: 'decimal', value: h }, String(h),
      '提示：長針指着 6 表示半點',
      `<h4>📖 解法</h4><p>這是 <strong>${display}</strong>，填 <strong>${h}</strong></p>`);
  },

  weekDays() {
    const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const idx = MathUtils.randomInt(0, 6);
    const next = days[(idx + 1) % 7];
    const prev = days[(idx + 6) % 7];
    const variant = MathUtils.randomChoice(['next', 'prev', 'name']);
    if (variant === 'next') {
      const ans = idx === 6 ? 1 : idx + 2;
      return this.base('p1-time',
        `${days[idx]}的後一天是星期幾？（填數字：星期一=1，…，星期日=7）`,
        { type: 'decimal', value: ans }, String(ans),
        '提示：按順序數日子',
        `<h4>📖 解法</h4><p>${days[idx]}之後是 <strong>${next}</strong>（${ans}）</p>`);
    }
    if (variant === 'prev') {
      const ans = idx === 0 ? 7 : idx;
      return this.base('p1-time',
        `${days[idx]}的前一天是星期幾？（填數字：星期一=1，…，星期日=7）`,
        { type: 'decimal', value: ans }, String(ans),
        '提示：往回數一天',
        `<h4>📖 解法</h4><p>${days[idx]}之前是 <strong>${prev}</strong>（${ans}）</p>`);
    }
    const dayNum = idx + 1;
    return this.base('p1-time',
      `一星期有幾天？今天是星期${'一二三四五六日'[idx]}（第 ${dayNum} 天），一星期共有幾天？`,
      { type: 'decimal', value: 7 }, '7',
      '提示：由星期一數到星期日',
      `<h4>📖 解法</h4><p>一星期有 <strong>7</strong> 天</p>`);
  },

  // ── 小一：圖形 ──
  shapeName() {
    const QV = QuestionVisuals;
    const shapes = [
      { name: '圓形', clues: ['沒有角，圓圓的', '所有點到中心距離相等', '像車輪一樣圓圓', '滾動時很順暢的圖形'] },
      { name: '三角形', clues: ['有三條邊和三個角', '有三個頂點', '邊數目是 3', '積木塔常見的圖形'] },
      { name: '正方形', clues: ['四條邊一樣長，四個直角', '四邊相等且四個直角', '像方格紙上的一格', '四條邊都一樣長'] },
      { name: '長方形', clues: ['四個角都是直角，對邊一樣長', '對邊相等，四個直角', '像門或書本的面', '不是正方形但四個直角'] }
    ];
    const gallery = QV.shapesRow(shapes.map(s => s.name));
    const mode = MathUtils.randomChoice(['clue', 'match', 'circle']);
    if (mode === 'circle') {
      const options = MathUtils.shuffle(shapes.map(s => s.name));
      return this._mcq('p1-shapes',
        QV.withVisual('哪個圖形沒有直邊？', gallery),
        options, '圓形',
        '提示：圓形是圓圓的，沒有直的邊',
        '<h4>📖 解法</h4><p>答案是 <strong>圓形</strong></p>');
    }
    const correct = MathUtils.randomChoice(shapes);
    if (mode === 'match') {
      const wrong = shapes.filter(s => s.name !== correct.name).map(s => s.name);
      const options = MathUtils.shuffle([correct.name, ...MathUtils.shuffle(wrong).slice(0, 3)]);
      return this._mcq('p1-shapes',
        QV.withVisual(`圖中有四種圖形，哪一個是${correct.name}？`, gallery),
        options, correct.name,
        '提示：觀察邊和角的特徵',
        `<h4>📖 解法</h4><p>答案是 <strong>${correct.name}</strong></p>`);
    }
    const clue = MathUtils.randomChoice(correct.clues);
    const wrong = shapes.filter(s => s.name !== correct.name).map(s => s.name);
    const options = MathUtils.shuffle([correct.name, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-shapes',
      QV.withVisual(`哪個圖形${clue}？`, gallery),
      options, correct.name,
      '提示：觀察邊和角的數量',
      `<h4>📖 解法</h4><p>答案是 <strong>${correct.name}</strong></p>`);
  },

  shapeSides() {
    const QV = QuestionVisuals;
    const shapes = [
      { name: '三角形', sides: 3, corners: 3 },
      { name: '正方形', sides: 4, corners: 4 },
      { name: '長方形', sides: 4, corners: 4 },
      { name: '五邊形', sides: 5, corners: 5 },
      { name: '六邊形', sides: 6, corners: 6 },
      { name: '八邊形', sides: 8, corners: 8 }
    ];
    const s = MathUtils.randomChoice(shapes);
    const visual = s.sides <= 4 ? QV.shapeIcon(s.name) : QV.polygon(s.sides, s.name);
    const ask = MathUtils.randomChoice(['sides', 'corners']);
    if (ask === 'corners') {
      const templates = [
        `一個${s.name}有幾個角？`,
        `${s.name}共有多少個頂點？`,
        `數一數${s.name}的角，有幾個？`
      ];
      return this.base('p1-shapes', QuestionVisuals.withVisual(MathUtils.randomChoice(templates), visual),
        { type: 'decimal', value: s.corners }, String(s.corners),
        '提示：角和頂點數目通常等於邊數',
        `<h4>📖 解法</h4><p>${s.name}有 <strong>${s.corners}</strong> 個角</p>`);
    }
    const templates = [
      `一個${s.name}有幾條邊？`,
      `${s.name}共有多少條邊？`,
      `沿${s.name}外圍數，有幾條邊？`,
      `一個${s.name}的邊數是？`,
      `用棒拼成一個${s.name}，最少要幾條棒？`
    ];
    return this.base('p1-shapes', QuestionVisuals.withVisual(MathUtils.randomChoice(templates), visual),
      { type: 'decimal', value: s.sides }, String(s.sides),
      '提示：沿圖形外圍數邊',
      `<h4>📖 解法</h4><p>${s.name}有 <strong>${s.sides}</strong> 條邊</p>`);
  },

  // ── 小一：兩位數加減 ──
  add2dNoCarry() {
    const t1 = MathUtils.randomInt(1, 4);
    const o1 = MathUtils.randomInt(1, 9);
    const t2 = MathUtils.randomInt(1, 4);
    const o2 = MathUtils.randomInt(1, 9 - o1);
    const a = t1 * 10 + o1;
    const b = t2 * 10 + o2;
    const ans = a + b;
    return this.base('p1-addsub-2d',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先算個位，再算十位',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  add2dCarry() {
    const a = MathUtils.randomInt(15, 49);
    const b = MathUtils.randomInt(6, 39);
    const oSum = (a % 10) + (b % 10);
    if (oSum < 10) return this.add2dCarry();
    const ans = a + b;
    if (ans > 99) return this.add2dCarry();
    return this.base('p1-addsub-2d',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：個位滿十要進位',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  sub2dNoBorrow() {
    const a = MathUtils.randomInt(30, 99);
    const bT = MathUtils.randomInt(1, Math.floor(a / 10) - 1);
    const bO = MathUtils.randomInt(0, a % 10);
    const b = bT * 10 + bO;
    if (b >= a || a - b < 10) return this.sub2dNoBorrow();
    const ans = a - b;
    return this.base('p1-addsub-2d',
      `計算：${a} - ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先減個位，再減十位',
      `<h4>📖 解法</h4><p>${a} - ${b} = <strong>${ans}</strong></p>`);
  },

  // ── 小一：金錢與量度 ──
  coinValue() {
    const coins = [
      { val: 1, name: '一元' },
      { val: 2, name: '兩元' },
      { val: 5, name: '五元' },
      { val: 10, name: '十元' }
    ];
    const c = MathUtils.randomChoice(coins);
    const wrong = coins.filter(x => x.val !== c.val).map(x => String(x.val));
    const options = MathUtils.shuffle([String(c.val), ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p1-money',
      `一枚${c.name}硬幣值多少元？`,
      options, String(c.val),
      '提示：看硬幣上的數字',
      `<h4>📖 解法</h4><p>${c.name}硬幣值 <strong>$${c.val}</strong></p>`);
  },

  coinTotal() {
    const c1 = MathUtils.randomChoice([1, 2, 5]);
    const c2 = MathUtils.randomChoice([1, 2, 5, 10]);
    const n1 = MathUtils.randomInt(1, 4);
    const n2 = MathUtils.randomInt(1, 3);
    const ans = c1 * n1 + c2 * n2;
    return this.base('p1-money',
      `有 ${n1} 個$${c1}硬幣和 ${n2} 個$${c2}硬幣，共有多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：每種硬幣先算總值，再加起來',
      `<h4>📖 解法</h4><p>${n1}×${c1} + ${n2}×${c2} = <strong>${ans}</strong> 元</p>`);
  },

  cmMeasure() {
    const len = MathUtils.randomInt(3, 20);
    const obj = MathUtils.randomChoice(['鉛筆', '書本', '梳子', '膠尺', '畫筆']);
    const visual = this._renderRulerMeasure(obj, len);
    return this.base('p1-money',
      `<p>看圖：用尺子量一量，${obj}長多少 cm？</p>${visual}`,
      { type: 'decimal', value: len }, String(len),
      '提示：數一數厘米格',
      `<h4>📖 解法</h4><p>長度是 <strong>${len}</strong> cm</p>`);
  },

  // ── 小二：三位數 ──
  hundredsRead() {
    const n = MathUtils.randomInt(100, 999);
    const cn = this._numToCn(n);
    const variant = MathUtils.randomChoice(['toNum', 'toCn']);
    if (variant === 'toNum') {
      return this.base('p2-hundreds',
        `「${cn}」寫成阿拉伯數字是？`,
        { type: 'decimal', value: n }, String(n),
        '提示：百位、十位、個位逐位寫',
        `<h4>📖 解法</h4><p>答案 = <strong>${n}</strong></p>`);
    }
    return this.base('p2-hundreds',
      `數字 ${n} 的百位是幾？`,
      { type: 'decimal', value: Math.floor(n / 100) }, String(Math.floor(n / 100)),
      '提示：最左邊是百位',
      `<h4>📖 解法</h4><p>${n} 的百位是 <strong>${Math.floor(n / 100)}</strong></p>`);
  },

  hundredsCompare() {
    const a = MathUtils.randomInt(100, 999);
    let b = MathUtils.randomInt(100, 999);
    while (b === a) b = MathUtils.randomInt(100, 999);
    const bigger = Math.max(a, b);
    return this.base('p2-hundreds',
      `${a} 和 ${b}，哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：由百位開始比較',
      `<h4>📖 解法</h4><p>較大的是 <strong>${bigger}</strong></p>`);
  },

  hundredsOrder() {
    const nums = MathUtils.shuffle(Array.from({ length: 4 }, () => MathUtils.randomInt(100, 999)));
    const sorted = [...nums].sort((x, y) => x - y);
    const ask = MathUtils.randomChoice(['min', 'max']);
    const ans = ask === 'min' ? sorted[0] : sorted[sorted.length - 1];
    const qText = ask === 'min'
      ? `以下哪個數最小？<br>${nums.join('、')}`
      : `以下哪個數最大？<br>${nums.join('、')}`;
    return this.base('p2-hundreds', qText,
      { type: 'decimal', value: ans }, String(ans),
      '提示：逐位比較',
      `<h4>📖 解法</h4><p>由小至大：${sorted.join(' < ')}，答案是 <strong>${ans}</strong></p>`);
  },

  // ── 小二：加法 ──
  add3dNoCarry() {
    const a = MathUtils.randomInt(100, 499);
    const b = MathUtils.randomInt(100, 499);
    const oSum = (a % 10) + (b % 10);
    const tSum = (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10);
    if (oSum >= 10 || tSum >= 10 || a + b > 999) return this.add3dNoCarry();
    const ans = a + b;
    return this.base('p2-add',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：個位、十位、百位逐位相加',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  add3dCarry() {
    const a = MathUtils.randomInt(150, 599);
    const b = MathUtils.randomInt(150, 499);
    const ans = a + b;
    if (ans > 999 || (a % 10) + (b % 10) < 10) return this.add3dCarry();
    return this.base('p2-add',
      `計算：${a} + ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：記得進位',
      `<h4>📖 解法</h4><p>${a} + ${b} = <strong>${ans}</strong></p>`);
  },

  add3numbers() {
    const a = MathUtils.randomInt(10, 80);
    const b = MathUtils.randomInt(10, 80);
    const c = MathUtils.randomInt(10, 80);
    const ans = a + b + c;
    return this.base('p2-add',
      `計算：${a} + ${b} + ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：由左至右逐個加',
      `<h4>📖 解法</h4><p>${a} + ${b} = ${a + b}，${a + b} + ${c} = <strong>${ans}</strong></p>`);
  },

  // ── 小二：減法 ──
  sub2d() {
    const a = MathUtils.randomInt(50, 99);
    const b = MathUtils.randomInt(10, a - 1);
    const ans = a - b;
    return this.base('p2-sub',
      `計算：${a} - ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：可能需要借位',
      `<h4>📖 解法</h4><p>${a} - ${b} = <strong>${ans}</strong></p>`);
  },

  sub3d() {
    const a = MathUtils.randomInt(300, 999);
    const b = MathUtils.randomInt(100, a - 10);
    const ans = a - b;
    return this.base('p2-sub',
      `計算：${a} - ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：從個位減起，不夠就借位',
      `<h4>📖 解法</h4><p>${a} - ${b} = <strong>${ans}</strong></p>`);
  },

  subWord() {
    const had = MathUtils.randomInt(100, 500);
    const sold = MathUtils.randomInt(20, had - 10);
    const ans = had - sold;
    const items = ['圖書', '文具', '玩具', '貼紙', '卡片'];
    const item = MathUtils.randomChoice(items);
    const mw = MathUtils.itemClassifier(item);
    return this.base('p2-sub',
      `書店原有 ${had} ${mw}${item}，賣出了 ${sold} ${mw}。還剩多少${mw}？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：原有 - 賣出 = 剩下',
      `<h4>📖 解法</h4><p>${had} - ${sold} = <strong>${ans}</strong> ${mw}</p>`);
  },

  // ── 小二：角 ──
  rightAngle() {
    const QV = QuestionVisuals;
    const items = [
      { q: '直角等於多少度？', a: '90', ans: 90, visual: () => QV.angleDiagram(90, { rightAngle: true, hideLabel: true }) },
      { q: '三角尺上的直角是幾度？', a: '90', ans: 90, visual: () => QV.angleDiagram(90, { rightAngle: true, hideLabel: true }) },
      { q: '半個直角是多少度？', a: '45', ans: 45, visual: () => QV.angleDiagram(45, { hideLabel: true }) },
      { q: '兩個直角合起來是多少度？', a: '180', ans: 180, visual: () => QV.angleDiagram(0, { mode: 'straight' }) },
      { q: '直角比 89° 大還是細？（填較大的度數）', a: '90', ans: 90, visual: () => QV.angleDiagram(90, { rightAngle: true, hideLabel: true }) },
      { q: '一個正方形的每個角是什麼角？', a: '直角', ans: null, visual: () => QV.square(6, 'cm', { hideSide: true }) },
      { q: '長方形的四個角各是什麼角？', a: '直角', ans: null, visual: () => QV.rectangle(8, 5, 'cm', { hideLength: true, hideWidth: true }) },
      { q: '門框的角通常是什麼角？', a: '直角', ans: null, visual: () => QV.angleDiagram(90, { rightAngle: true, hideLabel: true }) }
    ];
    const v = MathUtils.randomChoice(items);
    const qText = QV.withVisual(v.q, v.visual());
    if (v.ans !== null) {
      return this.base('p2-angles', qText,
        { type: 'decimal', value: v.ans }, v.a,
        '提示：直角係 90 度',
        `<h4>📖 解法</h4><p>答案是 <strong>${v.a}</strong></p>`);
    }
    const options = MathUtils.shuffle(['直角', '銳角', '鈍角', '平角']);
    return this._mcq('p2-angles', qText, options, v.a,
      '提示：正方形四個角都一樣',
      `<h4>📖 解法</h4><p>答案是 <strong>${v.a}</strong></p>`);
  },

  acuteObtuse() {
    const QV = QuestionVisuals;
    const items = [
      { q: '比直角小的角叫什麼角？', a: '銳角', deg: 45 },
      { q: '比直角大的角叫什麼角？', a: '鈍角', deg: 120 },
      { q: '30° 是什麼角？', a: '銳角', deg: 30 },
      { q: '100° 是什麼角？', a: '鈍角', deg: 100 },
      { q: '89° 是什麼角？', a: '銳角', deg: 89 },
      { q: '95° 是什麼角？', a: '鈍角', deg: 95 },
      { q: '60° 是什麼角？', a: '銳角', deg: 60 },
      { q: '120° 是什麼角？', a: '鈍角', deg: 120 },
      { q: '45° 是什麼角？', a: '銳角', deg: 45 },
      { q: '150° 是什麼角？', a: '鈍角', deg: 150 },
      { q: '1° 是什麼角？', a: '銳角', deg: 1 },
      { q: '179° 是什麼角？', a: '鈍角', deg: 179 }
    ];
    const v = MathUtils.randomChoice(items);
    const options = MathUtils.shuffle(['銳角', '直角', '鈍角', '平角']);
    return this._mcq('p2-angles',
      QV.withVisual(v.q, QV.angleDiagram(v.deg, { hideLabel: true })),
      options, v.a,
      '提示：直角是 90°，細過 90° 係銳角，大過 90° 係鈍角',
      `<h4>📖 解法</h4><p>答案是 <strong>${v.a}</strong></p>`);
  },

  compareAngles() {
    const QV = QuestionVisuals;
    const pool = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
    const deg1 = MathUtils.randomChoice(pool);
    let deg2 = MathUtils.randomChoice(pool);
    while (deg2 === deg1) deg2 = MathUtils.randomChoice(pool);
    const bigger = Math.max(deg1, deg2);
    const labels = MathUtils.shuffle(['A', 'B']);
    return this.base('p2-angles',
      QV.withVisual(
        `角 ${labels[0]} 和角 ${labels[1]}，哪一個較大？較大的角是多少度？`,
        QV.angleCompare(deg1, deg2, labels[0], labels[1], { hideLabel: true })
      ),
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：度數大代表角較大',
      `<h4>📖 解法</h4><p>較大的角是 <strong>${bigger}</strong>°</p>`);
  },

  // ── 小二：方向 ──
  fourDirections() {
    const QV = QuestionVisuals;
    const facing = MathUtils.randomChoice(['北', '南', '東', '西']);
    const map = {
      '北': { right: '東', left: '西', back: '南', front: '北' },
      '南': { right: '西', left: '東', back: '北', front: '南' },
      '東': { right: '南', left: '北', back: '西', front: '東' },
      '西': { right: '北', left: '南', back: '東', front: '西' }
    };
    const dir = map[facing];
    const ask = MathUtils.randomChoice(['right', 'left', 'back', 'front']);
    const labels = { right: '右邊', left: '左邊', back: '後面', front: '前面' };
    const correct = dir[ask];
    const all = ['東', '南', '西', '北'];
    const wrong = all.filter(d => d !== correct);
    const options = MathUtils.shuffle([correct, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    const scenes = ['站着', '面向操場', '看地圖時', '依照指南針'];
    const visual = QV.compassRose() + QV.facingPerson(`${facing}方`);
    return this._mcq('p2-direction',
      QV.withVisual(`${MathUtils.randomChoice(scenes)}，面向${facing}方，${labels[ask]}是什麼方向？`, visual),
      options, correct,
      '提示：面向北時，右邊是東',
      `<h4>📖 解法</h4><p>面向${facing}方，${labels[ask]}是 <strong>${correct}</strong>方</p>`);
  },

  compassDir() {
    const QV = QuestionVisuals;
    const items = [
      { q: '指南針紅色指針通常指向哪個方向？', a: '北' },
      { q: '指南針白色指針通常指向哪個方向？', a: '南' },
      { q: '太陽升起的一方是哪個方向？', a: '東' },
      { q: '太陽落下的一方是哪個方向？', a: '西' },
      { q: '在平面圖上，通常上方代表哪個方向？', a: '北' },
      { q: '在平面圖上，通常下方代表哪個方向？', a: '南' },
      { q: '在平面圖上，通常左方代表哪個方向？', a: '西' },
      { q: '在平面圖上，通常右方代表哪個方向？', a: '東' },
      { q: '「上北下南，左西右東」中，右邊是？', a: '東' },
      { q: '從北方向順時針轉 90° 會面向？', a: '東' },
      { q: '從東方向順時針轉 90° 會面向？', a: '南' },
      { q: '從南方向順時針轉 90° 會面向？', a: '西' }
    ];
    const v = MathUtils.randomChoice(items);
    const all = ['東', '南', '西', '北'];
    const wrong = all.filter(d => d !== v.a);
    const options = MathUtils.shuffle([v.a, ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p2-direction',
      QV.withVisual(v.q, QV.compassRose()),
      options, v.a,
      '提示：記住「上北下南，左西右東」',
      `<h4>📖 解法</h4><p>答案是 <strong>${v.a}</strong>方</p>`);
  },

  // ── 小二：乘法 ──
  mulTable() {
    const a = MathUtils.randomInt(2, 9);
    const b = MathUtils.randomInt(2, 9);
    const ans = a * b;
    return this.base('p2-multiply',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：背熟乘法表',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`);
  },

  mulWord() {
    const packs = MathUtils.randomInt(2, 9);
    const each = MathUtils.randomInt(2, 9);
    const ans = packs * each;
    const items = ['雞蛋', '鉛筆', '貼紙', '蘋果', '糖果'];
    const item = MathUtils.randomChoice(items);
    const mw = MathUtils.itemClassifier(item);
    return this.base('p2-multiply',
      `每盒有 ${each} ${mw}${item}，買了 ${packs} 盒。共有多少${mw}？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：每份數量 × 份數',
      `<h4>📖 解法</h4><p>${packs} × ${each} = <strong>${ans}</strong> ${mw}</p>`);
  },

  mulZeroOne() {
    const variant = MathUtils.randomChoice(['zero', 'one']);
    const n = MathUtils.randomInt(2, 9);
    if (variant === 'zero') {
      return this.base('p2-multiply',
        `計算：${n} × 0 = ?`,
        { type: 'decimal', value: 0 }, '0',
        '提示：任何數乘 0 都等於 0',
        `<h4>📖 解法</h4><p>${n} × 0 = <strong>0</strong></p>`);
    }
    return this.base('p2-multiply',
      `計算：${n} × 1 = ?`,
      { type: 'decimal', value: n }, String(n),
      '提示：任何數乘 1 都等於自己',
      `<h4>📖 解法</h4><p>${n} × 1 = <strong>${n}</strong></p>`);
  },

  // ── 小二：時間 ──
  timeMin() {
    const h = MathUtils.randomInt(1, 11);
    const m = MathUtils.randomChoice([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    const clock = this._renderClock(h, m);
    const ask = MathUtils.randomChoice(['hour', 'min']);
    if (ask === 'hour') {
      return this.base('p2-time',
        `<p>看圖：時鐘顯示幾點幾分？（只填小時數）</p>${clock}`,
        { type: 'decimal', value: h }, String(h),
        '提示：看短針',
        `<h4>📖 解法</h4><p>小時是 <strong>${h}</strong> 點</p>`);
    }
    return this.base('p2-time',
      `<p>看圖：時鐘顯示幾點幾分？（只填分鐘數）</p>${clock}`,
      { type: 'decimal', value: m }, String(m),
      '提示：看長針',
      `<h4>📖 解法</h4><p>分鐘是 <strong>${m}</strong> 分</p>`);
  },

  timeInterval() {
    const startH = MathUtils.randomInt(1, 10);
    const mins = MathUtils.randomChoice([15, 30, 45, 60]);
    const endM = mins === 60 ? 0 : mins;
    const endH = mins === 60 ? startH + 1 : startH;
    const startStr = `${startH}:00`;
    const endStr = `${endH}:${String(endM).padStart(2, '0')}`;
    const clocks = `<div class="triangle-double">${this._renderClock(startH, 0)}${this._renderClock(endH, endM)}</div>`;
    return this.base('p2-time',
      QuestionVisuals.withVisual('看圖：由左邊時鐘到右邊時鐘，經過了多少分鐘？', clocks),
      { type: 'decimal', value: mins }, String(mins),
      '提示：數一數長針走了多少格',
      `<h4>📖 解法</h4><p>經過 <strong>${mins}</strong> 分鐘</p>`);
  },

  monthDays() {
    const months = [
      { name: '一月', days: 31 }, { name: '二月', days: 28 },
      { name: '三月', days: 31 }, { name: '四月', days: 30 },
      { name: '五月', days: 31 }, { name: '六月', days: 30 },
      { name: '七月', days: 31 }, { name: '八月', days: 31 },
      { name: '九月', days: 30 }, { name: '十月', days: 31 },
      { name: '十一月', days: 30 }, { name: '十二月', days: 31 }
    ];
    const m = MathUtils.randomChoice(months);
    return this.base('p2-time',
      `${m.name}有幾天？`,
      { type: 'decimal', value: m.days }, String(m.days),
      '提示：一月、三月、五月、七月、八月、十月、十二月有 31 天',
      `<h4>📖 解法</h4><p>${m.name}有 <strong>${m.days}</strong> 天</p>`);
  },

  // ── 小二：四位數 ──
  thousandsRead() {
    const n = MathUtils.randomInt(1000, 9999);
    const cn = this._numToCn(n);
    const variant = MathUtils.randomChoice(['toNum', 'place']);
    if (variant === 'toNum') {
      return this.base('p2-thousands',
        `「${cn}」寫成阿拉伯數字是？`,
        { type: 'decimal', value: n }, String(n),
        '提示：千位、百位、十位、個位',
        `<h4>📖 解法</h4><p>答案 = <strong>${n}</strong></p>`);
    }
    const qian = Math.floor(n / 1000);
    return this.base('p2-thousands',
      `在 ${n} 中，千位的數字是？`,
      { type: 'decimal', value: qian }, String(qian),
      '提示：由左數起第一位是千位',
      `<h4>📖 解法</h4><p>千位數字是 <strong>${qian}</strong></p>`);
  },

  thousandsCompare() {
    const a = MathUtils.randomInt(1000, 9999);
    let b = MathUtils.randomInt(1000, 9999);
    while (b === a) b = MathUtils.randomInt(1000, 9999);
    const bigger = Math.max(a, b);
    return this.base('p2-thousands',
      `${a} 和 ${b}，哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：由千位開始比較',
      `<h4>📖 解法</h4><p>較大的是 <strong>${bigger}</strong></p>`);
  },

  // ── 小二：金錢 ──
  noteValue() {
    const notes = [
      { val: 10, name: '十元' },
      { val: 20, name: '二十元' },
      { val: 50, name: '五十元' },
      { val: 100, name: '一百元' }
    ];
    const note = MathUtils.randomChoice(notes);
    const wrong = notes.filter(x => x.val !== note.val).map(x => String(x.val));
    const options = MathUtils.shuffle([String(note.val), ...MathUtils.shuffle(wrong).slice(0, 3)]);
    return this._mcq('p2-money',
      `一張${note.name}紙幣值多少元？`,
      options, String(note.val),
      '提示：看紙幣上的數字',
      `<h4>📖 解法</h4><p>${note.name}紙幣值 <strong>$${note.val}</strong></p>`);
  },

  moneyChange() {
    const price = MathUtils.randomInt(5, 45);
    const pay = MathUtils.randomChoice([50, 100].filter(p => p > price));
    const ans = pay - price;
    const items = ['文具', '零食', '玩具', '書本', '貼紙'];
    const item = MathUtils.randomChoice(items);
    return this.base('p2-money',
      `買${item}用了 $${price}，付了 $${pay}，應找回多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：找回 = 付的錢 - 價錢',
      `<h4>📖 解法</h4><p>${pay} - ${price} = <strong>${ans}</strong> 元</p>`);
  },

  // ── 小二：加減混合 ──
  addSubMixed() {
    const a = MathUtils.randomInt(20, 80);
    const b = MathUtils.randomInt(10, 50);
    const c = MathUtils.randomInt(5, 30);
    const ans = a + b - c;
    if (ans < 0) return this.addSubMixed();
    return this.base('p2-mixed',
      `計算：${a} + ${b} - ${c} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：由左至右計算',
      `<h4>📖 解法</h4><p>${a} + ${b} = ${a + b}，${a + b} - ${c} = <strong>${ans}</strong></p>`);
  },

  addSubMixedWord() {
    const had = MathUtils.randomInt(50, 200);
    const got = MathUtils.randomInt(20, 80);
    const used = MathUtils.randomInt(10, had + got - 5);
    const ans = had + got - used;
    return this.base('p2-mixed',
      `商店原有 ${had} 個麵包，上午賣出 ${used} 個，下午又補貨 ${got} 個。現在有多少個？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：原有 - 賣出 + 補貨',
      `<h4>📖 解法</h4><p>${had} - ${used} + ${got} = <strong>${ans}</strong> 個</p>`);
  },

  // ── 小二：除法 ──
  divideBasic() {
    const b = MathUtils.randomInt(2, 9);
    const ans = MathUtils.randomInt(2, 12);
    const a = ans * b;
    return this.base('p2-divide',
      `計算：${a} ÷ ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：想想乘法表',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = <strong>${ans}</strong></p>`);
  },

  divideRemain() {
    const b = MathUtils.randomInt(3, 9);
    const q = MathUtils.randomInt(2, 12);
    const r = MathUtils.randomInt(1, b - 1);
    const a = q * b + r;
    return this.base('p2-divide',
      `計算：${a} ÷ ${b} = ?（商，唔計餘數）`,
      { type: 'decimal', value: q }, String(q),
      '提示：除唔盡時，答案係商',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = ${q} 餘 ${r}，商是 <strong>${q}</strong></p>`);
  },

  pictographRead() {
    const QV = QuestionVisuals;
    const symbol = MathUtils.randomChoice(['★', '●', '▲', '■']);
    const perSymbol = MathUtils.randomChoice([2, 5, 10]);
    const count = MathUtils.randomInt(2, 8);
    const total = count * perSymbol;
    const category = MathUtils.randomChoice(['蘋果', '橙', '圖書', '玩具', '學生']);
    const mw = MathUtils.itemClassifier(category);
    const chart = QV.pictograph(symbol, perSymbol, count, category);
    const ask = MathUtils.randomChoice(['total', 'count']);
    if (ask === 'total') {
      return this.base('p2-divide',
        QV.withVisual(`象形圖中，每個${symbol}代表 ${perSymbol} ${mw}${category}。${category}一行有 ${count} 個${symbol}，共有多少${mw}？`, chart),
        { type: 'decimal', value: total }, String(total),
        '提示：圖案數量 × 每個代表的值',
        `<h4>📖 解法</h4><p>${count} × ${perSymbol} = <strong>${total}</strong> ${mw}</p>`);
    }
    const given = total;
    const symCount = given / perSymbol;
    const emptyChart = QV.pictograph(symbol, perSymbol, 0, category);
    return this.base('p2-divide',
      QV.withVisual(`象形圖中，每個${symbol}代表 ${perSymbol} ${mw}${category}。共有 ${given} ${mw}${category}，要畫幾個${symbol}？`, emptyChart),
      { type: 'decimal', value: symCount }, String(symCount),
      '提示：總數 ÷ 每個代表的值',
      `<h4>📖 解法</h4><p>${given} ÷ ${perSymbol} = <strong>${symCount}</strong> 個</p>`);
  }
};
