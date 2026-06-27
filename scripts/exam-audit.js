/**
 * 學期大考全面審計：生成、評分、MCQ、可答性
 * 用法：node scripts/exam-audit.js
 */
const fs = require('fs');
const vm = require('vm');

const root = require('path').join(__dirname, '..');
const load = (rel) => {
  vm.runInThisContext(fs.readFileSync(require('path').join(root, rel), 'utf8'), {
    filename: rel
  });
};

global.window = global;
global.document = { getElementById: () => null };

load('js/topics-config.js');
load('js/utils.js');
load('js/scoring.js');
load('js/question-visuals.js');
load('js/p34-questions.js');
load('js/p12-questions.js');
load('js/p56-questions.js');
load('js/exam-questions.js');
load('js/question-engine.js');
load('js/question-pool.js');
load('js/term-exam.js');

const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const issues = [];
const RUNS = 5;

function testGradable(q, ctx) {
  const loc = `${ctx.grade} Q${q.examNum} [${q.topicId}]`;
  const isMcq = q.type === 'mcq' && Array.isArray(q.options);

  if (isMcq) {
    if (q.correctIndex == null || q.correctIndex < 0) {
      issues.push(`${loc}: MCQ 缺少 correctIndex`);
      return;
    }
    if (!q.options[q.correctIndex]) {
      issues.push(`${loc}: MCQ correctIndex 越界 (${q.correctIndex}/${q.options.length})`);
      return;
    }
    const correctOpt = q.options[q.correctIndex];
    if (new Set(q.options).size !== q.options.length) {
      issues.push(`${loc}: MCQ 選項有重複`);
    }
    const letter = String.fromCharCode(65 + q.correctIndex);
    if (!TermExam.gradeAnswer(q, letter)) {
      issues.push(`${loc}: MCQ 字母評分失敗 (${letter})`);
    }
    if (!TermExam.gradeAnswer(q, String(q.correctIndex))) {
      issues.push(`${loc}: MCQ 數字索引評分失敗 (${q.correctIndex})`);
    }
    if (q.answerDisplay && q.answerDisplay !== correctOpt) {
      issues.push(`${loc}: answerDisplay 與正確選項不一致 (${q.answerDisplay} vs ${correctOpt})`);
    }
    return;
  }

  if (!q.answer) {
    issues.push(`${loc}: 缺少 answer 物件`);
    return;
  }

  const display = q.answerDisplay;
  if (!display && q.answer.type !== 'text') {
    issues.push(`${loc}: 缺少 answerDisplay`);
    return;
  }

  if (!TermExam.gradeAnswer(q, display)) {
    issues.push(`${loc}: answerDisplay 評分失敗 (${display}, type=${q.answer.type})`);
  }

  if (q.answer.type === 'fraction' && q.answer.num != null) {
    const alt = MathUtils.fractionToString(q.answer.num, q.answer.den);
    if (alt !== display && !TermExam.gradeAnswer(q, alt)) {
      issues.push(`${loc}: 分數替代格式評分失敗 (${alt})`);
    }
  }

  if (q.answer.type === 'decimal' && typeof q.answer.value === 'number') {
    const alt = String(q.answer.value);
    if (alt !== display && !TermExam.gradeAnswer(q, alt)) {
      issues.push(`${loc}: 小數替代格式評分失敗 (${alt})`);
    }
  }

  if (q.answer.type === 'text' && q.answer.value) {
    if (!TermExam.gradeAnswer(q, q.answer.value)) {
      issues.push(`${loc}: 文字答案評分失敗 (${q.answer.value})`);
    }
  }
}

function auditPaper(grade, run) {
  const paper = TermExam.generatePaper(grade);
  if (!paper) {
    issues.push(`${grade} run${run}: 無法生成試卷`);
    return null;
  }

  const keys = new Set();
  let dupes = 0;
  let emptyQuestion = 0;
  let ungradable = 0;

  paper.questions.forEach(q => {
    if (!q.question || String(q.question).trim().length < 2) emptyQuestion++;
    testGradable(q, { grade, run });

    const key = q.poolKey || `${q.topicId}|${q.question}`;
    if (keys.has(key)) dupes++;
    keys.add(key);

    const isMcq = q.type === 'mcq' && q.options?.length;
    const canGrade = isMcq
      ? TermExam.gradeAnswer(q, String.fromCharCode(65 + q.correctIndex))
      : TermExam.gradeAnswer(q, q.answerDisplay || q.answer?.value || '');
    if (!canGrade) ungradable++;
  });

  if (emptyQuestion) issues.push(`${grade} run${run}: ${emptyQuestion} 題缺少題目文字`);
  if (ungradable) issues.push(`${grade} run${run}: ${ungradable} 題無法用標準答案評分`);
  if (dupes > 3) issues.push(`${grade} run${run}: 重複題目 ${dupes} 組`);

  return paper;
}

console.log('=== 學期大考全面審計 ===\n');
GRADES.forEach(g => {
  for (let r = 0; r < RUNS; r++) auditPaper(g, r + 1);
  const sample = TermExam.generatePaper(g);
  const mcq = sample?.questions.filter(q => q.type === 'mcq' && q.options).length || 0;
  const input = (sample?.totalQuestions || 0) - mcq;
  console.log(`${g}: ${sample?.totalQuestions} 題（短答 ${input} · MCQ ${mcq}）`);
});

if (issues.length) {
  console.log(`\n❌ 發現 ${issues.length} 個問題：`);
  issues.slice(0, 40).forEach(i => console.log(' -', i));
  if (issues.length > 40) console.log(` ... 另有 ${issues.length - 40} 個`);
  process.exit(1);
}
console.log('\n✅ 全部試卷可正常作答及評分');
