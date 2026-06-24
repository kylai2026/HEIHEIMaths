const AudioManager = {
  ctx: null,
  bgAudio: null,
  fallbackTimer: null,
  musicGain: null,
  unlocked: false,
  muteMusic: false,
  muteSfx: false,
  usingFallback: false,

  /* 柔和兒童背景音樂（Mixkit 免費授權） */
  BG_MUSIC_URL: 'https://assets.mixkit.co/music/preview/mixkit-happy-kids-876.mp3',

  init() {
    document.addEventListener('click', () => this.ensureContext(), { once: true });
    document.addEventListener('touchstart', () => this.ensureContext(), { once: true });
    const s = typeof UserSettings !== 'undefined' ? UserSettings.load() : {};
    this.syncFromSettings(s);
    this.initSpeech();
  },

  syncFromSettings(settings) {
    this.muteMusic = !!settings.muteMusic;
    this.muteSfx = !!settings.muteSfx;
    if (this.bgAudio) this.bgAudio.volume = this.muteMusic ? 0 : 0.22;
    if (this.musicGain) {
      this.musicGain.gain.value = this.muteMusic ? 0 : 0.06;
    }
    if (!this.muteMusic && this.unlocked) this.startMusic();
    else this.stopMusic();
  },

  ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.unlocked = true;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    if (!this.muteMusic) this.startMusic();
    return this.ctx;
  },

  _gachaLoopTimer: null,
  _bossMusicTimer: null,
  _bossMusicStep: 0,

  playGachaLoop(poolId, durationMs) {
    this.stopGachaLoop();
    if (this.muteSfx) return;
    const name = poolId === 'pokemon' ? 'gachaPulsePoke'
      : poolId === 'pixar' ? 'gachaPulsePixar'
      : poolId === 'disney' ? 'gachaPulseDisney'
      : poolId === 'marvel' ? 'gachaPulseMarvel'
      : 'gachaPulseCinna';
    const interval = poolId === 'pokemon' ? 360
      : poolId === 'pixar' ? 380
      : poolId === 'disney' ? 370
      : poolId === 'marvel' ? 350
      : 400;
    this.playSfx(name);
    this._gachaLoopTimer = setInterval(() => this.playSfx(name), interval);
    setTimeout(() => this.stopGachaLoop(), durationMs);
  },

  stopGachaLoop() {
    if (this._gachaLoopTimer) {
      clearInterval(this._gachaLoopTimer);
      this._gachaLoopTimer = null;
    }
  },

  playSfx(name) {
    if (this.muteSfx) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, t);

    if (name === 'click') {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(880, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.07);
      return;
    }

    if (name === 'correct') {
      [523, 659, 784].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.08);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.08);
        gg.gain.exponentialRampToValueAtTime(0.15, t + i * 0.08 + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.18);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.08);
        o.stop(t + i * 0.08 + 0.2);
      });
      return;
    }

    if (name === 'wrong') {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.2);
      g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.26);
      return;
    }

    if (name === 'levelUp') {
      [392, 494, 587, 784].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.1);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.1);
        gg.gain.exponentialRampToValueAtTime(0.08, t + i * 0.1 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 0.22);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.1);
        o.stop(t + i * 0.1 + 0.24);
      });
      return;
    }

    if (name === 'gachaPulsePoke') {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(320, t + 0.12);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(gg);
      gg.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.15);
      return;
    }

    if (name === 'gachaPulseCinna') {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(660, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.1);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(gg);
      gg.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.13);
      return;
    }

    if (name === 'gachaPulsePixar') {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(392, t);
      o.frequency.exponentialRampToValueAtTime(523, t + 0.1);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(gg);
      gg.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.13);
      return;
    }

    if (name === 'gachaPulseDisney') {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(523, t);
      o.frequency.exponentialRampToValueAtTime(784, t + 0.11);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      o.connect(gg);
      gg.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.14);
      return;
    }

    if (name === 'gachaPulseMarvel') {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(165, t);
      o.frequency.exponentialRampToValueAtTime(330, t + 0.1);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(gg);
      gg.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.13);
      return;
    }

    if (name === 'gachaPokemon') {
      for (let i = 0; i < 8; i++) {
        const o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(180 + i * 40, t + i * 0.07);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.07);
        gg.gain.exponentialRampToValueAtTime(0.06, t + i * 0.07 + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.08);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.07);
        o.stop(t + i * 0.07 + 0.09);
      }
      return;
    }

    if (name === 'gachaCinna') {
      [523, 659, 784, 988].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.15);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.15);
        gg.gain.exponentialRampToValueAtTime(0.07, t + i * 0.15 + 0.04);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.15 + 0.2);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.15);
        o.stop(t + i * 0.15 + 0.22);
      });
      return;
    }

    if (name === 'gachaPixar') {
      [262, 330, 392, 523, 659].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.12);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.12);
        gg.gain.exponentialRampToValueAtTime(0.065, t + i * 0.12 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.16);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.12);
        o.stop(t + i * 0.12 + 0.18);
      });
      return;
    }

    if (name === 'gachaDisney') {
      [392, 494, 587, 740, 988].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.14);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.14);
        gg.gain.exponentialRampToValueAtTime(0.07, t + i * 0.14 + 0.04);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.14 + 0.2);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.14);
        o.stop(t + i * 0.14 + 0.22);
      });
      return;
    }

    if (name === 'gachaMarvel') {
      [220, 277, 330, 440, 554, 659].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, t + i * 0.1);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.1);
        gg.gain.exponentialRampToValueAtTime(0.06, t + i * 0.1 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 0.14);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.1);
        o.stop(t + i * 0.1 + 0.15);
      });
      return;
    }

    if (name === 'gachaReveal') {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(440, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.15);
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.36);
      return;
    }

    if (name === 'gachaSR') {
      [494, 587, 740, 880].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.07);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.07);
        gg.gain.exponentialRampToValueAtTime(0.09, t + i * 0.07 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.22);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.07);
        o.stop(t + i * 0.07 + 0.24);
      });
      return;
    }

    if (name === 'gachaSSR') {
      [523, 659, 784, 1047, 1319].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.08);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.08);
        gg.gain.exponentialRampToValueAtTime(0.1, t + i * 0.08 + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.25);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.08);
        o.stop(t + i * 0.08 + 0.28);
      });
      return;
    }

    if (name === 'gachaUR') {
      [392, 494, 587, 740].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.09);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.09);
        gg.gain.exponentialRampToValueAtTime(0.08, t + i * 0.09 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.2);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.09);
        o.stop(t + i * 0.09 + 0.22);
      });
      return;
    }

    if (name === 'bossHit') {
      [220, 330, 440].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, t + i * 0.04);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.04);
        gg.gain.exponentialRampToValueAtTime(0.07, t + i * 0.04 + 0.01);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + 0.12);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.04);
        o.stop(t + i * 0.04 + 0.14);
      });
      return;
    }

    if (name === 'bossHurt') {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.3);
      return;
    }

    if (name === 'bossUltimate') {
      [110, 165, 220, 330, 440, 660, 880].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = i < 3 ? 'sawtooth' : 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.05);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.05);
        gg.gain.exponentialRampToValueAtTime(0.11, t + i * 0.05 + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.35);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.05);
        o.stop(t + i * 0.05 + 0.38);
      });
      return;
    }

    if (name === 'bossWin') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, t + i * 0.1);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.1);
        gg.gain.exponentialRampToValueAtTime(0.12, t + i * 0.1 + 0.03);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 0.35);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.1);
        o.stop(t + i * 0.1 + 0.38);
      });
      return;
    }

    if (name === 'bossLose') {
      [392, 330, 262, 196].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.15);
        const gg = ctx.createGain();
        gg.gain.setValueAtTime(0.0001, t + i * 0.15);
        gg.gain.exponentialRampToValueAtTime(0.08, t + i * 0.15 + 0.04);
        gg.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.15 + 0.4);
        o.connect(gg);
        gg.connect(ctx.destination);
        o.start(t + i * 0.15);
        o.stop(t + i * 0.15 + 0.42);
      });
    }
  },

  startMusic() {
    if (this.muteMusic) return;
    if (!this.usingFallback && !this.bgAudio) {
      this.bgAudio = new Audio(this.BG_MUSIC_URL);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.22;
      this.bgAudio.preload = 'auto';
      this.bgAudio.addEventListener('error', () => {
        this.bgAudio = null;
        this.startFallbackMusic();
      });
    }

    if (this.bgAudio && !this.usingFallback) {
      this.bgAudio.play().catch(() => this.startFallbackMusic());
      return;
    }

    if (!this.bgAudio) this.startFallbackMusic();
  },

  startFallbackMusic() {
    if (this.muteMusic || this.usingFallback) return;
    this.usingFallback = true;
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio = null;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.06;
    this.musicGain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.connect(this.musicGain);

    /* 柔和五声音阶，像音乐盒 */
    const melody = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
    let step = 0;

    const playNote = () => {
      if (!this.ctx || this.muteMusic || !this.usingFallback) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = melody[step % melody.length];
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g);
      g.connect(filter);
      o.start(t);
      o.stop(t + 1.7);
      step++;
    };

    playNote();
    this.fallbackTimer = setInterval(playNote, 1800);
  },

  stopMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }

    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    this.usingFallback = false;
    this.musicGain = null;
  },

  startBossMusic() {
    if (this.muteMusic) return;
    if (this._bossMusicTimer) {
      clearInterval(this._bossMusicTimer);
      this._bossMusicTimer = null;
    }
    this.stopMusic();

    const ctx = this.ensureContext();
    if (!ctx) return;

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.09;
    this.musicGain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    filter.connect(this.musicGain);

    this._bossMusicStep = 0;
    const battleNotes = [110, 131, 165, 196, 220, 262, 294, 330];
    const playBattleNote = () => {
      if (!this._bossMusicTimer) return;
      const t = ctx.currentTime;
      const freq = battleNotes[this._bossMusicStep % battleNotes.length];
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g);
      g.connect(filter);
      o.start(t);
      o.stop(t + 0.16);
      this._bossMusicStep++;
    };

    playBattleNote();
    this._bossMusicTimer = setInterval(playBattleNote, 280);
  },

  stopBossMusic() {
    if (this._bossMusicTimer) {
      clearInterval(this._bossMusicTimer);
      this._bossMusicTimer = null;
    }
    this._bossMusicStep = 0;
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
    if (!this.muteMusic) this.startMusic();
  },

  _speechVoices: null,

  initSpeech() {
    if (!window.speechSynthesis) return;
    const load = () => { this._speechVoices = speechSynthesis.getVoices(); };
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
  },

  _cantoneseVoiceScore(v) {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();

    if (lang === 'yue-hk' || lang.startsWith('yue-')) return 100;
    if (lang === 'zh-hk') return 95;
    if (/cantonese|hong\s*kong|粵語|广东话|廣東話|廣東|tracy|sin-ji|sinji/.test(name)) return 90;
    if (/google/.test(name) && lang === 'zh-hk') return 92;

    if (lang === 'zh-cn' || lang.startsWith('zh-cn')) return 0;
    if (/huihui|kangkang|yaoyao|yunxi|xiaoxiao|mandarin|国语|國語|普通話|普通话|简体|簡體|mainland/.test(name)) return 0;
    if (lang === 'zh-tw' && !/cantonese|hong\s*kong|粵|廣東|hk/.test(name)) return 0;

    return 0;
  },

  refreshSpeechVoices() {
    if (!window.speechSynthesis) return [];
    this._speechVoices = speechSynthesis.getVoices();
    return this._speechVoices;
  },

  getCantoneseVoice() {
    const voices = this.refreshSpeechVoices();
    const ranked = voices
      .map(v => ({ v, score: this._cantoneseVoiceScore(v) }))
      .filter(x => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const pref = (v) => {
          const n = (v.name || '').toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          if (/google/.test(n) && lang === 'zh-hk') return 3;
          if (lang.startsWith('yue')) return 2;
          return v.localService ? 0 : 1;
        };
        return pref(b.v) - pref(a.v);
      });
    return ranked[0]?.v || null;
  },

  _cantoneseHintShown: false,

  _showCantoneseVoiceHint() {
    if (this._cantoneseHintShown) return;
    this._cantoneseHintShown = true;
    setTimeout(() => {
      alert('搵唔到粵語語音。\n\n建議：\n1. 用 Microsoft Edge 瀏覽器\n2. 喺 Windows「設定 → 時間與語言 → 語音」安裝「中文（香港）」語音\n3. 重新整理頁面再試');
    }, 300);
  },

  questionToSpeechText(html) {
    let text = String(html || '');
    text = text.replace(
      /<span class="frac">\s*<span class="num">([^<]*)<\/span>\s*<span class="den">([^<]*)<\/span>\s*<\/span>/gi,
      '$2分之$1'
    );
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/(\d+)\s*\/\s*(\d+)/g, '$2分之$1');
    text = text.replace(/哪一/g, '邊一');
    text = text.replace(/哪個/g, '邊個');
    text = text.replace(/哪樣/g, '邊樣');
    text = text.replace(/這是/g, '係');
    text = text.replace(/这是/g, '係');
    text = text.replace(/cm/gi, '厘米');
    text = text.replace(/km/gi, '公里');
    text = text.replace(/(\d)\s*米/g, '$1米');
    text = text.replace(/×/g, '乘');
    text = text.replace(/÷/g, '除');
    text = text.replace(/\+/g, '加');
    text = text.replace(/−|–|-/g, '減');
    text = text.replace(/=/g, '等於');
    text = text.replace(/\?/g, '？');
    return text;
  },

  stopSpeaking() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  },

  speakQuestion(htmlOrText) {
    if (!window.speechSynthesis) {
      alert('你嘅瀏覽器唔支援朗讀功能');
      return;
    }
    const text = this.questionToSpeechText(htmlOrText);
    if (!text) return;

    const start = () => {
      this.stopSpeaking();
      const voice = this.getCantoneseVoice();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.pitch = 1.02;

      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang || 'zh-HK';
      } else {
        utter.lang = 'zh-HK';
        this._showCantoneseVoiceHint();
      }

      speechSynthesis.speak(utter);
    };

    if (!this.refreshSpeechVoices().length) {
      speechSynthesis.addEventListener('voiceschanged', () => start(), { once: true });
      speechSynthesis.getVoices();
      return;
    }
    start();
  }
};
