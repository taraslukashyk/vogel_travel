import { Helmet } from 'react-helmet-async';
import { useSeoMeta } from '../lib/queries/seo';

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
  const { data: seo } = useSeoMeta(pagePath || '__none__');

  const finalTitle = title || seo?.title || fallbackTitle || 'Vogel Family Travel';
  const finalDescription = description || seo?.description || fallbackDescription || '';
  const finalOgTitle = seo?.og_title || finalTitle;
  const finalOgDescription = seo?.og_description || finalDescription;
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
