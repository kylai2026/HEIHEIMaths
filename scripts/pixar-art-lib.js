/**
 * Procedural PIXAR-style card art — movie themes & character colors.
 */
const MOVIE_THEMES = [
  { keys: ['玩具總動員', '反斗奇兵'], bg: ['#fde68a', '#f59e0b'], accent: '#2563eb', prop: '<rect x="100" y="180" width="56" height="40" rx="6" fill="#d97706"/><circle cx="128" cy="170" r="18" fill="#fef3c7"/>' },
  { keys: ['海底總動員'], bg: ['#0ea5e9', '#0369a1'], accent: '#f97316', prop: '<ellipse cx="128" cy="60" rx="22" ry="14" fill="#f97316"/><path d="M90 200 Q128 160 166 200" fill="none" stroke="#38bdf8" stroke-width="3"/>' },
  { keys: ['玩轉腦朋友'], bg: ['#f472b6', '#a855f7'], accent: '#fbbf24', prop: '<circle cx="80" cy="70" r="16" fill="#fbbf24"/><circle cx="128" cy="55" r="18" fill="#60a5fa"/><circle cx="176" cy="70" r="16" fill="#ef4444"/>' },
  { keys: ['怪獸'], bg: ['#4ade80', '#166534'], accent: '#1e40af', prop: '<ellipse cx="128" cy="100" rx="40" ry="35" fill="#22c55e"/><circle cx="108" cy="92" r="12" fill="#fff"/><circle cx="148" cy="92" r="12" fill="#fff"/>' },
  { keys: ['超人特工隊'], bg: ['#ef4444', '#991b1b'], accent: '#fbbf24', prop: '<polygon points="128,50 145,85 115,85" fill="#fbbf24"/><rect x="118" y="85" width="20" height="30" fill="#1e40af"/>' },
  { keys: ['料理鼠王'], bg: ['#fef3c7', '#fde68a'], accent: '#78716c', prop: '<ellipse cx="128" cy="190" rx="30" ry="12" fill="#fff" stroke="#94a3b8"/><circle cx="128" cy="55" r="14" fill="#78716c"/>' },
  { keys: ['尋夢環遊記', 'Coco'], bg: ['#f97316', '#7c2d12'], accent: '#fef08a', prop: '<text x="128" y="55" text-anchor="middle" font-size="28" fill="#fef08a">🎸</text><circle cx="128" cy="200" r="20" fill="#f97316" opacity="0.6"/>' },
  { keys: ['靈魂奇遇記', 'Soul'], bg: ['#312e81', '#1e1b4b'], accent: '#a78bfa', prop: '<circle cx="128" cy="128" r="35" fill="none" stroke="#a78bfa" stroke-width="3" opacity="0.5"/><circle cx="128" cy="60" r="10" fill="#fef08a"/>' },
  { keys: ['青春變形記', '變形記'], bg: ['#fda4af', '#ec4899'], accent: '#ef4444', prop: '<ellipse cx="128" cy="90" rx="28" ry="32" fill="#ef4444" opacity="0.7"/><text x="128" y="200" text-anchor="middle" font-size="22">🐼</text>' },
  { keys: ['瓦力', 'WALL'], bg: ['#d6d3d1', '#78716c'], accent: '#22c55e', prop: '<rect x="108" y="170" width="40" height="30" rx="4" fill="#57534e"/><circle cx="128" cy="55" r="14" fill="#22c55e"/>' },
  { keys: ['天外奇蹟', '沖天救兵'], bg: ['#60a5fa', '#1d4ed8'], accent: '#f97316', prop: '<polygon points="128,45 140,75 116,75" fill="#f97316"/><ellipse cx="128" cy="200" rx="40" ry="15" fill="#fff" opacity="0.5"/>' },
  { keys: ['勇敢傳說'], bg: ['#166534', '#14532d'], accent: '#f472b6', prop: '<text x="128" y="60" text-anchor="middle" font-size="26" fill="#f472b6">🏹</text>' },
  { keys: ['路卡'], bg: ['#38bdf8', '#0ea5e9'], accent: '#f97316', prop: '<ellipse cx="128" cy="200" rx="50" ry="20" fill="#38bdf8" opacity="0.5"/><circle cx="128" cy="70" r="16" fill="#f97316"/>' },
  { keys: ['魔法滿屋', 'Elemental', '元素'], bg: ['#f472b6', '#fb923c'], accent: '#60a5fa', prop: '<circle cx="90" cy="70" r="14" fill="#fb923c"/><circle cx="166" cy="70" r="14" fill="#60a5fa"/>' },
  { keys: ['蟲蟲'], bg: ['#84cc16', '#4d7c0f'], accent: '#fbbf24', prop: '<ellipse cx="128" cy="100" rx="20" ry="30" fill="#84cc16"/><circle cx="128" cy="55" r="8" fill="#1e293b"/>' },
  { keys: ['汽車總動員', 'Cars', '閃電'], bg: ['#ef4444', '#991b1b'], accent: '#fbbf24', prop: '<rect x="88" y="175" width="80" height="28" rx="10" fill="#ef4444"/><circle cx="105" cy="210" r="10" fill="#1e293b"/><circle cx="151" cy="210" r="10" fill="#1e293b"/>' },
  { keys: ['恐龍', 'Good Dinosaur'], bg: ['#a3e635', '#65a30d'], accent: '#78716c', prop: '<path d="M80 200 Q128 120 176 200" fill="#65a30d" opacity="0.6"/>' },
  { keys: ['光年', 'Lightyear'], bg: ['#6366f1', '#312e81'], accent: '#fbbf24', prop: '<polygon points="128,40 138,70 118,70" fill="#fbbf24"/><rect x="120" y="70" width="16" height="25" fill="#fff" opacity="0.8"/>' },
  { keys: ['Elio', 'Onward'], bg: ['#a78bfa', '#6d28d9'], accent: '#fbbf24', prop: '<text x="128" y="58" text-anchor="middle" font-size="24" fill="#fbbf24">✨</text>' }
];

const DEFAULT_THEME = { bg: ['#1e293b', '#334155'], accent: '#fbbf24', prop: '<circle cx="128" cy="128" r="40" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.4"/>' };

function hash(n) {
  let x = n * 2654435761;
  return ((x >>> 0) % 1000) / 1000;
}

function detectTheme(name) {
  for (const t of MOVIE_THEMES) {
    if (t.keys.some(k => name.includes(k))) return t;
  }
  return DEFAULT_THEME;
}

function rarityTier(rarity) {
  return { common: 1, rare: 2, sr: 3, ur: 4, ssr: 5 }[rarity] || 1;
}

function borderSvg(tier) {
  if (tier >= 5) return `<rect x="3" y="3" width="250" height="250" rx="18" fill="none" stroke="#ef4444" stroke-width="6"/><rect x="9" y="9" width="238" height="238" rx="15" fill="none" stroke="#fbbf24" stroke-width="3"/>`;
  if (tier >= 4) return `<rect x="4" y="4" width="248" height="248" rx="18" fill="none" stroke="#fbbf24" stroke-width="5"/>`;
  if (tier >= 3) return `<rect x="6" y="6" width="244" height="244" rx="16" fill="none" stroke="#c084fc" stroke-width="4"/>`;
  if (tier >= 2) return `<rect x="8" y="8" width="240" height="240" rx="14" fill="none" stroke="#60a5fa" stroke-width="3"/>`;
  return `<rect x="10" y="10" width="236" height="236" rx="12" fill="none" stroke="#cbd5e1" stroke-width="2"/>`;
}

function characterSvg(theme, idx) {
  const h = hash(idx);
  const ty = 118 + (h - 0.5) * 20;
  const scale = 0.85 + hash(idx * 3) * 0.2;
  return `
    <g transform="translate(128,${ty}) scale(${scale})">
      <ellipse cx="0" cy="10" rx="32" ry="28" fill="${theme.accent}" opacity="0.9"/>
      <ellipse cx="-40" cy="-5" rx="14" ry="28" fill="${theme.accent}" opacity="0.75" transform="rotate(-20)"/>
      <ellipse cx="40" cy="-5" rx="14" ry="28" fill="${theme.accent}" opacity="0.75" transform="rotate(20)"/>
      <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#fff"/>
      <ellipse cx="12" cy="0" rx="6" ry="8" fill="#fff"/>
      <circle cx="-12" cy="2" r="3" fill="#1e293b"/>
      <circle cx="12" cy="2" r="3" fill="#1e293b"/>
      <path d="M-6 14 Q0 20 6 14" fill="none" stroke="#1e293b" stroke-width="2"/>
    </g>`;
}

function buildCardSvg(idx, name, rarity) {
  const theme = detectTheme(name);
  const tier = rarityTier(rarity);
  const [c1, c2] = theme.bg;
  const shortName = name.length > 14 ? name.slice(0, 13) + '…' : name;
  const stars = tier >= 5 ? Array.from({ length: 12 }, (_, i) => `<circle cx="${20 + hash(idx + i) * 216}" cy="${20 + hash(idx + i * 2) * 100}" r="1.5" fill="#fff" opacity="0.6"/>`).join('') : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" fill="url(#bg)"/>
  ${stars}
  ${theme.prop}
  ${characterSvg(theme, idx)}
  ${borderSvg(tier)}
  <text x="128" y="246" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="9" fill="#fff" opacity="0.85">${shortName}</text>
</svg>`;
}

module.exports = { buildCardSvg };
