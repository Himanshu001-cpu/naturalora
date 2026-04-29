import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Star, ShieldCheck, Leaf, FlaskConical, Heart } from "lucide-react";
import CtaFooter from "../components/CtaFooter";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Scroll to top on mount/id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Dummy product fetching based on id
  const product = {
    id: id || "wild-forest",
    name: id === "acacia-infused" ? "Acacia Infused Honey" : "Wild Forest Honey",
    tagline: id === "acacia-infused" ? "Light, floral, with honeycomb." : "Deep, earthy, untouched.",
    price: id === "acacia-infused" ? "699" : "499",
    image: id === "acacia-infused" ? "/images/acacia_infused_honey.png" : "/images/wild_forest_honey.png",
    rating: 4.9,
    reviews: 128,
    status: "In Stock",
    delivery: "Ships in 24 hours",
  };

  const relatedProducts = [
    {
      id: "mountain-raw",
      name: "Mountain Raw Honey",
      price: "549",
      image: "/images/wild_forest_honey.png",
    },
    {
      id: "acacia-infused",
      name: "Acacia Infused Honey",
      price: "699",
      image: "/images/acacia_infused_honey.png",
    },
    {
      id: "wildflower-nectar",
      name: "Wildflower Nectar",
      price: "450",
      image: "/images/wild_forest_honey.png",
    },
  ].filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: 0.6 }}
      className="pt-32 min-h-screen"
    >
      {/* Hero Product Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...honeyTransition, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="liquid-glass rounded-3xl p-4 md:p-8 relative group overflow-hidden">
              <div className="aspect-square relative flex items-center justify-center rounded-2xl overflow-hidden bg-black/20">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...honeyTransition, delay: 0.3 }}
            className="w-full md:w-1/2 flex flex-col justify-center"
          >
            <div className="mb-6">
              <h1 className="font-heading italic text-4xl sm:text-5xl text-foreground mb-3">
                {product.name}
              </h1>
              <p className="font-body text-xl text-muted-foreground font-light mb-6">
                {product.tagline}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-heading text-3xl text-foreground">
                  ₹{product.price}
                </span>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-body font-medium text-primary">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Details */}
            <div className="space-y-2 mb-8 text-sm font-body text-muted-foreground/80">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {product.status}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-border"></span>
                {product.delivery}
              </p>
            </div>

            <div className="border-t border-border/30 pt-8 mb-8">
              {/* Quantity */}
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

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 liquid-glass-strong px-8 py-4 rounded-full flex items-center justify-center gap-2 text-sm font-body font-semibold text-foreground hover:scale-[1.02] transition-transform">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button className="flex-1 bg-white text-[hsl(28,30%,10%)] px-8 py-4 rounded-full flex items-center justify-center gap-2 text-sm font-body font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details Sections */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={honeyTransition}
          className="space-y-16"
        >
          <div>
            <h3 className="font-heading italic text-2xl text-foreground mb-4">
              1. About This Honey
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed font-light">
              Sourced from untouched forest regions, this honey retains its
              natural enzymes, antioxidants, and deep flavor profile. Every jar
              represents the unique terroir of the season it was harvested in.
            </p>
          </div>

          <div>
            <h3 className="font-heading italic text-2xl text-foreground mb-4">
              2. Sourcing
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed font-light">
              Collected from remote apiaries where bees thrive in
              biodiversity-rich environments, far away from commercial
              agriculture and pesticides.
            </p>
          </div>

          <div>
            <h3 className="font-heading italic text-2xl text-foreground mb-4">
              3. Purity & Testing
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed font-light">
              Lab-tested for authenticity. No added sugar. No heat processing.
              We believe in minimal intervention to keep the honey exactly as the
              bees made it.
            </p>
          </div>

          <div>
            <h3 className="font-heading italic text-2xl text-foreground mb-4">
              4. Taste Profile
            </h3>
            <div className="flex gap-4 flex-wrap">
              {["Floral", "Woody", "Rich finish", "Earthy"].map((taste) => (
                <span
                  key={taste}
                  className="liquid-glass px-5 py-2 rounded-full text-sm font-body text-muted-foreground"
                >
                  {taste}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
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

      {/* Related Products */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <h2 className="font-heading italic text-3xl text-foreground mb-10 text-center">
          You may also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((p, i) => (
            <Link key={p.id} to={`/product/${p.id}`} className="no-underline group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...honeyTransition, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-4 flex gap-4 items-center hover:bg-white/10 transition-colors"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-heading italic text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="font-body text-sm text-foreground">₹{p.price}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <CtaFooter hideCta={true} />
    </motion.div>
  );
}
