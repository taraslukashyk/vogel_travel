import { useState } from 'react';
import { translateText } from '../utils/translate';
import { slugify } from '../../lib/utils/slugify';

export function useFormTranslation(form: any, setForm: (updater: (prev: any) => any) => void, isUA: boolean) {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (field: string) => {
    const from = isUA ? 'en' : 'uk';
    const to = isUA ? 'uk' : 'en';
    
    // Determine source field based on current field
    const sourceField = field.endsWith('_en') ? field.replace('_en', '') : `${field}_en`;
    const sourceValue = form[sourceField] as string;
    
    if (!sourceValue) return;
    
    const translated = await translateText(sourceValue, from, to);
    
    setForm(prev => {
      const updates: any = { [field]: translated };
      
      // If we just translated TO English title-like field, update slug
      if (to === 'en' && (field === 'title_en' || field === 'hotel_en' || field === 'name_en')) {
        updates.slug = slugify(translated);
      }
      
      return { ...prev, ...updates };
    });
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
          
          setForm(prev => {
            const updates: any = { [targetField]: translated };
            // Auto-update slug if we are translating TO English title
            if (to === 'en' && (targetField === 'title_en' || targetField === 'hotel_en' || targetField === 'name_en')) {
              updates.slug = slugify(translated);
            }
            return { ...prev, ...updates };
          });
          
          await new Promise(r => setTimeout(r, 400));
        }
      }

      // 2. Translate sections if they exist
      const sectionsKey = isUA ? 'sections' : 'sections_en';
      const sourceSectionsKey = isUA ? 'sections_en' : 'sections';
      const sections = form[sourceSectionsKey];

      if (sections && Array.isArray(sections)) {
        const translatedSections = JSON.parse(JSON.stringify(sections));
        
        for (let i = 0; i < translatedSections.length; i++) {
          const section = translatedSections[i];
          
          if (section.title && typeof section.title === 'string') {
            section.title = await translateText(section.title, from, to);
            setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
            await new Promise(r => setTimeout(r, 400));
          }
          
          if (section.alt && typeof section.alt === 'string') {
            section.alt = await translateText(section.alt, from, to);
            setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
            await new Promise(r => setTimeout(r, 400));
          }

          if (section.content) {
            if (typeof section.content === 'string' && section.content.trim()) {
              section.content = await translateText(section.content, from, to);
              setForm(prev => ({ ...prev, [sectionsKey]: [...translatedSections] }));
              await new Promise(r => setTimeout(r, 400));
            } else if (Array.isArray(section.content)) {
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
