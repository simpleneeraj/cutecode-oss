import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import GhostWindow, { type WindowStack } from "./ghost-window";
import CursorTrail, { type CursorPath } from "./cursor-trail";
import styles from "./browserbase.module.css";

const STACKS: WindowStack[] = [
  { id: "top-left", x: -4, y: -6, tilt: -4 },
  { id: "top-right", x: 78, y: -10, tilt: 3 },
  { id: "bottom-left", x: 2, y: 74, tilt: 3 },
  { id: "bottom-right", x: 74, y: 78, tilt: -3 },
];

const CURSORS: CursorPath[] = [
  { id: "cursor-a", left: 10, top: 62, x: [0, 70, 150, 90, 0], y: [0, -60, -20, 30, 0], phase: 0.1 },
  { id: "cursor-b", left: 82, top: 18, x: [0, -80, -30, 40, 0], y: [0, 40, 100, 50, 0], phase: 0.4 },
  { id: "cursor-c", left: 56, top: 88, x: [0, 90, 30, -60, 0], y: [0, -24, -50, -12, 0], phase: 0.7 },
];

export default function BrowserbaseScene() {
  const glowScale = useLoop([1, 1.1, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.75, 1, 0.75], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      {STACKS.map((stack, index) => (
        <GhostWindow key={stack.id} stack={stack} phase={index / STACKS.length} />
      ))}
      {CURSORS.map((cursor) => (
        <CursorTrail key={cursor.id} cursor={cursor} />
      ))}
    </div>
  );
}
