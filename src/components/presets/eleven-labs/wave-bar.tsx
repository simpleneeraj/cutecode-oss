import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./eleven-labs.module.css";

export type Bar = {
  id: string;
  low: number;
  peak: number;
  cycles: number;
  phase: number;
};

type WaveBarProps = {
  bar: Bar;
};

export default function WaveBar({ bar }: WaveBarProps) {
  const scaleY = useLoop([bar.low, bar.peak, bar.low * 2, bar.peak * 0.6, bar.low], {
    cycles: bar.cycles,
    phase: bar.phase,
    ease: easeInOut,
  });

  return <motion.span className={styles.bar} style={{ scaleY }} />;
}
