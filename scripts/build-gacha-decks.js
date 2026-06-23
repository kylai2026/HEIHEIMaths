/**
 * Build sanrio-deck.js and pixar-deck.js (100 cards each).
 * Run: node scripts/build-gacha-decks.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// ── Sanrio: transform cinnamoroll deck names ──
const cinnaCode = fs.readFileSync(path.join(root, 'js/cinnamoroll-deck.js'), 'utf8');
let sanrioCode = cinnaCode
  .replace(/肉桂狗卡池/g, 'Sanrio 卡池')
  .replace(/const CINNA_ART_VER/g, 'const SANRIO_ART_VER')
  .replace(/CINNA_ART_VER/g, 'SANRIO_ART_VER')
  .replace(/const CINNA_IMG/g, 'const SANRIO_IMG')
  .replace(/CINNA_IMG/g, 'SANRIO_IMG')
  .replace(/const CINNAMOROLL_DECK/g, 'const SANRIO_DECK')
  .replace(/CINNAMOROLL_DECK/g, 'SANRIO_DECK');

const SANRIO_CHARS = [
  'Hello Kitty', '美樂蒂', '庫洛米', '肉桂狗', '布丁狗', '大眼蛙', '蛋黃哥',
  '酷企鵝', '帕恰狗', '雙子星', '大耳狗', '許願兔', '毛絨熊', '漢頓', '可可豆'
];

const sanrioDeck = new Function(`${sanrioCode}\nreturn SANRIO_DECK;`)();
sanrioDeck.forEach((card, i) => {
  const ch = SANRIO_CHARS[i % SANRIO_CHARS.length];
  if (card.name.startsWith('肉桂狗')) {
    card.name = card.name.replace(/^肉桂狗/, ch);
  } else if (card.name.startsWith('摩卡')) {
    card.name = card.name.replace(/^摩卡/, '肉桂狗·摩卡');
  } else if (card.name.startsWith('牛奶')) {
    card.name = card.name.replace(/^牛奶/, '肉桂狗·牛奶');
  } else if (card.name.startsWith('芙蘭')) {
    card.name = card.name.replace(/^芙蘭/, '肉桂狗·芙蘭');
  } else if (card.name.startsWith('卡布奇諾')) {
    card.name = card.name.replace(/^卡布奇諾/, '肉桂狗·卡布');
  } else if (card.name.startsWith('濃縮咖啡')) {
    card.name = card.name.replace(/^濃縮咖啡/, '肉桂狗·濃縮');
  }
  if (card.name.includes('和朋友')) {
    card.name = card.name.replace(/肉桂狗和朋友|Hello Kitty和朋友/, 'Sanrio 朋友');
  }
});

function deckToJs(varName, imgVar, verName, deck, imgPaths) {
  const lines = deck.map(c => {
    let imgExpr = c._imgExpr || `'${c.img}'`;
    return `  { name: '${c.name.replace(/'/g, "\\'")}', rarity: '${c.rarity}', img: ${imgExpr}, desc: '${c.desc.replace(/'/g, "\\'")}' }`;
  });
  return `/* Auto-built deck — 100 cards */
const ${verName} = 1;
const ${imgVar} = {
  art: (n) => \`assets/img/${imgPaths}/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${${verName}}\`,
  ref: (n) => \`assets/img/${imgPaths}/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${${verName}}\`
};

const ${varName} = [
${lines.join(',\n')}
];
`;
}

// Re-read sanrio with img expressions from original
const origDeck = new Function(`${cinnaCode}\nreturn CINNAMOROLL_DECK;`)();
sanrioDeck.forEach((card, i) => {
  const orig = origDeck[i];
  const imgMatch = cinnaCode.match(new RegExp(`img: CINNA_IMG\\.(\\w+)\\((\\d+)\\)`)) ;
  // preserve img path from orig - use same art numbers
  card.img = orig.img.replace(/v=\d+/, `v=${1}`).replace('CINNA', 'SANRIO');
});

// Build sanrio file manually from transformed deck
const sanrioLines = sanrioDeck.map((card, i) => {
  const orig = origDeck[i];
  // extract art function from original entry in source
  const block = cinnaCode.split('const CINNAMOROLL_DECK = [')[1];
  const entryStart = block.indexOf(`{ name: '${origDeck[i].name}'`);
  // simpler: map img from orig deck img string
  let imgStr = orig.img;
  const artMatch = imgStr.match(/art-(\d+)\.svg/);
  const refMatch = imgStr.match(/cinnamoroll\/(cinnamoroll-|cinna-)(\w+)\.png/);
  let imgExpr;
  if (artMatch) {
    imgExpr = `SANRIO_IMG.art(${parseInt(artMatch[1])})`;
  } else if (refMatch) {
    const key = refMatch[2].replace('cinnamoroll-', '').replace('cinna-', '');
    const keyMap = { party: 'party', prince: 'prince', winter: 'winter', solo: 'solo', mocha: 'mocha', milk: 'milk', chiffon: 'chiffon', cappuccino: 'cappuccino', espresso: 'espresso' };
    const k = Object.keys(keyMap).find(k => imgStr.includes(k)) || 'solo';
    imgExpr = `SANRIO_IMG.${k}`;
  } else {
    const m = imgStr.match(/art-(\d+)/);
    imgExpr = m ? `SANRIO_IMG.art(${parseInt(m[1])})` : `SANRIO_IMG.solo`;
  }
  return `  { name: '${card.name.replace(/'/g, "\\'")}', rarity: '${card.rarity}', img: ${imgExpr}, desc: '${card.desc.replace(/'/g, "\\'")}' }`;
});

const sanrioFile = `/* Sanrio 卡池：100 張獨立卡片 */
const SANRIO_ART_VER = 1;
const SANRIO_IMG = {
  party: \`assets/img/cinnamoroll/cinnamoroll-party.png?v=\${SANRIO_ART_VER}\`,
  prince: \`assets/img/cinnamoroll/cinnamoroll-prince.png?v=\${SANRIO_ART_VER}\`,
  winter: \`assets/img/cinnamoroll/cinnamoroll-winter.png?v=\${SANRIO_ART_VER}\`,
  solo: \`assets/img/cinnamoroll/cinnamoroll-solo.png?v=\${SANRIO_ART_VER}\`,
  mocha: \`assets/img/cinnamoroll/cinna-mocha.png?v=\${SANRIO_ART_VER}\`,
  milk: \`assets/img/cinnamoroll/cinna-milk.png?v=\${SANRIO_ART_VER}\`,
  chiffon: \`assets/img/cinnamoroll/cinna-chiffon.png?v=\${SANRIO_ART_VER}\`,
  cappuccino: \`assets/img/cinnamoroll/cinna-cappuccino.png?v=\${SANRIO_ART_VER}\`,
  espresso: \`assets/img/cinnamoroll/cinna-espresso.png?v=\${SANRIO_ART_VER}\`,
  ref: (n) => \`assets/img/cinnamoroll/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${SANRIO_ART_VER}\`,
  art: (n) => \`assets/img/cinnamoroll/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${SANRIO_ART_VER}\`
};

const SANRIO_DECK = [
${sanrioLines.join(',\n')}
];
`;

fs.writeFileSync(path.join(root, 'js/sanrio-deck.js'), sanrioFile);

// ── Pixar deck ──
const PIXAR_ENTRIES = [
  { movie: '玩具總動員', chars: ['胡迪', '巴斯光年', '翠絲', '三眼仔', '抱抱龍'] },
  { movie: '玩具總動員2', chars: ['胡迪', '巴斯', '礦工', '刺蝟', 'Wheezy'] },
  { movie: '玩具總動員3', chars: ['胡迪', '巴斯', '大熊', '草莓熊', '肯尼'] },
  { movie: '玩具總動員4', chars: ['胡迪', '巴斯', '叉奇', '牧羊女', '公爵'] },
  { movie: '海底總動員', chars: ['尼莫', '馬林', '多莉', '龜爺爺', '鯊魚'] },
  { movie: '海底總動員2', chars: ['多莉', '尼莫', '馬林', '章魚', '海獺'] },
  { movie: '玩轉腦朋友', chars: ['樂樂', '憂憂', '怒怒', '厭厭', '驚驚'] },
  { movie: '玩轉腦朋友2', chars: ['樂樂', '焦焦', '阿樂', '憂憂', '怒怒'] },
  { movie: '沖天救兵', chars: ['巴斯光年', '索克', '阿麗', '祖', '巴斯'] },
  { movie: '反斗奇兵', chars: ['胡迪', '巴斯', '翠絲', '豬仔', '蛋頭'] },
  { movie: '超人特工隊', chars: ['超能先生', '彈弓女', '飛毛腿', '隱形女', '冰凍俠'] },
  { movie: '超人特工隊2', chars: ['超能先生', '彈弓女', '小傑', '小倩', '小迪'] },
  { movie: '料理鼠王', chars: ['小米', '大廚', '柯米', '安東', '甜姐'] },
  { movie: '怪獸公司', chars: ['毛怪', '大眼仔', '阿布', '蘭道夫', '荷莉'] },
  { movie: '怪獸大學', chars: ['毛怪', '大眼仔', '麥克', '蘇利文', 'OK兄弟會'] },
  { movie: '尋夢環遊記', chars: ['米格', '埃克托', '可可', '德拉庫斯', '海格'] },
  { movie: '靈魂奇遇記', chars: ['喬', '22號', '貓', '泰瑞', '月神'] },
  { movie: '青春變形記', chars: ['美美', '阿明', '阿強', '媽媽', '4城幫'] },
  { movie: '瓦力', chars: ['瓦力', '伊娃', '船長', 'Auto', '小蟑螂'] },
  { movie: '天外奇蹟', chars: ['卡爾', '羅素', '道格', '凯文', '蒙茲'] },
  { movie: '勇敢傳說', chars: ['梅莉達', '媽媽', '三兄弟', '巫婆', '黑熊'] },
  { movie: '魔髮奇緣', chars: ['樂佩', '費林', '馬克斯', '帕斯卡', '女巫'] },
  { movie: '路卡的夏天', chars: ['路卡', '艾伯托', 'Giulia', '龍蝦', '海怪'] },
  { movie: '魔法滿屋', chars: ['米拉貝', '阿布埃拉', '伊莎', '路易莎', '布魯諾'] },
  { movie: '元素城市', chars: ['小焰', '阿波', '克勞德', '蓋爾', '火花'] },
  { movie: '蟲蟲危機', chars: ['飛蟻', '螞蟻', '螳螂', '毛毛蟲', '瓢蟲'] },
  { movie: '汽車總動員', chars: ['閃電', '拖線', '莎莉', '麥大叔', '奇克斯'] },
  { movie: '汽車總動員2', chars: ['閃電', '拖線', 'Finn', 'Holley', '法蘭'] },
  { movie: '汽車總動員3', chars: ['閃電', '克魯茲', '博士', '傑克遜', '拖線'] },
  { movie: '恐龍當家', chars: ['阿樂', '爸爸', '媽媽', '巴克', '暴龍'] },
  { movie: '光年正傳', chars: ['巴斯', 'Izzy', 'Mo', 'Darby', 'Zurg'] },
  { movie: 'Elio', chars: ['Elio', 'Glordon', 'Olga', 'Aunt', 'Alien'] },
  { movie: 'Onward', chars: ['Ian', 'Barley', 'Manticore', '爸爸', '精靈'] }
];

const RARITY_SLOTS = [
  ...Array(3).fill('ssr'),
  ...Array(10).fill('ur'),
  ...Array(12).fill('sr'),
  ...Array(25).fill('rare'),
  ...Array(50).fill('common')
];

const pixarCards = [];
let idx = 0;
for (const r of RARITY_SLOTS) {
  const entry = PIXAR_ENTRIES[idx % PIXAR_ENTRIES.length];
  const ch = entry.chars[idx % entry.chars.length];
  const artNum = idx + 1;
  const tierLabel = { ssr: '傳說', ur: '極稀有', sr: '超稀有', rare: '稀有', common: '普通' }[r];
  pixarCards.push({
    name: `${entry.movie}·${ch}`,
    rarity: r,
    artNum,
    desc: `${tierLabel}卡 · ${entry.movie}主題收藏卡`
  });
  idx++;
}

const pixarLines = pixarCards.map(c =>
  `  { name: '${c.name.replace(/'/g, "\\'")}', rarity: '${c.rarity}', img: PIXAR_IMG.art(${c.artNum}), desc: '${c.desc.replace(/'/g, "\\'")}' }`
);

const pixarFile = `/* PIXAR 卡池：100 張獨立卡片 */
const PIXAR_ART_VER = 1;
const PIXAR_IMG = {
  art: (n) => \`assets/img/pixar/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${PIXAR_ART_VER}\`
};

const PIXAR_DECK = [
${pixarLines.join(',\n')}
];
`;

fs.writeFileSync(path.join(root, 'js/pixar-deck.js'), pixarFile);
console.log('Built sanrio-deck.js (%d cards) and pixar-deck.js (%d cards)', sanrioDeck.length, pixarCards.length);
