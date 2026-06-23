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
    banner: 'assets/img/cinnamoroll/cinnamoroll-solo.png',
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
    banner: '比卡超、水箭龜、噴火龜…收集百隻寶可夢！',
    desc: '比卡超、水箭龜、小火龍、傑尼龜…經典寶可夢等你收服'
  },
  {
    id: 'cinnamoroll',
    name: '肉桂狗',
    icon: '🐶',
    theme: 'cinnamoroll',
    bannerImage: GACHA_IMAGE.cinnamoroll.banner,
    banner: '肉桂狗同朋友仔，一齊慶祝！',
    desc: '肉桂狗、摩卡、牛奶、芙蘭…百款可愛卡片'
  }
];

function pokemonSpriteUrl(dexId) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}

function pokemonFallbackUrl(dexId) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`;
}

/* 第一世代 #1–#100 香港常用譯名 */
const POKEMON_NAMES = {
  1: '妙蛙種子', 2: '妙蛙草', 3: '妙蛙花', 4: '小火龍', 5: '火恐龍', 6: '噴火龍',
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

const POKEMON_SSR = new Set([6, 9, 25]); /* 噴火龜、水箭龜、比卡超 */
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

function buildCinnamorollCards() {
  const CINNA_ART = {
    cinnamoroll: 'assets/img/cinnamoroll/cinnamoroll-solo.png',
    prince: 'assets/img/cinnamoroll/cinnamoroll-prince.png',
    winter: 'assets/img/cinnamoroll/cinnamoroll-winter.png',
    party: 'assets/img/cinnamoroll/cinnamoroll-party.png',
    mocha: 'assets/img/cinnamoroll/cinna-mocha.png',
    milk: 'assets/img/cinnamoroll/cinna-milk.png',
    chiffon: 'assets/img/cinnamoroll/cinna-chiffon.png',
    cappuccino: 'assets/img/cinnamoroll/cinna-cappuccino.png',
    espresso: 'assets/img/cinnamoroll/cinna-espresso.png'
  };

  const CHARACTERS = [
    { base: '肉桂狗', art: 'cinnamoroll', variants: [
      '雲朵版', '雪糕版', '圍巾版', '星星版', '睡覺版', '飛行版', '咖啡廳版', '草莓版',
      '牛奶糖版', '棉花糖版', '晴天版', '雨天版', '生日版', '聖誕版', '新年版'
    ]},
    { base: '摩卡', art: 'mocha', variants: [
      '蝴蝶結版', '櫻花版', '下午茶版', '購物版', '拍照版', '甜品版', '草莓蛋糕版',
      '珍珠奶茶版', '野餐版', '溫泉版', '學院版', '公主版'
    ]},
    { base: '牛奶', art: 'milk', variants: [
      '奶嘴版', '奶瓶版', '小被子版', '搖籃版', '星星毯版', '彩虹版', '月亮版',
      '雲朵床版', '玩具熊版', '泡泡版', '糖果版', '枕頭版'
    ]},
    { base: '芙蘭', art: 'chiffon', variants: [
      '毛帽版', '雪花版', '滑雪版', '暖爐版', '圍巾版', '手套版', '雪人版',
      '熱可可版', '冬日版', '北極版', '冰晶版', '暖冬版'
    ]},
    { base: '卡布奇諾', art: 'cappuccino', variants: [
      '耳罩版', '冬日版', '睡覺版', '懶洋洋版', '枕頭版', '毛毯版', '暖暖版',
      '咖啡香版', '午覺版', '慵懶版', '柔軟版', '舒服版'
    ]},
    { base: '濃縮咖啡', art: 'espresso', variants: [
      '紳士版', '背包版', '探險版', '學者版', '咖啡師版', '禮帽版', '領結版',
      '書本版', '地圖版', '望遠鏡版', '筆記版', '智慧版'
    ]},
    { base: '肉桂狗', art: 'prince', variants: [
      '王子版', '指揮版', '皇冠版', '音樂會版', '豎琴版', '喇叭版', '鼓手版',
      '舞台版', '星光版', '魔法版', '城堡版', '皇家版', '慶典版'
    ]},
    { base: '肉桂狗和朋友', art: 'winter', variants: [
      '冬日版', '壽司聯名版', '雪花版', '圍爐版', '聖誕版', '新年版', '團聚版',
      '星座版', '許願版', '極光版', '雪人版', '禮物版'
    ]},
    { base: '肉桂狗和朋友', art: 'party', variants: [
      '派對版', '生日版', '蛋糕版', '氣球版', '禮物版', '慶祝版', '狂歡版',
      '彩帶版', '煙花版', '聚會版', '歡呼版', '永遠版', '甜蜜版'
    ]}
  ];

  const CINNA_SSR = new Set(['肉桂狗·王子版', '肉桂狗·皇冠版', '肉桂狗和朋友·永遠版']);
  const CINNA_UR = new Set([
    '肉桂狗·飛行版', '摩卡·公主版', '牛奶·彩虹版', '芙蘭·北極版',
    '濃縮咖啡·智慧版', '卡布奇諾·暖暖版', '肉桂狗·音樂會版', '肉桂狗和朋友·壽司聯名版',
    '肉桂狗和朋友·派對版', '摩卡·櫻花版'
  ]);
  const CINNA_SR = new Set([
    '肉桂狗·草莓版', '摩卡·下午茶版', '牛奶·星星毯版', '芙蘭·熱可可版',
    '濃縮咖啡·探險版', '卡布奇諾·冬日版', '肉桂狗·生日版', '肉桂狗和朋友·聖誕版',
    '肉桂狗和朋友·蛋糕版', '摩卡·甜品版', '牛奶·月亮版', '芙蘭·滑雪版'
  ]);

  const cards = [];
  let i = 0;
  let rareCount = 0;

  for (const char of CHARACTERS) {
    for (const variant of char.variants) {
      if (i >= 100) break;
      const fullName = `${char.base}·${variant}`;
      let rarity;
      if (CINNA_SSR.has(fullName)) rarity = 'ssr';
      else if (CINNA_UR.has(fullName)) rarity = 'ur';
      else if (CINNA_SR.has(fullName)) rarity = 'sr';
      else if (rareCount < 25) { rarity = 'rare'; rareCount++; }
      else rarity = 'common';

      cards.push({
        id: `cinna-${String(i + 1).padStart(3, '0')}`,
        poolId: 'cinnamoroll',
        name: fullName,
        rarity,
        emoji: '🐶',
        desc: `可愛的${char.base}，${variant}造型。`,
        imageUrl: CINNA_ART[char.art]
      });
      i++;
    }
    if (i >= 100) break;
  }

  while (i < 100) {
    let rarity = 'common';
    if (rareCount < 25) { rarity = 'rare'; rareCount++; }
    cards.push({
      id: `cinna-${String(i + 1).padStart(3, '0')}`,
      poolId: 'cinnamoroll',
      name: `肉桂狗·限定 No.${i + 1}`,
      rarity,
      emoji: '🐶',
      desc: '限定版肉桂狗卡片。',
      imageUrl: CINNA_ART.cinnamoroll
    });
    i++;
  }
  return cards;
}

const ALL_GACHA_CARDS = [...buildPokemonCards(), ...buildCinnamorollCards()].map(card => ({
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

  getPreviewCards(poolId) {
    if (poolId === 'pokemon') {
      const featured = [25, 9, 6, 4, 7, 1];
      const pool = this.getCardsByPool(poolId);
      return featured.map(dex => pool.find(c => c.dexId === dex)).filter(Boolean);
    }
    if (poolId === 'cinnamoroll') {
      const featured = ['cinna-001', 'cinna-016', 'cinna-028', 'cinna-040', 'cinna-052', 'cinna-064'];
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
    return `
      <div class="card-art${sizeClass} ${card.poolId === 'pokemon' ? 'card-art-pokemon' : ''} ${card.poolId === 'cinnamoroll' ? 'card-art-cinna' : ''}">
        <img src="${card.imageUrl}" alt="${card.name}" class="card-img" loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}'">
        <div class="card-art-fallback" style="display:none">${card.emoji}</div>
      </div>`;
  }
};
