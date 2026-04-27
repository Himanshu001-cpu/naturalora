import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useRef, useEffect, useState } from "react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

const stats = [
  { value: 10000, suffix: "+", label: "Jars Delivered" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 0, suffix: "", label: "Additives", displayValue: "0" },
  { value: 100, suffix: "%", label: "Natural" },
];

function AnimatedCounter({ target, suffix, isInView }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span className="text-shimmer">
      {target === 0 ? "0" : display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-28 px-6">
      {/* Divider line */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ ...honeyTransition, delay: 0.1 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-20 origin-center"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...honeyTransition, delay: 0.2 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-heading italic text-4xl sm:text-5xl md:text-6xl text-foreground mb-3">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>
              <p className="font-body text-sm text-muted-foreground tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ ...honeyTransition, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-20 origin-center"
        />
      </div>
    </section>
  );
}
