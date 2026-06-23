/* 填入 Supabase 專案設定（Dashboard → Project Settings → API） */
const SUPABASE_URL = 'https://dptzfcfmyplqnxfqndub.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uvWhBj7R-Kc2t8tubTRCiA_I0qsAYGC';

/* 學生登入帳號（每個帳號進度獨立，雲端以帳號名稱分開儲存） */
const USER_ACCOUNTS = [
  { username: 'heihei', password: '2026' },
  { username: 'mother', password: '2026' },
  { username: 'test', password: '2026', unlimitedPoints: true },
  { username: 'father', password: '2026' },
  { username: 'chunchun', password: '2026' }
];

const PARENT_ACCOUNTS = new Set(['mother', 'father']);
const WATCH_CHILDREN = ['heihei', 'chunchun'];

function isParentAccount(studentName) {
  if (!studentName) return false;
  return PARENT_ACCOUNTS.has(studentName.trim().toLowerCase());
}

function getWatchChildren() {
  return [...WATCH_CHILDREN];
}

function validateAccount(username, password) {
  const name = username.trim().toLowerCase();
  const code = password.trim();
  const match = USER_ACCOUNTS.find(
    a => a.username.toLowerCase() === name && a.password === code
  );
  return match ? match.username : null;
}

const UNLIMITED_POINTS_VALUE = 999999;

function hasUnlimitedPoints(studentName) {
  if (!studentName) return false;
  const name = studentName.trim().toLowerCase();
  return USER_ACCOUNTS.some(a => a.username.toLowerCase() === name && a.unlimitedPoints);
}

function getActiveUnlimitedPoints() {
  if (typeof CloudSync === 'undefined') return false;
  const profile = CloudSync.getProfile();
  return profile ? hasUnlimitedPoints(profile.studentName) : false;
}
