import { Helmet } from 'react-helmet-async';
import { useSeoMeta } from '../lib/queries/seo';
import { useLanguage } from '../hooks/useLanguage';

interface SEOHeadProps {
  /** Static page path for seo_meta table lookup (e.g. "/offers", "/blog") */
  pagePath?: string;
  /** Override title — used for dynamic pages like /offers/:id */
  title?: string;
  /** Override description */
  description?: string;
  /** Override OG image */
  ogImage?: string;
  /** Fallback title if nothing else set */
  fallbackTitle?: string;
  /** Fallback description */
  fallbackDescription?: string;
}

const SEOHead = ({ pagePath, title, description, ogImage, fallbackTitle, fallbackDescription }: SEOHeadProps) => {
  const { currentLang } = useLanguage();
  
  // Clean path for database lookup (strip language prefix)
  // e.g. "/ua/offers" -> "/offers", "/en" -> "/"
  const cleanPath = pagePath 
    ? pagePath.replace(new RegExp(`^\\/${currentLang}`), '') || '/'
    : '__none__';

  const { data: seo } = useSeoMeta(cleanPath);

  // Use language specific fields if available
  const dbTitle = currentLang === 'en' ? (seo?.title_en || seo?.title) : seo?.title;
  const dbDescription = currentLang === 'en' ? (seo?.description_en || seo?.description) : seo?.description;
  const dbOgTitle = currentLang === 'en' ? (seo?.og_title_en || seo?.og_title) : seo?.og_title;
  const dbOgDescription = currentLang === 'en' ? (seo?.og_description_en || seo?.og_description) : seo?.og_description;

  const finalTitle = title || dbTitle || fallbackTitle || 'Vogel Family Travel';
  const finalDescription = description || dbDescription || fallbackDescription || '';
  const finalOgTitle = dbOgTitle || finalTitle;
  const finalOgDescription = dbOgDescription || finalDescription;
  const finalOgImage = ogImage || seo?.og_image || '';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo?.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
      <meta property="og:title" content={finalOgTitle} />
      {finalOgDescription && <meta property="og:description" content={finalOgDescription} />}
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEOHead;
