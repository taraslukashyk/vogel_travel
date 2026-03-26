import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uaTranslations from './locales/ua.json';
import enTranslations from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ua: { translation: uaTranslations },
      en: { translation: enTranslations }
    },
    fallbackLng: 'ua',
    lng: 'ua', // Explicitly set starting language or use detector
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;
