/**
 * Build disney-deck.js from api.disneyapi.dev (Disney API).
 * Run: node scripts/build-disney-deck.js
 */
const fs = require('fs');
const path = require('path');
const { validateUniqueDeck, ensureUniqueImage } = require('./deck-rosters');

const API = 'https://api.disneyapi.dev/character';
const FANDOM_API = 'https://disney.fandom.com/api.php';
const root = path.join(__dirname, '..');

/** Fandom page title overrides (default: api name with underscores) */
const FANDOM_TITLES = {
  'Merida': 'Merida',
  'Dory': 'Dory',
  'Sulley': 'James_P._Sullivan',
  'Mater': 'Mater',
  'Sadness': 'Sadness',
  'Esmeralda': 'Esmeralda',
  'Lightning McQueen': 'Lightning_McQueen',
  'Mulan': 'Fa_Mulan',
  'Lilo': 'Lilo_Pelekai',
  'Buzz Lightyear': 'Buzz_Lightyear',
  'Wreck-It Ralph': 'Wreck-It_Ralph',
  'Vanellope': 'Vanellope_von_Schweetz',
  'Cruella': 'Cruella_de_Vil',
  'Captain Hook': 'Captain_Hook',
  'Heihei': 'Heihei',
  'Jane Porter': 'Jane_Porter',
  'Philoctetes': 'Philoctetes',
  'Héctor': 'Héctor',
  'Mike Wazowski': 'Mike_Wazowski',
  'Remy': 'Remy',
  'Judy Hopps': 'Judy_Hopps',
  'Nick Wilde': 'Nick_Wilde',
  'Jiminy Cricket': 'Jiminy_Cricket',
  'Winnie the Pooh': 'Winnie_the_Pooh',
  'Tinker Bell': 'Tinker_Bell',
  'Flynn Rider': 'Flynn_Rider',
  'Peter Pan': 'Peter_Pan',
  'Snow White': 'Snow_White'
};

const UA = 'HEIHEIMaths/1.0 (educational gacha deck builder)';

const DISNEY_CHARS = [
  { api: 'Mickey Mouse', zh: '米奇老鼠' },
  { api: 'Minnie Mouse', zh: '米妮老鼠' },
  { api: 'Donald Duck', zh: '唐老鴨' },
  { api: 'Goofy', zh: '高飛' },
  { api: 'Pluto', zh: '布魯托' },
  { api: 'Elsa', zh: '艾莎' },
  { api: 'Anna', zh: '安娜' },
  { api: 'Olaf', zh: '小白' },
  { api: 'Ariel', zh: '愛麗兒' },
  { api: 'Belle', zh: '貝兒' },
  { api: 'Beast', zh: '野獸' },
  { api: 'Cinderella', zh: '仙杜瑞拉' },
  { api: 'Snow White', zh: '白雪公主' },
  { api: 'Aurora', zh: '愛洛' },
  { api: 'Mulan', zh: '花木蘭' },
  { api: 'Moana', zh: '慕安娜' },
  { api: 'Maui', zh: '毛伊' },
  { api: 'Simba', zh: '辛巴' },
  { api: 'Timon', zh: '丁滿' },
  { api: 'Pumbaa', zh: '彭彭' },
  { api: 'Stitch', zh: '史迪奇' },
  { api: 'Lilo', zh: '莉羅' },
  { api: 'Aladdin', zh: '阿拉丁' },
  { api: 'Jasmine', zh: '茉莉' },
  { api: 'Genie', zh: '精靈' },
  { api: 'Peter Pan', zh: '彼得潘' },
  { api: 'Tinker Bell', zh: '小叮噹' },
  { api: 'Winnie the Pooh', zh: '小熊維尼' },
  { api: 'Tigger', zh: '跳跳虎' },
  { api: 'Rapunzel', zh: '樂佩' },
  { api: 'Flynn Rider', zh: '費林' },
  { api: 'Merida', alt: ['Princess Merida'], zh: '梅莉達' },
  { api: 'Tiana', zh: '蒂安娜' },
  { api: 'Baymax', zh: '大白' },
  { api: 'Woody', zh: '胡迪' },
  { api: 'Buzz Lightyear', alt: ['Buzz'], zh: '巴斯光年' },
  { api: 'Nemo', zh: '尼莫' },
  { api: 'Dory', alt: ['Dory (Finding Nemo)'], zh: '多莉' },
  { api: 'Maleficent', zh: '黑魔女' },
  { api: 'Ursula', zh: '烏蘇拉' },
  { api: 'Scar', zh: '刀疤' },
  { api: 'Hercules', zh: '大力士' },
  { api: 'Tarzan', zh: '泰山' },
  { api: 'Pinocchio', zh: '木偶皮諾丘' },
  { api: 'Dumbo', zh: '小飛象' },
  { api: 'Bambi', zh: '小鹿斑比' },
  { api: 'Alice', zh: '愛麗絲' },
  { api: 'Cheshire Cat', zh: '柴郡貓' },
  { api: 'Mufasa', zh: '木法沙' },
  { api: 'Zazu', zh: '沙祖' },
  { api: 'Kristoff', zh: '克斯托夫' },
  { api: 'Sven', zh: '斯特' },
  { api: 'Mushu', zh: '木須龍' },
  { api: 'Hades', zh: '哈迪斯' },
  { api: 'Megara', zh: '蜜格拉' },
  { api: 'Philoctetes', alt: ['Phil'], zh: '菲羅克忒忒斯' },
  { api: 'Pocahontas', zh: '寶嘉康蒂' },
  { api: 'Kuzco', zh: '庫斯德' },
  { api: 'Kronk', zh: '克朗克' },
  { api: 'Yzma', zh: '伊茲瑪' },
  { api: 'Quasimodo', zh: '鐘樓怪人' },
  { api: 'Esmeralda', zh: '愛斯梅達' },
  { api: 'Phoebus', zh: '菲比斯' },
  { api: 'Jane Porter', alt: ['Jane'], zh: '珍·波特' },
  { api: 'Terk', zh: '泰克' },
  { api: 'Kida', zh: '姬妲' },
  { api: 'Milo', zh: '邁羅' },
  { api: 'Raya', zh: '拉雅' },
  { api: 'Sisu', zh: '希蘇' },
  { api: 'Mirabel', zh: '米拉貝' },
  { api: 'Bruno', zh: '布魯諾' },
  { api: 'Miguel', zh: '米格' },
  { api: 'Héctor', alt: ['Hector'], zh: '海克特' },
  { api: 'Luca', zh: '路卡' },
  { api: 'Alberto', zh: '艾伯托' },
  { api: 'Sulley', alt: ['James P. Sullivan'], zh: '毛怪' },
  { api: 'Mike Wazowski', alt: ['Mike'], zh: '大眼仔' },
  { api: 'Remy', zh: '小米' },
  { api: 'Lightning McQueen', zh: '閃電麥昆' },
  { api: 'Mater', zh: '拖線' },
  { api: 'Judy Hopps', zh: '兔朱迪' },
  { api: 'Nick Wilde', zh: '狐尼克' },
  { api: 'Wreck-It Ralph', alt: ['Ralph'], zh: '破壞王拉夫' },
  { api: 'Vanellope', zh: '雲妮洛' },
  { api: 'Joy', zh: '樂樂' },
  { api: 'Sadness', zh: '憂憂' },
  { api: 'Baloo', zh: '巴魯' },
  { api: 'Bagheera', zh: '巴希拉' },
  { api: 'Shere Khan', zh: '謝利·可汗' },
  { api: 'Lady', zh: '小姐' },
  { api: 'Tramp', zh: '流浪漢' },
  { api: 'Cruella', alt: ['Cruella de Vil'], zh: '庫伊拉' },
  { api: 'Jiminy Cricket', zh: '蟋蟀吉姆尼' },
  { api: 'Chip', zh: '奇奇' },
  { api: 'Dale', zh: '蒂蒂' },
  { api: 'Wendy', zh: '溫蒂' },
  { api: 'Captain Hook', alt: ['Hook'], zh: '虎克船長' },
  { api: 'Heihei', alt: ['Hei Hei'], zh: '嘿嘿' },
  { api: 'Pascal', zh: '帕斯卡' },
  { api: 'Maximus', zh: '馬克斯' }
];

const THEMES_A = [
  '奇幻城堡', '星光魔法', '童話舞會', '煙火夜空', '魔法森林', '王子公主', '仙女教母', '金色大門',
  '夢幻煙花', '冰雪王國', '海底宮殿', '叢林冒險', '太空旅程', '燈神許願', '飛翔夢境', '維尼蜂蜜',
  '長髮高塔', '勇敢傳說', '新奧爾良', '醫療機器人', '牛仔小鎮', '星際巡邏', '珊瑚礁', '健忘冒險',
  '黑魔法', '深海女巫', '榮耀岩石', '奧林匹克', '叢林之王', '木偶奇遇', '馬戲團', '森林小鹿',
  '仙境茶會', '微笑貓咪', '草原之王', '管家小鳥', '米奇經典', '米妮蝴蝶結', '唐老鴨帽', '高飛帽子',
  '布魯托骨頭', '艾莎冰雪', '安娜勇氣', '小白雪人', '愛麗兒貝殼', '貝兒玫瑰', '野獸玫瑰', '仙履奇緣',
  '榮耀王座', '榮譽之聲'
];

const THEMES_B = [
  '夢幻遊輪', '午夜星空', '皇家舞會', '城堡煙火', '精靈森林', '浪漫邂逅', '魔法棒光', '童話之門',
  '流星許願', '極光之夜', '人魚之歌', '探險地圖', '火箭升空', '神燈傳說', '永恆童年', '百畝森林',
  '天燈升空', '射箭比賽', '爵士之夜', '舊京風情', '玩具總動員', '巴斯降落', '海底總動員', '健忘好友',
  '邪惡詛咒', '章魚觸手', '復仇計劃', '英雄之旅', '藤蔓擺盪', '長鼻木偶', '飛天象耳', '春日花叢',
  '兔子洞', '神秘笑容', '王國榮耀', '報時小鳥', '經典登場', '粉色蝴蝶結', '水手服', '迷糊先生',
  '忠犬好友', '冰雪奇緣', '姐妹情深', '夏日雪人', '海底世界', '圖書館', '真愛之吻', '水晶鞋',
  '王者傳承', '天空歌唱'
];

const CARD_THEMES = [...THEMES_A, ...THEMES_B];

function esc(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function asList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return [data];
}

async function fetchCharacter(name) {
  const url = `${API}?name=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${name}`);
  const json = await res.json();
  const list = asList(json.data);
  const exact = list.find(c => c.name?.toLowerCase() === name.toLowerCase());
  const pick = exact || list.find(c => c.imageUrl) || list[0];
  if (!pick?.imageUrl) return null;
  return { apiId: pick._id, imageUrl: pick.imageUrl, apiName: pick.name };
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchFandomImage(title) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    format: 'json',
    pithumbsize: '500'
  });
  const res = await fetch(`${FANDOM_API}?${params}`, {
    headers: { 'User-Agent': 'HEIHEIMaths/1.0 (educational gacha deck builder)' }
  });
  if (!res.ok) throw new Error(`Fandom HTTP ${res.status}`);
  const json = await res.json();
  const page = Object.values(json.query?.pages || {})[0];
  if (!page || page.missing) return null;
  return page.thumbnail?.source || null;
}

async function downloadLocalImage(remoteUrl, filename) {
  const dir = path.join(root, 'assets/img/disney/cards');
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, filename);
  const res = await fetch(remoteUrl, {
    headers: { 'User-Agent': 'HEIHEIMaths/1.0 (educational gacha deck builder)' }
  });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return `assets/img/disney/cards/${filename}`;
}

function fandomTitleFor(entry) {
  if (FANDOM_TITLES[entry.api]) return FANDOM_TITLES[entry.api];
  return entry.api.replace(/ /g, '_');
}

function imageExt(url) {
  const path = String(url || '').split('?')[0].toLowerCase();
  if (path.endsWith('.png')) return 'png';
  if (path.endsWith('.jpeg')) return 'jpeg';
  if (path.endsWith('.webp')) return 'webp';
  return 'jpg';
}

async function verifyRemoteUrl(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA } });
    return res.ok;
  } catch {
    return false;
  }
}

async function mirrorRemoteImage(entry, remoteUrl) {
  const filename = `${slugify(entry.api)}.${imageExt(remoteUrl)}`;
  return downloadLocalImage(remoteUrl, filename);
}

async function resolveLocalImage(entry, disneyHit) {
  const remoteUrl = disneyHit?.imageUrl;
  if (remoteUrl && await verifyRemoteUrl(remoteUrl)) {
    const imageUrl = await mirrorRemoteImage(entry, remoteUrl);
    return {
      apiId: disneyHit.apiId,
      imageUrl,
      apiName: disneyHit.apiName,
      source: 'disney-local'
    };
  }

  const fandomUrl = await fetchFandomImage(fandomTitleFor(entry));
  if (fandomUrl && await verifyRemoteUrl(fandomUrl)) {
    const imageUrl = await mirrorRemoteImage(entry, fandomUrl);
    return {
      apiId: disneyHit?.apiId || 0,
      imageUrl,
      apiName: disneyHit?.apiName || entry.api,
      source: 'fandom-local'
    };
  }

  for (const alt of entry.alt || []) {
    const altUrl = await fetchFandomImage(alt.replace(/ /g, '_'));
    if (altUrl && await verifyRemoteUrl(altUrl)) {
      const imageUrl = await mirrorRemoteImage(entry, altUrl);
      return { apiId: 0, imageUrl, apiName: alt, source: 'fandom-local' };
    }
  }

  return null;
}

async function main() {
  if (DISNEY_CHARS.length !== 100) throw new Error(`Need 100 characters, got ${DISNEY_CHARS.length}`);
  if (CARD_THEMES.length !== 100) throw new Error(`Need 100 themes, got ${CARD_THEMES.length}`);

  const resolved = [];
  for (const entry of DISNEY_CHARS) {
    const names = [entry.api, ...(entry.alt || [])];
    let hit = null;
    for (const n of names) {
      try {
        hit = await fetchCharacter(n);
        if (hit) break;
      } catch (_) { /* try next */ }
      await sleep(80);
    }
    try {
      const local = await resolveLocalImage(entry, hit);
      if (local) {
        resolved.push({ ...entry, ...local });
        console.log(`✓ ${entry.zh} ← ${local.apiName} [${local.source}]`);
      } else {
        console.warn(`✗ no image: ${entry.api}`);
        resolved.push({
          ...entry,
          apiId: 0,
          imageUrl: `https://api.dicebear.com/9.x/fun-emoji/webp?seed=${encodeURIComponent(entry.api)}&size=256&backgroundColor=b6e3f4,c0aede`,
          apiName: entry.api,
          source: 'fallback'
        });
      }
    } catch (err) {
      console.warn(`✗ fetch failed ${entry.api}:`, err.message);
      resolved.push({
        ...entry,
        apiId: 0,
        imageUrl: `https://api.dicebear.com/9.x/fun-emoji/webp?seed=${encodeURIComponent(entry.api)}&size=256&backgroundColor=b6e3f4,c0aede`,
        apiName: entry.api,
        source: 'fallback'
      });
    }
    await sleep(120);
  }

  const RARITY = [
    ...Array(3).fill('ssr'), ...Array(10).fill('ur'), ...Array(12).fill('sr'),
    ...Array(25).fill('rare'), ...Array(50).fill('common')
  ];
  const tier = { ssr: '傳說', ur: '極稀有', sr: '超稀有', rare: '稀有', common: '普通' };

  const usedImages = new Set();
  const cards = [];
  for (let i = 0; i < resolved.length; i++) {
    const ch = resolved[i];
    const variant = CARD_THEMES[i];
    const imageUrl = ensureUniqueImage(ch.imageUrl, `${ch.api}-${i}`, usedImages);
    const rarity = RARITY[i];
    cards.push({
      char: ch.zh,
      variant,
      name: `${ch.zh}·${variant}`,
      rarity,
      imageUrl,
      apiId: ch.apiId,
      desc: `${tier[rarity]} · ${ch.zh} ${variant}`
    });
  }
  validateUniqueDeck(cards);

  const lines = cards.map(c =>
    `  { name: '${esc(c.name)}', rarity: '${c.rarity}', imageUrl: '${esc(c.imageUrl)}', apiId: ${c.apiId}, desc: '${esc(c.desc)}' }`
  );

  const disneyCount = resolved.filter(r => r.source === 'disney-local').length;
  const fandomCount = resolved.filter(r => r.source === 'fandom-local').length;
  const fallbackCount = resolved.filter(r => r.source === 'fallback').length;

  const out = `/* DISNEY 卡池：100 張全唔同角色，圖片已下載至 assets/img/disney/cards/ */
const DISNEY_API_VER = 4;
const DISNEY_DECK = [
${lines.join(',\n')}
];
`;

  fs.writeFileSync(path.join(root, 'js/disney-deck.js'), out);
  console.log(`\nBuilt js/disney-deck.js (${cards.length} cards: ${disneyCount} Disney-local, ${fandomCount} Fandom-local, ${fallbackCount} fallback)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
