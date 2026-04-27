import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Leaf, Heart, Sparkles, Shield } from "lucide-react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const features = [
  {
    icon: Sparkles,
    title: "100% Raw",
    description:
      "Never heated above hive temperature. Every enzyme, every nutrient preserved.",
  },
  {
    icon: Heart,
    title: "Ethically Harvested",
    description:
      "We take only the surplus. Our bees thrive, and so does the ecosystem around them.",
  },
  {
    icon: Leaf,
    title: "Nutrient Rich",
    description:
      "Packed with antioxidants, enzymes, and trace minerals from wildflower-rich meadows.",
  },
  {
    icon: Shield,
    title: "Lab Tested Purity",
    description:
      "Every batch tested for authenticity, contaminants, and nutritional integrity.",
  },
];

export default function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="our-honey" ref={ref} className="relative py-28 px-6">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...honeyTransition, delay: 0.1 }}
            className="inline-block liquid-glass rounded-full px-5 py-2 mb-6"
          >
            <span className="text-xs font-body font-medium tracking-widest text-primary uppercase">
              Why Naturalora
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ ...honeyTransition, delay: 0.2 }}
            className="font-heading italic text-4xl sm:text-5xl text-foreground mb-4"
          >
            What sets us apart.
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...honeyTransition, delay: 0.3 + i * 0.12 }}
                className="group liquid-glass rounded-3xl p-8 text-center hover:scale-[1.03] transition-transform duration-500 cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading italic text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
