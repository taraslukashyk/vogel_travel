import { useState } from 'react';
import { supabase } from '../../lib/supabase';

async function convertToWebP(file: File, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If already webp, return as-is
    if (file.type === 'image/webp') {
      resolve(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP conversion failed'));
        },
        'image/webp',
        quality,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, folder: string = 'general'): Promise<string> => {
    setUploading(true);
    try {
      // Convert to WebP
      const webpBlob = await convertToWebP(file);
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error } = await supabase.storage.from('images').upload(path, webpBlob, {
        contentType: 'image/webp',
      });
      if (error) throw error;
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
