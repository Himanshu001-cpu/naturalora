import React from 'react';
import { AnimatePresence } from 'motion/react';
import CartItem from './CartItem';
import { useCartStore } from '../../store/cart';

export default function CartList() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
