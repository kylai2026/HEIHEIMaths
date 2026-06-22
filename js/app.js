const App = {
  state: {
    currentView: 'home',
    practiceTopic: null,
    practiceQuestions: [],
    practiceIndex: 0,
    practiceAnswered: false,
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0,
    quizWeak: {},
    dailyMode: false,
    randomMode: false,
    randomTopicPool: null,
    practiceTier: 'medium'
  },

  async init() {
    this.sanitizeLegacyUI();
    const syncResult = await CloudSync.init();
    if (syncResult.needSetup) {
      await this.showProfileSetup();
    }
    if (!CloudSync.isConfigured()) {
      document.getElementById('switchProfile')?.remove();
    }
    QuestionBank.init();
    this.bindNavigation();
    this.bindTierSelector();
    this.renderHUD();
    this.renderHome();
    this.renderSidebar();
    this.renderTips();
    this.renderRewards();
    this.renderProgress();
    this.bindPractice();
    this.bindQuiz();
    this.bindDaily();
    this.bindModal();
    document.getElementById('resetProgress').addEventListener('click', async () => {
      if (confirm('確定要重設所有學習記錄嗎？（雲端記錄都會一併清除）')) {
        Storage.reset();
        this.renderHUD();
        this.renderHome();
        this.renderProgress();
        this.renderRewards();
      }
    });
    document.getElementById('switchProfile').addEventListener('click', async () => {
      if (!confirm('切換帳號會登出而家嘅學生，確定嗎？')) return;
      CloudSync.clearProfile();
      localStorage.removeItem(Storage.KEY);
      await this.showProfileSetup();
      this.renderHUD();
      this.renderHome();
      this.renderProgress();
      this.renderRewards();
    });
  },

  showProfileSetup() {
    return new Promise((resolve) => {
      const modal = document.getElementById('profileModal');
      const form = document.getElementById('profileForm');
      const errEl = document.getElementById('profileError');
      form.reset();
      modal.classList.remove('hidden');

      form.onsubmit = async (e) => {
        e.preventDefault();
        errEl.classList.add('hidden');
        const familyCode = document.getElementById('familyCode').value.trim();
        const studentName = document.getElementById('studentName').value.trim();
        if (!familyCode || !studentName) return;

        const nameOk = studentName.toLowerCase() === EXPECTED_STUDENT_NAME.toLowerCase();
        const codeOk = familyCode === EXPECTED_FAMILY_CODE;
        if (!nameOk || !codeOk) {
          errEl.textContent = '帳號或密碼唔啱，再試吓！';
          errEl.classList.remove('hidden');
          return;
        }

        const btn = document.getElementById('profileSubmit');
        btn.disabled = true;
        btn.textContent = '連線中…';

        try {
          await CloudSync.registerProfile(familyCode, studentName);
          modal.classList.add('hidden');
          resolve();
        } catch (err) {
          errEl.textContent = '連線失敗，請檢查密碼或網絡後再試。';
          errEl.classList.remove('hidden');
        } finally {
          btn.disabled = false;
          btn.textContent = '開始練習';
        }
      };
    });
  },

  sanitizeLegacyUI() {
    ['hudExamScore', 'examScoreDisplay', 'scoreGoalBar'].forEach(id => {
      document.getElementById(id)?.remove();
    });
    document.querySelectorAll('.score-est, .score-goal, .hud-item.score-est').forEach(el => el.remove());
    document.querySelectorAll('.practice-note, .exam-note').forEach(el => el.remove());
    document.querySelectorAll('.subtitle, .exam-note, .practice-note, p, h1, h2, h3').forEach(el => {
      const text = el.textContent || '';
      if (/39\s*分/.test(text) || /P4下學期大考/.test(text) || /參考你份/.test(text) || /錯嘅題型/.test(text) || /目標由\s*39/.test(text)) {
        if (el.classList.contains('subtitle') || el.classList.contains('practice-note') || el.classList.contains('exam-note')) el.remove();
        else if (el.closest('.hud-item')) {
          el.closest('.hud-item')?.remove();
        }
      }
    });
    const data = Storage.load();
    Storage.save(data);
  },

  bindModal() {
    document.getElementById('modalClose').addEventListener('click', () => {
      document.getElementById('rewardModal').classList.add('hidden');
    });
  },

  showModal(icon, title, message, imageUrl = null) {
    const imgEl = document.getElementById('modalImage');
    if (imageUrl) {
      imgEl.src = imageUrl;
      imgEl.classList.remove('hidden');
      document.getElementById('modalIcon').classList.add('hidden');
    } else {
      imgEl.classList.add('hidden');
      document.getElementById('modalIcon').classList.remove('hidden');
      document.getElementById('modalIcon').textContent = icon;
    }
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;
    document.getElementById('rewardModal').classList.remove('hidden');
  },

  renderHUD() {
    const data = Storage.load();
    const lvl = Scoring.getLevel(data.xp || 0);
    document.getElementById('hudLevel').textContent = lvl.level;
    document.getElementById('hudXp').textContent = lvl.xpInLevel;
    document.getElementById('hudPoints').textContent = data.points || 0;
    document.getElementById('hudXpFill').style.width = `${lvl.progress}%`;
    document.getElementById('hudXpLabel').textContent =
      `Lv.${lvl.level} · 距離升級仲差 ${XP_PER_LEVEL - lvl.xpInLevel} XP`;
  },

  bindNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchView(tab.dataset.view);
      });
    });
  },

  switchView(view) {
    this.state.currentView = view;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `view-${view}`);
    });
    if (view === 'progress') this.renderProgress();
    if (view === 'rewards') this.renderRewards();
    this.renderHUD();
  },

  renderTierRules() {
    const data = Storage.load();
    const weekly = Scoring.getWeeklyStatus(data);
    document.getElementById('tierRulesGrid').innerHTML = weekly.map(t => `
      <div class="tier-rule-card ${t.cssClass}">
        <img src="${t.image}" alt="${t.name}" class="tier-rule-img">
        <div class="tier-rule-header">
          <span>${t.name}</span>
          <span class="tier-points">答對 +${t.points} 分</span>
        </div>
        <div class="tier-weekly-bar">
          <div class="tier-weekly-fill" style="width:${t.percent}%"></div>
        </div>
        <p class="tier-weekly-text">本週已賺 ${t.earned} / ${t.weeklyCap} 分</p>
        <button class="btn btn-primary btn-sm random-tier-btn" data-tier="${t.id}">隨機練習</button>
      </div>
    `).join('');

    document.querySelectorAll('.random-tier-btn').forEach(btn => {
      btn.addEventListener('click', () => this.startRandomPractice(btn.dataset.tier));
    });
  },

  renderTierSections() {
    const container = document.getElementById('tierSections');
    container.innerHTML = EXAM_SECTIONS.map(sec => {
      const topicIds = sec.topics;
      const topics = TOPICS.filter(t => topicIds.includes(t.id));
      return `
        <div class="exam-section">
          <div class="exam-section-header">
            <span>${sec.icon} ${sec.name}</span>
            <span class="exam-weight">${sec.grade === 'P3' ? '小三' : '小四'}</span>
          </div>
          <div class="section-random-row">
            ${['easy', 'medium', 'hard'].map(tierKey => {
              const t = DIFFICULTY_TIERS[tierKey];
              return `<button class="btn btn-sm section-random-btn ${t.cssClass}" data-tier="${tierKey}" data-section="${sec.id}"> ${t.name}隨機</button>`;
            }).join('')}
          </div>
          <div class="topic-grid compact">
            ${topics.map(topic => `
              <div class="topic-card exam-card" data-topic="${topic.id}">
                <span class="icon">${topic.icon}</span>
                <h4>${topic.name}</h4>
                <p>${topic.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.section-random-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = EXAM_SECTIONS.find(s => s.id === btn.dataset.section);
        this.startRandomPractice(btn.dataset.tier, sec.topics);
      });
    });

    container.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        this.startPractice(card.dataset.topic, this.state.practiceTier || 'medium');
      });
    });
  },

  renderHome() {
    const data = Storage.load();
    document.getElementById('totalAnswered').textContent = data.totalAnswered;
    document.getElementById('totalCorrect').textContent = data.totalCorrect;
    const rate = data.totalAnswered > 0
      ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;
    document.getElementById('accuracyRate').textContent = `${rate}%`;
    document.getElementById('streakDays').textContent = data.streakDays;

    this.renderTierRules();
    this.renderTierSections();
    this.renderHUD();
  },

  renderSidebar() {
    const sidebar = document.getElementById('topicSidebar');
    let html = '';
    EXAM_SECTIONS.forEach(sec => {
      html += `<div class="sidebar-section">${sec.icon} ${sec.name}</div>`;
      TOPICS.filter(t => sec.topics.includes(t.id)).forEach(t => {
        html += `<button class="sidebar-item" data-topic="${t.id}">${t.icon} ${t.name}</button>`;
      });
    });
    sidebar.innerHTML = html;
    sidebar.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.addEventListener('click', () => this.startPractice(btn.dataset.topic, this.state.practiceTier));
    });
  },

  bindTierSelector() {
    document.getElementById('tierSelector').querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.tier;
        this.state.practiceTier = tier;
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.toggle('active', b.dataset.tier === tier));
        this.updateWeeklyCapHint();
        if (this.state.practiceTopic) {
          const pool = this.state.randomMode ? this.state.randomTopicPool : null;
          if (this.state.randomMode) {
            this.state.practiceQuestions = QuestionBank.generateRandomSet(10, tier, pool);
          } else {
            this.state.practiceQuestions = QuestionBank.generateSet(this.state.practiceTopic, 10, tier);
          }
          this.state.practiceIndex = 0;
          this.state.practiceAnswered = false;
          this.showPracticeQuestion();
        }
      });
    });
  },

  updateWeeklyCapHint() {
    const data = Storage.load();
    const tier = DIFFICULTY_TIERS[this.state.practiceTier];
    const wp = Scoring.ensureWeeklyPoints(data);
    const earned = wp[this.state.practiceTier] || 0;
    const remaining = Math.max(0, tier.weeklyCap - earned);
    const hint = document.getElementById('weeklyCapHint');
    if (remaining === 0) {
      hint.innerHTML = `⚠️ 本週${tier.name}積分已達上限（${tier.weeklyCap}分），可以轉做其他難度！`;
      hint.className = 'weekly-cap-hint capped';
    } else {
      hint.innerHTML = `${tier.icon} ${tier.name}：答對 +${tier.points} 分 · 本週仲可以賺 <strong>${remaining}</strong> 分`;
      hint.className = 'weekly-cap-hint';
    }
  },

  startRandomPractice(tier, topicIds = null) {
    this.state.dailyMode = false;
    this.state.randomMode = true;
    this.state.randomTopicPool = topicIds;
    this.state.practiceTopic = 'random';
    this.state.practiceTier = tier;
    this.state.practiceQuestions = QuestionBank.generateRandomSet(10, tier, topicIds);
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;

    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    const tierInfo = DIFFICULTY_TIERS[tier];
    document.getElementById('practiceTitle').textContent = `${tierInfo.name}隨機練習`;
    document.getElementById('practiceTopicBadge').textContent = '題目隨機出現 · 共 10 題';

    document.querySelectorAll('.tier-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tier === tier);
    });
    document.getElementById('tierSelector').classList.remove('hidden');
    this.updateWeeklyCapHint();
    this.switchView('practice');
    this.showPracticeQuestion();
  },

  startPractice(topicId, tier = 'medium') {
    this.state.dailyMode = false;
    this.state.randomMode = false;
    this.state.randomTopicPool = null;
    this.state.practiceTopic = topicId;
    this.state.practiceTier = tier;
    this.state.practiceQuestions = QuestionBank.generateSet(topicId, 10, tier);
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;

    document.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.topic === topicId);
    });

    const topic = TOPICS.find(t => t.id === topicId);
    const tierInfo = DIFFICULTY_TIERS[tier];
    document.getElementById('practiceTitle').textContent = topic.name;
    document.getElementById('practiceTopicBadge').textContent = `${tierInfo.name} · +${tierInfo.points}分`;

    document.querySelectorAll('.tier-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tier === tier);
    });
    document.getElementById('tierSelector').classList.remove('hidden');
    this.updateWeeklyCapHint();

    this.switchView('practice');
    this.showPracticeQuestion();
  },

  showPracticeQuestion() {
    const q = this.state.practiceQuestions[this.state.practiceIndex];
    const total = this.state.practiceQuestions.length;
    const current = this.state.practiceIndex + 1;
    const tierInfo = DIFFICULTY_TIERS[q.tier || this.state.practiceTier];

    document.getElementById('practiceCount').textContent = `${current} / ${total}`;
    const topicName = q.topicId ? (TOPICS.find(t => t.id === q.topicId)?.name || '') : '';
    document.getElementById('questionCard').innerHTML = `
      <p>第 ${current} 題
        <span class="badge ${tierInfo.cssClass}">${tierInfo.icon} ${tierInfo.name} +${tierInfo.points}分</span>
        ${topicName ? `<span class="badge">${topicName}</span>` : ''}
      </p>
      <div class="math-expr">${q.question}</div>
    `;

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('solutionBox').classList.add('hidden');
    document.getElementById('hintText').textContent = q.hint;
    this.state.practiceAnswered = false;
    this.state.currentQuestion = q;

    const mcqArea = document.getElementById('practiceMcqArea');
    if (!mcqArea) {
      const area = document.createElement('div');
      area.id = 'practiceMcqArea';
      area.className = 'options-grid hidden';
      document.getElementById('answerArea').after(area);
    }

    if (q.type === 'mcq' && q.options) {
      document.getElementById('answerArea').classList.add('hidden');
      const mcqEl = document.getElementById('practiceMcqArea');
      mcqEl.classList.remove('hidden');
      mcqEl.innerHTML = q.options.map((opt, i) => `
        <button class="option-btn practice-mcq" data-index="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>
      `).join('');
      mcqEl.querySelectorAll('.practice-mcq').forEach(btn => {
        btn.addEventListener('click', () => this.checkMcqAnswer(parseInt(btn.dataset.index, 10)));
      });
    } else {
      document.getElementById('answerArea').classList.remove('hidden');
      document.getElementById('practiceMcqArea').classList.add('hidden');
      document.getElementById('answerInput').value = '';
      document.getElementById('answerInput').disabled = false;
      document.getElementById('submitAnswer').disabled = false;
      setTimeout(() => document.getElementById('answerInput').focus(), 100);
    }
  },

  bindPractice() {
    document.getElementById('submitAnswer').addEventListener('click', () => this.checkAnswer());
    document.getElementById('answerInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') this.checkAnswer();
    });
    document.getElementById('nextQuestion').addEventListener('click', () => this.nextPracticeQuestion());
    document.getElementById('showSolution').addEventListener('click', () => {
      document.getElementById('solutionBox').innerHTML = this.state.currentQuestion.solution;
      document.getElementById('solutionBox').classList.remove('hidden');
    });
  },

  processAnswer(correct, topicId, tier) {
    const data = Storage.load();
    const scoreResult = Scoring.awardAnswer(data, correct, tier);
    Storage.save(data);
    Storage.recordAnswer(topicId, correct);

    this.renderHUD();
    this.renderHome();
    this.updateWeeklyCapHint();

    let rewardMsg = '';
    if (correct && scoreResult.pointsEarned > 0) {
      rewardMsg += `+${scoreResult.pointsEarned} 積分 🎁`;
    } else if (correct && scoreResult.weeklyCapped) {
      rewardMsg += '本週呢個難度積分已滿';
    }
    if (scoreResult.xp > 0) rewardMsg += ` · +${scoreResult.xp} XP`;

    if (scoreResult.levelUp) {
      this.showModal('🎊', `升級了！Lv.${scoreResult.newLevel.level}`,
        `儲滿 100 XP 升一級！你而家係 Lv.${scoreResult.newLevel.level}`,
        'assets/img/tier-medium.png');
    }

    if (scoreResult.newBadges.length > 0) {
      const badges = scoreResult.newBadges.map(b => `${b.icon} ${b.name}`).join('<br>');
      setTimeout(() => this.showModal('🏅', '獲得新徽章！', badges), scoreResult.levelUp ? 800 : 0);
    }

    return rewardMsg;
  },

  showFeedback(correct, q, rewardMsg) {
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden', 'correct', 'wrong');
    if (correct) {
      feedback.classList.add('correct');
      feedback.innerHTML = `🎉 答對了！${rewardMsg ? '<br><small>' + rewardMsg + '</small>' : ''}`;
    } else {
      feedback.classList.add('wrong');
      feedback.innerHTML = `❌ 答錯了。正確答案：<strong>${q.answerDisplay}</strong>${rewardMsg ? '<br><small>' + rewardMsg + '</small>' : ''}`;
    }
    document.getElementById('actionRow').classList.remove('hidden');
    this.state.practiceAnswered = true;
  },

  checkAnswer() {
    if (this.state.practiceAnswered) return;
    const input = document.getElementById('answerInput').value.trim();
    if (!input) {
      document.getElementById('hintText').textContent = '請輸入答案！';
      return;
    }

    const q = this.state.currentQuestion;
    const correct = MathUtils.answersEqual(input, q.answer);
    const topicId = this.state.dailyMode ? q.topicId : this.state.practiceTopic;
    const tier = q.tier || this.state.practiceTier;
    const rewardMsg = this.processAnswer(correct, topicId, tier);
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitAnswer').disabled = true;
    this.showFeedback(correct, q, rewardMsg);
  },

  checkMcqAnswer(selectedIndex) {
    if (this.state.practiceAnswered) return;
    const q = this.state.currentQuestion;
    const correct = selectedIndex === q.correctIndex;
    const topicId = this.state.dailyMode ? q.topicId : (q.topicId || this.state.practiceTopic);

    document.querySelectorAll('.practice-mcq').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add('correct');
      else if (i === selectedIndex) btn.classList.add('wrong');
    });

    const tier = q.tier || this.state.practiceTier;
    const rewardMsg = this.processAnswer(correct, topicId, tier);
    this.showFeedback(correct, q, rewardMsg);
  },

  nextPracticeQuestion() {
    this.state.practiceIndex++;
    if (this.state.practiceIndex >= this.state.practiceQuestions.length) {
      const data = Storage.load();
      const rate = data.totalAnswered > 0
        ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;

      if (this.state.dailyMode) {
        const dailyReward = Scoring.awardDaily(Storage.load());
        if (dailyReward) {
          Storage.save(Storage.load());
          this.showModal('🎯', '今日挑戰完成！', `+${dailyReward.xp} XP`);
        }
      }

      document.getElementById('questionCard').innerHTML = `
        <h3>🎊 完成晒所有題目！</h3>
        <p>正確率：${rate}% · 積分：${data.points || 0} 分</p>
        <p>繼續練習，向禮物目標進發！</p>
      `;
      document.getElementById('answerArea').classList.add('hidden');
      const mcq = document.getElementById('practiceMcqArea');
      if (mcq) mcq.classList.add('hidden');
      document.getElementById('actionRow').classList.add('hidden');
      document.getElementById('feedback').classList.add('hidden');
      this.renderHUD();
      return;
    }
    this.showPracticeQuestion();
  },

  bindDaily() {
    document.getElementById('startDaily').addEventListener('click', () => {
      this.state.dailyMode = true;
      this.state.randomMode = true;
      this.state.randomTopicPool = TOPICS.filter(t => t.exam).map(t => t.id);
      this.state.practiceTopic = 'random';
      this.state.practiceQuestions = QuestionBank.generateDaily(10);
      this.state.practiceIndex = 0;

      document.getElementById('practiceTitle').textContent = '今日挑戰';
      document.getElementById('practiceTopicBadge').textContent = '隨機難度 · 每題按難度計分';
      document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
      document.getElementById('tierSelector').classList.add('hidden');

      this.switchView('practice');
      this.showPracticeQuestion();
    });
  },

  bindQuiz() {
    document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
  },

  startQuiz() {
    this.state.quizQuestions = QuestionBank.generateQuiz(20);
    this.state.quizIndex = 0;
    this.state.quizScore = 0;
    this.state.quizWeak = {};

    document.getElementById('quizIntro').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    document.getElementById('quizActive').classList.remove('hidden');
    this.showQuizQuestion();
  },

  showQuizQuestion() {
    const q = this.state.quizQuestions[this.state.quizIndex];
    const total = this.state.quizQuestions.length;
    const current = this.state.quizIndex + 1;

    document.getElementById('quizProgress').textContent = `第 ${current} / ${total} 題`;
    document.getElementById('quizProgressFill').style.width = `${(current / total) * 100}%`;
    document.getElementById('quizQuestion').innerHTML = `
      <span class="badge">${q.topicName}</span>
      <div class="math-expr" style="margin-top:0.75rem">${q.question}</div>
    `;

    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = q.options.map((opt, i) => `
      <button class="option-btn" data-index="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>
    `).join('');

    optionsEl.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.answerQuiz(parseInt(btn.dataset.index, 10)));
    });
  },

  answerQuiz(selectedIndex) {
    const q = this.state.quizQuestions[this.state.quizIndex];
    const buttons = document.querySelectorAll('#quizOptions .option-btn');
    const correct = selectedIndex === q.correctIndex;

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add('correct');
      else if (i === selectedIndex) btn.classList.add('wrong');
    });

    if (correct) {
      this.state.quizScore++;
    } else {
      this.state.quizWeak[q.topicName] = (this.state.quizWeak[q.topicName] || 0) + 1;
    }

    setTimeout(() => {
      this.state.quizIndex++;
      if (this.state.quizIndex >= this.state.quizQuestions.length) {
        this.showQuizResult();
      } else {
        this.showQuizQuestion();
      }
    }, 1200);
  },

  showQuizResult() {
    document.getElementById('quizActive').classList.add('hidden');
    const resultEl = document.getElementById('quizResult');
    resultEl.classList.remove('hidden');

    const score = this.state.quizScore;
    const total = this.state.quizQuestions.length;
    const pct = Math.round((score / total) * 100);

    let grade, message;
    if (pct >= 80) { grade = '優秀 🌟'; message = '太勁啦！繼續保持！'; }
    else if (pct >= 60) { grade = '良好 👍'; message = '做得唔錯！針對弱項再練會更好！'; }
    else if (pct >= 50) { grade = '過半答對 ✓'; message = '超過一半答對！繼續努力！'; }
    else { grade = '繼續加油 💪'; message = '針對弱項多練習，一定進步！'; }

    const weakList = Object.entries(this.state.quizWeak)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => `<li>${topic}</li>`).join('');

    const data = Storage.load();
    const quizReward = Scoring.awardQuiz(data, pct);
    Storage.recordQuiz(score, total, Object.keys(this.state.quizWeak));
    Storage.save(data);
    this.renderHUD();

    resultEl.innerHTML = `
      <div class="result-score">${score}/${total}</div>
      <div class="result-grade">${grade}（${pct}%）</div>
      <p class="result-message">${message}</p>
      ${quizReward.bonusXp > 0 ? `<p class="reward-line">🎁 獎勵：+${quizReward.bonusXp} XP</p>` : ''}
      ${weakList ? `<div class="weak-topics"><h4>📌 需要加強：</h4><ul>${weakList}</ul></div>` : '<p>全部答對！</p>'}
      <button class="btn btn-primary" id="retryQuiz">再測一次</button>
      <button class="btn btn-secondary" id="goPractice" style="margin-left:0.5rem">去練習弱項</button>
    `;

    if (quizReward.newBadges.length > 0) {
      const badges = quizReward.newBadges.map(b => `${b.icon} ${b.name}`).join('<br>');
      setTimeout(() => this.showModal('🏅', '獲得新徽章！', badges), 500);
    }

    document.getElementById('retryQuiz').addEventListener('click', () => {
      resultEl.classList.add('hidden');
      document.getElementById('quizIntro').classList.remove('hidden');
    });

    document.getElementById('goPractice').addEventListener('click', () => {
      const weakest = Object.entries(this.state.quizWeak).sort((a, b) => b[1] - a[1])[0];
      if (weakest) {
        const topic = TOPICS.find(t => t.name === weakest[0]);
        if (topic) this.startPractice(topic.id, 'medium');
      } else {
        this.switchView('practice');
      }
    });
  },

  renderRewards() {
    const data = Storage.load();
    const lvl = Scoring.getLevel(data.xp || 0);
    const weekly = Scoring.getWeeklyStatus(data);

    document.getElementById('rewardPoints').textContent = data.points || 0;
    document.getElementById('levelCard').innerHTML = `
      <img src="assets/img/tier-medium.png" alt="" class="level-hero-img">
      <div class="level-big">Lv.${lvl.level}</div>
      <div class="level-title">每 100 XP 升 1 級</div>
      <div class="level-xp-bar"><div class="level-xp-fill" style="width:${lvl.progress}%"></div></div>
      <div class="level-xp-text">${lvl.xpInLevel} / ${XP_PER_LEVEL} XP</div>
    `;

    document.getElementById('weeklyStatus').innerHTML = weekly.map(t => `
      <div class="weekly-status-item ${t.cssClass}">
        <img src="${t.image}" alt="" class="weekly-tier-img">
        <span>${t.name}</span>
        <div class="weekly-mini-bar"><div style="width:${t.percent}%"></div></div>
        <span>${t.earned}/${t.weeklyCap} 分</span>
      </div>
    `).join('');

    document.getElementById('giftGrid').innerHTML = GIFT_SHOP.map(gift => {
      const redeemed = (data.redeemedGifts || []).includes(gift.id);
      const canAfford = (data.points || 0) >= gift.cost;
      return `
        <div class="shop-card gift-card ${redeemed ? 'owned' : ''} ${canAfford && !redeemed ? 'affordable' : ''}">
          <img src="${gift.image}" alt="${gift.name}" class="gift-img">
          <h4>${gift.name}</h4>
          <p class="gift-desc">${gift.desc}</p>
          <p class="shop-cost">需要 ${gift.cost} 積分</p>
          ${redeemed
            ? '<span class="owned-tag">已兌換</span>'
            : `<button class="btn btn-primary btn-sm redeem-btn" data-id="${gift.id}" ${canAfford ? '' : 'disabled'}>兌換</button>`}
        </div>
      `;
    }).join('');

    document.querySelectorAll('.redeem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = Storage.load();
        const result = RewardSystem.redeemGift(d, btn.dataset.id);
        if (result.ok) {
          Storage.save(d);
          this.showModal('🎉', '兌換成功！',
            `恭喜！你兌換了「${result.gift.name}」<br>記得搵舅父晞晞攞禮物呀！`,
            result.gift.image);
          this.renderRewards();
          this.renderHUD();
        } else {
          alert(result.msg);
        }
      });
    });

    document.getElementById('badgesGrid').innerHTML = BADGES.map(b => {
      const owned = (data.badges || []).includes(b.id);
      return `
        <div class="badge-card ${owned ? 'owned' : 'locked'}">
          <span class="badge-icon">${owned ? b.icon : '🔒'}</span>
          <h4>${b.name}</h4>
          <p>${b.desc}</p>
        </div>
      `;
    }).join('');

    const redeemed = (data.redeemedGifts || []).map(id => GIFT_SHOP.find(g => g.id === id)).filter(Boolean);
    document.getElementById('ownedRewards').innerHTML = redeemed.length
      ? redeemed.map(r => `<span class="owned-item"><img src="${r.image}" alt="" class="owned-gift-img">${r.name}</span>`).join('')
      : '<p style="color:var(--text-muted)">尚未兌換禮物，做題賺積分啦！</p>';
  },

  renderTips() {
    document.getElementById('tipsGrid').innerHTML = TIPS.map(tip => `
      <div class="tip-card">
        <div class="tip-icon">${tip.icon}</div>
        <h3>${tip.title}</h3>
        <div class="formula">${tip.formula}</div>
        <ul>${tip.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `).join('');
  },

  renderProgress() {
    const data = Storage.load();
    const rate = data.totalAnswered > 0
      ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;
    document.getElementById('progressSummary').innerHTML = `
      <div class="progress-summary-card">
        <h4>積分</h4>
        <div class="big-num">${data.points || 0} 分</div>
      </div>
      <div class="progress-summary-card">
        <h4>總正確率</h4>
        <div class="big-num">${rate}%</div>
      </div>
      <div class="progress-summary-card">
        <h4>等級 / XP</h4>
        <div class="big-num">Lv.${Scoring.getLevel(data.xp || 0).level} · ${data.xp || 0} XP</div>
      </div>
      <div class="progress-summary-card">
        <h4>距離下一級</h4>
        <div class="big-num">${XP_PER_LEVEL - Scoring.getLevel(data.xp || 0).xpInLevel} XP</div>
      </div>
    `;

    document.getElementById('topicProgressList').innerHTML = TOPICS.map(t => {
      const stats = data.topics[t.id] || { answered: 0, correct: 0 };
      const acc = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
      const barClass = acc >= 70 ? '' : acc >= 50 ? 'mid' : 'low';
      return `
        <div class="topic-progress-item">
          <div class="topic-progress-header">
            <span>${t.icon} ${t.name}</span>
            <span>${stats.correct}/${stats.answered}（${acc}%）</span>
          </div>
          <div class="topic-progress-bar">
            <div class="topic-progress-fill ${barClass}" style="width:${acc}%"></div>
          </div>
        </div>
      `;
    }).join('');

    const historyEl = document.getElementById('quizHistory');
    if (!data.quizHistory.length) {
      historyEl.innerHTML = '<p style="color:var(--text-muted)">尚未進行模擬小測</p>';
    } else {
      historyEl.innerHTML = data.quizHistory.map(h => `
        <div class="quiz-history-item">
          <span>${new Date(h.date).toLocaleDateString('zh-HK')}</span>
          <span><strong>${h.score}/${h.total}</strong>（${h.percentage}%）</span>
        </div>
      `).join('');
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await App.init();
});
