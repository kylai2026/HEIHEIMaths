const fs = require('fs');
const path = require('path');
const { validateUniqueDeck } = require('./deck-rosters');

for (const file of ['disney-deck.js', 'marvel-deck.js']) {
  const code = fs.readFileSync(path.join(__dirname, '../js', file), 'utf8');
  const names = [...code.matchAll(/name: '([^']+)'/g)].map(m => m[1]);
  const images = [...code.matchAll(/imageUrl: '([^']+)'/g)].map(m => m[1]);
  const cards = names.map((name, i) => ({
    name,
    char: name.split('·')[0],
    imageUrl: images[i]
  }));
  validateUniqueDeck(cards);
  console.log(`${file}: ${cards.length} cards, ${new Set(names).size} unique names, ${new Set(images).size} unique images, ${new Set(cards.map(c => c.char)).size} unique chars`);
}
