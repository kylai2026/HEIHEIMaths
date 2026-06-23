/* 根據心光數學電子書（小一至小六）課題設計 */
const GRADE_LABELS = {
  P1: '小一', P2: '小二', P3: '小三', P4: '小四', P5: '小五', P6: '小六'
};

const GRADE_ORDER = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const GRADE_ICONS = {
  P1: '1️⃣', P2: '2️⃣', P3: '3️⃣', P4: '4️⃣', P5: '5️⃣', P6: '6️⃣'
};

function getSectionsByGrade(grade) {
  return CURRICULUM_SECTIONS.filter(sec => sec.grade === grade);
}

function getTopicsByGrade(grade) {
  return TOPICS.filter(t => t.grade === grade);
}

function countTopicsByGrade(grade) {
  return getTopicsByGrade(grade).length;
}

const CURRICULUM_SECTIONS = [
  {
    id: 'p1-num',
    name: '小一 · 數與計算',
    icon: '1️⃣',
    grade: 'P1',
    topics: ['p1-numbers20', 'p1-decompose', 'p1-add', 'p1-sub', 'p1-numbers100', 'p1-addsub-2d']
  },
  {
    id: 'p1-space',
    name: '小一 · 圖形與度量',
    icon: '📐',
    grade: 'P1',
    topics: ['p1-position', 'p1-length', 'p1-shapes', 'p1-money']
  },
  {
    id: 'p1-life',
    name: '小一 · 生活數學',
    icon: '⏰',
    grade: 'P1',
    topics: ['p1-time']
  },
  {
    id: 'p2-num',
    name: '小二 · 數與計算',
    icon: '2️⃣',
    grade: 'P2',
    topics: ['p2-hundreds', 'p2-add', 'p2-sub', 'p2-multiply', 'p2-thousands', 'p2-mixed', 'p2-divide']
  },
  {
    id: 'p2-space',
    name: '小二 · 圖形與度量',
    icon: '📏',
    grade: 'P2',
    topics: ['p2-angles', 'p2-direction', 'p2-money']
  },
  {
    id: 'p2-life',
    name: '小二 · 時間與數據',
    icon: '📊',
    grade: 'P2',
    topics: ['p2-time']
  },
  {
    id: 'p3-num',
    name: '小三 · 數與計算',
    icon: '🔢',
    grade: 'P3',
    topics: ['p3-five-digit', 'p3-multiply', 'p3-divide', 'p3-mixed-addsub', 'p3-mixed-mul']
  },
  {
    id: 'p3-frac',
    name: '小三 · 分數與度量',
    icon: '📏',
    grade: 'P3',
    topics: ['p3-frac-basic', 'p3-length', 'p3-capacity']
  },
  {
    id: 'p3-shape',
    name: '小三 · 圖形與數據',
    icon: '📊',
    grade: 'P3',
    topics: ['p3-triangle', 'p3-quad', 'p3-barchart']
  },
  {
    id: 'p4-num',
    name: '小四 · 數與計算',
    icon: '✖️',
    grade: 'P4',
    topics: ['p4-multiply', 'p4-mixed-ops', 'p4-factor', 'p4-frac-types', 'p4-frac-addsub', 'p4-decimal']
  },
  {
    id: 'p4-measure',
    name: '小四 · 度量與空間',
    icon: '📐',
    grade: 'P4',
    topics: ['p4-area', 'p4-direction']
  },
  {
    id: 'p4-word',
    name: '小四 · 應用題',
    icon: '📝',
    grade: 'P4',
    topics: ['p4-word-money', 'p4-word-logic', 'p4-word-frac']
  },
  {
    id: 'p5-num',
    name: '小五 · 數與計算',
    icon: '5️⃣',
    grade: 'P5',
    topics: ['p5-multidigit', 'p5-frac-cmp', 'p5-frac-addsub', 'p5-frac-mul', 'p5-frac-div', 'p5-decimal-mul', 'p5-algebra']
  },
  {
    id: 'p5-measure',
    name: '小五 · 圖形與度量',
    icon: '📐',
    grade: 'P5',
    topics: ['p5-tri-area', 'p5-quad-area', 'p5-circle', 'p5-volume']
  },
  {
    id: 'p6-num',
    name: '小六 · 數與計算',
    icon: '6️⃣',
    grade: 'P6',
    topics: ['p6-decimal-div', 'p6-decimal-mixed', 'p6-frac-decimal', 'p6-average', 'p6-percent', 'p6-percent-app']
  },
  {
    id: 'p6-measure',
    name: '小六 · 圖形與速率',
    icon: '⭕',
    grade: 'P6',
    topics: ['p6-circumference', 'p6-circle-area', 'p6-angles-deg', 'p6-speed', 'p6-pie-chart']
  }
];

const TOPICS = [
  /* ── 小一 ── */
  { id: 'p1-position', name: '位置', icon: '🧭', desc: '1上A · 左、右、上、下', grade: 'P1', exam: true, section: 'p1-space' },
  { id: 'p1-numbers20', name: '20以內的數', icon: '🔢', desc: '1上A · 認識·比較', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-decompose', name: '數的分和合', icon: '🧩', desc: '1上A · 2至18', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-length', name: '長度和距離', icon: '📏', desc: '1上A · 比較長度', grade: 'P1', exam: true, section: 'p1-space' },
  { id: 'p1-add', name: '基本加法', icon: '➕', desc: '1上B · 18以內', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-sub', name: '基本減法', icon: '➖', desc: '1上B · 18以內', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-numbers100', name: '100以內的數', icon: '💯', desc: '1上B · 個位十位', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-time', name: '時間和日期', icon: '⏰', desc: '1下A · 報時·星期', grade: 'P1', exam: true, section: 'p1-life' },
  { id: 'p1-shapes', name: '立體和平面圖形', icon: '🔷', desc: '1下A · 認識圖形', grade: 'P1', exam: true, section: 'p1-space' },
  { id: 'p1-addsub-2d', name: '兩位數加減', icon: '🔢', desc: '1下B · 進位·退位', grade: 'P1', exam: true, section: 'p1-num' },
  { id: 'p1-money', name: '厘米和硬幣', icon: '💰', desc: '1下B · 量度·付款', grade: 'P1', exam: true, section: 'p1-space' },

  /* ── 小二 ── */
  { id: 'p2-hundreds', name: '三位數', icon: '🔢', desc: '2上A · 認識·比較', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-add', name: '加法', icon: '➕', desc: '2上A · 三位數加法', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-sub', name: '減法', icon: '➖', desc: '2上A · 減法應用', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-angles', name: '角和垂直線', icon: '📐', desc: '2上A · 直角·銳角·鈍角', grade: 'P2', exam: true, section: 'p2-space' },
  { id: 'p2-direction', name: '方向', icon: '🧭', desc: '2上A · 四個主要方向', grade: 'P2', exam: true, section: 'p2-space' },
  { id: 'p2-multiply', name: '基本乘法', icon: '✖️', desc: '2上B · 乘法表', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-time', name: '時間和日期', icon: '⏰', desc: '2上B · 分鐘·日數', grade: 'P2', exam: true, section: 'p2-life' },
  { id: 'p2-thousands', name: '四位數', icon: '🔢', desc: '2下A · 認識·比較', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-money', name: '香港貨幣', icon: '💵', desc: '2下A · 紙幣·付款', grade: 'P2', exam: true, section: 'p2-space' },
  { id: 'p2-mixed', name: '加減混合計算', icon: '🔢', desc: '2下A · 混合運算', grade: 'P2', exam: true, section: 'p2-num' },
  { id: 'p2-divide', name: '除法和象形圖', icon: '➗', desc: '2下B · 除法·圖表', grade: 'P2', exam: true, section: 'p2-num' },

  /* ── 小三 ── */
  { id: 'p3-five-digit', name: '五位數', icon: '🔢', desc: '3上A · 讀寫·比較', grade: 'P3', exam: true, section: 'p3-num' },
  { id: 'p3-multiply', name: '乘法', icon: '✖️', desc: '3上A · 兩/三位×一位', grade: 'P3', exam: true, section: 'p3-num' },
  { id: 'p3-divide', name: '除法', icon: '➗', desc: '3上B · 兩/三位÷一位', grade: 'P3', exam: true, section: 'p3-num' },
  { id: 'p3-mixed-addsub', name: '加減混合計算', icon: '➕', desc: '3下A · 括號', grade: 'P3', exam: true, section: 'p3-num' },
  { id: 'p3-mixed-mul', name: '乘加乘減混合', icon: '🔢', desc: '3下A · 先乘後加減', grade: 'P3', exam: true, section: 'p3-num' },
  { id: 'p3-frac-basic', name: '分數的認識', icon: '🍰', desc: '3下B · 幾分之幾', grade: 'P3', exam: true, section: 'p3-frac' },
  { id: 'p3-length', name: '公里和毫米', icon: '📏', desc: '3上A · 長度單位', grade: 'P3', exam: true, section: 'p3-frac' },
  { id: 'p3-capacity', name: '容量', icon: '🥤', desc: '3下B · 比較容量', grade: 'P3', exam: true, section: 'p3-frac' },
  { id: 'p3-triangle', name: '三角形', icon: '🔺', desc: '3下A · 認識三角形', grade: 'P3', exam: true, section: 'p3-shape' },
  { id: 'p3-quad', name: '平行四邊形和梯形', icon: '⬛', desc: '3上B · 四邊形', grade: 'P3', exam: true, section: 'p3-shape' },
  { id: 'p3-barchart', name: '棒形圖', icon: '📊', desc: '3下B · 閱讀製作', grade: 'P3', exam: true, section: 'p3-shape' },

  /* ── 小四 ── */
  { id: 'p4-multiply', name: '乘法運算', icon: '✖️', desc: '4上A · 兩位×兩位', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-mixed-ops', name: '四則混合計算', icon: '🔢', desc: '4下A · 先乘除後加減', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-factor', name: '倍數和因數', icon: '🔣', desc: '4上B · 質數', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-frac-types', name: '真分數假分數帶分數', icon: '➗', desc: '4下B · 擴分約分', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-frac-addsub', name: '同分母分數加減', icon: '➕', desc: '4下B · 同分母', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-decimal', name: '小數的認識', icon: '🔵', desc: '4下B · 比較小數', grade: 'P4', exam: true, section: 'p4-num' },
  { id: 'p4-area', name: '長方形面積', icon: '📐', desc: '4下A · cm²·m²', grade: 'P4', exam: true, section: 'p4-measure' },
  { id: 'p4-direction', name: '八個方向', icon: '🧭', desc: '4上B · 指南針', grade: 'P4', exam: true, section: 'p4-measure' },
  { id: 'p4-word-money', name: '金錢應用題', icon: '💰', desc: '4下A · 四則應用', grade: 'P4', exam: true, section: 'p4-word' },
  { id: 'p4-word-logic', name: '邏輯應用題', icon: '🧠', desc: '倍數·餘數·折扣', grade: 'P4', exam: true, section: 'p4-word' },
  { id: 'p4-word-frac', name: '分數應用題', icon: '🍎', desc: '4下B · 分數生活應用', grade: 'P4', exam: true, section: 'p4-word' },

  /* ── 小五 ── */
  { id: 'p5-multidigit', name: '多位數', icon: '🔢', desc: '5上A · 認識·近似值', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-tri-area', name: '三角形面積', icon: '🔺', desc: '5上A · 底×高÷2', grade: 'P5', exam: true, section: 'p5-measure' },
  { id: 'p5-quad-area', name: '平行四邊形和梯形面積', icon: '⬛', desc: '5上A · 面積公式', grade: 'P5', exam: true, section: 'p5-measure' },
  { id: 'p5-frac-cmp', name: '異分母分數比較', icon: '🍰', desc: '5上A · 通分比較', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-frac-addsub', name: '異分母分數加減', icon: '➕', desc: '5上A · 通分加減', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-frac-mul', name: '分數乘法', icon: '✖️', desc: '5上B · 分數×整數/分數', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-algebra', name: '代數式和簡易方程', icon: '🔤', desc: '5上B · 代數·解方程', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-circle', name: '圓的認識', icon: '⭕', desc: '5下A · 圓心·半徑·直徑', grade: 'P5', exam: true, section: 'p5-measure' },
  { id: 'p5-decimal-mul', name: '小數乘法', icon: '🔵', desc: '5下A · 小數×整數/小數', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-frac-div', name: '分數除法', icon: '➗', desc: '5下B · 分數÷整數/分數', grade: 'P5', exam: true, section: 'p5-num' },
  { id: 'p5-volume', name: '體積', icon: '📦', desc: '5下B · 長方體體積', grade: 'P5', exam: true, section: 'p5-measure' },

  /* ── 小六 ── */
  { id: 'p6-decimal-div', name: '小數除法', icon: '➗', desc: '6上A · 小數÷整數/小數', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-decimal-mixed', name: '小數四則混合', icon: '🔢', desc: '6上A · 四則混合計算', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-frac-decimal', name: '小數和分數互化', icon: '🔄', desc: '6上A · 互化·比較', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-average', name: '平均數', icon: '📊', desc: '6上A · 計算平均數', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-percent', name: '百分數', icon: '％', desc: '6上A · 認識百分數', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-percent-app', name: '百分數應用', icon: '💹', desc: '6上B · 增加·減少', grade: 'P6', exam: true, section: 'p6-num' },
  { id: 'p6-circumference', name: '圓周', icon: '⭕', desc: '6上B · 圓周計算', grade: 'P6', exam: true, section: 'p6-measure' },
  { id: 'p6-circle-area', name: '圓面積', icon: '🔵', desc: '6上B · 圓面積公式', grade: 'P6', exam: true, section: 'p6-measure' },
  { id: 'p6-angles-deg', name: '角和度', icon: '📐', desc: '6下A · 量度角', grade: 'P6', exam: true, section: 'p6-measure' },
  { id: 'p6-speed', name: '速率', icon: '🏃', desc: '6下A · 路程·時間·速率', grade: 'P6', exam: true, section: 'p6-measure' },
  { id: 'p6-pie-chart', name: '圓形圖', icon: '🥧', desc: '6下A · 閱讀圓形圖', grade: 'P6', exam: true, section: 'p6-measure' }
];

const TIPS = [
  { icon: '🔢', title: '小一數感', formula: '先數清楚，再比較', points: ['20以內用手指幫手', '數的分合：合起來=總數', '比較大小由高位開始'] },
  { icon: '➕', title: '小一加減', formula: '由個位算起', points: ['進位：滿十進一', '退位：向十位借一', '應用題要寫答句'] },
  { icon: '✖️', title: '小二乘法', formula: '背熟乘法表', points: ['0乘任何數都得0', '1乘任何數都等於自己', '應用題留意「每」和「共」'] },
  { icon: '➗', title: '小二除法', formula: '平均分·分組分', points: ['餘數要比除數細', '除式和乘法互為逆運算', '象形圖一格代表幾'] },
  { icon: '🔢', title: '四則混合計算', formula: '括號 → 乘除 → 加減', points: ['有括號先計括號入面', '先乘除，後加減', '一步一步計，唔好跳步'] },
  { icon: '🍰', title: '分數入門', formula: '分母=等分幾份 · 分子=佔幾份', points: ['單位分數分子係 1', '同分母：分子大=分數大', '異分母要先通分'] },
  { icon: '🔵', title: '小數', formula: '十分位 · 百分位', points: ['小數點對齊', '0.5 = 1/2', '比較大小由左至右'] },
  { icon: '📐', title: '面積公式', formula: '三角形=底×高÷2', points: ['平行四邊形=底×高', '梯形=(上底+下底)×高÷2', '圓面積=π×半徑²'] },
  { icon: '％', title: '百分數', formula: '百分數 = 分數×100%', points: ['50% = 1/2', '求百分之幾用乘法', '增加減少要分清'] },
  { icon: '✅', title: '應用題搶分', formula: '審題 → 列式 → 計算 → 答句', points: ['圈關鍵字（各、倍、剩下）', '唔好用晒所有數字', '記得寫單位'] }
];

const EXAM_SECTIONS = CURRICULUM_SECTIONS;
