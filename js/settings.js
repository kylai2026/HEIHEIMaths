const UserSettings = {
  KEY: 'p5maths_settings',
  defaults: {
    fontSize: 'md',
    theme: 'light',
    muteMusic: false,
    muteSfx: false,
    grade: null
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return { ...this.defaults, ...(raw ? JSON.parse(raw) : {}) };
    } catch {
      return { ...this.defaults };
    }
  },

  save(partial) {
    const next = { ...this.load(), ...partial };
    localStorage.setItem(this.KEY, JSON.stringify(next));
    this.apply(next);
    return next;
  },

  apply(settings = this.load()) {
    const html = document.documentElement;
    html.dataset.theme = settings.theme === 'dark' ? 'dark' : 'light';
    html.classList.remove('font-sm', 'font-md', 'font-lg');
    html.classList.add(`font-${settings.fontSize || 'md'}`);

    document.querySelectorAll('[data-font]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === settings.fontSize);
    });

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.textContent = settings.theme === 'dark' ? '🌙' : '☀️';
      themeBtn.title = settings.theme === 'dark' ? '切換白日模式' : '切換夜晚模式';
    }

    const musicBtn = document.getElementById('muteMusic');
    if (musicBtn) {
      musicBtn.classList.toggle('muted', settings.muteMusic);
      musicBtn.title = settings.muteMusic ? '開啟背景音樂' : '關閉背景音樂';
    }

    const sfxBtn = document.getElementById('muteSfx');
    if (sfxBtn) {
      sfxBtn.classList.toggle('muted', settings.muteSfx);
      sfxBtn.title = settings.muteSfx ? '開啟音效' : '關閉音效';
    }

    const allBtn = document.getElementById('muteAll');
    if (allBtn) {
      const allMuted = settings.muteMusic && settings.muteSfx;
      allBtn.classList.toggle('muted', allMuted);
      allBtn.title = allMuted ? '取消全部靜音' : '全部靜音';
    }

    if (typeof AudioManager !== 'undefined') {
      AudioManager.syncFromSettings(settings);
    }
  },

  init() {
    this.apply();
    this.bindControls();
  },

  bindControls() {
    document.querySelectorAll('[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.save({ fontSize: btn.dataset.font });
        if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
      });
    });

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const s = this.load();
      this.save({ theme: s.theme === 'dark' ? 'light' : 'dark' });
      if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
    });

    document.getElementById('muteMusic')?.addEventListener('click', () => {
      const s = this.load();
      this.save({ muteMusic: !s.muteMusic });
    });

    document.getElementById('muteSfx')?.addEventListener('click', () => {
      const s = this.load();
      this.save({ muteSfx: !s.muteSfx });
    });

    document.getElementById('muteAll')?.addEventListener('click', () => {
      const s = this.load();
      const allMuted = s.muteMusic && s.muteSfx;
      this.save({ muteMusic: !allMuted, muteSfx: !allMuted });
    });
  }
};
