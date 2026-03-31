import { supabase } from './supabase';

export const sendTelegramDocument = async (message: string, pdfBase64: string, filename: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram-document', {
      body: { message, document: pdfBase64, filename },
    });

    if (error) {
      console.error('Edge Function invocation error:', error);
      return { success: false, error: error.message || 'Помилка виконання функції' };
    }

    if (!data?.success) {
      console.error('Document send failed:', data?.error);
      return { success: false, error: data?.error || 'Помилка Telegram API' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending telegram document:', error);
    return { success: false, error: error.message || 'Невідома помилка' };
  }
};

export const sendTelegramNotification = async (message: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
      body: { message },
    });

    if (error) {
      console.error('Edge Function invocation error:', error);
      return { success: false, error: error.message || 'Помилка виконання функції' };
    }

    if (!data?.success) {
      console.error('Notification failed:', data?.error);
      return { success: false, error: data?.error || 'Помилка Telegram API' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending telegram notification:', error);
    return { success: false, error: error.message || 'Невідома помилка' };
  }
};

