import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./nuxt.module.css";

export type Chevron = {
  id: string;
  x: number;
  size: number;
  phase: number;
};

type RisingChevronProps = {
  chevron: Chevron;
};

export default function RisingChevron({ chevron }: RisingChevronProps) {
  const y = useLoop([0, -180], { phase: chevron.phase });
  const opacity = useLoop([0, 0.85, 0.4, 0], { phase: chevron.phase });

  return (
    <motion.span
      className={styles.chevron}
      style={{ left: `${chevron.x}%`, width: chevron.size, height: chevron.size, y, opacity }}
    />
  );
}
