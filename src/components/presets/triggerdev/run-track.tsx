import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { useLoop } from "../scene";
import styles from "./triggerdev.module.css";

export type Run = {
  id: string;
  x: number;
  y: number;
  width: number;
  isQueued: boolean;
  phase: number;
};

type RunTrackProps = {
  run: Run;
};

export default function RunTrack({ run }: RunTrackProps) {
  const x = useLoop(["-100%", "-100%", "0%", "0%", "-100%"], { phase: run.phase, ease: easeInOut });
  const opacity = useLoop([0, 1, 1, 0, 0], { phase: run.phase, ease: easeInOut });
  const scale = useLoop([1, 1.6, 1, 1, 1], { phase: run.phase, ease: easeInOut });

  return (
    <div
      className={cn(styles.run, run.isQueued && styles.queued)}
      style={{ left: `${run.x}%`, top: `${run.y}%`, width: `${run.width}%` }}
    >
      <motion.span className={styles.status} style={{ scale }} />
      <div className={styles.track}>
        <motion.span className={styles.bar} style={{ x, opacity }} />
      </div>
    </div>
  );
}
