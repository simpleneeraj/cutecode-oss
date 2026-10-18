import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

const PULSE_LENGTH = 96;

export type Streak = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  phase: number;
};

type EnergyLineProps = {
  streak: Streak;
};

export default function EnergyLine({ streak }: EnergyLineProps) {
  const { x1, y1, x2, y2, phase } = streak;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const pulseOffset = useLoop([PULSE_LENGTH, -length], { phase });

  return (
    <g>
      <line className={styles.streak} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />
      <motion.line
        className={styles.streakPulse}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${PULSE_LENGTH} ${length * 2}`}
        style={{ strokeDashoffset: pulseOffset }}
      />
    </g>
  );
}
