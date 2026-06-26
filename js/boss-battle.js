/** BOSS 關卡：比卡超答題連戰 3 關 BOSS */
const BossBattle = {
  DAMAGE: { easy: 10, medium: 18, hard: 28 },
  ULTIMATE_EXTRA: 35,
  PLAYER_DEX: 25,

  STAGES: [
    {
      id: 1,
      label: '第一關',
      bossMaxHp: 70,
      playerMaxHp: 85,
      counter: 10,
      damageScale: 1,
      streakForUlt: 3,
      tierBias: { easy: 0.45, medium: 0.45, hard: 0.1 }
    },
    {
      id: 2,
      label: '第二關',
      bossMaxHp: 105,
      playerMaxHp: 85,
      counter: 14,
      damageScale: 0.92,
      streakForUlt: 3,
      healOnEnter: 12,
      tierBias: { easy: 0.2, medium: 0.5, hard: 0.3 }
    },
    {
      id: 3,
      label: '最終關',
      bossMaxHp: 145,
      playerMaxHp: 85,
      counter: 18,
      damageScale: 0.82,
      streakForUlt: 4,
      tierBias: { easy: 0.08, medium: 0.32, hard: 0.6 }
    }
  ],

  BOSS_ENEMY_DEX: Array.from({ length: 100 }, (_, i) => i + 1).filter(d => d !== 25),

  DEFAULT_TAUNTS: ['出招吧！', '接招！', '不會放過你！', '全力一擊！'],

  TAUNTS_BY_TYPE: {
    '草': ['飛葉快刀！', '藤鞭出擊！', '種子機關槍！'],
    '火': ['火焰旋渦！', '噴射火焰！', '燃燒吧！'],
    '水': ['水砲！', '衝浪！', '浪潮來襲！'],
    '電': ['十萬伏特…等等，係我嘅專長！', '電光一閃！', '放電！'],
    '毒': ['毒粉！', '溶解液！', '毒系攻擊！'],
    '地面': ['地震！', '落石！', '沙暴！'],
    '飛行': ['空氣斬！', '俯衝攻擊！', '旋風刀！'],
    '超能力': ['精神強念！', '幻象光線！', '催眠術！'],
    '蟲': ['連環腿！', '超音波！', '憤怒粉！'],
    '岩石': ['岩石封鎖！', '硬撐！', '岩崩！'],
    '鬼': ['暗影球！', '惡作劇！', '詛咒！'],
    '格鬥': ['近身戰！', '地球上投！', '爆裂拳！'],
    '一般': ['撞擊！', '大聲咆哮！', '猛撞！']
  },

  currentStage: 1,
  boss: null,
  bossHp: 0,
  playerHp: 0,
  streak: 0,
  lastResult: null,
  _ultimateTimer: null,

  getStageConfig(stage = this.currentStage) {
    return this.STAGES[stage - 1] || this.STAGES[0];
  },

  getBossMaxHp() {
    return this.getStageConfig().bossMaxHp;
  },

  getPlayerMaxHp() {
    return this.getStageConfig().playerMaxHp;
  },

  getStreakForUlt() {
    return this.getStageConfig().streakForUlt;
  },

  playerSpriteUrl() {
    return typeof pokemonSpriteUrl === 'function'
      ? pokemonSpriteUrl(this.PLAYER_DEX)
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.PLAYER_DEX}.png`;
  },

  playerFallbackUrl() {
    return typeof pokemonFallbackUrl === 'function'
      ? pokemonFallbackUrl(this.PLAYER_DEX)
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.PLAYER_DEX}.png`;
  },

  genRandomEnemy() {
    const dex = MathUtils.randomChoice(this.BOSS_ENEMY_DEX);
    const type = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[dex])
      || MathUtils.randomChoice(['一般', '草', '火', '水', '電', '毒', '飛行', '地面']);
    const name = (typeof POKEMON_NAMES !== 'undefined' && POKEMON_NAMES[dex]) || `寶可夢 #${dex}`;
    const taunts = this.TAUNTS_BY_TYPE[type] || this.DEFAULT_TAUNTS;
    const appearance = {
      scale: MathUtils.roundTo(0.88 + Math.random() * 0.28, 2),
      hue: MathUtils.randomInt(-28, 28),
      brightness: MathUtils.roundTo(0.9 + Math.random() * 0.18, 2),
      aura: MathUtils.randomChoice(['#ef4444', '#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'])
    };
    return {
      dexId: dex,
      name,
      type,
      taunt: MathUtils.randomChoice(taunts),
      imageUrl: typeof pokemonSpriteUrl === 'function' ? pokemonSpriteUrl(dex) : '',
      fallbackUrl: typeof pokemonFallbackUrl === 'function' ? pokemonFallbackUrl(dex) : '',
      appearance
    };
  },

  reset() {
    this.currentStage = 1;
    this.boss = this.genRandomEnemy();
    const cfg = this.getStageConfig();
    this.bossHp = cfg.bossMaxHp;
    this.playerHp = cfg.playerMaxHp;
    this.streak = 0;
    this.lastResult = null;
  },

  advanceToNextStage() {
    if (this.currentStage >= this.STAGES.length) return;
    this.currentStage++;
    const cfg = this.getStageConfig();
    this.boss = this.genRandomEnemy();
    this.bossHp = cfg.bossMaxHp;
    if (cfg.healOnEnter) {
      this.playerHp = Math.min(cfg.playerMaxHp, this.playerHp + cfg.healOnEnter);
    }
    this.streak = 0;
    this.lastResult = null;
  },

  pickTier(bias) {
    const r = Math.random();
    let acc = 0;
    for (const [tier, weight] of Object.entries(bias)) {
      acc += weight;
      if (r < acc) return tier;
    }
    return 'medium';
  },

  ensureQuestions(grade, min = 15) {
    if (!App.state.bossQuestionQueue) App.state.bossQuestionQueue = [];
    const q = App.state.bossQuestionQueue;
    const topics = grade
      ? getExamTopicsByGrade(grade)
      : TOPICS.filter(t => t.exam).map(t => t.id);
    const bias = this.getStageConfig().tierBias;
    while (q.length < min) {
      const tier = this.pickTier(bias);
      q.push(...QuestionBank.generateRandomSet(1, tier, topics));
    }
  },

  pullQuestions(count, grade) {
    this.ensureQuestions(grade, count);
    return App.state.bossQuestionQueue.splice(0, count);
  },

  getDamage(tier) {
    const base = this.DAMAGE[tier] || this.DAMAGE.medium;
    return Math.max(6, Math.round(base * this.getStageConfig().damageScale));
  },

  resolveAnswer(correct, tier) {
    const tierInfo = DIFFICULTY_TIERS[tier] || DIFFICULTY_TIERS.medium;
    const cfg = this.getStageConfig();
    const streakForUlt = cfg.streakForUlt;
    const result = {
      correct,
      damage: 0,
      ultimate: false,
      stageCleared: false,
      bossDefeated: false,
      runComplete: false,
      playerDefeated: false,
      playerDamage: 0,
      tierLabel: tierInfo.name,
      message: ''
    };

    if (!correct) {
      this.streak = 0;
      result.playerDamage = cfg.counter;
      this.playerHp = Math.max(0, this.playerHp - cfg.counter);
      result.playerDefeated = this.playerHp <= 0;
      result.message = `BOSS 反擊！比卡超 -${cfg.counter} HP`;
      this.lastResult = result;
      return result;
    }

    this.streak++;
    let damage = this.getDamage(tier);
    if (this.streak >= streakForUlt) {
      result.ultimate = true;
      damage += this.ULTIMATE_EXTRA;
      this.streak = 0;
    }

    this.bossHp = Math.max(0, this.bossHp - damage);
    result.damage = damage;

    if (this.bossHp <= 0) {
      if (this.currentStage >= this.STAGES.length) {
        result.bossDefeated = true;
        result.runComplete = true;
      } else {
        result.stageCleared = true;
      }
    }

    result.message = result.ultimate
      ? `十萬伏特！造成 ${damage} 傷害！`
      : `${tierInfo.name}答對！-${damage} HP`;
    this.lastResult = result;
    return result;
  },

  hpPercent(current, max) {
    return Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  },

  enemySpriteStyle(boss) {
    const a = boss.appearance || {};
    return [
      `--boss-scale:${a.scale || 1}`,
      `--boss-hue:${a.hue || 0}deg`,
      `--boss-bright:${a.brightness || 1}`,
      `--boss-aura:${a.aura || '#f59e0b'}`
    ].join(';');
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

    const cfg = this.getStageConfig();
    const bossMax = cfg.bossMaxHp;
    const playerMax = cfg.playerMaxHp;
    const bossPct = this.hpPercent(this.bossHp, bossMax);
    const playerPct = this.hpPercent(this.playerHp, playerMax);
    const streakForUlt = cfg.streakForUlt;
    const streakDots = Array.from({ length: streakForUlt }, (_, i) =>
      `<span class="boss-streak-dot ${i < this.streak ? 'on' : ''}"></span>`
    ).join('');
    const playerImg = this.playerSpriteUrl();
    const playerFb = this.playerFallbackUrl();
    const enemyStyle = this.enemySpriteStyle(this.boss);

    panel.innerHTML = `
      <div class="boss-arena" id="bossArena">
        <div class="boss-arena-bg boss-arena-bg--stage-${this.currentStage}"></div>
        <div class="boss-arena-flash" id="bossArenaFlash"></div>
        <div class="boss-lightning-layer" id="bossLightningLayer"></div>
        <div class="boss-stage-badge">第 ${this.currentStage} / ${this.STAGES.length} 關 · ${cfg.label}</div>
        <p class="boss-taunt">${this.boss.type}系 · ${this.boss.taunt}</p>
        <div class="boss-fighters">
          <div class="boss-fighter boss-fighter--player">
            <div class="boss-fighter-sprite-wrap">
              <img src="${playerImg}" alt="比卡超" class="boss-sprite-img boss-pikachu-img" id="bossPikachu"
                onerror="this.onerror=null;this.src='${playerFb}'">
            </div>
            <div class="boss-fighter-name">比卡超</div>
            <div class="boss-hpbar">
              <div class="boss-hpbar-fill boss-hpbar-fill--player" style="width:${playerPct}%"></div>
            </div>
            <div class="boss-hp-text">${this.playerHp} / ${playerMax}</div>
          </div>
          <div class="boss-vs">VS</div>
          <div class="boss-fighter boss-fighter--enemy">
            <div class="boss-fighter-sprite-wrap boss-enemy-aura" style="${enemyStyle}">
              <img src="${this.boss.imageUrl}" alt="${this.boss.name}" class="boss-sprite-img boss-enemy-img" id="bossEnemy"
                style="${enemyStyle}"
                onerror="this.onerror=null;this.src='${this.boss.fallbackUrl}'">
            </div>
            <div class="boss-fighter-name">${this.boss.name}</div>
            <div class="boss-hpbar">
              <div class="boss-hpbar-fill boss-hpbar-fill--boss" style="width:${bossPct}%"></div>
            </div>
            <div class="boss-hp-text">${this.bossHp} / ${bossMax}</div>
          </div>
        </div>
        <div class="boss-streak-row">
          <span>連續答對</span>
          <div class="boss-streak-dots">${streakDots}</div>
          <span class="boss-streak-hint">滿 ${streakForUlt} 題 → 十萬伏特</span>
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
