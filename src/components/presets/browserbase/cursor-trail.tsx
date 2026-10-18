import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import TrailDot from "./trail-dot";
import styles from "./browserbase.module.css";

export type CursorPath = {
  id: string;
  left: number;
  top: number;
  x: number[];
  y: number[];
  phase: number;
};

type CursorTrailProps = {
  cursor: CursorPath;
};

const TRAIL = [
  { id: "trail-1", lag: 0.012, opacity: 0.7 },
  { id: "trail-2", lag: 0.024, opacity: 0.5 },
  { id: "trail-3", lag: 0.036, opacity: 0.32 },
  { id: "trail-4", lag: 0.048, opacity: 0.18 },
];

export default function CursorTrail({ cursor }: CursorTrailProps) {
  const x = useLoop(cursor.x, { phase: cursor.phase, ease: easeInOut });
  const y = useLoop(cursor.y, { phase: cursor.phase, ease: easeInOut });

  return (
    <div className={styles.cursorAnchor} style={{ left: `${cursor.left}%`, top: `${cursor.top}%` }}>
      {TRAIL.map((dot) => (
        <TrailDot key={dot.id} path={cursor} phase={cursor.phase - dot.lag} opacity={dot.opacity} />
      ))}
      <motion.span className={styles.cursor} style={{ x, y }} />
    </div>
  );
}
