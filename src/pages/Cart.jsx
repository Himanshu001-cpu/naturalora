import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, X, ArrowRight, Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialCart = [
  {
    id: 1,
    name: "Wild Forest Honey",
    meta: "500g",
    price: 998,
    image: "/images/honey-jar.png",
    quantity: 1
  },
  {
    id: 2,
    name: "Acacia Honey",
    meta: "250g",
    price: 549,
    image: "/images/honey-jar.png",
    quantity: 2
  }
];

export default function Cart() {
  const [cart, setCart] = useState(initialCart);
  const [promo, setPromo] = useState("");

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 0 : 0; // Free delivery for minimal UI
  const total = subtotal + delivery;

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-32 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 mb-6 rounded-full liquid-glass flex items-center justify-center text-primary"
        >
          <Hexagon className="w-12 h-12" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-heading mb-2"
        >
          Your cart is empty.
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Let's fix that.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full liquid-glass-strong text-primary hover:text-primary-foreground hover:bg-primary transition-colors flex items-center gap-2"
            >
              Browse Honey <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-40 lg:pb-24 px-4 lg:px-16 max-w-7xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-heading mb-8 lg:mb-12"
      >
        Your Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="liquid-glass rounded-2xl p-4 flex gap-4 relative group"
              >
                {/* Image */}
                <div className="w-16 h-16 shrink-0 bg-black/20 rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-foreground pr-8 text-lg">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors absolute top-4 right-4 lg:opacity-0 lg:group-hover:opacity-100 p-1"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.meta}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 liquid-glass rounded-full px-1 py-1">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="w-8 text-center text-base font-medium">{item.quantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    {/* Price */}
                    <span className="font-semibold text-primary text-lg tracking-tight">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right: Order Summary (Desktop only side, mobile bottom) */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="liquid-glass rounded-2xl p-6 sticky top-28"
          >
            <h2 className="text-xl font-heading mb-6">Order Summary</h2>
            
            {/* Promo */}
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Promo code" 
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 bg-black/20 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
              />
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl liquid-glass text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Apply
              </motion.button>
            </div>

            {/* Totals */}
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="border-t border-border/50 pt-4 mt-2 flex justify-between items-center">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-3xl font-bold text-primary text-shimmer">₹{total}</span>
              </div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex w-full rounded-full liquid-glass-strong py-4 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all items-center justify-center gap-2 group"
            >
              Proceed to Checkout 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Sticky Checkout Bar (Mobile Only) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background/80 backdrop-blur-xl border-t border-border/50 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary text-shimmer">₹{total}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-full liquid-glass-strong py-4 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
        >
          Proceed to Checkout
        </motion.button>
      </motion.div>
    </div>
  );
}
