/* Quick pool smoke test - run in browser console or node with vm */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const files = [
  'utils.js', 'scoring.js', 'topics-config.js', 'p34-questions.js', 'p12-questions.js',
  'p56-questions.js', 'question-engine.js', 'question-pool.js'
];

const ctx = { console, Math, Set, Array, Object, String, Number, parseInt, parseFloat };
vm.createContext(ctx);
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', f), 'utf8'), ctx);
}

const samples = ['p1-add', 'p2-multiply', 'p3-five-digit', 'p5-frac-mul', 'p6-percent'];
ctx.QuestionPool.init();
for (const id of samples) {
  const n = ctx.QuestionPool.getPoolSize(id);
  console.log(id, n, n >= 50 ? 'OK' : 'LOW');
}
console.log('Total topics:', ctx.TOPICS.length);
console.log('Total questions:', ctx.QuestionPool.getTotalSize());
