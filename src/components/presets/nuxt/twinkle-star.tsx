import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./nuxt.module.css";

export type Star = {
  id: string;
  x: number;
  y: number;
  size: number;
  cycles: number;
  phase: number;
};

type TwinkleStarProps = {
  star: Star;
};

export default function TwinkleStar({ star }: TwinkleStarProps) {
  const timing = { cycles: star.cycles, phase: star.phase, ease: easeInOut };
  const opacity = useLoop([0.15, 0.9, 0.15], timing);
  const scale = useLoop([0.6, 1, 0.6], timing);

  return (
    <motion.span
      className={styles.star}
      style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity, scale }}
    />
  );
}
