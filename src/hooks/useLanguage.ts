import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const { lang: currentLang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (newLang: 'ua' | 'en') => {
    if (newLang === currentLang) return;
    
    // Replace the current language prefix with the new one
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'ua' || pathSegments[0] === 'en') {
      pathSegments[0] = newLang;
    } else {
      pathSegments.unshift(newLang);
    }
    
    const newPath = '/' + pathSegments.join('/') + location.search + location.hash;
    navigate(newPath);
    i18n.changeLanguage(newLang);
  };

  const l = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Remove existing language prefix if present in the manual path
    const segments = cleanPath.split('/');
    if (segments[0] === 'ua' || segments[0] === 'en') {
      segments.shift();
    }
    return `/${currentLang || i18n.language || 'ua'}/${segments.join('/')}`;
  };

  return {
    t,
    i18n,
    currentLang: (currentLang || i18n.language || 'ua') as 'ua' | 'en',
    changeLanguage,
    l, // language-aware link helper
  };
}
