"use client";
import { motion } from "framer-motion";

const circles = Array.from({ length: 10 });

function BlackHoleLoader() {
  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {circles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 rounded-full shadow-2xl shadow-foreground/50"
          initial={{
            scale: 2,
            opacity: 0,
          }}
          animate={{
            scale: [2, 1, 0.1],
            y: [0, -5, 5],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default BlackHoleLoader;
