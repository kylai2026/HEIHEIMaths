/* 抽卡動畫：寶可夢同肉桂狗兩套完全不同風格 */
const GachaAnimation = {
  ASSETS: {
    pokemon: 'assets/img/gacha-anim-pokemon-v2.png',
    cinnamoroll: 'assets/img/gacha-anim-cinnamoroll-v2.png'
  },

  DURATION: { pokemon: 3400, cinnamoroll: 3600 },
  REVEAL_STAGGER: 120,

  _raf: null,
  _running: false,

  play(poolId, items, onDone) {
    if (this._running) return;
    this._running = true;

    const modal = document.getElementById('gachaModal');
    const stage = document.getElementById('gachaAnimStage');
    const area = document.getElementById('gachaResultArea');
    const closeBtn = document.getElementById('gachaModalClose');
    const bestRarity = this._bestRarity(items);

    area.classList.add('hidden');
    area.innerHTML = '';
    closeBtn.classList.add('hidden');
    modal.classList.remove('hidden');
    modal.querySelector('.gacha-modal')?.classList.remove('gacha-modal--results');

    stage.className = `gacha-anim-stage anim-${poolId}`;
    stage.innerHTML = poolId === 'pokemon'
      ? this._pokemonHtml(bestRarity)
      : this._cinnaHtml(bestRarity);

    modal.querySelector('.gacha-modal')?.classList.add('is-animating');

    if (typeof AudioManager !== 'undefined') {
      AudioManager.playSfx(poolId === 'pokemon' ? 'gachaPokemon' : 'gachaCinna');
    }

    const canvas = stage.querySelector('canvas');
    if (canvas) this._startParticles(canvas, poolId, bestRarity);

    const base = this.DURATION[poolId] || 3000;
    const bonus = bestRarity === 'ssr' ? 1400 : bestRarity === 'ur' ? 800 : bestRarity === 'sr' ? 300 : 0;
    const ms = base + bonus + (items.length > 1 ? 500 : 0);

    setTimeout(() => {
      this._triggerFinale(stage, poolId, bestRarity);
    }, ms - 600);

    setTimeout(() => {
      this._stopParticles();
      stage.classList.add('anim-out');
      setTimeout(() => {
        stage.innerHTML = '';
        stage.className = 'gacha-anim-stage';
        modal.querySelector('.gacha-modal')?.classList.remove('is-animating');
        this._running = false;
        if (typeof AudioManager !== 'undefined') AudioManager.playSfx('gachaReveal');
        onDone();
      }, 380);
    }, ms);
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

  _triggerFinale(stage, poolId, rarity) {
    if (!stage) return;
    stage.classList.add('anim-finale');
    if (rarity === 'ssr' || rarity === 'ur') {
      stage.classList.add(`anim-finale-${rarity}`);
      if (typeof AudioManager !== 'undefined') {
        AudioManager.playSfx(rarity === 'ssr' ? 'gachaSSR' : 'gachaUR');
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
      <p class="gacha-anim-text poke-text">⚡ 收服中…</p>
      ${rarity === 'ssr' ? '<p class="gacha-anim-sub poke-sub ssr-hint">傳說寶可夢接近中！</p>' : ''}
      ${rarity === 'ur' ? '<p class="gacha-anim-sub poke-sub ur-hint">極稀有光芒閃耀！</p>' : ''}
    `;
  },

  _cinnaHtml(rarity) {
    const burst = rarity === 'ssr' ? 'burst-ssr' : rarity === 'ur' ? 'burst-ur' : rarity === 'sr' ? 'burst-sr' : '';
    return `
      <div class="gacha-anim-bg" style="background-image:url('${this.ASSETS.cinnamoroll}')"></div>
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
      <p class="gacha-anim-text cinna-text">🐶 召喚中…</p>
      ${rarity === 'ssr' ? '<p class="gacha-anim-sub cinna-sub ssr-hint">超華麗卡片即將出現！</p>' : ''}
      ${rarity === 'ur' ? '<p class="gacha-anim-sub cinna-sub ur-hint">夢幻禮物綻放光芒！</p>' : ''}
    `;
  },

  _startParticles(canvas, poolId, rarity) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = poolId === 'pokemon' ? 90 : 80;
    const W = () => canvas.width;
    const H = () => canvas.height;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const palette = poolId === 'pokemon'
      ? ['#fbbf24', '#38bdf8', '#a78bfa', '#fef08a', '#ffffff']
      : ['#fda4af', '#bae6fd', '#fef08a', '#e9d5ff', '#ffffff'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 300,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * (poolId === 'pokemon' ? 4 : 2.2),
        vy: (Math.random() - 0.5) * (poolId === 'pokemon' ? 4 : 2.2),
        size: 2 + Math.random() * (poolId === 'pokemon' ? 4 : 5),
        color: palette[Math.floor(Math.random() * palette.length)],
        life: Math.random(),
        shape: poolId === 'pokemon' ? (Math.random() > 0.6 ? 'bolt' : 'dot') : (Math.random() > 0.5 ? 'heart' : 'star')
      });
    }

    if (rarity === 'ssr' || rarity === 'ur') {
      for (let i = 0; i < 45; i++) {
        const angle = (Math.PI * 2 * i) / 45;
        const speed = 3 + Math.random() * 6;
        particles.push({
          x: W() / 2, y: H() / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 8,
          color: rarity === 'ssr'
            ? ['#ef4444', '#fbbf24', '#ffffff', '#f472b6'][Math.floor(Math.random() * 4)]
            : ['#f59e0b', '#fef08a', '#ffffff', '#fda4af'][Math.floor(Math.random() * 4)],
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
