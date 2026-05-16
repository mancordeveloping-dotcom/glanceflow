-- Esegui questo SQL nell'editor SQL di Supabase (https://app.supabase.com)
-- Dashboard → SQL Editor → New query → incolla e clicca Run

CREATE TABLE IF NOT EXISTS tasks (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  description  TEXT,
  status       TEXT        DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  screenshot_url TEXT,
  date         TEXT,
  time         TEXT,
  location     TEXT,
  type         TEXT        DEFAULT 'task' CHECK (type IN ('task', 'event', 'reminder')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Abilita RLS e permetti tutto (aggiungi auth più tardi)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
