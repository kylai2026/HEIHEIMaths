const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(require('path').join(__dirname, '../js/cinnamoroll-deck.js'), 'utf8');
const ctx = {};
vm.runInNewContext(code, ctx);
const deck = ctx.CINNAMOROLL_DECK;
const urls = deck.map(c => c.img);
const unique = new Set(urls);
console.log('cards:', deck.length);
console.log('unique images:', unique.size);
if (unique.size !== deck.length) {
  const seen = new Set();
  deck.forEach(c => {
    if (seen.has(c.img)) console.log('DUPLICATE:', c.img, c.name);
    seen.add(c.img);
  });
} else {
  console.log('All images unique OK');
}
const r = {};
deck.forEach(c => { r[c.rarity] = (r[c.rarity] || 0) + 1; });
console.log('rarity counts:', r);
