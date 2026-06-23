/**
 * Procedural Sanrio-style card art — distinct body types per character.
 */
function hash(n) {
  let x = n * 2654435761;
  return ((x >>> 0) % 1000) / 1000;
}

const CHAR_FROM_NAME = [
  { keys: ['Hello Kitty'], id: 'kitty' },
  { keys: ['美樂蒂'], id: 'melody' },
  { keys: ['庫洛米'], id: 'kuromi' },
  { keys: ['肉桂狗', '大耳狗'], id: 'cinna' },
  { keys: ['布丁狗'], id: 'pompom' },
  { keys: ['大眼蛙', '跳跳蛙'], id: 'keroppi' },
  { keys: ['蛋黃哥'], id: 'gudetama' },
  { keys: ['酷企鵝', '唐企鵝', '小企鵝'], id: 'badtz' },
  { keys: ['帕恰狗'], id: 'pochacco' },
  { keys: ['奇奇'], id: 'kiki' },
  { keys: ['拉拉'], id: 'lala' },
  { keys: ['燕尾服山姆'], id: 'sam' },
  { keys: ['漢頓', '海獅君', '小海豹'], id: 'hangyodon' },
  { keys: ['巧克貓'], id: 'chococat' },
  { keys: ['毛毯熊'], id: 'corocorokuririn' },
  { keys: ['邦邦兔', '許願兔', '蜜糖邦妮'], id: 'bunny' },
  { keys: ['可可豆'], id: 'pochi' },
  { keys: ['必愛諾'], id: 'piano' },
  { keys: ['淘氣猴'], id: 'monkichi' },
  { keys: ['小香香'], id: 'deardaniel' },
  { keys: ['豆豆鴨', '鴨仔雷蒙'], id: 'duck' },
  { keys: ['鋼牙妹'], id: 'beaver' },
  { keys: ['野狼健'], id: 'wolf' },
  { keys: ['小浣熊'], id: 'raccoon' },
  { keys: ['摩卡'], id: 'mocha' },
  { keys: ['牛奶'], id: 'milk' },
  { keys: ['芙蘭'], id: 'chiffon' },
  { keys: ['卡布奇諾'], id: 'cappuccino' },
  { keys: ['濃縮咖啡'], id: 'espresso' },
  { keys: ['小倉鼠'], id: 'hamster' },
  { keys: ['小綿羊'], id: 'sheep' },
  { keys: ['小刺蝟'], id: 'hedgehog' },
  { keys: ['小狐狸'], id: 'fox' },
  { keys: ['小鹿斑比'], id: 'deer' },
  { keys: ['小松鼠'], id: 'squirrel' },
  { keys: ['小刺豚'], id: 'puffer' },
  { keys: ['小無尾熊'], id: 'koala' },
  { keys: ['小樹懶'], id: 'sloth' },
  { keys: ['小鸚鵡'], id: 'parrot' },
  { keys: ['小水獺'], id: 'otter' },
  { keys: ['小恐龍'], id: 'dino' }
];

const POSE_FROM_NAME = [
  { keys: ['飛行', '雲海', '飛奔', '飄飄', '大耳'], id: 'fly' },
  { keys: ['睡覺', '午覺', '午睡', '搖籃', '慵懶', '打盹', '吊床'], id: 'sleep' },
  { keys: ['探頭', '驚喜'], id: 'peek' },
  { keys: ['坐下', '花籃', '煎蛋', '游泳'], id: 'sit' }
];

const PROP_FROM_NAME = [
  { keys: ['草莓'], svg: '<circle cx="128" cy="52" r="14" fill="#ef4444"/><path d="M128 42 L132 36 L124 36 Z" fill="#22c55e"/>' },
  { keys: ['雨', '傘'], svg: '<path d="M88 78 Q128 48 168 78" fill="none" stroke="#60a5fa" stroke-width="4"/><line x1="128" y1="78" x2="128" y2="110" stroke="#64748b" stroke-width="3"/>' },
  { keys: ['雪糕', '冰淇淋'], svg: '<polygon points="118,95 138,95 128,65" fill="#fbbf24"/><ellipse cx="128" cy="62" rx="18" ry="12" fill="#fda4af"/>' },
  { keys: ['氣球'], svg: '<circle cx="100" cy="58" r="12" fill="#f472b6"/><circle cx="128" cy="48" r="14" fill="#60a5fa"/><circle cx="156" cy="58" r="11" fill="#fbbf24"/><line x1="128" y1="62" x2="128" y2="88" stroke="#94a3b8" stroke-width="2"/>' },
  { keys: ['櫻花'], svg: '<text x="48" y="52" font-size="22" fill="#fda4af">🌸</text><text x="188" y="68" font-size="18" fill="#fda4af">🌸</text>' },
  { keys: ['聖誕', '冬日', '雪花', '圍巾', '耳罩'], svg: '<text x="52" y="58" font-size="18" fill="#fff">❄</text><text x="178" y="72" font-size="14" fill="#e0f2fe">❄</text>' },
  { keys: ['蝴蝶結', '骷髏', '惡魔'], svg: '<ellipse cx="108" cy="88" rx="10" ry="7" fill="#f472b6"/><ellipse cx="148" cy="88" rx="10" ry="7" fill="#f472b6"/><circle cx="128" cy="88" r="5" fill="#ec4899"/>' },
  { keys: ['星星', '星座', '星空', '流星', '許願'], svg: '<text x="42" y="44" font-size="20" fill="#fef08a">✦</text><text x="198" y="56" font-size="16" fill="#fff">★</text>' },
  { keys: ['月亮', '晚安'], svg: '<path d="M170 48 A28 28 0 1 1 150 76 A22 22 0 1 0 170 48" fill="#fef08a" opacity="0.9"/>' },
  { keys: ['太陽', '晴天'], svg: '<circle cx="196" cy="48" r="18" fill="#fbbf24" opacity="0.85"/>' },
  { keys: ['彩虹'], svg: '<path d="M40 170 Q128 90 216 170" fill="none" stroke="#f472b6" stroke-width="5" opacity="0.5"/>' },
  { keys: ['煙花', '慶典', '派對'], svg: '<circle cx="64" cy="50" r="3" fill="#f472b6"/><line x1="64" y1="50" x2="48" y2="34" stroke="#f472b6" stroke-width="1.5"/>' },
  { keys: ['禮物', '生日'], svg: '<rect x="108" y="200" width="40" height="28" rx="4" fill="#60a5fa"/><rect x="108" y="192" width="40" height="12" fill="#f472b6"/>' },
  { keys: ['咖啡', '茶會', '下午茶', '摩卡', '濃縮'], svg: '<rect x="178" y="188" width="28" height="22" rx="4" fill="#fff" stroke="#94a3b8"/><ellipse cx="192" cy="196" rx="10" ry="4" fill="#8b5a2b" opacity="0.5"/>' },
  { keys: ['音符', '搖滾', '墨鏡'], svg: '<text x="178" y="62" font-size="28" fill="#a78bfa">♪</text>' },
  { keys: ['相機', '拍照'], svg: '<rect x="168" y="186" width="36" height="26" rx="6" fill="#334155"/><circle cx="186" cy="198" r="9" fill="#94a3b8"/>' },
  { keys: ['風箏'], svg: '<polygon points="48,80 68,50 88,80 68,95" fill="#fda4af"/><line x1="68" y1="95" x2="68" y2="130" stroke="#94a3b8" stroke-width="2"/>' },
  { keys: ['貝殼', '海', '珊瑚', '游泳', '荷葉'], svg: '<path d="M40 200 Q52 180 64 200 Q52 215 40 200" fill="#fda4af"/>' },
  { keys: ['楓葉', '秋天'], svg: '<text x="186" y="196" font-size="24" fill="#ea580c">🍁</text>' },
  { keys: ['糖果', '餅乾', '蛋糕', '蜜糖'], svg: '<circle cx="186" cy="196" r="14" fill="#f472b6" opacity="0.8"/>' },
  { keys: ['愛心'], svg: '<text x="128" y="56" font-size="26" fill="#f472b6">♥</text>' },
  { keys: ['花朵', '花叢', '花園'], svg: '<circle cx="128" cy="48" r="10" fill="#fda4af"/><circle cx="116" cy="44" r="6" fill="#fbcfe8"/><circle cx="140" cy="44" r="6" fill="#fbcfe8"/>' },
  { keys: ['皇冠', '皇家', '音樂會', '紳士', '領結'], svg: '<polygon points="108,72 118,52 128,68 138,52 148,72" fill="#fbbf24"/>' },
  { keys: ['壽司'], svg: '<ellipse cx="56" cy="196" rx="16" ry="10" fill="#fff" stroke="#94a3b8"/><circle cx="56" cy="192" r="6" fill="#f97316"/>' },
  { keys: ['雲朵', '飛行'], svg: '<ellipse cx="56" cy="200" rx="28" ry="14" fill="#fff" opacity="0.85"/><ellipse cx="200" cy="188" rx="24" ry="12" fill="#fff" opacity="0.75"/>' },
  { keys: ['足球', '滑板', '滑冰'], svg: '<circle cx="56" cy="196" r="14" fill="#fff" stroke="#1e293b" stroke-width="2"/><path d="M56 182 L56 210 M42 196 L70 196" stroke="#1e293b" stroke-width="1.5"/>' },
  { keys: ['煎蛋', '醬油'], svg: '<ellipse cx="128" cy="200" rx="28" ry="16" fill="#fff" stroke="#d6d3d1"/><ellipse cx="128" cy="196" rx="14" ry="10" fill="#fbbf24"/>' },
  { keys: ['恐龍', '化石'], svg: '<path d="M60 200 Q90 150 120 180 Q150 210 180 170 Q200 150 210 200" fill="#65a30d" opacity="0.6"/>' }
];

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

function poseTransform(pose, idx) {
  const h = hash(idx);
  let tx = 128 + (hash(idx * 5) - 0.5) * 20;
  let ty = 122 + (hash(idx * 11) - 0.5) * 14;
  let rot = 0;
  let scale = 0.88 + hash(idx * 3) * 0.18;
  if (pose === 'fly') { ty = 100; rot = -8; scale *= 1.05; }
  if (pose === 'sleep') { ty = 138; rot = -12; }
  if (pose === 'peek') { ty = 152; scale *= 1.12; }
  if (pose === 'sit') { ty = 128; }
  return { tx, ty, rot, scale, tilt: (h - 0.5) * 20 };
}

function eyesOpen(color, sleep) {
  if (sleep) return '<path d="M-16 -2 Q-10 4 -4 -2" fill="none" stroke="#475569" stroke-width="2"/><path d="M4 -2 Q10 4 16 -2" fill="none" stroke="#475569" stroke-width="2"/>';
  return `<ellipse cx="-14" cy="-2" rx="7" ry="10" fill="${color}"/><ellipse cx="14" cy="-2" rx="7" ry="10" fill="${color}"/>`;
}

function cheeks() {
  return '<ellipse cx="-20" cy="10" rx="8" ry="5" fill="#fda4af" opacity="0.65"/><ellipse cx="20" cy="10" rx="8" ry="5" fill="#fda4af" opacity="0.65"/>';
}

const BODY_DRAW = {
  kitty(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    const sleep = pose === 'sleep';
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="8" rx="34" ry="30" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="-38" cy="-8" rx="10" ry="12" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="38" cy="-8" rx="10" ry="12" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="0" cy="-42" rx="18" ry="12" fill="#fbbf24"/>
      <ellipse cx="-12" cy="-44" rx="10" ry="8" fill="#fbbf24"/>
      <ellipse cx="12" cy="-44" rx="10" ry="8" fill="#fbbf24"/>
      ${eyesOpen('#1e293b', sleep)}
      ${cheeks()}
      <ellipse cx="-6" cy="-6" r="2.5" fill="#1e293b"/><ellipse cx="6" cy="-6" r="2.5" fill="#1e293b"/>
    </g>`;
  },
  melody(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    const sleep = pose === 'sleep';
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="12" rx="30" ry="28" fill="#fff" stroke="#fbcfe8" stroke-width="2"/>
      <ellipse cx="-8" cy="-52" rx="14" ry="42" fill="#fff" stroke="#fbcfe8" stroke-width="2"/>
      <ellipse cx="22" cy="-52" rx="14" ry="42" fill="#fff" stroke="#fbcfe8" stroke-width="2"/>
      <ellipse cx="0" cy="-58" rx="14" ry="10" fill="#f472b6"/>
      ${eyesOpen('#1e293b', sleep)}
      ${cheeks()}
      <path d="M-5 14 Q0 18 5 14" fill="none" stroke="#f472b6" stroke-width="2"/>
    </g>`;
  },
  kuromi(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="10" rx="32" ry="30" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="-46" cy="-4" rx="16" ry="38" fill="#1e293b" stroke="#0f172a" stroke-width="2" transform="rotate(-12)"/>
      <ellipse cx="46" cy="-4" rx="16" ry="38" fill="#1e293b" stroke="#0f172a" stroke-width="2" transform="rotate(12)"/>
      <ellipse cx="0" cy="-48" rx="16" ry="10" fill="#f472b6"/>
      <text x="0" y="-44" text-anchor="middle" font-size="14" fill="#fff">☠</text>
      ${eyesOpen('#ec4899', false)}
      ${cheeks()}
    </g>`;
  },
  cinna(pose, idx) {
    const { tx, ty, rot, scale, tilt } = poseTransform(pose, idx);
    const sleep = pose === 'sleep';
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="36" ry="30" fill="#fff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="-50" cy="-6" rx="20" ry="46" fill="#fff" stroke="#94a3b8" stroke-width="2" transform="rotate(${-16 + tilt})"/>
      <ellipse cx="50" cy="-6" rx="20" ry="46" fill="#fff" stroke="#94a3b8" stroke-width="2" transform="rotate(${16 - tilt})"/>
      ${eyesOpen('#60a5fa', sleep)}
      ${cheeks()}
      <path d="M-5 14 Q0 19 5 14" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="0" cy="40" r="9" fill="#fff" stroke="#94a3b8" stroke-width="1.5"/>
    </g>`;
  },
  pompom(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="34" ry="30" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="-42" cy="0" rx="14" ry="22" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="42" cy="0" rx="14" ry="22" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="0" cy="-46" rx="22" ry="14" fill="#854d0e"/>
      ${eyesOpen('#1e293b', pose === 'sleep')}
      ${cheeks()}
    </g>`;
  },
  keroppi(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="36" ry="32" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
      <ellipse cx="-28" cy="-28" rx="18" ry="22" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
      <ellipse cx="28" cy="-28" rx="18" ry="22" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
      ${eyesOpen('#fff', false)}
      <circle cx="-14" cy="0" r="4" fill="#fff"/><circle cx="14" cy="0" r="4" fill="#fff"/>
      <path d="M-10 18 Q0 26 10 18" fill="none" stroke="#15803d" stroke-width="2"/>
    </g>`;
  },
  gudetama(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="20" rx="48" ry="38" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="0" cy="8" rx="38" ry="28" fill="#fff" opacity="0.35"/>
      <ellipse cx="-16" cy="12" rx="5" ry="7" fill="#1e293b" opacity="0.7"/>
      <ellipse cx="16" cy="12" rx="5" ry="7" fill="#1e293b" opacity="0.7"/>
      <path d="M-8 28 Q0 22 8 28" fill="none" stroke="#ca8a04" stroke-width="2"/>
      <line x1="-20" y1="42" x2="-8" y2="36" stroke="#ca8a04" stroke-width="2"/>
      <line x1="20" y1="42" x2="8" y2="36" stroke="#ca8a04" stroke-width="2"/>
    </g>`;
  },
  badtz(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="30" ry="34" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="0" cy="-30" rx="22" ry="20" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      <polygon points="-18,-48 -8,-58 8,-58 18,-48" fill="#f97316"/>
      ${eyesOpen('#fff', false)}
      <ellipse cx="0" cy="8" rx="10" ry="6" fill="#fff"/>
    </g>`;
  },
  pochacco(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="32" ry="28" fill="#fff" stroke="#bae6fd" stroke-width="2"/>
      <ellipse cx="-44" cy="-10" rx="16" ry="34" fill="#fff" stroke="#60a5fa" stroke-width="2"/>
      <ellipse cx="44" cy="-10" rx="16" ry="34" fill="#fff" stroke="#60a5fa" stroke-width="2"/>
      ${eyesOpen('#1e293b', pose === 'sleep')}
      ${cheeks()}
    </g>`;
  },
  kiki(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <polygon points="0,-40 28,20 -28,20" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
      <circle cx="0" cy="8" r="22" fill="#fda4af" stroke="#db2777" stroke-width="2"/>
      ${eyesOpen('#1e293b', false)}
      <polygon points="0,-50 -8,-38 8,-38" fill="#fef08a"/>
    </g>`;
  },
  lala(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <polygon points="0,-40 28,20 -28,20" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
      <circle cx="0" cy="8" r="22" fill="#bae6fd" stroke="#2563eb" stroke-width="2"/>
      ${eyesOpen('#1e293b', false)}
      <polygon points="0,-50 -8,-38 8,-38" fill="#fef08a"/>
    </g>`;
  },
  sam(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="12" rx="30" ry="28" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="-32" cy="-18" rx="12" ry="16" fill="#1e293b"/><ellipse cx="32" cy="-18" rx="12" ry="16" fill="#1e293b"/>
      <rect x="-24" y="28" width="48" height="22" rx="4" fill="#fff" stroke="#94a3b8"/>
      <polygon points="-8,28 0,18 8,28" fill="#1e293b"/>
      ${eyesOpen('#fbbf24', false)}
      ${cheeks()}
    </g>`;
  },
  hangyodon(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="20" rx="40" ry="28" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <ellipse cx="0" cy="-18" rx="28" ry="24" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
      <ellipse cx="-12" cy="-20" rx="8" ry="10" fill="#fff"/><ellipse cx="12" cy="-20" rx="8" ry="10" fill="#fff"/>
      <circle cx="-12" cy="-18" r="4" fill="#1e293b"/><circle cx="12" cy="-18" r="4" fill="#1e293b"/>
      <ellipse cx="0" cy="36" rx="8" ry="5" fill="#f472b6"/>
    </g>`;
  },
  chococat(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="10" rx="32" ry="28" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="-36" cy="-14" rx="12" ry="18" fill="#1e293b"/><ellipse cx="36" cy="-14" rx="12" ry="18" fill="#1e293b"/>
      ${eyesOpen('#fbbf24', false)}
      <ellipse cx="0" cy="6" rx="6" ry="4" fill="#f472b6"/>
    </g>`;
  },
  corocorokuririn(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="38" ry="32" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      <ellipse cx="-36" cy="-8" rx="14" ry="18" fill="#d97706"/><ellipse cx="36" cy="-8" rx="14" ry="18" fill="#d97706"/>
      <rect x="-30" y="0" width="60" height="40" rx="8" fill="#bae6fd" opacity="0.85"/>
      ${eyesOpen('#1e293b', pose === 'sleep')}
      ${cheeks()}
    </g>`;
  },
  bunny(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    const color = hash(idx) > 0.5 ? '#fff' : '#fecdd3';
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="28" ry="26" fill="${color}" stroke="#f9a8d4" stroke-width="2"/>
      <ellipse cx="-10" cy="-48" rx="10" ry="36" fill="${color}" stroke="#f9a8d4" stroke-width="2"/>
      <ellipse cx="14" cy="-48" rx="10" ry="36" fill="${color}" stroke="#f9a8d4" stroke-width="2"/>
      ${eyesOpen('#1e293b', pose === 'sleep')}
      ${cheeks()}
    </g>`;
  },
  pochi(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="30" ry="26" fill="#a16207" stroke="#713f12" stroke-width="2"/>
      <ellipse cx="-38" cy="0" rx="14" ry="20" fill="#a16207"/><ellipse cx="38" cy="0" rx="14" ry="20" fill="#a16207"/>
      ${eyesOpen('#1e293b', false)}
      ${cheeks()}
    </g>`;
  },
  piano(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="34" ry="30" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="0" cy="-36" rx="30" ry="22" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="-8" cy="-8" rx="6" ry="8" fill="#1e293b"/><ellipse cx="8" cy="-8" rx="6" ry="8" fill="#1e293b"/>
      ${cheeks()}
    </g>`;
  },
  monkichi(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="30" ry="28" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      <ellipse cx="0" cy="-32" rx="26" ry="22" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      <ellipse cx="-30" cy="-8" rx="12" ry="16" fill="#d97706"/><ellipse cx="30" cy="-8" rx="12" ry="16" fill="#d97706"/>
      ${eyesOpen('#1e293b', false)}
      <ellipse cx="0" cy="8" rx="12" ry="8" fill="#fef3c7"/>
    </g>`;
  },
  deardaniel(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="28" ry="26" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="-30" cy="-6" rx="12" ry="18" fill="#1e293b"/><ellipse cx="30" cy="-6" rx="12" ry="18" fill="#1e293b"/>
      <ellipse cx="0" cy="-38" rx="8" ry="6" fill="#f472b6"/>
      ${eyesOpen('#1e293b', false)}
      ${cheeks()}
    </g>`;
  },
  duck(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="32" ry="28" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="0" cy="-22" rx="24" ry="20" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="0" cy="-8" rx="16" ry="10" fill="#f97316"/>
      ${eyesOpen('#1e293b', false)}
    </g>`;
  },
  beaver(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="30" ry="26" fill="#92400e" stroke="#713f12" stroke-width="2"/>
      <rect x="-18" y="28" width="36" height="14" rx="4" fill="#78350f"/>
      <ellipse cx="-10" cy="-20" rx="8" ry="10" fill="#92400e"/><ellipse cx="10" cy="-20" rx="8" ry="10" fill="#92400e"/>
      ${eyesOpen('#fff', false)}
      <rect x="-6" y="32" width="4" height="8" fill="#fff"/><rect x="2" y="32" width="4" height="8" fill="#fff"/>
    </g>`;
  },
  wolf(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="30" ry="28" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
      <polygon points="-20,-40 -8,-58 4,-42" fill="#94a3b8"/><polygon points="20,-40 8,-58 -4,-42" fill="#94a3b8"/>
      ${eyesOpen('#1e293b', false)}
      <ellipse cx="0" cy="10" rx="10" ry="8" fill="#e2e8f0"/>
    </g>`;
  },
  raccoon(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="30" ry="28" fill="#78716c" stroke="#57534e" stroke-width="2"/>
      <ellipse cx="0" cy="-8" rx="22" ry="18" fill="#e7e5e4"/>
      <ellipse cx="-32" cy="-6" rx="10" ry="14" fill="#78716c"/><ellipse cx="32" cy="-6" rx="10" ry="14" fill="#78716c"/>
      <ellipse cx="-12" cy="-6" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="-6" rx="6" ry="8" fill="#1e293b"/>
      ${cheeks()}
    </g>`;
  },
  mocha(pose, idx) { return BODY_DRAW.cinna(pose, idx).replace(/#ffffff/g, '#d4b896').replace(/#fff/g, '#d4b896').replace(/#60a5fa/g, '#78350f'); },
  milk(pose, idx) { return BODY_DRAW.cinna(pose, idx).replace(/#ffffff/g, '#fffbeb').replace(/#fff/g, '#fffbeb'); },
  chiffon(pose, idx) { return BODY_DRAW.cinna(pose, idx).replace(/#ffffff/g, '#fecdd3').replace(/#fff/g, '#fecdd3').replace(/#60a5fa/g, '#be185d'); },
  cappuccino(pose, idx) { return BODY_DRAW.cinna(pose, idx).replace(/#ffffff/g, '#a68a64').replace(/#fff/g, '#a68a64').replace(/#60a5fa/g, '#1e3a5f'); },
  espresso(pose, idx) { return BODY_DRAW.cinna(pose, idx).replace(/#ffffff/g, '#e8d4b8').replace(/#fff/g, '#e8d4b8').replace(/#60a5fa/g, '#44403c'); },
  hamster(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="28" ry="24" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
      <ellipse cx="-20" cy="-18" rx="10" ry="12" fill="#fbbf24"/><ellipse cx="20" cy="-18" rx="10" ry="12" fill="#fbbf24"/>
      <ellipse cx="-10" cy="4" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="4" rx="5" ry="7" fill="#1e293b"/>
      ${cheeks()}
    </g>`;
  },
  sheep(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <circle cx="0" cy="8" r="34" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
      <circle cx="-18" cy="-8" r="12" fill="#fff"/><circle cx="18" cy="-8" r="12" fill="#fff"/><circle cx="0" cy="-20" r="14" fill="#fff"/>
      <ellipse cx="-10" cy="6" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="6" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  },
  hedgehog(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    const spines = Array.from({ length: 8 }, (_, i) => {
      const a = -70 + i * 20;
      return `<line x1="0" y1="-20" x2="${Math.sin(a * Math.PI / 180) * 28}" y2="${-20 + Math.cos(a * Math.PI / 180) * -28}" stroke="#78716c" stroke-width="3"/>`;
    }).join('');
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">${spines}
      <ellipse cx="0" cy="14" rx="28" ry="24" fill="#d6d3d1" stroke="#a8a29e" stroke-width="2"/>
      <ellipse cx="-10" cy="8" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="8" rx="5" ry="7" fill="#1e293b"/>
      ${cheeks()}
    </g>`;
  },
  fox(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="28" ry="26" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
      <polygon points="-24,-36 -12,-56 0,-38" fill="#f97316"/><polygon points="24,-36 12,-56 0,-38" fill="#f97316"/>
      <ellipse cx="0" cy="4" rx="16" ry="14" fill="#fff"/>
      ${eyesOpen('#1e293b', false)}
    </g>`;
  },
  deer(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="26" ry="28" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      <path d="M-20 -30 L-28 -55 M-20 -30 L-8 -50 M20 -30 L28 -55 M20 -30 L8 -50" stroke="#92400e" stroke-width="3" fill="none"/>
      <ellipse cx="-8" cy="8" rx="5" ry="7" fill="#1e293b"/><ellipse cx="8" cy="8" rx="5" ry="7" fill="#1e293b"/>
      ${cheeks()}
    </g>`;
  },
  squirrel(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="26" ry="28" fill="#d97706" stroke="#92400e" stroke-width="2"/>
      <ellipse cx="0" cy="38" rx="30" ry="22" fill="#b45309" opacity="0.8"/>
      <ellipse cx="-8" cy="8" rx="5" ry="7" fill="#1e293b"/><ellipse cx="8" cy="8" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  },
  puffer(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <circle cx="0" cy="10" r="36" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
      <line x1="0" y1="-26" x2="0" y2="-50" stroke="#eab308" stroke-width="2"/>
      <ellipse cx="-12" cy="6" rx="6" ry="8" fill="#1e293b"/><ellipse cx="12" cy="6" rx="6" ry="8" fill="#1e293b"/>
      <path d="M-8 20 Q0 28 8 20" fill="none" stroke="#ca8a04" stroke-width="2"/>
    </g>`;
  },
  koala(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="14" rx="30" ry="28" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
      <circle cx="-28" cy="-10" r="16" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
      <circle cx="28" cy="-10" r="16" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="0" cy="6" rx="18" ry="16" fill="#e2e8f0"/>
      <ellipse cx="-8" cy="4" rx="5" ry="7" fill="#1e293b"/><ellipse cx="8" cy="4" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  },
  sloth(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="32" ry="28" fill="#a8a29e" stroke="#78716c" stroke-width="2"/>
      <ellipse cx="0" cy="-20" rx="26" ry="22" fill="#a8a29e" stroke="#78716c" stroke-width="2"/>
      <path d="M-30 -10 Q-50 20 -20 30" fill="none" stroke="#78716c" stroke-width="6" stroke-linecap="round"/>
      <path d="M30 -10 Q50 20 20 30" fill="none" stroke="#78716c" stroke-width="6" stroke-linecap="round"/>
      ${eyesOpen('#1e293b', true)}
    </g>`;
  },
  parrot(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="26" ry="30" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <ellipse cx="0" cy="-22" rx="20" ry="18" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <polygon points="0,-6 18,0 0,8" fill="#f97316"/>
      <ellipse cx="-8" cy="-16" rx="5" ry="7" fill="#1e293b"/><ellipse cx="8" cy="-16" rx="5" ry="7" fill="#1e293b"/>
      <path d="M20 20 Q40 40 30 60" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
    </g>`;
  },
  otter(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="16" rx="30" ry="28" fill="#78716c" stroke="#57534e" stroke-width="2"/>
      <ellipse cx="0" cy="-18" rx="24" ry="20" fill="#78716c" stroke="#57534e" stroke-width="2"/>
      <ellipse cx="-10" cy="-4" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="-4" rx="5" ry="7" fill="#1e293b"/>
      <ellipse cx="0" cy="6" rx="8" ry="5" fill="#e7e5e4"/>
    </g>`;
  },
  dino(pose, idx) {
    const { tx, ty, rot, scale } = poseTransform(pose, idx);
    return `<g transform="translate(${tx},${ty}) rotate(${rot}) scale(${scale})">
      <ellipse cx="0" cy="18" rx="32" ry="28" fill="#65a30d" stroke="#4d7c0f" stroke-width="2"/>
      <ellipse cx="0" cy="-24" rx="24" ry="20" fill="#65a30d" stroke="#4d7c0f" stroke-width="2"/>
      <polygon points="-8,-44 0,-58 8,-44" fill="#65a30d"/>
      <path d="M28 10 Q50 -10 56 20" fill="none" stroke="#65a30d" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="-10" cy="-8" rx="5" ry="7" fill="#1e293b"/><ellipse cx="10" cy="-8" rx="5" ry="7" fill="#1e293b"/>
    </g>`;
  }
};

function characterSvg(charId, pose, idx) {
  const draw = BODY_DRAW[charId] || BODY_DRAW.cinna;
  return draw(pose, idx);
}

function sceneSvg(rarity, idx) {
  const tier = rarityTier(rarity);
  const h = hash(idx * 13);
  const parts = [];
  if (tier >= 5) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    for (let i = 0; i < 18; i++) {
      parts.push(`<circle cx="${hash(idx + i * 7) * 256}" cy="${hash(idx + i * 13) * 120}" r="${1 + hash(i) * 2}" fill="#fff" opacity="${0.3 + hash(i + idx) * 0.5}"/>`);
    }
  } else if (tier >= 4) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
    parts.push('<circle cx="128" cy="128" r="100" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.25"/>');
  } else if (tier >= 3) {
    parts.push('<rect width="256" height="256" fill="url(#bg)"/>');
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
    return `<rect x="4" y="4" width="248" height="248" rx="18" fill="none" stroke="url(#gold)" stroke-width="5"/>`;
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
  const shortName = name.length > 14 ? name.slice(0, 13) + '…' : name;

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
