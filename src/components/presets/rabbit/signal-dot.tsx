import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./rabbit.module.css";

type SignalDotProps = {
  phase: number;
};

export default function SignalDot({ phase }: SignalDotProps) {
  const scale = useLoop([0.6, 1, 0.6, 0.6], { cycles: 2, phase, ease: easeInOut });
  const opacity = useLoop([0.3, 1, 0.3, 0.3], { cycles: 2, phase, ease: easeInOut });

  return <motion.span className={styles.signalDot} style={{ scale, opacity }} />;
}
