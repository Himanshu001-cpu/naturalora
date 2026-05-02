import React from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../../store/cart';

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="liquid-glass [border-radius:16px] p-4 flex gap-4 relative group border-t border-white/10"
    >
      {/* Image */}
      <div className="w-16 h-16 shrink-0 bg-black/20 [border-radius:8px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-foreground pr-8 text-base truncate min-w-0">{item.name}</h3>
            <button 
              onClick={() => removeItem(item.productId)}
              className="text-muted-foreground active:text-destructive transition-colors absolute top-4 right-4 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Remove item"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{item.meta || "Size not specified"}</p>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 liquid-glass [border-radius:10px] px-2 py-1">
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center [border-radius:6px] text-foreground/70 active:bg-white/10 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center [border-radius:6px] text-foreground/70 active:bg-white/10 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Price */}
          <span className="font-semibold text-primary text-lg tracking-tight">₹{item.price * item.quantity}</span>
        </div>
      </div>
    </motion.div>
  );
}
