const AudioManager = {
  ctx: null,
  musicNodes: null,
  musicGain: null,
  unlocked: false,
  muteMusic: false,
  muteSfx: false,

  init() {
    document.addEventListener('click', () => this.ensureContext(), { once: true });
    document.addEventListener('touchstart', () => this.ensureContext(), { once: true });
    const s = typeof UserSettings !== 'undefined' ? UserSettings.load() : {};
    this.syncFromSettings(s);
  },

  syncFromSettings(settings) {
    this.muteMusic = !!settings.muteMusic;
    this.muteSfx = !!settings.muteSfx;
    if (this.musicGain) {
      this.musicGain.gain.value = this.muteMusic ? 0 : 0.08;
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
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(160, t + 0.2);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.26);
      return;
    }

    if (name === 'levelUp') {
      [392, 494, 587, 784].forEach((freq, i) => {
        const o = ctx.createOscillator();
        o.type = 'square';
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
    }
  },

  startMusic() {
    if (this.muteMusic || this.musicNodes) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.08;
    this.musicGain.connect(ctx.destination);

    const notes = [261.63, 329.63, 392, 493.88];
    this.musicNodes = notes.map((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.035 + (i % 2) * 0.01;
      o.connect(g);
      g.connect(this.musicGain);
      o.start();
      return { o, g, base: freq };
    });

    let step = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || this.muteMusic) return;
      step = (step + 1) % 16;
      this.musicNodes.forEach((node, i) => {
        const detune = ((step + i * 3) % 8) * 0.5;
        node.o.frequency.setTargetAtTime(node.base * (1 + detune * 0.01), this.ctx.currentTime, 0.4);
      });
    }, 900);
  },

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicNodes) {
      this.musicNodes.forEach(n => {
        try { n.o.stop(); } catch { /* already stopped */ }
      });
      this.musicNodes = null;
    }
    this.musicGain = null;
  }
};
