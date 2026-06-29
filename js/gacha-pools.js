const GACHA_RARITIES = {
  common: { id: 'common', label: '普通', weight: 50, stars: 1, css: 'rarity-common', color: '#64748b' },
  rare: { id: 'rare', label: '稀有', weight: 25, stars: 2, css: 'rarity-rare', color: '#2563eb' },
  sr: { id: 'sr', label: '超稀有', weight: 12, stars: 3, css: 'rarity-sr', color: '#9333ea' },
  ur: { id: 'ur', label: '極稀有', weight: 9, stars: 4, css: 'rarity-ur', color: '#f59e0b' },
  ssr: { id: 'ssr', label: '傳說', weight: 4, stars: 5, css: 'rarity-ssr', color: '#ef4444' }
};

const GACHA_PULL_COST = 10;
const GACHA_PULL10_COST = 90;

/** 暫時關閉嘅卡池：設為 false 即可 */
const GACHA_POOL_ENABLED = {
  pokemon: true,
  sanrio: false,
  pixar: false,
  disney: true,
  marvel: true
};

/** 暫時關閉嘅卡冊分頁：設為 false 即可（即使有卡都唔顯示） */
const GACHA_COLLECTION_ENABLED = {
  pokemon: true,
  sanrio: false,
  pixar: false,
  disney: true,
  marvel: true
};

function isPoolPullable(poolId) {
  return GACHA_POOL_ENABLED[poolId] !== false;
}

function isCollectionVisible(poolId) {
  return GACHA_COLLECTION_ENABLED[poolId] !== false;
}

function getPullablePools() {
  return CARD_POOLS.filter(p => isPoolPullable(p.id));
}

function getCollectionTabPools(data) {
  return CARD_POOLS.filter(p => isCollectionVisible(p.id));
}

const GACHA_IMAGE = {
  pokemon: {
    banner: 'assets/img/gacha-banners/pokemon-pikachu.svg',
    bannerChar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    style: 'bottts-neutral',
    bg: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
  },
  sanrio: {
    banner: 'assets/img/cinnamoroll/cinnamoroll-party.png',
    bannerChar: 'assets/img/cinnamoroll/cinnamoroll-party.png',
    style: 'lorelei',
    bg: 'b6e3f4,ffd5dc,fecaca,fde68a,e9d5ff'
  },
  pixar: {
    banner: 'assets/img/pixar/cards/art-001.svg',
    bannerChar: 'assets/img/pixar/cards/art-001.svg',
    style: 'adventurer',
    bg: 'fde68a,bae6fd,fecaca,e9d5ff,bbf7d0'
  },
  disney: {
    banner: 'assets/img/gacha-banners/disney-mickey.svg',
    bannerChar: 'https://static.wikia.nocookie.net/disney/images/2/2e/Disney_Mickey_Mouse.png',
    style: 'lorelei',
    bg: 'c4b5fd,bae6fd,fde68a,fbcfe8,fef08a'
  },
  marvel: {
    banner: 'assets/img/gacha-banners/marvel-ironman.svg',
    bannerChar: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg',
    style: 'bottts-neutral',
    bg: '1e293b,dc2626,991b1b,fbbf24,64748b'
  }
};

function getPoolBannerChar(poolId) {
  return GACHA_IMAGE[poolId]?.bannerChar || GACHA_IMAGE[poolId]?.banner || '';
}

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
    banner: '比卡超帶領…收集百隻寶可夢！',
    desc: '比卡超、水箭龜、小火龍、傑尼龜…經典寶可夢等你收服'
  },
  {
    id: 'sanrio',
    name: 'Sanrio',
    icon: '🎀',
    theme: 'sanrio',
    bannerImage: GACHA_IMAGE.sanrio.banner,
    banner: 'Hello Kitty、美樂蒂、庫洛米…百款 Sanrio 角色！',
    desc: 'Hello Kitty、美樂蒂、庫洛米、布丁狗、肉桂狗…'
  },
  {
    id: 'pixar',
    name: 'PIXAR',
    icon: '🎬',
    theme: 'pixar',
    bannerImage: GACHA_IMAGE.pixar.banner,
    banner: '玩具總動員、海底總動員、玩轉腦朋友…',
    desc: 'PIXAR 動畫電影角色同場景，百張收藏卡'
  },
  {
    id: 'disney',
    name: 'DISNEY',
    icon: '🏰',
    theme: 'disney',
    bannerImage: GACHA_IMAGE.disney.banner,
    banner: '米奇領航…百位迪士尼角色！',
    desc: '米奇、艾莎、辛巴、史迪奇、花木蘭…經典迪士尼角色等你收集'
  },
  {
    id: 'marvel',
    name: 'MARVEL',
    icon: '🦸',
    theme: 'marvel',
    bannerImage: GACHA_IMAGE.marvel.banner,
    banner: '鋼鐵俠領隊…百位漫威英雄！',
    desc: '鋼鐵俠、蜘蛛俠、美國隊長、雷神、黑寡婦…漫威宇宙英雄等你收集'
  }
];

function pokemonSpriteUrl(dexId) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}

function pokemonFallbackUrl(dexId) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`;
}

const POKEMON_NAMES = {
  1: '妙蛙種子', 2: '妙蛙草', 3: '妙蛙花', 4: '小火龍', 5: '火恐龍', 6: '噴火龜',
  7: '傑尼龜', 8: '卡咪龜', 9: '水箭龜', 10: '綠毛蟲', 11: '鐵甲蛹', 12: '巴大蝶',
  13: '獨角蟲', 14: '鐵殼蛹', 15: '大針蜂', 16: '波波', 17: '比比鳥', 18: '大比鳥',
  19: '小拉達', 20: '拉達', 21: '烈雀', 22: '大嘴雀', 23: '阿柏蛇', 24: '阿柏怪',
  25: '比卡超', 26: '雷丘', 27: '穿山鼠', 28: '穿山王', 29: '尼多蘭', 30: '尼多娜',
  31: '尼多后', 32: '尼多朗', 33: '尼多力諾', 34: '尼多王', 35: '皮皮', 36: '皮可西',
  37: '六尾', 38: '九尾', 39: '胖丁', 40: '胖可丁', 41: '超音蝠', 42: '大嘴蝠',
  43: '走路草', 44: '臭臭花', 45: '霸王花', 46: '派拉斯', 47: '派拉斯特', 48: '毛球',
  49: '摩魯蛾', 50: '地鼠', 51: '三地鼠', 52: '喵喵', 53: '貓老大', 54: '可達鴨',
  55: '哥達鴨', 56: '猴怪', 57: '火爆猴', 58: '卡蒂狗', 59: '風速狗', 60: '蚊香蝌蚪',
  61: '蚊香君', 62: '蚊香泳士', 63: '凱西', 64: '勇基拉', 65: '胡地', 66: '腕力',
  67: '豪力', 68: '怪力', 69: '喇叭芽', 70: '口呆花', 71: '大食花', 72: '瑪瑙水母',
  73: '毒刺水母', 74: '小拳石', 75: '隆隆石', 76: '隆隆岩', 77: '小火馬', 78: '烈焰馬',
  79: '呆呆獸', 80: '呆殼獸', 81: '小磁怪', 82: '三合一磁怪', 83: '大蔥鴨', 84: '嘟嘟',
  85: '嘟嘟利', 86: '小海獅', 87: '白海獅', 88: '臭泥', 89: '臭臭泥', 90: '大舌貝',
  91: '刺甲貝', 92: '鬼斯', 93: '鬼斯通', 94: '耿鬼', 95: '大岩蛇', 96: '催眠貘',
  97: '引夢貘人', 98: '大鉗蟹', 99: '巨鉗蟹', 100: '霹靂電球'
};

const POKEMON_TYPES = {
  1: '草', 2: '草', 3: '草', 4: '火', 5: '火', 6: '火', 7: '水', 8: '水', 9: '水',
  25: '電', 26: '電', 94: '鬼', 65: '超能力', 68: '格鬥', 91: '水', 87: '水', 76: '岩石',
  59: '火', 38: '火', 18: '一般', 52: '一般', 53: '一般', 100: '電'
};

const POKEMON_SSR = new Set([6, 9, 25]);
const POKEMON_UR = new Set([3, 18, 38, 59, 65, 68, 76, 87, 91, 94]);
const POKEMON_SR = new Set([2, 5, 8, 26, 36, 62, 71, 82, 89, 95, 99, 100]);

function buildPokemonCards() {
  let rareCount = 0;
  const cards = [];
  for (let dex = 1; dex <= 100; dex++) {
    let rarity;
    if (POKEMON_SSR.has(dex)) rarity = 'ssr';
    else if (POKEMON_UR.has(dex)) rarity = 'ur';
    else if (POKEMON_SR.has(dex)) rarity = 'sr';
    else if (rareCount < 25) { rarity = 'rare'; rareCount++; }
    else rarity = 'common';

    const type = POKEMON_TYPES[dex] || ['一般', '草', '火', '水', '蟲', '毒', '電', '地面', '飛行'][dex % 9];
    cards.push({
      id: `poke-${String(dex).padStart(3, '0')}`,
      poolId: 'pokemon',
      dexId: dex,
      name: POKEMON_NAMES[dex],
      rarity,
      emoji: dex === 25 ? '⚡' : dex === 9 ? '💧' : dex === 6 ? '🔥' : '🎴',
      type,
      desc: `${type}系寶可夢 · ${POKEMON_NAMES[dex]}`,
      imageUrl: pokemonSpriteUrl(dex),
      fallbackUrl: pokemonFallbackUrl(dex)
    });
  }
  return cards;
}

function buildSanrioCards() {
  return SANRIO_DECK.map((entry, i) => ({
    id: `sanrio-${String(i + 1).padStart(3, '0')}`,
    poolId: 'sanrio',
    name: entry.name,
    rarity: entry.rarity,
    emoji: '🎀',
    desc: entry.desc,
    imageUrl: entry.img
  }));
}

function buildPixarCards() {
  return PIXAR_DECK.map((entry, i) => ({
    id: `pixar-${String(i + 1).padStart(3, '0')}`,
    poolId: 'pixar',
    name: entry.name,
    rarity: entry.rarity,
    emoji: '🎬',
    desc: entry.desc,
    imageUrl: entry.img
  }));
}

function buildDisneyCards() {
  return DISNEY_DECK.map((entry, i) => ({
    id: `disney-${String(i + 1).padStart(3, '0')}`,
    poolId: 'disney',
    name: entry.name,
    rarity: entry.rarity,
    emoji: '🏰',
    desc: entry.desc,
    imageUrl: entry.imageUrl,
    apiId: entry.apiId
  }));
}

function buildMarvelCards() {
  return MARVEL_DECK.map((entry, i) => ({
    id: `marvel-${String(i + 1).padStart(3, '0')}`,
    poolId: 'marvel',
    name: entry.name,
    rarity: entry.rarity,
    emoji: '🦸',
    desc: entry.desc,
    imageUrl: entry.imageUrl,
    apiId: entry.apiId
  }));
}

const ALL_GACHA_CARDS = [
  ...buildPokemonCards(),
  ...buildSanrioCards(),
  ...buildPixarCards(),
  ...buildDisneyCards(),
  ...buildMarvelCards()
].map(card => ({
  ...card,
  imageUrl: card.imageUrl || getCardImageUrl(card.poolId, card.id)
}));

const GachaSystem = {
  getPool(poolId) {
    return CARD_POOLS.find(p => p.id === poolId);
  },

  getCardsByPool(poolId) {
    return ALL_GACHA_CARDS.filter(c => c.poolId === poolId);
  },

  getPokemonByDex(dexId) {
    return this.getCardsByPool('pokemon').find(c => c.dexId === dexId) || null;
  },

  pickBossEnemyCard(excludeDex = 25) {
    const pool = this.getCardsByPool('pokemon').filter(c => c.dexId !== excludeDex);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  getCard(cardId) {
    return ALL_GACHA_CARDS.find(c => c.id === cardId);
  },

  ensureCollection(data) {
    if (!data.cardCollection) data.cardCollection = { pokemon: {}, sanrio: {}, pixar: {}, disney: {}, marvel: {} };
    if (!data.cardCollection.pokemon) data.cardCollection.pokemon = {};
    if (!data.cardCollection.sanrio) data.cardCollection.sanrio = {};
    if (!data.cardCollection.pixar) data.cardCollection.pixar = {};
    if (!data.cardCollection.disney) data.cardCollection.disney = {};
    if (!data.cardCollection.marvel) data.cardCollection.marvel = {};
    if (!data.gachaStats) data.gachaStats = { totalPulls: 0, pokemon: 0, sanrio: 0, pixar: 0, disney: 0, marvel: 0 };
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
    if (!isPoolPullable(poolId)) {
      return { ok: false, msg: '此卡池暫時關閉，敬請期待！' };
    }
    this.ensureCollection(data);
    const unlimited = typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints();
    if (!unlimited && !Storage.canAffordPoints(data, GACHA_PULL_COST)) {
      return { ok: false, msg: `積分唔夠！抽 1 次需要 ${GACHA_PULL_COST} 分` };
    }
    if (!unlimited) Storage.spendPoints(data, GACHA_PULL_COST);
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
    if (!isPoolPullable(poolId)) {
      return { ok: false, msg: '此卡池暫時關閉，敬請期待！' };
    }
    this.ensureCollection(data);
    const unlimited = typeof getActiveUnlimitedPoints === 'function' && getActiveUnlimitedPoints();
    if (!unlimited && !Storage.canAffordPoints(data, GACHA_PULL10_COST)) {
      return { ok: false, msg: `積分唔夠！抽 10 次需要 ${GACHA_PULL10_COST} 分` };
    }
    if (!unlimited) Storage.spendPoints(data, GACHA_PULL10_COST);
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

  getPreviewCards(poolId) {
    if (poolId === 'pokemon') {
      const featured = [25, 9, 6, 4, 7, 1];
      const pool = this.getCardsByPool(poolId);
      return featured.map(dex => pool.find(c => c.dexId === dex)).filter(Boolean);
    }
    if (poolId === 'sanrio') {
      const featured = ['sanrio-001', 'sanrio-002', 'sanrio-003', 'sanrio-013', 'sanrio-014', 'sanrio-020'];
      const pool = this.getCardsByPool(poolId);
      return featured.map(id => pool.find(c => c.id === id)).filter(Boolean);
    }
    if (poolId === 'pixar') {
      const featured = ['pixar-001', 'pixar-002', 'pixar-003', 'pixar-007', 'pixar-016', 'pixar-025'];
      const pool = this.getCardsByPool(poolId);
      return featured.map(id => pool.find(c => c.id === id)).filter(Boolean);
    }
    if (poolId === 'disney') {
      const featured = ['disney-001', 'disney-003', 'disney-011', 'disney-021', 'disney-041', 'disney-061'];
      const pool = this.getCardsByPool(poolId);
      return featured.map(id => pool.find(c => c.id === id)).filter(Boolean);
    }
    if (poolId === 'marvel') {
      const featured = ['marvel-001', 'marvel-003', 'marvel-011', 'marvel-021', 'marvel-041', 'marvel-061'];
      const pool = this.getCardsByPool(poolId);
      return featured.map(id => pool.find(c => c.id === id)).filter(Boolean);
    }
    return this.getCardsByPool(poolId).slice(0, 6);
  },

  cardArtHtml(card, owned = true, size = '') {
    const sizeClass = size ? ` card-art-${size}` : '';
    if (!owned) {
      return `<div class="card-art locked-art${sizeClass}"><div class="card-art-mystery">?</div></div>`;
    }
    const fallback = card.fallbackUrl || card.imageUrl;
    const poolClass = card.poolId === 'pokemon' ? 'card-art-pokemon'
      : card.poolId === 'sanrio' ? 'card-art-sanrio'
      : card.poolId === 'pixar' ? 'card-art-pixar'
      : card.poolId === 'disney' ? 'card-art-disney'
      : card.poolId === 'marvel' ? 'card-art-marvel' : '';
    return `
      <div class="card-art${sizeClass} ${poolClass}">
        <img src="${card.imageUrl}" alt="${card.name}" class="card-img" loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}'">
        <div class="card-art-fallback" style="display:none">${card.emoji}</div>
      </div>`;
  }
};
