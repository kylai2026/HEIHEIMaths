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
  '帕恰狗', '奇奇', '拉拉', '燕尾服山姆', '漢頓', '烈子', '淘氣猴', '巧克貓',
  '毛毯熊', '邦邦兔', '許願兔', '必愛諾', '丹尼爾', '佩可醬', '田寶', '三文魚',
  '蜜糖邦妮', '鋼牙妹', '野狼健', '小浣熊', '海獅君', '鴨仔雷蒙', '摩卡', '牛奶',
  '芙蘭', '卡布奇諾', '濃縮咖啡', '帕蒂', '吉米', '烏薩哈娜', '可吉', '小香香',
  '帕塔派', '座敷狸', '花丸鬼', '熊寶', '蘭德里', '森小子', '抹茶兔', '櫻花兔',
  '糖果妹', '可憐咪'
];

const SANRIO_THEMES_A = [
  '紅蝴蝶結', '粉紅帽兜', '惡魔帽兜', '彩帶飛天', '貝雷帽', '荷葉青蛙', '懶懶煎蛋', '搖滾墨鏡',
  '藍耳奔馳', '星星閃耀', '月亮甜夢', '領結紳士', '噴水海洋', '金屬搖滾', '淘氣香蕉', '巧克力夜',
  '毛毯暖暖', '緞帶公主', '許願流星', '綿羊鋼琴', '紳士禮帽', '藍衣鴨鴨', '笑口常開', '三文魚片',
  '蜜糖花園', '金屬牙套', '野營嚎叫', '洗臉浣熊', '頂球海獅', '雷蒙帽子', '摩卡咖啡', '搖籃牛奶',
  '雪花芙蘭', '耳罩冬日', '頂帽紳士', '紅裙帕蒂', '寬帽吉米', '櫻花兔耳', '小麥精靈', '香水蝴蝶',
  '蝴蝶飛舞', '座敷榻榻米', '花丸跳舞', '熊貓抱抱', '毛巾折疊', '森林探險', '抹茶甜點', '櫻花飛舞',
  '糖果甜心', '辦公室淡定'
];

const SANRIO_THEMES_B = [
  '藍吊帶褲', '野餐籃子', '骷髏頭巾', '雲端飛行', '巨餅舞台', '手風琴演奏', '海灘吐司', '滑板極限',
  '足球熱血', '彩虹拱門', '太陽暖暖', '壽司聯名', '海洋探險', '電子琴搖滾', '叢林藤蔓', '黑貓夜行',
  '枕頭午睡', '禮物緞帶', '兔子許願', '愛心抱抱', '玫瑰紳士', '泳圈鴨鴨', '開心大笑', '壽司盤子',
  '邦妮花園', '牙套閃耀', '月亮嚎叫', '森林浣洗', '球技表演', '鴨帽造型', '櫻花摩卡', '彩虹毯子',
  '蓬鬆芙蘭', '卡布午睡', '濃縮地圖', '蛋糕甜品', '足球明星', '兔子舞會', '雲朵精靈', '百合花束',
  '派對拍手', '鐮倉小町', '鬼火跳躍', '竹葉熊貓', '陽光晾曬', '螢火森林', '和果子', '祭典燈籠',
  '棉花糖雲', '煙花慶典'
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

fs.writeFileSync(path.join(root, 'js/sanrio-deck.js'), deckToFile(sanrioDeck, 'SANRIO_DECK', 'SANRIO', 5, 'cinnamoroll'));
fs.writeFileSync(path.join(root, 'js/pixar-deck.js'), deckToFile(pixarDeck, 'PIXAR_DECK', 'PIXAR', 2, 'pixar'));

console.log('Built sanrio-deck.js and pixar-deck.js (100 cards each, max 2 per character)');
