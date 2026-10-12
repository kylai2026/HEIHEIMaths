/**
 * Import backup rows via Worker PUT API (avoids D1 SQL statement size limit).
 *
 * Usage:
 *   node scripts/import-via-api.mjs https://heiheimaths-progress.xxx.workers.dev
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const backupsDir = join(repoRoot, 'backups');

const baseUrl = (process.argv[2] || '').replace(/\/$/, '');
if (!baseUrl.startsWith('https://')) {
  console.error('Usage: node scripts/import-via-api.mjs https://your-worker.workers.dev');
  process.exit(1);
}

function pickBackup() {
  const files = readdirSync(backupsDir)
    .filter((f) => f.startsWith('supabase-progress-') && f.endsWith('.json'))
    .sort()
    .reverse();
  if (!files.length) throw new Error(`No backup in ${backupsDir}`);
  return join(backupsDir, files[0]);
}

const backup = JSON.parse(readFileSync(pickBackup(), 'utf8'));
const rows = backup.rows || [];

console.log(`Importing ${rows.length} rows via ${baseUrl}…`);

for (const row of rows) {
  const profileKey = row.profile_key;
  const url = `${baseUrl}/api/progress?profile_key=${encodeURIComponent(profileKey)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      family_code: row.family_code,
      student_name: row.student_name,
      data: row.data,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`FAIL ${profileKey}: ${res.status} ${text.slice(0, 200)}`);
    process.exit(1);
  }
  const d = row.data || {};
  console.log(
    `OK ${profileKey}  points=${d.points ?? 0} bonus=${d.bonusPoints ?? 0} spent=${d.gachaPointsSpent ?? 0}`
  );
}

console.log('Import done.');
