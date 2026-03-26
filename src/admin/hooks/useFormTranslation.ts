import { translateText } from '../utils/translate';

export function useFormTranslation(form: any, setForm: (updater: (prev: any) => any) => void, isUA: boolean) {
  const handleTranslate = async (field: string) => {
    // Determine the source and target fields based on the current tab
    // We always want to translate FROM the version of the OTHER tab TO the CURRENT tab version.
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

  return { handleTranslate };
}
