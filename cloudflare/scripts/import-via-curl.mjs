/**
 * Import backup via curl.exe (avoids Node TLS issues on some Windows setups).
 * Usage: node scripts/import-via-curl.mjs https://heiheimaths-progress.heiheimaths.workers.dev
 */
import { readFileSync, readdirSync, writeFileSync, unlinkSync, mkdtempSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const backupsDir = join(repoRoot, 'backups');
const baseUrl = (process.argv[2] || '').replace(/\/$/, '');
if (!baseUrl.startsWith('https://')) {
  console.error('Usage: node scripts/import-via-curl.mjs https://your-worker.workers.dev');
  process.exit(1);
}

const files = readdirSync(backupsDir)
  .filter((f) => f.startsWith('supabase-progress-') && f.endsWith('.json'))
  .sort()
  .reverse();
const backup = JSON.parse(readFileSync(join(backupsDir, files[0]), 'utf8'));
const rows = backup.rows || [];
const dir = mkdtempSync(join(tmpdir(), 'cf-import-'));

console.log(`Importing ${rows.length} rows via curl → ${baseUrl}`);

for (const row of rows) {
  const profileKey = row.profile_key;
  const url = `${baseUrl}/api/progress?profile_key=${encodeURIComponent(profileKey)}`;
  const bodyPath = join(dir, 'body.json');
  writeFileSync(
    bodyPath,
    JSON.stringify({
      family_code: row.family_code,
      student_name: row.student_name,
      data: row.data,
    }),
    'utf8'
  );

  const result = spawnSync(
    'curl.exe',
    ['-sS', '-w', '\n%{http_code}', '-X', 'PUT', url, '-H', 'Content-Type: application/json', '--data-binary', `@${bodyPath}`],
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  );
  if (result.error) throw result.error;
  const parts = (result.stdout || '').trim().split('\n');
  const code = parts.pop();
  const out = parts.join('\n');
  if (code !== '200') {
    console.error(`FAIL ${profileKey}: HTTP ${code}\n${out.slice(0, 400)}`);
    process.exit(1);
  }
  const d = row.data || {};
  console.log(
    `OK ${profileKey}  points=${d.points ?? 0} bonus=${d.bonusPoints ?? 0} spent=${d.gachaPointsSpent ?? 0}`
  );
}

try {
  unlinkSync(join(dir, 'body.json'));
} catch {
  /* ignore */
}
console.log('Import done.');
