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
      // 1. Translate main fields
      for (const field of fields) {
        const sourceField = isUA ? `${field}_en` : field;
        const targetField = isUA ? field : `${field}_en`;
        const sourceValue = form[sourceField];
        
        if (sourceValue && typeof sourceValue === 'string' && sourceValue.trim()) {
          const translated = await translateText(sourceValue, from, to);
          setForm(prev => ({ ...prev, [targetField]: translated }));
          // Small delay to allow UI update and avoid rate limit
          await new Promise(r => setTimeout(r, 400));
        }
      }

      // 2. Translate sections if they exist
      const sectionsKey = isUA ? 'sections' : 'sections_en';
      const sourceSectionsKey = isUA ? 'sections_en' : 'sections';
      const sections = form[sourceSectionsKey];

      if (sections && Array.isArray(sections)) {
        const translatedSections = JSON.parse(JSON.stringify(sections)); // Deep clone
        
        for (let i = 0; i < translatedSections.length; i++) {
          const section = translatedSections[i];
          
          // Translate title if exists
          if (section.title && typeof section.title === 'string') {
            section.title = await translateText(section.title, from, to);
            // Update UI periodically
            setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
            await new Promise(r => setTimeout(r, 400));
          }
          
          // Translate alt if exists (for images)
          if (section.alt && typeof section.alt === 'string') {
            section.alt = await translateText(section.alt, from, to);
            setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
            await new Promise(r => setTimeout(r, 400));
          }

          // Translate content (can be string or array for lists)
          if (section.content) {
            if (typeof section.content === 'string' && section.content.trim()) {
              section.content = await translateText(section.content, from, to);
              setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
              await new Promise(r => setTimeout(r, 400));
            } else if (Array.isArray(section.content)) {
              // It's a list section
              for (let j = 0; j < section.content.length; j++) {
                if (typeof section.content[j] === 'string' && section.content[j].trim()) {
                  section.content[j] = await translateText(section.content[j], from, to);
                  setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
                  await new Promise(r => setTimeout(r, 400));
                }
              }
            }
          }
        }
      }

      alert('Переклад завершено!');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Помилка при перекладі. Можливо, сервіс тимчасово недоступний.');
    } finally {
      setIsTranslating(false);
    }
  };

  return { handleTranslate, handleTranslateAll, isTranslating };
}
