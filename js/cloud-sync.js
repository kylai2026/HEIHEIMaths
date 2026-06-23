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

  mergeProgress(local, cloud, cloudUpdatedAt) {
    const localTs = local._syncMeta?.updatedAt ? new Date(local._syncMeta.updatedAt).getTime() : 0;
    const cloudTs = cloudUpdatedAt ? new Date(cloudUpdatedAt).getTime() : 0;
    if (cloudTs > localTs) return Storage.migrate(cloud);
    if (localTs > cloudTs) return local;
    if ((cloud.totalAnswered || 0) > (local.totalAnswered || 0)) return Storage.migrate(cloud);
    return local;
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
      const payload = Storage.load();
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
      this.setStatus('synced');
    } catch (err) {
      console.error('CloudSync push failed:', err);
      this.setStatus('error', err.message || err);
    }
  },

  async registerProfile(familyCode, studentName) {
    localStorage.removeItem(Storage.KEY);
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
  }
};
