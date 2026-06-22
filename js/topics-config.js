/* 根據心光數學電子書（小三、小四）課題設計 */
const CURRICULUM_SECTIONS = [
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
  }
];

const TOPICS = [
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
  { id: 'p4-word-frac', name: '分數應用題', icon: '🍎', desc: '4下B · 分數生活應用', grade: 'P4', exam: true, section: 'p4-word' }
];

const TIPS = [
  { icon: '🔢', title: '四則混合計算', formula: '括號 → 乘除 → 加減', points: ['有括號先計括號入面', '先乘除，後加減', '一步一步計，唔好跳步'] },
  { icon: '✖️', title: '乘法技巧', formula: '分配性質幫到手', points: ['(a+b)×c = a×c + b×c', '估算結果檢查有冇錯', '兩位×兩位用直式'] },
  { icon: '➗', title: '除法技巧', formula: '從高位除起', points: ['整十數先除', '餘數要留意題目要求', '除法應用題要睇清「平均分」'] },
  { icon: '🍰', title: '分數入門', formula: '分母=等分幾份 · 分子=佔幾份', points: ['單位分數分子係 1', '同分母：分子大=分數大', '同分子：分母大=分數細'] },
  { icon: '➕', title: '同分母分數加減', formula: '分母不變，分子加減', points: ['4下B重點課題', '答案要約分', '假分數可化帶分數'] },
  { icon: '🔵', title: '小數', formula: '十分位 · 百分位', points: ['小數點對齊', '0.5 = 1/2', '比較大小由左至右'] },
  { icon: '📐', title: '長方形面積', formula: '面積 = 長 × 闊', points: ['單位寫 cm² 或 m²', '周界 ≠ 面積', '1 m² = 10000 cm²'] },
  { icon: '✅', title: '應用題搶分', formula: '審題 → 列式 → 計算 → 答句', points: ['圈關鍵字（各、倍、剩下）', '唔好用晒所有數字', '記得寫單位'] }
];

// backward compat
const EXAM_SECTIONS = CURRICULUM_SECTIONS;
