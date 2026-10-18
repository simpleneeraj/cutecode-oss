import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import RunTrack, { type Run } from "./run-track";
import styles from "./triggerdev.module.css";

const RUN_LAYOUT = [
  { x: 5, y: 5, width: 38 },
  { x: 11, y: 9, width: 30 },
  { x: 19, y: 13, width: 42 },
  { x: 29, y: 17, width: 26 },
  { x: 56, y: 80, width: 36 },
  { x: 49, y: 84, width: 40 },
  { x: 61, y: 88, width: 30 },
  { x: 44, y: 92, width: 44 },
];

const RUNS: Run[] = RUN_LAYOUT.map((layout, index) => ({
  id: `run-${layout.x}-${layout.y}`,
  ...layout,
  isQueued: index % 3 === 2,
  phase: 1 - (index % 4) * 0.08 - Math.floor(index / 4) * 0.5,
}));

export default function TriggerScene() {
  const playheadX = useLoop(["0%", "100%"]);
  const playheadOpacity = useLoop([0, 1, 1, 0]);
  const glowOpacity = useLoop([0.7, 1, 0.7], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ opacity: glowOpacity }} />
      <div className={styles.grid} />
      <motion.div className={styles.playhead} style={{ x: playheadX, opacity: playheadOpacity }} />
      {RUNS.map((run) => (
        <RunTrack key={run.id} run={run} />
      ))}
    </div>
  );
}
