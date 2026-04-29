import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import CtaFooter from "../components/CtaFooter";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const products = [
  {
    id: "wild-forest",
    name: "Wild Forest Honey",
    tagline: "Deep, earthy, untouched.",
    price: "499",
    image: "/images/wild_forest_honey.png",
  },
  {
    id: "acacia-infused",
    name: "Acacia Infused Honey",
    tagline: "Light, floral, with honeycomb.",
    price: "699",
    image: "/images/acacia_infused_honey.png",
  },
  {
    id: "mountain-raw",
    name: "Mountain Raw Honey",
    tagline: "Rich, dense, cold-pressed.",
    price: "549",
    image: "/images/wild_forest_honey.png", // reused for now
  },
  {
    id: "wildflower-nectar",
    name: "Wildflower Nectar",
    tagline: "Sweet, diverse, vibrant.",
    price: "450",
    image: "/images/acacia_infused_honey.png", // reused for now
  },
];

export default function Shop() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-32 min-h-screen"
    >
      {/* Hero Strip */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mb-12">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(250,204,21,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...honeyTransition, delay: 0.1 }}
            className="font-heading italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            Pure Honey. Nothing Else.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...honeyTransition, delay: 0.2 }}
            className="font-body text-lg text-muted-foreground max-w-xl mx-auto font-light"
          >
            Every jar is harvested with care, preserving what nature intended.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-24 z-40 max-w-3xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...honeyTransition, delay: 0.3 }}
          className="liquid-glass rounded-full px-6 py-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex gap-4">
            <select className="bg-transparent text-sm font-body text-foreground outline-none cursor-pointer border-none appearance-none pr-4">
              <option>Type: All</option>
              <option>Raw</option>
              <option>Wild</option>
              <option>Infused</option>
            </select>
            <span className="w-[1px] h-5 bg-border/50 hidden sm:block"></span>
            <select className="bg-transparent text-sm font-body text-foreground outline-none cursor-pointer border-none appearance-none pr-4 hidden sm:block">
              <option>Size: All</option>
              <option>250g</option>
              <option>500g</option>
              <option>1kg</option>
            </select>
          </div>
          <select className="bg-transparent text-sm font-body text-foreground outline-none cursor-pointer border-none appearance-none">
            <option>Sort: Popular</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </motion.div>
      </div>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <Link key={product.id} to={`/product/${product.id}`} className="no-underline group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...honeyTransition, delay: 0.4 + i * 0.1 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 10px 40px rgba(250,204,21,0.15)",
                }}
                className="liquid-glass rounded-3xl p-6 relative flex flex-col h-full transition-all duration-500"
              >
                <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-black/20 flex items-center justify-center">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Quick Add Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button className="liquid-glass-strong px-6 py-3 rounded-full flex items-center gap-2 text-sm font-body font-semibold hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-heading italic text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground font-light mb-4 flex-1">
                    {product.tagline}
                  </p>
                  <div className="text-xl font-heading font-medium text-foreground">
                    ₹{product.price}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <CtaFooter
        heading="Not all honey is created equal."
        subtext="Discover the meticulous journey from hive to your table."
        primaryBtnText="Explore Our Process"
        primaryBtnLink="/#process"
        secondaryBtnText=""
      />
    </motion.div>
  );
}
