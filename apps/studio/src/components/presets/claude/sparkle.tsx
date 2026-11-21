import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./claude.module.css";

export type Star = {
  id: string;
  x: number;
  y: number;
  size: number;
};

type SparkleProps = {
  star: Star;
  phase: number;
};

const STAR_PATH = "M12 0C12.6 7.2 16.8 11.4 24 12C16.8 12.6 12.6 16.8 12 24C11.4 16.8 7.2 12.6 0 12C7.2 11.4 11.4 7.2 12 0Z";

export default function Sparkle({ star, phase }: SparkleProps) {
  const scale = useLoop([0.55, 1, 0.55], { phase, ease: easeInOut });
  const opacity = useLoop([0.35, 1, 0.35], { phase, ease: easeInOut });
  const rotate = useLoop([0, 45], { phase });

  return (
    <motion.svg
      className={styles.sparkle}
      viewBox="0 0 24 24"
      style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, scale, opacity, rotate }}
    >
      <path d={STAR_PATH} fill="currentColor" />
    </motion.svg>
  );
}
