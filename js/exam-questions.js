/* 根據 P4下學期大考 Maths.pdf 題型設計的練習題 */
const ExamQuestions = {
  TIER_POOLS: {
    'exam-calc': {
      easy: ['decimalOps', 'findA'],
      medium: ['decimalOps', 'mixedOps', 'findA', 'bracketOps'],
      hard: ['mixedOps', 'bracketOps', 'mixedOps', 'bracketOps']
    },
    'exam-frac': {
      easy: ['lcm', 'simplifyFrac', 'improperMixed'],
      medium: ['lcm', 'improperMixed', 'sameDenomFrac', 'simplifyFrac', 'fracSubtractWhole'],
      hard: ['sameDenomFrac', 'commonFactorsSum', 'fracSubtractWhole', 'bracketFrac']
    },
    'exam-word': {
      easy: ['moneyUnit', 'decimalVolume'],
      medium: ['moneyUnit', 'decimalHeight', 'decimalVolume'],
      hard: ['decimalHeight', 'decimalDistractor', 'decimalVolume']
    },
    'exam-word-logic': {
      easy: ['halfDozenRemain', 'ribbonRect'],
      medium: ['perPersonDiscount', 'halfDozenRemain', 'ribbonRect'],
      hard: ['timesMore', 'perPersonDiscount', 'decimalDistractor']
    },
    'exam-frac-word': {
      easy: ['fracWater', 'fracOrder'],
      medium: ['fracWeight', 'fracWater', 'fracOrder'],
      hard: ['fracRunEach', 'fracWeight', 'fracWater']
    },
    'exam-measure': {
      easy: ['squareAreaToPerim', 'areaDecrease'],
      medium: ['ropeRectArea', 'areaDecrease', 'squareAreaToPerim'],
      hard: ['runningLaps', 'compositeAreaCost', 'ropeRectArea']
    },
    'exam-perimeter': {
      easy: ['lShapeArea'],
      medium: ['trapezoidRectPerim', 'lShapeArea'],
      hard: ['overlapSquarePerim', 'trapezoidRectPerim', 'lShapeArea']
    },
    'exam-data': {
      easy: ['barChart'],
      medium: ['barChart'],
      hard: ['barChart']
    },
    'exam-space': {
      easy: ['mapDirection'],
      medium: ['mapDirection'],
      hard: ['mapDirection']
    }
  },

  generate(topicId, tier = 'medium') {
    const pools = this.TIER_POOLS[topicId];
    if (pools && pools[tier]) {
      const methodName = MathUtils.randomChoice(pools[tier]);
      const q = this[methodName]();
      q.tier = tier;
      return q;
    }
    const map = {
      'exam-calc': () => this.pick([this.mixedOps, this.decimalOps, this.bracketOps, this.findA]),
      'exam-frac': () => this.pick([this.lcm, this.improperMixed, this.sameDenomFrac, this.simplifyFrac, this.commonFactorsSum, this.fracSubtractWhole]),
      'exam-frac-word': () => this.pick([this.fracWeight, this.fracWater, this.fracRunEach, this.fracOrder]),
      'exam-word': () => this.pick([this.moneyUnit, this.decimalHeight, this.decimalVolume, this.decimalDistractor]),
      'exam-word-logic': () => this.pick([this.timesMore, this.perPersonDiscount, this.halfDozenRemain, this.ribbonRect]),
      'exam-measure': () => this.pick([this.ropeRectArea, this.areaDecrease, this.runningLaps, this.squareAreaToPerim, this.compositeAreaCost]),
      'exam-perimeter': () => this.pick([this.trapezoidRectPerim, this.lShapeArea, this.overlapSquarePerim]),
      'exam-data': () => this.barChart(),
      'exam-space': () => this.mapDirection()
    };
    const q = (map[topicId] || this.mixedOps)();
    q.tier = tier;
    return q;
  },

  pick(fns) {
    return MathUtils.randomChoice(fns)();
  },

  base(topicId, question, answer, answerDisplay, hint, solution, examStyle = true, tier = 'medium') {
    const t = DIFFICULTY_TIERS[tier] || DIFFICULTY_TIERS.medium;
    return {
      topicId, question, answer, answerDisplay, hint, solution, examStyle,
      tier,
      tierLabel: t.name,
      tierPoints: t.points
    };
  },

  bracketFrac() {
    const d = 9;
    const w1 = 4; const n1 = 7;
    const w2 = 5; const n2 = 13;
    const w3 = 3; const n3 = 11;
    const totalNum = (w1 * d + n1) - (w2 * d + n2) + (w3 * d + n3);
    const s = MathUtils.simplify(totalNum, d);
    return this.base('exam-frac',
      `計算：${w1} ${MathUtils.formatFractionHTML(n1, d)} - ${w2} ${MathUtils.formatFractionHTML(n2, d)} + ${w3} ${MathUtils.formatFractionHTML(n3, d)} = ?`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：化為假分數，分母相同直接計算',
      `<h4>📖 詳細解法</h4><p>答案 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`,
      true, 'hard'
    );
  },

  mixedOps() {
    const a = MathUtils.randomInt(10, 50);
    const b = MathUtils.randomInt(5, 15);
    const c = MathUtils.randomInt(20, 100);
    const d = MathUtils.randomChoice([2, 4, 7, 14]);
    const result = a * b - c / d;
    return this.base('exam-calc',
      `計算：${a} × ${b} - ${c} ÷ ${d} = ?`,
      { type: 'decimal', value: result },
      String(result),
      '提示：先乘除，後加減',
      `<h4>📖 解法（試卷第1題類型）</h4>
       <p>${a} × ${b} = ${a * b}</p>
       <p>${c} ÷ ${d} = ${c / d}</p>
       <p>${a * b} - ${c / d} = <strong>${result}</strong></p>`
    );
  },

  decimalOps() {
    const a = MathUtils.roundTo(Math.random() * 30 + 10, 1);
    const b = MathUtils.roundTo(Math.random() * 10 + 1, 2);
    const c = MathUtils.roundTo(Math.random() * 15 + 5, 2);
    const result = MathUtils.roundTo(a + b - c, 2);
    return this.base('exam-calc',
      `計算：${a} + ${b} - ${c} = ?`,
      { type: 'decimal', value: result },
      String(result),
      '提示：小數點要對齊',
      `<h4>📖 解法（試卷第2題類型）</h4><p>答案 = <strong>${result}</strong></p>`
    );
  },

  bracketOps() {
    const inner = MathUtils.randomInt(10, 20);
    const mul = MathUtils.randomInt(5, 15);
    const add = MathUtils.randomInt(50, 200);
    const div = MathUtils.randomChoice([5, 10, 23]);
    const innerResult = add + inner * mul;
    if (innerResult % div !== 0) return this.bracketOps();
    const result = innerResult / div;
    return this.base('exam-calc',
      `計算：(${add} + (${inner} × ${mul})) ÷ ${div} = ?`,
      { type: 'decimal', value: result },
      String(result),
      '提示：先計括號入面',
      `<h4>📖 解法（試卷第3題類型）</h4>
       <p>括號內：${inner} × ${mul} = ${inner * mul}</p>
       <p>${add} + ${inner * mul} = ${innerResult}</p>
       <p>${innerResult} ÷ ${div} = <strong>${result}</strong></p>`
    );
  },

  findA() {
    const a = MathUtils.roundTo(Math.random() * 30 + 50, 2);
    const b = MathUtils.roundTo(Math.random() * 20 + 10, 2);
    const c = MathUtils.roundTo(Math.random() * 20 + 10, 2);
    const result = MathUtils.roundTo(a - b - c, 2);
    return this.base('exam-calc',
      `若 A - ${b} - ${c} = ${result}，求 A 的值。`,
      { type: 'decimal', value: a },
      String(a),
      '提示：A = 結果 + 減去的數',
      `<h4>📖 解法（試卷第7題類型）</h4>
       <p>A = ${result} + ${b} + ${c} = <strong>${a}</strong></p>`
    );
  },

  lcm() {
    const pairs = [[12, 18], [15, 20], [8, 12], [6, 9], [17, 22], [14, 21]];
    const [a, b] = MathUtils.randomChoice(pairs);
    const result = MathUtils.lcm(a, b);
    return this.base('exam-frac',
      `${a} 和 ${b} 的最小公倍數是？`,
      { type: 'decimal', value: result },
      String(result),
      '提示：列出兩數的倍數，搵最小相同嘅',
      `<h4>📖 解法（試卷第4題類型）</h4><p>LCM(${a}, ${b}) = <strong>${result}</strong></p>`
    );
  },

  improperMixed() {
    if (Math.random() > 0.5) {
      const whole = MathUtils.randomInt(3, 12);
      const n = MathUtils.randomInt(1, 8);
      const d = MathUtils.randomInt(n + 1, 12);
      const improper = whole * d + n;
      return this.base('exam-frac',
        `把 ${whole} ${MathUtils.formatFractionHTML(n, d)} 化為假分數。`,
        { type: 'fraction', num: improper, den: d },
        `${improper}/${d}`,
        '提示：整數 × 分母 + 分子',
        `<h4>📖 解法（試卷第5題類型）</h4>
         <p>${whole} × ${d} + ${n} = ${improper}</p>
         <p>答案 = <strong>${improper}/${d}</strong></p>`
      );
    }
    const improper = MathUtils.randomInt(20, 80);
    const d = MathUtils.randomChoice([7, 9, 11, 13]);
    const whole = Math.floor(improper / d);
    const n = improper % d;
    return this.base('exam-frac',
      `把 ${MathUtils.formatFractionHTML(improper, d)} 化為帶分數。`,
      { type: 'fraction', num: improper, den: d },
      MathUtils.fractionToString(improper, d),
      '提示：分子 ÷ 分母，商係整數部分',
      `<h4>📖 解法（試卷第6題類型）</h4>
       <p>答案 = <strong>${MathUtils.fractionToString(improper, d)}</strong></p>`
    );
  },

  sameDenomFrac() {
    const d = MathUtils.randomChoice([8, 9, 12, 15, 18]);
    const w1 = MathUtils.randomInt(2, 8);
    const n1 = MathUtils.randomInt(1, d - 1);
    const w2 = MathUtils.randomInt(2, 8);
    const n2 = MathUtils.randomInt(1, d - 1);
    const w3 = MathUtils.randomInt(1, 6);
    const n3 = MathUtils.randomInt(1, d - 1);
    const totalNum = (w1 * d + n1) - (w2 * d + n2) + (w3 * d + n3);
    if (totalNum <= 0) return this.sameDenomFrac();
    const s = MathUtils.simplify(totalNum, d);
    return this.base('exam-frac',
      `計算：${w1} ${MathUtils.formatFractionHTML(n1, d)} - ${w2} ${MathUtils.formatFractionHTML(n2, d)} + ${w3} ${MathUtils.formatFractionHTML(n3, d)} = ?`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：先化為假分數，分母相同直接計算',
      `<h4>📖 解法（試卷第8題類型）</h4><p>答案 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`
    );
  },

  commonFactorsSum() {
    const pairs = [[12, 18], [15, 51], [20, 30], [24, 36]];
    const [a, b] = MathUtils.randomChoice(pairs);
    const factors = [];
    for (let i = 1; i <= Math.min(a, b); i++) {
      if (a % i === 0 && b % i === 0) factors.push(i);
    }
    const sum = factors.reduce((s, n) => s + n, 0);
    return this.base('exam-frac',
      `${a} 和 ${b} 的所有公因數之和是？`,
      { type: 'decimal', value: sum },
      String(sum),
      '提示：公因數係兩個數都除得盡的因數',
      `<h4>📖 解法（試卷第9題類型）</h4>
       <p>公因數：${factors.join('、')}</p>
       <p>之和 = <strong>${sum}</strong></p>`
    );
  },

  simplifyFrac() {
    const targetDen = MathUtils.randomChoice([12, 15, 18, 21]);
    const a = MathUtils.randomInt(2, 14);
    const factor = MathUtils.randomInt(2, 4);
    const num = a * factor;
    const den = targetDen * factor;
    return this.base('exam-frac',
      `化簡 ${MathUtils.formatFractionHTML(num, den)} = A/${targetDen}，求 A 的值。`,
      { type: 'decimal', value: a },
      String(a),
      `提示：約分後分母要變成 ${targetDen}`,
      `<h4>📖 解法（試卷第10題類型）</h4>
       <p>${MathUtils.formatFractionHTML(num, den)} 約分後 = ${MathUtils.formatFractionHTML(a, targetDen)}</p>
       <p>A = <strong>${a}</strong></p>`
    );
  },

  fracSubtractWhole() {
    const whole = MathUtils.randomInt(8, 15);
    const n1 = MathUtils.randomInt(1, 5);
    const d = MathUtils.randomChoice([4, 8]);
    const n2 = MathUtils.randomInt(1, 3);
    const total = whole * d - (n1 + n2);
    const s = MathUtils.simplify(total, d);
    return this.base('exam-frac',
      `計算：${whole} - ${MathUtils.formatFractionHTML(n1, d)} - ${MathUtils.formatFractionHTML(n2, d)} = ?`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：把整數化為分數再計算',
      `<h4>📖 解法（試卷第12題類型）</h4><p>答案 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`
    );
  },

  fracOrder() {
    const vals = [
      { v: 13.15, s: '13.15' },
      { v: 13.7, s: '13.7' },
      { v: 13 + 9/250, s: `13 ${MathUtils.formatFractionHTML(9, 250)}` }
    ];
    const sorted = [...vals].sort((a, b) => b.v - a.v);
    const answer = sorted.map(x => x.s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).join(' > ');
    return this.base('exam-frac-word',
      `把 13.15、13.7 和 13 ${MathUtils.formatFractionHTML(9, 250)} 由大至小排列（用 > 連接）。`,
      { type: 'text', value: '13.7 > 13.15 > 13 9/250' },
      '13.7 > 13.15 > 13 9/250',
      '提示：13又9/250 = 13.036，比 13.15 細',
      `<h4>📖 解法（試卷第13題類型）</h4>
       <p>13 9/250 = 13.036</p>
       <p>由大至小：<strong>13.7 > 13.15 > 13 9/250</strong></p>`,
      false
    );
  },

  fracWeight() {
    const d = 5;
    const tvNum = MathUtils.randomInt(18, 28) * d + MathUtils.randomInt(1, 4);
    const diffNum = MathUtils.randomInt(8, 14) * d + MathUtils.randomInt(1, 4);
    const acNum = tvNum + diffNum;
    const totalNum = tvNum + acNum;
    return this.base('exam-frac-word',
      `一部電視重 ${MathUtils.fractionToString(tvNum, d)} 公斤，比冷氣機輕 ${MathUtils.fractionToString(diffNum, d)} 公斤，兩者共重多少公斤？`,
      { type: 'fraction', num: totalNum, den: d },
      MathUtils.fractionToString(totalNum, d),
      '提示：先計冷氣機重量，再加電視重量',
      `<h4>📖 解法（試卷第17題類型）</h4>
       <p>冷氣機 = ${MathUtils.fractionToString(tvNum, d)} + ${MathUtils.fractionToString(diffNum, d)} = ${MathUtils.fractionToString(acNum, d)} 公斤</p>
       <p>共重 = <strong>${MathUtils.fractionToString(totalNum, d)}</strong> 公斤</p>`
    );
  },

  fracWater() {
    const start = 5;
    const n1 = MathUtils.randomInt(3, 7);
    const n2 = MathUtils.randomInt(1, 4);
    const d = 10;
    const remain = start * d - n1 + n2;
    const s = MathUtils.simplify(remain, d);
    return this.base('exam-frac-word',
      `飲水機原有 ${start} 升水，喝了 ${MathUtils.formatFractionHTML(n1, d)} 升後，又加入 ${MathUtils.formatFractionHTML(n2, d)} 升，現有多少升水？`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：原有 - 喝了 + 加入',
      `<h4>📖 解法（試卷第27題類型）</h4><p>答案 = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong> 升</p>`
    );
  },

  fracRunEach() {
    const d = 5;
    const yesterdayEach = 12;
    const todayNum = 18;
    const diffNum = yesterdayEach * 2 - todayNum;
    const s = MathUtils.simplify(diffNum, d);
    return this.base('exam-frac-word',
      `跑道長 6 公里（唔使理）。昨天爸爸早上和下午各跑了 ${MathUtils.fractionToString(12, d)} 公里，今天跑了 ${MathUtils.fractionToString(18, d)} 公里。昨天比今天多跑多少公里？`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：「早上和下午各」= 乘 2！跑道長度係多餘資料',
      `<h4>📖 解法（試卷第25題類型）</h4>
       <p>昨天 = ${MathUtils.fractionToString(12, d)} × 2 = ${MathUtils.fractionToString(24, d)} 公里</p>
       <p>相差 = ${MathUtils.fractionToString(24, d)} - ${MathUtils.fractionToString(18, d)} = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong> 公里</p>`
    );
  },

  moneyUnit() {
    const boxes = 4;
    const cost = MathUtils.randomChoice([280, 316, 400]);
    const buy = 6;
    const unit = cost / boxes;
    const change = 500 - unit * buy;
    return this.base('exam-word',
      `${boxes} 個膠箱售 ${cost} 元，婆婆用 500 元買 ${buy} 個，應找回多少元？`,
      { type: 'decimal', value: change },
      String(change),
      '提示：先計每個箱幾錢',
      `<h4>📖 解法（試卷第18題類型）</h4>
       <p>每個 = ${cost} ÷ ${boxes} = ${unit} 元</p>
       <p>找回 = 500 - ${unit} × ${buy} = <strong>${change}</strong> 元</p>`
    );
  },

  decimalHeight() {
    const a = MathUtils.roundTo(Math.random() * 0.5 + 1.2, 2);
    const diff1 = MathUtils.roundTo(Math.random() * 0.3 + 0.15, 2);
    const diff2 = MathUtils.roundTo(Math.random() * 0.4 + 0.3, 2);
    const b = MathUtils.roundTo(a - diff1, 2);
    const c = MathUtils.roundTo(b + diff2, 2);
    return this.base('exam-word',
      `志美高 ${a} 米，比永恩高 ${diff1} 米。永恩比志明矮 ${diff2} 米。志明高多少米？`,
      { type: 'decimal', value: c },
      String(c),
      '提示：一步步計，留意「高」定「矮」',
      `<h4>📖 解法（試卷第16題類型）</h4>
       <p>永恩 = ${a} - ${diff1} = ${b} 米</p>
       <p>志明 = ${b} + ${diff2} = <strong>${c}</strong> 米</p>`
    );
  },

  decimalVolume() {
    const total = MathUtils.roundTo(Math.random() * 20 + 30, 1);
    const bottle = MathUtils.roundTo(Math.random() * 10 + 15, 1);
    const other = MathUtils.roundTo(total - bottle, 1);
    const diff = MathUtils.roundTo(Math.abs(bottle - other), 1);
    return this.base('exam-word',
      `店舖有 ${total} 升芒果汁，倒入兩個樽，其中一樽有 ${bottle} 升，兩樽相差多少升？`,
      { type: 'decimal', value: diff },
      String(diff),
      '提示：先計另一樽有幾多，再求相差',
      `<h4>📖 解法（試卷第19題類型）</h4>
       <p>另一樽 = ${total} - ${bottle} = ${other} 升</p>
       <p>相差 = <strong>${diff}</strong> 升</p>`
    );
  },

  decimalDistractor() {
    const chan = MathUtils.roundTo(Math.random() * 20 + 60, 1);
    const more = MathUtils.roundTo(Math.random() * 10 + 10, 1);
    const cheung = MathUtils.roundTo(chan + more, 1);
    return this.base('exam-word',
      `陳先生的車行了 ${chan} 公里。陳先生的車比吳先生的車少行 12.9 公里。張先生的車比陳先生的車多行 ${more} 公里。張先生的車行了多少公里？<br><small>（吳先生的資料需要嗎？）</small>`,
      { type: 'decimal', value: cheung },
      String(cheung),
      '提示：題目問張先生，只需要陳先生同張先生的關係！',
      `<h4>📖 解法（試卷第23題類型）</h4>
       <p>吳先生嘅資料係多餘的！</p>
       <p>張先生 = ${chan} + ${more} = <strong>${cheung}</strong> 公里</p>`
    );
  },

  timesMore() {
    const pants = MathUtils.randomInt(40, 60);
    const extra = MathUtils.randomInt(20, 35);
    const shorts = 4 * pants + extra;
    const total = shorts + pants;
    return this.base('exam-word-logic',
      `店舖有 ${shorts} 條短褲，比長褲的 4 倍多 ${extra} 條。短褲和長褲共有多少條？`,
      { type: 'decimal', value: total },
      String(total),
      '提示：先計長褲有幾多條',
      `<h4>📖 解法（試卷第22題類型）</h4>
       <p>長褲 = (${shorts} - ${extra}) ÷ 4 = ${pants} 條</p>
       <p>共有 = ${shorts} + ${pants} = <strong>${total}</strong> 條</p>`
    );
  },

  perPersonDiscount() {
    const price = MathUtils.randomChoice([500, 568, 600]);
    const discount = MathUtils.randomChoice([30, 50, 80]);
    const people = 3;
    const total = (price - discount) * people;
    return this.base('exam-word-logic',
      `遊樂場入場費每位 ${price} 元，3人同行每人減 ${discount} 元。子明同兩個朋友一起去，共付多少元？`,
      { type: 'decimal', value: total },
      String(total),
      '提示：「每人減」= 每個人都要減！',
      `<h4>📖 解法（試卷第24題類型）</h4>
       <p>每人付 = ${price} - ${discount} = ${price - discount} 元</p>
       <p>共付 = ${price - discount} × ${people} = <strong>${total}</strong> 元</p>`
    );
  },

  halfDozenRemain() {
    const total = MathUtils.randomChoice([280, 320, 400]);
    const boxes = MathUtils.randomInt(10, 15);
    const perBox = 6;
    const remain = total - boxes * perBox;
    return this.base('exam-word-logic',
      `餅店有 ${total} 個包，每盒裝半打，裝滿了 ${boxes} 盒後，還剩多少個包？`,
      { type: 'decimal', value: remain },
      String(remain),
      '提示：半打 = 6 個',
      `<h4>📖 解法（試卷第26題類型）</h4>
       <p>裝了 = ${boxes} × 6 = ${boxes * perBox} 個</p>
       <p>剩餘 = ${total} - ${boxes * perBox} = <strong>${remain}</strong> 個</p>`
    );
  },

  ribbonRect() {
    const ribbon = 150;
    const l = 10;
    const w = 5;
    const perim = 2 * (l + w);
    const count = Math.floor(ribbon / perim);
    return this.base('exam-word-logic',
      `一條繩長 ${ribbon} cm，可圍出多少個長 ${l} cm、闊 ${w} cm 的長方形？`,
      { type: 'decimal', value: count },
      String(count),
      '提示：先計一個長方形周界，再用繩長除以周界',
      `<h4>📖 解法（試卷第21題類型）</h4>
       <p>周界 = 2 × (${l} + ${w}) = ${perim} cm</p>
       <p>可圍 = ${ribbon} ÷ ${perim} = <strong>${count}</strong> 個</p>`
    );
  },

  ropeRectArea() {
    const perimeter = MathUtils.randomChoice([32, 40, 48]);
    const ratio = 3;
    const width = perimeter / (2 * (ratio + 1));
    const length = width * ratio;
    const area = length * width;
    return this.base('exam-measure',
      `一條 ${perimeter} cm 的繩圍成一個長方形，長是闊的 ${ratio} 倍，面積是多少 cm²？`,
      { type: 'decimal', value: area },
      String(area),
      '提示：周界 = 2 × (長 + 闊)，長 = 3 × 闊',
      `<h4>📖 解法（試卷第15題類型）</h4>
       <p>闊 = ${perimeter} ÷ 2 ÷ ${ratio + 1} = ${width} cm</p>
       <p>長 = ${width} × ${ratio} = ${length} cm</p>
       <p>面積 = <strong>${area}</strong> cm²</p>`
    );
  },

  trapezoidRectPerim() {
    const top = 10;
    const bottom = 19;
    const height = 12;
    const length = top + bottom;
    const perimeter = 2 * (length + height);
    return this.base('exam-perimeter',
      `兩個相同的梯形（上底 ${top} cm、下底 ${bottom} cm、高 ${height} cm）拼成一個長方形，長方形周界是多少 cm？`,
      { type: 'decimal', value: perimeter },
      String(perimeter),
      '提示：拼成後長 = 上底 + 下底，闊 = 高',
      `<h4>📖 解法（試卷第28題類型）</h4>
       <p>長 = ${top} + ${bottom} = ${length} cm，闊 = ${height} cm</p>
       <p>周界 = 2 × (${length} + ${height}) = <strong>${perimeter}</strong> cm</p>`
    );
  },

  lShapeArea() {
    const w = 45;
    const h = 28;
    const thick = 15;
    const area = w * thick + (h - thick) * thick;
    return this.base('exam-perimeter',
      `一個 L 形圖形，總闊 ${w} cm、總高 ${h} cm，厚度 ${thick} cm，面積是多少 cm²？`,
      { type: 'decimal', value: area },
      String(area),
      '提示：分割成兩個長方形',
      `<h4>📖 解法（試卷第29題類型）</h4>
       <p>分成兩個長方形計算</p>
       <p>面積 = <strong>${area}</strong> cm²</p>`
    );
  },

  overlapSquarePerim() {
    const side = 16;
    const overlapSide = 8;
    const perim = 2 * (side + side + (side - overlapSide) + (side - overlapSide));
    return this.base('exam-perimeter',
      `兩個相同的正方形（邊長 ${side} cm）重疊，重疊部分面積 64 cm²。整個圖形周界是多少 cm？`,
      { type: 'decimal', value: perim },
      String(perim),
      '提示：重疊部分係正方形，邊長 = √64 = 8 cm',
      `<h4>📖 解法（試卷第30題類型）</h4>
       <p>重疊邊長 = 8 cm</p>
       <p>周界 = <strong>${perim}</strong> cm</p>`
    );
  },

  areaDecrease() {
    const l = MathUtils.randomInt(6, 10);
    const w = MathUtils.randomInt(4, 8);
    const old = l * w;
    const newA = (l - 1) * (w - 1);
    const decrease = old - newA;
    return this.base('exam-measure',
      `一個長 ${l} m、闊 ${w} m 的長方形，每邊減少 1 m，面積減少多少 m²？`,
      { type: 'decimal', value: decrease },
      String(decrease),
      '提示：分別計算新舊面積再相減',
      `<h4>📖 解法（試卷第31題類型）</h4>
       <p>原面積 = ${old} m²，新面積 = ${newA} m²</p>
       <p>減少 = <strong>${decrease}</strong> m²</p>`
    );
  },

  runningLaps() {
    const l = MathUtils.randomChoice([50, 65]);
    const w = MathUtils.randomChoice([30, 42]);
    const laps = MathUtils.randomChoice([5, 8]);
    const meters = 2 * (l + w) * laps;
    const km = MathUtils.roundTo(meters / 1000, 2);
    return this.base('exam-measure',
      `長 ${l} m、闊 ${w} m 的長方形花園，跑了 ${laps} 圈，共跑了多少公里？`,
      { type: 'decimal', value: km },
      String(km),
      '提示：先計周界，再乘圈數，最後除以 1000',
      `<h4>📖 解法（試卷第32題類型）</h4>
       <p>周界 = 2 × (${l} + ${w}) = ${2 * (l + w)} m</p>
       <p>總共 = ${2 * (l + w)} × ${laps} = ${meters} m = <strong>${km}</strong> km</p>`
    );
  },

  squareAreaToPerim() {
    const side = MathUtils.randomChoice([9, 11, 13]);
    const area = side * side;
    const perim = side * 4;
    return this.base('exam-measure',
      `一個正方形面積是 ${area} cm²，周界是多少 cm？`,
      { type: 'decimal', value: perim },
      String(perim),
      '提示：面積 = 邊長 × 邊長，先搵邊長',
      `<h4>📖 解法（試卷第33題類型）</h4>
       <p>邊長 = √${area} = ${side} cm</p>
       <p>周界 = ${side} × 4 = <strong>${perim}</strong> cm</p>`
    );
  },

  compositeAreaCost() {
    const total = 100;
    const cutW = 8;
    const cutH = 4;
    const area = total - cutW * cutH;
    const cost = area * 75;
    return this.base('exam-measure',
      `一個 10 m × 10 m 的正方形，中間挖去 8 m × 4 m 的長方形。鋪假草每平方米 75 元，共需多少元？`,
      { type: 'decimal', value: cost },
      String(cost),
      '提示：用大正方形面積減去挖去的部分',
      `<h4>📖 解法（試卷第34題類型）</h4>
       <p>面積 = 100 - ${cutW * cutH} = ${area} m²</p>
       <p>費用 = ${area} × 75 = <strong>${cost}</strong> 元</p>`
    );
  },

  barChart() {
    const data = { 一: 30, 二: 40, 三: 100, 四: 90, 五: 80, 六: 110 };
    const types = [
      () => {
        const ans = data.五 / data.二;
        return {
          q: `棒形圖顯示：一年級 30 人、二年級 40 人、三年級 100 人、四年級 90 人、五年級 80 人、六年級 110 人參加晚宴。五年級人數是二年級的多少倍？`,
          a: ans, display: String(ans)
        };
      },
      () => {
        const total = Object.values(data).reduce((s, n) => s + n, 0);
        return {
          q: `（同上棒形圖）參加晚宴的總人數是多少？`,
          a: total, display: String(total)
        };
      },
      () => {
        const ans = data.四 * 45;
        return {
          q: `（同上棒形圖）入場費每人 45 元，四年級共收了多少元？`,
          a: ans, display: String(ans)
        };
      }
    ];
    const t = MathUtils.randomChoice(types)();
    return this.base('exam-data', t.q,
      { type: 'decimal', value: t.a }, t.display,
      '提示：仔細閱讀棒形圖數據',
      `<h4>📖 解法（試卷第41-45題類型）</h4><p>答案 = <strong>${t.display}</strong></p>`
    );
  },

  mapDirection() {
    const questions = [
      {
        q: '足球場在城堡的東南方。小食亭在城堡的東面。魚池在城堡的東南方，也在小食亭的南面。魚池在足球場的哪個方向？',
        options: ['東北面', '西北面', '東南面', '西南面'],
        correct: 0,
        solution: '魚池在小食亭南面、城堡東南面，所以魚池在足球場的東北面。'
      },
      {
        q: '從城堡出發，向東走，再向東北走，會到達哪裡？',
        options: ['洗手間', '小食亭', '魚池', '籃球場'],
        correct: 1,
        solution: '向東到小食亭，再向東北仍在小食亭附近區域。'
      }
    ];
    const q = MathUtils.randomChoice(questions);
    return {
      topicId: 'exam-space',
      question: q.q,
      type: 'mcq',
      options: q.options,
      correctIndex: q.correct,
      answer: { type: 'decimal', value: q.correct },
      answerDisplay: q.options[q.correct],
      hint: '提示：對照指南針方向',
      solution: `<h4>📖 解法（試卷第36-38題類型）</h4><p>${q.solution}</p>`,
      examStyle: true
    };
  },

  generateMCQ(topicId, tier = 'medium') {
    let q = this.generate(topicId, tier);
    if (q.type === 'mcq') {
      return { ...q, topicName: getTopicName(topicId), correctIndex: q.correctIndex };
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
      } else {
        wrong = String(MathUtils.roundTo(q.answer.value + offset, 2));
      }
      if (wrong && wrong !== correct) wrongAnswers.add(wrong);
    }
    while (wrongAnswers.size < 3) {
      wrongAnswers.add(String(MathUtils.randomInt(1, 50)));
    }

    const options = MathUtils.shuffle([correct, ...wrongAnswers]);
    return {
      ...q,
      topicName: getTopicName(topicId),
      options,
      correctIndex: options.indexOf(correct)
    };
  }
};

function getTopicName(id) {
  const t = TOPICS.find(x => x.id === id);
  return t ? t.name : id;
}
