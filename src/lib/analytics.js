/**
 * Modular Google Analytics 4 Integration
 *
 * Safe, lightweight analytics layer that initializes GA4 only when
 * VITE_GA4_MEASUREMENT_ID is configured in environment variables.
 */

import logger from '../utils/logger';

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

let isInitialized = false;

export function initAnalytics() {
  if (typeof window === 'undefined' || !GA_ID || isInitialized) return;

  try {
    // Dynamically inject gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      send_page_view: false, // We manually send page views on route changes
    });

    isInitialized = true;
    logger.info('Google Analytics 4 initialized successfully with ID:', GA_ID);
  } catch (err) {
    logger.error('Failed to initialize GA4:', err);
  }
}

export function trackPageView(url, title) {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: url,
    page_title: title || document.title,
  });
}

export function trackProductView(product) {
  if (!isInitialized || !window.gtag || !product) return;

  window.gtag('event', 'view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.type || 'honey',
      },
    ],
  });
}

export function trackAddToCart(item, quantity = 1) {
  if (!isInitialized || !window.gtag || !item) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: item.price * quantity,
    items: [
      {
        item_id: item.productId || item.id,
        item_name: item.name,
        price: item.price,
        quantity,
      },
    ],
  });
}

export function trackBeginCheckout(items, totalAmount) {
  if (!isInitialized || !window.gtag || !items) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: totalAmount,
    items: items.map((item) => ({
      item_id: item.productId || item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchase(orderId, totalAmount, items) {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: orderId,
    value: totalAmount,
    currency: 'INR',
    items: (items || []).map((item) => ({
      item_id: item.productId || item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackSearch(searchQuery, resultsCount = 0) {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchQuery,
    number_of_results: resultsCount,
  });
}
