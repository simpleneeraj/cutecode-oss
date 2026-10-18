import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import Dune, { type DuneLayer } from "./dune";
import Sparkle, { type Star } from "./sparkle";
import styles from "./claude.module.css";

const DUNES: DuneLayer[] = [
  { id: "far", className: styles.duneFar, base: 30, amplitude: 10, phase: 0 },
  { id: "mid", className: styles.duneMid, base: 40, amplitude: 12, phase: 0.33 },
  { id: "near", className: styles.duneNear, base: 50, amplitude: 14, phase: 0.66 },
];

const STARS: Star[] = [
  { id: "top-right", x: 88, y: 12, size: 16 },
  { id: "top-left", x: 8, y: 18, size: 10 },
  { id: "mid-right", x: 92, y: 58, size: 12 },
  { id: "low-right", x: 82, y: 86, size: 18 },
  { id: "low-left", x: 10, y: 78, size: 12 },
  { id: "low-center", x: 46, y: 92, size: 8 },
];

export default function ClaudeScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.85, 1, 0.85], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <div className={styles.dunes}>
        {DUNES.map((layer) => (
          <Dune key={layer.id} layer={layer} />
        ))}
      </div>
      <div className={styles.grain} />
      {STARS.map((star, index) => (
        <Sparkle key={star.id} star={star} phase={index / STARS.length} />
      ))}
    </div>
  );
}
