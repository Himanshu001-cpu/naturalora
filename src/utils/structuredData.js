const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://naturalora.com';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Naturalora',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: 'Premium raw honey sourced from pristine, untouched landscapes. Pure, unprocessed, and ethically harvested.',
    sameAs: [
      'https://instagram.com/naturalora',
      'https://facebook.com/naturalora',
      'https://twitter.com/naturalora',
    ],
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Naturalora',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductSchema(product) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.startsWith('http') ? product.image : `${SITE_URL}${product.image}`,
    description: product.description || 'Raw unprocessed organic honey.',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Naturalora',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 12,
    } : undefined,
  };
}

export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
