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
      return this.migrate(parsed);
    } catch {
      return this.defaultData();
    }
  },

  migrate(data) {
    if (data.coins && !data.points) data.points = data.coins;
    if (!data.points && data.points !== 0) data.points = 0;
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
    if (!data.cardCollection) data.cardCollection = { pokemon: {}, cinnamoroll: {} };
    if (!data.gachaStats) data.gachaStats = { totalPulls: 0, pokemon: 0, cinnamoroll: 0 };
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
      xp: 0,
      points: 0,
      badges: [],
      redeemedGifts: [],
      weeklyPoints: { weekKey: null, easy: 0, medium: 0, hard: 0 },
      currentStreak: 0,
      bestStreak: 0,
      examCorrect: 0,
      dailyCompleted: 0,
      lastDailyDate: null,
      dailyLog: {},
      cardCollection: { pokemon: {}, cinnamoroll: {} },
      gachaStats: { totalPulls: 0, pokemon: 0, cinnamoroll: 0 }
    };
  },

  save(data) {
    data._syncMeta = { updatedAt: new Date().toISOString() };
    this.saveLocal(data);
    if (typeof CloudSync !== 'undefined') CloudSync.schedulePush();
  },

  saveLocal(data) {
    if (!data._syncMeta) {
      data._syncMeta = { updatedAt: new Date().toISOString() };
    }
    localStorage.setItem(this.KEY, JSON.stringify(data));
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

  reset() {
    localStorage.removeItem(this.KEY);
    if (typeof CloudSync !== 'undefined') CloudSync.resetCloud();
  }
};
