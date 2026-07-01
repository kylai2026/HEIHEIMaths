const MathUtils = {
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a || 1;
  },

  lcm(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },

  lcmMultiple(nums) {
    return nums.reduce((acc, n) => this.lcm(acc, n), 1);
  },

  simplify(num, den) {
    if (den === 0) return { num: 0, den: 1 };
    const g = this.gcd(num, den);
    num /= g;
    den /= g;
    if (den < 0) {
      num = -num;
      den = -den;
    }
    return { num, den };
  },

  toMixed(num, den) {
    const s = this.simplify(num, den);
    num = s.num;
    den = s.den;
    if (num === 0) return { whole: 0, num: 0, den: 1 };
    const whole = Math.trunc(num / den);
    const rem = Math.abs(num % den);
    return { whole, num: rem, den };
  },

  fractionToString(num, den, preferMixed = true) {
    const s = this.simplify(num, den);
    if (s.den === 1) return String(s.num);
    if (preferMixed && Math.abs(s.num) > s.den) {
      const m = this.toMixed(s.num, s.den);
      if (m.num === 0) return String(m.whole);
      const sign = s.num < 0 ? '-' : '';
      const w = Math.abs(m.whole);
      return `${sign}${w} ${m.num}/${m.den}`;
    }
    return `${s.num}/${s.den}`;
  },

  parseAnswer(input) {
    if (!input || typeof input !== 'string') return null;
    input = input.trim().replace(/，/g, ',').replace(/\s+/g, ' ');

    const decimal = parseFloat(input.replace(/[^\d.\-]/g, ''));
    if (/^-?\d+(\.\d+)?$/.test(input.replace(/\s/g, ''))) {
      return { type: 'decimal', value: decimal };
    }

    const mixedMatch = input.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1], 10);
      const num = parseInt(mixedMatch[2], 10);
      const den = parseInt(mixedMatch[3], 10);
      const sign = whole < 0 ? -1 : 1;
      return { type: 'fraction', num: sign * (Math.abs(whole) * den + num), den };
    }

    const fracMatch = input.match(/^(-?\d+)\/(\d+)$/);
    if (fracMatch) {
      return { type: 'fraction', num: parseInt(fracMatch[1], 10), den: parseInt(fracMatch[2], 10) };
    }

    const intMatch = input.match(/^-?\d+$/);
    if (intMatch) {
      return { type: 'decimal', value: parseInt(input, 10) };
    }

    return null;
  },

  answersEqual(userAns, correctAns) {
    if (correctAns?.type === 'text') {
      const norm = (s) => String(s || '').replace(/\s+/g, '').replace(/＞/g, '>').toLowerCase();
      return norm(userAns) === norm(correctAns.value);
    }

    const parsed = this.parseAnswer(userAns);
    if (!parsed) return false;

    if (correctAns.type === 'decimal') {
      if (parsed.type === 'decimal') {
        return Math.abs(parsed.value - correctAns.value) < 0.01;
      }
      if (parsed.type === 'fraction') {
        return Math.abs(parsed.num / parsed.den - correctAns.value) < 0.01;
      }
    }

    if (correctAns.type === 'fraction') {
      if (parsed.type === 'fraction') {
        const a = this.simplify(parsed.num, parsed.den);
        const b = this.simplify(correctAns.num, correctAns.den);
        return a.num === b.num && a.den === b.den;
      }
      if (parsed.type === 'decimal') {
        const correctVal = correctAns.num / correctAns.den;
        return Math.abs(parsed.value - correctVal) < 0.001;
      }
    }

    return false;
  },

  /** 香港小學常用量詞 */
  itemClassifier(item) {
    const map = {
      蘋果: '個', 橙: '個', 梨: '個', 香蕉: '串', 葡萄: '串', 西瓜: '個', 芒果: '個', 草莓: '粒',
      糖果: '粒', 糖: '粒', 珠子: '粒', 彈珠: '粒', 星星: '顆', 圓點: '個',
      貼紙: '張', 圖畫: '張', 卡片: '張', 書: '本', 書本: '本', 圖書: '本', 筆記本: '本',
      鉛筆: '枝', 原子筆: '枝', 畫筆: '枝', 蠟筆: '枝',
      積木: '塊', 橡皮: '塊', 餅乾: '塊', 地毯: '塊',
      玩具: '個', 氣球: '個', 麵包: '個', 包: '個', 雞蛋: '隻', 小鴨: '隻', 熊: '隻',
      花朵: '朵', 花: '朵', 學生: '位', 同學: '位', 人: '位',
      尺: '把', 膠尺: '把', 梳子: '把', 繩: '條', 紅繩: '條', 藍繩: '條',
      文具: '套', 零食: '份', 飲料: '瓶', 膠箱: '個', 短褲: '條', 長褲: '條', 衣服: '件'
    };
    return map[item] || '個';
  },

  countPhrase(n, item) {
    return `${n} ${this.itemClassifier(item)}${item}`;
  },

  formatFractionHTML(num, den) {
    const s = this.simplify(num, den);
    if (s.den === 1) return String(s.num);
    return `<span class="frac"><span class="num">${s.num}</span><span class="den">${s.den}</span></span>`;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  roundTo(n, decimals = 2) {
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
  }
};

const Storage = {
  KEY: 'p5maths_progress',

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      const parsed = data ? JSON.parse(data) : this.defaultData();
      return this.applyUnlimitedPoints(this.migrate(parsed));
    } catch {
      return this.applyUnlimitedPoints(this.defaultData());
    }
  },

  migrate(data) {
    if (data.coins && !data.points) data.points = data.coins;
    if (!data.points && data.points !== 0) data.points = 0;
    if (!data.bonusPoints && data.bonusPoints !== 0) data.bonusPoints = 0;
    if (data.gachaPointsSpent === undefined || data.gachaPointsSpent === null) {
      const pulls = data.gachaStats?.totalPulls || 0;
      data.gachaPointsSpent = pulls * 10;
    }
    if (!data.xp && data.xp !== 0) data.xp = 0;
    delete data.examScoreEstimate;
    delete data.targetExamScore;
    delete data.examTargetScore;
    delete data.startingExamScore;
    delete data.coins;
    if (!data.weeklyPoints) {
      data.weeklyPoints = { weekKey: null, easy: 0, medium: 0, hard: 0 };
    }
    if (!data.redeemedGifts && data.unlockedRewards) {
      data.redeemedGifts = data.unlockedRewards;
    }
    if (!data.dailyLog) data.dailyLog = {};
    if (!data.wrongLog) data.wrongLog = {};
    if (!data.correctLog) data.correctLog = {};
    if (!data.cardCollection) data.cardCollection = { pokemon: {}, sanrio: {}, pixar: {}, disney: {}, marvel: {} };
    if (!data.gachaStats) data.gachaStats = { totalPulls: 0, pokemon: 0, sanrio: 0, pixar: 0, disney: 0, marvel: 0 };
    if (!data.cardCollection.disney) data.cardCollection.disney = {};
    if (!data.cardCollection.marvel) data.cardCollection.marvel = {};
    if (data.cardCollection.cinnamoroll && !data.cardCollection.sanrio) {
      data.cardCollection.sanrio = {};
      Object.entries(data.cardCollection.cinnamoroll).forEach(([id, count]) => {
        const newId = id.replace(/^cinna-/, 'sanrio-');
        data.cardCollection.sanrio[newId] = (data.cardCollection.sanrio[newId] || 0) + count;
      });
      delete data.cardCollection.cinnamoroll;
    }
    if (data.gachaStats.cinnamoroll && !data.gachaStats.sanrio) {
      data.gachaStats.sanrio = data.gachaStats.cinnamoroll;
      delete data.gachaStats.cinnamoroll;
    }
    if (!data.tierCompleted) data.tierCompleted = { easy: [], medium: [], hard: [] };
    if (!data.correctBank) data.correctBank = {};
    return data;
  },

  getDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  ensureDailyEntry(data, key = this.getDateKey()) {
    if (!data.dailyLog) data.dailyLog = {};
    if (!data.dailyLog[key]) {
      data.dailyLog[key] = {
        answered: 0,
        correct: 0,
        points: 0,
        xp: 0,
        minutes: 0,
        dailyChallenge: false,
        goalMet: false
      };
    }
    return data.dailyLog[key];
  },

  updateDailyLog(data, { answered = 0, correct = 0, points = 0, xp = 0, minutes = 0, dailyChallenge = false } = {}) {
    const day = this.ensureDailyEntry(data);
    day.answered += answered;
    day.correct += correct;
    day.points += points;
    day.xp += xp;
    day.minutes = Math.round((day.minutes + minutes) * 10) / 10;
    if (dailyChallenge) day.dailyChallenge = true;
    day.goalMet = day.answered >= 5 || day.minutes >= 10 || day.dailyChallenge;

    const keys = Object.keys(data.dailyLog).sort();
    if (keys.length > 90) {
      keys.slice(0, keys.length - 90).forEach(k => delete data.dailyLog[k]);
    }
    return day;
  },

  getTodayLog(data) {
    return this.ensureDailyEntry(data);
  },

  addSessionMinutes(minutes) {
    if (minutes <= 0) return;
    const data = this.load();
    this.updateDailyLog(data, { minutes });
    this.save(data);
  },

  markDailyChallengeDone() {
    const data = this.load();
    this.updateDailyLog(data, { dailyChallenge: true });
    this.save(data);
  },

  defaultData() {
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      streakDays: 0,
      lastPracticeDate: null,
      topics: {},
      quizHistory: [],
      examHistory: [],
      xp: 0,
      points: 0,
      bonusPoints: 0,
      gachaPointsSpent: 0,
      badges: [],
      redeemedGifts: [],
      weeklyPoints: { weekKey: null, easy: 0, medium: 0, hard: 0 },
      currentStreak: 0,
      bestStreak: 0,
      examCorrect: 0,
      dailyCompleted: 0,
      lastDailyDate: null,
      dailyLog: {},
      wrongLog: {},
      correctLog: {},
      cardCollection: { pokemon: {}, sanrio: {}, pixar: {}, disney: {}, marvel: {} },
      gachaStats: { totalPulls: 0, pokemon: 0, sanrio: 0, pixar: 0, disney: 0, marvel: 0 },
      tierCompleted: { easy: [], medium: [], hard: [] },
      correctBank: {}
    };
  },

  save(data) {
    this.applyUnlimitedPoints(data);
    data._syncMeta = { updatedAt: new Date().toISOString() };
    this.saveLocal(data);
    if (typeof CloudSync !== 'undefined') CloudSync.schedulePush();
  },

  saveLocal(data) {
    this.applyUnlimitedPoints(data);
    if (!data._syncMeta) {
      data._syncMeta = { updatedAt: new Date().toISOString() };
    }
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  applyUnlimitedPoints(data) {
    if (typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints()) {
      data.points = UNLIMITED_POINTS_VALUE;
    }
    return data;
  },

  getPoints(data) {
    if (typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints()) {
      return UNLIMITED_POINTS_VALUE;
    }
    return (data.points || 0) + (data.bonusPoints || 0);
  },

  spendPoints(data, amount, reason = 'spend') {
    if (typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints()) return true;
    let left = amount;
    const bonus = data.bonusPoints || 0;
    if (bonus >= left) {
      data.bonusPoints = bonus - left;
      if (reason === 'gacha') data.gachaPointsSpent = (data.gachaPointsSpent || 0) + amount;
      return true;
    }
    left -= bonus;
    data.bonusPoints = 0;
    if ((data.points || 0) < left) return false;
    data.points -= left;
    if (reason === 'gacha') data.gachaPointsSpent = (data.gachaPointsSpent || 0) + amount;
    return true;
  },

  canAffordPoints(data, amount) {
    if (typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints()) return true;
    return this.getPoints(data) >= amount;
  },

  recordAnswer(topicId, correct, extras = {}, dataRef = null) {
    const data = dataRef || this.load();
    data.totalAnswered++;
    if (correct) data.totalCorrect++;

    if (!data.topics[topicId]) {
      data.topics[topicId] = { answered: 0, correct: 0 };
    }
    data.topics[topicId].answered++;
    if (correct) data.topics[topicId].correct++;

    const today = new Date().toDateString();
    if (data.lastPracticeDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (data.lastPracticeDate === yesterday.toDateString()) {
        data.streakDays++;
      } else if (data.lastPracticeDate !== today) {
        data.streakDays = 1;
      }
      data.lastPracticeDate = today;
    }

    this.updateDailyLog(data, {
      answered: 1,
      correct: correct ? 1 : 0,
      points: extras.points || 0,
      xp: extras.xp || 0
    });

    if (!dataRef) this.save(data);
    return data;
  },

  saveCorrectQuestion(data, q) {
    if (!q?.poolKey) return;
    if (!data.correctBank) data.correctBank = {};
    data.correctBank[q.poolKey] = {
      poolKey: q.poolKey,
      topicId: q.topicId,
      tier: q.tier,
      question: q.question,
      answer: q.answer,
      answerDisplay: q.answerDisplay,
      hint: q.hint,
      solution: q.solution,
      type: q.type,
      options: q.options ? [...q.options] : undefined,
      correctIndex: q.correctIndex,
      savedAt: Date.now()
    };
  },

  getCorrectBankList(data) {
    const bank = data.correctBank || {};
    return Object.values(bank).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  },

  recordWrongAnswer(data, q, userAnswer, mode = 'practice') {
    if (!q) return;
    const key = this.getDateKey();
    if (!data.wrongLog) data.wrongLog = {};
    if (!data.wrongLog[key]) data.wrongLog[key] = [];

    const topic = typeof TOPICS !== 'undefined' ? TOPICS.find(t => t.id === q.topicId) : null;
    const tierCfg = typeof DIFFICULTY_TIERS !== 'undefined' ? DIFFICULTY_TIERS[q.tier] : null;
    const correctAnswer = q.answerDisplay
      || (q.options && q.correctIndex != null ? q.options[q.correctIndex] : String(q.answer ?? ''));

    data.wrongLog[key].push({
      time: Date.now(),
      mode,
      topicId: q.topicId,
      topicName: q.topicName || topic?.name || q.topicId || '練習',
      tier: q.tier,
      tierLabel: tierCfg?.name || q.tier,
      question: String(q.question || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 300),
      userAnswer: String(userAnswer ?? ''),
      correctAnswer: String(correctAnswer),
      poolKey: q.poolKey || null
    });

    if (data.wrongLog[key].length > 50) {
      data.wrongLog[key] = data.wrongLog[key].slice(-50);
    }
    const keys = Object.keys(data.wrongLog).sort();
    if (keys.length > 30) {
      keys.slice(0, keys.length - 30).forEach(k => delete data.wrongLog[k]);
    }
  },

  getWrongLogForDate(data, dateKey = this.getDateKey()) {
    return (data.wrongLog && data.wrongLog[dateKey]) ? data.wrongLog[dateKey] : [];
  },

  _formatAnswerDisplay(q) {
    if (q?.answerDisplay) return String(q.answerDisplay);
    if (q?.options && q.correctIndex != null) return String(q.options[q.correctIndex] ?? '');
    if (q?.answer?.type === 'fraction') return `${q.answer.num}/${q.answer.den}`;
    if (q?.answer?.type === 'decimal') return String(q.answer.value);
    return String(q?.answer ?? '');
  },

  _stripQuestionHtml(question) {
    return String(question || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
  },

  recordCorrectLog(data, q, mode = 'practice') {
    if (!q) return;
    const key = this.getDateKey();
    if (!data.correctLog) data.correctLog = {};
    if (!data.correctLog[key]) data.correctLog[key] = [];

    const topic = typeof TOPICS !== 'undefined' ? TOPICS.find(t => t.id === q.topicId) : null;
    const tierCfg = typeof DIFFICULTY_TIERS !== 'undefined' ? DIFFICULTY_TIERS[q.tier] : null;

    data.correctLog[key].push({
      time: Date.now(),
      mode,
      topicId: q.topicId,
      topicName: q.topicName || topic?.name || q.topicId || '練習',
      tier: q.tier,
      tierLabel: tierCfg?.name || q.tier,
      question: this._stripQuestionHtml(q.question),
      correctAnswer: this._formatAnswerDisplay(q),
      poolKey: q.poolKey || null
    });

    if (data.correctLog[key].length > 50) {
      data.correctLog[key] = data.correctLog[key].slice(-50);
    }
    const keys = Object.keys(data.correctLog).sort();
    if (keys.length > 30) {
      keys.slice(0, keys.length - 30).forEach(k => delete data.correctLog[k]);
    }
  },

  getCorrectLogForDate(data, dateKey = this.getDateKey()) {
    if (!data) return [];
    const logged = (data.correctLog && data.correctLog[dateKey]) ? [...data.correctLog[dateKey]] : [];
    if (logged.length) return logged;

    const bank = data.correctBank || {};
    return Object.values(bank)
      .filter(entry => entry.savedAt && this.getDateKey(new Date(entry.savedAt)) === dateKey)
      .map(entry => {
        const topic = typeof TOPICS !== 'undefined' ? TOPICS.find(t => t.id === entry.topicId) : null;
        const tierCfg = typeof DIFFICULTY_TIERS !== 'undefined' ? DIFFICULTY_TIERS[entry.tier] : null;
        return {
          time: entry.savedAt,
          mode: 'practice',
          topicId: entry.topicId,
          topicName: topic?.name || entry.topicId || '練習',
          tier: entry.tier,
          tierLabel: tierCfg?.name || entry.tier,
          question: this._stripQuestionHtml(entry.question),
          correctAnswer: this._formatAnswerDisplay(entry),
          poolKey: entry.poolKey || null
        };
      })
      .sort((a, b) => (b.time || 0) - (a.time || 0));
  },

  recordQuiz(score, total, weakTopics) {
    const data = this.load();
    data.quizHistory.unshift({
      date: new Date().toISOString(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      weakTopics
    });
    if (data.quizHistory.length > 10) data.quizHistory.pop();
    this.save(data);
  },

  recordTermExam(grade, score, total, sectionScores, timedOut = false, data = null) {
    const target = data || this.load();
    if (!target.examHistory) target.examHistory = [];
    target.examHistory.unshift({
      date: new Date().toISOString(),
      grade,
      score,
      total,
      percentage: total ? Math.round((score / total) * 100) : 0,
      sectionScores,
      timedOut
    });
    if (target.examHistory.length > 10) target.examHistory.pop();
    if (!data) this.save(target);
    return target;
  },

  reset() {
    localStorage.removeItem(this.KEY);
    if (typeof CloudSync !== 'undefined') CloudSync.resetCloud();
  }
};
