import { supabase } from '../supabase';

export interface SiteSettings {
  id: number;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  address_en: string;
  instagram_url: string;
  facebook_url: string;
  telegram_url: string;
  telegram_group_url?: string;
  whatsapp_url: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  updated_at?: string;
}

export const getSettings = async (forceAdmin = false): Promise<SiteSettings | null> => {
  if (!forceAdmin) {
    // First, try fetching from the public view (safe, non-sensitive)
    const { data: publicData, error: publicError } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (!publicError) {
      return publicData as SiteSettings;
    }
  }

  // Admin access (includes tokens)
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) {
    console.warn('Could not fetch settings:', error);
    return null;
  }

  return data;
};



export const updateSettings = async (settings: Partial<SiteSettings>) => {
  const { data, error } = await supabase
    .from('settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return data;
};
