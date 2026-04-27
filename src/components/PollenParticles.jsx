import { motion } from "motion/react";

export default function PollenParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}
