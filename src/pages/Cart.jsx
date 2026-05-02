import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Hexagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CartList from '../components/cart/CartList';
import { useCartStore } from '../store/cart';

export default function Cart() {
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const delivery = subtotal > 0 ? 0 : 0; // Free delivery for minimal UI
  const total = subtotal + delivery;

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 pb-32 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 mb-6 rounded-2xl liquid-glass flex items-center justify-center text-primary"
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
          <Link to="/shop">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl liquid-glass-strong text-primary hover:text-primary-foreground hover:bg-primary transition-colors flex items-center gap-2"
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
        <CartList />

        {/* Right: Order Summary (Desktop only side, mobile bottom) */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="liquid-glass backdrop-blur-sm [border-radius:16px] p-5 space-y-4 sticky top-28 max-w-md mx-auto"
          >
            <h2 className="font-heading text-lg italic">Order Summary</h2>
            
            {/* Promo */}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Promo code" 
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 bg-transparent border border-white/10 [border-radius:8px] px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
              />
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 [border-radius:8px] liquid-glass-strong text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Apply
              </motion.button>
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Delivery</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              
              <div className="border-t border-white/10 my-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Total</span>
                <span className="text-2xl font-heading text-primary text-shimmer">₹{total}</span>
              </div>
            </div>

            <motion.button 
              onClick={() => navigate('/checkout')}
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex w-full [border-radius:10px] liquid-glass-strong py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all items-center justify-center gap-2 group"
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
        className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background/80 backdrop-blur-sm border-t border-white/10 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary text-shimmer">₹{total}</span>
        </div>
        <motion.button 
          onClick={() => navigate('/checkout')}
          whileTap={{ scale: 0.98 }}
          className="w-full [border-radius:10px] liquid-glass-strong py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
        >
          Proceed to Checkout
        </motion.button>
      </motion.div>
    </div>
  );
}
