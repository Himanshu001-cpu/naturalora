import { useState, useEffect } from 'react';
import { fetchProductById } from '../lib/api';

const productCache = {};

export const useProduct = (id) => {
  const [product, setProduct] = useState(productCache[id] || null);
  const [loading, setLoading] = useState(!productCache[id]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (productCache[id]) {
      setProduct(productCache[id]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((data) => {
        if (isMounted) {
          productCache[id] = data;
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch product');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
};
