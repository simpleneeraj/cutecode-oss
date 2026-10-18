import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./openai.module.css";

export type Mote = {
  id: string;
  x: number;
  y: number;
  size: number;
  phase: number;
};

type FloatingMoteProps = {
  mote: Mote;
};

export default function FloatingMote({ mote }: FloatingMoteProps) {
  const y = useLoop([0, -14, 0], { phase: mote.phase, ease: easeInOut });
  const opacity = useLoop([0.15, 0.8, 0.15], { phase: mote.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.mote}
      style={{ left: `${mote.x}%`, top: `${mote.y}%`, width: mote.size, height: mote.size, y, opacity }}
    />
  );
}
