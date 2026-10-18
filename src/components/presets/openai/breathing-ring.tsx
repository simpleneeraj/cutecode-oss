import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./openai.module.css";

export type Ring = {
  id: string;
  size: number;
  phase: number;
};

type BreathingRingProps = {
  ring: Ring;
};

export default function BreathingRing({ ring }: BreathingRingProps) {
  const scale = useLoop([1, 1.04, 1], { phase: ring.phase, ease: easeInOut });
  const opacity = useLoop([0.35, 1, 0.35], { phase: ring.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.ring}
      style={{ width: ring.size, height: ring.size, marginLeft: -ring.size / 2, marginTop: -ring.size / 2, scale, opacity }}
    />
  );
}
