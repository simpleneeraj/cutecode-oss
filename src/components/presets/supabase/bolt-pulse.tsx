import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

const PULSE_LENGTH = 220;

type BoltPulseProps = {
  points: string;
  perimeter: number;
  phase: number;
};

export default function BoltPulse({ points, perimeter, phase }: BoltPulseProps) {
  const pulseOffset = useLoop([PULSE_LENGTH, -perimeter], { phase });

  return (
    <motion.polygon
      className={styles.boltPulse}
      points={points}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={`${PULSE_LENGTH} ${perimeter * 2}`}
      style={{ strokeDashoffset: pulseOffset }}
    />
  );
}
