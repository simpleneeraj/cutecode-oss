import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./gemini.module.css";

export type Mote = {
  id: string;
  x: number;
  size: number;
  phase: number;
};

type DriftingMoteProps = {
  mote: Mote;
};

export default function DriftingMote({ mote }: DriftingMoteProps) {
  const y = useLoop([0, -320], { phase: mote.phase });
  const x = useLoop([0, 14, -10, 0], { phase: mote.phase });
  const opacity = useLoop([0, 0.8, 0.4, 0], { phase: mote.phase });

  return (
    <motion.span
      className={styles.mote}
      style={{ left: `${mote.x}%`, width: mote.size, height: mote.size, x, y, opacity }}
    />
  );
}
