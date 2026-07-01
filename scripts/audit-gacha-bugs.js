/**
 * Audit gacha points merge + pull flow for non-test accounts.
 * Run: node scripts/audit-gacha-bugs.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { console, Math, Date, JSON, Set, Array, Object, parseInt, isNaN, UNLIMITED_POINTS_VALUE: 999999 };
const src = [
  fs.readFileSync(path.join(root, 'js/utils.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'js/cloud-sync.js'), 'utf8'),
  fs.readFileSync(path.join(root, 'js/scoring.js'), 'utf8'),
  'globalThis.Storage = Storage; globalThis.CloudSync = CloudSync; globalThis.Scoring = Scoring;'
].join('\n');
vm.runInNewContext(src, sandbox);
const Storage = sandbox.Storage;
const CloudSync = sandbox.CloudSync;
const Scoring = sandbox.Scoring;
if (!CloudSync) throw new Error('Failed to load CloudSync for audit');

const GACHA_PULL_COST = 10;

function totalBalance(d) {
  return (d.points || 0) + (d.bonusPoints || 0);
}

function simulateMerge(local, cloud, cloudUpdatedAt) {
  return CloudSync.mergeProgress(local, cloud, cloudUpdatedAt);
}

function pullOnce(data) {
  if (!Storage.canAffordPoints(data, GACHA_PULL_COST)) return false;
  Storage.spendPoints(data, GACHA_PULL_COST, 'gacha');
  data._syncMeta = { updatedAt: new Date(Date.now()).toISOString() };
  return true;
}

const issues = [];

function report(id, msg) {
  issues.push({ id, msg });
}

// --- merge edge cases ---
{
  const local = { points: 8, bonusPoints: 80, _syncMeta: { updatedAt: '2026-07-01T13:00:00.000Z' } };
  const cloud = { points: 18, bonusPoints: 70, _syncMeta: { updatedAt: '2026-07-01T12:00:00.000Z' } };
  const merged = simulateMerge(local, cloud, '2026-07-01T12:00:00.000Z');
  if (totalBalance(merged) > totalBalance(local)) {
    report('MERGE_EQUAL_SPLIT', `Same total different split refunded points: ${totalBalance(local)} -> ${totalBalance(merged)}`);
  }
}

{
  const local = { points: 8, bonusPoints: 80, gachaPointsSpent: 10, _syncMeta: { updatedAt: '2026-07-01T13:00:00.000Z' } };
  const cloud = { points: 8, bonusPoints: 90, gachaPointsSpent: 0, _syncMeta: { updatedAt: '2026-07-01T13:05:00.000Z' } };
  const merged = simulateMerge(local, cloud, '2026-07-01T13:05:00.000Z');
  if (totalBalance(merged) > totalBalance(local)) {
    report('MERGE_STALE_CLOUD_NEWER', `Newer stale cloud restored spent points: ${totalBalance(merged)}`);
  }
}

// simulate rapid pull + sync loop (classic infinite gacha)
{
  let local = { points: 8, bonusPoints: 90, gachaPointsSpent: 0, _syncMeta: { updatedAt: '2026-07-01T12:00:00.000Z' } };
  let cloud = JSON.parse(JSON.stringify(local));
  let cloudUpdatedAt = '2026-07-01T12:00:00.000Z';
  const startTotal = totalBalance(local);
  let pulls = 0;

  for (let i = 0; i < 15; i++) {
    if (!pullOnce(local)) break;
    pulls++;
    local._syncMeta.updatedAt = new Date(Date.now() + i * 1000).toISOString();

    // push merge (local newer after spend)
    const payload = simulateMerge(local, cloud, cloudUpdatedAt);
    local = JSON.parse(JSON.stringify(payload));
    cloud = JSON.parse(JSON.stringify(payload));
    cloudUpdatedAt = payload._syncMeta.updatedAt;
  }

  const spent = startTotal - totalBalance(local);
  if (spent < pulls * GACHA_PULL_COST) {
    report('INFINITE_PULL_LOOP', `Only spent ${spent} for ${pulls} pulls (expected ${pulls * GACHA_PULL_COST})`);
  }
}

// stale tab overwrite after spend on main tab
{
  let main = { points: 8, bonusPoints: 90, gachaPointsSpent: 0, _syncMeta: { updatedAt: '2026-07-01T13:10:00.000Z' } };
  const staleTab = { points: 8, bonusPoints: 90, gachaPointsSpent: 0, _syncMeta: { updatedAt: '2026-07-01T13:00:00.000Z' } };
  pullOnce(main);
  main._syncMeta.updatedAt = '2026-07-01T13:11:00.000Z';
  const merged = simulateMerge(staleTab, main, '2026-07-01T13:11:00.000Z');
  if (totalBalance(merged) > totalBalance(main)) {
    report('STALE_TAB_PUSH', `Stale tab merge inflated balance to ${totalBalance(merged)}`);
  }
}

// redeemGift now uses spendPoints (bonusPoints included) — covered in utils tests

async function auditCloudAccounts() {
  const url = 'https://dptzfcfmyplqnxfqndub.supabase.co';
  const key = 'sb_publishable_uvWhBj7R-Kc2t8tubTRCiA_I0qsAYGC';
  const accounts = ['heihei', 'mother', 'father', 'chunchun'];

  for (const name of accounts) {
    const pk = `2026::${name}`;
    const r = await fetch(`${url}/rest/v1/progress?profile_key=eq.${encodeURIComponent(pk)}&select=data,updated_at`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    const row = (await r.json())[0];
    if (!row?.data) {
      console.log(`[${name}] no cloud data`);
      continue;
    }
    const d = row.data;
    const total = (d.points || 0) + (d.bonusPoints || 0);
    const pulls = d.gachaStats?.totalPulls || 0;
    const cardCopies = Object.values(d.cardCollection || {}).reduce((sum, pool) => {
      return sum + Object.values(pool || {}).reduce((s, n) => s + n, 0);
    }, 0);
    const minSpend = pulls * 10;
    const earned = Object.values(d.dailyLog || {}).reduce((s, day) => s + (day.points || 0), 0);
    const suspicious = cardCopies > pulls + 5; // allow admin copy slack
    console.log(`[${name}] total=${total} points=${d.points} bonus=${d.bonusPoints || 0} pulls=${pulls} cards=${cardCopies} earned~${earned} updated=${row.updated_at}`);
    if (name === 'mother' && total >= 999999) {
      report('CLOUD_MOTHER', 'mother account has test-like unlimited points in cloud — should be reset');
    }
    if (suspicious) {
      report(`CLOUD_${name.toUpperCase()}`, `Card copies (${cardCopies}) exceed pull count (${pulls}) — possible dup exploit or admin grant`);
    }
    if (total > earned + (d.bonusPoints || 0) + 50) {
      report(`CLOUD_${name.toUpperCase()}_POINTS`, `Balance ${total} seems high vs lifetime earned ${earned} + bonus`);
    }
  }
}

(async () => {
  console.log('=== merge / pull simulation ===');
  if (issues.length) {
    issues.forEach(i => console.log(`BUG ${i.id}: ${i.msg}`));
  } else {
    console.log('No simulation bugs detected');
  }

  console.log('\n=== cloud account audit ===');
  await auditCloudAccounts();

  console.log('\n=== summary ===');
  if (issues.length) {
    console.log(`FOUND ${issues.length} issue(s)`);
    process.exit(1);
  }
  console.log('All checks passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
