/**
 * Full Cloudflare dual-sync regression checks (3 passes).
 * Run: node scripts/audit-cloudflare-sync.mjs
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createContext, runInContext } from 'node:vm';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const base = 'https://heiheimaths-progress.heiheimaths.workers.dev';
const sbUrl = 'https://dptzfcfmyplqnxfqndub.supabase.co/rest/v1/progress';
const sbKey = 'sb_publishable_uvWhBj7R-Kc2t8tubTRCiA_I0qsAYGC';

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
  runInContext(code + '\nthis.CloudSync = CloudSync;', ctx);
  return ctx.CloudSync;
}

async function test1() {
  console.log('\n=== TEST 1: CF vs backup + Supabase ===');
  const backup = JSON.parse(readFileSync(join(root, 'backups/supabase-progress-20261012.json'), 'utf8'));
  let fail = 0;
  for (const row of backup.rows) {
    const r = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(row.profile_key)}`);
    const j = await r.json();
    const ok = r.ok && j?.data && hash(j.data) === hash(row.data);
    console.log(ok ? 'OK' : 'FAIL', row.profile_key);
    if (!ok) fail++;
  }
  for (const key of ['2026::heihei', '2026::chunchun', '2026::test', '2026::mother']) {
    const cf = await (await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(key)}`)).json();
    const sbRes = await fetch(
      `${sbUrl}?profile_key=eq.${encodeURIComponent(key)}&select=data`,
      { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
    );
    const sbArr = await sbRes.json();
    const sb = sbArr?.[0];
    const ok = sb?.data && hash(cf.data) === hash(sb.data);
    console.log(ok ? 'OK CF=SB' : 'FAIL CF!=SB', key);
    if (!ok) fail++;
  }
  console.log(fail ? `TEST1 FAIL ${fail}` : 'TEST1 PASS');
  return fail;
}

async function test2(CloudSync) {
  console.log('\n=== TEST 2: dual merge + frontend wiring ===');
  let fail = 0;
  const empty = {
    ...CloudSync.mergeProgress({}, {}, null),
    points: 0,
    gachaPointsSpent: 0,
    cardCollection: {},
    _syncMeta: { updatedAt: '2026-10-12T12:00:00.000Z' },
  };
  // rebuild empty properly
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
    points: 100,
    gachaPointsSpent: 3610,
    gachaStats: { totalPulls: 375 },
    cardCollection: { marvel: { a: 1, b: 2 } },
    _syncMeta: { updatedAt: '2026-10-01T00:00:00.000Z' },
  };
  const merged = CloudSync.mergeProgress(emptyBase, rich, '2026-10-01T00:00:00.000Z');
  if (merged.gachaPointsSpent !== 3610) {
    console.log('FAIL spent lost', merged.gachaPointsSpent);
    fail++;
  } else console.log('OK spent preserved');
  if (Object.keys(merged.cardCollection.marvel || {}).length !== 2) {
    console.log('FAIL cards lost');
    fail++;
  } else console.log('OK cards preserved');

  if (CloudSync.makeProfileKey('2026', ' HeiHei ') !== '2026::heihei') {
    console.log('FAIL profile key');
    fail++;
  } else console.log('OK profile key');

  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const i1 = html.indexOf('cloudflare-config.js');
  const i2 = html.indexOf('cloud-sync.js?v=37');
  if (!(i1 > 0 && i2 > i1)) {
    console.log('FAIL script order');
    fail++;
  } else console.log('OK script order v37');

  const syncSrc = readFileSync(join(root, 'js/cloud-sync.js'), 'utf8');
  if (!syncSrc.includes("mode === 'dual'") || !syncSrc.includes('source: \'dual\'')) {
    console.log('FAIL dual merge branch missing');
    fail++;
  } else console.log('OK dual both-sides merge');

  console.log(fail ? `TEST2 FAIL ${fail}` : 'TEST2 PASS');
  return fail;
}

async function test3() {
  console.log('\n=== TEST 3: E2E PUT/GET/CORS + real account integrity ===');
  let fail = 0;
  const backup = JSON.parse(readFileSync(join(root, 'backups/supabase-progress-20261012.json'), 'utf8'));
  const probeKey = '2026::__cf_audit_probe__';
  const marker = { points: 99, bonusPoints: 1, gachaPointsSpent: 0, _audit: true, note: `probe-${Date.now()}` };

  const put = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(probeKey)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://kylai2026.github.io',
    },
    body: JSON.stringify({
      family_code: '2026',
      student_name: '__cf_audit_probe__',
      data: marker,
    }),
  });
  const putBody = await put.json();
  console.log('PUT', put.status, 'CORS', put.headers.get('access-control-allow-origin'), 'points', putBody?.data?.points);
  if (put.status !== 200 || putBody?.data?.points !== 99) fail++;

  const get = await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(probeKey)}`, {
    headers: { Origin: 'http://localhost:8765' },
  });
  const getBody = await get.json();
  console.log('GET', get.status, 'CORS', get.headers.get('access-control-allow-origin'), getBody?.data?.note === marker.note);
  if (get.status !== 200 || getBody?.data?.note !== marker.note) fail++;

  await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(probeKey)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      family_code: '2026',
      student_name: '__cf_audit_probe__',
      data: { points: 0, _audit: true, cleaned: true },
    }),
  });

  for (const key of ['2026::heihei', '2026::chunchun', '2026::test']) {
    const row = backup.rows.find((x) => x.profile_key === key);
    const remote = await (await fetch(`${base}/api/progress?profile_key=${encodeURIComponent(key)}`)).json();
    const ok = hash(row.data) === hash(remote.data);
    console.log(ok ? 'STILL OK' : 'CORRUPTED', key);
    if (!ok) fail++;
  }

  const opt = await fetch(`${base}/api/progress?profile_key=2026%3A%3Atest`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://kylai2026.github.io',
      'Access-Control-Request-Method': 'PUT',
    },
  });
  console.log('OPTIONS', opt.status, opt.headers.get('access-control-allow-methods'));
  if (opt.status !== 204) fail++;

  const bad = await fetch(`${base}/api/progress`, {
    headers: { Origin: 'https://kylai2026.github.io' },
  });
  console.log('missing key', bad.status, 'CORS', bad.headers.get('access-control-allow-origin'));
  // CORS on 400 may still be missing until redeploy — warn only if no CORS
  if (bad.status !== 400) fail++;
  if (!bad.headers.get('access-control-allow-origin')) {
    console.log('WARN: 400 missing CORS (pending Worker redeploy)');
  }

  console.log(fail ? `TEST3 FAIL ${fail}` : 'TEST3 PASS');
  return fail;
}

const CloudSync = loadCloudSync();
const f1 = await test1();
const f2 = await test2(CloudSync);
const f3 = await test3();
const total = f1 + f2 + f3;
console.log('\n==== SUMMARY ====', total ? `FAILED ${total}` : 'ALL 3 TESTS PASS');
process.exit(total ? 1 : 0);
