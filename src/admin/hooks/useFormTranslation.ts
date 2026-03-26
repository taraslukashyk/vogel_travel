import { useState } from 'react';
import { translateText } from '../utils/translate';

export function useFormTranslation(form: any, setForm: (updater: (prev: any) => any) => void, isUA: boolean) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (field: string) => {
    const from = isUA ? 'en' : 'uk';
    const to = isUA ? 'uk' : 'en';
    
    const sourceField = isUA ? `${field}_en` : field.replace('_en', '');
    const sourceValue = form[sourceField] as string;
    
    if (!sourceValue) return;
    
    const translated = await translateText(sourceValue, from, to);
    
    setForm(prev => ({
      ...prev,
      [field]: translated
    }));
  };

  const handleTranslateAll = async (fields: string[]) => {
    if (isTranslating) return;
    setIsTranslating(true);
    
    const from = isUA ? 'en' : 'uk';
    const to = isUA ? 'uk' : 'en';

    try {
      const updates: Record<string, string> = {};
      
      for (const field of fields) {
        const sourceField = isUA ? `${field}_en` : field;
        const targetField = isUA ? field : `${field}_en`;
        const sourceValue = form[sourceField];
        
        if (sourceValue && typeof sourceValue === 'string' && sourceValue.trim()) {
          // Use a significant delay to avoid rate limiting
          await new Promise(r => setTimeout(r, 600));
          const translated = await translateText(sourceValue, from, to);
          
          // Only update if we actually got a different result (optional check)
          updates[targetField] = translated;
        }
      }

      setForm(prev => ({
        ...prev,
        ...updates
      }));
    } catch (error) {
      console.error('Translation error:', error);
      alert('Помилка при перекладі. Спробуйте ще раз за хвилину.');
    } finally {
      setIsTranslating(false);
    }
  };

  return { handleTranslate, handleTranslateAll, isTranslating };
}
