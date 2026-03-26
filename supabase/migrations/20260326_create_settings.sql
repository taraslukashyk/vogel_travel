-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id SERIAL PRIMARY KEY,
    phone_primary TEXT NOT NULL DEFAULT '+38 050 469 2882',
    phone_secondary TEXT NOT NULL DEFAULT '+38 044 469 2882',
    email TEXT NOT NULL DEFAULT 'booking@vogel.travel',
    address TEXT NOT NULL DEFAULT 'Спортивна площа, 1А, Київ',
    instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/vogel.family.travel/',
    facebook_url TEXT NOT NULL DEFAULT 'https://www.facebook.com/vogelfamilytravel/',
    telegram_url TEXT NOT NULL DEFAULT 'https://t.me/Taras_luka',
    whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/380685032230',
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial settings if not exists
INSERT INTO public.settings (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE id = 1);

-- Set up Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Allow public read-only access to settings"
ON public.settings FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
