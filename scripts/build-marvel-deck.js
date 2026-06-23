/**
 * Build marvel-deck.js from Marvel Developer API (gateway.marvel.com).
 * Keys: MARVEL_PUBLIC_KEY + MARVEL_PRIVATE_KEY env vars,
 *       or scripts/marvel-keys.local.json { "publicKey", "privateKey" }
 * Fallback: Marvel Database Fandom API when Marvel API unavailable.
 * Run: node scripts/build-marvel-deck.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { validateUniqueDeck, ensureUniqueImage } = require('./deck-rosters');

const MARVEL_API = 'https://gateway.marvel.com/v1/public';
const FANDOM_API = 'https://marvel.fandom.com/api.php';
const SUPERHERO_ALL_API = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';
const root = path.join(__dirname, '..');

/** Superhero API IDs for ambiguous names (akabab/superhero-api) */
const HERO_ID_OVERRIDES = {
  'Angel': 40,
  'Ant-Man': 31,
  'Venom': 687
};

/** Fandom page titles when character is absent from Superhero API */
const FANDOM_TITLES = {
  'Ms. Marvel': 'Kamala_Khan_(Earth-616)',
  'Squirrel Girl': 'Doreen_Green_(Earth-616)',
  'Miles Morales': 'Miles_Morales',
  'Wong': 'Wong_(Earth-199999)',
  'Shuri': 'Shuri',
  'Okoye': 'Okoye',
  'Valkyrie': 'Valkyrie',
  'Yondu': 'Yondu',
  'Ronan': 'Ronan_the_Accuser',
  'Baron Zemo': 'Helmut_Zemo',
  'Crossbones': 'Crossbones',
  'America Chavez': 'America_Chavez',
  'Ancient One': 'Ancient_One',
  'Korg': 'Korg',
  'Killmonger': 'Killmonger',
  'Red Guardian': 'Red_Guardian'
};

const MARVEL_CHARS = [
  { api: 'Iron Man', zh: '鋼鐵俠' },
  { api: 'Captain America', zh: '美國隊長' },
  { api: 'Spider-Man', zh: '蜘蛛俠' },
  { api: 'Thor', zh: '雷神' },
  { api: 'Hulk', zh: '浩克' },
  { api: 'Wolverine', zh: '金鋼狼' },
  { api: 'Black Widow', zh: '黑寡婦' },
  { api: 'Hawkeye', zh: '鷹眼' },
  { api: 'Doctor Strange', zh: '奇異博士' },
  { api: 'Black Panther', zh: '黑豹' },
  { api: 'Scarlet Witch', zh: '緋紅女巫' },
  { api: 'Vision', zh: '幻視' },
  { api: 'Loki', zh: '洛基' },
  { api: 'Thanos', zh: '滅霸' },
  { api: 'Deadpool', zh: '死侍' },
  { api: 'Daredevil', zh: '夜魔俠' },
  { api: 'Punisher', zh: '制裁者' },
  { api: 'Ant-Man', zh: '蟻人' },
  { api: 'Wasp', zh: '黃蜂女' },
  { api: 'Captain Marvel', zh: '驚奇隊長' },
  { api: 'Star-Lord', zh: '星爵' },
  { api: 'Gamora', zh: '卡魔拉' },
  { api: 'Groot', zh: '樹人格魯特' },
  { api: 'Rocket Raccoon', alt: ['Rocket'], zh: '火箭浣熊' },
  { api: 'Drax', alt: ['Drax the Destroyer'], zh: '毀滅者德拉克斯' },
  { api: 'Venom', zh: '毒液' },
  { api: 'Silver Surfer', zh: '銀色衝浪者' },
  { api: 'Ghost Rider', zh: '惡靈騎士' },
  { api: 'Blade', zh: '刀鋒戰士' },
  { api: 'Storm', zh: '暴風女' },
  { api: 'Cyclops', zh: '獨眼龍' },
  { api: 'Jean Grey', zh: '琴·葛雷' },
  { api: 'Magneto', zh: '萬磁王' },
  { api: 'Professor X', alt: ['Professor Xavier'], zh: 'X教授' },
  { api: 'Thing', zh: '石頭人' },
  { api: 'Human Torch', zh: '火神' },
  { api: 'Mister Fantastic', alt: ['Mr. Fantastic'], zh: '神奇先生' },
  { api: 'Moon Knight', zh: '月光騎士' },
  { api: 'Ms. Marvel', zh: '驚奇少女' },
  { api: 'Falcon', zh: '獵鷹' },
  { api: 'Winter Soldier', zh: '冬兵' },
  { api: 'War Machine', zh: '戰爭機器' },
  { api: 'Doctor Doom', zh: '末日博士' },
  { api: 'Ultron', zh: '奧創' },
  { api: 'Nova', zh: '新星' },
  { api: 'Squirrel Girl', zh: '松鼠妹' },
  { api: 'Shang-Chi', zh: '尚氣' },
  { api: 'Namor', zh: '納摩' },
  { api: 'She-Hulk', zh: '女浩克' },
  { api: 'Iron Fist', zh: '鐵拳俠' },
  { api: 'Miles Morales', zh: '邁爾斯·莫拉萊斯' },
  { api: 'Spider-Gwen', zh: '蜘蛛格溫' },
  { api: 'Green Goblin', zh: '綠魔' },
  { api: 'Doctor Octopus', zh: '八爪博士' },
  { api: 'Carnage', zh: '屠殺' },
  { api: 'Red Skull', zh: '紅骷髏' },
  { api: 'Kingpin', zh: '金並' },
  { api: 'Bullseye', zh: '靶眼' },
  { api: 'Elektra', zh: '艾麗卡' },
  { api: 'Wong', zh: '王' },
  { api: 'Shuri', zh: '舒莉' },
  { api: 'Okoye', zh: '奧科耶' },
  { api: 'Valkyrie', zh: '女武神' },
  { api: 'Hela', zh: '海拉' },
  { api: 'Nebula', zh: '星雲' },
  { api: 'Yondu', zh: '勇度' },
  { api: 'Ronan', alt: ['Ronan the Accuser'], zh: '羅南' },
  { api: 'Mantis', zh: '螳螂女' },
  { api: 'Beast', zh: '野獸' },
  { api: 'Nightcrawler', zh: '夜行者' },
  { api: 'Colossus', zh: '鋼人' },
  { api: 'Rogue', zh: '小淘氣' },
  { api: 'Gambit', zh: '牌皇' },
  { api: 'Mystique', zh: '魔形女' },
  { api: 'Sabretooth', zh: '劍齒虎' },
  { api: 'Apocalypse', zh: '天啟' },
  { api: 'Quicksilver', zh: '快銀' },
  { api: 'Psylocke', zh: '靈蝶' },
  { api: 'Adam Warlock', zh: '亞當術士' },
  { api: 'Captain Britain', zh: '英國隊長' },
  { api: 'Red Hulk', zh: '紅浩克' },
  { api: 'Abomination', zh: '惡煞' },
  { api: 'MODOK', zh: '魔多克' },
  { api: 'Baron Zemo', zh: '澤莫男爵' },
  { api: 'Crossbones', zh: '交叉骨' },
  { api: 'Taskmaster', zh: '模仿大師' },
  { api: 'America Chavez', zh: '美國小姐' },
  { api: 'Ancient One', zh: '古一' },
  { api: 'Korg', zh: '科恩格' },
  { api: 'Killmonger', zh: '奇爾蒙格' },
  { api: 'Red Guardian', zh: '紅色守護者' },
  { api: 'Invisible Woman', zh: '隱形女' },
  { api: 'Kitty Pryde', zh: '暗影貓' },
  { api: 'Iceman', zh: '冰人' },
  { api: 'Angel', zh: '天使' },
  { api: 'Cable', zh: '電索' },
  { api: 'Domino', zh: '多米諾' },
  { api: 'Negasonic Teenage Warhead', zh: '負音波' },
  { api: 'Bishop', zh: '主教' },
  { api: 'Pyro', zh: '火人' }
];

const THEMES_A = [
  '復仇者集結', '紐約保衛', '量子領域', '太空戰役', '神盾局', '九頭蛇', '瓦干達', '阿斯嘉',
  '索科維亞', '無限寶石', '時間變異', '多元宇宙', '蜘蛛感應', '雷神之錘', '浩克憤怒', '金屬利爪',
  '間諜任務', '精準射擊', '魔法維度', '王國榮耀', '混沌魔法', '心靈寶石', '詭計之神', '宇宙平衡',
  '打破第四牆', '地獄廚房', '黑暗正義', '螞蟻軍團', '黃蜂突擊', '宇宙飛行', '銀河守護', '綠色巨人',
  '火箭火力', '毀滅打擊', '共生體', '宇宙衝浪', '地獄火焰', '吸血鬼獵人', '天氣掌控', '雷射眼',
  '鳳凰之力', '磁力場', '心靈感應', '岩石拳', '火焰飛行', '橡膠伸展', '月光審判', '驚奇力量',
  '天空翱翔', '冬日刺客'
];

const THEMES_B = [
  '終局之戰', '城市英雄', '微縮冒險', '星際巡邏', '秘密行動', '邪惡組織', '非洲王國', '彩虹橋',
  '廢墟救援', '響指危機', '時間修正', '平行世界', '蛛網發射', '風暴召喚', '綠色巨人', '再生能力',
  '紅色房間', '百步穿楊', '奇異傳送', '黑豹戰衣', '現實扭曲', '合成生命', '王子身份', '泰坦遠征',
  '嘴砲戰士', '夜間巡邏', '槍手制裁', '縮小突襲', '飛行突擊', '光子能量', '星際盜賊', '銀河樹人',
  '機械專家', '復仇之路', '黑色共生', '銀色滑板', '靈魂審判', '暗夜獵殺', '閃電風暴', '領袖之眼',
  '心靈風暴', '金屬操控', 'X學院', '藍色巨石', '烈焰衝鋒', '科學天才', '月神護衛', '宇宙能量',
  '自由之翼', '洗腦覺醒'
];

const CARD_THEMES = [...THEMES_A, ...THEMES_B];

function esc(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function loadKeys() {
  const pub = process.env.MARVEL_PUBLIC_KEY;
  const priv = process.env.MARVEL_PRIVATE_KEY;
  if (pub && priv) return { publicKey: pub, privateKey: priv };
  const local = path.join(__dirname, 'marvel-keys.local.json');
  if (fs.existsSync(local)) {
    const j = JSON.parse(fs.readFileSync(local, 'utf8'));
    if (j.publicKey && j.privateKey) return j;
  }
  return null;
}

function marvelImageUrl(thumbnail) {
  if (!thumbnail?.path || thumbnail.path.includes('image_not_available')) return null;
  const base = thumbnail.path.replace(/^http:/, 'https:');
  return `${base}/portrait_uncanny.${thumbnail.extension}`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let superheroCache = null;

async function loadSuperheroApi() {
  if (superheroCache) return superheroCache;
  const res = await fetch(SUPERHERO_ALL_API);
  if (!res.ok) throw new Error(`Superhero API HTTP ${res.status}`);
  superheroCache = await res.json();
  return superheroCache;
}

async function fetchMarvelApi(name, keys) {
  const ts = Date.now().toString();
  const hash = crypto.createHash('md5').update(ts + keys.privateKey + keys.publicKey).digest('hex');
  const q = new URLSearchParams({ name, ts, apikey: keys.publicKey, hash });
  const res = await fetch(`${MARVEL_API}/characters?${q}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 200 || !json.data?.results?.length) return null;
  const exact = json.data.results.find(c => c.name?.toLowerCase() === name.toLowerCase());
  const pick = exact || json.data.results.find(c => marvelImageUrl(c.thumbnail)) || json.data.results[0];
  const imageUrl = marvelImageUrl(pick.thumbnail);
  if (!imageUrl) return null;
  return { apiId: pick.id, imageUrl, apiName: pick.name, source: 'marvel' };
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
  const pages = json.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || page.missing) return null;
  return page.thumbnail?.source || null;
}

function heroImageUrl(hero) {
  return hero?.images?.lg || hero?.images?.md || hero?.images?.sm || null;
}

function scoreSuperheroMatch(hero, query) {
  const q = query.toLowerCase();
  const name = String(hero.name || '').toLowerCase();
  const full = String(hero.biography?.fullName || '').toLowerCase();
  const pub = String(hero.biography?.publisher || '').toLowerCase();
  const aliases = (hero.biography?.aliases || []).map(a => String(a).toLowerCase());
  let score = 0;
  if (name === q) score += 100;
  else if (name.startsWith(q + ' ') || name.startsWith(q + '-')) score += 80;
  else if (name.includes(q)) score += 40;
  if (full.includes(q)) score += 30;
  if (aliases.some(a => a === q || a.includes(q))) score += 25;
  if (pub.includes('marvel')) score += 15;
  if (name.endsWith(' ii') || name.includes(' girl') || name.includes('evil ')) score -= 20;
  if (pub.includes('dc comics')) score -= 50;
  return score;
}

function findSuperheroMatch(all, query) {
  const scored = all
    .map(h => ({ h, s: scoreSuperheroMatch(h, query) }))
    .filter(x => x.s >= 40)
    .sort((a, b) => b.s - a.s);
  return scored[0]?.h || null;
}

async function fetchSuperheroImage(name, heroId) {
  const all = await loadSuperheroApi();
  if (heroId) {
    const byId = all.find(x => x.id === heroId);
    if (byId) return heroImageUrl(byId);
  }
  const hit = findSuperheroMatch(all, name);
  return hit ? heroImageUrl(hit) : null;
}

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function downloadLocalImage(remoteUrl, filename) {
  const dir = path.join(root, 'assets/img/marvel/cards');
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, filename);
  const res = await fetch(remoteUrl, {
    headers: { 'User-Agent': 'HEIHEIMaths/1.0 (educational gacha deck builder)' }
  });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return `assets/img/marvel/cards/${filename}`;
}

async function fetchFandomLocalImage(entry) {
  const title = FANDOM_TITLES[entry.api];
  if (!title) return null;
  const remoteUrl = await fetchFandomImage(title);
  if (!remoteUrl) return null;
  const ext = remoteUrl.includes('.png') ? 'png' : 'jpg';
  const filename = `${slugify(entry.api)}.${ext}`;
  try {
    return await downloadLocalImage(remoteUrl, filename);
  } catch (err) {
    console.warn(`  Fandom download: ${entry.api} — ${err.message}`);
    return null;
  }
}

async function resolveCharacter(entry, keys) {
  const names = [entry.api, ...(entry.alt || [])];
  if (keys) {
    for (const n of names) {
      try {
        const hit = await fetchMarvelApi(n, keys);
        if (hit) return hit;
      } catch (err) {
        console.warn(`  Marvel API: ${n} — ${err.message}`);
      }
      await sleep(150);
    }
  }
  const heroId = HERO_ID_OVERRIDES[entry.api];
  for (const n of names) {
    try {
      const imageUrl = await fetchSuperheroImage(n, heroId);
      if (imageUrl) {
        return { apiId: heroId || 0, imageUrl, apiName: n, source: 'superhero' };
      }
    } catch (err) {
      console.warn(`  Superhero API: ${n} — ${err.message}`);
    }
    await sleep(80);
  }
  try {
    const imageUrl = await fetchFandomLocalImage(entry);
    if (imageUrl) {
      return { apiId: 0, imageUrl, apiName: entry.api, source: 'fandom-local' };
    }
  } catch (err) {
    console.warn(`  Fandom local: ${entry.api} — ${err.message}`);
  }
  return {
    apiId: 0,
    imageUrl: `https://api.dicebear.com/9.x/bottts-neutral/webp?seed=${encodeURIComponent(entry.api)}&size=256&backgroundColor=1e293b,dc2626`,
    apiName: entry.api,
    source: 'fallback'
  };
}

async function main() {
  if (MARVEL_CHARS.length !== 100) throw new Error(`Need 100 characters, got ${MARVEL_CHARS.length}`);
  if (CARD_THEMES.length !== 100) throw new Error(`Need 100 themes, got ${CARD_THEMES.length}`);

  const keys = loadKeys();
  console.log(keys ? 'Using Marvel Developer API keys' : 'No Marvel API keys — using Fandom fallback');

  const resolved = [];
  for (const entry of MARVEL_CHARS) {
    const hit = await resolveCharacter(entry, keys);
    resolved.push({ ...entry, ...hit });
    const tag = hit.source === 'marvel'
      ? 'MARVEL'
      : hit.source === 'superhero'
        ? 'Superhero'
        : hit.source === 'fandom-local'
          ? 'Fandom-local'
          : hit.source === 'fandom'
            ? 'Fandom'
            : 'fallback';
    console.log(`${hit.imageUrl ? '✓' : '✗'} ${entry.zh} ← ${hit.apiName} [${tag}]`);
    await sleep(100);
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
    const imageUrl = ensureUniqueImage(
      ch.imageUrl,
      `marvel-${ch.api}-${i}`,
      usedImages
    );
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

  const marvelCount = resolved.filter(r => r.source === 'marvel').length;
  const superheroCount = resolved.filter(r => r.source === 'superhero').length;
  const fandomLocalCount = resolved.filter(r => r.source === 'fandom-local').length;
  const fallbackCount = resolved.filter(r => r.source === 'fallback').length;
  const lines = cards.map(c =>
    `  { name: '${esc(c.name)}', rarity: '${c.rarity}', imageUrl: '${esc(c.imageUrl)}', apiId: ${c.apiId}, desc: '${esc(c.desc)}' }`
  );

  const out = `/* MARVEL 卡池：100 張全唔同角色，圖片來自 Marvel API / Superhero API / 本地 Fandom 備援 */
const MARVEL_API_VER = 4;
const MARVEL_DECK = [
${lines.join(',\n')}
];
`;

  fs.writeFileSync(path.join(root, 'js/marvel-deck.js'), out);
  console.log(`\nBuilt js/marvel-deck.js (${cards.length} cards: ${marvelCount} Marvel API, ${superheroCount} Superhero, ${fandomLocalCount} Fandom-local, ${fallbackCount} fallback)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
