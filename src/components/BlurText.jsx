import { motion, useInView } from "motion/react";
import { useRef } from "react";

const honeyTransition = { type: "spring", stiffness: 120, damping: 20 };

export default function BlurText({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center gap-x-3 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{
            ...honeyTransition,
            delay: delay + i * 0.12,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
