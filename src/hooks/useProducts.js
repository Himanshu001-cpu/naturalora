import { useState, useEffect } from 'react';
import { fetchProducts } from '../lib/api';

let productsCache = null;

export const useProducts = () => {
  const [products, setProducts] = useState(productsCache || []);
  const [loading, setLoading] = useState(!productsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productsCache) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProducts()
      .then((data) => {
        if (isMounted) {
          productsCache = data;
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};
