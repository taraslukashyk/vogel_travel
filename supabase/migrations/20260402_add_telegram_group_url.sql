-- Migration to add telegram_group_url and address_en to settings table
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS telegram_group_url TEXT,
ADD COLUMN IF NOT EXISTS address_en TEXT NOT NULL DEFAULT '1A Sportyvna Square, Kyiv';

-- Update the default value for the existing record
UPDATE public.settings 
SET telegram_group_url = 'https://t.me/+P3pMzhZ_jTtkNjMy' -- Placeholder value, user can change in admin
WHERE id = 1 AND telegram_group_url IS NULL;

-- 2. Drop the existing view to allow reordering of columns
DROP VIEW IF EXISTS public.site_settings;

-- 3. Create the PUBLIC VIEW to include the new field and address_en
CREATE VIEW public.site_settings AS
SELECT 
    id,
    phone_primary,
    phone_secondary,
    email,
    address,
    address_en,
    instagram_url,
    facebook_url,
    telegram_url,
    telegram_group_url,
    whatsapp_url,
    updated_at
FROM public.settings;

-- 4. Grant public access to the view (Essential after DROP)
GRANT SELECT ON public.site_settings TO anon, authenticated;
