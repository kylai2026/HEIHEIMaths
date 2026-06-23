/** Shared rosters: each character appears exactly twice with different variants. */

const SANRIO_VARIANTS = [
  '草莓派對', '櫻花春日', '聖誕雪人', '夏日海灘', '星空許願', '音樂會', '下午茶', '彩虹毯',
  '雲朵午睡', '泰迪驚喜', '雪糕甜蜜', '花園野餐', '蝴蝶結', '圍巾暖冬', '氣球慶典',
  '月亮晚安', '晴天散步', '雨天小傘', '咖啡時光', '糖果罐', '餅乾烘焙', '禮物盒',
  '音符旋律', '相機自拍', '風箏飛翔', '貝殼海邊', '楓葉秋色', '鈴鐺叮噹',
  '探頭驚喜', '飛行雲海', '皇冠皇家', '壽司聯名', '煙花慶典', '愛心傳遞',
  '花朵花冠', '泡泡吹吹', '熱可可', '背包探險', '枕頭午覺', '購物街',
  '玩具熊', '棉花糖', '牛奶糖', '冰淇淋', '蛋糕派對', '太陽早安',
  '手套暖暖', '柔軟毛毯', '望遠鏡', '地圖冒險', '限定收藏'
];

const SANRIO_CHARACTERS = [
  'Hello Kitty', '美樂蒂', '庫洛米', '肉桂狗', '布丁狗', '大眼蛙', '蛋黃哥', '酷企鵝',
  '帕恰狗', '雙子星·奇奇', '雙子星·拉拉', '燕尾服山姆', '漢頓', '巧克貓', '毛毯熊',
  '邦邦兔', '許願兔', '可可豆', '必愛諾', '淘氣猴', '蜜糖邦妮', '跳跳蛙',
  '小香香', '豆豆鴨', '鋼牙妹', '野狼健', '小浣熊', '海獅君', '鴨仔雷蒙',
  '摩卡', '牛奶', '芙蘭', '卡布奇諾', '濃縮咖啡', '小倉鼠', '小綿羊',
  '小刺蝟', '小企鵝', '小狐狸', '小鹿斑比', '小松鼠', '小刺豚',
  '小無尾熊', '小樹懶', '小鸚鵡', '小海豹', '小水獺', '小恐龍'
];

const PIXAR_VARIANTS = [
  '經典造型', '派對裝', '冬日圍巾', '夏日冒險', '星空之夜', '音樂時刻', '賽車場',
  '海底探險', '雲端飛行', '魔法時光', '森林奇遇', '城市夜景', '櫻花季',
  '聖誕驚喜', '生日蛋糕', '超能力', '科學實驗', '廚房大師', '賽道冠軍',
  '友情合照', '畢業典禮', '露營篝火', '雨中漫步', '彩虹橋', '煙花秀',
  '月光漫步', '晨曦曙光', '黃昏剪影', '雪地足跡', '花海漫步',
  '書店角落', '咖啡香氣', '郵輪旅行', '熱氣球', '城堡探險',
  '沙漠綠洲', '極光之夜', '海盜船', '太空漫步', '機器人舞',
  '搖滾演唱', '芭蕾舞', '足球賽', '籃球場', '網球拍',
  '畫家工作室', '攝影棚', '電影首映', '頒獎典禮', '幕後花絮'
];

const PIXAR_CHARACTERS = [
  '胡迪', '巴斯光年', '翠絲', '抱抱龍', '三眼仔', '叉奇', '草莓熊',
  '尼莫', '馬林', '多莉', '龜爺爺', '章魚漢克', '鯊魚布魯斯',
  '樂樂', '憂憂', '怒怒', '厭厭', '驚驚', '焦焦',
  '毛怪', '大眼仔', '阿布', '蘭道夫',
  '米格', '埃克托', '但丁', '可可',
  '瓦力', '伊娃', '船長', '小蟑螂',
  '閃電麥昆', '拖線', '莎莉', '博士',
  '小米', '大廚', '柯米', '甜姐',
  '超能先生', '彈弓女', '小傑', '小倩', '小迪', '冰凍俠',
  '卡爾', '羅素', '道格', '凯文',
  '梅莉達', '路卡', '艾伯托', '米拉貝'
];

const RARITY_SLOTS = [
  ...Array(3).fill('ssr'),
  ...Array(10).fill('ur'),
  ...Array(12).fill('sr'),
  ...Array(25).fill('rare'),
  ...Array(50).fill('common')
];

function buildUniqueDeck(characters, variants, idPrefix) {
  if (characters.length * 2 !== 100) {
    throw new Error(`Need 50 characters for 100 cards, got ${characters.length}`);
  }
  if (variants.length < 100) {
    throw new Error(`Need 100 unique variants, got ${variants.length}`);
  }

  const cards = [];
  let vIdx = 0;
  for (const char of characters) {
    for (let n = 0; n < 2; n++) {
      const variant = variants[vIdx++];
      const rarity = RARITY_SLOTS[cards.length];
      const tierLabel = { ssr: '傳說', ur: '極稀有', sr: '超稀有', rare: '稀有', common: '普通' }[rarity];
      cards.push({
        char,
        variant,
        name: `${char}·${variant}`,
        rarity,
        artNum: cards.length + 1,
        desc: `${tierLabel} · ${char} ${variant}`
      });
    }
  }
  return cards;
}

function validateDeck(cards) {
  const charCount = {};
  const names = new Set();
  for (const c of cards) {
    charCount[c.char] = (charCount[c.char] || 0) + 1;
    if (charCount[c.char] > 2) throw new Error(`Character ${c.char} appears more than twice`);
    if (names.has(c.name)) throw new Error(`Duplicate card name: ${c.name}`);
    names.add(c.name);
  }
}

module.exports = {
  SANRIO_CHARACTERS,
  SANRIO_VARIANTS,
  PIXAR_CHARACTERS,
  PIXAR_VARIANTS,
  buildUniqueDeck,
  validateDeck
};
