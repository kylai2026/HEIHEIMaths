/* SANRIO 卡池：50 張角色卡（用戶提供插圖） */
const SANRIO_ART_VER = 12;
const SANRIO_IMG = {
  card: (n) => `assets/img/sanrio/cards/card-${String(n).padStart(3, '0')}.png?v=${SANRIO_ART_VER}`
};

const SANRIO_DECK = [
  { name: '肉桂狗·雨天版', rarity: 'ur', img: SANRIO_IMG.card(1), desc: '極稀有 · 肉桂狗 雨天版' },
  { name: '美樂蒂·冬日版', rarity: 'sr', img: SANRIO_IMG.card(2), desc: '超稀有 · 美樂蒂 冬日版' },
  { name: '布丁狗·夏威夷版', rarity: 'sr', img: SANRIO_IMG.card(3), desc: '超稀有 · 布丁狗 夏威夷版' },
  { name: '肉桂狗·星空之夜', rarity: 'ssr', img: SANRIO_IMG.card(4), desc: '傳說 · 肉桂狗 星空之夜' },
  { name: '大眼蛙·飛行員', rarity: 'rare', img: SANRIO_IMG.card(5), desc: '稀有 · 大眼蛙 飛行員' },
  { name: '肉桂狗·秋收版', rarity: 'rare', img: SANRIO_IMG.card(6), desc: '稀有 · 肉桂狗 秋收版' },
  { name: 'Hello Kitty·櫻花和服', rarity: 'ssr', img: SANRIO_IMG.card(7), desc: '傳說 · Hello Kitty 櫻花和服' },
  { name: '肉桂狗·烘焙大師', rarity: 'ur', img: SANRIO_IMG.card(8), desc: '極稀有 · 肉桂狗 烘焙大師' },
  { name: '酷企鵝·魔法師', rarity: 'sr', img: SANRIO_IMG.card(9), desc: '超稀有 · 酷企鵝 魔法師' },
  { name: '肉桂狗·彩虹雲王子', rarity: 'ur', img: SANRIO_IMG.card(10), desc: '極稀有 · 肉桂狗 彩虹雲王子' },

  { name: '肉桂狗·甜點師傅', rarity: 'ur', img: SANRIO_IMG.card(11), desc: '極稀有 · 肉桂狗 甜點師傅' },
  { name: 'Hello Kitty·魔法少女', rarity: 'sr', img: SANRIO_IMG.card(12), desc: '超稀有 · Hello Kitty 魔法少女' },
  { name: '布丁狗·布丁畫家', rarity: 'rare', img: SANRIO_IMG.card(13), desc: '稀有 · 布丁狗 布丁畫家' },
  { name: '美樂蒂·秘密森林', rarity: 'ur', img: SANRIO_IMG.card(14), desc: '極稀有 · 美樂蒂 秘密森林' },
  { name: '大眼蛙·蓮池道士', rarity: 'rare', img: SANRIO_IMG.card(15), desc: '稀有 · 大眼蛙 蓮池道士' },
  { name: '肉桂狗·星空探險家', rarity: 'sr', img: SANRIO_IMG.card(16), desc: '超稀有 · 肉桂狗 星空探險家' },
  { name: 'Hello Kitty·宇宙流行', rarity: 'ssr', img: SANRIO_IMG.card(17), desc: '傳說 · Hello Kitty 宇宙流行' },
  { name: '布丁狗·莓果冒險', rarity: 'common', img: SANRIO_IMG.card(18), desc: '普通 · 布丁狗 莓果冒險' },
  { name: '美樂蒂·午夜哥特', rarity: 'sr', img: SANRIO_IMG.card(19), desc: '超稀有 · 美樂蒂 午夜哥特' },
  { name: '大眼蛙·雨天偵探', rarity: 'common', img: SANRIO_IMG.card(20), desc: '普通 · 大眼蛙 雨天偵探' },

  { name: 'Hello Kitty·繽紛氣球', rarity: 'ur', img: SANRIO_IMG.card(21), desc: '極稀有 · Hello Kitty 繽紛氣球' },
  { name: '美樂蒂·櫻花野餐', rarity: 'sr', img: SANRIO_IMG.card(22), desc: '超稀有 · 美樂蒂 櫻花野餐' },
  { name: '布丁狗·焦糖布丁山', rarity: 'ur', img: SANRIO_IMG.card(23), desc: '極稀有 · 布丁狗 焦糖布丁山' },
  { name: '雙星仙子·粉色流星', rarity: 'ssr', img: SANRIO_IMG.card(24), desc: '傳說 · 雙星仙子 粉色流星' },
  { name: '大眼蛙·荷葉池塘', rarity: 'rare', img: SANRIO_IMG.card(25), desc: '稀有 · 大眼蛙 荷葉池塘' },
  { name: '肉桂狗·藍天飛行', rarity: 'sr', img: SANRIO_IMG.card(26), desc: '超稀有 · 肉桂狗 藍天飛行' },
  { name: '肉桂狗·杯子蛋糕', rarity: 'rare', img: SANRIO_IMG.card(27), desc: '稀有 · 肉桂狗 杯子蛋糕' },
  { name: '肉桂狗·好朋友', rarity: 'common', img: SANRIO_IMG.card(28), desc: '普通 · 肉桂狗 好朋友' },
  { name: '肉桂狗·麵包烘焙', rarity: 'rare', img: SANRIO_IMG.card(29), desc: '稀有 · 肉桂狗 麵包烘焙' },
  { name: '肉桂狗·星空午睡', rarity: 'common', img: SANRIO_IMG.card(30), desc: '普通 · 肉桂狗 星空午睡' },

  { name: 'Hello Kitty·蘋果甜心', rarity: 'ur', img: SANRIO_IMG.card(31), desc: '極稀有 · Hello Kitty 蘋果甜心' },
  { name: '美樂蒂·櫻花樹下', rarity: 'sr', img: SANRIO_IMG.card(32), desc: '超稀有 · 美樂蒂 櫻花樹下' },
  { name: '布丁狗·布丁大亨', rarity: 'rare', img: SANRIO_IMG.card(33), desc: '稀有 · 布丁狗 布丁大亨' },
  { name: '肉桂狗·繽紛氣球', rarity: 'rare', img: SANRIO_IMG.card(34), desc: '稀有 · 肉桂狗 繽紛氣球' },
  { name: '庫洛米·骷髏魔女', rarity: 'ssr', img: SANRIO_IMG.card(35), desc: '傳說 · 庫洛米 骷髏魔女' },
  { name: '大眼蛙·細雨荷塘', rarity: 'common', img: SANRIO_IMG.card(36), desc: '普通 · 大眼蛙 細雨荷塘' },
  { name: '酷企鵝·閃電少年', rarity: 'rare', img: SANRIO_IMG.card(37), desc: '稀有 · 酷企鵝 閃電少年' },
  { name: '燕尾服山姆·航海雪糕', rarity: 'common', img: SANRIO_IMG.card(38), desc: '普通 · 燕尾服山姆 航海雪糕' },
  { name: '半魚人·泡泡海洋', rarity: 'common', img: SANRIO_IMG.card(39), desc: '普通 · 半魚人 泡泡海洋' },
  { name: '帕恰狗·足球熱血', rarity: 'rare', img: SANRIO_IMG.card(40), desc: '稀有 · 帕恰狗 足球熱血' },

  { name: 'Hello Kitty·春日櫻花', rarity: 'ur', img: SANRIO_IMG.card(41), desc: '極稀有 · Hello Kitty 春日櫻花' },
  { name: '美樂蒂·雪地木屋', rarity: 'sr', img: SANRIO_IMG.card(42), desc: '超稀有 · 美樂蒂 雪地木屋' },
  { name: '布丁狗·沙灘假期', rarity: 'rare', img: SANRIO_IMG.card(43), desc: '稀有 · 布丁狗 沙灘假期' },
  { name: '肉桂狗·秋季暖暖', rarity: 'common', img: SANRIO_IMG.card(44), desc: '普通 · 肉桂狗 秋季暖暖' },
  { name: '庫洛米·魔女之夜', rarity: 'ssr', img: SANRIO_IMG.card(45), desc: '傳說 · 庫洛米 魔女之夜' },
  { name: '雙星仙子·宇宙雙子', rarity: 'ur', img: SANRIO_IMG.card(46), desc: '極稀有 · 雙星仙子 宇宙雙子' },
  { name: '燕尾服山姆·雨天漫步', rarity: 'common', img: SANRIO_IMG.card(47), desc: '普通 · 燕尾服山姆 雨天漫步' },
  { name: '帕恰狗·烘焙麵包', rarity: 'rare', img: SANRIO_IMG.card(48), desc: '稀有 · 帕恰狗 烘焙麵包' },
  { name: '酷企鵝·搖滾舞台', rarity: 'sr', img: SANRIO_IMG.card(49), desc: '超稀有 · 酷企鵝 搖滾舞台' },
  { name: '大眼蛙·偵探之夜', rarity: 'common', img: SANRIO_IMG.card(50), desc: '普通 · 大眼蛙 偵探之夜' }
];
