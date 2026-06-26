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
    selectedGrade: null,
    dailyGrade: null,
    quizGrade: null,
    bossMode: false,
    bossQuestionQueue: [],
    bossPendingResult: null
  },

  getSelectedGrade() {
    return this.state.selectedGrade || UserSettings.load().grade || null;
  },

  getDailyGrade() {
    return this.state.dailyGrade || this.getSelectedGrade() || null;
  },

  getQuizGrade() {
    return this.state.quizGrade || this.getSelectedGrade() || null;
  },

  setDailyGrade(grade) {
    if (!GRADE_ORDER.includes(grade)) return;
    this.state.dailyGrade = grade;
    this.renderActivityGradePickers();
    if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
  },

  setQuizGrade(grade) {
    if (!GRADE_ORDER.includes(grade)) return;
    this.state.quizGrade = grade;
    this.renderActivityGradePickers();
    if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
  },

  setSelectedGrade(grade) {
    if (!GRADE_ORDER.includes(grade)) return;
    UserSettings.save({ grade });
    this.state.selectedGrade = grade;
    document.getElementById('gradeModal')?.classList.add('hidden');
    this.renderGradePicker();
    this.renderTierSections();
    this.renderSidebar();
    this.renderActivityGradePickers();
    if (typeof AudioManager !== 'undefined') AudioManager.playSfx('click');
    if (!CloudSync.getProfile()) {
      this.showProfileSetup();
    }
  },

  showGradeModalIfNeeded() {
    if (this.getSelectedGrade()) return;
    document.getElementById('profileModal')?.classList.add('hidden');
    const modal = document.getElementById('gradeModal');
    if (!modal) return;
    this.renderGradeModalGrid();
    modal.classList.remove('hidden');
  },

  bindGradeDelegation() {
    if (this._gradeBound) return;
    this._gradeBound = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.grade-btn, .practice-grade-tab, .activity-grade-btn, .header-grade-tab');
      if (!btn?.dataset.grade) return;
      e.preventDefault();
      e.stopPropagation();
      const context = btn.dataset.gradeContext;
      if (context === 'daily') {
        this.setDailyGrade(btn.dataset.grade);
        return;
      }
      if (context === 'quiz') {
        this.setQuizGrade(btn.dataset.grade);
        return;
      }
      this.setSelectedGrade(btn.dataset.grade);
    });
  },

  renderGradeModalGrid() {
    const grid = document.getElementById('gradeModalGrid');
    if (!grid) return;
    grid.innerHTML = GRADE_ORDER.map(grade => this.gradeButtonHtml(grade, true)).join('');
  },

  activityGradeButtonHtml(grade, selectedGrade, context) {
    const active = selectedGrade === grade;
    return `
      <button type="button" class="activity-grade-btn ${active ? 'active' : ''}" data-grade="${grade}" data-grade-context="${context}">
        <span class="activity-grade-icon">${GRADE_ICONS[grade]}</span>
        <span>${GRADE_LABELS[grade]}</span>
      </button>
    `;
  },

  renderActivityGradePickers() {
    const dailyGrade = this.getDailyGrade();
    const quizGrade = this.getQuizGrade();

    const dailyEl = document.getElementById('dailyGradePicker');
    if (dailyEl) {
      dailyEl.innerHTML = `
        <p class="activity-grade-label">選擇年級</p>
        <div class="activity-grade-grid">
          ${GRADE_ORDER.map(g => this.activityGradeButtonHtml(g, dailyGrade, 'daily')).join('')}
        </div>
      `;
    }

    const quizEl = document.getElementById('quizGradePicker');
    if (quizEl) {
      quizEl.innerHTML = `
        <p class="activity-grade-label">選擇年級</p>
        <div class="activity-grade-grid">
          ${GRADE_ORDER.map(g => this.activityGradeButtonHtml(g, quizGrade, 'quiz')).join('')}
        </div>
      `;
    }

    const dailyDesc = document.getElementById('dailyChallengeDesc');
    if (dailyDesc) {
      dailyDesc.textContent = dailyGrade
        ? `10 條${GRADE_LABELS[dailyGrade]}隨機題目（初/中/高級混合），按難度賺積分！`
        : '請先揀年級，就會出對應年級嘅 10 條隨機題目。';
    }

    const quizDesc = document.getElementById('quizIntroDesc');
    if (quizDesc) {
      quizDesc.innerHTML = quizGrade
        ? `<strong>20 條選擇題</strong>，只涵蓋${GRADE_LABELS[quizGrade]}課題，難度隨機！`
        : `<strong>20 條選擇題</strong>。請先揀年級，就只會出該年級嘅題目。`;
    }

    const startDaily = document.getElementById('startDaily');
    if (startDaily) startDaily.disabled = !dailyGrade;

    const startQuiz = document.getElementById('startQuiz');
    if (startQuiz) startQuiz.disabled = !quizGrade;
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
    const topTabs = document.getElementById('gradeTopTabs');
    const bar = document.getElementById('practiceGradeBar');
    const selected = this.getSelectedGrade();

    if (topTabs) {
      topTabs.innerHTML = GRADE_ORDER.map(grade => `
        <button type="button" class="header-grade-tab ${selected === grade ? 'active' : ''}" data-grade="${grade}" title="${GRADE_LABELS[grade]}">
          <span class="header-grade-icon">${GRADE_ICONS[grade]}</span>
          <span>${GRADE_LABELS[grade]}</span>
        </button>
      `).join('');
    }

    if (bar) {
      bar.innerHTML = `
        <div class="practice-grade-label">年級</div>
        <div class="practice-grade-tabs">
          ${GRADE_ORDER.map(grade => `
            <button type="button" class="practice-grade-tab ${selected === grade ? 'active' : ''}" data-grade="${grade}">
              ${GRADE_LABELS[grade]}
            </button>
          `).join('')}
        </div>
      `;
    }
    this.updateGradeLabels();
  },

  updateGradeLabels() {
    const grade = this.getSelectedGrade();
    const topCurrent = document.getElementById('gradeTopCurrent');
    const title = document.getElementById('homeTopicsTitle');
    const placeholder = document.getElementById('gradeTopicsPlaceholder');
    const sections = document.getElementById('tierSections');

    if (topCurrent) {
      topCurrent.textContent = grade
        ? `${GRADE_LABELS[grade]}（${countTopicsByGrade(grade)} 個課題）`
        : '請選擇年級';
      topCurrent.classList.toggle('is-set', !!grade);
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
    this.bindAuthButtons();
    this.bindGradeDelegation();
    this.bindModal();
    this.bindCardZoomDelegation();

    const syncResult = await CloudSync.init();
    this.updateAuthUI();
    this.state.selectedGrade = UserSettings.load().grade || null;

    if (!this.getSelectedGrade()) {
      this.showGradeModalIfNeeded();
    } else if (syncResult.needSetup) {
      this.showProfileSetup();
    }

    setTimeout(() => this.bootstrapApp(), 0);
  },

  bootstrapApp() {
    this.bindNavigation();
    this.bindTierSelector();
    this.renderHUD();
    this.renderGradePicker();
    this.renderHome();
    this.renderActivityGradePickers();
    this.renderSidebar();
    this.renderTips();
    this.renderRewards();
    this.renderProgress();
    this.bindPractice();
    this.bindQuiz();
    this.bindDaily();
    this.bindBossBattle();
    this.bindReadQuestion();
    this.bindSessionTracking();
  },

  readQuestionBtnHtml() {
    return '<div class="question-read-row"><button type="button" class="btn-read-question" title="朗讀題目" aria-label="朗讀題目"><span class="btn-read-icon" aria-hidden="true">🔊</span><span class="btn-read-label">朗讀題目</span></button></div>';
  },

  bindReadQuestion() {
    if (this._readQuestionBound) return;
    this._readQuestionBound = true;
    let lastReadAt = 0;
    const run = (e) => {
      const btn = e.target.closest('.btn-read-question');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      if (Date.now() - lastReadAt < 450) return;
      lastReadAt = Date.now();
      let html = '';
      if (this.state.currentView === 'quiz' && this.state.quizQuestions?.length) {
        html = this.state.quizQuestions[this.state.quizIndex]?.question;
      } else if (this.state.currentQuestion?.question) {
        html = this.state.currentQuestion.question;
      }
      if (!html) return;
      if (typeof AudioManager !== 'undefined') {
        AudioManager.speakQuestion(html);
        AudioManager.playSfx('click');
      }
    };
    document.addEventListener('click', run);
    document.addEventListener('touchend', run, { passive: false });
  },

  bindAuthButtons() {
    if (this._authBound) return;
    this._authBound = true;
    document.addEventListener('click', (e) => {
      if (e.target.closest('#loginBtn, #gradeModalLogin')) {
        e.preventDefault();
        e.stopPropagation();
        this.showProfileSetup();
        return;
      }
      if (e.target.closest('#logoutBtn')) {
        e.preventDefault();
        e.stopPropagation();
        this.logout();
        return;
      }
      if (e.target.closest('#switchProfile')) {
        e.preventDefault();
        e.stopPropagation();
        this.logout();
      }
    }, true);
  },

  updateAuthUI() {
    const profile = CloudSync.getProfile();
    const loggedIn = !!profile;
    document.getElementById('loginBtn')?.classList.toggle('hidden', loggedIn);
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
    document.getElementById('gradeModal')?.classList.add('hidden');
    const modal = document.getElementById('profileModal');
    const form = document.getElementById('profileForm');
    const errEl = document.getElementById('profileError');
    if (!modal || !form) return Promise.resolve();

    form.reset();
    errEl?.classList.add('hidden');
    modal.classList.remove('hidden');
    modal.scrollIntoView({ block: 'nearest' });
    setTimeout(() => document.getElementById('studentName')?.focus(), 50);

    return new Promise((resolve) => {
      this._profileSetupResolve = resolve;

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
          if (typeof this.renderHome === 'function') this.renderHome();
          if (typeof this.renderSidebar === 'function') this.renderSidebar();
          if (typeof this.renderProgress === 'function') this.renderProgress();
          if (typeof this.renderRewards === 'function') this.renderRewards();
          this.showGradeModalIfNeeded();
          this._profileSetupResolve?.();
          this._profileSetupResolve = null;
        } catch (err) {
          errEl.textContent = '登入失敗，請再試一次。';
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
      if (GachaAnimation._waitingTap) {
        GachaAnimation.skipToResult();
        return;
      }
      GachaAnimation._clearTimers?.();
      GachaAnimation._stopParticles();
      if (typeof AudioManager !== 'undefined') AudioManager.stopGachaLoop();
      document.getElementById('gachaTapStart')?.classList.add('hidden');
      document.getElementById('gachaModal').classList.add('hidden');
      document.getElementById('gachaAnimStage').innerHTML = '';
      document.getElementById('gachaResultArea').classList.add('hidden');
      document.getElementById('gachaModalClose').classList.add('hidden');
      document.querySelector('.gacha-modal')?.classList.remove('gacha-modal--results', 'is-animating');
      GachaAnimation._running = false;
      GachaAnimation._waitingTap = false;
      GachaAnimation._pending = null;
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
    if (typeof AudioManager !== 'undefined') AudioManager.stopSpeaking();
    if (this.state.bossMode && view !== 'practice') {
      if (!confirm('確定退出 BOSS 關卡？而家嘅進度唔會儲存。')) return;
      this.cleanupBossBattle();
    }
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
    if (view === 'quiz') this.renderActivityGradePickers();
    if (view === 'practice' && !this.getSelectedGrade()) this.showGradeModalIfNeeded();
    this.renderHUD();
  },

  bindBossBattle() {
    BossBattle.initEntryArt();
    document.getElementById('startBossBattle')?.addEventListener('click', () => {
      AudioManager.playSfx('click');
      this.startBossBattle();
    });
    document.getElementById('bossBattlePanel')?.addEventListener('click', (e) => {
      if (e.target.closest('#bossQuitBtn')) {
        e.preventDefault();
        this.quitBossBattle();
      }
    });
  },

  startBossBattle() {
    const grade = this.getSelectedGrade();
    if (!grade) {
      this.showGradeModalIfNeeded();
      return;
    }

    BossBattle.reset();
    BossBattle.showPanel(true);
    BossBattle.renderArena();
    AudioManager.startBossMusic();

    this.state.bossMode = true;
    this.state.bossQuestionQueue = [];
    this.state.bossPendingResult = null;
    this.state.dailyMode = false;
    this.state.randomMode = false;
    this.state.noPointsMode = false;
    this.state.sessionCorrect = [];
    this.state.practiceTopic = 'boss';
    this.state.practiceQuestions = BossBattle.pullQuestions(30, grade);
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;

    this.updateBossPracticeTitle();
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));

    this.switchView('practice');
    this.showPracticeQuestion();
  },

  updateBossPracticeTitle() {
    const cfg = BossBattle.getStageConfig();
    document.getElementById('practiceTitle').textContent =
      `⚡ BOSS ${cfg.label} · 打倒 ${BossBattle.boss.name}！`;
    document.getElementById('practiceTopicBadge').textContent =
      `第 ${BossBattle.currentStage}/${BossBattle.STAGES.length} 關 · 連續 ${cfg.streakForUlt} 題十萬伏特`;
  },

  endBossBattle(restoreLayout = true) {
    if (!this.state.bossMode) return;
    this.state.bossMode = false;
    this.state.bossPendingResult = null;
    clearTimeout(BossBattle._ultimateTimer);
    AudioManager.stopBossMusic();
    if (restoreLayout) {
      BossBattle.showPanel(false);
      document.getElementById('tierSelector')?.classList.remove('hidden');
      document.querySelector('.topic-sidebar')?.classList.remove('hidden');
      document.querySelector('.practice-layout')?.classList.remove('boss-mode');
    }
  },

  cleanupBossBattle() {
    this.endBossBattle(true);
    this.state.bossQuestionQueue = [];
    this.state.practiceTopic = null;
    this.state.practiceQuestions = [];
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;
    document.getElementById('practiceTitle').textContent = '選擇課題開始練習';
    document.getElementById('practiceTopicBadge').textContent = '';
    document.getElementById('practiceCount').textContent = '0 / 10';
    document.getElementById('questionCard').innerHTML = '<p class="placeholder-text">👈 請喺左邊揀一個課題</p>';
    document.getElementById('answerArea').classList.add('hidden');
    document.getElementById('practiceMcqArea')?.classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('solutionBox')?.classList.add('hidden');
  },

  quitBossBattle() {
    if (!this.state.bossMode) return;
    if (!confirm('確定退出 BOSS 關卡？而家嘅進度唔會儲存。')) return;
    AudioManager.playSfx('click');
    this.cleanupBossBattle();
    this.switchView('home');
  },

  showBossEndScreen(won) {
    AudioManager.playSfx(won ? 'bossWin' : 'bossLose');
    const data = Storage.load();
    const bonus = won ? 40 : 0;
    if (bonus) {
      data.points = (data.points || 0) + bonus;
      Storage.save(data);
      this.renderHUD();
    }

    const boss = BossBattle.boss;

    document.getElementById('questionCard').innerHTML = `
      <h3>${won ? '🏆 三關全破！' : '😵 比卡超倒下了…'}</h3>
      ${won ? `<div class="boss-end-hero"><img src="${BossBattle.playerSpriteUrl()}" alt="比卡超" class="boss-end-sprite boss-end-sprite--player" onerror="this.onerror=null;this.src='${BossBattle.playerFallbackUrl()}'"></div>` : ''}
      <p>${won
        ? `比卡超連續擊敗 3 關 BOSS，最後打敗 ${boss.name}！獎勵 +${bonus} 積分`
        : `第 ${BossBattle.currentStage} 關失手了，再練習多啲一定可以！`}</p>
      <button type="button" class="btn btn-boss" id="bossRetryBtn">再戰 BOSS</button>
      <button type="button" class="btn btn-secondary" id="bossHomeBtn">返回首頁</button>
    `;
    document.getElementById('answerArea').classList.add('hidden');
    document.getElementById('practiceMcqArea')?.classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('bossRetryBtn')?.addEventListener('click', () => {
      this.endBossBattle();
      this.startBossBattle();
    });
    document.getElementById('bossHomeBtn')?.addEventListener('click', () => {
      this.endBossBattle();
      this.switchView('home');
    });
  },

  showBossStageClear() {
    const clearedStage = BossBattle.currentStage;
    const clearedCfg = BossBattle.getStageConfig(clearedStage);
    const nextStage = clearedStage + 1;
    const nextCfg = BossBattle.getStageConfig(nextStage);
    const boss = BossBattle.boss;

    document.getElementById('questionCard').innerHTML = `
      <h3>✨ ${clearedCfg.label} 通過！</h3>
      <p>比卡超打敗了 <strong>${boss.name}</strong>（${boss.type}系）！</p>
      <p class="boss-stage-next-hint">下一關 <strong>${nextCfg.label}</strong>：BOSS HP ${nextCfg.bossMaxHp}、反擊 -${nextCfg.counter} HP、題目更難！</p>
      <button type="button" class="btn btn-boss" id="bossNextStageBtn">挑戰第 ${nextStage} 關</button>
      <button type="button" class="btn btn-secondary" id="bossQuitStageBtn">退出 BOSS</button>
    `;
    document.getElementById('answerArea').classList.add('hidden');
    document.getElementById('practiceMcqArea')?.classList.add('hidden');
    document.getElementById('actionRow').classList.add('hidden');
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('solutionBox')?.classList.add('hidden');

    document.getElementById('bossNextStageBtn')?.addEventListener('click', () => {
      const grade = this.getSelectedGrade();
      BossBattle.advanceToNextStage();
      BossBattle.renderArena();
      this.updateBossPracticeTitle();
      this.state.practiceAnswered = false;
      this.state.bossPendingResult = null;
      this.state.practiceQuestions.push(...BossBattle.pullQuestions(12, grade));
      document.getElementById('solutionBox')?.classList.remove('hidden');
      this.showPracticeQuestion();
    });
    document.getElementById('bossQuitStageBtn')?.addEventListener('click', () => this.quitBossBattle());
  },

  finishBossAnswerFlow(correct, q, rewardMsg) {
    const br = this.state.bossPendingResult;
    const afterEffects = () => {
      BossBattle.renderArena();
      if (br?.stageCleared) {
        setTimeout(() => this.showBossStageClear(), 600);
        return;
      }
      if (br?.bossDefeated) {
        setTimeout(() => this.showBossEndScreen(true), 600);
        return;
      }
      if (br?.playerDefeated) {
        setTimeout(() => this.showBossEndScreen(false), 600);
        return;
      }
      this.showFeedback(correct, q, rewardMsg, br);
    };

    if (br?.ultimate) {
      BossBattle.playUltimate(afterEffects);
    } else {
      BossBattle.onHitEffects(br);
      afterEffects();
    }
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
      list.innerHTML = '<p class="correct-bank-empty">答對題目會儲存喺呢度，可以揀選重做。</p>';
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
    if (btn) {
      btn.classList.remove('hidden');
      btn.onclick = () => this.startRedoFromBank();
    }
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
    this.state.noPointsMode = false;
    this.state.sessionCorrect = [];
    this.state.practiceTopic = 'redo';
    this.state.practiceQuestions = questions.map(q => ({ ...q }));
    this.state.practiceIndex = 0;
    this.state.practiceAnswered = false;

    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    document.getElementById('practiceTitle').textContent = '重做練習';
    document.getElementById('practiceTopicBadge').textContent = `${questions.length} 題 · 答對計分`;
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
              return `<button class="btn btn-sm section-random-btn ${t.cssClass}" data-tier="${tierKey}" data-section="${sec.id}"><img src="${TopicArt.tier(tierKey)}" alt="" class="section-tier-img"> ${t.name}隨機</button>`;
            }).join('')}
          </div>
          <div class="topic-grid compact">
            ${topics.map(topic => `
              <div class="topic-card exam-card" data-topic="${topic.id}">
                <img src="${TopicArt.topic(topic)}" alt="" class="topic-art-img">
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
    this.renderActivityGradePickers();
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
    if (typeof AudioManager !== 'undefined') AudioManager.stopSpeaking();
    const q = this.state.practiceQuestions[this.state.practiceIndex];
    const total = this.state.practiceQuestions.length;
    const current = this.state.practiceIndex + 1;
    const tierInfo = DIFFICULTY_TIERS[q.tier || this.state.practiceTier];
    const bossDmg = this.state.bossMode ? BossBattle.getDamage(q.tier || 'medium') : 0;
    const pointsBadge = this.state.bossMode
      ? `<span class="badge ${tierInfo.cssClass}">${tierInfo.icon} ${tierInfo.name} -${bossDmg} BOSS HP</span>`
      : `<span class="badge ${tierInfo.cssClass}">${tierInfo.icon} ${tierInfo.name} +${tierInfo.points}分</span>`;

    document.getElementById('practiceCount').textContent = `${current} / ${total}`;
    const topicName = q.topicId ? (TOPICS.find(t => t.id === q.topicId)?.name || '') : '';
    document.getElementById('questionCard').innerHTML = `
      <div class="question-head">
        <p>第 ${current} 題
          ${pointsBadge}
          ${topicName ? `<span class="badge">${topicName}</span>` : ''}
        </p>
      </div>
      <div class="math-expr">${q.question}</div>
      ${this.readQuestionBtnHtml()}
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

  getPracticeMode() {
    if (this.state.bossMode) return 'boss';
    if (this.state.dailyMode) return 'daily';
    return 'practice';
  },

  processAnswer(correct, topicId, tier, userAnswer = '') {
    this.trackSessionTime();
    AudioManager.playSfx(correct ? 'correct' : 'wrong');

    const data = Storage.load();
    const q = this.state.currentQuestion;
    const scoreResult = Scoring.awardAnswer(data, correct, tier);

    if (!correct && q) {
      Storage.recordWrongAnswer(data, q, userAnswer, this.getPracticeMode());
    }

    if (q?.poolKey) Scoring.markQuestionCompleted(data, tier, q.poolKey);
    if (correct && q) {
      Storage.saveCorrectQuestion(data, q);
      Storage.recordCorrectLog(data, q, this.getPracticeMode());
    }
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
      if (scoreResult.pointsEarned > 0) {
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
        TopicArt.tier('medium'));
    }

    if (scoreResult.newBadges.length > 0) {
      const badges = scoreResult.newBadges.map(b => `${b.icon} ${b.name}`).join('<br>');
      setTimeout(() => this.showModal('🏅', '獲得新徽章！', badges), scoreResult.levelUp ? 800 : 0);
    }

    if (this.state.bossMode && correct) {
      const br = BossBattle.resolveAnswer(true, tier);
      this.state.bossPendingResult = br;
    } else if (this.state.bossMode && !correct) {
      const br = BossBattle.resolveAnswer(false, tier);
      this.state.bossPendingResult = br;
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

  showFeedback(correct, q, rewardMsg, battleResult = null) {
    const feedback = document.getElementById('feedback');
    const solutionBox = document.getElementById('solutionBox');
    const showSolutionBtn = document.getElementById('showSolution');
    feedback.classList.remove('hidden', 'correct', 'wrong', 'boss-hit');
    solutionBox.classList.remove('teach-box');
    solutionBox.classList.add('hidden');

    const br = battleResult || this.state.bossPendingResult;

    if (correct) {
      feedback.classList.add('correct');
      if (this.state.bossMode && br) {
        feedback.classList.add('boss-hit');
        feedback.innerHTML = `🎉 答對了！<br><strong>${br.message}</strong>${rewardMsg ? '<br><small>' + rewardMsg + '</small>' : ''}`;
      } else {
        feedback.innerHTML = `🎉 答對了！${rewardMsg ? '<br><small>' + rewardMsg + '</small>' : ''}`;
      }
      showSolutionBtn.classList.remove('hidden');
    } else {
      feedback.classList.add('wrong');
      if (this.state.bossMode && br) {
        feedback.innerHTML = `❌ 答錯了<br><strong>${br.message}</strong>`;
      } else {
        feedback.innerHTML = `❌ 答錯了，今次冇積分。睇下面學返點做！`;
      }
      showSolutionBtn.classList.add('hidden');
      this.showTeachingSolution(q);
    }
    document.getElementById('actionRow').classList.remove('hidden');
    this.state.practiceAnswered = true;
    this.state.bossPendingResult = null;
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
    const rewardMsg = this.processAnswer(correct, topicId, tier, input);
    document.getElementById('answerInput').disabled = true;
    document.getElementById('submitAnswer').disabled = true;
    if (this.state.bossMode) {
      this.finishBossAnswerFlow(correct, q, rewardMsg);
    } else {
      this.showFeedback(correct, q, rewardMsg);
    }
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

    const userAnswer = q.options?.[selectedIndex] ?? String(selectedIndex);
    const tier = q.tier || this.state.practiceTier;
    const rewardMsg = this.processAnswer(correct, topicId, tier, userAnswer);
    if (this.state.bossMode) {
      this.finishBossAnswerFlow(correct, q, rewardMsg);
    } else {
      this.showFeedback(correct, q, rewardMsg);
    }
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
      <p>繼續練習，抽卡收集小精靈、Sanrio 同 PIXAR！</p>
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
    if (this.state.bossMode) {
      const br = BossBattle.lastResult;
      if (br?.bossDefeated || br?.playerDefeated || br?.stageCleared) return;
    }

    this.state.practiceIndex++;
    if (this.state.practiceIndex >= this.state.practiceQuestions.length) {
      if (this.state.bossMode) {
        const grade = this.getSelectedGrade();
        this.state.practiceQuestions.push(...BossBattle.pullQuestions(10, grade));
        if (this.state.practiceIndex >= this.state.practiceQuestions.length) return;
      } else {
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
    }
    this.showPracticeQuestion();
  },

  bindDaily() {
    document.getElementById('startDaily').addEventListener('click', () => {
      const grade = this.getDailyGrade();
      if (!grade) return;
      AudioManager.playSfx('click');
      this.state.dailyMode = true;
      this.state.randomMode = true;
      this.state.noPointsMode = false;
      this.state.sessionCorrect = [];
      this.state.randomTopicPool = getExamTopicsByGrade(grade);
      this.state.practiceTopic = 'random';
      this.state.practiceQuestions = QuestionBank.generateDaily(10, grade);
      this.state.practiceIndex = 0;

      document.getElementById('practiceTitle').textContent = '今日挑戰';
      document.getElementById('practiceTopicBadge').textContent = `${GRADE_LABELS[grade]} · 隨機難度 · 每題按難度計分`;
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
    const grade = this.getQuizGrade();
    if (!grade) return;
    this.state.quizQuestions = QuestionBank.generateQuiz(20, grade);
    this.state.quizIndex = 0;
    this.state.quizScore = 0;
    this.state.quizWeak = {};

    document.getElementById('quizIntro').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    document.getElementById('quizActive').classList.remove('hidden');
    this.showQuizQuestion();
  },

  showQuizQuestion() {
    if (typeof AudioManager !== 'undefined') AudioManager.stopSpeaking();
    document.getElementById('quizTeachBox')?.classList.add('hidden');
    const q = this.state.quizQuestions[this.state.quizIndex];
    const total = this.state.quizQuestions.length;
    const current = this.state.quizIndex + 1;

    document.getElementById('quizProgress').textContent = `第 ${current} / ${total} 題`;
    document.getElementById('quizProgressFill').style.width = `${(current / total) * 100}%`;
    document.getElementById('quizQuestion').innerHTML = `
      <div class="question-head">
        <span class="badge">${q.topicName}</span>
      </div>
      <div class="math-expr">${q.question}</div>
      ${this.readQuestionBtnHtml()}
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
    if (correct) {
      Storage.recordCorrectLog(qData, q, 'quiz');
    } else {
      Storage.recordWrongAnswer(qData, q, q.options?.[selectedIndex] ?? '', 'quiz');
    }
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
    if (pct >= 100) { grade = '滿分 🏆'; message = '全部答對！獲得 40 積分！'; }
    else if (pct >= 80) { grade = '優秀 🌟'; message = '太勁啦！獲得 30 積分！'; }
    else if (pct >= 60) { grade = '合格 ✓'; message = '達到合格標準！針對弱項再練會更好！'; }
    else { grade = '繼續加油 💪'; message = '要達 60% 先合格，針對弱項多練習！'; }

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
      ${quizReward.pointsEarned > 0 || quizReward.bonusXp > 0 ? `<p class="reward-line">🎁 獎勵：${[
        quizReward.pointsEarned > 0 ? `+${quizReward.pointsEarned} 積分` : '',
        quizReward.bonusXp > 0 ? `+${quizReward.bonusXp} XP` : ''
      ].filter(Boolean).join(' · ')}</p>` : ''}
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
      <img src="${TopicArt.tier('medium')}" alt="" class="level-hero-img">
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
    document.getElementById('gachaPools').innerHTML = getPullablePools().map(pool => {
      const stats = GachaSystem.getCollectionStats(data, pool.id);
      const pct = Math.round((stats.owned / stats.total) * 100);
      const previews = GachaSystem.getPreviewCards(pool.id);
      return `
        <div class="gacha-pool-card pool-${pool.id}">
          <div class="gacha-pool-banner gacha-banner-${pool.id}">
            <img src="${getPoolBannerChar(pool.id)}" alt="${pool.name}" class="gacha-banner-hero" loading="lazy"
              onerror="this.onerror=null;this.style.display='none'">
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
    const tabPools = getCollectionTabPools(data);
    let active = this.state.gachaCollectionPool || 'pokemon';
    if (!tabPools.some(p => p.id === active)) {
      active = tabPools[0]?.id || 'pokemon';
      this.state.gachaCollectionPool = active;
    }
    document.getElementById('gachaCollectionTabs').innerHTML = tabPools.map(pool => {
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
          const rarity = items[i]?.rarity;
          card.classList.add('gacha-card-reveal');
          if (rarity === 'ssr') {
            card.classList.add('gacha-reveal-ssr');
            AudioManager.playSfx('gachaSSR');
          } else if (rarity === 'ur') {
            card.classList.add('gacha-reveal-ur');
            AudioManager.playSfx('gachaUR');
          } else if (rarity === 'sr') {
            card.classList.add('gacha-reveal-sr');
            AudioManager.playSfx('gachaSR');
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
        <div class="tip-icon"><img src="${TopicArt.icon(tip.icon)}" alt=""></div>
        <h3>${tip.title}</h3>
        <div class="formula">${tip.formula}</div>
        <ul>${tip.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    `).join('');
  },

  renderProgress() {
    const data = Storage.load();
    this.renderDailyProgress();
    this.renderParentWrongPanel();
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

    const grade = this.getSelectedGrade();
    const topicList = grade && typeof getTopicsByGrade === 'function'
      ? getTopicsByGrade(grade)
      : TOPICS;

    document.getElementById('topicProgressList').innerHTML = topicList.map(t => {
      const stats = data.topics[t.id] || { answered: 0, correct: 0 };
      const hasData = stats.answered > 0;
      const acc = hasData ? Math.round((stats.correct / stats.answered) * 100) : 0;
      const barClass = !hasData ? 'empty' : acc >= 70 ? '' : acc >= 50 ? 'mid' : 'low';
      const scoreText = hasData
        ? `${stats.correct}/${stats.answered}（${acc}%）`
        : '尚未練習';
      return `
        <div class="topic-progress-item">
          <div class="topic-progress-header">
            <span>${t.icon} ${t.name}</span>
            <span class="topic-progress-score ${hasData ? '' : 'topic-progress-score--empty'}">${scoreText}</span>
          </div>
          <div class="topic-progress-bar">
            <div class="topic-progress-fill ${barClass}" style="width:${hasData ? acc : 0}%"></div>
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
  },

  async renderParentWrongPanel() {
    const panel = document.getElementById('parentWrongPanel');
    if (!panel) return;

    const profile = CloudSync.getProfile();
    const canWatch = profile && typeof canWatchChildren === 'function' && canWatchChildren(profile.studentName);

    if (!canWatch) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }

    panel.classList.remove('hidden');
    const dateKey = Storage.getDateKey();
    const childNames = typeof getWatchChildren === 'function' ? getWatchChildren() : ['heihei', 'chunchun'];
    const labels = { heihei: '晞晞 (heihei)', chunchun: '雋雋 (chunchun)' };
    const modeLabel = { practice: '練習', daily: '今日挑戰', quiz: '小測', boss: 'BOSS' };

    panel.innerHTML = `
      <h3>👨‍👩‍👧 子女今日學習記錄</h3>
      <p class="parent-wrong-intro muted-text">查看 ${childNames.map(n => labels[n] || n).join('、')} 今日答對同答錯嘅題目。</p>
      <div class="parent-wrong-loading">載入中…</div>
    `;

    const loadingEl = panel.querySelector('.parent-wrong-loading');
    const sections = [];

    for (const child of childNames) {
      let childData = null;
      try {
        if (CloudSync.isConfigured() && CloudSync.client) {
          childData = await CloudSync.fetchStudentData(child);
        }
      } catch (err) {
        console.warn('fetch child data failed:', child, err);
      }

      const corrects = childData ? Storage.getCorrectLogForDate(childData, dateKey) : [];
      const wrongs = childData ? Storage.getWrongLogForDate(childData, dateKey) : [];
      const displayName = labels[child] || child;

      const correctHtml = corrects.length
        ? corrects.slice().reverse().map(c => `
            <div class="parent-correct-item">
              <div class="parent-wrong-meta">
                <span class="badge">${c.tierLabel || c.tier || '練習'}</span>
                <span>${c.topicName || ''}</span>
                <span class="muted-text">${modeLabel[c.mode] || c.mode || '練習'}</span>
              </div>
              <div class="parent-wrong-q">${c.question || '（題目）'}</div>
              <div class="parent-correct-ans">✅ 答對：${c.correctAnswer || '—'}</div>
            </div>
          `).join('')
        : '<p class="muted-text parent-sub-empty">今日暫時冇答對記錄</p>';

      const wrongHtml = wrongs.length
        ? wrongs.slice().reverse().map(w => `
            <div class="parent-wrong-item">
              <div class="parent-wrong-meta">
                <span class="badge">${w.tierLabel || w.tier || '練習'}</span>
                <span>${w.topicName || ''}</span>
                <span class="muted-text">${modeLabel[w.mode] || w.mode || '練習'}</span>
              </div>
              <div class="parent-wrong-q">${w.question || '（題目）'}</div>
              <div class="parent-wrong-ans">
                <span class="wrong-user">答：${w.userAnswer || '—'}</span>
                <span class="wrong-correct">正確：${w.correctAnswer || '—'}</span>
              </div>
            </div>
          `).join('')
        : '<p class="muted-text parent-sub-empty">今日暫時冇答錯記錄 🎉</p>';

      sections.push(`
        <div class="parent-child-section">
          <h4>${displayName}</h4>
          <div class="parent-child-subsection">
            <h5>✅ 答對 <span class="parent-correct-count">${corrects.length} 題</span></h5>
            <div class="parent-correct-list">${correctHtml}</div>
          </div>
          <div class="parent-child-subsection">
            <h5>❌ 答錯 <span class="parent-wrong-count">${wrongs.length} 題</span></h5>
            <div class="parent-wrong-list">${wrongHtml}</div>
          </div>
        </div>
      `);
    }

    if (loadingEl) {
      loadingEl.outerHTML = sections.join('') || '<p class="muted-text">暫時冇資料</p>';
    }
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init().catch((err) => {
    console.error('App init failed:', err);
    alert('網站載入出錯，請重新整理頁面再試。');
  });
});
