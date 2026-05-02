import { products } from "../data/products";

export const fetchProducts = async () => {
  return products;
};

export const fetchProductById = async (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};
