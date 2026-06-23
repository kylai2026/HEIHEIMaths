/**
 * Build sanrio-deck.js and pixar-deck.js — 50 chars × 2 variants = 100 unique cards each.
 * Run: node scripts/build-gacha-decks.js
 */
const fs = require('fs');
const path = require('path');
const { buildUniqueDeck, validateDeck } = require('./deck-rosters');

const root = path.join(__dirname, '..');

const SANRIO_CHARS = [
  'Hello Kitty', '美樂蒂', '庫洛米', '肉桂狗', '布丁狗', '大眼蛙', '蛋黃哥', '酷企鵝',
  '帕恰狗', '奇奇', '拉拉', '燕尾服山姆', '漢頓', '巧克貓', '毛毯熊', '邦邦兔',
  '許願兔', '可可豆', '必愛諾', '淘氣猴', '蜜糖邦妮', '跳跳蛙', '小香香', '豆豆鴨',
  '鋼牙妹', '野狼健', '小浣熊', '海獅君', '鴨仔雷蒙', '摩卡', '牛奶', '芙蘭',
  '卡布奇諾', '濃縮咖啡', '大耳狗', '小倉鼠', '小綿羊', '小刺蝟', '小企鵝', '小狐狸',
  '小鹿斑比', '小松鼠', '小刺豚', '小無尾熊', '小樹懶', '小鸚鵡', '小海豹', '小水獺',
  '小恐龍', '唐企鵝'
];

const SANRIO_THEMES_A = [
  '草莓派對', '櫻花春日', '惡魔蝴蝶結', '雲朵飛行', '帽子貝雷', '荷葉泳圈', '懶懶煎蛋', '搖滾墨鏡',
  '藍耳飛奔', '星星閃亮', '月亮甜夢', '領結紳士', '噴水表演', '巧克力豆', '毛毯暖暖', '緞帶蝴蝶',
  '許願流星', '可可香氣', '愛心抱抱', '香蕉搗蛋', '蜜糖罐', '荷葉跳水', '花香蝴蝶', '鴨鴨游泳',
  '鋼牙閃亮', '野營帳篷', '洗臉盆', '海獅頂球', '雷蒙帽', '咖啡午茶', '奶嘴搖籃', '雪花圍巾',
  '耳罩冬日', '紳士禮帽', '長耳飄飄', '瓜子倉庫', '羊毛暖暖', '刺刺果實', '企鵝滑冰', '狐狸尾巴',
  '斑比花叢', '松果收藏', '刺豚氣球', '無尾桉樹', '樹懶吊床', '鸚鵡學舌', '海豹頂球', '水獺石頭',
  '恐龍化石', '企鵝南極'
];

const SANRIO_THEMES_B = [
  '蝴蝶結經典', '野餐籃子', '骷髏頭巾', '午睡枕頭', '布丁游泳', '雨傘跳跳', '醬油碟子', '滑板極限',
  '足球射門', '彩虹橋', '太陽暖暖', '魚子壽司', '海洋探險', '黑貓夜行', '枕頭大戰', '禮物緞帶',
  '兔子洞', '熱可可', '諾亞方舟', '叢林藤蔓', '邦妮花園', '池塘荷葉', '香水百合', '黃鴨游泳圈',
  '牙套閃耀', '月亮嚎叫', '森林浣洗', '球技表演', '鴨帽造型', '櫻花摩卡', '彩虹毯子', '蓬鬆芙蘭',
  '卡布午睡', '濃縮地圖', '雲朵大耳', '倉鼠跑輪', '綿羊數星', '刺蝟蘋果', '企鵝冰屋', '狐狸秋天',
  '鹿鳴山谷', '松鼠堅果', '河豚海洋', '無尾抱抱', '樹懶芒果', '鸚鵡彩羽', '海豹魚兒', '水獺貝殼',
  '恐龍蛋蛋', '冰山企鵝'
];

const PIXAR_CHARS = [
  '胡迪', '巴斯光年', '翠絲', '抱抱龍', '叉奇', '尼莫', '馬林', '多莉',
  '龜爺爺', '章魚漢克', '樂樂', '憂憂', '怒怒', '厭厭', '驚驚', '毛怪',
  '大眼仔', '阿布', '米格', '埃克托', '可可', '瓦力', '伊娃', '船長',
  '閃電麥昆', '拖線', '莎莉', '小米', '大廚', '柯米', '超能先生', '彈弓女',
  '小傑', '小倩', '小迪', '卡爾', '羅素', '道格', '梅莉達', '路卡',
  '艾伯托', '布魯諾', '小焰', '阿波', '阿樂', '焦焦', '阿甘', '蘇利文',
  '蘭道夫', '荷莉'
];

const PIXAR_THEMES_A = [
  '牛仔警長', '太空騎士', '西部牛仔', '恐龍吼叫', '手工藝品', '小丑魚橙', '父親尋子', '健忘藍魚',
  '海龜冲浪', '七條觸手', '快樂黃球', '憂鬱藍滴', '憤怒紅焰', '厭惡綠苗', '驚恐紫影', '藍色毛怪',
  '綠色獨眼', '粉色小女孩', '吉他少年', '骷髏夥伴', '可可記憶', '垃圾機器人', '白色機械', '輪椅船長',
  '紅色賽車', '棕色拖車', '藍色律師', '灰色老鼠', '廚師帽', '小老鼠廚', '超級力量', '彈性伸展',
  '隱形少女', '閃電男孩', '嬰兒超能', '氣球飛屋', '荒野探險', '會說話狗', '紅髮公主', '海怪少年',
  '單車競速', '預言師', '火焰女孩', '水波男孩', '焦慮橙球', '焦慮發光', '跑步冠軍', '毛怪學院',
  '紫色蜥蜴', '藍色門神'
];

const PIXAR_THEMES_B = [
  '警徽閃亮', '激光劍', '馬術競技', '綠色恐龍', '黏土手作', '珊瑚礁', '大海漂流', '健忘冒險',
  '東澳龜語', '水族館', '記憶球', '眼淚晶瑩', '火焰爆發', '綠色厭世', '紫色驚叫', '尖叫工廠',
  '怪獸大學', '門後世界', '亡靈節', '吉他彈唱', '家族照片', '地球清潔', '植物種子', '太空導航',
  '活塞杯', '鏽蝕友誼', '汽車旅館', '巴黎廚房', '料理鼠王', '甜點助手', '家庭特攻', '超人媽媽',
  '青春期', '嬰兒超能', '冰凍力量', '冒險書', '徽章收集', '松鼠追逐', '射箭比賽', '義大利夏',
  '海邊小鎮', '魔法預言', '元素愛戀', '水火相融', '腦內風暴', '新情緒', '阿甘語錄', '大眼搭檔',
  '驚悚門', '荷莉護送'
];

function buildPairedDeck(chars, themesA, themesB) {
  if (chars.length !== 50) throw new Error(`Expected 50 characters, got ${chars.length}`);
  const cards = [];
  const RARITY = [
    ...Array(3).fill('ssr'), ...Array(10).fill('ur'), ...Array(12).fill('sr'),
    ...Array(25).fill('rare'), ...Array(50).fill('common')
  ];
  const tier = { ssr: '傳說', ur: '極稀有', sr: '超稀有', rare: '稀有', common: '普通' };
  for (let i = 0; i < chars.length; i++) {
    for (const variant of [themesA[i], themesB[i]]) {
      const rarity = RARITY[cards.length];
      cards.push({
        char: chars[i],
        variant,
        name: `${chars[i]}·${variant}`,
        rarity,
        artNum: cards.length + 1,
        desc: `${tier[rarity]} · ${chars[i]} ${variant}`
      });
    }
  }
  validateDeck(cards);
  return cards;
}

function deckToFile(deck, deckName, imgPrefix, ver, imgFolder) {
  const lines = deck.map(c =>
    `  { name: '${c.name.replace(/'/g, "\\'")}', rarity: '${c.rarity}', img: ${imgPrefix}_IMG.art(${c.artNum}), desc: '${c.desc.replace(/'/g, "\\'")}' }`
  );
  return `/* ${deckName} 卡池：100 張獨立卡片，每角色最多 2 張 */
const ${imgPrefix}_ART_VER = ${ver};
const ${imgPrefix}_IMG = {
  art: (n) => \`assets/img/${imgFolder}/cards/art-\${String(n).padStart(3, '0')}.svg?v=\${${imgPrefix}_ART_VER}\`
};

const ${deckName} = [
${lines.join(',\n')}
];
`;
}

const sanrioDeck = buildPairedDeck(SANRIO_CHARS, SANRIO_THEMES_A, SANRIO_THEMES_B);
const pixarDeck = buildPairedDeck(PIXAR_CHARS, PIXAR_THEMES_A, PIXAR_THEMES_B);

fs.writeFileSync(path.join(root, 'js/sanrio-deck.js'), deckToFile(sanrioDeck, 'SANRIO_DECK', 'SANRIO', 3, 'cinnamoroll'));
fs.writeFileSync(path.join(root, 'js/pixar-deck.js'), deckToFile(pixarDeck, 'PIXAR_DECK', 'PIXAR', 2, 'pixar'));

console.log('Built sanrio-deck.js and pixar-deck.js (100 cards each, max 2 per character)');
