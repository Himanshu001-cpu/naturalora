import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { createOrder } from '../lib/orderService';
import { initiatePayment } from '../lib/paymentService';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subtotal = getSubtotal();
  const delivery = subtotal > 0 ? 0 : 0;
  const total = subtotal + delivery;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items, navigate, isProcessing]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.house.trim()) newErrors.house = 'House/Flat No is required';
    if (!formData.street.trim()) newErrors.street = 'Street/Area is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsProcessing(true);
    setErrors({});
    
    try {
      const cartObj = {
        items,
        getSubtotal: () => subtotal
      };
      
      const combinedAddress = `${formData.house}, ${formData.street}, ${formData.city}, ${formData.state}`;
      const submitData = { ...formData, address: combinedAddress };
      
      const order = await createOrder(cartObj, submitData);
      const paymentResult = await initiatePayment(order);
      
      clearCart();
      navigate('/order-success', { state: { order, paymentResult } });
      
    } catch (err) {
      if (err.message === "Payment failed") {
        setErrors({ general: 'Payment failed. Try again.' });
      } else {
        setErrors({ general: 'Order creation failed. Please try again.' });
      }
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen pt-28 pb-40 lg:pb-24 px-4 lg:px-16 max-w-5xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </motion.button>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-heading mb-8 lg:mb-12"
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="liquid-glass backdrop-blur-sm [border-radius:20px] p-6 lg:p-8">
            <h2 className="text-xl font-heading mb-6 italic text-primary">Shipping Details</h2>
            
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 [border-radius:10px] mb-6 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="block text-sm text-white/60 mb-1.5">Contact Details</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-black/20 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full bg-black/20 border ${errors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                  placeholder="Phone Number (10 digits)"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm text-white/60 mb-1.5">Delivery Address</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="house"
                      value={formData.house}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border ${errors.house ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                      placeholder="Flat 203, House No"
                    />
                    {errors.house && <p className="text-red-400 text-xs mt-1">{errors.house}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border ${errors.street ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                      placeholder="MG Road, Area"
                    />
                    {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border ${errors.city ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                      placeholder="Indore"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full bg-black/20 border ${errors.state ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full bg-black/20 border ${errors.pincode ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors`}
                    placeholder="6-digit Pincode"
                  />
                  {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
              
              <div className="pt-4 lg:hidden">
                <motion.button 
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  disabled={isProcessing}
                  type="submit"
                  className="w-full [border-radius:10px] liquid-glass-strong py-4 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Place Order <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="liquid-glass backdrop-blur-sm [border-radius:20px] p-6 lg:p-8 space-y-6 sticky top-28">
            <h2 className="text-xl font-heading italic text-primary">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 [border-radius:10px] bg-black/40 overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Delivery</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              
              <div className="border-t border-white/10 my-2 pt-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Total</span>
                <span className="text-2xl font-heading text-primary text-shimmer">₹{total}</span>
              </div>
            </div>

            <motion.button 
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              disabled={isProcessing}
              onClick={handleSubmit}
              className="hidden lg:flex w-full [border-radius:10px] liquid-glass-strong py-4 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Place Order <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
