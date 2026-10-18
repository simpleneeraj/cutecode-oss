import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import type { CursorPath } from "./cursor-trail";
import styles from "./browserbase.module.css";

type TrailDotProps = {
  path: CursorPath;
  phase: number;
  opacity: number;
};

export default function TrailDot({ path, phase, opacity }: TrailDotProps) {
  const x = useLoop(path.x, { phase, ease: easeInOut });
  const y = useLoop(path.y, { phase, ease: easeInOut });

  return <motion.span className={styles.trailDot} style={{ x, y, opacity }} />;
}
