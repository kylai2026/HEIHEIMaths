const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'js/cinnamoroll-deck.js'), 'utf8');
const deck = new Function(`${code}\nreturn CINNAMOROLL_DECK;`)();

let ok = true;
const urls = deck.map(c => c.img);
const unique = new Set(urls);

console.log('cards:', deck.length);
console.log('unique images:', unique.size);

if (unique.size !== deck.length) {
  ok = false;
  const seen = new Map();
  deck.forEach(c => {
    if (seen.has(c.img)) {
      console.error('DUPLICATE:', c.img, '←', seen.get(c.img), '&', c.name);
    }
    seen.set(c.img, c.name);
  });
}

const missing = [];
deck.forEach(c => {
  const rel = c.img.replace(/^\//, '').split('?')[0];
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    missing.push({ name: c.name, img: c.img });
  }
});

if (missing.length) {
  ok = false;
  console.error('Missing image files:', missing.length);
  missing.forEach(m => console.error(' -', m.name, '→', m.img));
} else {
  console.log('All image files exist OK');
}

const r = {};
deck.forEach(c => { r[c.rarity] = (r[c.rarity] || 0) + 1; });
console.log('rarity counts:', r);

process.exit(ok ? 0 : 1);
