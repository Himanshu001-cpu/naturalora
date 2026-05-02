import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Star, ShieldCheck, Leaf, FlaskConical, Heart } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import CtaFooter from "../components/CtaFooter";
import { useCartStore } from "../store/cart";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to top on mount/id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { product, loading, error } = useProduct(id);
  const { products: allProducts, loading: productsLoading } = useProducts();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: quantity,
      maxQuantity: 20,
      meta: "Standard Jar"
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const relatedProducts = allProducts.filter((p) => p.id !== product?.id).slice(0, 3);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen pb-24 max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8">
         <div className="w-full md:w-1/2 aspect-square bg-black/5 dark:bg-white/5 animate-pulse rounded-3xl"></div>
         <div className="w-full md:w-1/2 flex flex-col gap-4">
           <div className="h-10 bg-black/5 dark:bg-white/5 animate-pulse rounded-md w-3/4"></div>
           <div className="h-6 bg-black/5 dark:bg-white/5 animate-pulse rounded-md w-full"></div>
           <div className="h-6 bg-black/5 dark:bg-white/5 animate-pulse rounded-md w-5/6"></div>
           <div className="h-8 bg-black/5 dark:bg-white/5 animate-pulse rounded-md w-1/4 mt-4"></div>
         </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen pb-24 flex items-center justify-center px-4">
        <div className="text-center p-8 liquid-glass rounded-3xl max-w-md w-full">
          <h2 className="text-2xl font-heading text-red-500 mb-4">Product Not Found</h2>
          <p className="font-body text-muted-foreground mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/shop" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body font-semibold hover:scale-105 transition-transform">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: isMobile ? "none" : "blur(5px)" }}
      transition={{ duration: isMobile ? 0.3 : 0.6 }}
      className="pt-20 md:pt-32 min-h-screen pb-24"
    >
      {/* Hero Product Section */}
      <section className="max-w-6xl mx-auto md:px-6 mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-20">
          {/* Left: Image (Full width slider on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...honeyTransition, delay: isMobile ? 0 : 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="md:liquid-glass md:rounded-3xl md:p-8 relative group overflow-hidden w-full">
              <div className="aspect-square relative flex items-center justify-center md:rounded-2xl overflow-hidden bg-black/20 snap-x snap-mandatory flex overflow-x-auto hide-scrollbar">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110 snap-center shrink-0"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...honeyTransition, delay: isMobile ? 0.1 : 0.3 }}
            className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-0"
          >
            <div className="mb-6">
              <h1 className="font-heading italic text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 md:mb-3">
                {product.name}
              </h1>
              <p className="font-body text-lg md:text-xl text-muted-foreground font-light mb-4 md:mb-6">
                {product.tagline || product.description || "100% natural and pure honey."}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="font-heading text-3xl text-foreground">
                  ₹{product.price}
                </span>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-body font-medium text-primary">
                    {product.rating || "4.8"}
                  </span>
                </div>
              </div>

              {/* Short Trust Line (Mobile) */}
              <div className="md:hidden flex items-center gap-4 text-sm font-body text-primary font-medium">
                <span className="flex items-center gap-1"><Leaf className="w-4 h-4"/> 100% Raw</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> No additives</span>
              </div>
            </div>

            {/* Micro Details (Desktop) */}
            <div className="hidden md:block space-y-2 mb-8 text-sm font-body text-muted-foreground/80">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {product.status || (product.stock > 0 ? "In Stock" : "Limited Stock")}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-border"></span>
                {product.delivery || "Ships in 24 hours"}
              </p>
            </div>

            {/* Desktop Action Area */}
            <div className="hidden md:block border-t border-border/30 pt-8 mb-8">
              <div className="flex items-center gap-6 mb-8">
                <span className="font-body text-sm text-foreground uppercase tracking-widest">
                  Quantity
                </span>
                <div className="liquid-glass rounded-full flex items-center p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-body text-lg text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 liquid-glass-strong px-8 py-4 rounded-full flex items-center justify-center gap-2 text-sm font-body font-semibold text-foreground hover:scale-[1.02] transition-transform"
                >
                  <ShoppingBag className="w-4 h-4" /> {addedFeedback ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button className="flex-1 bg-white text-[hsl(28,30%,10%)] px-8 py-4 rounded-full flex items-center justify-center gap-2 text-sm font-body font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accordion Details Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={honeyTransition}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border/30">
              <AccordionTrigger className="font-heading italic text-xl md:text-2xl text-foreground hover:no-underline hover:text-primary transition-colors">
                About This Honey
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed font-light text-base md:text-lg">
                Sourced from untouched forest regions, this honey retains its natural enzymes, antioxidants, and deep flavor profile.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-border/30">
              <AccordionTrigger className="font-heading italic text-xl md:text-2xl text-foreground hover:no-underline hover:text-primary transition-colors">
                Sourcing
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed font-light text-base md:text-lg">
                Collected from remote apiaries in biodiversity-rich environments, far away from commercial agriculture and pesticides.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border/30">
              <AccordionTrigger className="font-heading italic text-xl md:text-2xl text-foreground hover:no-underline hover:text-primary transition-colors">
                Purity & Testing
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed font-light text-base md:text-lg">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lab-tested for authenticity</li>
                  <li>No added sugar</li>
                  <li>No heat processing</li>
                  <li>Minimal intervention</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border/30">
              <AccordionTrigger className="font-heading italic text-xl md:text-2xl text-foreground hover:no-underline hover:text-primary transition-colors">
                Taste Profile
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground font-light text-base md:text-lg">
                <div className="flex gap-2 flex-wrap pt-2">
                  {["Floral", "Woody", "Rich finish", "Earthy"].map((taste) => (
                    <span
                      key={taste}
                      className="liquid-glass px-4 py-1.5 rounded-full text-sm font-body text-foreground"
                    >
                      {taste}
                    </span>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Trust Section (Desktop Only) */}
      {!isMobile && (
        <section className="bg-white/5 border-y border-border/20 py-20 mb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Leaf, label: "100% Raw" },
                { icon: ShieldCheck, label: "No Additives" },
                { icon: Heart, label: "Ethically Harvested" },
                { icon: FlaskConical, label: "Lab Verified" },
              ].map((trust, i) => {
                const Icon = trust.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-body text-sm font-medium text-foreground tracking-wide">
                      {trust.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="max-w-6xl mx-auto mb-16 md:mb-32">
        <h2 className="font-heading italic text-2xl md:text-3xl text-foreground mb-6 md:mb-10 px-4 md:px-6 text-left md:text-center">
          You may also like
        </h2>
        <div className="flex overflow-x-auto gap-4 px-4 md:px-6 hide-scrollbar md:grid md:grid-cols-3">
          {relatedProducts.map((p, i) => (
            <Link key={p.id} to={`/product/${p.id}`} className="no-underline group shrink-0 w-[240px] md:w-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...honeyTransition, delay: isMobile ? 0 : i * 0.1 }}
                className="liquid-glass rounded-2xl p-3 md:p-4 flex gap-4 items-center hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-black/20 shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-heading italic text-base md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="font-body text-sm text-foreground">₹{p.price}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="hidden md:block">
        <CtaFooter hideCta={true} />
      </div>

      {/* Sticky Buy Bar (Mobile Only) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/85 backdrop-blur-xl border-t border-border/30 flex items-center justify-between gap-4">
          <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full active:bg-white/10 transition-colors text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-body text-sm font-medium text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full active:bg-white/10 transition-colors text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-primary-foreground py-3.5 px-6 rounded-full text-sm font-body font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform"
          >
            {addedFeedback ? "Added!" : `Add • ₹${product.price * quantity}`}
          </button>
        </div>
      )}
    </motion.div>
  );
}
