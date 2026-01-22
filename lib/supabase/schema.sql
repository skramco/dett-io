-- Dett Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Calculator Sessions Table
CREATE TABLE calculator_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  calculator_type TEXT NOT NULL,
  session_data JSONB NOT NULL DEFAULT '{}',
  anonymous_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT check_user_or_anonymous CHECK (
    (user_id IS NOT NULL AND anonymous_id IS NULL) OR
    (user_id IS NULL AND anonymous_id IS NOT NULL)
  )
);

-- Scenarios Table (for A/B/C comparisons)
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID NOT NULL REFERENCES calculator_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_calculator_sessions_anonymous_id ON calculator_sessions(anonymous_id);
CREATE INDEX idx_calculator_sessions_user_id ON calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_type ON calculator_sessions(calculator_type);
CREATE INDEX idx_scenarios_session_id ON scenarios(session_id);

-- Row Level Security (RLS)
ALTER TABLE calculator_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calculator_sessions
-- Allow anonymous users to create sessions
CREATE POLICY "Allow anonymous insert" ON calculator_sessions
  FOR INSERT
  WITH CHECK (anonymous_id IS NOT NULL);

-- Allow anonymous users to read their own sessions
CREATE POLICY "Allow anonymous read own" ON calculator_sessions
  FOR SELECT
  USING (anonymous_id IS NOT NULL);

-- Allow anonymous users to update their own sessions
CREATE POLICY "Allow anonymous update own" ON calculator_sessions
  FOR UPDATE
  USING (anonymous_id IS NOT NULL);

-- Allow authenticated users to read their own sessions
CREATE POLICY "Allow authenticated read own" ON calculator_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own sessions
CREATE POLICY "Allow authenticated insert own" ON calculator_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own sessions
CREATE POLICY "Allow authenticated update own" ON calculator_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for scenarios
-- Allow read access to scenarios if user has access to parent session
CREATE POLICY "Allow read scenarios" ON scenarios
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calculator_sessions
      WHERE calculator_sessions.id = scenarios.session_id
      AND (
        calculator_sessions.user_id = auth.uid()
        OR calculator_sessions.anonymous_id IS NOT NULL
      )
    )
  );

-- Allow insert scenarios if user has access to parent session
CREATE POLICY "Allow insert scenarios" ON scenarios
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM calculator_sessions
      WHERE calculator_sessions.id = scenarios.session_id
      AND (
        calculator_sessions.user_id = auth.uid()
        OR calculator_sessions.anonymous_id IS NOT NULL
      )
    )
  );

-- Allow update scenarios if user has access to parent session
CREATE POLICY "Allow update scenarios" ON scenarios
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM calculator_sessions
      WHERE calculator_sessions.id = scenarios.session_id
      AND (
        calculator_sessions.user_id = auth.uid()
        OR calculator_sessions.anonymous_id IS NOT NULL
      )
    )
  );

-- Allow delete scenarios if user has access to parent session
CREATE POLICY "Allow delete scenarios" ON scenarios
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM calculator_sessions
      WHERE calculator_sessions.id = scenarios.session_id
      AND (
        calculator_sessions.user_id = auth.uid()
        OR calculator_sessions.anonymous_id IS NOT NULL
      )
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_calculator_sessions_updated_at
  BEFORE UPDATE ON calculator_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
