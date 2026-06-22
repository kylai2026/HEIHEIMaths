-- 舅父晞晞數學補習網 · Supabase 資料表
-- 喺 Supabase Dashboard → SQL Editor 貼上執行

create table if not exists public.progress (
  profile_key text primary key,
  family_code text not null,
  student_name text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists progress_family_code_idx on public.progress (family_code);

alter table public.progress enable row level security;

drop policy if exists "anon_progress_all" on public.progress;
create policy "anon_progress_all"
  on public.progress
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 可選：舅父用 family_code 查所有小朋友進度
-- select student_name, data->>'points' as points, data->>'totalAnswered' as answered, updated_at
-- from public.progress where family_code = '你的家庭密碼';
