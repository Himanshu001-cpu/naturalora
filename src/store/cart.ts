import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
  meta?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number; maxQuantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingItemIndex !== -1) {
            // Item exists, increase quantity
            const newItems = [...state.items];
            const item = newItems[existingItemIndex];
            const qtyToAdd = newItem.quantity || 1;
            let newQty = item.quantity + qtyToAdd;
            
            if (item.maxQuantity && newQty > item.maxQuantity) {
              newQty = item.maxQuantity;
            }
            
            newItems[existingItemIndex] = { ...item, quantity: newQty };
            return { items: newItems };
          }

          // New item
          const qty = newItem.quantity || 1;
          const initialQty = newItem.maxQuantity && qty > newItem.maxQuantity ? newItem.maxQuantity : qty;
          
          return {
            items: [...state.items, { ...newItem, quantity: initialQty }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.productId === productId) {
                let newQty = quantity;
                if (item.maxQuantity && newQty > item.maxQuantity) {
                  newQty = item.maxQuantity;
                }
                return { ...item, quantity: newQty };
              }
              return item;
            }),
          };
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'naturalora_cart_v1', // localStorage key
    }
  )
);
