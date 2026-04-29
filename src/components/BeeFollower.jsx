import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import bee from "../assets/bee.svg";

export default function BeeFollower() {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth delayed motion (honey-like)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    // Check if mobile
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const move = (e) => {
      // Offset by 40px to follow like it's chasing
      mouseX.set(e.clientX - 40);
      mouseY.set(e.clientY - 40);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <motion.img
        src={bee}
        alt="bee follower"
        className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,200,0,0.6)]"
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
