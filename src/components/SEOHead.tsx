import { Helmet } from 'react-helmet-async';
import { useSeoMeta } from '../lib/queries/seo';

interface SEOHeadProps {
  pagePath: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const SEOHead = ({ pagePath, fallbackTitle, fallbackDescription }: SEOHeadProps) => {
  const { data: seo } = useSeoMeta(pagePath);

  const title = seo?.title || fallbackTitle || 'Vogel Family Travel';
  const description = seo?.description || fallbackDescription || '';

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo?.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
      <meta property="og:title" content={seo?.og_title || title} />
      {(seo?.og_description || description) && (
        <meta property="og:description" content={seo?.og_description || description} />
      )}
      {seo?.og_image && <meta property="og:image" content={seo.og_image} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEOHead;
