-- Esegui nel SQL Editor di Supabase dopo supabase_setup.sql

-- Profili utente (estende auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id  TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Log utilizzo giornaliero
CREATE TABLE IF NOT EXISTS usage_logs (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggiungi user_id alla tabella tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- RLS user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Own profile" ON user_profiles FOR ALL USING (auth.uid() = id);

-- RLS usage_logs
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Own logs select" ON usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Own logs insert" ON usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS tasks: aggiorna policy per filtrare per utente
DROP POLICY IF EXISTS "Allow all" ON tasks;
CREATE POLICY "Own tasks" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
