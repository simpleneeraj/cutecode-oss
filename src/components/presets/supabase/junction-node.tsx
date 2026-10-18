import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

export type Junction = {
  id: string;
  x: number;
  y: number;
  phase: number;
};

type JunctionNodeProps = {
  junction: Junction;
};

export default function JunctionNode({ junction }: JunctionNodeProps) {
  const scale = useLoop([1, 1.6, 1, 1], { phase: junction.phase, ease: easeInOut });
  const opacity = useLoop([0.45, 1, 0.45, 0.45], { phase: junction.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.node}
      style={{ left: `${junction.x}%`, top: `${junction.y}%`, scale, opacity }}
    />
  );
}
