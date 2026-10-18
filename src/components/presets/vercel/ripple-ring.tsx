import { motion, easeOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./vercel.module.css";

type RippleRingProps = {
  phase: number;
};

export default function RippleRing({ phase }: RippleRingProps) {
  const scale = useLoop([0.2, 1.5], { phase, ease: easeOut });
  const opacity = useLoop([0, 0.8, 0], { phase });

  return <motion.span className={styles.ring} style={{ scale, opacity }} />;
}
