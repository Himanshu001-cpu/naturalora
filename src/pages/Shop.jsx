import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Plus, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import CtaFooter from "../components/CtaFooter";
import { useCartStore } from "../store/cart";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

import { useProducts } from "../hooks/useProducts";

const types = ["All", "Raw", "Wild", "Infused"];

export default function Shop() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeType, setActiveType] = useState("All");
  const [addedItems, setAddedItems] = useState({});

  const { products, loading, error } = useProducts();

  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getSubtotal());

  const handleQuickAdd = (e, product) => {
    e.preventDefault(); // Prevent Link navigation
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      maxQuantity: 20,
      meta: "Standard Jar"
    });
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.5 }}
      className="pt-24 md:pt-32 min-h-screen pb-24 md:pb-0"
    >
      {/* Hero Strip */}
      <section className="relative h-[180px] md:h-[300px] flex items-center justify-center overflow-hidden mb-8 md:mb-12">
        {!isMobile && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(250,204,21,0.08) 0%, transparent 70%)",
            }}
          />
        )}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...honeyTransition, delay: 0.1 }}
            className="font-heading italic text-4xl sm:text-5xl text-foreground mb-2 md:mb-4"
          >
            Pure Honey<span className="hidden md:inline">. Nothing Else.</span>
            <span className="md:hidden">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...honeyTransition, delay: 0.2 }}
            className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-light"
          >
            <span className="md:hidden">Nothing else.</span>
            <span className="hidden md:inline">
              Every jar is harvested with care, preserving what nature intended.
            </span>
          </motion.p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] md:top-24 z-40 max-w-3xl mx-auto px-4 md:px-6 mb-8 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...honeyTransition, delay: 0.3 }}
          className="liquid-glass rounded-full p-2 md:px-6 md:py-4 flex items-center gap-2 overflow-x-auto hide-scrollbar"
        >
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-body transition-colors ${
                activeType === type
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
          <div className="ml-auto pl-4 hidden md:block border-l border-border/30">
            <select className="bg-transparent text-sm font-body text-foreground outline-none cursor-pointer border-none appearance-none">
              <option>Sort: Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </motion.div>
      </div>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-24">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="liquid-glass [border-radius:16px] p-3 md:p-6 relative flex flex-col h-full min-h-[250px] md:min-h-[350px] animate-pulse">
                <div className="relative aspect-square mb-3 md:mb-6 [border-radius:10px] bg-black/10 dark:bg-white/10" />
                <div className="h-6 bg-black/10 dark:bg-white/10 rounded-md w-3/4 mb-2" />
                <div className="hidden md:block h-4 bg-black/10 dark:bg-white/10 rounded-md w-full mb-4" />
                <div className="h-6 bg-black/10 dark:bg-white/10 rounded-md w-1/4 mt-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 liquid-glass rounded-3xl mx-auto max-w-lg">
            <h3 className="text-xl md:text-2xl font-heading text-red-500 mb-3">Unable to load products</h3>
            <p className="text-muted-foreground font-body text-sm md:text-base mb-6 px-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-semibold transition-transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-heading text-foreground mb-2">No products found.</h3>
            <p className="text-muted-foreground font-body">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.map((product, i) => (
            <Link key={product.id} to={`/product/${product.id}`} className="no-underline group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...honeyTransition, delay: isMobile ? 0 : 0.4 + i * 0.1 }}
                whileHover={isMobile ? {} : {
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 10px 40px rgba(250,204,21,0.15)",
                }}
                className="liquid-glass [border-radius:16px] p-3 md:p-6 relative flex flex-col h-full min-h-[200px] md:min-h-[340px] transition-all duration-300"
              >
                <div className="relative aspect-square mb-3 md:mb-6 overflow-hidden [border-radius:10px] bg-black/20 flex items-center justify-center">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Quick Add Button - Desktop Only */}
                  {!isMobile && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="liquid-glass-strong px-6 py-3 rounded-full flex items-center gap-2 text-sm font-body font-semibold hover:scale-105 transition-transform"
                      >
                        {addedItems[product.id] ? "Added!" : <><Plus className="w-4 h-4" /> Add to Cart</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-heading italic text-lg md:text-2xl text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 min-w-0">
                    {product.name}
                  </h3>
                  <p className="hidden md:block font-body text-sm text-muted-foreground font-light mb-4 flex-1">
                    {product.tagline}
                  </p>
                  <div className="text-base md:text-xl font-heading font-medium text-foreground mt-auto md:mt-0">
                    ₹{product.price}
                  </div>
                  {/* Mobile Add Button */}
                  {isMobile && (
                    <button 
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="mt-3 w-full [border-radius:10px] liquid-glass-strong py-2 text-xs font-body font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      {addedItems[product.id] ? "Added!" : <><Plus className="w-3 h-3" /> Add</>}
                    </button>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        )}
      </section>

      {/* CTA Banner - Hidden on mobile for cleaner flow */}
      <div className="hidden md:block">
        <CtaFooter
          heading="Not all honey is created equal."
          subtext="Discover the meticulous journey from hive to your table."
          primaryBtnText="Explore Our Process"
          primaryBtnLink="/#process"
          secondaryBtnText=""
        />
      </div>

      {/* Bottom Cart Bar - Mobile Only */}
      {isMobile && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-body text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
              <span className="text-lg font-heading font-medium text-foreground">₹{subtotal}</span>
            </div>
            <Link to="/cart">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-body font-semibold flex items-center gap-2 active:scale-95 transition-transform">
                <ShoppingBag className="w-4 h-4" /> View Cart
              </button>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
