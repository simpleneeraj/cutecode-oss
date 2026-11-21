import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import Glint, { type Sparkle } from "./glint";
import DriftingMote, { type Mote } from "./drifting-mote";
import styles from "./gemini.module.css";

const SPARKLES: Sparkle[] = Array.from({ length: 14 }, (_, index) => ({
  id: `sparkle-${index}`,
  x: (index * 41 + 6) % 96,
  y: (index * 29 + 5) % 92,
  size: 10 + ((index * 7) % 4) * 4,
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 14) / 14,
}));

const MOTES: Mote[] = Array.from({ length: 10 }, (_, index) => ({
  id: `mote-${index}`,
  x: (index * 37 + 11) % 100,
  size: 2 + (index % 3),
  phase: ((index * 3) % 10) / 10,
}));

export default function GeminiScene() {
  const haloRotate = useLoop([0, 360]);
  const blueX = useLoop([0, 40, 0], { ease: easeInOut });
  const blueY = useLoop([0, 24, 0], { ease: easeInOut, phase: 0.25 });
  const violetX = useLoop([0, -36, 0], { ease: easeInOut, phase: 0.5 });
  const roseScale = useLoop([1, 1.15, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.orbBlue} style={{ x: blueX, y: blueY }} />
      <motion.div className={styles.orbViolet} style={{ x: violetX, y: blueX }} />
      <motion.div className={styles.orbRose} style={{ scale: roseScale }} />
      <motion.div className={styles.halo} style={{ rotate: haloRotate }} />
      {MOTES.map((mote) => (
        <DriftingMote key={mote.id} mote={mote} />
      ))}
      {SPARKLES.map((sparkle) => (
        <Glint key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
}
