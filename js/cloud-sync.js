const CloudSync = {
  client: null,
  profile: null,
  pushTimer: null,
  status: 'offline',
  lastError: null,

  PROFILE_KEY: 'p5maths_profile',

  isConfigured() {
    return typeof SUPABASE_URL === 'string'
      && typeof SUPABASE_ANON_KEY === 'string'
      && SUPABASE_URL.startsWith('https://')
      && !SUPABASE_URL.includes('YOUR_SUPABASE');
  },

  makeProfileKey(familyCode, studentName) {
    const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, '-');
    return `${norm(familyCode)}::${norm(studentName)}`;
  },

  getProfile() {
    try {
      const raw = localStorage.getItem(this.PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setProfile(familyCode, studentName) {
    const profile = {
      familyCode: familyCode.trim(),
      studentName: studentName.trim(),
      profileKey: this.makeProfileKey(familyCode, studentName)
    };
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    this.profile = profile;
    return profile;
  },

  clearProfile() {
    localStorage.removeItem(this.PROFILE_KEY);
    this.profile = null;
  },

  setStatus(status, error = null) {
    this.status = status;
    this.lastError = error;
    const el = document.getElementById('syncStatus');
    if (!el) return;
    const map = {
      offline: { text: '離線模式', cls: 'sync-offline' },
      syncing: { text: '同步中…', cls: 'sync-syncing' },
      synced: { text: '已同步', cls: 'sync-ok' },
      error: { text: '同步失敗', cls: 'sync-error' }
    };
    const info = map[status] || map.offline;
    el.className = `sync-status ${info.cls}`;
    el.textContent = info.text;
    el.title = error ? String(error) : (this.profile ? `${this.profile.studentName} · 雲端已連線` : '');
  },

  async init() {
    this.profile = this.getProfile();

    if (!this.profile) {
      if (this.isConfigured() && typeof supabase !== 'undefined') {
        this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
      this.setStatus('offline');
      return { ok: false, needSetup: true, mode: this.isConfigured() ? 'cloud' : 'local' };
    }

    if (!this.isConfigured()) {
      this.setStatus('offline');
      return { ok: true, mode: 'local' };
    }

    if (typeof supabase === 'undefined') {
      this.setStatus('error', 'Supabase SDK 未載入');
      return { ok: true, mode: 'local' };
    }

    this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
      this.setStatus('syncing');
      await this.pull();
      this.setStatus('synced');
      return { ok: true, mode: 'cloud' };
    } catch (err) {
      console.error('CloudSync pull failed:', err);
      this.setStatus('error', err.message || err);
      return { ok: true, mode: 'cloud-offline' };
    }
  },

  mergeCardCollection(local = {}, cloud = {}) {
    const pools = new Set([
      ...Object.keys(local || {}),
      ...Object.keys(cloud || {}),
      'pokemon', 'sanrio', 'pixar', 'disney', 'marvel'
    ]);
    const merged = {};
    pools.forEach(pool => {
      merged[pool] = {};
      const localPool = local[pool] || {};
      const cloudPool = cloud[pool] || {};
      const ids = new Set([...Object.keys(localPool), ...Object.keys(cloudPool)]);
      ids.forEach(id => {
        merged[pool][id] = Math.max(localPool[id] || 0, cloudPool[id] || 0);
      });
    });
    return merged;
  },

  mergeGachaStats(local = {}, cloud = {}) {
    const keys = new Set([...Object.keys(local), ...Object.keys(cloud), 'totalPulls', 'pokemon', 'sanrio', 'pixar', 'disney', 'marvel']);
    const merged = {};
    keys.forEach(key => {
      merged[key] = Math.max(local[key] || 0, cloud[key] || 0);
    });
    return merged;
  },

  mergeDailyLog(local = {}, cloud = {}) {
    const merged = { ...local };
    Object.entries(cloud).forEach(([day, cloudDay]) => {
      const localDay = merged[day] || {};
      merged[day] = {
        answered: Math.max(localDay.answered || 0, cloudDay.answered || 0),
        correct: Math.max(localDay.correct || 0, cloudDay.correct || 0),
        points: Math.max(localDay.points || 0, cloudDay.points || 0),
        xp: Math.max(localDay.xp || 0, cloudDay.xp || 0),
        minutes: Math.max(localDay.minutes || 0, cloudDay.minutes || 0),
        dailyChallenge: !!(localDay.dailyChallenge || cloudDay.dailyChallenge),
        goalMet: !!(localDay.goalMet || cloudDay.goalMet)
      };
    });
    return merged;
  },

  mergeLogByDate(local = {}, cloud = {}) {
    const merged = { ...local };
    Object.entries(cloud).forEach(([day, cloudItems]) => {
      const localItems = merged[day] || [];
      const seen = new Set(localItems.map(item => item.id || item.time || JSON.stringify(item)));
      cloudItems.forEach(item => {
        const key = item.id || item.time || JSON.stringify(item);
        if (!seen.has(key)) {
          localItems.push(item);
          seen.add(key);
        }
      });
      merged[day] = localItems;
    });
    return merged;
  },

  mergeProgress(local, cloud, cloudUpdatedAt) {
    const localBase = Storage.migrate(local || Storage.defaultData());
    const cloudBase = Storage.migrate(cloud || Storage.defaultData());
    const localTs = localBase._syncMeta?.updatedAt ? new Date(localBase._syncMeta.updatedAt).getTime() : 0;
    const cloudTs = cloudUpdatedAt ? new Date(cloudUpdatedAt).getTime() : 0;
    const newerIsCloud = cloudTs >= localTs;

    const merged = newerIsCloud ? { ...cloudBase } : { ...localBase };

    merged.points = Math.max(localBase.points || 0, cloudBase.points || 0);
    merged.xp = Math.max(localBase.xp || 0, cloudBase.xp || 0);
    merged.totalAnswered = Math.max(localBase.totalAnswered || 0, cloudBase.totalAnswered || 0);
    merged.totalCorrect = Math.max(localBase.totalCorrect || 0, cloudBase.totalCorrect || 0);
    merged.examCorrect = Math.max(localBase.examCorrect || 0, cloudBase.examCorrect || 0);
    merged.dailyCompleted = Math.max(localBase.dailyCompleted || 0, cloudBase.dailyCompleted || 0);
    merged.streakDays = Math.max(localBase.streakDays || 0, cloudBase.streakDays || 0);
    merged.currentStreak = Math.max(localBase.currentStreak || 0, cloudBase.currentStreak || 0);
    merged.bestStreak = Math.max(localBase.bestStreak || 0, cloudBase.bestStreak || 0);
    merged.cardCollection = this.mergeCardCollection(localBase.cardCollection, cloudBase.cardCollection);
    merged.gachaStats = this.mergeGachaStats(localBase.gachaStats, cloudBase.gachaStats);
    merged.dailyLog = this.mergeDailyLog(localBase.dailyLog, cloudBase.dailyLog);
    merged.wrongLog = this.mergeLogByDate(localBase.wrongLog, cloudBase.wrongLog);
    merged.correctLog = this.mergeLogByDate(localBase.correctLog, cloudBase.correctLog);
    merged.correctBank = { ...(localBase.correctBank || {}), ...(cloudBase.correctBank || {}) };
    merged.topics = {};
    const topicIds = new Set([
      ...Object.keys(localBase.topics || {}),
      ...Object.keys(cloudBase.topics || {})
    ]);
    topicIds.forEach(id => {
      const l = localBase.topics[id] || { answered: 0, correct: 0 };
      const c = cloudBase.topics[id] || { answered: 0, correct: 0 };
      merged.topics[id] = {
        answered: Math.max(l.answered || 0, c.answered || 0),
        correct: Math.max(l.correct || 0, c.correct || 0)
      };
    });
    merged.badges = Array.from(new Set([...(localBase.badges || []), ...(cloudBase.badges || [])]));
    merged.redeemedGifts = Array.from(new Set([...(localBase.redeemedGifts || []), ...(cloudBase.redeemedGifts || [])]));
    merged.lastPracticeDate = [localBase.lastPracticeDate, cloudBase.lastPracticeDate]
      .filter(Boolean)
      .sort()
      .pop() || null;
    merged._syncMeta = {
      updatedAt: new Date(Math.max(localTs, cloudTs, Date.now())).toISOString()
    };
    return Storage.migrate(merged);
  },

  async pull() {
    if (!this.client || !this.profile) return;

    const { data, error } = await this.client
      .from('progress')
      .select('data, updated_at')
      .eq('profile_key', this.profile.profileKey)
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.data) return;

    const cloud = Storage.migrate(data.data);
    const local = Storage.load();
    const merged = this.mergeProgress(local, cloud, data.updated_at);
    Storage.saveLocal(merged);
  },

  schedulePush() {
    if (!this.client || !this.profile) return;
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => this.push(), 600);
  },

  async push() {
    if (!this.client || !this.profile) return;

    try {
      this.setStatus('syncing');
      let payload = Storage.load();

      const { data: remote, error: readError } = await this.client
        .from('progress')
        .select('data, updated_at')
        .eq('profile_key', this.profile.profileKey)
        .maybeSingle();

      if (!readError && remote?.data) {
        payload = this.mergeProgress(payload, Storage.migrate(remote.data), remote.updated_at);
        Storage.saveLocal(payload);
      }

      const row = {
        profile_key: this.profile.profileKey,
        family_code: this.profile.familyCode,
        student_name: this.profile.studentName,
        data: payload,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.client
        .from('progress')
        .upsert(row, { onConflict: 'profile_key' });

      if (error) throw error;
      payload._syncMeta = { updatedAt: row.updated_at };
      Storage.saveLocal(payload);
      this.setStatus('synced');
    } catch (err) {
      console.error('CloudSync push failed:', err);
      this.setStatus('error', err.message || err);
    }
  },

  async registerProfile(familyCode, studentName) {
    const nextKey = this.makeProfileKey(familyCode, studentName);
    const prevProfile = this.getProfile();

    if (prevProfile?.profileKey && prevProfile.profileKey !== nextKey) {
      try { await this.push(); } catch (err) { console.warn('push before switch failed:', err); }
      localStorage.removeItem(Storage.KEY);
    }

    this.setProfile(familyCode, studentName);
    if (!this.client) {
      if (this.isConfigured() && typeof supabase !== 'undefined') {
        this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } else {
        return { ok: true, mode: 'local' };
      }
    }

    try {
      this.setStatus('syncing');
      await this.pull();
      await this.push();
      this.setStatus('synced');
      return { ok: true, mode: 'cloud' };
    } catch (err) {
      console.error('CloudSync register failed:', err);
      this.setStatus('error', err.message || err);
      return { ok: true, mode: 'local-offline' };
    }
  },

  async resetCloud() {
    if (!this.client || !this.profile) return;
    const empty = Storage.defaultData();
    Storage.saveLocal(empty);
    await this.push();
  },

  async fetchStudentData(studentName) {
    if (!this.client || !this.profile) return null;
    const profileKey = this.makeProfileKey(this.profile.familyCode, studentName);
    const { data, error } = await this.client
      .from('progress')
      .select('data')
      .eq('profile_key', profileKey)
      .maybeSingle();
    if (error) throw error;
    return data?.data ? Storage.migrate(data.data) : null;
  }
};
