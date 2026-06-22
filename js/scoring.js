const DIFFICULTY_TIERS = {
  easy: {
    id: 'easy',
    name: '初級',
    icon: '🌱',
    image: 'assets/img/tier-easy.png',
    points: 1,
    weeklyCap: 50,
    cssClass: 'tier-easy'
  },
  medium: {
    id: 'medium',
    name: '中級',
    icon: '⭐',
    image: 'assets/img/tier-medium.png',
    points: 2,
    weeklyCap: 30,
    cssClass: 'tier-medium'
  },
  hard: {
    id: 'hard',
    name: '高級',
    icon: '🔥',
    image: 'assets/img/tier-hard.png',
    points: 3,
    weeklyCap: 60,
    cssClass: 'tier-hard'
  }
};

const GIFT_SHOP = [
  { id: 'gift-small', name: '小禮物', image: 'assets/img/gift-small.png', desc: '舅父晞晞準備的小驚喜', cost: 30, tier: 'small' },
  { id: 'gift-medium', name: '中級禮物', image: 'assets/img/gift-medium.png', desc: '做得好好嘅獎勵', cost: 60, tier: 'medium' },
  { id: 'gift-big', name: '大獎', image: 'assets/img/gift-big.png', desc: '超勁嘅終極獎品', cost: 100, tier: 'big' }
];

const XP_PER_LEVEL = 100;

const BADGES = [
  { id: 'first-correct', name: '初試身手', icon: '🌟', desc: '第一次答對題目', check: d => d.totalCorrect >= 1 },
  { id: 'points-30', name: '積分達人', icon: '🎁', desc: '累積 30 積分', check: d => (d.points || 0) >= 30 },
  { id: 'points-60', name: '積分高手', icon: '🎀', desc: '累積 60 積分', check: d => (d.points || 0) >= 60 },
  { id: 'points-100', name: '積分王者', icon: '🏆', desc: '累積 100 積分', check: d => (d.points || 0) >= 100 },
  { id: 'streak-5', name: '五連擊', icon: '🔥', desc: '連續答對 5 題', check: d => d.bestStreak >= 5 },
  { id: 'daily-done', name: '今日達人', icon: '🎯', desc: '完成今日挑戰', check: d => d.dailyCompleted > 0 },
  { id: 'quiz-pass', name: '小測合格', icon: '✅', desc: '模擬小測達 50%', check: d => d.quizHistory.some(q => q.percentage >= 50) },
  { id: 'streak-days-7', name: '一週達人', icon: '🗓️', desc: '連續練習 7 天', check: d => d.streakDays >= 7 },
  { id: 'level-5', name: 'Lv.5 達人', icon: '⭐', desc: '升到等級 5', check: d => Scoring.getLevel(d.xp || 0).level >= 5 },
  { id: 'gift-small', name: '小禮物得主', icon: '🎁', desc: '兌換小禮物', check: d => (d.redeemedGifts || []).includes('gift-small') },
  { id: 'gift-big', name: '大獎得主', icon: '👑', desc: '兌換大獎', check: d => (d.redeemedGifts || []).includes('gift-big') }
];

const Scoring = {
  XP_CORRECT: 10,
  XP_WRONG: 3,

  getWeekKey() {
    const d = new Date();
    const day = d.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(d.getDate() + mondayOffset);
    return monday.toISOString().slice(0, 10);
  },

  ensureWeeklyPoints(data) {
    const weekKey = this.getWeekKey();
    if (!data.weeklyPoints || data.weeklyPoints.weekKey !== weekKey) {
      data.weeklyPoints = { weekKey, easy: 0, medium: 0, hard: 0 };
    }
    return data.weeklyPoints;
  },

  getWeeklyStatus(data) {
    const wp = this.ensureWeeklyPoints(data);
    return Object.keys(DIFFICULTY_TIERS).map(key => {
      const t = DIFFICULTY_TIERS[key];
      return {
        ...t,
        earned: wp[key] || 0,
        remaining: Math.max(0, t.weeklyCap - (wp[key] || 0)),
        percent: Math.round(((wp[key] || 0) / t.weeklyCap) * 100)
      };
    });
  },

  getLevel(xp) {
    const xpVal = Math.max(0, xp || 0);
    const level = Math.floor(xpVal / XP_PER_LEVEL) + 1;
    const xpInLevel = xpVal % XP_PER_LEVEL;
    return {
      level,
      xp: xpVal,
      xpInLevel,
      nextXp: XP_PER_LEVEL,
      prevXp: 0,
      progress: xpInLevel,
      title: `等級 ${level}`,
      icon: '⭐'
    };
  },

  awardAnswer(data, correct, tier) {
    const result = {
      xp: 0,
      pointsEarned: 0,
      tier,
      weeklyCapped: false,
      levelUp: false,
      newBadges: []
    };

    const tierConfig = DIFFICULTY_TIERS[tier] || DIFFICULTY_TIERS.medium;

    if (correct) {
      result.xp = this.XP_CORRECT;
      data.currentStreak = (data.currentStreak || 0) + 1;
      if (data.currentStreak > (data.bestStreak || 0)) data.bestStreak = data.currentStreak;

      const wp = this.ensureWeeklyPoints(data);
      const weeklyEarned = wp[tier] || 0;
      if (weeklyEarned >= tierConfig.weeklyCap) {
        result.weeklyCapped = true;
        result.pointsEarned = 0;
      } else {
        const toAdd = Math.min(tierConfig.points, tierConfig.weeklyCap - weeklyEarned);
        wp[tier] = weeklyEarned + toAdd;
        data.points = (data.points || 0) + toAdd;
        result.pointsEarned = toAdd;
        if (toAdd < tierConfig.points) result.weeklyCapped = true;
      }
    } else {
      result.xp = this.XP_WRONG;
      data.currentStreak = 0;
    }

    const oldLevel = this.getLevel(data.xp || 0).level;
    data.xp = (data.xp || 0) + result.xp;
    const newLevel = this.getLevel(data.xp).level;
    if (newLevel > oldLevel) {
      result.levelUp = true;
      result.newLevel = this.getLevel(data.xp);
    }

    result.newBadges = RewardSystem.checkBadges(data);
    return result;
  },

  awardQuiz(data, percentage) {
    let bonusXp = 0;
    if (percentage >= 50) bonusXp += 30;
    if (percentage >= 80) bonusXp += 50;
    data.xp = (data.xp || 0) + bonusXp;
    const newBadges = RewardSystem.checkBadges(data);
    return { bonusXp, newBadges };
  },

  awardDaily(data) {
    if (data.lastDailyDate === new Date().toDateString()) return null;
    data.lastDailyDate = new Date().toDateString();
    data.dailyCompleted = (data.dailyCompleted || 0) + 1;
    data.xp = (data.xp || 0) + 20;
    const newBadges = RewardSystem.checkBadges(data);
    return { xp: 20, newBadges };
  }
};

const RewardSystem = {
  checkBadges(data) {
    if (!data.badges) data.badges = [];
    const unlocked = [];
    for (const badge of BADGES) {
      if (!data.badges.includes(badge.id) && badge.check(data)) {
        data.badges.push(badge.id);
        unlocked.push(badge);
      }
    }
    return unlocked;
  },

  redeemGift(data, giftId) {
    const gift = GIFT_SHOP.find(g => g.id === giftId);
    if (!gift) return { ok: false, msg: '找不到禮物' };
    if (!data.redeemedGifts) data.redeemedGifts = [];
    if (data.redeemedGifts.includes(giftId)) return { ok: false, msg: '已經兌換過呢個禮物' };
    if ((data.points || 0) < gift.cost) {
      return { ok: false, msg: `積分唔夠！需要 ${gift.cost} 分，你而家有 ${data.points || 0} 分` };
    }
    data.points -= gift.cost;
    data.redeemedGifts.push(giftId);
    return { ok: true, gift };
  }
};
