import { useId } from "react";
import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import BoltPulse from "./bolt-pulse";
import styles from "./supabase.module.css";

const VERTICES = [
  [1180, -20],
  [560, 560],
  [860, 560],
  [420, 1040],
  [1040, 420],
  [740, 420],
];

const POINTS = VERTICES.map(([x, y]) => `${x},${y}`).join(" ");

const PERIMETER = VERTICES.reduce((total, [x, y], index) => {
  const [nextX, nextY] = VERTICES[(index + 1) % VERTICES.length];
  return total + Math.hypot(nextX - x, nextY - y);
}, 0);

const ECHO_TRANSFORM = "translate(800 510) scale(1.22) translate(-800 -510)";

const PULSES = [
  { id: "pulse-lead", phase: 0 },
  { id: "pulse-trail", phase: 0.5 },
];

export default function Bolt() {
  const glowId = useId();
  const fillId = useId();
  const glowOpacity = useLoop([0.55, 1, 0.55], { ease: easeInOut });

  return (
    <g>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" className={styles.stopGlow} />
          <stop offset="1" className={styles.stopGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={fillId} gradientUnits="userSpaceOnUse" x1="1180" y1="-20" x2="420" y2="1040">
          <stop offset="0" className={styles.stopFill} />
          <stop offset="1" className={styles.stopFill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.circle cx="800" cy="500" r="560" fill={`url(#${glowId})`} style={{ opacity: glowOpacity }} />
      <polygon className={styles.boltEcho} points={POINTS} transform={ECHO_TRANSFORM} vectorEffect="non-scaling-stroke" />
      <polygon className={styles.boltCore} points={POINTS} fill={`url(#${fillId})`} />
      {PULSES.map((pulse) => (
        <BoltPulse key={pulse.id} points={POINTS} perimeter={PERIMETER} phase={pulse.phase} />
      ))}
    </g>
  );
}
