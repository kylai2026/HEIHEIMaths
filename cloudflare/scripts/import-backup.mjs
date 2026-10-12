/**
 * Import backups/supabase-progress-*.json into local or remote D1.
 *
 * Usage:
 *   node scripts/import-backup.mjs --local
 *   node scripts/import-backup.mjs --remote
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const repoRoot = resolve(root, '..');
const backupsDir = join(repoRoot, 'backups');

const mode = process.argv.includes('--remote') ? 'remote' : 'local';

function pickBackup() {
  const arg = process.argv.find((a) => a.endsWith('.json') && !a.startsWith('-'));
  if (arg) return resolve(arg);
  const files = readdirSync(backupsDir)
    .filter((f) => f.startsWith('supabase-progress-') && f.endsWith('.json'))
    .sort()
    .reverse();
  if (!files.length) throw new Error(`No backup JSON in ${backupsDir}`);
  return join(backupsDir, files[0]);
}

function esc(s) {
  return String(s).replace(/'/g, "''");
}

const backupPath = pickBackup();
const backup = JSON.parse(readFileSync(backupPath, 'utf8'));
const rows = backup.rows || [];
if (!rows.length) throw new Error('Backup has no rows');

const statements = rows.map((row) => {
  const data =
    typeof row.data === 'string' ? row.data : JSON.stringify(row.data ?? {});
  const updated = row.updated_at || new Date().toISOString();
  return (
    `INSERT INTO progress (profile_key, family_code, student_name, data, updated_at) VALUES (` +
    `'${esc(row.profile_key)}', '${esc(row.family_code)}', '${esc(row.student_name)}', ` +
    `'${esc(data)}', '${esc(updated)}') ` +
    `ON CONFLICT(profile_key) DO UPDATE SET ` +
    `family_code=excluded.family_code, student_name=excluded.student_name, ` +
    `data=excluded.data, updated_at=excluded.updated_at;`
  );
});

const sqlPath = join(root, 'scripts', '_import-temp.sql');
import { writeFileSync, unlinkSync } from 'node:fs';
writeFileSync(sqlPath, statements.join('\n'), 'utf8');

const args = [
  'wrangler',
  'd1',
  'execute',
  'heiheimaths-progress',
  mode === 'remote' ? '--remote' : '--local',
  '--file',
  sqlPath,
];

console.log(`Importing ${rows.length} rows from ${backupPath} (${mode})…`);
const result = spawnSync('npx', args, { cwd: root, stdio: 'inherit', shell: true });
try {
  unlinkSync(sqlPath);
} catch {
  /* ignore */
}
if (result.status !== 0) process.exit(result.status || 1);
console.log('Import done.');
rows.forEach((r) => {
  const d = r.data || {};
  console.log(
    `  ${r.profile_key}  points=${d.points ?? 0} bonus=${d.bonusPoints ?? 0} spent=${d.gachaPointsSpent ?? 0}`
  );
});
