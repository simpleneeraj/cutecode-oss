import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./claude.module.css";

export type Mote = {
  id: string;
  left: string;
  size: number;
  phase: number;
};

type RisingMoteProps = {
  mote: Mote;
};

export default function RisingMote({ mote }: RisingMoteProps) {
  const y = useLoop([0, -300], { phase: mote.phase });
  const opacity = useLoop([0, 0.7, 0.35, 0], { phase: mote.phase });

  return (
    <motion.span className={styles.mote} style={{ left: mote.left, width: mote.size, height: mote.size, y, opacity }} />
  );
}
