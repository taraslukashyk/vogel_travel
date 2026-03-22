import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useAudioUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, folder: string = 'audio'): Promise<string> => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('images').upload(path, file, {
        contentType: file.type || 'audio/mpeg',
      });
      if (error) {
        console.error('Upload Error:', error);
        throw error;
      }
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
