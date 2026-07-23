import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Naturalora';
const DEFAULT_DOMAIN = import.meta.env.VITE_SITE_URL || 'https://naturalora.com';
const DEFAULT_IMAGE = `${DEFAULT_DOMAIN}/images/hero-bg.webp`;

export default function SEOHead({
  title,
  description = "Naturalora — Premium raw honey sourced from pristine, untouched landscapes. Pure, unprocessed, and ethically harvested.",
  keywords = "raw honey, natural honey, organic honey, wildflower honey, acacia honey",
  canonicalPath = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nature's Gold, Perfected`;
  const canonicalUrl = `${DEFAULT_DOMAIN}${canonicalPath}`;

  return (
    <Helmet>
      {/* Basic Title & Description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalPath && <link rel="canonical" href={canonicalUrl} />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
