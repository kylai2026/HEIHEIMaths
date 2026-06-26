/* 心光數學小五、小六課題練習題 */
const P56Questions = {
  TIER_POOLS: {
    'p5-multidigit': { easy: ['bigNumRead', 'bigNumCompare'], medium: ['bigNumCompare', 'roundNumber'], hard: ['roundNumber', 'bigNumCompare'] },
    'p5-tri-area': { easy: ['triArea'], medium: ['triArea', 'triAreaWord'], hard: ['triAreaWord', 'triArea'] },
    'p5-quad-area': { easy: ['paraArea'], medium: ['paraArea', 'trapArea'], hard: ['trapArea', 'areaWord'] },
    'p5-frac-cmp': { easy: ['unlikeFracCmp'], medium: ['unlikeFracCmp'], hard: ['unlikeFracCmp'] },
    'p5-frac-addsub': { easy: ['unlikeFracAdd'], medium: ['unlikeFracAdd', 'unlikeFracSub'], hard: ['unlikeFracSub', 'unlikeFracWord'] },
    'p5-frac-mul': { easy: ['fracMulInt'], medium: ['fracMulInt', 'fracMulFrac'], hard: ['fracMulFrac', 'fracMulWord'] },
    'p5-algebra': { easy: ['algebraEval'], medium: ['algebraEval', 'solveEquation'], hard: ['solveEquation', 'equationWord'] },
    'p5-circle': { easy: ['circleRadius', 'circleParts'], medium: ['circleRadius', 'circleParts'], hard: ['circleRadius', 'circleParts'] },
    'p5-decimal-mul': { easy: ['decMulInt'], medium: ['decMulInt', 'decMulDec'], hard: ['decMulDec', 'decMulWord'] },
    'p5-frac-div': { easy: ['fracDivInt'], medium: ['fracDivInt', 'fracDivFrac'], hard: ['fracDivFrac', 'fracMixedOps'] },
    'p5-volume': { easy: ['volumeCalc'], medium: ['volumeCalc', 'volumeWord'], hard: ['volumeWord', 'volumeCalc'] },
    'p6-decimal-div': { easy: ['decDivInt'], medium: ['decDivInt', 'decDivDec'], hard: ['decDivDec', 'decDivWord'] },
    'p6-decimal-mixed': { easy: ['decFourOps'], medium: ['decFourOps', 'decFourOpsWord'], hard: ['decFourOpsWord', 'decFourOps'] },
    'p6-frac-decimal': { easy: ['fracToDec'], medium: ['fracToDec', 'decToFrac'], hard: ['decToFrac', 'fracDecCmp'] },
    'p6-average': { easy: ['averageCalc'], medium: ['averageCalc', 'averageWord'], hard: ['averageWord', 'averageCalc'] },
    'p6-percent': { easy: ['percentRead'], medium: ['percentRead', 'fracToPercent'], hard: ['fracToPercent', 'decToPercent'] },
    'p6-percent-app': { easy: ['percentOf'], medium: ['percentOf', 'percentIncDec'], hard: ['percentIncDec', 'percentOf'] },
    'p6-circumference': { easy: ['circumference'], medium: ['circumference', 'circumferenceWord'], hard: ['circumferenceWord', 'circumference'] },
    'p6-circle-area': { easy: ['circleArea'], medium: ['circleArea', 'circleAreaWord'], hard: ['circleAreaWord', 'circleArea'] },
    'p6-angles-deg': { easy: ['angleMeasure'], medium: ['angleMeasure', 'angleSum'], hard: ['angleSum', 'angleMeasure'] },
    'p6-speed': { easy: ['speedCalc'], medium: ['speedCalc', 'speedWord'], hard: ['speedWord', 'speedCalc'] },
    'p6-pie-chart': { easy: ['pieChartRead'], medium: ['pieChartRead', 'pieChartPercent'], hard: ['pieChartPercent', 'pieChartRead'] }
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
    const method = MathUtils.randomChoice(this.TIER_POOLS[topicId]?.medium || ['bigNumRead']);
    const q = this[method]();
    q.tier = tier;
    q.topicId = topicId;
    return q;
  },

  base(topicId, question, answer, answerDisplay, hint, solution, tier = 'medium', extra = {}) {
    return P34Questions.base(topicId, question, answer, answerDisplay, hint, solution, tier, extra);
  },

  pick(fns) { return MathUtils.randomChoice(fns)(); },

  _numToCn(n) {
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (n === 0) return '零';
    const section = (num) => {
      if (num === 0) return '';
      let str = '';
      const thousand = Math.floor(num / 1000);
      const hundred = Math.floor((num % 1000) / 100);
      const ten = Math.floor((num % 100) / 10);
      const one = num % 10;
      if (thousand) str += chars[thousand] + '千';
      if (hundred) str += chars[hundred] + '百';
      else if (thousand && (ten || one)) str += '零';
      if (ten) {
        if (ten === 1 && !thousand && !hundred) str += '十';
        else str += chars[ten] + '十';
      } else if ((thousand || hundred) && one) str += '零';
      if (one) str += chars[one];
      return str;
    };
    const wan = Math.floor(n / 10000);
    const rest = n % 10000;
    let result = '';
    if (wan) result += section(wan) + '萬';
    if (rest) {
      if (wan && rest < 1000) result += '零';
      result += section(rest);
    }
    return result || '零';
  },

  _unlikeFracPair() {
    const dens = MathUtils.shuffle([3, 4, 5, 6, 8, 9, 10, 12]);
    const d1 = dens[0];
    let d2 = dens[1];
    while (d2 === d1) d2 = MathUtils.randomChoice(dens);
    const n1 = MathUtils.randomInt(1, d1 - 1);
    const n2 = MathUtils.randomInt(1, d2 - 1);
    return { n1, d1, n2, d2 };
  },

  _fracPair() {
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8, 10, 12]);
    const n1 = MathUtils.randomInt(1, den - 1);
    let n2 = MathUtils.randomInt(1, den - 1);
    while (n2 === n1) n2 = MathUtils.randomInt(1, den - 1);
    return { n1, n2, den };
  },

  // ── 小五：多位數 ──
  bigNumRead() {
    const n = MathUtils.randomInt(100000, 9999999);
    const cn = this._numToCn(n);
    return this.base('p5-multidigit',
      `「${cn}」寫成阿拉伯數字是？`,
      { type: 'decimal', value: n }, String(n),
      '提示：由高位至低位寫，留意「萬」位',
      `<h4>📖 解法</h4><p>答案 = <strong>${n}</strong></p>`
    );
  },

  bigNumCompare() {
    const a = MathUtils.randomInt(100000, 9999999);
    let b = MathUtils.randomInt(100000, 9999999);
    while (b === a) b = MathUtils.randomInt(100000, 9999999);
    const bigger = Math.max(a, b);
    return this.base('p5-multidigit',
      `${a.toLocaleString()} 和 ${b.toLocaleString()} 哪一個較大？（只填較大的數）`,
      { type: 'decimal', value: bigger }, String(bigger),
      '提示：由最高位開始逐位比較',
      `<h4>📖 解法</h4><p>比較後較大的是 <strong>${bigger}</strong></p>`
    );
  },

  roundNumber() {
    const units = [
      { label: '十', val: 10 },
      { label: '百', val: 100 },
      { label: '千', val: 1000 },
      { label: '萬', val: 10000 }
    ];
    const u = MathUtils.randomChoice(units);
    const n = MathUtils.randomInt(u.val * 12, u.val * 999);
    const ans = Math.round(n / u.val) * u.val;
    return this.base('p5-multidigit',
      `把 ${n.toLocaleString()} 四捨五入至最接近的${u.label}位，答案是？`,
      { type: 'decimal', value: ans }, String(ans),
      `提示：睇${u.label}位左面嗰位數字決定入唔入`,
      `<h4>📖 解法</h4><p>${n} 四捨五入至${u.label}位 = <strong>${ans}</strong></p>`
    );
  },

  // ── 小五：三角形面積 ──
  triArea() {
    let base = MathUtils.randomInt(4, 30);
    let height = MathUtils.randomInt(3, 24);
    if ((base * height) % 2 !== 0) height += 1;
    const ans = base * height / 2;
    const chart = P34Questions._renderTriangleArea(base, height);
    return this.base('p5-tri-area',
      `<p>看圖：三角形底和高如圖所示，面積是多少 cm²？</p>${chart}`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：三角形面積 = 底 × 高 ÷ 2',
      `<h4>📖 解法</h4><p>${base} × ${height} ÷ 2 = <strong>${ans}</strong> cm²</p>`
    );
  },

  triAreaWord() {
    const templates = [
      () => {
        let b = MathUtils.randomInt(6, 20);
        let h = MathUtils.randomInt(4, 16);
        if ((b * h) % 2 !== 0) h += 1;
        const area = b * h / 2;
        const price = MathUtils.randomInt(5, 15);
        const ans = area * price;
        const chart = P34Questions._renderTriangleArea(b, h, 'm');
        return {
          q: `<p>看圖：一塊三角形地皮，每平方米 ${price} 元，這塊地值多少元？</p>${chart}`,
          ans,
          sol: `面積 = ${b} × ${h} ÷ 2 = ${area} m²，費用 = ${area} × ${price} = ${ans} 元`
        };
      },
      () => {
        let b = MathUtils.randomInt(8, 24);
        let h = MathUtils.randomInt(5, 18);
        if ((b * h) % 2 !== 0) b += 1;
        const ans = b * h / 2;
        const chart = P34Questions._renderTriangleArea(b, h);
        return {
          q: `<p>看圖：三角形廣告牌，面積是多少 cm²？</p>${chart}`,
          ans,
          sol: `${b} × ${h} ÷ 2 = ${ans} cm²`
        };
      },
      () => {
        const h = MathUtils.randomChoice([4, 5, 6, 8, 10, 12, 15]);
        const b = MathUtils.randomInt(6, 24);
        const area = b * h / 2;
        const chart = P34Questions._renderTriangleArea(b, h, 'cm', { hideBase: true });
        return {
          q: `<p>看圖：三角形面積是 ${area} cm²，高 ${h} cm，底是多少 cm？</p>${chart}`,
          ans: b,
          sol: `底 = 面積 × 2 ÷ 高 = ${area} × 2 ÷ ${h} = ${b} cm`
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-tri-area', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：面積 = 底 × 高 ÷ 2',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  // ── 小五：四邊形面積 ──
  paraArea() {
    const base = MathUtils.randomInt(5, 25);
    const height = MathUtils.randomInt(4, 18);
    const ans = base * height;
    return this.base('p5-quad-area',
      QuestionVisuals.withVisual(
        `一個平行四邊形，底 ${base} cm，高 ${height} cm，面積是多少 cm²？`,
        QuestionVisuals.parallelogram(base, height, 'cm', { hideLabels: true })
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：平行四邊形面積 = 底 × 高',
      `<h4>📖 解法</h4><p>${base} × ${height} = <strong>${ans}</strong> cm²</p>`
    );
  },

  trapArea() {
    let top = MathUtils.randomInt(4, 15);
    let bottom = MathUtils.randomInt(top + 2, 25);
    let height = MathUtils.randomInt(4, 16);
    if ((top + bottom) * height % 2 !== 0) height += 1;
    const ans = (top + bottom) * height / 2;
    return this.base('p5-quad-area',
      QuestionVisuals.withVisual(
        `一個梯形，上底 ${top} cm，下底 ${bottom} cm，高 ${height} cm，面積是多少 cm²？`,
        QuestionVisuals.trapezoid(top, bottom, height, 'cm', { hideLabels: true })
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：梯形面積 = (上底 + 下底) × 高 ÷ 2',
      `<h4>📖 解法</h4><p>(${top} + ${bottom}) × ${height} ÷ 2 = <strong>${ans}</strong> cm²</p>`
    );
  },

  areaWord() {
    const kind = MathUtils.randomChoice(['para', 'trap']);
    if (kind === 'para') {
      const l = MathUtils.randomInt(8, 20);
      const w = MathUtils.randomInt(5, 12);
      const ans = l * w;
      return this.base('p5-quad-area',
        QuestionVisuals.withVisual(
          `一塊平行四邊形花圃，底 ${l} m，高 ${w} m，面積是多少 m²？`,
          QuestionVisuals.parallelogram(l, w, 'm', { hideLabels: true })
        ),
        { type: 'decimal', value: ans }, String(ans),
        '提示：面積 = 底 × 高',
        `<h4>📖 解法</h4><p>${l} × ${w} = <strong>${ans}</strong> m²</p>`
      );
    }
    let top = MathUtils.randomInt(5, 12);
    let bottom = MathUtils.randomInt(14, 22);
    let height = MathUtils.randomInt(6, 14);
    if ((top + bottom) * height % 2 !== 0) height += 1;
    const ans = (top + bottom) * height / 2;
    return this.base('p5-quad-area',
      QuestionVisuals.withVisual(
        `一個梯形水池，上底 ${top} m，下底 ${bottom} m，深 ${height} m（當高），面積是多少 m²？`,
        QuestionVisuals.trapezoid(top, bottom, height, 'm', { hideLabels: true })
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：梯形面積 = (上底 + 下底) × 高 ÷ 2',
      `<h4>📖 解法</h4><p>(${top} + ${bottom}) × ${height} ÷ 2 = <strong>${ans}</strong> m²</p>`
    );
  },

  // ── 小五：異分母分數比較 ──
  unlikeFracCmp() {
    const { n1, d1, n2, d2 } = this._unlikeFracPair();
    const lcm = MathUtils.lcm(d1, d2);
    const v1 = n1 * lcm / d1;
    const v2 = n2 * lcm / d2;
    const bigger = v1 > v2 ? { num: n1, den: d1 } : { num: n2, den: d2 };
    const smaller = v1 > v2 ? { num: n2, den: d2 } : { num: n1, den: d1 };
    const askBigger = Math.random() > 0.3;
    const target = askBigger ? bigger : smaller;
    const label = askBigger ? '較大' : '較小';
    return this.base('p5-frac-cmp',
      QuestionVisuals.withVisual(
        `比較 ${MathUtils.formatFractionHTML(n1, d1)} 和 ${MathUtils.formatFractionHTML(n2, d2)}，${label}的是？（填分數，如 3/5）`,
        QuestionVisuals.fractionComparePair(n1, d1, n2, d2)
      ),
      { type: 'fraction', num: target.num, den: target.den },
      MathUtils.fractionToString(target.num, target.den),
      '提示：先通分，再比較分子',
      `<h4>📖 解法</h4><p>最小公倍數 = ${lcm}，${MathUtils.fractionToString(n1, d1)} = ${v1}/${lcm}，${MathUtils.fractionToString(n2, d2)} = ${v2}/${lcm}，${label}的是 <strong>${MathUtils.fractionToString(target.num, target.den)}</strong></p>`
    );
  },

  // ── 小五：異分母分數加減 ──
  unlikeFracAdd() {
    const { n1, d1, n2, d2 } = this._unlikeFracPair();
    const lcm = MathUtils.lcm(d1, d2);
    const ans = MathUtils.simplify(n1 * lcm / d1 + n2 * lcm / d2, lcm);
    return this.base('p5-frac-addsub',
      `計算：${MathUtils.formatFractionHTML(n1, d1)} + ${MathUtils.formatFractionHTML(n2, d2)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：先通分，分母變相同後分子相加',
      `<h4>📖 解法</h4><p>通分後相加，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  unlikeFracSub() {
    let { n1, d1, n2, d2 } = this._unlikeFracPair();
    const lcm = MathUtils.lcm(d1, d2);
    let a = n1 * lcm / d1;
    let b = n2 * lcm / d2;
    if (a < b) {
      [n1, n2] = [n2, n1];
      [d1, d2] = [d2, d1];
      [a, b] = [b, a];
    }
    const ans = MathUtils.simplify(a - b, lcm);
    return this.base('p5-frac-addsub',
      `計算：${MathUtils.formatFractionHTML(n1, d1)} - ${MathUtils.formatFractionHTML(n2, d2)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：先通分，分母變相同後分子相減',
      `<h4>📖 解法</h4><p>通分後相減，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  unlikeFracWord() {
    const den1 = MathUtils.randomChoice([3, 4, 5, 6, 8]);
    const den2 = MathUtils.randomChoice([4, 5, 6, 8, 10].filter(d => d !== den1));
    const n1 = MathUtils.randomInt(1, den1 - 1);
    const n2 = MathUtils.randomInt(1, den2 - 1);
    const totalL = MathUtils.lcm(den1, den2) * MathUtils.randomInt(2, 5);
    const used = totalL * (n1 / den1 + n2 / den2);
    const ans = MathUtils.simplify(Math.round(used), totalL);
    const items = MathUtils.shuffle(['果汁', '牛奶', '紅茶', '汽水']);
    return this.base('p5-frac-addsub',
      `一瓶${items[0]}有 ${totalL} 升，上午賣出 ${MathUtils.formatFractionHTML(n1, den1)} 瓶，下午賣出 ${MathUtils.formatFractionHTML(n2, den2)} 瓶，共賣出多少升？`,
      { type: 'decimal', value: MathUtils.roundTo(used, 2) }, String(MathUtils.roundTo(used, 2)),
      '提示：先通分再相加，最後乘總升數',
      `<h4>📖 解法</h4><p>${MathUtils.fractionToString(n1, den1)} + ${MathUtils.fractionToString(n2, den2)} = ${MathUtils.fractionToString(ans.num, ans.den)} 瓶，${totalL} × ${MathUtils.fractionToString(ans.num, ans.den)} = <strong>${MathUtils.roundTo(used, 2)}</strong> 升</p>`
    );
  },

  // ── 小五：分數乘法 ──
  fracMulInt() {
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8, 10]);
    const num = MathUtils.randomInt(1, den - 1);
    const k = MathUtils.randomInt(2, 9);
    const ans = MathUtils.simplify(num * k, den);
    return this.base('p5-frac-mul',
      `計算：${MathUtils.formatFractionHTML(num, den)} × ${k} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den, true),
      '提示：整數乘分數，分子乘整數',
      `<h4>📖 解法</h4><p>${num} × ${k} = ${num * k}，答案 = <strong>${MathUtils.fractionToString(ans.num, ans.den, true)}</strong></p>`
    );
  },

  fracMulFrac() {
    const d1 = MathUtils.randomChoice([2, 3, 4, 5, 6, 8]);
    const d2 = MathUtils.randomChoice([2, 3, 4, 5, 6, 8]);
    const n1 = MathUtils.randomInt(1, d1 - 1);
    const n2 = MathUtils.randomInt(1, d2 - 1);
    const ans = MathUtils.simplify(n1 * n2, d1 * d2);
    return this.base('p5-frac-mul',
      `計算：${MathUtils.formatFractionHTML(n1, d1)} × ${MathUtils.formatFractionHTML(n2, d2)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：分子乘分子，分母乘分母',
      `<h4>📖 解法</h4><p>${n1}×${n2}=${n1 * n2}，${d1}×${d2}=${d1 * d2}，約分後 = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  fracMulWord() {
    const total = MathUtils.randomChoice([12, 16, 18, 20, 24, 30, 36]);
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8, 9, 10].filter(d => total % d === 0));
    const num = MathUtils.randomInt(1, den - 1);
    const ans = total * num / den;
    const items = MathUtils.shuffle(['蘋果', '橙', '糖', '貼紙', '彈珠']);
    const item = items[0];
    const mw = MathUtils.itemClassifier(item);
    return this.base('p5-frac-mul',
      `有 ${total} ${mw}${item}，${MathUtils.formatFractionHTML(num, den)} 是給小明的，小明得到多少${mw}？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：總數 × 分數',
      `<h4>📖 解法</h4><p>${total} × ${num}/${den} = <strong>${ans}</strong> ${mw}</p>`
    );
  },

  // ── 小五：代數 ──
  algebraEval() {
    const templates = [
      () => {
        const a = MathUtils.randomInt(2, 9);
        const ans = 2 * a + MathUtils.randomInt(1, 10);
        const c = ans - 2 * a;
        return { q: `若 a = ${a}，求 2a + ${c} 的值。`, ans, sol: `2 × ${a} + ${c} = ${2 * a} + ${c} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(3, 9);
        const b = MathUtils.randomInt(1, Math.min(8, 3 * a - 1));
        const ans = 3 * a - b;
        return { q: `若 a = ${a}，求 3a - ${b} 的值。`, ans, sol: `3 × ${a} - ${b} = ${3 * a} - ${b} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(2, 8);
        const b = MathUtils.randomInt(2, 7);
        const ans = a * b + MathUtils.randomInt(1, 6);
        const c = ans - a * b;
        return { q: `若 a = ${a}，b = ${b}，求 ab + ${c} 的值。`, ans, sol: `${a} × ${b} + ${c} = ${a * b} + ${c} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(4, 12);
        const ans = a * a;
        return { q: `若 a = ${a}，求 a² 的值。`, ans, sol: `${a} × ${a} = ${ans}` };
      },
      () => {
        const a = MathUtils.randomInt(2, 9);
        const k = MathUtils.randomInt(2, 5);
        const extra = MathUtils.randomInt(1, 8);
        const ans = k * a + extra;
        return { q: `若 a = ${a}，求 ${k}a + ${extra} 的值。`, ans, sol: `${k} × ${a} + ${extra} = ${k * a} + ${extra} = ${ans}` };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-algebra', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：把字母換成數字再計算',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  solveEquation() {
    const templates = [
      () => {
        const x = MathUtils.randomInt(3, 20);
        const a = MathUtils.randomInt(2, 15);
        const b = x + a;
        return { q: `解方程：x + ${a} = ${b}`, ans: x, sol: `x = ${b} - ${a} = ${x}` };
      },
      () => {
        const x = MathUtils.randomInt(3, 15);
        const a = MathUtils.randomInt(2, 10);
        const b = x - a;
        return { q: `解方程：x - ${a} = ${b}`, ans: x, sol: `x = ${b} + ${a} = ${x}` };
      },
      () => {
        const x = MathUtils.randomInt(2, 12);
        const k = MathUtils.randomChoice([2, 3, 4, 5, 6]);
        const b = k * x;
        return { q: `解方程：${k}x = ${b}`, ans: x, sol: `x = ${b} ÷ ${k} = ${x}` };
      },
      () => {
        const x = MathUtils.randomInt(4, 20);
        const k = MathUtils.randomChoice([2, 3, 4, 5]);
        const a = MathUtils.randomInt(1, 10);
        const b = k * x + a;
        return { q: `解方程：${k}x + ${a} = ${b}`, ans: x, sol: `${k}x = ${b - a}，x = ${b - a} ÷ ${k} = ${x}` };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-algebra', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：用逆運算，加變減、乘變除',
      `<h4>📖 解法</h4><p>${t.sol}，x = <strong>${t.ans}</strong></p>`
    );
  },

  equationWord() {
    const templates = [
      () => {
        const x = MathUtils.randomInt(5, 20);
        const a = MathUtils.randomInt(3, 12);
        const total = x + a;
        return {
          q: `小明有 x 元，媽媽給他 ${a} 元後共有 ${total} 元。x = ?`,
          ans: x,
          sol: `x + ${a} = ${total}，x = ${total} - ${a} = ${x}`
        };
      },
      () => {
        const x = MathUtils.randomInt(4, 15);
        const k = MathUtils.randomChoice([2, 3, 4, 5]);
        const total = k * x;
        return {
          q: `每盒有 x 粒糖，${k} 盒共有 ${total} 粒。x = ?`,
          ans: x,
          sol: `${k}x = ${total}，x = ${total} ÷ ${k} = ${x}`
        };
      },
      () => {
        const x = MathUtils.randomInt(8, 25);
        const used = MathUtils.randomInt(3, x - 2);
        const left = x - used;
        return {
          q: `一袋有 x 個橙，用去 ${used} 個後剩 ${left} 個。x = ?`,
          ans: x,
          sol: `x - ${used} = ${left}，x = ${left} + ${used} = ${x}`
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-algebra', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：先列出方程，再求解',
      `<h4>📖 解法</h4><p>${t.sol}，x = <strong>${t.ans}</strong></p>`
    );
  },

  // ── 小五：圓形 ──
  circleRadius() {
    const kind = Math.random() > 0.5;
    const r = MathUtils.randomInt(3, 20);
    const d = r * 2;
    if (kind) {
      return this.base('p5-circle',
        QuestionVisuals.withVisual(
          `一個圓的直徑是 ${d} cm，半徑是多少 cm？`,
          QuestionVisuals.circle(r, 'cm', { hideRadius: true, diameter: d })
        ),
        { type: 'decimal', value: r }, String(r),
        '提示：半徑 = 直徑 ÷ 2',
        `<h4>📖 解法</h4><p>${d} ÷ 2 = <strong>${r}</strong> cm</p>`
      );
    }
    return this.base('p5-circle',
      QuestionVisuals.withVisual(
        `一個圓的半徑是 ${r} cm，直徑是多少 cm？`,
        QuestionVisuals.circle(r)
      ),
      { type: 'decimal', value: d }, String(d),
      '提示：直徑 = 半徑 × 2',
      `<h4>📖 解法</h4><p>${r} × 2 = <strong>${d}</strong> cm</p>`
    );
  },

  circleParts() {
    const variants = [
      () => {
        const r = MathUtils.randomInt(4, 15);
        return {
          q: `一個圓的半徑是 ${r} cm，直徑是多少 cm？`,
          ans: r * 2,
          sol: `直徑 = 半徑 × 2 = ${r} × 2 = ${r * 2}`,
          visual: () => QuestionVisuals.circle(r)
        };
      },
      () => {
        const d = MathUtils.randomInt(8, 30);
        return {
          q: `一條直徑把圓分成兩部分，每部分是一個？（填半徑數量：一條直徑等於幾條半徑？）`,
          ans: 2,
          sol: '一條直徑的長度等於兩條半徑',
          visual: () => QuestionVisuals.circle(d / 2)
        };
      },
      () => {
        const r = MathUtils.randomInt(5, 12);
        return {
          q: `圓心到圓周一點的距離是 ${r} cm，這個圓的直徑是多少 cm？`,
          ans: r * 2,
          sol: `圓心到圓周是半徑 ${r} cm，直徑 = ${r * 2} cm`,
          visual: () => QuestionVisuals.circle(r)
        };
      },
      () => {
        const d = MathUtils.randomInt(10, 24);
        const r = d / 2;
        return {
          q: `一個圓的直徑是 ${d} cm，半徑是多少 cm？`,
          ans: r,
          sol: `半徑 = 直徑 ÷ 2 = ${d} ÷ 2 = ${r}`,
          visual: () => QuestionVisuals.circle(r, 'cm', { hideRadius: true, diameter: d })
        };
      }
    ];
    const v = MathUtils.randomChoice(variants)();
    return this.base('p5-circle',
      QuestionVisuals.withVisual(v.q, v.visual()),
      { type: 'decimal', value: v.ans }, String(v.ans),
      '提示：半徑是圓心到圓周的距離，直徑是半徑的兩倍',
      `<h4>📖 解法</h4><p>${v.sol}，答案 = <strong>${v.ans}</strong></p>`
    );
  },

  // ── 小五：小數乘法 ──
  decMulInt() {
    const a = MathUtils.roundTo(MathUtils.randomInt(11, 99) / 10, 1);
    const b = MathUtils.randomInt(2, 9);
    const ans = MathUtils.roundTo(a * b, 2);
    return this.base('p5-decimal-mul',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先當整數乘，再點小數點',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`
    );
  },

  decMulDec() {
    const a = MathUtils.roundTo(MathUtils.randomInt(11, 49) / 10, 1);
    const b = MathUtils.roundTo(MathUtils.randomInt(11, 29) / 10, 1);
    const ans = MathUtils.roundTo(a * b, 2);
    return this.base('p5-decimal-mul',
      `計算：${a} × ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：兩個小數位數相加決定積的小數位',
      `<h4>📖 解法</h4><p>${a} × ${b} = <strong>${ans}</strong></p>`
    );
  },

  decMulWord() {
    const price = MathUtils.roundTo(MathUtils.randomInt(25, 150) / 10, 1);
    const qty = MathUtils.randomInt(3, 12);
    const ans = MathUtils.roundTo(price * qty, 2);
    const name = MathUtils.randomChoice(['鉛筆', '橡皮', '筆記本', '尺', '原子筆']);
    const mw = MathUtils.itemClassifier(name);
    return this.base('p5-decimal-mul',
      `每${mw}${name} ${price} 元，買 ${qty} ${mw}要多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：單價 × 數量',
      `<h4>📖 解法</h4><p>${price} × ${qty} = <strong>${ans}</strong> 元</p>`
    );
  },

  // ── 小五：分數除法 ──
  fracDivInt() {
    const den = MathUtils.randomChoice([2, 3, 4, 5, 6, 8, 10]);
    const num = MathUtils.randomInt(1, den - 1);
    const k = MathUtils.randomChoice([2, 3, 4, 5, 6]);
    const final = MathUtils.simplify(num, den * k);
    return this.base('p5-frac-div',
      `計算：${MathUtils.formatFractionHTML(num, den)} ÷ ${k} = ?`,
      { type: 'fraction', num: final.num, den: final.den },
      MathUtils.fractionToString(final.num, final.den),
      '提示：除以整數 = 分母乘該整數',
      `<h4>📖 解法</h4><p>${MathUtils.formatFractionHTML(num, den)} ÷ ${k} = ${MathUtils.formatFractionHTML(num, den * k)} = <strong>${MathUtils.fractionToString(final.num, final.den)}</strong></p>`
    );
  },

  fracDivFrac() {
    const d1 = MathUtils.randomChoice([2, 3, 4, 5, 6]);
    const d2 = MathUtils.randomChoice([2, 3, 4, 5, 6]);
    const n1 = MathUtils.randomInt(1, d1 - 1);
    const n2 = MathUtils.randomInt(1, d2 - 1);
    const ans = MathUtils.simplify(n1 * d2, d1 * n2);
    return this.base('p5-frac-div',
      `計算：${MathUtils.formatFractionHTML(n1, d1)} ÷ ${MathUtils.formatFractionHTML(n2, d2)} = ?`,
      { type: 'fraction', num: ans.num, den: ans.den },
      MathUtils.fractionToString(ans.num, ans.den),
      '提示：除以一個分數 = 乘它的倒數',
      `<h4>📖 解法</h4><p>${MathUtils.formatFractionHTML(n1, d1)} × ${MathUtils.formatFractionHTML(d2, n2)} = <strong>${MathUtils.fractionToString(ans.num, ans.den)}</strong></p>`
    );
  },

  fracMixedOps() {
    const templates = [
      () => {
        const den = MathUtils.randomChoice([4, 6, 8, 10]);
        const n = MathUtils.randomInt(2, den - 1);
        const k = MathUtils.randomChoice([2, 3, 4]);
        const ans = MathUtils.simplify(n, den);
        return {
          q: `計算：${MathUtils.formatFractionHTML(n, den)} × ${k} ÷ ${k} = ?`,
          ans,
          sol: `先乘後除，${MathUtils.fractionToString(n, den)} × ${k} ÷ ${k} = ${MathUtils.fractionToString(n, den)}`
        };
      },
      () => {
        const d1 = MathUtils.randomChoice([2, 3, 4, 5, 6]);
        const d2 = MathUtils.randomChoice([2, 3, 4, 5, 6]);
        const n1 = MathUtils.randomInt(1, d1 - 1);
        const n2 = MathUtils.randomInt(1, d2 - 1);
        const ans = MathUtils.simplify(n1 * d2, d1 * n2);
        return {
          q: `計算：${MathUtils.formatFractionHTML(n1, d1)} ÷ ${MathUtils.formatFractionHTML(n2, d2)} = ?`,
          ans,
          sol: `乘倒數 ${MathUtils.formatFractionHTML(d2, n2)}`
        };
      },
      () => {
        const den = MathUtils.randomChoice([3, 4, 5, 6]);
        const num = MathUtils.randomInt(1, den - 1);
        const k = 2;
        const mul = MathUtils.simplify(num * k, den);
        const ans = MathUtils.simplify(mul.num, mul.den * 2);
        return {
          q: `計算：${MathUtils.formatFractionHTML(num, den)} × ${k} ÷ 2 = ?`,
          ans,
          sol: `逐步計算乘除`
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-frac-div', t.q,
      { type: 'fraction', num: t.ans.num, den: t.ans.den },
      MathUtils.fractionToString(t.ans.num, t.ans.den),
      '提示：由左至右計算，除分數要乘倒數',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${MathUtils.fractionToString(t.ans.num, t.ans.den)}</strong></p>`
    );
  },

  // ── 小五：體積 ──
  volumeCalc() {
    const l = MathUtils.randomInt(4, 15);
    const w = MathUtils.randomInt(3, 12);
    const h = MathUtils.randomInt(3, 10);
    const ans = l * w * h;
    return this.base('p5-volume',
      QuestionVisuals.withVisual(
        `一個長方體，長 ${l} cm，闊 ${w} cm，高 ${h} cm，體積是多少 cm³？`,
        QuestionVisuals.cuboid(l, w, h, 'cm', { hideLabels: true })
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：體積 = 長 × 闊 × 高',
      `<h4>📖 解法</h4><p>${l} × ${w} × ${h} = <strong>${ans}</strong> cm³</p>`
    );
  },

  volumeWord() {
    const templates = [
      () => {
        const l = MathUtils.randomInt(5, 12);
        const w = MathUtils.randomInt(4, 10);
        const h = MathUtils.randomInt(3, 8);
        const ans = l * w * h;
        return {
          q: `一個紙箱長 ${l} cm、闊 ${w} cm、高 ${h} cm，體積是多少 cm³？`,
          ans,
          sol: `${l} × ${w} × ${h} = ${ans}`,
          visual: () => QuestionVisuals.cuboid(l, w, h, 'cm', { hideLabels: true })
        };
      },
      () => {
        const edge = MathUtils.randomInt(4, 10);
        const ans = edge * edge * edge;
        return {
          q: `一個正方體邊長 ${edge} cm，體積是多少 cm³？`,
          ans,
          sol: `${edge} × ${edge} × ${edge} = ${ans}`,
          visual: () => QuestionVisuals.cuboid(edge, edge, edge, 'cm', { hideLabels: true })
        };
      },
      () => {
        const vol = MathUtils.randomInt(60, 240);
        const l = MathUtils.randomChoice([5, 6, 8, 10, 12].filter(x => vol % x === 0));
        const w = MathUtils.randomChoice([3, 4, 5, 6].filter(x => (vol / l) % x === 0));
        const h = vol / l / w;
        return {
          q: `一個長方體體積是 ${vol} cm³，長 ${l} cm，闊 ${w} cm，高是多少 cm？`,
          ans: h,
          sol: `高 = ${vol} ÷ ${l} ÷ ${w} = ${h}`,
          visual: () => QuestionVisuals.cuboid(l, w, h, 'cm', { hideLabels: true })
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p5-volume',
      QuestionVisuals.withVisual(t.q, t.visual()),
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：長方體體積 = 長 × 闊 × 高',
      `<h4>📖 解法</h4><p>${t.sol} cm³，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  // ── 小六：小數除法 ──
  decDivInt() {
    const b = MathUtils.randomChoice([2, 3, 4, 5, 6, 8]);
    const ans = MathUtils.roundTo(MathUtils.randomInt(11, 99) / 10, 1);
    const a = MathUtils.roundTo(ans * b, 2);
    return this.base('p6-decimal-div',
      `計算：${a} ÷ ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：可先把被除數變成整數再除',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = <strong>${ans}</strong></p>`
    );
  },

  decDivDec() {
    const b = MathUtils.roundTo(MathUtils.randomInt(11, 25) / 10, 1);
    const ans = MathUtils.roundTo(MathUtils.randomInt(11, 49) / 10, 1);
    const a = MathUtils.roundTo(ans * b, 2);
    return this.base('p6-decimal-div',
      `計算：${a} ÷ ${b} = ?`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：除數變整數，被除數同乘相同倍數',
      `<h4>📖 解法</h4><p>${a} ÷ ${b} = <strong>${ans}</strong></p>`
    );
  },

  decDivWord() {
    const total = MathUtils.roundTo(MathUtils.randomInt(50, 200) / 10, 1);
    const qty = MathUtils.randomInt(3, 8);
    const ans = MathUtils.roundTo(total / qty, 2);
    const items = MathUtils.shuffle(['果汁', '牛奶', '紅茶', '湯']);
    return this.base('p6-decimal-div',
      `${total} 升${items[0]}平均分給 ${qty} 人，每人分得多少升？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：總量 ÷ 人數',
      `<h4>📖 解法</h4><p>${total} ÷ ${qty} = <strong>${ans}</strong> 升</p>`
    );
  },

  // ── 小六：小數四則混合 ──
  decFourOps() {
    const templates = [
      () => {
        const a = MathUtils.roundTo(MathUtils.randomInt(20, 60) / 10, 1);
        const b = MathUtils.randomInt(2, 5);
        const c = MathUtils.roundTo(MathUtils.randomInt(5, 30) / 10, 1);
        const ans = MathUtils.roundTo(a + b * c, 2);
        return { q: `計算：${a} + ${b} × ${c} = ?`, ans, sol: `${b} × ${c} = ${MathUtils.roundTo(b * c, 2)}，${a} + ${MathUtils.roundTo(b * c, 2)} = ${ans}` };
      },
      () => {
        const b = MathUtils.randomInt(2, 6);
        const c = MathUtils.roundTo(MathUtils.randomInt(5, 25) / 10, 1);
        const product = MathUtils.roundTo(b * c, 2);
        const a = MathUtils.roundTo(MathUtils.randomInt(Math.max(Math.ceil(product * 10), 30), 80) / 10, 1);
        const ans = MathUtils.roundTo(a - product, 2);
        return { q: `計算：${a} - ${b} × ${c} = ?`, ans, sol: `先乘後減：${b} × ${c} = ${product}，${a} - ${product} = ${ans}` };
      },
      () => {
        const a = MathUtils.roundTo(MathUtils.randomInt(20, 50) / 10, 1);
        const b = MathUtils.roundTo(MathUtils.randomInt(11, 29) / 10, 1);
        const c = MathUtils.randomInt(2, 4);
        const ans = MathUtils.roundTo((a + b) * c, 2);
        return { q: `計算：(${a} + ${b}) × ${c} = ?`, ans, sol: `括號內 = ${MathUtils.roundTo(a + b, 2)}，再乘 ${c}` };
      },
      () => {
        const a = MathUtils.roundTo(MathUtils.randomInt(40, 90) / 10, 1);
        const b = MathUtils.randomInt(2, 5);
        const ans = MathUtils.roundTo(a / b, 2);
        return { q: `計算：${a} ÷ ${b} = ?`, ans, sol: `${a} ÷ ${b} = ${ans}` };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-decimal-mixed', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：先乘除，後加減；有括號先計括號',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  decFourOpsWord() {
    const price = MathUtils.roundTo(MathUtils.randomInt(25, 80) / 10, 1);
    const qty = MathUtils.randomInt(3, 7);
    const discount = MathUtils.roundTo(MathUtils.randomInt(5, 20) / 10, 1);
    const ans = MathUtils.roundTo(price * qty - discount, 2);
    return this.base('p6-decimal-mixed',
      `每本書 ${price} 元，買 ${qty} 本，用優惠券減 ${discount} 元，要付多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：先算總價，再減優惠',
      `<h4>📖 解法</h4><p>${price} × ${qty} = ${MathUtils.roundTo(price * qty, 2)}，${MathUtils.roundTo(price * qty, 2)} - ${discount} = <strong>${ans}</strong> 元</p>`
    );
  },

  // ── 小六：分數與小數 ──
  fracToDec() {
    const pairs = [
      [1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [1, 5, 0.2], [2, 5, 0.4],
      [3, 5, 0.6], [1, 8, 0.125], [3, 8, 0.375], [1, 10, 0.1], [3, 10, 0.3],
      [7, 10, 0.7], [1, 20, 0.05], [3, 20, 0.15], [1, 25, 0.04]
    ];
    const [n, d, val] = MathUtils.randomChoice(pairs);
    return this.base('p6-frac-decimal',
      `把 ${MathUtils.formatFractionHTML(n, d)} 化為小數`,
      { type: 'decimal', value: val }, String(val),
      '提示：分子 ÷ 分母',
      `<h4>📖 解法</h4><p>${n} ÷ ${d} = <strong>${val}</strong></p>`
    );
  },

  decToFrac() {
    const pairs = [
      [0.5, 1, 2], [0.25, 1, 4], [0.75, 3, 4], [0.2, 1, 5], [0.4, 2, 5],
      [0.6, 3, 5], [0.125, 1, 8], [0.1, 1, 10], [0.3, 3, 10], [0.05, 1, 20]
    ];
    const [val, n, d] = MathUtils.randomChoice(pairs);
    const s = MathUtils.simplify(n, d);
    return this.base('p6-frac-decimal',
      `把 ${val} 化為最簡分數`,
      { type: 'fraction', num: s.num, den: s.den },
      MathUtils.fractionToString(s.num, s.den),
      '提示：讀小數位，寫成分母為 10、100 等的分數再約分',
      `<h4>📖 解法</h4><p>${val} = <strong>${MathUtils.fractionToString(s.num, s.den)}</strong></p>`
    );
  },

  fracDecCmp() {
    const pairs = [
      { frac: [1, 4], dec: 0.3, bigger: 'frac' },
      { frac: [2, 5], dec: 0.35, bigger: 'frac' },
      { frac: [3, 5], dec: 0.55, bigger: 'frac' },
      { frac: [1, 8], dec: 0.15, bigger: 'dec' },
      { frac: [7, 10], dec: 0.65, bigger: 'frac' }
    ];
    const p = MathUtils.randomChoice(pairs);
    const fracVal = p.frac[0] / p.frac[1];
    const biggerVal = p.bigger === 'frac' ? fracVal : p.dec;
    const askFrac = p.bigger === 'frac';
    return this.base('p6-frac-decimal',
      `比較 ${MathUtils.formatFractionHTML(p.frac[0], p.frac[1])} 和 ${p.dec}，較大的是？（填較大的數）`,
      { type: 'decimal', value: biggerVal }, String(biggerVal),
      '提示：把分數化成小數再比較',
      `<h4>📖 解法</h4><p>${MathUtils.fractionToString(p.frac[0], p.frac[1])} = ${fracVal}，較大的是 <strong>${biggerVal}</strong></p>`
    );
  },

  // ── 小六：平均數 ──
  averageCalc() {
    const count = MathUtils.randomChoice([3, 4, 5, 6]);
    const nums = Array.from({ length: count }, () => MathUtils.randomInt(10, 80));
    const sum = nums.reduce((a, b) => a + b, 0);
    const ans = MathUtils.roundTo(sum / count, 1);
    return this.base('p6-average',
      `求以下數字的平均數：${nums.join('、')}`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：平均數 = 總和 ÷ 個數',
      `<h4>📖 解法</h4><p>${nums.join(' + ')} = ${sum}，${sum} ÷ ${count} = <strong>${ans}</strong></p>`
    );
  },

  averageWord() {
    const templates = [
      () => {
        const scores = Array.from({ length: 4 }, () => MathUtils.randomInt(60, 95));
        const sum = scores.reduce((a, b) => a + b, 0);
        const ans = MathUtils.roundTo(sum / 4, 1);
        return {
          q: `小光四次測驗分數是 ${scores.join('、')} 分，平均分是多少？`,
          ans,
          sol: `總分 ${sum}，${sum} ÷ 4 = ${ans}`
        };
      },
      () => {
        let avg; let total; let known; let sumKnown; let last;
        do {
          avg = MathUtils.randomInt(12, 20);
          total = avg * 5;
          known = Array.from({ length: 4 }, () => MathUtils.randomInt(8, 20));
          sumKnown = known.reduce((a, b) => a + b, 0);
          last = total - sumKnown;
        } while (last < 1 || last > 30);
        return {
          q: `小明前 4 天共讀 ${sumKnown} 頁，5 天平均每天讀 ${avg} 頁，第 5 天讀了多少頁？`,
          ans: last,
          sol: `5 天共 ${total} 頁，第 5 天 = ${total} - ${sumKnown} = ${last}`
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-average', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：平均數 = 總和 ÷ 個數',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  },

  // ── 小六：百分數 ──
  percentRead() {
    const val = MathUtils.randomChoice([5, 8, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90]);
    const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const tens = Math.floor(val / 10);
    const ones = val % 10;
    let cn = '';
    if (tens) cn += (tens === 1 ? '十' : chars[tens] + '十');
    if (ones) cn += chars[ones];
    if (!cn) cn = '零';
    return this.base('p6-percent',
      `「百分之${cn}」寫成百分數是？（只填數字，如 25）`,
      { type: 'decimal', value: val }, String(val),
      '提示：百分之幾 = 幾%',
      `<h4>📖 解法</h4><p>百分之${cn} = <strong>${val}%</strong>，填 <strong>${val}</strong></p>`
    );
  },

  fracToPercent() {
    const pairs = [[1, 4, 25], [1, 2, 50], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [1, 10, 10], [3, 10, 30], [7, 10, 70], [1, 20, 5]];
    const [n, d, pct] = MathUtils.randomChoice(pairs);
    return this.base('p6-percent',
      `把 ${MathUtils.formatFractionHTML(n, d)} 化為百分數（只填數字）`,
      { type: 'decimal', value: pct }, String(pct),
      '提示：先化小數，再乘 100',
      `<h4>📖 解法</h4><p>${n} ÷ ${d} = ${n / d}，即 <strong>${pct}%</strong></p>`
    );
  },

  decToPercent() {
    const pairs = [[0.25, 25], [0.5, 50], [0.75, 75], [0.2, 20], [0.4, 40], [0.6, 60], [0.1, 10], [0.05, 5], [0.35, 35]];
    const [val, pct] = MathUtils.randomChoice(pairs);
    return this.base('p6-percent',
      `把 ${val} 化為百分數（只填數字）`,
      { type: 'decimal', value: pct }, String(pct),
      '提示：小數乘 100 就是百分數',
      `<h4>📖 解法</h4><p>${val} × 100 = <strong>${pct}%</strong></p>`
    );
  },

  // ── 小六：百分數應用 ──
  percentOf() {
    const pct = MathUtils.randomChoice([10, 20, 25, 30, 40, 50, 60, 75]);
    const base = MathUtils.randomChoice([20, 40, 50, 60, 80, 100, 120, 200].filter(n => (n * pct) % 100 === 0));
    const ans = base * pct / 100;
    return this.base('p6-percent-app',
      `${base} 的 ${pct}% 是多少？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：把百分數化成分數或小數再乘',
      `<h4>📖 解法</h4><p>${base} × ${pct}% = ${base} × ${pct / 100} = <strong>${ans}</strong></p>`
    );
  },

  percentIncDec() {
    const kind = Math.random() > 0.5;
    const original = MathUtils.randomInt(50, 200);
    const pct = MathUtils.randomChoice([10, 20, 25, 50]);
    const change = Math.round(original * pct / 100);
    const ans = kind ? original + change : original - change;
    const label = kind ? '加價' : '減價';
    return this.base('p6-percent-app',
      `一件商品原價 ${original} 元，${label} ${pct}% 後售價多少元？`,
      { type: 'decimal', value: ans }, String(ans),
      `提示：先算${pct}% 是多少，再${kind ? '加' : '減'}`,
      `<h4>📖 解法</h4><p>${pct}% = ${change} 元，${original} ${kind ? '+' : '-'} ${change} = <strong>${ans}</strong> 元</p>`
    );
  },

  // ── 小六：圓周 ──
  circumference() {
    const use227 = Math.random() > 0.5;
    if (use227) {
      const r = MathUtils.randomChoice([7, 14, 21, 28, 35]);
      const ans = 2 * 22 / 7 * r;
      return this.base('p6-circumference',
        QuestionVisuals.withVisual(
          `一個圓的半徑是 ${r} cm，圓周是多少 cm？（π 取 22/7）`,
          QuestionVisuals.circle(r)
        ),
        { type: 'decimal', value: ans }, String(ans),
        '提示：圓周 = 2 × π × 半徑',
        `<h4>📖 解法</h4><p>2 × 22/7 × ${r} = <strong>${ans}</strong> cm</p>`
      );
    }
    const r = MathUtils.randomInt(3, 15);
    const ans = MathUtils.roundTo(2 * 3.14 * r, 2);
    return this.base('p6-circumference',
      QuestionVisuals.withVisual(
        `一個圓的半徑是 ${r} cm，圓周是多少 cm？（π 取 3.14，答案保留兩位小數）`,
        QuestionVisuals.circle(r)
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：圓周 = 2 × π × 半徑 或 π × 直徑',
      `<h4>📖 解法</h4><p>2 × 3.14 × ${r} = <strong>${ans}</strong> cm</p>`
    );
  },

  circumferenceWord() {
    const r = MathUtils.randomInt(5, 12);
    const c = MathUtils.roundTo(2 * 3.14 * r, 2);
    const rounds = MathUtils.randomInt(2, 5);
    const ans = MathUtils.roundTo(c * rounds, 2);
    return this.base('p6-circumference',
      QuestionVisuals.withVisual(
        `一個圓形花壇半徑 ${r} m，圓周約 ${c} m（π=3.14）。小明繞花壇走 ${rounds} 圈，共走多少 m？`,
        QuestionVisuals.circle(r, 'm')
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：一圈的距離 = 圓周',
      `<h4>📖 解法</h4><p>${c} × ${rounds} = <strong>${ans}</strong> m</p>`
    );
  },

  // ── 小六：圓面積 ──
  circleArea() {
    const r = MathUtils.randomInt(3, 12);
    const ans = MathUtils.roundTo(3.14 * r * r, 2);
    return this.base('p6-circle-area',
      QuestionVisuals.withVisual(
        `一個圓的半徑是 ${r} cm，面積是多少 cm²？（π 取 3.14，保留兩位小數）`,
        QuestionVisuals.circle(r)
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：圓面積 = π × 半徑²',
      `<h4>📖 解法</h4><p>3.14 × ${r}² = 3.14 × ${r * r} = <strong>${ans}</strong> cm²</p>`
    );
  },

  circleAreaWord() {
    const r = MathUtils.randomInt(4, 10);
    const area = MathUtils.roundTo(3.14 * r * r, 2);
    const price = MathUtils.randomInt(2, 8);
    const ans = MathUtils.roundTo(area * price, 2);
    return this.base('p6-circle-area',
      QuestionVisuals.withVisual(
        `一個圓形花圃半徑 ${r} m，面積約 ${area} m²（π=3.14）。每平方米種植費 ${price} 元，共需多少元？`,
        QuestionVisuals.circle(r, 'm')
      ),
      { type: 'decimal', value: ans }, String(ans),
      '提示：總費用 = 面積 × 每平方米費用',
      `<h4>📖 解法</h4><p>${area} × ${price} = <strong>${ans}</strong> 元</p>`
    );
  },

  // ── 小六：角度 ──
  angleMeasure() {
    const QV = QuestionVisuals;
    const templates = [
      () => {
        const a = MathUtils.randomInt(20, 70);
        const ans = 90 - a;
        return { q: `一個直角三角形，其中一個銳角是 ${a}°，另一個銳角是多少度？`, ans, sol: `直角三角形兩銳角互餘：90° - ${a}° = ${ans}°`, visual: () => QV.triangleAngles(a, null) };
      },
      () => {
        const a = MathUtils.randomInt(100, 150);
        const ans = 180 - a;
        return { q: `一條直線上兩角互補，其中一個角是 ${a}°，另一個角是多少度？`, ans, sol: `平角 = 180°，${180}° - ${a}° = ${ans}°`, visual: () => QV.angleDiagram(a) };
      },
      () => {
        const a = MathUtils.randomInt(30, 60);
        const b = MathUtils.randomInt(30, 60);
        const ans = 180 - a - b;
        return { q: `三角形其中兩個角分別是 ${a}° 和 ${b}°，第三個角是多少度？`, ans, sol: `三角形內角和 180°`, visual: () => QV.triangleAngles(a, b) };
      },
      () => {
        const types = [
          { name: '直角', val: 90 },
          { name: '平角', val: 180 },
          { name: '周角', val: 360 }
        ];
        const t = MathUtils.randomChoice(types);
        return { q: `一個${t.name}是多少度？`, ans: t.val, sol: `${t.name} = ${t.val}°`, visual: () => t.val === 90 ? QV.angleDiagram(90, { rightAngle: true, hideLabel: true }) : t.val === 180 ? QV.angleDiagram(0, { mode: 'straight' }) : QV.angleDiagram(0, { mode: 'full' }) };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-angles-deg',
      QV.withVisual(t.q, t.visual()),
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：直角 90°、平角 180°、三角形內角和 180°',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong>°</p>`
    );
  },

  angleSum() {
    const QV = QuestionVisuals;
    const templates = [
      () => {
        const a = MathUtils.randomInt(50, 100);
        const b = MathUtils.randomInt(40, 90);
        const c = 180 - a - b;
        return { q: `三角形三個角中，兩個角是 ${a}° 和 ${b}°，第三個角是多少度？`, ans: c, sol: `180° - ${a}° - ${b}° = ${c}°`, visual: () => QV.triangleAngles(a, b) };
      },
      () => {
        const a = MathUtils.randomInt(70, 110);
        const b = MathUtils.randomInt(70, 110);
        const c = MathUtils.randomInt(70, 110);
        const d = 360 - a - b - c;
        return { q: `四邊形三個角是 ${a}°、${b}° 和 ${c}°，第四個角是多少度？`, ans: d, sol: `四邊形內角和 360°`, visual: () => QV.quadShape('長方形') };
      },
      () => {
        const known = MathUtils.randomInt(30, 80);
        const ans = 180 - known;
        return { q: `兩條平行線被橫線所截，同側內角一個是 ${known}°，另一個是多少度？`, ans, sol: `同側內角互補，180° - ${known}° = ${ans}°`, visual: () => QV.angleDiagram(known) };
      },
      () => {
        const vertex = MathUtils.randomChoice([40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100]);
        const ans = (180 - vertex) / 2;
        return { q: `等腰三角形頂角是 ${vertex}°，每個底角是多少度？`, ans, sol: `底角 = (180° - ${vertex}°) ÷ 2 = ${ans}°`, visual: () => QV.triangleAngles(vertex, null, { mode: 'vertex' }) };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-angles-deg',
      QV.withVisual(t.q, t.visual()),
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：三角形內角和 180°，四邊形內角和 360°',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong>°</p>`
    );
  },

  // ── 小六：速率 ──
  speedCalc() {
    const templates = [
      () => {
        const speed = MathUtils.randomInt(40, 80);
        const time = MathUtils.randomInt(2, 5);
        const ans = speed * time;
        return { q: `汽車以每小時 ${speed} km 的速度行駛 ${time} 小時，行駛了多少 km？`, ans, sol: `距離 = 速度 × 時間 = ${speed} × ${time}` };
      },
      () => {
        const time = MathUtils.randomChoice([2, 3, 4, 5]);
        const speed = MathUtils.randomInt(20, 60);
        const dist = speed * time;
        const ans = speed;
        return { q: `小明行了 ${dist} km，用了 ${time} 小時，平均速度是多少 km/h？`, ans, sol: `速度 = 距離 ÷ 時間 = ${dist} ÷ ${time}` };
      },
      () => {
        const speed = MathUtils.randomInt(5, 12);
        const dist = speed * MathUtils.randomInt(2, 6);
        const ans = dist / speed;
        return { q: `步行速度是每小時 ${speed} km，要走 ${dist} km 需多少小時？`, ans, sol: `時間 = 距離 ÷ 速度 = ${dist} ÷ ${speed}` };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-speed', t.q,
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：距離 = 速度 × 時間',
      `<h4>📖 解法</h4><p>${t.sol} = <strong>${t.ans}</strong></p>`
    );
  },

  speedWord() {
    const speed = MathUtils.randomInt(50, 90);
    const t1 = MathUtils.randomInt(1, 3);
    const t2 = MathUtils.randomInt(1, 3);
    const ans = speed * (t1 + t2);
    return this.base('p6-speed',
      `火車以每小時 ${speed} km 行駛，先開 ${t1} 小時，再開 ${t2} 小時，共行駛多少 km？`,
      { type: 'decimal', value: ans }, String(ans),
      '提示：總距離 = 速度 × 總時間',
      `<h4>📖 解法</h4><p>總時間 = ${t1 + t2} 小時，${speed} × ${t1 + t2} = <strong>${ans}</strong> km</p>`
    );
  },

  // ── 小六：圓形圖 ──
  pieChartRead() {
    const QV = QuestionVisuals;
    const items = MathUtils.shuffle(['中文', '英文', '數學', '常識', '體育', '音樂', '視藝']).slice(0, 4);
    const data = {};
    items.forEach(name => { data[name] = MathUtils.randomInt(2, 12) * 5; });
    const names = Object.keys(data);
    const chart = QV.pieChart(data);
    const types = [
      () => {
        const a = names[0];
        const b = names[1];
        const ans = data[a] + data[b];
        return { q: `看圖：圓形圖顯示各班人數。${a}和${b}共多少人？`, ans };
      },
      () => {
        const a = names[0];
        const b = names[1];
        const ans = Math.abs(data[a] - data[b]);
        return { q: `看圖：圓形圖顯示各班人數。${a}和${b}相差多少人？`, ans };
      },
      () => {
        const ans = Object.values(data).reduce((s, n) => s + n, 0);
        return { q: '看圖：圓形圖顯示各班人數。共有多少人？', ans };
      },
      () => {
        const item = MathUtils.randomChoice(names);
        const price = MathUtils.randomChoice([10, 20, 50]);
        const ans = data[item] * price;
        return { q: `看圖：圓形圖顯示各班人數。${item}班每人捐款 ${price} 元，${item}班共捐多少元？`, ans };
      }
    ];
    const t = MathUtils.randomChoice(types)();
    return this.base('p6-pie-chart',
      QV.withVisual(t.q, chart),
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：仔細閱讀圓形圖各扇形代表的數量',
      `<h4>📖 解法</h4><p>答案 = <strong>${t.ans}</strong></p>`
    );
  },

  pieChartPercent() {
    const QV = QuestionVisuals;
    const total = MathUtils.randomChoice([100, 200, 360, 400, 500]);
    const pct = MathUtils.randomChoice([10, 15, 20, 25, 30, 40, 50]);
    const count = total * pct / 100;
    const items = MathUtils.shuffle(['足球', '籃球', '游泳', '跑步', '乒乓球', '羽毛球']);
    const templates = [
      () => ({
        q: `全校 ${total} 人，圓形圖顯示喜歡${items[0]}的佔 ${pct}%，有多少人喜歡${items[0]}？`,
        ans: count,
        sol: `${total} × ${pct}% = ${count}`,
        visual: () => QV.pieChartPercent(items[0], pct)
      }),
      () => ({
        q: `圓形圖中${items[1]}佔 ${pct}%，代表 ${count} 人，全校共有多少人？`,
        ans: total,
        sol: `${count} ÷ ${pct}% = ${total}`,
        visual: () => QV.pieChartPercent(items[1], pct)
      }),
      () => {
        const other = 100 - pct;
        return {
          q: `圓形圖顯示${items[2]}佔 ${pct}%，其餘運動佔百分之幾？（只填數字）`,
          ans: other,
          sol: `100% - ${pct}% = ${other}%`,
          visual: () => QV.pieChartPercent(items[2], pct, { hideOther: true })
        };
      }
    ];
    const t = MathUtils.randomChoice(templates)();
    return this.base('p6-pie-chart',
      QV.withVisual(t.q, t.visual()),
      { type: 'decimal', value: t.ans }, String(t.ans),
      '提示：百分數 × 總數 = 部分數量',
      `<h4>📖 解法</h4><p>${t.sol}，答案 = <strong>${t.ans}</strong></p>`
    );
  }
};
