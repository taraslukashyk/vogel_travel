-- ============================================
-- Migration: Add services.sections/seo + Create partners table
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Extend services table
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS sections JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- 2. Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Партнер',
  location TEXT NOT NULL DEFAULT '',
  logo TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_alt TEXT,
  description TEXT,
  website TEXT,
  tag TEXT,
  color TEXT,
  lng DOUBLE PRECISION,
  lat DOUBLE PRECISION,
  sections JSONB NOT NULL DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read partners"
  ON partners FOR SELECT
  USING (is_published = true);

CREATE POLICY "Auth write partners"
  ON partners FOR ALL
  USING (auth.role() = 'authenticated');
