import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { useEffect } from "react";
import useReducedMotion from "../hooks/useReducedMotion";
import useDeviceCapability from "../hooks/useDeviceCapability";

export default function HoneyCursorLight() {
  const prefersReducedMotion = useReducedMotion();
  const { isLowEnd } = useDeviceCapability();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 40, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 40, damping: 30 });

  useEffect(() => {
    if (prefersReducedMotion || isLowEnd) return;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, prefersReducedMotion, isLowEnd]);

  if (prefersReducedMotion || isLowEnd) {
    return null;
  }

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

