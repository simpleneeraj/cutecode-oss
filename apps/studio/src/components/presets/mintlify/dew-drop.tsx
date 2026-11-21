import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./mintlify.module.css";

export type Drop = {
  id: string;
  x: number;
  y: number;
  size: number;
  phase: number;
};

type DewDropProps = {
  drop: Drop;
};

export default function DewDrop({ drop }: DewDropProps) {
  const scale = useLoop([0.6, 1, 0.6], { phase: drop.phase, ease: easeInOut });
  const opacity = useLoop([0.15, 0.7, 0.15], { phase: drop.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.drop}
      style={{ left: `${drop.x}%`, top: `${drop.y}%`, width: drop.size, height: drop.size, scale, opacity }}
    />
  );
}
