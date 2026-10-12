-- D1 schema mirroring Supabase `progress` table
CREATE TABLE IF NOT EXISTS progress (
  profile_key TEXT PRIMARY KEY NOT NULL,
  family_code TEXT NOT NULL,
  student_name TEXT NOT NULL,
  data TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_progress_family_code ON progress (family_code);
CREATE INDEX IF NOT EXISTS idx_progress_student_name ON progress (student_name);
