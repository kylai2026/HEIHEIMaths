/* 預生成題庫：每個課題至少 50 題不重複 */
const QuestionPool = {
  MIN_PER_TOPIC: 50,
  pools: {},
  _ready: false,

  init() {
    if (this._ready) return;
    TOPICS.forEach(t => {
      this.pools[t.id] = this.buildPool(t.id);
    });
    this._ready = true;
  },

  questionKey(q) {
    const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return `${strip(q.question)}|${q.answerDisplay}`;
  },

  buildPool(topicId) {
    const seen = new Set();
    const pool = [];
    const tiers = ['easy', 'medium', 'hard'];
    let attempts = 0;
    const maxAttempts = 30000;

    while (pool.length < this.MIN_PER_TOPIC && attempts < maxAttempts) {
      attempts++;
      const tier = tiers[pool.length % tiers.length];
      const q = QuestionEngine.generateRaw(topicId, tier);
      if (!q) continue;
      const key = this.questionKey(q);
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({ ...q, topicId, poolKey: key });
    }

    if (pool.length < this.MIN_PER_TOPIC) {
      console.warn(`[QuestionPool] ${topicId} 只生成了 ${pool.length} 題（目標 ${this.MIN_PER_TOPIC}）`);
    }
    return pool;
  },

  getPool(topicId) {
    this.init();
    return this.pools[topicId] || [];
  },

  getPoolSize(topicId) {
    return this.getPool(topicId).length;
  },

  getTotalSize() {
    this.init();
    return Object.values(this.pools).reduce((sum, p) => sum + p.length, 0);
  },

  getTierTotals() {
    this.init();
    const totals = { easy: 0, medium: 0, hard: 0 };
    for (const pool of Object.values(this.pools)) {
      for (const q of pool) {
        if (totals[q.tier] !== undefined) totals[q.tier]++;
      }
    }
    return totals;
  },

  filterByTier(pool, tier) {
    if (!tier) return pool;
    const tiered = pool.filter(q => q.tier === tier);
    return tiered.length ? tiered : pool;
  },

  draw(topicId, tier) {
    const pool = this.filterByTier(this.getPool(topicId), tier);
    return { ...MathUtils.randomChoice(pool) };
  },

  drawSet(topicId, count, tier) {
    const pool = this.filterByTier(this.getPool(topicId), tier);
    const shuffled = MathUtils.shuffle([...pool]);
    const n = Math.min(count, shuffled.length);
    return shuffled.slice(0, n).map(q => ({ ...q }));
  },

  drawMixed(count, tier, topicIds) {
    const ids = topicIds && topicIds.length ? topicIds : TOPICS.map(t => t.id);
    const questions = [];
    const usedPerTopic = {};

    for (let i = 0; i < count; i++) {
      const topicId = MathUtils.randomChoice(ids);
      if (!usedPerTopic[topicId]) usedPerTopic[topicId] = new Set();
      const pool = this.filterByTier(this.getPool(topicId), tier);
      const available = pool.filter(q => !usedPerTopic[topicId].has(q.poolKey));
      const source = available.length ? available : pool;
      const q = { ...MathUtils.randomChoice(source) };
      usedPerTopic[topicId].add(q.poolKey);
      questions.push(q);
    }
    return MathUtils.shuffle(questions);
  },

  drawQuizMCQ(count) {
    const topics = TOPICS.filter(t => t.exam).map(t => t.id);
    const tiers = ['easy', 'medium', 'hard'];
    const questions = [];
    for (let i = 0; i < count; i++) {
      const topicId = MathUtils.randomChoice(topics);
      const tier = MathUtils.randomChoice(tiers);
      const q = this.draw(topicId, tier);
      questions.push(P34Questions.toMCQ(q, topicId));
    }
    return MathUtils.shuffle(questions);
  }
};