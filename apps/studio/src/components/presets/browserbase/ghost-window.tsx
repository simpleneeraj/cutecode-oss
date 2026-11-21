import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./browserbase.module.css";

export type WindowStack = {
  id: string;
  x: number;
  y: number;
  tilt: number;
};

type GhostWindowProps = {
  stack: WindowStack;
  phase: number;
};

export default function GhostWindow({ stack, phase }: GhostWindowProps) {
  const y = useLoop([0, -8, 0], { phase, ease: easeInOut });
  const rotate = useLoop([stack.tilt, stack.tilt + 1.5, stack.tilt], { phase, ease: easeInOut });

  return (
    <motion.div className={styles.ghost} style={{ left: `${stack.x}%`, top: `${stack.y}%`, y, rotate }}>
      <span className={styles.ghostBar} />
    </motion.div>
  );
}
