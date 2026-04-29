import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { useEffect } from "react";

export default function HoneyCursorLight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 40, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 40, damping: 30 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  const bg = useMotionTemplate`radial-gradient(circle at ${smoothX}px ${smoothY}px, rgba(255,200,0,0.12), transparent 120px)`;

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: bg
      }}
    />
  );
}
