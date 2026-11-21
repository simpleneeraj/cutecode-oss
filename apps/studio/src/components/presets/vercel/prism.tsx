import { useId } from "react";
import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./vercel.module.css";

export default function Prism() {
  const glowId = useId();
  const glowOpacity = useLoop([0.6, 1, 0.6], { ease: easeInOut });

  return (
    <g>
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" className={styles.stopGlow} />
          <stop offset="1" className={styles.stopGlow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle cx="1040" cy="300" r="360" fill={`url(#${glowId})`} style={{ opacity: glowOpacity }} />
      <polygon className={styles.faceFront} points="1040,140 860,470 1090,490" />
      <polygon className={styles.faceSide} points="1040,140 1090,490 1240,470" />
      <polyline className={styles.prismEdge} points="860,470 1040,140 1240,470" />
      <line className={styles.prismRidge} x1="1040" y1="140" x2="1090" y2="490" />
    </g>
  );
}
