/**
 * Five full end-to-end Cloudflare dual-sync audits.
 * Run: node scripts/audit-cloudflare-sync-5x.mjs
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = 'https://heiheimaths-progress.heiheimaths.workers.dev';
const sbUrl = 'https://dptzfcfmyplqnxfqndub.supabase.co/rest/v1/progress';
const sbKey = 'sb_publishable_uvWhBj7R-Kc2t8tubTRCiA_I0qsAYGC';
const ROUNDS = 5;

function hash(o) {
  return createHash('sha256').update(JSON.stringify(o)).digest('hex');
}

function loadCloudSync() {
  const code = readFileSync(join(root, 'js/cloud-sync.js'), 'utf8');
  const ctx = createContext({
    console,
    setTimeout,
    clearTimeout,
    localStorage: {
      _d: {},
      getItem(k) {
        return this._d[k] ?? null;
      },
      setItem(k, v) {
        this._d[k] = String(v);
      },
      removeItem(k) {
        delete this._d[k];
      },
    },
    document: { getElementById() { return null; } },
    Storage: {
      migrate(d) {
        return d || this.defaultData();
      },
      defaultData() {
        return {
          points: 0,
          bonusPoints: 0,
          gachaPointsSpent: 0,
          xp: 0,
          totalAnswered: 0,
          totalCorrect: 0,
          examCorrect: 0,
          dailyCompleted: 0,
          streakDays: 0,
          currentStreak: 0,
          bestStreak: 0,
          cardCollection: {},
          gachaStats: {},
          dailyLog: {},
          wrongLog: {},
          correctLog: {},
          correctBank: {},
          topics: {},
          badges: [],
          redeemedGifts: [],
          lastPracticeDate: null,
        };
      },
      load() {
        return this.defaultData();
      },
      saveLocal() {},
      KEY: 'p5maths_data',
    },
    CLOUD_SYNC_MODE: 'dual',
    CLOUDFLARE_PROGRESS_URL: base,
    SUPABASE_URL: 'https://dptzfcfmyplqnxfqndub.supabase.co',
    SUPABASE_ANON_KEY: sbKey,
    supabase: undefined,
    fetch,
  });
  runInContext(`${code}\nthis.CloudSync = CloudSync;`, ctx);
  return ctx.CloudSync;
}

async function cfGet(key, origin) {
  const headers = origin ? { Origin: origin } : {};
  const res = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(key)}`, { headers });
  return {
    status: res.status,
    cors: res.headers.get('access-control-allow-origin'),
    body: await res.json(),
  };
}

async function cfPut(key, family, student, data, origin) {
  const headers = { 'Content-Type': 'application/json' };
  if (origin) headers.Origin = origin;
  const res = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ family_code: family, student_name: student, data }),
  });
  return {
    status: res.status,
    cors: res.headers.get('access-control-allow-origin'),
    body: await res.json(),
  };
}

async function sbGet(key) {
  const res = await fetch(`${sbUrl}?profile_key=eq.${encodeURIComponent(key)}&select=data,updated_at`, {
    headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` },
  });
  const arr = await res.json();
  return { status: res.status, row: Array.isArray(arr) ? arr[0] : null };
}

async function round(n, CloudSync, backup) {
  console.log(`\n########## ROUND ${n}/${ROUNDS} ##########`);
  let fail = 0;

  // A. Backup integrity
  console.log(`-- R${n}.A backup hash --`);
  for (const row of backup.rows) {
    const got = await cfGet(row.profile_key);
    const ok = got.status === 200 && got.body?.data && hash(got.body.data) === hash(row.data);
    if (!ok) {
      console.log('FAIL hash', row.profile_key);
      fail++;
    } else console.log('OK', row.profile_key);
  }

  // B. CF == Supabase for live accounts
  console.log(`-- R${n}.B CF==SB --`);
  for (const key of ['2026::heihei', '2026::chunchun', '2026::test', '2026::mother']) {
    const cf = await cfGet(key);
    const sb = await sbGet(key);
    const ok = cf.body?.data && sb.row?.data && hash(cf.body.data) === hash(sb.row.data);
    if (!ok) {
      console.log('FAIL CF!=SB', key);
      fail++;
    } else console.log('OK CF=SB', key);
  }

  // C. Dual merge must keep richer spent/cards
  console.log(`-- R${n}.C dual merge --`);
  const emptyBase = {
    points: 0,
    bonusPoints: 0,
    gachaPointsSpent: 0,
    xp: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    examCorrect: 0,
    dailyCompleted: 0,
    streakDays: 0,
    currentStreak: 0,
    bestStreak: 0,
    cardCollection: {},
    gachaStats: {},
    dailyLog: {},
    wrongLog: {},
    correctLog: {},
    correctBank: {},
    topics: {},
    badges: [],
    redeemedGifts: [],
    lastPracticeDate: null,
    _syncMeta: { updatedAt: '2026-10-12T12:00:00.000Z' },
  };
  const rich = {
    ...emptyBase,
    gachaPointsSpent: 3610,
    gachaStats: { totalPulls: 375 },
    cardCollection: { marvel: { a: 1, b: 2 } },
    _syncMeta: { updatedAt: '2026-10-01T00:00:00.000Z' },
  };
  const merged = CloudSync.mergeProgress(emptyBase, rich, '2026-10-01T00:00:00.000Z');
  if (merged.gachaPointsSpent !== 3610 || Object.keys(merged.cardCollection.marvel || {}).length !== 2) {
    console.log('FAIL merge');
    fail++;
  } else console.log('OK merge');

  // D. dual updated_at must NOT always become "now"
  console.log(`-- R${n}.D dual updated_at stability --`);
  const syncSrc = readFileSync(join(root, 'js/cloud-sync.js'), 'utf8');
  if (syncSrc.includes('Math.max(cfTs, sbTs, Date.now())')) {
    console.log('FAIL dual still injects Date.now() into updated_at');
    fail++;
  } else console.log('OK dual updated_at uses backend timestamps');

  // E. E2E probe write/read/cleanup + CORS
  console.log(`-- R${n}.E probe E2E --`);
  const probeKey = `2026::__cf_audit_r${n}__`;
  const marker = { points: 10 + n, bonusPoints: n, _audit: true, note: `r${n}-${Date.now()}` };
  const put = await cfPut(probeKey, '2026', `__cf_audit_r${n}__`, marker, 'https://kylai2026.github.io');
  if (put.status !== 200 || put.body?.data?.points !== 10 + n || put.cors !== 'https://kylai2026.github.io') {
    console.log('FAIL put', put.status, put.cors, put.body?.data?.points);
    fail++;
  } else console.log('OK put');
  const got = await cfGet(probeKey, 'http://localhost:8765');
  if (got.status !== 200 || got.body?.data?.note !== marker.note || got.cors !== 'http://localhost:8765') {
    console.log('FAIL get', got.status, got.cors);
    fail++;
  } else console.log('OK get');
  await cfPut(probeKey, '2026', `__cf_audit_r${n}__`, { points: 0, cleaned: true, _audit: true });

  // F. Large payload roundtrip (chunchun clone on probe key, then restore)
  console.log(`-- R${n}.F large payload --`);
  const chunchun = backup.rows.find((r) => r.profile_key === '2026::chunchun');
  const largeKey = '2026::__cf_large_probe__';
  const largePut = await cfPut(largeKey, '2026', '__cf_large_probe__', chunchun.data, 'https://kylai2026.github.io');
  const largeGet = await cfGet(largeKey);
  const largeOk =
    largePut.status === 200 &&
    largeGet.status === 200 &&
    hash(largeGet.body.data) === hash(chunchun.data);
  if (!largeOk) {
    console.log('FAIL large', largePut.status, largeGet.status);
    fail++;
  } else console.log('OK large chunchun-sized roundtrip');
  await cfPut(largeKey, '2026', '__cf_large_probe__', { points: 0, cleaned: true, _audit: true });

  // G. Real accounts still intact
  console.log(`-- R${n}.G real accounts --`);
  for (const key of ['2026::heihei', '2026::chunchun', '2026::test']) {
    const row = backup.rows.find((x) => x.profile_key === key);
    const remote = await cfGet(key);
    const ok = hash(row.data) === hash(remote.body.data);
    if (!ok) {
      console.log('CORRUPTED', key);
      fail++;
    } else console.log('STILL OK', key);
  }

  // H. API edge cases
  console.log(`-- R${n}.H edges --`);
  const opt = await fetch(`${base}/api/progress?profile_key=2026%3A%3Atest`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://kylai2026.github.io',
      'Access-Control-Request-Method': 'PUT',
    },
  });
  if (opt.status !== 204) {
    console.log('FAIL options', opt.status);
    fail++;
  } else console.log('OK options');

  const missing = await fetch(`${base}/api/progress`, {
    headers: { Origin: 'https://kylai2026.github.io' },
  });
  const missingCors = missing.headers.get('access-control-allow-origin');
  if (missing.status !== 400 || !missingCors) {
    console.log('FAIL missing-key', missing.status, missingCors);
    fail++;
  } else console.log('OK missing-key CORS');

  const badJson = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent('2026::__badjson__')}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Origin: 'https://kylai2026.github.io' },
    body: '{not-json',
  });
  if (badJson.status !== 400) {
    console.log('FAIL bad json', badJson.status);
    fail++;
  } else console.log('OK bad json');

  const noFamily = await cfPut('2026::__nofamily__', '', 'x', { points: 1 }, 'https://kylai2026.github.io');
  if (noFamily.status !== 400) {
    console.log('FAIL no family', noFamily.status);
    fail++;
  } else console.log('OK no family');

  // I. Frontend wiring
  console.log(`-- R${n}.I wiring --`);
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const cfg = readFileSync(join(root, 'js/cloudflare-config.js'), 'utf8');
  if (!html.includes('cloudflare-config.js') || !html.includes('cloud-sync.js?v=38')) {
    console.log('FAIL html wiring');
    fail++;
  } else console.log('OK html wiring');
  if (!cfg.includes(base) || !cfg.includes("CLOUD_SYNC_MODE = 'dual'")) {
    console.log('FAIL config');
    fail++;
  } else console.log('OK config');

  // J. Concurrent GETs stable
  console.log(`-- R${n}.J concurrent GET --`);
  const results = await Promise.all([
    cfGet('2026::chunchun'),
    cfGet('2026::chunchun'),
    cfGet('2026::heihei'),
    cfGet('2026::heihei'),
  ]);
  const hC1 = hash(results[0].body.data);
  const hC2 = hash(results[1].body.data);
  const hH1 = hash(results[2].body.data);
  const hH2 = hash(results[3].body.data);
  if (hC1 !== hC2 || hH1 !== hH2) {
    console.log('FAIL concurrent mismatch');
    fail++;
  } else console.log('OK concurrent stable');

  console.log(fail ? `ROUND ${n} FAIL (${fail})` : `ROUND ${n} PASS`);
  return fail;
}

const backup = JSON.parse(readFileSync(join(root, 'backups/supabase-progress-20261012.json'), 'utf8'));
const CloudSync = loadCloudSync();
let total = 0;
for (let i = 1; i <= ROUNDS; i++) {
  total += await round(i, CloudSync, backup);
}
console.log('\n==== FINAL ====', total ? `FAILED checks=${total}` : `ALL ${ROUNDS} ROUNDS PASS`);
process.exit(total ? 1 : 0);
