-- Tasks table with gamification and Pomodoro integration
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Task organization
  category VARCHAR(100) DEFAULT 'general',
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[], -- Array of tags for flexible categorization
  
  -- Pomodoro tracking
  estimated_pomodoros INTEGER DEFAULT 1,
  completed_pomodoros INTEGER DEFAULT 0,
  
  -- Gamification
  reward_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  
  -- Status and ordering
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived', 'deleted')),
  is_active BOOLEAN DEFAULT false, -- Currently selected for focus
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT user_id_not_null CHECK (user_id IS NOT NULL)
);

-- Task suggestions (AI-powered or pattern-based)
CREATE TABLE IF NOT EXISTS task_suggestions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  suggested_title VARCHAR(500) NOT NULL,
  suggested_category VARCHAR(100),
  reason TEXT, -- Why this task is suggested
  confidence_score DECIMAL(3,2) DEFAULT 0.5, -- 0.00 to 1.00
  
  -- Suggestion metadata
  based_on VARCHAR(50), -- 'pattern', 'time_of_day', 'incomplete_session', etc.
  is_accepted BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

-- Task history for tracking patterns
CREATE TABLE IF NOT EXISTS task_sessions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  
  -- Session details
  pomodoros_completed INTEGER DEFAULT 1,
  duration_minutes INTEGER NOT NULL,
  
  -- Quality metrics
  distractions_count INTEGER DEFAULT 0,
  completion_quality VARCHAR(20) DEFAULT 'good' CHECK (completion_quality IN ('poor', 'fair', 'good', 'excellent')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_suggestions_user_id ON task_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_sessions_task_id ON task_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_sessions_session_id ON task_sessions(session_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_tasks_updated_at();
