/** AI 課題／積分／禮物圖示映射 */
const TopicArt = {
  BASE: 'assets/img/art',

  TIER: {
    easy: 'tier-easy-ai.png',
    medium: 'tier-medium-ai.png',
    hard: 'tier-hard-ai.png'
  },

  GIFT: {
    'gift-small': 'gift-small-ai.png',
    'gift-medium': 'gift-medium-ai.png',
    'gift-big': 'gift-big-ai.png'
  },

  ICON: {
    '🧭': 'topic-compass-ai.png',
    '🔢': 'topic-numbers-ai.png',
    '🧩': 'topic-puzzle-ai.png',
    '📏': 'topic-ruler-ai.png',
    '➕': 'topic-add-ai.png',
    '➖': 'topic-sub-ai.png',
    '💯': 'topic-numbers-ai.png',
    '⏰': 'topic-clock-ai.png',
    '🔷': 'topic-shapes-ai.png',
    '💰': 'topic-money-ai.png',
    '💵': 'topic-coins-ai.png',
    '✖️': 'topic-mul-ai.png',
    '➗': 'topic-div-ai.png',
    '🍰': 'topic-fraction-ai.png',
    '🥤': 'topic-capacity-ai.png',
    '🔺': 'topic-triangle-ai.png',
    '⬛': 'topic-quad-ai.png',
    '📊': 'topic-chart-ai.png',
    '🔣': 'topic-factors-ai.png',
    '🔵': 'topic-decimal-ai.png',
    '📐': 'topic-area-ai.png',
    '🧠': 'topic-brain-ai.png',
    '🍎': 'topic-apple-ai.png',
    '💧': 'topic-water-ai.png',
    '🔤': 'topic-algebra-ai.png',
    '📦': 'topic-volume-ai.png',
    '🔄': 'topic-refresh-ai.png',
    '％': 'topic-percent-ai.png',
    '💹': 'topic-percent-ai.png',
    '🏃': 'topic-speed-ai.png',
    '🥧': 'topic-pie-ai.png',
    '⭕': 'topic-circle-ai.png'
  },

  TOPIC: {
    'p1-money': 'topic-money-ai.png',
    'p2-money': 'topic-coins-ai.png',
    'p4-word-money': 'topic-money-ai.png',
    'exam-word': 'topic-water-ai.png',
    'p6-percent-app': 'topic-percent-ai.png'
  },

  url(file) {
    return `${this.BASE}/${file}`;
  },

  tier(tierId) {
    const file = this.TIER[tierId] || this.TIER.medium;
    return this.url(file);
  },

  gift(giftId) {
    const file = this.GIFT[giftId] || this.GIFT['gift-small'];
    return this.url(file);
  },

  logo() {
    return this.url('logo-ai.png');
  },

  icon(emoji) {
    const file = this.ICON[emoji] || 'topic-numbers-ai.png';
    return this.url(file);
  },

  topic(topicOrId) {
    let topic = topicOrId;
    if (typeof topic === 'string') {
      topic = typeof TOPICS !== 'undefined' ? TOPICS.find(t => t.id === topicOrId) : null;
    }
    if (!topic) return this.icon('🔢');
    if (this.TOPIC[topic.id]) return this.url(this.TOPIC[topic.id]);
    return this.icon(topic.icon);
  }
};
