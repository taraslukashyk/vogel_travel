import { useLanguage } from './useLanguage';

export function useLanguageContent() {
  const { currentLang } = useLanguage();
  const isEn = currentLang === 'en';

  /**
   * Helper to get localized value of a field.
   * If the field has an _en version and current language is English, returns it.
   * Otherwise returns the original field value.
   */
  const t = <T extends Record<string, any>>(obj: T | null | undefined, field: string): any => {
    if (!obj) return '';
    
    if (isEn) {
      const enKey = `${field}_en`;
      if (enKey in obj && obj[enKey]) {
        console.log(`[Translation] Found EN for ${field}:`, obj[enKey]);
        return obj[enKey];
      }
      console.log(`[Translation] MISSING EN for ${field}, keys available:`, Object.keys(obj));
    }
    
    return obj[field] || '';
  };

  /**
   * Specifically for sections which might be stored in 'sections' and 'sections_en'
   */
  const sections = (obj: any) => {
    if (!obj) return [];
    if (isEn && obj.sections_en && obj.sections_en.length > 0) {
      return obj.sections_en;
    }
    return obj.sections || [];
  };

  return {
    t,
    sections,
    currentLang,
    isEn
  };
}
