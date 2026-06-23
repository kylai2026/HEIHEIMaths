/**
 * Generate unique Cinnamoroll-style card art from deck metadata.
 * Run: node scripts/generate-cinna-svgs.js
 */
const fs = require('fs');
const path = require('path');
const { buildCardSvg } = require('./cinna-art-lib');

const OUT = path.join(__dirname, '../assets/img/cinnamoroll/cards');
const deckCode = fs.readFileSync(path.join(__dirname, '../js/cinnamoroll-deck.js'), 'utf8');
const deck = new Function(`${deckCode}\nreturn CINNAMOROLL_DECK;`)();

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let generated = 0;
for (let i = 0; i < deck.length; i++) {
  const card = deck[i];
  const m = card.img.match(/art-(\d+)\.svg/);
  if (!m) continue;
  const idx = parseInt(m[1], 10);
  const svg = buildCardSvg(idx, card.name, card.rarity);
  fs.writeFileSync(path.join(OUT, `art-${String(idx).padStart(3, '0')}.svg`), svg.trim());
  generated++;
}

console.log(`Generated ${generated} unique card SVGs from deck names & rarities.`);
