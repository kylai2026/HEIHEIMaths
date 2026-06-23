/**
 * Procedural PIXAR-style card art — distinct silhouettes per character.
 */
function hash(n) {
  let x = n * 2654435761;
  return ((x >>> 0) % 1000) / 1000;
}

const CHAR_MAP = [
  { keys: ['胡迪'], id: 'woody', bg: ['#fde68a', '#d97706'], accent: '#2563eb' },
  { keys: ['巴斯'], id: 'buzz', bg: ['#6366f1', '#312e81'], accent: '#fbbf24' },
  { keys: ['翠絲'], id: 'jessie', bg: ['#ef4444', '#991b1b'], accent: '#fef08a' },
  { keys: ['抱抱龍'], id: 'rex', bg: ['#86efac', '#166534'], accent: '#fef08a' },
  { keys: ['叉奇'], id: 'forky', bg: ['#f8fafc', '#cbd5e1'], accent: '#ef4444' },
  { keys: ['尼莫'], id: 'nemo', bg: ['#0ea5e9', '#0369a1'], accent: '#f97316' },
  { keys: ['馬林'], id: 'marlin', bg: ['#f97316', '#c2410c'], accent: '#fff' },
  { keys: ['多莉'], id: 'dory', bg: ['#38bdf8', '#1d4ed8'], accent: '#fef08a' },
  { keys: ['龜爺爺'], id: 'crush', bg: ['#22c55e', '#15803d'], accent: '#fef08a' },
  { keys: ['章魚'], id: 'hank', bg: ['#f97316', '#9a3412'], accent: '#1e293b' },
  { keys: ['樂樂'], id: 'joy', bg: ['#fbbf24', '#d97706'], accent: '#fff' },
  { keys: ['憂憂'], id: 'sadness', bg: ['#60a5fa', '#1d4ed8'], accent: '#fff' },
  { keys: ['怒怒'], id: 'anger', bg: ['#ef4444', '#991b1b'], accent: '#fef08a' },
  { keys: ['厭厭'], id: 'disgust', bg: ['#4ade80', '#166534'], accent: '#fff' },
  { keys: ['驚驚'], id: 'fear', bg: ['#a78bfa', '#6d28d9'], accent: '#fff' },
  { keys: ['毛怪'], id: 'sulley', bg: ['#22c55e', '#14532d'], accent: '#1e40af' },
  { keys: ['大眼仔'], id: 'mike', bg: ['#4ade80', '#166534'], accent: '#fff' },
  { keys: ['阿布'], id: 'boo', bg: ['#fda4af', '#db2777'], accent: '#fff' },
  { keys: ['米格'], id: 'miguel', bg: ['#f97316', '#7c2d12'], accent: '#fef08a' },
  { keys: ['埃克托'], id: 'hector', bg: ['#1e293b', '#0f172a'], accent: '#fef08a' },
  { keys: ['可可'], id: 'coco', bg: ['#f472b6', '#be185d'], accent: '#fef08a' },
  { keys: ['瓦力'], id: 'walle', bg: ['#d6d3d1', '#57534e'], accent: '#22c55e' },
  { keys: ['伊娃'], id: 'eve', bg: ['#f8fafc', '#e2e8f0'], accent: '#22c55e' },
  { keys: ['船長'], id: 'auto', bg: ['#1e293b', '#334155'], accent: '#ef4444' },
  { keys: ['閃電'], id: 'mcqueen', bg: ['#ef4444', '#991b1b'], accent: '#fbbf24' },
  { keys: ['拖線'], id: 'mater', bg: ['#a16207', '#713f12'], accent: '#fef08a' },
  { keys: ['莎莉'], id: 'sally', bg: ['#38bdf8', '#1d4ed8'], accent: '#fff' },
  { keys: ['小米'], id: 'remy', bg: ['#78716c', '#44403c'], accent: '#fef08a' },
  { keys: ['大廚'], id: 'linguini', bg: ['#fef3c7', '#fde68a'], accent: '#ef4444' },
  { keys: ['柯米'], id: 'colette', bg: ['#f472b6', '#be185d'], accent: '#fff' },
  { keys: ['超能先生'], id: 'mrinc', bg: ['#ef4444', '#991b1b'], accent: '#1e40af' },
  { keys: ['彈弓女'], id: 'elast', bg: ['#f472b6', '#be185d'], accent: '#fef08a' },
  { keys: ['小傑'], id: 'dash', bg: ['#ef4444', '#dc2626'], accent: '#fef08a' },
  { keys: ['小倩'], id: 'violet', bg: ['#a78bfa', '#6d28d9'], accent: '#fff' },
  { keys: ['小迪'], id: 'jackjack', bg: ['#fef08a', '#fbbf24'], accent: '#ef4444' },
  { keys: ['卡爾'], id: 'carl', bg: ['#60a5fa', '#1d4ed8'], accent: '#f97316' },
  { keys: ['羅素'], id: 'russell', bg: ['#fbbf24', '#d97706'], accent: '#166534' },
  { keys: ['道格'], id: 'dug', bg: ['#d97706', '#92400e'], accent: '#fff' },
  { keys: ['梅莉達'], id: 'merida', bg: ['#166534', '#14532d'], accent: '#f472b6' },
  { keys: ['路卡'], id: 'luca', bg: ['#38bdf8', '#0ea5e9'], accent: '#f97316' },
  { keys: ['艾伯托'], id: 'alberto', bg: ['#f97316', '#c2410c'], accent: '#38bdf8' },
  { keys: ['布魯諾'], id: 'bruno', bg: ['#6d28d9', '#4c1d95'], accent: '#fef08a' },
  { keys: ['小焰'], id: 'ember', bg: ['#fb923c', '#ea580c'], accent: '#fef08a' },
  { keys: ['阿波'], id: 'wade', bg: ['#60a5fa', '#2563eb'], accent: '#fff' },
  { keys: ['阿樂'], id: 'anxiety', bg: ['#fb923c', '#c2410c'], accent: '#fef08a' },
  { keys: ['焦焦'], id: 'anxiety2', bg: ['#fdba74', '#ea580c'], accent: '#fff' },
  { keys: ['阿甘'], id: 'forrest', bg: ['#22c55e', '#15803d'], accent: '#fef08a' },
  { keys: ['蘇利文'], id: 'sulley2', bg: ['#1e40af', '#1e3a8a'], accent: '#22c55e' },
  { keys: ['蘭道夫'], id: 'randall', bg: ['#a78bfa', '#6d28d9'], accent: '#22c55e' },
  { keys: ['荷莉'], id: 'holley', bg: ['#f472b6', '#db2777'], accent: '#38bdf8' }
];

const DEFAULT = { id: 'generic', bg: ['#1e293b', '#334155'], accent: '#fbbf24' };

function detectChar(name) {
  for (const c of CHAR_MAP) {
    if (c.keys.some(k => name.includes(k))) return c;
  }
  return DEFAULT;
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

function transform(idx) {
  const h = hash(idx);
  return {
    tx: 128 + (hash(idx * 5) - 0.5) * 16,
    ty: 118 + (hash(idx * 11) - 0.5) * 14,
    scale: 0.9 + hash(idx * 3) * 0.15,
    rot: (h - 0.5) * 10
  };
}

const DRAW = {
  woody(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="20" rx="28" ry="32" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <rect x="-30" y="-8" width="60" height="8" fill="#92400e"/>
      <polygon points="0,-48 -18,-28 18,-28" fill="#92400e"/>
      <ellipse cx="0" cy="-18" rx="22" ry="20" fill="#fef3c7"/>
      <polygon points="-8,-52 0,-62 8,-52" fill="#92400e"/>
      <text x="0" y="8" text-anchor="middle" font-size="16" fill="${accent}">★</text>
      <ellipse cx="-10" cy="-20" rx="4" ry="6" fill="#1e293b"/><ellipse cx="10" cy="-20" rx="4" ry="6" fill="#1e293b"/>
    </g>`;
  },
  buzz(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="30" ry="34" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="0" cy="-22" rx="24" ry="22" fill="#94a3b8"/>
      <rect x="-8" y="-50" width="16" height="20" rx="4" fill="#64748b"/>
      <rect x="-36" y="0" width="72" height="12" rx="4" fill="#64748b"/>
      <circle cx="0" cy="-18" r="10" fill="#38bdf8" opacity="0.8"/>
      <polygon points="0,-8 20,20 -20,20" fill="${accent}" opacity="0.9"/>
    </g>`;
  },
  jessie(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="18" rx="26" ry="30" fill="#fef3c7"/>
      <path d="M-30 -20 Q0 -60 30 -20" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <circle cx="-10" cy="-10" r="5" fill="#1e293b"/><circle cx="10" cy="-10" r="5" fill="#1e293b"/>
      <ellipse cx="0" cy="0" rx="8" ry="5" fill="#fda4af"/>
    </g>`;
  },
  rex(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <path d="M-40 40 Q-20 -30 0 -40 Q20 -30 40 40 Z" fill="#86efac" stroke="#166534" stroke-width="2"/>
      <circle cx="-14" cy="0" r="8" fill="#fff"/><circle cx="14" cy="0" r="8" fill="#fff"/>
      <circle cx="-14" cy="0" r="4" fill="#1e293b"/><circle cx="14" cy="0" r="4" fill="#1e293b"/>
      <path d="M-8 18 Q0 24 8 18" fill="none" stroke="#166534" stroke-width="2"/>
      <polygon points="-30,20 -40,40 -20,35" fill="#86efac"/><polygon points="30,20 40,40 20,35" fill="#86efac"/>
    </g>`;
  },
  forky(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-6" y="-40" width="12" height="80" rx="3" fill="#e2e8f0" stroke="#94a3b8"/>
      <path d="M-20 -30 L-6 -20 L-6 -40 Z" fill="${accent}"/>
      <path d="M20 -30 L6 -20 L6 -40 Z" fill="${accent}"/>
      <circle cx="0" cy="-48" r="14" fill="#fef3c7" stroke="#94a3b8"/>
      <ellipse cx="-5" cy="-50" rx="3" ry="4" fill="#1e293b"/><ellipse cx="5" cy="-50" rx="3" ry="4" fill="#1e293b"/>
      <path d="M-4 -44 Q0 -40 4 -44" fill="none" stroke="#f472b6" stroke-width="1.5"/>
    </g>`;
  },
  nemo(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="10" rx="42" ry="28" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
      <polygon points="42,10 70,0 70,20" fill="#f97316" stroke="#c2410c"/>
      <path d="M-20 -10 Q0 -30 20 -10" fill="none" stroke="#fff" stroke-width="3"/>
      <circle cx="-12" cy="6" r="6" fill="#fff"/><circle cx="-12" cy="6" r="3" fill="#1e293b"/>
      <circle cx="12" cy="6" r="6" fill="#fff"/><circle cx="12" cy="6" r="3" fill="#1e293b"/>
    </g>`;
  },
  marlin(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="12" rx="48" ry="24" fill="#f97316" stroke="#9a3412" stroke-width="2"/>
      <polygon points="48,12 78,4 78,20" fill="#f97316"/>
      <ellipse cx="-8" cy="8" rx="5" ry="7" fill="#1e293b"/><ellipse cx="14" cy="8" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  },
  dory(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="10" rx="44" ry="30" fill="#38bdf8" stroke="#1d4ed8" stroke-width="2"/>
      <polygon points="44,10 72,0 72,20" fill="#38bdf8"/>
      <path d="M-30 -8 L-10 10 L-30 28" fill="#1d4ed8" opacity="0.5"/>
      <circle cx="-10" cy="8" r="7" fill="#fff"/><circle cx="-10" cy="8" r="3" fill="#1e293b"/>
      <circle cx="16" cy="8" r="7" fill="#fff"/><circle cx="16" cy="8" r="3" fill="#1e293b"/>
    </g>`;
  },
  crush(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="20" rx="50" ry="32" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <ellipse cx="0" cy="-10" rx="28" ry="22" fill="#22c55e"/>
      <circle cx="-12" cy="-8" r="6" fill="#1e293b"/><circle cx="12" cy="-8" r="6" fill="#1e293b"/>
      <path d="M-50 20 Q-70 0 -50 -10" fill="none" stroke="#15803d" stroke-width="6"/>
      <path d="M50 20 Q70 0 50 -10" fill="none" stroke="#15803d" stroke-width="6"/>
    </g>`;
  },
  hank(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="36" ry="30" fill="#f97316" stroke="#9a3412" stroke-width="2"/>
      ${[-30, -10, 10, 30].map((x, i) => `<ellipse cx="${x}" cy="40" rx="8" ry="18" fill="#f97316" transform="rotate(${-20 + i * 12} ${x} 40)"/>`).join('')}
      <circle cx="-10" cy="4" r="7" fill="#fff"/><circle cx="10" cy="4" r="7" fill="#fff"/>
      <circle cx="-10" cy="4" r="3" fill="#1e293b"/><circle cx="10" cy="4" r="3" fill="#1e293b"/>
    </g>`;
  },
  joy(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <circle cx="0" cy="8" r="40" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <path d="M-30 -20 Q0 -50 30 -20" fill="#fbbf24"/>
      <ellipse cx="-14" cy="4" rx="6" ry="8" fill="#1e293b"/><ellipse cx="14" cy="4" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-16 20 Q0 32 16 20" fill="none" stroke="#1e293b" stroke-width="2"/>
    </g>`;
  },
  sadness(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <circle cx="0" cy="12" r="38" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/>
      <ellipse cx="-12" cy="8" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="8" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-12 28 Q0 18 12 28" fill="none" stroke="#1e40af" stroke-width="2"/>
      <ellipse cx="-20" cy="36" rx="6" ry="10" fill="#38bdf8" opacity="0.7"/>
    </g>`;
  },
  anger(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-34" y="-20" width="68" height="56" rx="16" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="0" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-16 20 L0 12 L16 20" fill="none" stroke="#7f1d1d" stroke-width="3"/>
      <path d="M-20 -24 L-8 -36 M20 -24 L8 -36" stroke="#7f1d1d" stroke-width="3"/>
    </g>`;
  },
  disgust(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="10" rx="34" ry="40" fill="#4ade80" stroke="#166534" stroke-width="2"/>
      <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="0" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-10 20 Q0 14 10 20" fill="none" stroke="#166534" stroke-width="2"/>
    </g>`;
  },
  fear(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="14" rx="30" ry="38" fill="#c4b5fd" stroke="#7c3aed" stroke-width="2"/>
      <ellipse cx="-12" cy="4" rx="8" ry="12" fill="#fff"/><ellipse cx="12" cy="4" rx="8" ry="12" fill="#fff"/>
      <circle cx="-12" cy="6" r="4" fill="#1e293b"/><circle cx="12" cy="6" r="4" fill="#1e293b"/>
      <ellipse cx="0" cy="28" rx="8" ry="5" fill="#7c3aed"/>
    </g>`;
  },
  sulley(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="44" ry="40" fill="#22c55e" stroke="#14532d" stroke-width="2"/>
      <path d="M-30 -20 Q-40 -50 -10 -40 Q10 -55 30 -20" fill="#22c55e" stroke="#14532d"/>
      <circle cx="-16" cy="0" r="14" fill="#fff"/><circle cx="16" cy="0" r="14" fill="#fff"/>
      <circle cx="-16" cy="0" r="7" fill="#1e293b"/><circle cx="16" cy="0" r="7" fill="#1e293b"/>
      <path d="M-12 24 Q0 32 12 24" fill="none" stroke="#14532d" stroke-width="2"/>
    </g>`;
  },
  mike(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="20" rx="36" ry="34" fill="#4ade80" stroke="#166534" stroke-width="2"/>
      <circle cx="0" cy="-8" r="28" fill="#4ade80" stroke="#166534" stroke-width="2"/>
      <circle cx="0" cy="-8" r="16" fill="#fff"/>
      <circle cx="0" cy="-8" r="8" fill="#1e293b"/>
      <path d="M-10 28 Q0 36 10 28" fill="none" stroke="#166534" stroke-width="2"/>
    </g>`;
  },
  boo(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="28" ry="32" fill="#fda4af" stroke="#db2777" stroke-width="2"/>
      <ellipse cx="0" cy="-20" rx="30" ry="26" fill="#fda4af"/>
      <ellipse cx="-10" cy="-18" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="-18" rx="5" ry="7" fill="#1e293b"/>
      <path d="M-8 -6 Q0 0 8 -6" fill="none" stroke="#db2777" stroke-width="2"/>
    </g>`;
  },
  miguel(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="18" rx="26" ry="30" fill="#fef3c7"/>
      <ellipse cx="0" cy="-22" rx="24" ry="22" fill="#fef3c7"/>
      <path d="M-20 -30 Q0 -50 20 -30" fill="#1e293b"/>
      <text x="0" y="8" text-anchor="middle" font-size="22" fill="#f97316">🎸</text>
    </g>`;
  },
  hector(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="10" rx="30" ry="36" fill="#e7e5e4" stroke="#a8a29e"/>
      <circle cx="0" cy="-20" r="24" fill="#e7e5e4" stroke="#a8a29e"/>
      <ellipse cx="-10" cy="-22" rx="8" ry="10" fill="#1e293b"/><ellipse cx="10" cy="-22" rx="8" ry="10" fill="#1e293b"/>
      <path d="M-16 -40 Q0 -55 16 -40" fill="none" stroke="#78716c" stroke-width="2"/>
    </g>`;
  },
  coco(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="28" ry="32" fill="#fda4af"/>
      <ellipse cx="0" cy="-20" rx="26" ry="24" fill="#fda4af"/>
      <path d="M-24 -30 Q0 -55 24 -30" fill="#1e293b"/>
      <ellipse cx="-10" cy="-16" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="-16" rx="5" ry="7" fill="#1e293b"/>
      <text x="0" y="30" text-anchor="middle" font-size="18">🌺</text>
    </g>`;
  },
  walle(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-36" y="-10" width="72" height="50" rx="8" fill="#78716c" stroke="#44403c" stroke-width="2"/>
      <rect x="-28" y="-40" width="56" height="32" rx="6" fill="#57534e"/>
      <circle cx="-12" cy="-24" r="8" fill="${accent}"/><circle cx="12" cy="-24" r="8" fill="${accent}"/>
      <rect x="-40" y="36" width="20" height="16" rx="3" fill="#44403c"/>
      <rect x="20" y="36" width="20" height="16" rx="3" fill="#44403c"/>
    </g>`;
  },
  eve(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="8" rx="34" ry="48" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <ellipse cx="0" cy="-20" rx="20" ry="16" fill="#f8fafc"/>
      <circle cx="-10" cy="-18" r="5" fill="${accent}"/><circle cx="10" cy="-18" r="5" fill="${accent}"/>
      <path d="M-34 0 Q-50 -20 -34 -40" fill="none" stroke="#e2e8f0" stroke-width="4"/>
      <path d="M34 0 Q50 -20 34 -40" fill="none" stroke="#e2e8f0" stroke-width="4"/>
    </g>`;
  },
  auto(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <circle cx="0" cy="10" r="42" fill="#334155" stroke="#1e293b" stroke-width="2"/>
      <circle cx="0" cy="10" r="28" fill="none" stroke="${accent}" stroke-width="3"/>
      <circle cx="0" cy="10" r="8" fill="${accent}"/>
      <line x1="0" y1="-32" x2="0" y2="-50" stroke="#64748b" stroke-width="4"/>
      <circle cx="0" cy="-52" r="6" fill="#ef4444"/>
    </g>`;
  },
  mcqueen(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-50" y="0" width="100" height="32" rx="14" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <rect x="-30" y="-16" width="60" height="20" rx="8" fill="#ef4444"/>
      <circle cx="-32" cy="32" r="12" fill="#1e293b"/><circle cx="32" cy="32" r="12" fill="#1e293b"/>
      <text x="0" y="14" text-anchor="middle" font-size="14" fill="#fef08a" font-weight="bold">95</text>
      <ellipse cx="-18" cy="-6" rx="5" ry="7" fill="#1e293b"/><ellipse cx="18" cy="-6" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  },
  mater(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-46" y="4" width="92" height="28" rx="10" fill="#a16207" stroke="#713f12"/>
      <rect x="-20" y="-20" width="40" height="26" rx="6" fill="#92400e"/>
      <circle cx="-28" cy="32" r="10" fill="#1e293b"/><circle cx="28" cy="32" r="10" fill="#1e293b"/>
      <rect x="-8" y="-36" width="16" height="18" fill="#713f12"/>
    </g>`;
  },
  sally(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-48" y="2" width="96" height="30" rx="12" fill="#38bdf8" stroke="#1d4ed8"/>
      <rect x="-28" y="-18" width="56" height="22" rx="8" fill="#38bdf8"/>
      <circle cx="-30" cy="32" r="10" fill="#1e293b"/><circle cx="30" cy="32" r="10" fill="#1e293b"/>
    </g>`;
  },
  remy(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="20" rx="22" ry="18" fill="#78716c"/>
      <circle cx="0" cy="-8" r="20" fill="#78716c"/>
      <ellipse cx="-18" cy="-20" rx="8" ry="14" fill="#78716c"/><ellipse cx="18" cy="-20" rx="8" ry="14" fill="#78716c"/>
      <circle cx="-8" cy="-10" r="4" fill="#1e293b"/><circle cx="8" cy="-10" r="4" fill="#1e293b"/>
      <path d="M20 -8 Q40 0 36 16" fill="none" stroke="#78716c" stroke-width="4"/>
    </g>`;
  },
  linguini(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="20" rx="26" ry="32" fill="#fef3c7"/>
      <ellipse cx="0" cy="-18" rx="22" ry="20" fill="#fef3c7"/>
      <ellipse cx="-8" cy="-20" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-20" rx="4" ry="6" fill="#1e293b"/>
      <polygon points="0,-42 -12,-28 12,-28" fill="#fff" stroke="#94a3b8"/>
    </g>`;
  },
  colette(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="18" rx="24" ry="30" fill="#fef3c7"/>
      <ellipse cx="0" cy="-20" rx="22" ry="20" fill="#fef3c7"/>
      <path d="M-20 -28 Q0 -48 20 -28" fill="#1e293b"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
    </g>`;
  },
  mrinc(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="34" ry="38" fill="#ef4444" stroke="#991b1b"/>
      <ellipse cx="0" cy="-22" rx="24" ry="22" fill="#fef3c7"/>
      <ellipse cx="-10" cy="-22" rx="4" ry="6" fill="#1e293b"/><ellipse cx="10" cy="-22" rx="4" ry="6" fill="#1e293b"/>
      <polygon points="0,-50 -10,-36 10,-36" fill="#1e40af"/>
      <text x="0" y="24" text-anchor="middle" font-size="18" fill="#1e40af">i</text>
    </g>`;
  },
  elast(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="26" ry="34" fill="#f472b6"/>
      <ellipse cx="0" cy="-20" rx="22" ry="20" fill="#fef3c7"/>
      <path d="M-24 -28 Q0 -50 24 -28" fill="#1e293b"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
    </g>`;
  },
  dash(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="14" rx="22" ry="28" fill="#ef4444"/>
      <ellipse cx="0" cy="-18" rx="20" ry="18" fill="#fef3c7"/>
      <path d="M30 0 L60 -10 M30 10 L65 10" stroke="#fbbf24" stroke-width="3"/>
      <ellipse cx="-6" cy="-18" rx="4" ry="5" fill="#1e293b"/><ellipse cx="6" cy="-18" rx="4" ry="5" fill="#1e293b"/>
    </g>`;
  },
  violet(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="24" ry="30" fill="#a78bfa" opacity="0.85"/>
      <ellipse cx="0" cy="-18" rx="22" ry="20" fill="#fef3c7"/>
      <ellipse cx="-8" cy="-18" rx="6" ry="8" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-30 -10 Q0 20 30 -10" fill="#c4b5fd" opacity="0.4"/>
    </g>`;
  },
  jackjack(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="12" rx="28" ry="30" fill="#fef3c7"/>
      <ellipse cx="0" cy="-22" rx="8" ry="6" fill="#fef3c7"/>
      <circle cx="-8" cy="-8" r="4" fill="#1e293b"/><circle cx="8" cy="-8" r="4" fill="#1e293b"/>
      <path d="M-40 -20 Q0 40 40 -20" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.6"/>
    </g>`;
  },
  carl(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-30" y="10" width="60" height="40" rx="6" fill="#60a5fa"/>
      <polygon points="0,-40 -30,10 30,10" fill="#f97316"/>
      <ellipse cx="0" cy="-10" rx="18" ry="16" fill="#fef3c7"/>
      <ellipse cx="-6" cy="-12" rx="3" ry="5" fill="#1e293b"/><ellipse cx="6" cy="-12" rx="3" ry="5" fill="#1e293b"/>
    </g>`;
  },
  russell(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="26" ry="30" fill="#fbbf24"/>
      <ellipse cx="0" cy="-18" rx="24" ry="22" fill="#fef3c7"/>
      <polygon points="0,-42 -16,-28 16,-28" fill="#fbbf24"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
      <text x="0" y="36" text-anchor="middle" font-size="14">🏕</text>
    </g>`;
  },
  dug(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="18" rx="30" ry="28" fill="#d97706"/>
      <ellipse cx="0" cy="-16" rx="26" ry="22" fill="#d97706"/>
      <ellipse cx="-30" cy="-4" rx="12" ry="18" fill="#d97706"/><ellipse cx="30" cy="-4" rx="12" ry="18" fill="#d97706"/>
      <ellipse cx="-10" cy="-14" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="-14" rx="5" ry="7" fill="#1e293b"/>
      <ellipse cx="0" cy="0" rx="10" ry="8" fill="#fef3c7"/>
    </g>`;
  },
  merida(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="24" ry="30" fill="#166534"/>
      <ellipse cx="0" cy="-18" rx="22" ry="20" fill="#fef3c7"/>
      <path d="M-28 -20 Q-40 -50 -10 -45 Q10 -55 28 -20" fill="#ef4444"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
      <text x="28" y="-30" font-size="20">🏹</text>
    </g>`;
  },
  luca(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="26" ry="30" fill="#38bdf8" opacity="0.85"/>
      <ellipse cx="0" cy="-18" rx="24" ry="22" fill="#fef3c7"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
      <path d="M-40 40 Q0 10 40 40" fill="#0ea5e9" opacity="0.4"/>
    </g>`;
  },
  alberto(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="14" rx="28" ry="32" fill="#f97316" opacity="0.9"/>
      <ellipse cx="0" cy="-20" rx="24" ry="22" fill="#fef3c7"/>
      <path d="M-22 -28 Q0 -48 22 -28" fill="#1e293b"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
    </g>`;
  },
  bruno(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="16" rx="28" ry="34" fill="#6d28d9" opacity="0.8"/>
      <ellipse cx="0" cy="-20" rx="24" ry="22" fill="#fef3c7"/>
      <text x="0" y="8" text-anchor="middle" font-size="20">🔮</text>
    </g>`;
  },
  ember(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <path d="M-30 40 Q-20 -20 0 -40 Q20 -20 30 40 Z" fill="#fb923c" stroke="#ea580c"/>
      <circle cx="-10" cy="0" r="6" fill="#1e293b"/><circle cx="10" cy="0" r="6" fill="#1e293b"/>
      <path d="M0 -50 L-8 -70 L8 -70 Z" fill="#ef4444" opacity="0.8"/>
    </g>`;
  },
  wade(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="12" rx="32" ry="38" fill="#60a5fa" opacity="0.85"/>
      <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="0" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-20 30 Q0 40 20 30" fill="none" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="0" cy="-30" r="8" fill="#fff" opacity="0.5"/>
    </g>`;
  },
  anxiety(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="10" rx="34" ry="38" fill="#fb923c" stroke="#c2410c"/>
      <ellipse cx="-12" cy="0" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="0" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-14 22 Q0 14 14 22" fill="none" stroke="#9a3412" stroke-width="2"/>
      <path d="M-20 -20 Q0 -40 20 -20" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.6"/>
    </g>`;
  },
  anxiety2(t) { return DRAW.anxiety(t); },
  forrest(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="18" rx="28" ry="32" fill="#22c55e" opacity="0.85"/>
      <ellipse cx="0" cy="-18" rx="24" ry="22" fill="#fef3c7"/>
      <ellipse cx="-8" cy="-18" rx="4" ry="6" fill="#1e293b"/><ellipse cx="8" cy="-18" rx="4" ry="6" fill="#1e293b"/>
      <text x="0" y="40" text-anchor="middle" font-size="16">🌿</text>
    </g>`;
  },
  sulley2(t) { return DRAW.sulley(t); },
  randall(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <ellipse cx="0" cy="14" rx="32" ry="36" fill="#a78bfa" opacity="0.7"/>
      <circle cx="-14" cy="0" r="12" fill="#fff"/><circle cx="14" cy="0" r="12" fill="#fff"/>
      <circle cx="-14" cy="0" r="6" fill="#1e293b"/><circle cx="14" cy="0" r="6" fill="#1e293b"/>
      <path d="M-8 24 Q0 30 8 24" fill="none" stroke="#6d28d9" stroke-width="2"/>
    </g>`;
  },
  holley(t) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <rect x="-44" y="4" width="88" height="26" rx="10" fill="#f472b6"/>
      <ellipse cx="0" cy="-12" rx="22" ry="20" fill="#fef3c7"/>
      <path d="M-18 -24 Q0 -40 18 -24" fill="#1e293b"/>
      <circle cx="-30" cy="30" r="9" fill="#1e293b"/><circle cx="30" cy="30" r="9" fill="#1e293b"/>
    </g>`;
  },
  generic(t, accent) {
    return `<g transform="translate(${t.tx},${t.ty}) rotate(${t.rot}) scale(${t.scale})">
      <circle cx="0" cy="8" r="36" fill="${accent}" opacity="0.85"/>
      <ellipse cx="-12" cy="4" rx="6" ry="8" fill="#fff"/><ellipse cx="12" cy="4" rx="6" ry="8" fill="#fff"/>
      <circle cx="-12" cy="4" r="3" fill="#1e293b"/><circle cx="12" cy="4" r="3" fill="#1e293b"/>
    </g>`;
  }
};

function characterSvg(charInfo, idx) {
  const t = transform(idx);
  const fn = DRAW[charInfo.id] || DRAW.generic;
  return fn.length >= 2 ? fn(t, charInfo.accent) : fn(t);
}

function buildCardSvg(idx, name, rarity) {
  const charInfo = detectChar(name);
  const tier = rarityTier(rarity);
  const [c1, c2] = charInfo.bg;
  const shortName = name.length > 14 ? name.slice(0, 13) + '…' : name;
  const stars = tier >= 5
    ? Array.from({ length: 12 }, (_, i) => `<circle cx="${20 + hash(idx + i) * 216}" cy="${20 + hash(idx + i * 2) * 100}" r="1.5" fill="#fff" opacity="0.6"/>`).join('')
    : '';

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
  ${characterSvg(charInfo, idx)}
  ${borderSvg(tier)}
  <text x="128" y="246" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="9" fill="#fff" opacity="0.85">${shortName}</text>
</svg>`;
}

module.exports = { buildCardSvg };
