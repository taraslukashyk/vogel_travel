import { supabase } from './supabase';

export const sendTelegramNotification = async (message: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
      body: { message },
    });

    if (error) {
      console.error('Edge Function error:', error);
      return false;
    }

    if (!data?.success) {
      console.error('Notification failed:', data?.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending telegram notification:', error);
    return false;
  }
};

