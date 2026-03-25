-- Додавання колонки slug та заповнення існуючих записів для Vogel Travel

-- 1. Таблиця blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE blog_posts SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

-- 2. Таблиця partners
ALTER TABLE partners ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE partners SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

-- 3. Таблиця services
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE services SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;

-- 4. Таблиця offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
UPDATE offers SET slug = lower(regexp_replace(hotel, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
