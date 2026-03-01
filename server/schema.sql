-- SEO AI LLM — Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  keyword VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  result JSONB,
  seo_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('related', 'long-tail', 'semantic')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  agent VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  suggestion_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_keywords_report_id ON keywords(report_id);
CREATE INDEX idx_suggestions_report_id ON suggestions(report_id);

-- Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own keywords"
  ON keywords FOR SELECT
  USING (report_id IN (SELECT id FROM reports WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own suggestions"
  ON suggestions FOR SELECT
  USING (report_id IN (SELECT id FROM reports WHERE user_id = auth.uid()));
