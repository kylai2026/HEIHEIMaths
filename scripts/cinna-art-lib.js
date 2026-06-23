/**
 * Procedural Cinnamoroll-style card art — 6 characters, multiple poses & props.
 */
function hash(n) {
  let x = n * 2654435761;
  return ((x >>> 0) % 1000) / 1000;
}

const CHAR_FROM_NAME = [
  { keys: ['摩卡'], id: 'mocha' },
  { keys: ['牛奶'], id: 'milk' },
  { keys: ['芙蘭'], id: 'chiffon' },
  { keys: ['卡布奇諾'], id: 'cappuccino' },
  { keys: ['濃縮咖啡'], id: 'espresso' }
];

const POSE_FROM_NAME = [
  { keys: ['飛行', '雲海', '銀河漫步'], id: 'fly' },
  { keys: ['睡覺', '午覺', '午睡', '搖籃', '慵懶', '打盹'], id: 'sleep' },
  { keys: ['探頭', '驚喜'], id: 'peek' },
  { keys: ['雪糕座', '坐下', '花籃'], id: 'sit' }
];

const PROP_FROM_NAME = [
  { keys: ['草莓'], svg: '<circle cx="128" cy="52" r="14" fill="#ef4444"/><path d="M128 42 L132 36 L124 36 Z" fill="#22c55e"/>' },
  { keys: ['雨', '傘'], svg: '<path d="M88 78 Q128 48 168 78" fill="none" stroke="#60a5fa" stroke-width="4"/><line x1="128" y1="78" x2="128" y2="110" stroke="#64748b" stroke-width="3"/>' },
  { keys: ['雪糕', '冰淇淋'], svg: '<polygon points="118,95 138,95 128,65" fill="#fbbf24"/><ellipse cx="128" cy="62" rx="18" ry="12" fill="#fda4af"/>' },
  { keys: ['氣球'], svg: '<circle cx="100" cy="58" r="12" fill="#f472b6"/><circle cx="128" cy="48" r="14" fill="#60a5fa"/><circle cx="156" cy="58" r="11" fill="#fbbf24"/><line x1="128" y1="62" x2="128" y2="88" stroke="#94a3b8" stroke-width="2"/>' },
  { keys: ['櫻花'], svg: '<text x="48" y="52" font-size="22" fill="#fda4af">🌸</text><text x="188" y="68" font-size="18" fill="#fda4af">🌸</text><text x="72" y="200" font-size="16" fill="#fbcfe8">🌸</text>' },
  { keys: ['聖誕'], svg: '<polygon points="128,42 142,68 114,68" fill="#ef4444"/><rect x="120" y="68" width="16" height="6" fill="#fef08a"/><circle cx="128" cy="36" r="6" fill="#fff"/>' },
  { keys: ['圍巾'], svg: '<path d="M98 108 Q128 128 158 108 L152 122 Q128 138 104 122 Z" fill="#fda4af"/>' },
  { keys: ['蝴蝶結'], svg: '<ellipse cx="108" cy="88" rx="10" ry="7" fill="#f472b6"/><ellipse cx="148" cy="88" rx="10" ry="7" fill="#f472b6"/><circle cx="128" cy="88" r="5" fill="#ec4899"/>' },
  { keys: ['星星', '星座', '星空', '銀河', '望遠鏡'], svg: '<text x="42" y="44" font-size="20" fill="#fef08a">✦</text><text x="198" y="56" font-size="16" fill="#fff">★</text><text x="168" y="198" font-size="18" fill="#bae6fd">✦</text><circle cx="200" cy="180" r="2" fill="#fff"/><circle cx="56" cy="170" r="2" fill="#fff"/>' },
  { keys: ['月亮'], svg: '<path d="M170 48 A28 28 0 1 1 150 76 A22 22 0 1 0 170 48" fill="#fef08a" opacity="0.9"/>' },
  { keys: ['太陽', '晴天'], svg: '<circle cx="196" cy="48" r="18" fill="#fbbf24" opacity="0.85"/><g stroke="#fbbf24" stroke-width="2"><line x1="196" y1="22" x2="196" y2="14"/><line x1="196" y1="74" x2="196" y2="82"/><line x1="170" y1="48" x2="162" y2="48"/><line x1="222" y1="48" x2="230" y2="48"/></g>' },
  { keys: ['彩虹'], svg: '<path d="M40 170 Q128 90 216 170" fill="none" stroke="#f472b6" stroke-width="5" opacity="0.5"/><path d="M52 170 Q128 105 204 170" fill="none" stroke="#fbbf24" stroke-width="5" opacity="0.5"/><path d="M64 170 Q128 118 192 170" fill="none" stroke="#60a5fa" stroke-width="5" opacity="0.5"/>' },
  { keys: ['雪花', '冬日', '極光', '滑雪', '雪人'], svg: '<text x="52" y="58" font-size="18" fill="#fff">❄</text><text x="178" y="72" font-size="14" fill="#e0f2fe">❄</text><text x="90" y="210" font-size="16" fill="#fff">❄</text>' },
  { keys: ['煙花', '慶典', '派對'], svg: '<circle cx="64" cy="50" r="3" fill="#f472b6"/><circle cx="72" cy="42" r="2" fill="#fbbf24"/><line x1="64" y1="50" x2="48" y2="34" stroke="#f472b6" stroke-width="1.5"/><line x1="64" y1="50" x2="80" y2="30" stroke="#60a5fa" stroke-width="1.5"/><circle cx="188" cy="46" r="3" fill="#a78bfa"/><line x1="188" y1="46" x2="200" y2="28" stroke="#fbbf24" stroke-width="1.5"/>' },
  { keys: ['禮物', '生日'], svg: '<rect x="108" y="200" width="40" height="28" rx="4" fill="#60a5fa"/><rect x="108" y="192" width="40" height="12" fill="#f472b6"/><rect x="124" y="192" width="8" height="36" fill="#fef08a"/>' },
  { keys: ['咖啡', '茶會', '下午茶'], svg: '<rect x="178" y="188" width="28" height="22" rx="4" fill="#fff" stroke="#94a3b8"/><path d="M206 194 Q218 194 218 204 Q218 214 206 214" fill="none" stroke="#94a3b8" stroke-width="2"/><ellipse cx="192" cy="196" rx="10" ry="4" fill="#8b5a2b" opacity="0.5"/>' },
  { keys: ['音符'], svg: '<text x="178" y="62" font-size="28" fill="#a78bfa">♪</text><text x="58" y="78" font-size="22" fill="#f472b6">♫</text>' },
  { keys: ['相機', '拍照'], svg: '<rect x="168" y="186" width="36" height="26" rx="6" fill="#334155"/><circle cx="186" cy="198" r="9" fill="#94a3b8"/><rect x="178" y="182" width="16" height="8" rx="2" fill="#475569"/>' },
  { keys: ['風箏'], svg: '<polygon points="48,80 68,50 88,80 68,95" fill="#fda4af"/><line x1="68" y1="95" x2="68" y2="130" stroke="#94a3b8" stroke-width="2"/>' },
  { keys: ['貝殼', '海'], svg: '<path d="M40 200 Q52 180 64 200 Q52 215 40 200" fill="#fda4af"/><ellipse cx="200" cy="198" rx="14" ry="8" fill="#bae6fd"/>' },
  { keys: ['楓葉'], svg: '<text x="186" y="196" font-size="24" fill="#ea580c">🍁</text><text x="48" y="68" font-size="18" fill="#f97316">🍁</text>' },
  { keys: ['糖果', '餅乾', '蛋糕', '牛奶糖', '棉花糖', '甜品'], svg: '<circle cx="186" cy="196" r="14" fill="#f472b6" opacity="0.8"/><rect x="42" y="188" width="22" height="18" rx="3" fill="#fbbf24" opacity="0.8"/>' },
  { keys: ['愛心'], svg: '<text x="128" y="56" font-size="26" fill="#f472b6">♥</text>' },
  { keys: ['花朵'], svg: '<circle cx="128" cy="48" r="10" fill="#fda4af"/><circle cx="116" cy="44" r="6" fill="#fbcfe8"/><circle cx="140" cy="44" r="6" fill="#fbcfe8"/><circle cx="120" cy="56" r="6" fill="#fbcfe8"/><circle cx="136" cy="56" r="6" fill="#fbcfe8"/>' },
  { keys: ['鈴鐺'], svg: '<path d="M118 78 Q128 62 138 78 L134 88 Q128 82 122 88 Z" fill="#fbbf24"/><circle cx="128" cy="90" r="4" fill="#fef08a"/>' },
  { keys: ['皇冠', '皇家', '音樂會'], svg: '<polygon points="108,72 118,52 128,68 138,52 148,72" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/><rect x="108" y="72" width="40" height="8" fill="#f59e0b"/>' },
  { keys: ['壽司'], svg: '<ellipse cx="56" cy="196" rx="16" ry="10" fill="#fff" stroke="#94a3b8"/><circle cx="56" cy="192" r="6" fill="#f97316"/><ellipse cx="200" cy="188" rx="14" ry="9" fill="#fef08a" stroke="#ca8a04"/>' },
  { keys: ['雲朵'], svg: '<ellipse cx="56" cy="200" rx="28" ry="14" fill="#fff" opacity="0.85"/><ellipse cx="200" cy="188" rx="24" ry="12" fill="#fff" opacity="0.75"/><ellipse cx="128" cy="210" rx="36" ry="16" fill="#fff" opacity="0.6"/>' },
  { keys: ['泰迪', '玩具熊'], svg: '<circle cx="186" cy="196" r="16" fill="#d97706"/><circle cx="178" cy="188" r="5" fill="#d97706"/><circle cx="194" cy="188" r="5" fill="#d97706"/><circle cx="182" cy="198" r="2" fill="#451a03"/><circle cx="190" cy="198" r="2" fill="#451a03"/>' },
  { keys: ['泡泡'], svg: '<circle cx="52" cy="188" r="10" fill="none" stroke="#bae6fd" stroke-width="2" opacity="0.8"/><circle cx="68" cy="172" r="7" fill="none" stroke="#fda4af" stroke-width="2" opacity="0.7"/><circle cx="44" cy="168" r="5" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.7"/>' },
  { keys: ['熱可可'], svg: '<rect x="42" y="188" width="26" height="24" rx="4" fill="#fff" stroke="#94a3b8"/><ellipse cx="55" cy="192" rx="9" ry="4" fill="#78350f" opacity="0.6"/>' },
  { keys: ['地圖', '背包', '探險'], svg: '<rect x="48" y="190" width="30" height="22" rx="2" fill="#d97706" opacity="0.8"/><path d="M48 190 L63 182 L78 190 L63 198 Z" fill="#b45309" opacity="0.8"/>' },
  { keys: ['枕頭', '毛毯'], svg: '<rect x="170" y="196" width="36" height="18" rx="6" fill="#fda4af" opacity="0.8"/><rect x="40" y="200" width="44" height="14" rx="4" fill="#bae6fd" opacity="0.7"/>' }
];

const CHAR_STYLES = {
  cinna: { body: '#ffffff', ear: '#ffffff', eye: '#60a5fa', cheek: '#fda4af', stroke: '#94a3b8', accent: '#bae6fd' },
  mocha: { body: '#d4b896', ear: '#c4a574', eye: '#78350f', cheek: '#fda4af', stroke: '#92400e', accent: '#f472b6' },
  milk: { body: '#fffbeb', ear: '#fef3c7', eye: '#60a5fa', cheek: '#fda4af', stroke: '#d6d3d1', accent: '#fda4af' },
  chiffon: { body: '#fecdd3', ear: '#fda4af', eye: '#be185d', cheek: '#fb7185', stroke: '#e11d48', accent: '#fff' },
  cappuccino: { body: '#a68a64', ear: '#8b6914', eye: '#1e3a5f', cheek: '#fda4af', stroke: '#57534e', accent: '#bae6fd' },
  espresso: { body: '#e8d4b8', ear: '#d4b896', eye: '#44403c', cheek: '#fda4af', stroke: '#78716c', accent: '#57534e' }
};

const BG_BY_RARITY = {
  ssr: [['#1e1b4b', '#312e81'], ['#4c0519', '#881337'], ['#134e4a', '#115e59']],
  ur: [['#fef3c7', '#fde68a'], ['#fce7f3', '#fbcfe8'], ['#e0f2fe', '#bae6fd'], ['#f3e8ff', '#e9d5ff']],
  sr: [['#f3e8ff', '#ddd6fe'], ['#dbeafe', '#bfdbfe'], ['#dcfce7', '#bbf7d0']],
  rare: [['#e0f2fe', '#bae6fd'], ['#fce7f3', '#fbcfe8'], ['#ffedd5', '#fed7aa']],
  common: [['#f8fafc', '#e2e8f0'], ['#f1f5f9', '#e2e8f0'], ['#fafafa', '#f1f5f9']]
};

function detectChar(name) {
  for (const c of CHAR_FROM_NAME) {
    if (c.keys.some(k => name.includes(k))) return c.id;
  }
  return 'cinna';
}

function detectPose(name) {
  for (const p of POSE_FROM_NAME) {
    if (p.keys.some(k => name.includes(k))) return p.id;
  }
  return 'stand';
}

function detectProps(name) {
  const props = [];
  for (const p of PROP_FROM_NAME) {
    if (p.keys.some(k => name.includes(k))) props.push(p.svg);
  }
  return props.slice(0, 3);
}

function rarityTier(rarity) {
  return { common: 1, rare: 2, sr: 3, ur: 4, ssr: 5 }[rarity] || 1;
}

function characterSvg(charId, pose, idx) {
  const c = CHAR_STYLES[charId] || CHAR_STYLES.cinna;
  const h = hash(idx);
  const tilt = (h - 0.5) * 24;
  let tx = 128 + (hash(idx * 5) - 0.5) * 24;
  let ty = 122 + (hash(idx * 11) - 0.5) * 16;
  let rot = 0;
  let scale = 0.88 + hash(idx * 3) * 0.2;

  if (pose === 'fly') { ty = 100; rot = -8; scale *= 1.05; }
  if (pose === 'sleep') { ty = 138; rot = -12; }
  if (pose === 'peek') { ty = 152; scale *= 1.15; }
  if (pose === 'sit') { ty = 128; }

  const eyes = pose === 'sleep'
    ? '<path d="M-16 -2 Q-10 4 -4 -2" fill="none" stroke="#475569" stroke-width="2"/><path d="M4 -2 Q10 4 16 -2" fill="none" stroke="#475569" stroke-width="2"/>'
    : `<ellipse cx="-14" cy="-2" rx="7" ry="10" fill="${c.eye}"/><ellipse cx="14" cy="-2" rx="7" ry="10" fill="${c.eye}"/>`;

  const extras = [];
  if (charId === 'mocha') extras.push(`<ellipse cx="52" cy="-18" rx="12" ry="8" fill="#f472b6" opacity="0.9"/><ellipse cx="44" cy="-18" rx="8" ry="6" fill="#fbcfe8"/><ellipse cx="60" cy="-18" rx="8" ry="6" fill="#fbcfe8"/>`);
  if (charId === 'milk') extras.push('<circle cx="0" cy="8" r="7" fill="#fda4af" opacity="0.9"/><circle cx="0" cy="8" r="3" fill="#fff"/>');
  if (charId === 'chiffon') extras.push('<path d="M-8 -42 L0 -52 L8 -42" fill="#fff" opacity="0.8"/><path d="M-30 -20 L-38 -32 L-26 -28 Z" fill="#fff" opacity="0.7"/><path d="M30 -20 L38 -32 L26 -28 Z" fill="#fff" opacity="0.7"/>');
  if (charId === 'cappuccino') extras.push('<ellipse cx="-48" cy="-12" rx="14" ry="18" fill="#bae6fd" opacity="0.85"/><ellipse cx="48" cy="-12" rx="14" ry="18" fill="#bae6fd" opacity="0.85"/>');
  if (charId === 'espresso') extras.push('<rect x="-20" y="-48" width="40" height="10" rx="3" fill="#57534e"/><rect x="-14" y="-54" width="28" height="8" rx="2" fill="#44403c"/>');

  return `
    <g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="36" ry="30" fill="${c.body}" stroke="${c.stroke}" stroke-width="2"/>
      <ellipse cx="-50" cy="-6" rx="20" ry="46" fill="${c.ear}" stroke="${c.stroke}" stroke-width="2" transform="rotate(${-16 + tilt})"/>
      <ellipse cx="50" cy="-6" rx="20" ry="46" fill="${c.ear}" stroke="${c.stroke}" stroke-width="2" transform="rotate(${16 - tilt})"/>
      ${extras.join('')}
      ${eyes}
      <ellipse cx="-20" cy="10" rx="8" ry="5" fill="${c.cheek}" opacity="0.65"/>
      <ellipse cx="20" cy="10" rx="8" ry="5" fill="${c.cheek}" opacity="0.65"/>
      <path d="M-5 14 Q0 19 5 14" fill="none" stroke="${c.eye}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="0" cy="40" r="9" fill="${c.body}" stroke="${c.stroke}" stroke-width="1.5"/>
    </g>`;
}

function sceneSvg(rarity, idx) {
  const tier = rarityTier(rarity);
  const h = hash(idx * 13);
  const parts = [];

  if (tier >= 5) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    parts.push(`<circle cx="${40 + h * 40}" cy="${30 + h * 20}" r="1.5" fill="#fff" opacity="0.9"/>`);
    for (let i = 0; i < 18; i++) {
      const x = hash(idx + i * 7) * 256;
      const y = hash(idx + i * 13) * 120;
      parts.push(`<circle cx="${x}" cy="${y}" r="${1 + hash(i) * 2}" fill="#fff" opacity="${0.3 + hash(i + idx) * 0.5}"/>`);
    }
    parts.push('<path d="M0 180 Q64 140 128 160 Q192 180 256 150 L256 256 L0 256 Z" fill="#fff" opacity="0.08"/>');
  } else if (tier >= 4) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    parts.push(`<circle cx="128" cy="128" r="100" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.25"/>`);
    parts.push(`<circle cx="128" cy="128" r="70" fill="none" stroke="#fff" stroke-width="1" opacity="0.2"/>`);
  } else if (tier >= 3) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      parts.push(`<line x1="128" y1="128" x2="${128 + Math.cos(ang) * 110}" y2="${128 + Math.sin(ang) * 110}" stroke="#fff" stroke-width="1" opacity="0.15"/>`);
    }
  } else {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    for (let i = 0; i < 5; i++) {
      parts.push(`<circle cx="${20 + hash(idx + i) * 216}" cy="${20 + hash(idx + i * 3) * 216}" r="${3 + i % 3}" fill="#fff" opacity="0.35"/>`);
    }
  }
  return parts.join('\n');
}

function borderSvg(tier) {
  if (tier >= 5) {
    return `<rect x="3" y="3" width="250" height="250" rx="18" fill="none" stroke="#ef4444" stroke-width="6" opacity="0.9"/>
      <rect x="9" y="9" width="238" height="238" rx="15" fill="none" stroke="url(#gold)" stroke-width="3"/>`;
  }
  if (tier >= 4) {
    return `<rect x="4" y="4" width="248" height="248" rx="18" fill="none" stroke="url(#gold)" stroke-width="5"/>
      <rect x="10" y="10" width="236" height="236" rx="15" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.6"/>`;
  }
  if (tier >= 3) {
    return `<rect x="6" y="6" width="244" height="244" rx="16" fill="none" stroke="#c084fc" stroke-width="4" opacity="0.85"/>`;
  }
  if (tier >= 2) {
    return `<rect x="8" y="8" width="240" height="240" rx="14" fill="none" stroke="#60a5fa" stroke-width="3" opacity="0.7"/>`;
  }
  return `<rect x="10" y="10" width="236" height="236" rx="12" fill="none" stroke="#cbd5e1" stroke-width="2"/>`;
}

function buildCardSvg(idx, name, rarity) {
  const tier = rarityTier(rarity);
  const palettes = BG_BY_RARITY[rarity] || BG_BY_RARITY.common;
  const [c1, c2] = palettes[idx % palettes.length];
  const charId = detectChar(name);
  const pose = detectPose(name);
  const props = detectProps(name);
  const displayName = name.replace(/\s*No\.\d+\s*$/, '').trim();
  const shortName = displayName.length > 14 ? displayName.slice(0, 13) + '…' : displayName;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fcd34d"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fcd34d"/>
    </linearGradient>
  </defs>
  ${sceneSvg(rarity, idx)}
  ${props.join('\n')}
  ${characterSvg(charId, pose, idx)}
  ${borderSvg(tier)}
  <text x="128" y="246" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="10" fill="#64748b" opacity="0.9">${shortName}</text>
</svg>`;
}

module.exports = { buildCardSvg, hash };
