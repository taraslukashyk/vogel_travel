-- Drop old policy if it exists
DROP POLICY IF EXISTS "Allow public read-only access to settings" ON public.settings;

-- Set up Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow ONLY authenticated users (admins) to see and manage ALL settings including tokens
CREATE POLICY "Admins can manage all settings"
ON public.settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create a PUBLIC VIEW that only contains non-sensitive information
-- This is what the public website (footer, contacts) will use
CREATE OR REPLACE VIEW public.site_settings AS
SELECT 
    id,
    phone_primary,
    phone_secondary,
    email,
    address,
    instagram_url,
    facebook_url,
    telegram_url,
    whatsapp_url,
    updated_at
FROM public.settings;

-- Grant public access to the view
GRANT SELECT ON public.site_settings TO anon, authenticated;
