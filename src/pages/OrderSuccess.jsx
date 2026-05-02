import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const paymentResult = location.state?.paymentResult;

  useEffect(() => {
    if (!order) {
      navigate('/shop');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen pt-32 pb-40 lg:pb-24 px-4 flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 rounded-full liquid-glass flex items-center justify-center text-primary mb-8"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl lg:text-4xl font-heading mb-4 text-center"
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground mb-8 text-center"
      >
        Thank you for your purchase. Your honey is on its way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md liquid-glass backdrop-blur-sm rounded-2xl p-6 lg:p-8 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Package className="text-primary w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs text-white/60">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
          </div>
          {paymentResult && (
            <>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/60">Payment ID</p>
                  <p className="font-mono text-sm">{paymentResult.paymentId}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <h3 className="font-heading italic text-lg mb-4 text-primary">Order Summary</h3>
        <div className="space-y-4 mb-6">
          {order.items.map(item => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-white/80">{item.name} x {item.quantity}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-base">Total Amount</span>
          <span className="text-xl font-heading text-primary text-shimmer">₹{order.totalAmount}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/shop">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl liquid-glass-strong text-primary hover:text-primary-foreground hover:bg-primary transition-colors flex items-center gap-2 font-medium"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
