const QuestionBank = {
  init() {
    QuestionPool.init();
  },

  generate(topicId, tier = 'medium') {
    return QuestionPool.draw(topicId, tier);
  },

  generateMCQ(topicId, tier = 'medium') {
    QuestionPool.init();
    const q = QuestionPool.draw(topicId, tier);
    return QuestionEngine.toMCQ(q, topicId);
  },

  generateQuiz(count = 20, grade) {
    QuestionPool.init();
    return QuestionPool.drawQuizMCQ(count, grade);
  },

  generateRandomSet(count, tier, topicIds) {
    QuestionPool.init();
    return QuestionPool.drawMixed(count, tier, topicIds);
  },

  generateSet(topicId, count, tier) {
    QuestionPool.init();
    return QuestionPool.drawSet(topicId, count, tier);
  },

  generateDaily(count = 10, grade) {
    const topics = grade
      ? getExamTopicsByGrade(grade)
      : TOPICS.filter(t => t.exam).map(t => t.id);
    return this.generateRandomSet(count, null, topics);
  },

  generateDailyWithTier(count, tier, grade) {
    const topics = grade
      ? getExamTopicsByGrade(grade)
      : TOPICS.filter(t => t.exam).map(t => t.id);
    return this.generateRandomSet(count, tier, topics);
  },

  generateTermExam(grade) {
    return typeof TermExam !== 'undefined' ? TermExam.generatePaper(grade) : null;
  },

  getPoolStats() {
    QuestionPool.init();
    return TOPICS.map(t => ({
      id: t.id,
      name: t.name,
      count: QuestionPool.getPoolSize(t.id)
    }));
  }
};
