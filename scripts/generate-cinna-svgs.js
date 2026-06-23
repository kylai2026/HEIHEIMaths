/**
 * Generate unique pastel Cinnamoroll-style SVG card art (one file per card).
 * Run: node scripts/generate-cinna-svgs.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../assets/img/cinnamoroll/cards');
const START = 33;
const COUNT = 67;

const THEMES = [
  '雲朵', '星星', '蝴蝶結', '櫻花', '草莓', '牛奶糖', '棉花糖', '晴天', '雨天',
  '咖啡', '茶會', '音符', '氣球', '禮物', '雪花', '彩虹', '月亮', '太陽', '花朵',
  '愛心', '糖果', '餅乾', '蛋糕', '冰淇淋', '熱可可', '圍巾', '帽子', '書本',
  '相機', '畫筆', '風箏', '泡泡', '貝殼', '海星', '楓葉', '鈴鐺', '皇冠'
];

const BG_PAIRS = [
  ['#b6e3f4', '#e0f2fe'], ['#ffd5dc', '#fce7f3'], ['#e9d5ff', '#f3e8ff'],
  ['#fde68a', '#fef9c3'], ['#bbf7d0', '#dcfce7'], ['#fecaca', '#fee2e2'],
  ['#c7d2fe', '#e0e7ff'], ['#fed7aa', '#ffedd5'], ['#a5f3fc', '#cffafe'],
  ['#fbcfe8', '#fdf2f8']
];

function hash(n) {
  let x = n * 2654435761;
  return ((x >>> 0) % 1000) / 1000;
}

function puppySvg(cx, cy, scale, earTilt) {
  const s = scale;
  return `
    <g transform="translate(${cx},${cy}) scale(${s})">
      <ellipse cx="0" cy="18" rx="38" ry="32" fill="#fff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="-52" cy="-8" rx="22" ry="48" fill="#fff" stroke="#94a3b8" stroke-width="2" transform="rotate(${-18 + earTilt})"/>
      <ellipse cx="52" cy="-8" rx="22" ry="48" fill="#fff" stroke="#94a3b8" stroke-width="2" transform="rotate(${18 - earTilt})"/>
      <ellipse cx="-14" cy="-2" rx="7" ry="10" fill="#60a5fa"/>
      <ellipse cx="14" cy="-2" rx="7" ry="10" fill="#60a5fa"/>
      <ellipse cx="-22" cy="10" rx="9" ry="5" fill="#fda4af" opacity="0.7"/>
      <ellipse cx="22" cy="10" rx="9" ry="5" fill="#fda4af" opacity="0.7"/>
      <path d="M-6 14 Q0 20 6 14" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
      <circle cx="0" cy="42" r="10" fill="#fff" stroke="#94a3b8" stroke-width="1.5"/>
    </g>`;
}

function decoSvg(i, theme) {
  const h = hash(i);
  const parts = [];
  const count = 4 + (i % 6);
  for (let d = 0; d < count; d++) {
    const x = 20 + hash(i * 17 + d) * 216;
    const y = 20 + hash(i * 31 + d) * 216;
    const rot = hash(i * 7 + d) * 360;
    const op = 0.35 + hash(i + d) * 0.45;
    if (d % 3 === 0) {
      parts.push(`<text x="${x}" y="${y}" font-size="${14 + (d % 4) * 4}" fill="#f472b6" opacity="${op}" transform="rotate(${rot} ${x} ${y})">★</text>`);
    } else if (d % 3 === 1) {
      parts.push(`<circle cx="${x}" cy="${y}" r="${4 + d % 5}" fill="#fff" opacity="${op}"/>`);
    } else {
      parts.push(`<text x="${x}" y="${y}" font-size="16" opacity="${op}" transform="rotate(${rot} ${x} ${y})">♡</text>`);
    }
  }
  parts.push(`<text x="128" y="238" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="11" fill="#64748b" opacity="0.85">${theme}</text>`);
  return parts.join('\n');
}

function borderSvg(tier) {
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

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

for (let n = 0; n < COUNT; n++) {
  const idx = START + n;
  const i = idx;
  const theme = THEMES[n % THEMES.length];
  const [c1, c2] = BG_PAIRS[n % BG_PAIRS.length];
  const tier = n < 12 ? 1 : n < 30 ? 2 : n < 50 ? 3 : 4;
  const earTilt = (hash(i) - 0.5) * 20;
  const scale = 0.85 + hash(i * 3) * 0.25;
  const px = 128 + (hash(i * 5) - 0.5) * 30;
  const py = 118 + (hash(i * 11) - 0.5) * 20;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
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
  <rect width="256" height="256" rx="20" fill="url(#bg)"/>
  ${decoSvg(i, theme)}
  ${puppySvg(px, py, scale, earTilt)}
  ${borderSvg(tier)}
</svg>`;

  const file = path.join(OUT, `art-${String(idx).padStart(3, '0')}.svg`);
  fs.writeFileSync(file, svg.trim());
}

console.log(`Generated ${COUNT} SVG cards (art-${String(START).padStart(3, '0')} … art-${String(START + COUNT - 1).padStart(3, '0')})`);
