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
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.unlocked = true;
    if (!this.muteMusic) this.startMusic();
    return this.ctx;
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
  }
};
