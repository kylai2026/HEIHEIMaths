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
    practiceTier: 'medium',
    noPointsMode: false,
    sessionCorrect: [],
    sessionLastTick: Date.now(),
    gachaCollectionPool: 'pokemon',
    selectedGrade: null
  },

  getSelectedGrade() {
    return this.state.selectedGrade || UserSettings.load().grade || null;
  },

  setSelectedGrade(grade) {
    if (!GRADE_ORDER.includes(grade)) return;
    UserSettings.save({ grade });
    this.state.selectedGrade = grade;
    document.getElementById('gradeModal')?.classList.add('hidden');
    this.renderGradePicker();
    this.renderTierSections();
    this.renderSidebar();
    this.updateGradeLabels();
    AudioManager.playSfx('click');
  },

  showGradeModalIfNeeded() {
    if (this.getSelectedGrade()) return;
    const modal = document.getElementById('gradeModal');
    if (!modal) return;
    this.renderGradeModalGrid();
    modal.classList.remove('hidden');
  },

  renderGradeModalGrid() {
    const grid = document.getElementById('gradeModalGrid');
    if (!grid) return;
    grid.innerHTML = GRADE_ORDER.map(grade => this.gradeButtonHtml(grade, true)).join('');
    grid.querySelectorAll('[data-grade]').forEach(btn => {
      btn.addEventListener('click', () => this.setSelectedGrade(btn.dataset.grade));
    });
  },

  gradeButtonHtml(grade, large = false) {
    const active = this.getSelectedGrade() === grade;
    const count = countTopicsByGrade(grade);
    return `
      <button type="button" class="grade-btn ${large ? 'grade-btn-lg' : ''} ${active ? 'active' : ''}" data-grade="${grade}">
        <span class="grade-btn-icon">${GRADE_ICONS[grade]}</span>
        <span class="grade-btn-label">${GRADE_LABELS[grade]}</span>
        <span class="grade-btn-count">${count} 個課題</span>
      </button>
    `;
  },

  renderGradePicker() {
    const grid = document.getElementById('gradePickerGrid');
    const bar = document.getElementById('practiceGradeBar');
    if (grid) {
      grid.innerHTML = GRADE_ORDER.map(grade => this.gradeButtonHtml(grade)).join('');
      grid.querySelectorAll('[data-grade]').forEach(btn => {
        btn.addEventListener('click', () => this.setSelectedGrade(btn.dataset.grade));
      });
    }
    if (bar) {
      bar.innerHTML = `
        <div class="practice-grade-label">年級</div>
        <div class="practice-grade-tabs">
          ${GRADE_ORDER.map(grade => `
            <button type="button" class="practice-grade-tab ${this.getSelectedGrade() === grade ? 'active' : ''}" data-grade="${grade}">
              ${GRADE_LABELS[grade]}
            </button>
          `).join('')}
        </div>
      `;
      bar.querySelectorAll('[data-grade]').forEach(btn => {
        btn.addEventListener('click', () => this.setSelectedGrade(btn.dataset.grade));
      });
    }
    this.updateGradeLabels();
  },

  updateGradeLabels() {
    const grade = this.getSelectedGrade();
    const badge = document.getElementById('gradeCurrentBadge');
    const title = document.getElementById('homeTopicsTitle');
    const placeholder = document.getElementById('gradeTopicsPlaceholder');
    const sections = document.getElementById('tierSections');

    if (badge) {
      if (grade) {
        badge.textContent = `而家：${GRADE_LABELS[grade]}`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
    if (title) {
      title.textContent = grade
        ? `📚 ${GRADE_LABELS[grade]}課題練習（題目隨機出現）`
        : '📚 課題練習';
    }
    if (placeholder && sections) {
      const showPlaceholder = !grade;
      placeholder.classList.toggle('hidden', !showPlaceholder);
      sections.classList.toggle('hidden', showPlaceholder);
    }
  },

  async init() {
    UserSettings.init();
    AudioManager.init();
    this.sanitizeLegacyUI();
    const syncResult = await CloudSync.init();
    if (syncResult.needSetup) {
      await this.showProfileSetup();
    }
    if (!CloudSync.isConfigured()) {
      document.getElementById('switchProfile')?.remove();
      document.getElementById('logoutBtn')?.remove();
    }
    this.updateAuthUI();
    QuestionBank.init();
    this.state.selectedGrade = UserSettings.load().grade || null;
    this.bindNavigation();
    this.bindTierSelector();
    this.renderHUD();
    this.renderGradePicker();
    this.renderHome();
    this.renderSidebar();
    this.renderTips();
    this.renderRewards();
    this.renderProgress();
    this.bindPractice();
    this.bindQuiz();
    this.bindDaily();
    this.bindModal();
    this.bindCardZoomDelegation();
    this.bindSessionTracking();
    this.showGradeModalIfNeeded();
    document.getElementById('resetProgress').addEventListener('click', async () => {
      if (confirm('確定要重設所有學習記錄嗎？（雲端記錄都會一併清除）')) {
        Storage.reset();
        this.renderHUD();
        this.renderHome();
        this.renderProgress();
        this.renderRewards();
      }
    });
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    document.getElementById('switchProfile')?.addEventListener('click', () => this.logout());
  },

  updateAuthUI() {
    const profile = CloudSync.getProfile();
    const loggedIn = !!profile;
    document.getElementById('logoutBtn')?.classList.toggle('hidden', !loggedIn);
    document.getElementById('switchProfile')?.classList.toggle('hidden', !loggedIn);
    const nameEl = document.getElementById('currentUser');
    if (nameEl) {
      nameEl.textContent = loggedIn ? profile.studentName : '';
      nameEl.classList.toggle('hidden', !loggedIn);
    }
  },

  async logout() {
    if (!confirm('確定要登出嗎？')) return;
    CloudSync.clearProfile();
    localStorage.removeItem(Storage.KEY);
    this.updateAuthUI();
    await this.showProfileSetup();
    this.renderHUD();
    this.renderHome();
    this.renderProgress();
    this.renderRewards();
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

        const validName = validateAccount(studentName, familyCode);
        if (!validName) {
          errEl.textContent = '帳號或密碼唔啱，再試吓！';
          errEl.classList.remove('hidden');
          return;
        }

        const btn = document.getElementById('profileSubmit');
        btn.disabled = true;
        btn.textContent = '連線中…';

        try {
          await CloudSync.registerProfile(familyCode, validName);
          modal.classList.add('hidden');
          this.updateAuthUI();
          this.renderHUD();
          this.renderGradePicker();
          this.renderHome();
          this.renderSidebar();
          this.renderProgress();
          this.renderRewards();
          this.showGradeModalIfNeeded();
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

  bindSessionTracking() {
    this.state.sessionLastTick = Date.now();
    setInterval(() => this.trackSessionTime(), 60000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.trackSessionTime(true);
    });
  },

  trackSessionTime(force = false) {
    const now = Date.now();
    const mins = (now - this.state.sessionLastTick) / 60000;
    if (force || mins >= 1) {
      if (mins >= 0.5) Storage.addSessionMinutes(Math.min(mins, 30));
      this.state.sessionLastTick = now;
      this.renderDailyProgress();
    }
  },

  renderDailyProgress() {
    const data = Storage.load();
    const today = Storage.getTodayLog(data);
    const acc = today.answered > 0 ? Math.round((today.correct / today.answered) * 100) : 0;
    const goalDone = today.goalMet;
    const panel = document.getElementById('dailyProgressPanel');
    if (!panel) return;

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = Storage.getDateKey(d);
      const log = data.dailyLog?.[key] || { answered: 0, minutes: 0, goalMet: false };
      last7.push({
        key,
        label: i === 0 ? '今日' : `${d.getMonth() + 1}/${d.getDate()}`,
        ...log
      });
    }

    panel.innerHTML = `
      <div class="daily-progress-head">
        <h3>📅 今日學習進度</h3>
        <span class="daily-goal-badge ${goalDone ? 'done' : ''}">${goalDone ? '✅ 今日目標達成' : '目標：做 5 題或練習 10 分鐘'}</span>
      </div>
      <div class="daily-today-stats">
        <div class="daily-stat"><strong>${today.answered}</strong><span>今日做題</span></div>
        <div class="daily-stat"><strong>${today.correct}</strong><span>答對</span></div>
        <div class="daily-stat"><strong>${acc}%</strong><span>正確率</span></div>
        <div class="daily-stat"><strong>${today.minutes || 0}</strong><span>分鐘</span></div>
        <div class="daily-stat"><strong>${today.points || 0}</strong><span>積分</span></div>
      </div>
      <div class="daily-week-row">
        ${last7.map(d => `
          <div class="daily-week-cell ${d.goalMet ? 'met' : ''} ${d.key === Storage.getDateKey() ? 'today' : ''}" title="${d.label}：${d.answered} 題 · ${d.minutes || 0} 分鐘">
            <span class="dw-label">${d.label}</span>
            <span class="dw-num">${d.answered || '—'}</span>
          </div>
        `).join('')}
      </div>
    `;

    const logPanel = document.getElementById('dailyLogPanel');
    if (logPanel) {
      const keys = Object.keys(data.dailyLog || {}).sort().reverse().slice(0, 14);
      if (!keys.length) {
        logPanel.innerHTML = '<p class="muted-text">尚未有每日記錄，開始做題就會自動記低！</p>';
      } else {
        logPanel.innerHTML = keys.map(key => {
          const log = data.dailyLog[key];
          const rate = log.answered > 0 ? Math.round((log.correct / log.answered) * 100) : 0;
          return `
            <div class="daily-log-item ${log.goalMet ? 'met' : ''}">
              <div class="daily-log-date">${key}${log.dailyChallenge ? ' · 🎯 挑戰' : ''}</div>
              <div class="daily-log-stats">
                <span>${log.answered} 題</span>
                <span>答對 ${log.correct}（${rate}%）</span>
                <span>${log.minutes || 0} 分鐘</span>
                <span>+${log.points || 0} 分 · +${log.xp || 0} XP</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
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
    document.getElementById('gachaModalClose')?.addEventListener('click', () => {
      document.getElementById('gachaModal').classList.add('hidden');
      document.getElementById('gachaAnimStage').innerHTML = '';
      document.getElementById('gachaResultArea').classList.add('hidden');
      document.getElementById('gachaModalClose').classList.add('hidden');
      document.querySelector('.gacha-modal')?.classList.remove('gacha-modal--results');
      GachaAnimation._running = false;
      GachaAnimation._stopParticles();
    });
    document.getElementById('cardViewerClose')?.addEventListener('click', () => this.closeCardViewer());
    document.getElementById('cardViewerModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'cardViewerModal') this.closeCardViewer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('cardViewerModal')?.classList.contains('hidden')) {
        this.closeCardViewer();
      }
    });
  },

  bindCardZoomDelegation() {
    if (this._cardZoomBound) return;
    this._cardZoomBound = true;
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-card-zoom]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const cardId = el.dataset.cardId;
      if (!cardId) return;
      const card = GachaSystem.getCard(cardId);
      if (card) this.openCardViewer(card, el.dataset.owned !== 'false');
    });
  },

  openCardViewer(card, owned = true) {
    if (!card) return;
    const modal = document.getElementById('cardViewerModal');
    const panel = document.getElementById('cardViewerPanel');
    const r = GACHA_RARITIES[card.rarity] || GACHA_RARITIES.common;
    panel.className = `modal-content card-viewer-content ${r.css}`;
    document.getElementById('cardViewerArt').innerHTML = GachaSystem.cardArtHtml(card, owned, 'xl');
    document.getElementById('cardViewerInfo').innerHTML = owned ? `
      ${GachaSystem.starsHtml(card.rarity, 'lg')}
      <h3 class="card-viewer-name" id="cardViewerName">${card.name}</h3>
      <p class="card-viewer-rarity">${r.label}</p>
      ${card.desc ? `<p class="card-viewer-desc">${card.desc}</p>` : ''}
      <p class="card-viewer-hint">點擊背景或按 × 關閉</p>
    ` : `
      <h3 class="card-viewer-name" id="cardViewerName">???</h3>
      <p class="card-viewer-rarity">尚未獲得</p>
      <p class="card-viewer-desc">繼續練習賺積分，就有機會抽到這張卡！</p>
    `;
    modal.classList.remove('hidden');
    document.body.classList.add('card-viewer-open');
    if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
  },

  closeCardViewer() {
    document.getElementById('cardViewerModal')?.classList.add('hidden');
    document.body.classList.remove('card-viewer-open');
  },

  bindCardZoomClicks() {
    /* 已由 bindCardZoomDelegation 統一處理 */
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
    document.getElementById('hudPoints').textContent = Storage.getPoints(data);
    const testBadge = document.getElementById('testPointsBadge');
    if (testBadge) {
      testBadge.classList.toggle('hidden', !getActiveUnlimitedPoints());
    }
    document.getElementById('hudXpFill').style.width = `${lvl.progress}%`;
    document.getElementById('hudXpLabel').textContent =
      `Lv.${lvl.level} · 距離升級仲差 ${XP_PER_LEVEL - lvl.xpInLevel} XP`;
  },

  bindNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        AudioManager.playSfx('click');
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
    if (view === 'home') this.renderDailyProgress();
    if (view === 'practice' && !this.getSelectedGrade()) this.showGradeModalIfNeeded();
    this.renderHUD();
  },

  renderTierRules() {
    const data = Storage.load();
    const progress = Scoring.getTierProgress(data);
    document.getElementById('tierRulesGrid').innerHTML = progress.map(t => `
      <div class="tier-rule-card ${t.cssClass}">
        <img src="${t.image}" alt="${t.name}" class="tier-rule-img">
        <div class="tier-rule-header">
          <span>${t.name}</span>
          <span class="tier-points">答對 +${t.points} 分</span>
        </div>
        <div class="tier-weekly-bar">
          <div class="tier-weekly-fill" style="width:${t.percent}%"></div>
        </div>
        <p class="tier-weekly-text">已完成 ${t.completed} / ${t.total} 題（${t.percent}%）</p>
        <button class="btn btn-primary btn-sm random-tier-btn" data-tier="${t.id}">隨機練習</button>
      </div>
    `).join('');

    document.querySelectorAll('.random-tier-btn').forEach(btn => {
      btn.addEventListener('click', () => this.startRandomPractice(btn.dataset.tier));
    });
    this.renderCorrectBank();
  },

  questionPreview(q) {
    const text = String(q.question || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 48) + (text.length > 48 ? '…' : '');
  },

  renderCorrectBank() {
    const panel = document.getElementById('correctBankPanel');
    const list = document.getElementById('correctBankList');
    const btn = document.getElementById('startBankRedo');
    if (!panel || !list) return;

    const data = Storage.load();
    const items = Storage.getCorrectBankList(data);

    if (!items.length) {
      panel.classList.add('empty');
      list.innerHTML = '<p class="correct-bank-empty">答對題目會儲存喺呢度，可以揀選重做（重做唔計分）。</p>';
      btn?.classList.add('hidden');
      return;
    }

    panel.classList.remove('empty');
    list.innerHTML = items.slice(0, 30).map((q, i) => {
      const topic = TOPICS.find(t => t.id === q.topicId);
      const tier = DIFFICULTY_TIERS[q.tier] || DIFFICULTY_TIERS.medium;
      return `
        <label class="redo-item">
          <input type="checkbox" class="bank-redo-check" data-key="${q.poolKey}" checked>
          <span class="redo-meta">
            <span class="badge ${tier.cssClass}">${tier.name}</span>
            ${topic ? `<span class="badge">${topic.name}</span>` : ''}
          </span>
          <span class="redo-preview">${this.questionPreview(q)}</span>
        </label>
      `;
    }).join('');
    if (items.length > 30) {
      list.innerHTML += `<p class="correct-bank-more">另有 ${items.length - 30} 題答對記錄…</p>`;
    }
    btn?.classList.remove('hidden');
    btn?.onclick = () => this.startRedoFromBank();
  },

  startRedoFromBank() {
    const checks = document.querySelectorAll('.bank-redo-check:checked');
    if (!checks.length) {
      alert('請至少揀一題重做');
      return;
    }
    const data = Storage.load();
    const bank = data.correctBank || {};
    const questions = [...checks].map(c => bank[c.dataset.key]).filter(Boolean);
    if (!questions.length) return;
    this.startRedoPractice(questions);
  },

  startRedoPractice(questions) {
    if (!questions.length) return;
    AudioManager.playSfx('click');
    this.state.dailyMode = false;
    this.state.randomMode = false;
    this.state.noPointsMode = true;
    this.state.sessionCorrect = [];
    this.state.practiceTopic = 'redo';
    this.state.practiceQuestions = questions.map(q => ({ ...q, isRedo: true }));
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;

    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    document.getElementById('practiceTitle').textContent = '重做練習';
    document.getElementById('practiceTopicBadge').textContent = `${questions.length} 題 · 唔計分`;
    document.getElementById('tierSelector').classList.add('hidden');
    this.updateTierProgressHint();
    this.switchView('practice');
    this.showPracticeQuestion();
  },

  renderTierSections() {
    const container = document.getElementById('tierSections');
    const grade = this.getSelectedGrade();
    if (!grade) {
      container.innerHTML = '';
      return;
    }

    const sections = getSectionsByGrade(grade);
    container.innerHTML = sections.map(sec => {
      const topicIds = sec.topics;
      const topics = TOPICS.filter(t => topicIds.includes(t.id));
      const sectionName = sec.name.replace(/^小[一二三四五六] · /, '');
      return `
        <div class="exam-section">
          <div class="exam-section-header">
            <span>${sec.icon} ${sectionName}</span>
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
        const sec = CURRICULUM_SECTIONS.find(s => s.id === btn.dataset.section);
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
    this.renderDailyProgress();
    this.renderHUD();
    this.updateGradeLabels();
  },

  renderSidebar() {
    const sidebar = document.getElementById('topicSidebar');
    const grade = this.getSelectedGrade();
    if (!grade) {
      sidebar.innerHTML = '<p class="sidebar-placeholder">請先喺主頁揀年級</p>';
      return;
    }

    let html = '';
    getSectionsByGrade(grade).forEach(sec => {
      const sectionName = sec.name.replace(/^小[一二三四五六] · /, '');
      html += `<div class="sidebar-section">${sec.icon} ${sectionName}</div>`;
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
        this.updateTierProgressHint();
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

  updateTierProgressHint() {
    const hint = document.getElementById('tierProgressHint');
    if (!hint) return;
    if (this.state.noPointsMode) {
      hint.innerHTML = '🔄 <strong>重做模式</strong>：做題唔會獲取積分';
      hint.className = 'tier-progress-hint redo-mode';
      return;
    }
    const data = Storage.load();
    const tier = DIFFICULTY_TIERS[this.state.practiceTier];
    const progress = Scoring.getTierProgress(data).find(t => t.id === this.state.practiceTier);
    hint.innerHTML = `${tier.icon} ${tier.name}：答對 +${tier.points} 分 · 已完成 <strong>${progress.percent}%</strong>（${progress.completed}/${progress.total} 題）`;
    hint.className = 'tier-progress-hint';
  },

  startRandomPractice(tier, topicIds = null) {
    this.state.dailyMode = false;
    this.state.randomMode = true;
    this.state.noPointsMode = false;
    this.state.sessionCorrect = [];
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
    this.updateTierProgressHint();
    this.switchView('practice');
    this.showPracticeQuestion();
  },

  startPractice(topicId, tier = 'medium') {
    this.state.dailyMode = false;
    this.state.randomMode = false;
    this.state.noPointsMode = false;
    this.state.sessionCorrect = [];
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
    this.updateTierProgressHint();

    this.switchView('practice');
    this.showPracticeQuestion();
  },

  showPracticeQuestion() {
    const q = this.state.practiceQuestions[this.state.practiceIndex];
    const total = this.state.practiceQuestions.length;
    const current = this.state.practiceIndex + 1;
    const tierInfo = DIFFICULTY_TIERS[q.tier || this.state.practiceTier];
    const pointsBadge = this.state.noPointsMode
      ? '<span class="badge badge-redo">重做 · 唔計分</span>'
      : `<span class="badge ${tierInfo.cssClass}">${tierInfo.icon} ${tierInfo.name} +${tierInfo.points}分</span>`;

    document.getElementById('practiceCount').textContent = `${current} / ${total}`;
    const topicName = q.topicId ? (TOPICS.find(t => t.id === q.topicId)?.name || '') : '';
    document.getElementById('questionCard').innerHTML = `
      <p>第 ${current} 題
        ${pointsBadge}
        ${topicName ? `<span class="badge">${topicName}</span>` : ''}
      </p>
      <div class="math-expr">${q.question}</div>
    `;

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('solutionBox').classList.add('hidden');
    document.getElementById('solutionBox').classList.remove('teach-box');
    document.getElementById('showSolution').classList.remove('hidden');
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
      document.getElementById('solutionBox').innerHTML = this.buildTeachingHTML(this.state.currentQuestion);
      document.getElementById('solutionBox').classList.remove('hidden');
      document.getElementById('solutionBox').classList.add('teach-box');
    });
  },

  processAnswer(correct, topicId, tier) {
    this.trackSessionTime();
    AudioManager.playSfx(correct ? 'correct' : 'wrong');

    const data = Storage.load();
    const q = this.state.currentQuestion;
    const alreadyMastered = !!(q?.poolKey && data.correctBank?.[q.poolKey]);
    const noPoints = this.state.noPointsMode || q?.isRedo || (correct && alreadyMastered);
    const scoreResult = Scoring.awardAnswer(data, correct, tier, { noPoints });

    if (q?.poolKey) Scoring.markQuestionCompleted(data, tier, q.poolKey);
    if (correct && !noPoints && q) Storage.saveCorrectQuestion(data, q);
    if (correct && q) this.state.sessionCorrect.push({ ...q });

    Storage.recordAnswer(topicId, correct, {
      points: scoreResult.pointsEarned || 0,
      xp: scoreResult.xp || 0
    }, data);
    Storage.save(data);

    this.renderHUD();
    this.renderHome();
    this.renderDailyProgress();
    this.updateTierProgressHint();

    let rewardMsg = '';
    if (correct) {
      if (noPoints) {
        rewardMsg = '重做 · 唔計分';
      } else if (scoreResult.pointsEarned > 0) {
        rewardMsg = `+${scoreResult.pointsEarned} 積分 🎁`;
      }
      if (scoreResult.xp > 0) {
        rewardMsg += (rewardMsg ? ' · ' : '') + `+${scoreResult.xp} XP`;
      }
    }

    if (scoreResult.levelUp) {
      AudioManager.playSfx('levelUp');
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

  buildTeachingHTML(q) {
    const answer = q.answerDisplay || (q.options && q.correctIndex != null ? q.options[q.correctIndex] : '');
    const hintBlock = q.hint ? `<p class="teach-hint"><strong>💡 提示：</strong>${q.hint}</p>` : '';
    const steps = q.solution || `<p>正確答案係 <strong>${answer}</strong></p>`;
    return `
      <p class="teach-intro">唔緊要，一齊學返點做！</p>
      <p class="teach-answer"><strong>✅ 正確答案：</strong>${answer}</p>
      ${hintBlock}
      <div class="teach-steps">${steps}</div>
    `;
  },

  showTeachingSolution(q) {
    const box = document.getElementById('solutionBox');
    box.innerHTML = this.buildTeachingHTML(q);
    box.classList.remove('hidden');
    box.classList.add('teach-box');
  },

  showFeedback(correct, q, rewardMsg) {
    const feedback = document.getElementById('feedback');
    const solutionBox = document.getElementById('solutionBox');
    const showSolutionBtn = document.getElementById('showSolution');
    feedback.classList.remove('hidden', 'correct', 'wrong');
    solutionBox.classList.remove('teach-box');
    solutionBox.classList.add('hidden');

    if (correct) {
      feedback.classList.add('correct');
      if (this.state.noPointsMode) {
        feedback.innerHTML = '🎉 答對了！<br><small>重做 · 唔計分</small>';
      } else {
        feedback.innerHTML = `🎉 答對了！${rewardMsg ? '<br><small>' + rewardMsg + '</small>' : ''}`;
      }
      showSolutionBtn.classList.remove('hidden');
    } else {
      feedback.classList.add('wrong');
      feedback.innerHTML = `❌ 答錯了，今次冇積分。睇下面學返點做！`;
      showSolutionBtn.classList.add('hidden');
      this.showTeachingSolution(q);
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
    const topicId = q.topicId || this.state.practiceTopic;
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

  showPracticeComplete() {
    const data = Storage.load();
    const rate = data.totalAnswered > 0
      ? Math.round((data.totalCorrect / data.totalAnswered) * 100) : 0;

    const unique = [];
    const seen = new Set();
    for (const q of this.state.sessionCorrect || []) {
      if (q.poolKey && !seen.has(q.poolKey)) {
        seen.add(q.poolKey);
        unique.push(q);
      } else if (!q.poolKey) {
        unique.push(q);
      }
    }

    let redoHtml = '';
    if (unique.length > 0) {
      redoHtml = `
        <div class="redo-picker">
          <h4>📋 今次答對嘅題目 · 揀選重做</h4>
          <p class="redo-picker-note">重做唔會獲取積分</p>
          <div class="redo-list session-redo-list">
            ${unique.map((q, i) => `
              <label class="redo-item">
                <input type="checkbox" class="session-redo-check" data-idx="${i}" checked>
                <span class="redo-preview">${this.questionPreview(q)}</span>
              </label>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" id="startSessionRedo">重做已選題目</button>
        </div>
      `;
    }

    document.getElementById('questionCard').innerHTML = `
      <h3>🎊 完成晒所有題目！</h3>
      <p>總正確率：${rate}% · 積分：${data.points || 0} 分</p>
      <p>繼續練習，抽卡收集小精靈同肉桂狗！</p>
      ${redoHtml}
    `;
    document.getElementById('answerArea').classList.add('hidden');
    const mcq = document.getElementById('practiceMcqArea');
    if (mcq) mcq.classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('feedback').classList.add('hidden');
    this.state.noPointsMode = false;

    document.getElementById('startSessionRedo')?.addEventListener('click', () => {
      const checks = document.querySelectorAll('.session-redo-check:checked');
      const selected = [...checks].map(c => unique[parseInt(c.dataset.idx, 10)]).filter(Boolean);
      if (!selected.length) {
        alert('請至少揀一題重做');
        return;
      }
      this.startRedoPractice(selected);
    });

    this.renderHUD();
    this.renderCorrectBank();
  },

  nextPracticeQuestion() {
    this.state.practiceIndex++;
    if (this.state.practiceIndex >= this.state.practiceQuestions.length) {
      if (this.state.dailyMode) {
        const dailyReward = Scoring.awardDaily(Storage.load());
        if (dailyReward) {
          Storage.save(Storage.load());
          Storage.markDailyChallengeDone();
          this.renderDailyProgress();
          AudioManager.playSfx('levelUp');
          this.showModal('🎯', '今日挑戰完成！', `+${dailyReward.xp} XP`);
        }
      }
      this.showPracticeComplete();
      return;
    }
    this.showPracticeQuestion();
  },

  bindDaily() {
    document.getElementById('startDaily').addEventListener('click', () => {
      AudioManager.playSfx('click');
      this.state.dailyMode = true;
      this.state.randomMode = true;
      this.state.noPointsMode = false;
      this.state.sessionCorrect = [];
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
    document.getElementById('quizTeachBox')?.classList.add('hidden');
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

    this.trackSessionTime();
    AudioManager.playSfx(correct ? 'correct' : 'wrong');
    const qData = Storage.load();
    Storage.updateDailyLog(qData, { answered: 1, correct: correct ? 1 : 0 });
    Storage.save(qData);
    this.renderDailyProgress();

    let teachEl = document.getElementById('quizTeachBox');
    if (!correct) {
      if (!teachEl) {
        teachEl = document.createElement('div');
        teachEl.id = 'quizTeachBox';
        teachEl.className = 'solution-box teach-box';
        document.getElementById('quizActive').appendChild(teachEl);
      }
      teachEl.innerHTML = this.buildTeachingHTML(q);
      teachEl.classList.remove('hidden');
    } else {
      teachEl?.classList.add('hidden');
    }

    const delay = correct ? 1200 : 4500;
    setTimeout(() => {
      document.getElementById('quizTeachBox')?.classList.add('hidden');
      this.state.quizIndex++;
      if (this.state.quizIndex >= this.state.quizQuestions.length) {
        this.showQuizResult();
      } else {
        this.showQuizQuestion();
      }
    }, delay);
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
    const weekly = Scoring.getTierProgress(data);

    document.getElementById('rewardPoints').textContent = Storage.getPoints(data);
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
        <span>${t.completed}/${t.total} 題（${t.percent}%）</span>
      </div>
    `).join('');

    this.renderGachaPools(data);
    this.renderGachaCollection(data);

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
  },

  renderGachaPools(data) {
    const points = Storage.getPoints(data);
    const unlimited = getActiveUnlimitedPoints();
    document.getElementById('gachaPools').innerHTML = CARD_POOLS.map(pool => {
      const stats = GachaSystem.getCollectionStats(data, pool.id);
      const pct = Math.round((stats.owned / stats.total) * 100);
      const previews = GachaSystem.getPreviewCards(pool.id);
      return `
        <div class="gacha-pool-card pool-${pool.id}">
          <div class="gacha-pool-banner">
            <img src="${pool.bannerImage}" alt="${pool.name}" class="gacha-banner-img">
            <div class="gacha-pool-banner-overlay">
              <span class="gacha-pool-badge">${pool.icon} ${pool.name}</span>
              <p>${pool.banner}</p>
            </div>
          </div>
          <div class="gacha-pool-body">
            <p class="gacha-pool-desc">${pool.desc}</p>
            <div class="gacha-preview-row">
              ${previews.map(c => `
                <button type="button" class="gacha-preview-thumb" data-card-zoom data-card-id="${c.id}" data-owned="true" title="點擊放大欣賞">
                  ${GachaSystem.cardArtHtml(c, true, 'sm')}
                </button>
              `).join('')}
            </div>
            <div class="gacha-pool-progress">
              <div class="gacha-progress-bar"><div style="width:${pct}%"></div></div>
              <span>已收集 ${stats.owned} / ${stats.total}（${pct}%）</span>
            </div>
            <div class="gacha-rates">
              ${Object.values(GACHA_RARITIES).map(r =>
                `<span class="rate-tag ${r.css}">${r.label} ${r.weight}%</span>`
              ).join('')}
            </div>
            <div class="gacha-pool-actions">
              <button class="btn btn-primary gacha-pull-btn" data-pool="${pool.id}" data-count="1"
                ${unlimited || points >= GACHA_PULL_COST ? '' : 'disabled'}>
                ✨ 抽 1 次（${GACHA_PULL_COST} 分）
              </button>
              <button class="btn btn-gacha10 gacha-pull-btn" data-pool="${pool.id}" data-count="10"
                ${unlimited || points >= GACHA_PULL10_COST ? '' : 'disabled'}>
                🎴 十連抽（${GACHA_PULL10_COST} 分）
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.gacha-pull-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (GachaAnimation._running) return;
        this.doGachaPull(btn.dataset.pool, parseInt(btn.dataset.count, 10));
      });
    });

    this.bindCardZoomClicks();
  },

  renderGachaCollection(data) {
    const active = this.state.gachaCollectionPool || 'pokemon';
    document.getElementById('gachaCollectionTabs').innerHTML = CARD_POOLS.map(pool => {
      const stats = GachaSystem.getCollectionStats(data, pool.id);
      return `
        <button class="gacha-tab ${pool.id === active ? 'active' : ''}" data-pool="${pool.id}">
          ${pool.icon} ${pool.name}（${stats.owned}/${stats.total}）
        </button>
      `;
    }).join('');

    document.querySelectorAll('.gacha-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.state.gachaCollectionPool = tab.dataset.pool;
        this.renderGachaCollection(Storage.load());
      });
    });

    const poolId = this.state.gachaCollectionPool;
    const coll = GachaSystem.ensureCollection(data)[poolId];
    const allCards = GachaSystem.getCardsByPool(poolId);

    document.getElementById('gachaCollection').innerHTML = allCards.map(card => {
      const count = coll[card.id] || 0;
      const owned = count > 0;
      const r = GACHA_RARITIES[card.rarity];
      return `
        <button type="button" class="collect-card ${owned ? 'owned' : 'locked'} ${r.css}"
          data-card-zoom data-card-id="${card.id}" data-owned="${owned}"
          title="${owned ? '點擊放大欣賞' : '點擊預覽'}">
          ${GachaSystem.cardArtHtml(card, owned)}
          ${owned ? GachaSystem.starsHtml(card.rarity) : ''}
          <div class="collect-name">${owned ? card.name : '???'}</div>
          <div class="collect-rarity">${owned ? r.label : '未獲得'}</div>
          <span class="collect-zoom-hint">🔍 放大</span>
          ${count > 1 ? `<span class="collect-dup">×${count}</span>` : ''}
        </button>
      `;
    }).join('');
  },

  doGachaPull(poolId, count) {
    if (GachaAnimation._running) return;
    const data = Storage.load();
    AudioManager.playSfx('click');
    let result;
    if (count >= 10) {
      result = GachaSystem.pull10(data, poolId);
    } else {
      result = GachaSystem.pull(data, poolId);
    }

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    Storage.save(data);
    this.renderRewards();
    this.renderHUD();

    GachaAnimation.play(poolId, result.results || [result], () => {
      this.showGachaResult(result, poolId);
    });
  },

  showGachaResult(result, poolId) {
    const pool = GachaSystem.getPool(poolId);
    const area = document.getElementById('gachaResultArea');
    const closeBtn = document.getElementById('gachaModalClose');
    const modalPanel = document.querySelector('.gacha-modal');
    const items = result.results || [result];

    modalPanel?.classList.add('gacha-modal--results');
    area.classList.remove('hidden');
    closeBtn.classList.add('hidden');

    area.innerHTML = `
      <div class="gacha-result-title gacha-reveal-title">${pool.icon} ${pool.name} · 抽卡結果</div>
      <div class="gacha-result-grid ${items.length > 1 ? 'multi' : ''}" id="gachaResultGrid">
        ${items.map((item, i) => {
          const r = GACHA_RARITIES[item.rarity];
          return `
            <button type="button" class="gacha-result-card ${r.css} gacha-card-hidden"
              style="animation-delay:${i * 0.12}s" data-idx="${i}"
              data-card-zoom data-card-id="${item.card.id}" data-owned="true" title="點擊放大欣賞">
              ${GachaSystem.cardArtHtml(item.card, true, 'lg')}
              ${GachaSystem.starsHtml(item.rarity, 'lg')}
              <div class="gacha-card-name">${item.card.name}</div>
              <div class="gacha-card-rarity">${r.label}</div>
              ${item.isNew ? '<span class="gacha-new-tag">NEW!</span>' : '<span class="gacha-dup-tag">重複</span>'}
            </button>
          `;
        }).join('')}
      </div>
      <p class="gacha-cost-note gacha-reveal-note">消耗 ${result.cost} 積分</p>
    `;

    document.getElementById('gachaModal').classList.remove('hidden');

    requestAnimationFrame(() => {
      area.querySelectorAll('.gacha-result-card').forEach((card, i) => {
        setTimeout(() => {
          card.classList.remove('gacha-card-hidden');
          card.classList.add('gacha-card-reveal');
          const rarity = items[i]?.rarity;
          if (rarity === 'ssr' || rarity === 'ur') {
            AudioManager.playSfx(rarity === 'ssr' ? 'gachaSSR' : 'gachaUR');
          }
        }, i * GachaAnimation.REVEAL_STAGGER);
      });
      const totalDelay = items.length * GachaAnimation.REVEAL_STAGGER + 400;
      setTimeout(() => closeBtn.classList.remove('hidden'), totalDelay);
    });
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
    this.renderDailyProgress();
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
