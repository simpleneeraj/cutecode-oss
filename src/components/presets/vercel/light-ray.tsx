import { useId } from "react";
import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./vercel.module.css";

const RAY_LENGTH = 945;
const PULSE_LENGTH = 160;

export default function LightRay() {
  const gradientId = useId();
  const pulseOffset = useLoop([PULSE_LENGTH, -RAY_LENGTH]);

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="80" y1="-60" x2="959" y2="288">
          <stop offset="0" className={styles.stopRay} stopOpacity="0" />
          <stop offset="1" className={styles.stopRay} />
        </linearGradient>
      </defs>
      <line x1="80" y1="-60" x2="959" y2="288" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <motion.line
        className={styles.rayPulse}
        x1="80"
        y1="-60"
        x2="959"
        y2="288"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${PULSE_LENGTH} ${RAY_LENGTH * 2}`}
        style={{ strokeDashoffset: pulseOffset }}
      />
      <line className={styles.refraction} x1="959" y1="288" x2="1140" y2="305" strokeWidth="1.5" />
    </g>
  );
}
