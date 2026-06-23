/** BOSS 關卡：皮卡丘答題打 BOSS */
const BossBattle = {
  DAMAGE: { easy: 10, medium: 18, hard: 28 },
  ULTIMATE_EXTRA: 35,
  STREAK_FOR_ULT: 3,
  BOSS_MAX_HP: 100,
  PLAYER_MAX_HP: 80,
  BOSS_COUNTER: 12,

  BOSSES: [
    { name: '喵喵', emoji: '🐱', taunt: '喵！把積分交出來！' },
    { name: '臭臭泥', emoji: '💜', taunt: '污泥攻擊！' },
    { name: '大嘴蝠', emoji: '🦇', taunt: '超音波！' },
    { name: '耿鬼', emoji: '👻', taunt: '影子球！' },
    { name: '卡比獸', emoji: '😴', taunt: '擋路啦！' }
  ],

  boss: null,
  bossHp: 0,
  playerHp: 0,
  streak: 0,
  lastResult: null,
  _ultimateTimer: null,

  reset() {
    this.boss = MathUtils.randomChoice(this.BOSSES);
    this.bossHp = this.BOSS_MAX_HP;
    this.playerHp = this.PLAYER_MAX_HP;
    this.streak = 0;
    this.lastResult = null;
  },

  ensureQuestions(grade, min = 15) {
    if (!App.state.bossQuestionQueue) App.state.bossQuestionQueue = [];
    const q = App.state.bossQuestionQueue;
    while (q.length < min) {
      q.push(...QuestionBank.generateDaily(10, grade));
    }
  },

  pullQuestions(count, grade) {
    this.ensureQuestions(grade, count);
    return App.state.bossQuestionQueue.splice(0, count);
  },

  getDamage(tier) {
    return this.DAMAGE[tier] || this.DAMAGE.medium;
  },

  resolveAnswer(correct, tier) {
    const tierInfo = DIFFICULTY_TIERS[tier] || DIFFICULTY_TIERS.medium;
    const result = {
      correct,
      damage: 0,
      ultimate: false,
      bossDefeated: false,
      playerDefeated: false,
      playerDamage: 0,
      tierLabel: tierInfo.name,
      message: ''
    };

    if (!correct) {
      this.streak = 0;
      result.playerDamage = this.BOSS_COUNTER;
      this.playerHp = Math.max(0, this.playerHp - this.BOSS_COUNTER);
      result.playerDefeated = this.playerHp <= 0;
      result.message = `BOSS 反擊！皮卡丘 -${this.BOSS_COUNTER} HP`;
      this.lastResult = result;
      return result;
    }

    this.streak++;
    let damage = this.getDamage(tier);
    if (this.streak >= this.STREAK_FOR_ULT) {
      result.ultimate = true;
      damage += this.ULTIMATE_EXTRA;
      this.streak = 0;
    }

    this.bossHp = Math.max(0, this.bossHp - damage);
    result.damage = damage;
    result.bossDefeated = this.bossHp <= 0;
    result.message = result.ultimate
      ? `十萬伏特！造成 ${damage} 傷害！`
      : `${tierInfo.name}答對！-${damage} HP`;
    this.lastResult = result;
    return result;
  },

  hpPercent(current, max) {
    return Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  },

  showPanel(show) {
    document.getElementById('bossBattlePanel')?.classList.toggle('hidden', !show);
    document.querySelector('.practice-layout')?.classList.toggle('boss-mode', show);
    document.getElementById('tierSelector')?.classList.toggle('hidden', show);
    document.querySelector('.topic-sidebar')?.classList.toggle('hidden', show);
  },

  renderArena() {
    const panel = document.getElementById('bossBattlePanel');
    if (!panel || !this.boss) return;

    const bossPct = this.hpPercent(this.bossHp, this.BOSS_MAX_HP);
    const playerPct = this.hpPercent(this.playerHp, this.PLAYER_MAX_HP);
    const streakDots = Array.from({ length: this.STREAK_FOR_ULT }, (_, i) =>
      `<span class="boss-streak-dot ${i < this.streak ? 'on' : ''}"></span>`
    ).join('');

    panel.innerHTML = `
      <div class="boss-arena" id="bossArena">
        <div class="boss-arena-bg"></div>
        <div class="boss-arena-flash" id="bossArenaFlash"></div>
        <div class="boss-lightning-layer" id="bossLightningLayer"></div>
        <p class="boss-taunt">${this.boss.taunt}</p>
        <div class="boss-fighters">
          <div class="boss-fighter boss-fighter--player">
            <div class="boss-fighter-sprite boss-pikachu" id="bossPikachu">⚡</div>
            <div class="boss-fighter-name">皮卡丘</div>
            <div class="boss-hpbar">
              <div class="boss-hpbar-fill boss-hpbar-fill--player" style="width:${playerPct}%"></div>
            </div>
            <div class="boss-hp-text">${this.playerHp} / ${this.PLAYER_MAX_HP}</div>
          </div>
          <div class="boss-vs">VS</div>
          <div class="boss-fighter boss-fighter--enemy">
            <div class="boss-fighter-sprite boss-enemy-sprite" id="bossEnemy">${this.boss.emoji}</div>
            <div class="boss-fighter-name">${this.boss.name}</div>
            <div class="boss-hpbar">
              <div class="boss-hpbar-fill boss-hpbar-fill--boss" style="width:${bossPct}%"></div>
            </div>
            <div class="boss-hp-text">${this.bossHp} / ${this.BOSS_MAX_HP}</div>
          </div>
        </div>
        <div class="boss-streak-row">
          <span>連續答對</span>
          <div class="boss-streak-dots">${streakDots}</div>
          <span class="boss-streak-hint">滿 3 題 → 十萬伏特</span>
        </div>
        <div class="boss-ultimate-banner hidden" id="bossUltimateBanner">十萬伏特！！！</div>
      </div>
    `;
  },

  shakeTarget(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.classList.remove('boss-shake');
    void el.offsetWidth;
    el.classList.add('boss-shake');
  },

  playUltimate(onDone) {
    const arena = document.getElementById('bossArena');
    const banner = document.getElementById('bossUltimateBanner');
    const flash = document.getElementById('bossArenaFlash');
    const layer = document.getElementById('bossLightningLayer');
    if (!arena) {
      onDone?.();
      return;
    }

    AudioManager.playSfx('bossUltimate');
    arena.classList.add('boss-ultimate-active');
    banner?.classList.remove('hidden');
    flash?.classList.add('active');
    if (layer) {
      layer.innerHTML = Array.from({ length: 6 }, (_, i) =>
        `<div class="boss-bolt boss-bolt-${i + 1}"></div>`
      ).join('');
    }
    this.shakeTarget('bossEnemy');

    clearTimeout(this._ultimateTimer);
    this._ultimateTimer = setTimeout(() => {
      arena.classList.remove('boss-ultimate-active');
      banner?.classList.add('hidden');
      flash?.classList.remove('active');
      if (layer) layer.innerHTML = '';
      onDone?.();
    }, 1600);
  },

  onHitEffects(result) {
    if (result.correct) {
      this.shakeTarget('bossEnemy');
      AudioManager.playSfx(result.ultimate ? 'bossUltimate' : 'bossHit');
    } else {
      this.shakeTarget('bossPikachu');
      AudioManager.playSfx('bossHurt');
    }
    this.renderArena();
  }
};
