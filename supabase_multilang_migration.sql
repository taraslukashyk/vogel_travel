-- ============================================
-- Migration: Add English fields to tables for multilingual support
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Таблиця services
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS items_en JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS sections_en JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS image_alt_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 2. Таблиця partners
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS category_en TEXT DEFAULT 'Partner',
  ADD COLUMN IF NOT EXISTS location_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS tag_en TEXT,
  ADD COLUMN IF NOT EXISTS sections_en JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS image_alt_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 3. Таблиця offers
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS hotel_en TEXT,
  ADD COLUMN IF NOT EXISTS location_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS sections_en JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS discount_en TEXT,
  ADD COLUMN IF NOT EXISTS book_by_en TEXT,
  ADD COLUMN IF NOT EXISTS stay_from_en TEXT,
  ADD COLUMN IF NOT EXISTS stay_to_en TEXT,
  ADD COLUMN IF NOT EXISTS image_alt_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 4. Таблиця blog_posts
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS category_en TEXT,
  ADD COLUMN IF NOT EXISTS audio_en TEXT,
  ADD COLUMN IF NOT EXISTS sections_en JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
  ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
  ADD COLUMN IF NOT EXISTS image_alt_en TEXT,
  ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 5. Таблиця seo_meta
ALTER TABLE seo_meta
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS og_title_en TEXT,
  ADD COLUMN IF NOT EXISTS og_description_en TEXT,
  ADD COLUMN IF NOT EXISTS keywords_en TEXT;
