/* 抽卡動畫：寶可夢、Sanrio、PIXAR、DISNEY、MARVEL */
const GachaAnimation = {
  ASSETS: {
    pokemon: 'assets/img/gacha-anim-pokemon-v2.png',
    sanrio: 'assets/img/gacha-anim-cinnamoroll-v2.png',
    pixar: '',
    disney: '',
    marvel: ''
  },

  DURATION: { pokemon: 3400, sanrio: 3600, pixar: 3600, disney: 3800, marvel: 3900 },
  REVEAL_STAGGER: 120,

  _raf: null,
  _running: false,
  _waitingTap: false,
  _pending: null,
  _timers: [],

  play(poolId, items, onDone) {
    if (this._running) return;
    this._running = true;
    this._waitingTap = true;
    this._pending = { poolId, items, onDone };

    const modal = document.getElementById('gachaModal');
    const stage = document.getElementById('gachaAnimStage');
    const area = document.getElementById('gachaResultArea');
    const closeBtn = document.getElementById('gachaModalClose');
    const tapBtn = document.getElementById('gachaTapStart');
    const bestRarity = this._bestRarity(items);

    area.classList.add('hidden');
    area.innerHTML = '';
    closeBtn.classList.add('hidden');
    modal.classList.remove('hidden');
    modal.querySelector('.gacha-modal')?.classList.remove('gacha-modal--results', 'is-animating');

    stage.className = `gacha-anim-stage anim-${poolId} gacha-waiting${this._tierClass(bestRarity)}`;
    stage.innerHTML = this._waitingHtml(poolId, bestRarity);

    if (tapBtn) {
      tapBtn.classList.remove('hidden');
      tapBtn.onclick = () => this._startFromTap();
    }
  },

  _animFamily(poolId) {
    if (poolId === 'sanrio' || poolId === 'cinnamoroll') return 'sanrio';
    if (poolId === 'pixar') return 'pixar';
    if (poolId === 'disney') return 'disney';
    if (poolId === 'marvel') return 'marvel';
    return 'pokemon';
  },

  _waitingHtml(poolId, rarity) {
    const family = this._animFamily(poolId);
    const asset = this.ASSETS[family];
    const bgStyle = (family === 'pixar' || family === 'disney' || family === 'marvel')
      ? ''
      : `style="background-image:url('${asset}')"`;
    const label = family === 'pokemon'
      ? '⚡ 準備收服…'
      : family === 'pixar'
        ? '🎬 準備開演…'
        : family === 'disney'
          ? '🏰 童話即將降臨…'
          : family === 'marvel'
            ? '🦸 英雄即將登場…'
            : '🎀 準備召喚…';
    const bgEl = family === 'pixar'
      ? '<div class="gacha-anim-bg pixar-cinema-bg"></div>'
      : family === 'disney'
        ? '<div class="gacha-anim-bg disney-kingdom-bg"></div>'
        : family === 'marvel'
          ? '<div class="gacha-anim-bg marvel-comic-bg"></div>'
          : `<div class="gacha-anim-bg gacha-waiting-bg" ${bgStyle}></div>`;
    return `
      ${bgEl}
      <div class="gacha-anim-vignette"></div>
      <p class="gacha-anim-text gacha-waiting-text">${label}</p>
      ${rarity === 'ssr' || rarity === 'ur' || rarity === 'sr' ? `<p class="gacha-anim-sub gacha-waiting-sub">✨ 感應到稀有光芒…</p>` : ''}
    `;
  },

  _startFromTap() {
    if (!this._waitingTap || !this._pending) return;
    this._waitingTap = false;

    const tapBtn = document.getElementById('gachaTapStart');
    if (tapBtn) {
      tapBtn.classList.add('hidden');
      tapBtn.onclick = null;
    }

    if (typeof AudioManager !== 'undefined') {
      AudioManager.ensureContext();
      AudioManager.playSfx('click');
    }

    const { poolId, items, onDone } = this._pending;
    this._runAnimation(poolId, items, onDone);
  },

  skipToResult() {
    if (!this._pending) return;
    this._clearTimers();
    this._stopParticles();
    if (typeof AudioManager !== 'undefined') AudioManager.stopGachaLoop();

    const tapBtn = document.getElementById('gachaTapStart');
    if (tapBtn) {
      tapBtn.classList.add('hidden');
      tapBtn.onclick = null;
    }

    const stage = document.getElementById('gachaAnimStage');
    const modal = document.querySelector('.gacha-modal');
    if (stage) {
      stage.innerHTML = '';
      stage.className = 'gacha-anim-stage';
    }
    modal?.classList.remove('is-animating');

    const onDone = this._pending.onDone;
    this._pending = null;
    this._waitingTap = false;
    this._running = false;
    onDone?.();
  },

  _runAnimation(poolId, items, onDone) {
    const modal = document.getElementById('gachaModal');
    const stage = document.getElementById('gachaAnimStage');
    const bestRarity = this._bestRarity(items);

    stage.className = `gacha-anim-stage anim-${poolId}${this._tierClass(bestRarity)}`;
    const family = this._animFamily(poolId);
    stage.innerHTML = family === 'pokemon'
      ? this._pokemonHtml(bestRarity)
      : family === 'pixar'
        ? this._pixarHtml(bestRarity)
        : family === 'disney'
          ? this._disneyHtml(bestRarity)
          : family === 'marvel'
            ? this._marvelHtml(bestRarity)
            : this._cinnaHtml(bestRarity);

    modal.querySelector('.gacha-modal')?.classList.add('is-animating');

    if (typeof AudioManager !== 'undefined') {
      AudioManager.ensureContext();
      const sfx = family === 'pokemon' ? 'gachaPokemon'
        : family === 'pixar' ? 'gachaPixar'
        : family === 'disney' ? 'gachaDisney'
        : family === 'marvel' ? 'gachaMarvel'
        : 'gachaCinna';
      AudioManager.playSfx(sfx);
    }

    const canvas = stage.querySelector('canvas');
    if (canvas) this._startParticles(canvas, poolId, bestRarity);

    const base = this.DURATION[poolId] || 3000;
    const bonus = bestRarity === 'ssr' ? 1800 : bestRarity === 'ur' ? 1200 : bestRarity === 'sr' ? 700 : 0;
    const ms = base + bonus + (items.length > 1 ? 500 : 0);

    if (typeof AudioManager !== 'undefined') {
      AudioManager.playGachaLoop(poolId, ms);
    }

    this._timers.push(setTimeout(() => {
      this._triggerFinale(stage, poolId, bestRarity);
    }, ms - 600));

    this._timers.push(setTimeout(() => {
      this._stopParticles();
      if (typeof AudioManager !== 'undefined') AudioManager.stopGachaLoop();
      stage.classList.add('anim-out');
      this._timers.push(setTimeout(() => {
        stage.innerHTML = '';
        stage.className = 'gacha-anim-stage';
        modal.querySelector('.gacha-modal')?.classList.remove('is-animating');
        this._running = false;
        this._pending = null;
        if (typeof AudioManager !== 'undefined') AudioManager.playSfx('gachaReveal');
        onDone();
      }, 380));
    }, ms));
  },

  _clearTimers() {
    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];
  },

  _bestRarity(items) {
    const order = ['common', 'rare', 'sr', 'ur', 'ssr'];
    let best = 0;
    for (const item of items) {
      const idx = order.indexOf(item.rarity);
      if (idx > best) best = idx;
    }
    return order[best];
  },

  _tierClass(rarity) {
    if (rarity === 'ssr') return ' anim-tier-ssr';
    if (rarity === 'ur') return ' anim-tier-ur';
    if (rarity === 'sr') return ' anim-tier-sr';
    return '';
  },

  _rarityOverlay(rarity, poolId) {
    const family = this._animFamily(poolId);
    const sub = family === 'pokemon' ? 'poke'
      : family === 'pixar' ? 'pixar'
      : family === 'disney' ? 'disney'
      : family === 'marvel' ? 'marvel'
      : 'cinna';
    const urIcon = family === 'pokemon' ? '⭐'
      : family === 'pixar' ? '🎬'
      : family === 'disney' ? '✨'
      : family === 'marvel' ? '🛡️'
      : '💎';
    const ssrIcon = family === 'pokemon' ? '⚡'
      : family === 'pixar' ? '🏆'
      : family === 'disney' ? '👑'
      : family === 'marvel' ? '🦸'
      : '👑';
    if (rarity === 'sr') {
      return `
        <div class="gacha-sr-overlay" aria-hidden="true">
          <div class="gacha-sr-ring r1"></div>
          <div class="gacha-sr-ring r2"></div>
          <div class="gacha-sr-ring r3"></div>
          <div class="gacha-sr-sparkles"><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div>
        </div>
        <p class="gacha-anim-sub ${sub}-sub sr-hint">💜 超稀有 · 紫光凝聚中！</p>
      `;
    }
    if (rarity === 'ur') {
      return `
        <div class="gacha-ur-overlay" aria-hidden="true">
          <div class="gacha-ur-sunburst"></div>
          <div class="gacha-ur-orbit o1"></div>
          <div class="gacha-ur-orbit o2"></div>
          <div class="gacha-ur-gems"><span>✧</span><span>✧</span><span>✧</span><span>✧</span><span>✧</span><span>✧</span></div>
          <div class="gacha-ur-glow"></div>
          <div class="gacha-ur-icon">${urIcon}</div>
        </div>
        <p class="gacha-anim-sub ${sub}-sub ur-hint">🌟 極稀有 · 金光綻放中！</p>
      `;
    }
    if (rarity === 'ssr') {
      return `
        <div class="gacha-ssr-overlay" aria-hidden="true">
          <div class="gacha-ssr-beams"></div>
          <div class="gacha-ssr-rainbow"></div>
          <div class="gacha-ssr-crown">${ssrIcon}</div>
          <div class="gacha-ssr-flare"></div>
        </div>
        <p class="gacha-anim-sub ${sub}-sub ssr-hint">🔥 傳說 · 彩虹降臨！</p>
      `;
    }
    return '';
  },

  _triggerFinale(stage, poolId, rarity) {
    if (!stage) return;
    stage.classList.add('anim-finale');
    if (rarity === 'sr' || rarity === 'ur' || rarity === 'ssr') {
      stage.classList.add(`anim-finale-${rarity}`);
      if (typeof AudioManager !== 'undefined') {
        AudioManager.ensureContext();
        const sfx = rarity === 'ssr' ? 'gachaSSR' : rarity === 'ur' ? 'gachaUR' : 'gachaSR';
        AudioManager.playSfx(sfx);
      }
    }
    const flash = stage.querySelector('.gacha-anim-flash');
    if (flash) flash.classList.add('flash-burst');
    const core = stage.querySelector('.gacha-anim-core');
    if (core) core.classList.add('core-burst');
  },

  _pokemonHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg" style="background-image:url('${this.ASSETS.pokemon}')"></div>
      <div class="gacha-anim-aurora poke-aurora"></div>
      <div class="gacha-anim-rays poke-rays"></div>
      <div class="gacha-anim-vignette poke-vignette"></div>
      <canvas class="gacha-anim-canvas" aria-hidden="true"></canvas>
      <div class="gacha-anim-core poke-core ${burst}">
        <div class="gacha-shockwave s1"></div>
        <div class="gacha-shockwave s2"></div>
        <div class="gacha-shockwave s3"></div>
        <div class="poke-orb">
          <div class="poke-orb-top"></div>
          <div class="poke-orb-mid"></div>
          <div class="poke-orb-bottom"></div>
          <div class="poke-orb-shine"></div>
          <div class="poke-orb-glow"></div>
        </div>
        <div class="poke-ring ring-1"></div>
        <div class="poke-ring ring-2"></div>
        <div class="poke-ring ring-3"></div>
        <div class="poke-lightning l1"></div>
        <div class="poke-lightning l2"></div>
        <div class="poke-lightning l3"></div>
      </div>
      <div class="gacha-anim-flash poke-flash"></div>
      <div class="gacha-anim-sparkles poke-sparkles"></div>
      ${this._rarityOverlay(rarity, 'pokemon')}
      <p class="gacha-anim-text poke-text">⚡ 收服中…</p>
    `;
  },

  _pixarHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg pixar-cinema-bg"></div>
      <div class="gacha-anim-aurora pixar-aurora"></div>
      <div class="gacha-anim-rays pixar-rays"></div>
      <div class="gacha-anim-vignette pixar-vignette"></div>
      <canvas class="gacha-anim-canvas" aria-hidden="true"></canvas>
      <div class="gacha-anim-core pixar-core ${burst}">
        <div class="gacha-shockwave s1"></div>
        <div class="gacha-shockwave s2"></div>
        <div class="gacha-shockwave s3"></div>
        <div class="pixar-spotlight"></div>
        <div class="pixar-reel">
          <div class="pixar-reel-hub"></div>
          <div class="pixar-reel-hole h1"></div>
          <div class="pixar-reel-hole h2"></div>
          <div class="pixar-reel-hole h3"></div>
          <div class="pixar-reel-hole h4"></div>
        </div>
        <div class="pixar-clapper">
          <div class="pixar-clapper-top"></div>
          <div class="pixar-clapper-bottom"></div>
        </div>
        <div class="pixar-film-strip f1"></div>
        <div class="pixar-film-strip f2"></div>
        <div class="pixar-float-star fs1">★</div>
        <div class="pixar-float-star fs2">🎬</div>
        <div class="pixar-float-star fs3">★</div>
      </div>
      <div class="gacha-anim-flash pixar-flash"></div>
      <div class="gacha-anim-sparkles pixar-sparkles"></div>
      ${this._rarityOverlay(rarity, 'pixar')}
      <p class="gacha-anim-text pixar-text">🎬 首映中…</p>
    `;
  },

  _disneyHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg disney-kingdom-bg"></div>
      <div class="gacha-anim-aurora disney-aurora"></div>
      <div class="gacha-anim-rays disney-rays"></div>
      <div class="gacha-anim-vignette disney-vignette"></div>
      <canvas class="gacha-anim-canvas" aria-hidden="true"></canvas>
      <div class="gacha-anim-core disney-core ${burst}">
        <div class="gacha-shockwave s1"></div>
        <div class="gacha-shockwave s2"></div>
        <div class="gacha-shockwave s3"></div>
        <div class="disney-castle">
          <div class="disney-castle-tower t1"></div>
          <div class="disney-castle-tower t2"></div>
          <div class="disney-castle-tower t3"></div>
          <div class="disney-castle-base"></div>
          <div class="disney-castle-gate"></div>
        </div>
        <div class="disney-wand">
          <div class="disney-wand-stick"></div>
          <div class="disney-wand-star"></div>
          <div class="disney-wand-trail"></div>
        </div>
        <div class="disney-firework fw1"></div>
        <div class="disney-firework fw2"></div>
        <div class="disney-firework fw3"></div>
        <div class="disney-storybook">
          <div class="disney-book-cover"></div>
          <div class="disney-book-pages"></div>
          <div class="disney-book-glow"></div>
        </div>
        <div class="disney-ears e1"></div>
        <div class="disney-ears e2"></div>
        <div class="disney-float-star fs1">✦</div>
        <div class="disney-float-star fs2">🏰</div>
        <div class="disney-float-star fs3">✦</div>
      </div>
      <div class="gacha-anim-flash disney-flash"></div>
      <div class="gacha-anim-sparkles disney-sparkles"></div>
      ${this._rarityOverlay(rarity, 'disney')}
      <p class="gacha-anim-text disney-text">✨ 童話降臨中…</p>
    `;
  },

  _marvelHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg marvel-comic-bg"></div>
      <div class="gacha-anim-aurora marvel-aurora"></div>
      <div class="gacha-anim-rays marvel-rays"></div>
      <div class="gacha-anim-vignette marvel-vignette"></div>
      <canvas class="gacha-anim-canvas" aria-hidden="true"></canvas>
      <div class="gacha-anim-core marvel-core ${burst}">
        <div class="gacha-shockwave s1"></div>
        <div class="gacha-shockwave s2"></div>
        <div class="gacha-shockwave s3"></div>
        <div class="marvel-shield">
          <div class="marvel-shield-star s1"></div>
          <div class="marvel-shield-star s2"></div>
          <div class="marvel-shield-star s3"></div>
          <div class="marvel-shield-ring"></div>
        </div>
        <div class="marvel-web w1"></div>
        <div class="marvel-web w2"></div>
        <div class="marvel-lightning bolt1"></div>
        <div class="marvel-lightning bolt2"></div>
        <div class="marvel-comic-panel p1"></div>
        <div class="marvel-comic-panel p2"></div>
        <div class="marvel-comic-panel p3"></div>
        <div class="marvel-hex h1"></div>
        <div class="marvel-hex h2"></div>
        <div class="marvel-float-icon fi1">🦸</div>
        <div class="marvel-float-icon fi2">💥</div>
        <div class="marvel-float-icon fi3">⚡</div>
      </div>
      <div class="gacha-anim-flash marvel-flash"></div>
      <div class="gacha-anim-sparkles marvel-sparkles"></div>
      ${this._rarityOverlay(rarity, 'marvel')}
      <p class="gacha-anim-text marvel-text">🦸 英雄集結中…</p>
    `;
  },

  _cinnaHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg" style="background-image:url('${this.ASSETS.sanrio}')"></div>
      <div class="gacha-anim-aurora cinna-aurora"></div>
      <div class="gacha-anim-rays cinna-rays"></div>
      <div class="gacha-anim-vignette cinna-vignette"></div>
      <canvas class="gacha-anim-canvas" aria-hidden="true"></canvas>
      <div class="gacha-anim-core cinna-core ${burst}">
        <div class="gacha-shockwave s1"></div>
        <div class="gacha-shockwave s2"></div>
        <div class="gacha-shockwave s3"></div>
        <div class="cinna-gift">
          <div class="cinna-gift-lid"></div>
          <div class="cinna-gift-box"></div>
          <div class="cinna-gift-bow"></div>
          <div class="cinna-gift-sparkle"></div>
        </div>
        <div class="cinna-cloud c1"></div>
        <div class="cinna-cloud c2"></div>
        <div class="cinna-cloud c3"></div>
        <div class="cinna-float-star fs1">✦</div>
        <div class="cinna-float-star fs2">♥</div>
        <div class="cinna-float-star fs3">✦</div>
        <div class="cinna-float-star fs4">♥</div>
      </div>
      <div class="gacha-anim-flash cinna-flash"></div>
      <div class="gacha-anim-sparkles cinna-sparkles"></div>
      ${this._rarityOverlay(rarity, 'sanrio')}
      <p class="gacha-anim-text cinna-text">🎀 召喚中…</p>
    `;
  },

  _startParticles(canvas, poolId, rarity) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const family = this._animFamily(poolId);
    const count = family === 'pokemon' ? 90
      : family === 'pixar' ? 85
      : family === 'disney' ? 95
      : family === 'marvel' ? 100
      : 80;
    const W = () => canvas.width;
    const H = () => canvas.height;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const palette = family === 'pokemon'
      ? ['#fbbf24', '#38bdf8', '#a78bfa', '#fef08a', '#ffffff']
      : family === 'pixar'
        ? ['#fbbf24', '#ef4444', '#fef08a', '#f97316', '#ffffff']
        : family === 'disney'
          ? ['#c4b5fd', '#f472b6', '#fef08a', '#38bdf8', '#ffffff', '#fde68a']
          : family === 'marvel'
            ? ['#dc2626', '#2563eb', '#fbbf24', '#ffffff', '#1e293b', '#ef4444']
            : ['#fda4af', '#bae6fd', '#fef08a', '#e9d5ff', '#ffffff'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 300,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * (family === 'pokemon' ? 4 : family === 'pixar' ? 3 : family === 'disney' ? 2.8 : family === 'marvel' ? 3.2 : 2.2),
        vy: (Math.random() - 0.5) * (family === 'pokemon' ? 4 : family === 'pixar' ? 3 : family === 'disney' ? 2.8 : family === 'marvel' ? 3.2 : 2.2),
        size: 2 + Math.random() * (family === 'pokemon' ? 4 : family === 'pixar' ? 4 : family === 'disney' ? 4.5 : family === 'marvel' ? 4 : 5),
        color: palette[Math.floor(Math.random() * palette.length)],
        life: Math.random(),
        shape: family === 'pokemon'
          ? (Math.random() > 0.6 ? 'bolt' : 'dot')
          : family === 'pixar'
            ? (Math.random() > 0.55 ? 'star' : 'dot')
            : family === 'disney'
              ? (Math.random() > 0.45 ? 'star' : 'dot')
              : family === 'marvel'
                ? (Math.random() > 0.5 ? 'bolt' : 'star')
                : (Math.random() > 0.5 ? 'heart' : 'star')
      });
    }

    if (rarity === 'sr') {
      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: W() / 2, y: H() / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 5,
          color: ['#9333ea', '#c084fc', '#e9d5ff', '#ffffff'][Math.floor(Math.random() * 4)],
          life: 1,
          shape: 'burst'
        });
      }
    }

    if (rarity === 'ur') {
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40;
        const speed = 2.5 + Math.random() * 5;
        particles.push({
          x: W() / 2, y: H() / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 6,
          color: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#fde68a'][Math.floor(Math.random() * 5)],
          life: 1,
          shape: 'burst'
        });
      }
    }

    if (rarity === 'ssr') {
      for (let i = 0; i < 70; i++) {
        const angle = (Math.PI * 2 * i) / 70;
        const speed = 3 + Math.random() * 6;
        particles.push({
          x: W() / 2, y: H() / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 8,
          color: ['#ef4444', '#fbbf24', '#ffffff', '#f472b6'][Math.floor(Math.random() * 4)],
          life: 1,
          shape: 'burst'
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      const cx = W() / 2;
      const cy = H() / 2;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.012;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;

        const alpha = 0.35 + Math.sin(p.life * 6) * 0.35;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === 'bolt') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size * 2);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.lineTo(p.x - p.size * 0.5, p.y);
          ctx.lineTo(p.x + p.size * 0.5, p.y + p.size * 2);
          ctx.stroke();
        } else if (p.shape === 'heart') {
          ctx.font = `${p.size * 3}px serif`;
          ctx.fillText('♥', p.x, p.y);
        } else if (p.shape === 'star') {
          ctx.font = `${p.size * 3}px serif`;
          ctx.fillText('✦', p.x, p.y);
        } else if (p.shape === 'burst') {
          const dist = Math.hypot(p.x - cx, p.y - cy);
          if (dist > 10) {
            p.x += (p.x - cx) / dist * 2;
            p.y += (p.y - cy) / dist * 2;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      this._raf = requestAnimationFrame(draw);
    };
    draw();
  },

  _stopParticles() {
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }
};
