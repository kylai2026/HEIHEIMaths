const fs = require('fs');
const path = require('path');
const { buildCardSvg } = require('./pixar-art-lib');

const OUT = path.join(__dirname, '../assets/img/pixar/cards');
const deckCode = fs.readFileSync(path.join(__dirname, '../js/pixar-deck.js'), 'utf8');
const deck = new Function(`${deckCode}\nreturn PIXAR_DECK;`)();

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let n = 0;
for (const card of deck) {
  const m = card.img.match(/art-(\d+)\.svg/);
  if (!m) continue;
  const idx = parseInt(m[1], 10);
  fs.writeFileSync(path.join(OUT, `art-${String(idx).padStart(3, '0')}.svg`), buildCardSvg(idx, card.name, card.rarity).trim());
  n++;
}
console.log(`Generated ${n} PIXAR card SVGs.`);
