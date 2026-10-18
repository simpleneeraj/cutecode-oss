import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

export type Ember = {
  id: string;
  x: number;
  y: number;
  phase: number;
};

type SparkProps = {
  ember: Ember;
};

export default function Spark({ ember }: SparkProps) {
  const scale = useLoop([0.4, 1, 0.4], { phase: ember.phase, ease: easeInOut });
  const opacity = useLoop([0.2, 1, 0.2], { phase: ember.phase, ease: easeInOut });

  return <motion.circle className={styles.spark} cx={ember.x} cy={ember.y} r="4" style={{ scale, opacity }} />;
}
