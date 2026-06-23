/* 按課題 ID 路由到對應年級題庫 */
const QuestionEngine = {
  forTopic(topicId) {
    if (/^p[12]-/.test(topicId)) return P12Questions;
    if (/^p[56]-/.test(topicId)) return P56Questions;
    return P34Questions;
  },

  generateRaw(topicId, tier) {
    return this.forTopic(topicId).generateRaw(topicId, tier);
  },

  toMCQ(q, topicId) {
    return P34Questions.toMCQ(q, topicId);
  }
};
