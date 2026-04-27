import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

export default function StartSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="process"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...honeyTransition, delay: 0.1 }}
          className="inline-block liquid-glass rounded-full px-5 py-2 mb-8"
        >
          <span className="text-xs font-body font-medium tracking-widest text-primary uppercase">
            Our Process
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ ...honeyTransition, delay: 0.2 }}
          className="font-heading italic text-4xl sm:text-5xl md:text-6xl text-foreground mb-6"
        >
          From Hive to Jar.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...honeyTransition, delay: 0.4 }}
          className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Sustainably harvested. Carefully filtered. Delivered without losing
          what nature created.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#shop"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...honeyTransition, delay: 0.6 }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:scale-105 transition-transform duration-300 no-underline"
        >
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </motion.a>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ ...honeyTransition, delay: 0.8 }}
          className="mt-16 relative rounded-3xl overflow-hidden liquid-glass"
        >
          <img
            src="/images/honey-jar.png"
            alt="Premium honey jar"
            className="w-full max-h-[500px] object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(28,30%,8%)] via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
