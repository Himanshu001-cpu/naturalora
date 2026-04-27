import { motion, useInView } from "motion/react";
import { useRef } from "react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const rows = [
  {
    title: "Pure. Unprocessed. Unmatched.",
    body: "No heat. No chemicals. No dilution. Just raw honey exactly as it exists in nature.",
    image: "/images/bees-honeycomb.png",
    imageAlt: "Bees on honeycomb",
    reverse: false,
  },
  {
    title: "Sourced from untouched landscapes.",
    body: "Collected from remote apiaries where biodiversity thrives and pollution doesn't.",
    image: "/images/sourcing.png",
    imageAlt: "Pristine mountain apiary",
    reverse: true,
  },
];

function ChessRow({ title, body, image, imageAlt, reverse, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-12 lg:gap-20`}
    >
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ ...honeyTransition, delay: 0.2 }}
        className="flex-1 text-center lg:text-left"
      >
        <h3 className="font-heading italic text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
          {title}
        </h3>
        <p className="font-body text-lg text-muted-foreground font-light leading-relaxed max-w-lg">
          {body}
        </p>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -60 : 60, scale: 0.92 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ ...honeyTransition, delay: 0.4 }}
        className="flex-1 w-full"
      >
        <div className="relative rounded-3xl overflow-hidden liquid-glass group">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-80 sm:h-96 object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(28,30%,8%)/0.3] via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturesChess() {
  return (
    <section id="sourcing" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        {rows.map((row, i) => (
          <ChessRow key={i} {...row} index={i} />
        ))}
      </div>
    </section>
  );
}
