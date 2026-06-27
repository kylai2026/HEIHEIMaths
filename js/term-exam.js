/** 學期大考：仿照小四下學期大考卷格式，限時 1 小時 */
const TermExam = {
  DURATION_SEC: 3600,

  TOPIC_GROUPS: {
    P1: {
      calc: ['p1-numbers20', 'p1-decompose', 'p1-add', 'p1-sub', 'p1-numbers100', 'p1-addsub-2d'],
      space: ['p1-position', 'p1-length', 'p1-shapes'],
      life: ['p1-time', 'p1-money']
    },
    P2: {
      calc: ['p2-hundreds', 'p2-add', 'p2-sub', 'p2-multiply', 'p2-thousands', 'p2-mixed', 'p2-divide'],
      space: ['p2-angles', 'p2-direction', 'p2-money'],
      life: ['p2-time']
    },
    P3: {
      calc: ['p3-five-digit', 'p3-multiply', 'p3-divide', 'p3-mixed-addsub', 'p3-mixed-mul', 'p3-frac-basic'],
      measure: ['p3-length', 'p3-capacity'],
      space: ['p3-triangle', 'p3-quad'],
      data: ['p3-barchart']
    },
    P4: {
      calc: ['exam-calc', 'exam-frac', 'p4-multiply', 'p4-mixed-ops', 'p4-factor', 'p4-frac-types', 'p4-frac-addsub', 'p4-decimal'],
      word: ['exam-word', 'exam-word-logic', 'exam-frac-word', 'p4-word-money', 'p4-word-logic', 'p4-word-frac'],
      measure: ['exam-measure', 'exam-perimeter', 'p4-area'],
      space: ['exam-space', 'p4-direction'],
      data: ['exam-data']
    },
    P5: {
      calc: ['p5-multidigit', 'p5-frac-cmp', 'p5-frac-addsub', 'p5-frac-mul', 'p5-frac-div', 'p5-decimal-mul', 'p5-algebra'],
      measure: ['p5-tri-area', 'p5-quad-area', 'p5-circle', 'p5-volume'],
      space: ['p5-circle']
    },
    P6: {
      calc: ['p6-decimal-div', 'p6-decimal-mixed', 'p6-frac-decimal', 'p6-average', 'p6-percent', 'p6-percent-app'],
      measure: ['p6-circumference', 'p6-circle-area', 'p6-angles-deg', 'p6-speed'],
      data: ['p6-pie-chart']
    }
  },

  GRADE_CONFIG: {
    P1: {
      title: '小一學期數學大考',
      sections: [
        { id: 'num', title: '一、數與計算', percent: 60, parts: [{ count: 12, style: 'short', group: 'calc' }] },
        { id: 'space', title: '二、圖形與空間', percent: 25, parts: [{ count: 5, style: 'short', group: 'space' }] },
        { id: 'life', title: '三、生活數學', percent: 15, parts: [{ count: 3, style: 'short', group: 'life' }] }
      ]
    },
    P2: {
      title: '小二學期數學大考',
      sections: [
        { id: 'num', title: '一、數與計算', percent: 62, parts: [{ count: 16, style: 'short', group: 'calc', mcqCount: 1 }] },
        { id: 'space', title: '二、圖形與空間', percent: 23, parts: [{ count: 6, style: 'short', group: 'space' }] },
        { id: 'life', title: '三、時間與數據', percent: 15, parts: [{ count: 4, style: 'short', group: 'life' }] }
      ]
    },
    P3: {
      title: '小三學期數學大考',
      sections: [
        { id: 'num', title: '一、數與計算', percent: 55, parts: [{ count: 18, style: 'short', group: 'calc', mcqCount: 1 }] },
        { id: 'measure', title: '二、度量', percent: 15, parts: [{ count: 5, style: 'short', group: 'measure' }] },
        { id: 'space', title: '三、圖形與空間', percent: 18, parts: [{ count: 6, style: 'short', group: 'space' }] },
        { id: 'data', title: '四、數據處理', percent: 12, parts: [{ count: 4, style: 'short', group: 'data' }] }
      ]
    },
    P4: {
      title: '小四下學期數學大考',
      sections: [
        {
          id: 'num',
          title: '一、數',
          percent: 64,
          note: '如答案是分數，須約至最簡',
          parts: [
            { label: '44%@2%', count: 12, style: 'short', group: 'calc', mcqCount: 1, tierBias: { easy: 0.22, medium: 0.56, hard: 0.22 } },
            { label: '20%@2%', count: 10, style: 'short', group: 'word', tierBias: { easy: 0.15, medium: 0.55, hard: 0.3 } },
            { label: '16%@4%', count: 5, style: 'long', group: 'word', tierBias: { easy: 0.08, medium: 0.42, hard: 0.5 } }
          ]
        },
        {
          id: 'measure',
          title: '二、度量',
          percent: 14,
          parts: [{ count: 7, style: 'short', group: 'measure', tierBias: { easy: 0.1, medium: 0.5, hard: 0.4 } }]
        },
        {
          id: 'space',
          title: '三、圖形與空間',
          percent: 12,
          note: '12%@2%（每題全對才給分）',
          parts: [
            { count: 4, style: 'short', group: 'space' },
            { count: 1, style: 'mcq', group: 'space', mcqCount: 1 }
          ]
        },
        {
          id: 'data',
          title: '四、數據處理',
          percent: 10,
          note: '10%@2%（每題全對才給分）',
          parts: [{ count: 5, style: 'short', group: 'data' }]
        }
      ]
    },
    P5: {
      title: '小五學期數學大考',
      sections: [
        { id: 'num', title: '一、數與計算', percent: 58, note: '如答案是分數，須約至最簡', parts: [
          { count: 20, style: 'short', group: 'calc', mcqCount: 1, tierBias: { easy: 0.1, medium: 0.45, hard: 0.45 } },
          { count: 6, style: 'long', group: 'calc', tierBias: { easy: 0.05, medium: 0.35, hard: 0.6 } }
        ]},
        { id: 'measure', title: '二、圖形與度量', percent: 42, parts: [
          { count: 14, style: 'short', group: 'measure', mcqCount: 1 },
          { count: 2, style: 'long', group: 'measure' }
        ]}
      ]
    },
    P6: {
      title: '小六學期數學大考',
      sections: [
        { id: 'num', title: '一、數與計算', percent: 55, note: '如答案是分數或百分數，須約至最簡', parts: [
          { count: 22, style: 'short', group: 'calc', mcqCount: 1, tierBias: { easy: 0.08, medium: 0.42, hard: 0.5 } },
          { count: 5, style: 'long', group: 'calc', tierBias: { easy: 0.05, medium: 0.35, hard: 0.6 } }
        ]},
        { id: 'measure', title: '二、圖形、速率與數據', percent: 45, parts: [
          { count: 14, style: 'short', group: 'measure' },
          { count: 4, style: 'short', group: 'data' },
          { count: 1, style: 'mcq', group: 'measure', mcqCount: 1 }
        ]}
      ]
    }
  },

  getConfig(grade) {
    return this.GRADE_CONFIG[grade] || null;
  },

  getTopicIds(grade, group) {
    const map = this.TOPIC_GROUPS[grade];
    if (map && map[group]?.length) return map[group];
    return getExamTopicsByGrade(grade);
  },

  pickTier(bias) {
    const weights = bias || { easy: 0.33, medium: 0.34, hard: 0.33 };
    const r = Math.random();
    let acc = 0;
    for (const [tier, weight] of Object.entries(weights)) {
      acc += weight;
      if (r < acc) return tier;
    }
    return 'medium';
  },

  drawUniqueQuestion(topicIds, opts = {}) {
    QuestionPool.init();
    const used = opts.usedKeys || new Set();
    const tierBias = opts.tierBias;
    const topicOrder = MathUtils.shuffle([...topicIds]);

    for (const topicId of topicOrder) {
      for (let attempt = 0; attempt < 35; attempt++) {
        const tier = this.pickTier(tierBias);
        const candidate = { ...QuestionPool.draw(topicId, tier), topicId };
        if (!used.has(candidate.poolKey)) {
          used.add(candidate.poolKey);
          return candidate;
        }
      }
    }

    for (let attempt = 0; attempt < 50; attempt++) {
      const topicId = MathUtils.randomChoice(topicIds);
      const tier = this.pickTier(tierBias);
      const candidate = { ...QuestionPool.draw(topicId, tier), topicId };
      if (!used.has(candidate.poolKey)) {
        used.add(candidate.poolKey);
        return candidate;
      }
    }

    const topicId = MathUtils.randomChoice(topicIds);
    const tier = this.pickTier(tierBias);
    const fallback = { ...QuestionPool.draw(topicId, tier), topicId };
    used.add(fallback.poolKey);
    return fallback;
  },

  drawPartQuestions(count, topicIds, opts = {}) {
    const mcqCount = opts.mcqCount || 0;
    const forceMcq = opts.forceMcq || false;
    const raw = [];

    for (let i = 0; i < count; i++) {
      raw.push(this.drawUniqueQuestion(topicIds, opts));
    }

    const shuffled = MathUtils.shuffle(raw);
    const mcqNeeded = forceMcq ? shuffled.length : mcqCount;
    const mcqSlots = new Set();

    if (mcqNeeded > 0) {
      const indices = MathUtils.shuffle(shuffled.map((_, i) => i));
      for (const idx of indices) {
        if (mcqSlots.size >= mcqNeeded) break;
        const converted = QuestionEngine.toMCQ(shuffled[idx], shuffled[idx].topicId);
        if (converted.type === 'mcq' && converted.options?.length) {
          shuffled[idx] = converted;
          mcqSlots.add(idx);
        }
      }
      if (mcqSlots.size < mcqNeeded) {
        for (let pass = 0; pass < 3 && mcqSlots.size < mcqNeeded; pass++) {
          for (let i = 0; i < shuffled.length && mcqSlots.size < mcqNeeded; i++) {
            if (mcqSlots.has(i)) continue;
            const replacement = this.drawUniqueQuestion(topicIds, opts);
            const converted = QuestionEngine.toMCQ(replacement, replacement.topicId);
            if (converted.type === 'mcq' && converted.options?.length) {
              shuffled[i] = converted;
              mcqSlots.add(i);
            }
          }
        }
      }
    }

    return shuffled.map((q, i) => {
      if (mcqSlots.has(i)) return q;
      return { ...q, type: q.type === 'mcq' ? 'mcq' : (q.type || 'input') };
    });
  },

  generatePaper(grade) {
    const config = this.getConfig(grade);
    if (!config) return null;

    const usedKeys = new Set();
    const sections = [];
    let examNum = 1;

    config.sections.forEach(sec => {
      const section = {
        id: sec.id,
        title: sec.title,
        percent: sec.percent,
        note: sec.note || '',
        parts: [],
        questions: []
      };

      (sec.parts || []).forEach(part => {
        const topicIds = this.getTopicIds(grade, part.group);
        const style = part.style === 'mcq' ? 'short' : (part.style || 'short');
        const qs = this.drawPartQuestions(part.count, topicIds, {
          usedKeys,
          tierBias: part.tierBias,
          mcqCount: part.mcqCount || 0,
          forceMcq: part.style === 'mcq'
        }).map(q => ({
          ...q,
          examNum: examNum++,
          sectionId: sec.id,
          sectionTitle: sec.title,
          partLabel: part.label || '',
          style: part.style || style,
          topicName: TOPICS.find(t => t.id === q.topicId)?.name || ''
        }));

        section.parts.push({ label: part.label || '', count: part.count, style: part.style });
        section.questions.push(...qs);
      });

      sections.push(section);
    });

    const questions = sections.flatMap(s => s.questions);
    return {
      grade,
      title: config.title,
      durationSec: this.DURATION_SEC,
      sections,
      questions,
      totalQuestions: questions.length
    };
  },

  formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  },

  scopeTableHtml(sections) {
    const rows = sections.map(s => {
      const partCounts = (s.parts || []).map(p => `${p.count || 0} 題`).join('、');
      const total = (s.parts || []).reduce((n, p) => n + (p.count || 0), 0)
        || (s.questions?.length ?? 0);
      const countCell = partCounts || (total ? `${total} 題` : '—');
      return `
      <tr>
        <td>${s.title}</td>
        <td>${countCell}</td>
        <td>${s.percent}%</td>
      </tr>`;
    }).join('');
    return `
      <table class="exam-scope-table">
        <thead><tr><th>範疇</th><th>題數</th><th>百分比</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  },

  gradeAnswer(q, userAnswer) {
    if (q.type === 'mcq' && q.options) {
      const letter = String(userAnswer || '').trim().toUpperCase();
      const idx = letter.charCodeAt(0) - 65;
      if (idx >= 0 && idx < q.options.length) {
        return idx === q.correctIndex;
      }
      const num = parseInt(userAnswer, 10);
      if (!Number.isNaN(num)) return num === q.correctIndex;
      return false;
    }
    return MathUtils.answersEqual(String(userAnswer || '').trim(), q.answer);
  },

  scorePaper(paper, answers) {
    let correct = 0;
    const sectionScores = {};
    const results = paper.questions.map(q => {
      const userAnswer = answers[q.examNum] ?? '';
      const ok = userAnswer !== '' && this.gradeAnswer(q, userAnswer);
      if (ok) correct++;
      if (!sectionScores[q.sectionId]) {
        sectionScores[q.sectionId] = { correct: 0, total: 0, title: q.sectionTitle };
      }
      sectionScores[q.sectionId].total++;
      if (ok) sectionScores[q.sectionId].correct++;
      return { ...q, userAnswer, correct: ok };
    });
    const total = paper.questions.length;
    return {
      correct,
      total,
      percentage: total ? Math.round((correct / total) * 100) : 0,
      sectionScores,
      results
    };
  }
};
