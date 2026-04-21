-- 成语表：存储所有成语数据
CREATE TABLE IF NOT EXISTS idioms (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL UNIQUE,
  pinyin TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 游戏记录表：存储每局游戏的结果
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT DEFAULT '匿名玩家',
  target_idiom TEXT NOT NULL,
  guesses JSONB DEFAULT '[]'::jsonb,
  result TEXT NOT NULL CHECK (result IN ('won', 'lost')),
  hints_used INTEGER DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 行级安全策略 (RLS)
ALTER TABLE idioms ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- idioms 表：允许所有人读取
CREATE POLICY "idioms_select_all"
  ON idioms
  FOR SELECT
  USING (true);

-- game_sessions 表：允许所有人插入和读取
CREATE POLICY "game_sessions_insert_all"
  ON game_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "game_sessions_select_all"
  ON game_sessions
  FOR SELECT
  USING (true);

-- 为 result 列创建索引（用于排行榜筛选）
CREATE INDEX IF NOT EXISTS idx_game_sessions_result ON game_sessions(result);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);
