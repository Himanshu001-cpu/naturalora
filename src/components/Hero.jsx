import { motion } from "motion/react";
import { Play, ShoppingBag } from "lucide-react";
import BlurText from "./BlurText";
import PollenParticles from "./PollenParticles";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: "1000px" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt="Golden honey"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28,30%,8%)/0.6] via-[hsl(28,30%,8%)/0.4] to-[hsl(28,30%,8%)/0.9]" />
        {/* Golden radial overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(250, 204, 21, 0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Honey Drip */}
      <div className="honey-drip" />

      {/* Pollen Particles */}
      <PollenParticles />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...honeyTransition, delay: 0.3 }}
          className="liquid-glass rounded-full px-6 py-2 mb-8"
        >
          <span className="text-sm font-body font-medium tracking-widest text-primary uppercase">
            Pure · Natural · Ethical
          </span>
        </motion.div>

        {/* Heading */}
        <h1 className="font-heading italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-8">
          <BlurText text="Nature's Gold, Perfected." delay={0.5} />
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ ...honeyTransition, delay: 1.2 }}
          className="font-body text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light"
        >
          Raw, unprocessed honey sourced from pristine landscapes. No additives. No
          shortcuts. Just purity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...honeyTransition, delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#shop"
            className="liquid-glass-strong inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-foreground hover:scale-105 transition-transform duration-300 no-underline"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Honey
          </a>
          <a
            href="#process"
            className="liquid-glass inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-medium text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-300 no-underline"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-primary fill-primary" />
            </div>
            Watch the Harvest
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0], y: [0, 12] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
