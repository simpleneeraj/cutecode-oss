import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./gemini.module.css";

export type Sparkle = {
  id: string;
  x: number;
  y: number;
  size: number;
  cycles: number;
  phase: number;
};

type GlintProps = {
  sparkle: Sparkle;
};

export default function Glint({ sparkle }: GlintProps) {
  const timing = { cycles: sparkle.cycles, phase: sparkle.phase, ease: easeInOut };
  const opacity = useLoop([0, 1, 0], timing);
  const scale = useLoop([0.3, 1, 0.3], timing);
  const rotate = useLoop([0, 45, 0], timing);

  return (
    <motion.span
      className={styles.glint}
      style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, width: sparkle.size, height: sparkle.size, opacity, scale, rotate }}
    />
  );
}
