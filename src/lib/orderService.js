export const createOrder = async (cart, customer) => {
  await new Promise((res) => setTimeout(res, 800));

  return {
    id: Date.now().toString(),
    items: cart.items,
    totalAmount: cart.getSubtotal(),
    status: "created",
    createdAt: new Date().toISOString(),
    customer,
  };
};
