const GACHA_RARITIES = {
  common: { id: 'common', label: '普通', weight: 60, stars: 1, css: 'rarity-common', color: '#64748b' },
  rare: { id: 'rare', label: '稀有', weight: 25, stars: 2, css: 'rarity-rare', color: '#2563eb' },
  sr: { id: 'sr', label: '超稀有', weight: 10, stars: 3, css: 'rarity-sr', color: '#9333ea' },
  ur: { id: 'ur', label: '極稀有', weight: 4, stars: 4, css: 'rarity-ur', color: '#f59e0b' },
  ssr: { id: 'ssr', label: '傳說', weight: 1, stars: 5, css: 'rarity-ssr', color: '#ef4444' }
};

const GACHA_PULL_COST = 10;
const GACHA_PULL10_COST = 90;

const GACHA_IMAGE = {
  pokemon: {
    banner: 'assets/img/gacha-pool-pokemon.png',
    style: 'bottts-neutral',
    bg: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  cinnamoroll: {
    banner: 'assets/img/gacha-pool-cinnamoroll.png',
    style: 'lorelei',
    bg: 'b6e3f4,ffd5dc,fecaca,fde68a,e9d5ff'
  }
};

function getCardImageUrl(poolId, cardId) {
  const cfg = GACHA_IMAGE[poolId];
  if (!cfg) return '';
  return `https://api.dicebear.com/9.x/${cfg.style}/webp?seed=${encodeURIComponent(cardId)}&size=256&backgroundColor=${cfg.bg}`;
}

const CARD_POOLS = [
  {
    id: 'pokemon',
    name: '寵物小精靈',
    icon: '⚡',
    theme: 'pokemon',
    bannerImage: GACHA_IMAGE.pokemon.banner,
    banner: '收集可愛小精靈，練數學賺積分抽卡！',
    desc: '火、水、草、雷…百種小精靈等你收服'
  },
  {
    id: 'cinnamoroll',
    name: '肉桂狗',
    icon: '🐶',
    theme: 'cinnamoroll',
    bannerImage: GACHA_IMAGE.cinnamoroll.banner,
    banner: '肉桂狗同朋友仔卡池',
    desc: '云朵、奶油、草莓…百款肉桂系卡片'
  }
];

function buildPokemonCards() {
  const elements = ['火', '水', '草', '雷', '冰', '風', '光', '暗', '土', '金'];
  const creatures = ['鼠', '兔', '鳥', '龍', '貓', '狐', '蝶', '魚', '龜', '狼', '熊', '鹿', '鷹', '蛇', '獅'];
  const emojis = ['🔥', '💧', '🌿', '⚡', '❄️', '🌪️', '✨', '🌙', '🪨', '⭐', '🐲', '🦋', '🐾', '🌟', '💫'];
  const cards = [];
  let i = 0;
  const raritySlots = [
    ...Array(50).fill('common'),
    ...Array(25).fill('rare'),
    ...Array(12).fill('sr'),
    ...Array(10).fill('ur'),
    ...Array(3).fill('ssr')
  ];
  for (const e of elements) {
    for (const c of creatures) {
      if (i >= 100) break;
      const rarity = raritySlots[i];
      cards.push({
        id: `poke-${String(i + 1).padStart(3, '0')}`,
        poolId: 'pokemon',
        name: `${e}系${c}精`,
        rarity,
        emoji: emojis[i % emojis.length],
        desc: `${e}屬性的小精靈，性格活潑可愛。`
      });
      i++;
    }
    if (i >= 100) break;
  }
  while (i < 100) {
    const rarity = raritySlots[i];
    cards.push({
      id: `poke-${String(i + 1).padStart(3, '0')}`,
      poolId: 'pokemon',
      name: `神秘精靈 No.${i + 1}`,
      rarity,
      emoji: emojis[i % emojis.length],
      desc: '傳聞中的隱藏小精靈。'
    });
    i++;
  }
  return cards;
}

function buildCinnamorollCards() {
  const prefixes = ['肉桂', '奶油', '云朵', '草莓', '牛奶', '焦糖', '雲朵', '櫻花', '薄荷', '蜂蜜', '藍莓', '檸檬', '可可', '香草', '珍珠'];
  const suffixes = ['狗', '卷', '寶', '球', '星', '雲', '糖', '兔', '熊', '喵'];
  const emojis = ['🐶', '☁️', '🎀', '🍩', '🧁', '☕', '💕', '🌸', '🍓', '🥐', '🍰', '🫧', '✨', '🎈', '🍯'];
  const cards = [];
  const raritySlots = [
    ...Array(50).fill('common'),
    ...Array(25).fill('rare'),
    ...Array(12).fill('sr'),
    ...Array(10).fill('ur'),
    ...Array(3).fill('ssr')
  ];
  let i = 0;
  for (const p of prefixes) {
    for (const s of suffixes) {
      if (i >= 100) break;
      cards.push({
        id: `cinna-${String(i + 1).padStart(3, '0')}`,
        poolId: 'cinnamoroll',
        name: `${p}${s}`,
        rarity: raritySlots[i],
        emoji: emojis[i % emojis.length],
        desc: `軟綿綿的${p}${s}，散發甜甜香氣。`
      });
      i++;
    }
    if (i >= 100) break;
  }
  while (i < 100) {
    cards.push({
      id: `cinna-${String(i + 1).padStart(3, '0')}`,
      poolId: 'cinnamoroll',
      name: `限定肉桂 No.${i + 1}`,
      rarity: raritySlots[i],
      emoji: emojis[i % emojis.length],
      desc: '限定版肉桂系卡片。'
    });
    i++;
  }
  return cards;
}

const ALL_GACHA_CARDS = [...buildPokemonCards(), ...buildCinnamorollCards()].map(card => ({
  ...card,
  imageUrl: getCardImageUrl(card.poolId, card.id)
}));

const GachaSystem = {
  getPool(poolId) {
    return CARD_POOLS.find(p => p.id === poolId);
  },

  getCardsByPool(poolId) {
    return ALL_GACHA_CARDS.filter(c => c.poolId === poolId);
  },

  getCard(cardId) {
    return ALL_GACHA_CARDS.find(c => c.id === cardId);
  },

  ensureCollection(data) {
    if (!data.cardCollection) data.cardCollection = { pokemon: {}, cinnamoroll: {} };
    if (!data.cardCollection.pokemon) data.cardCollection.pokemon = {};
    if (!data.cardCollection.cinnamoroll) data.cardCollection.cinnamoroll = {};
    if (!data.gachaStats) data.gachaStats = { totalPulls: 0, pokemon: 0, cinnamoroll: 0 };
    return data.cardCollection;
  },

  rollRarity() {
    const roll = Math.random() * 100;
    let acc = 0;
    for (const r of Object.values(GACHA_RARITIES)) {
      acc += r.weight;
      if (roll < acc) return r.id;
    }
    return 'common';
  },

  pickCard(poolId, rarity) {
    const pool = this.getCardsByPool(poolId).filter(c => c.rarity === rarity);
    if (!pool.length) return this.getCardsByPool(poolId)[0];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  pull(data, poolId) {
    this.ensureCollection(data);
    const unlimited = typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints();
    if (!unlimited && (data.points || 0) < GACHA_PULL_COST) {
      return { ok: false, msg: `積分唔夠！抽 1 次需要 ${GACHA_PULL_COST} 分` };
    }
    if (!unlimited) data.points -= GACHA_PULL_COST;
    data.gachaStats.totalPulls++;
    data.gachaStats[poolId] = (data.gachaStats[poolId] || 0) + 1;

    const rarity = this.rollRarity();
    const card = this.pickCard(poolId, rarity);
    const coll = data.cardCollection[poolId];
    const isNew = !coll[card.id];
    coll[card.id] = (coll[card.id] || 0) + 1;

    return { ok: true, card, rarity, isNew, cost: GACHA_PULL_COST };
  },

  pull10(data, poolId) {
    this.ensureCollection(data);
    const unlimited = typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints();
    if (!unlimited && (data.points || 0) < GACHA_PULL10_COST) {
      return { ok: false, msg: `積分唔夠！抽 10 次需要 ${GACHA_PULL10_COST} 分` };
    }
    if (!unlimited) data.points -= GACHA_PULL10_COST;
    const results = [];
    for (let i = 0; i < 10; i++) {
      data.gachaStats.totalPulls++;
      data.gachaStats[poolId] = (data.gachaStats[poolId] || 0) + 1;
      const rarity = this.rollRarity();
      const card = this.pickCard(poolId, rarity);
      const coll = data.cardCollection[poolId];
      const isNew = !coll[card.id];
      coll[card.id] = (coll[card.id] || 0) + 1;
      results.push({ card, rarity, isNew });
    }
    return { ok: true, results, cost: GACHA_PULL10_COST };
  },

  getCollectionStats(data, poolId) {
    this.ensureCollection(data);
    const coll = data.cardCollection[poolId] || {};
    const total = this.getCardsByPool(poolId).length;
    const owned = Object.keys(coll).length;
    return { owned, total, coll };
  },

  starsHtml(rarity, size = '') {
    const r = GACHA_RARITIES[rarity];
    if (!r) return '';
    return `<span class="card-stars ${size}">${'★'.repeat(r.stars)}</span>`;
  },

  cardArtHtml(card, owned = true, size = '') {
    const sizeClass = size ? ` card-art-${size}` : '';
    if (!owned) {
      return `<div class="card-art locked-art${sizeClass}"><div class="card-art-mystery">?</div></div>`;
    }
    return `
      <div class="card-art${sizeClass}">
        <img src="${card.imageUrl}" alt="${card.name}" class="card-img" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-art-fallback" style="display:none">${card.emoji}</div>
      </div>`;
  }
};
