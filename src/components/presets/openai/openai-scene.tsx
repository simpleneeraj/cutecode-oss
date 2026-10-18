import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import BreathingRing, { type Ring } from "./breathing-ring";
import FloatingMote, { type Mote } from "./floating-mote";
import styles from "./openai.module.css";

const RINGS: Ring[] = [
  { id: "ring-inner", size: 360, phase: 0 },
  { id: "ring-middle", size: 560, phase: 0.12 },
  { id: "ring-outer", size: 780, phase: 0.24 },
  { id: "ring-edge", size: 1020, phase: 0.36 },
];

const MOTES: Mote[] = Array.from({ length: 12 }, (_, index) => ({
  id: `mote-${index}`,
  x: (index * 43 + 6) % 100,
  y: (index * 29 + 11) % 100,
  size: 2 + (index % 3),
  phase: ((index * 5) % 12) / 12,
}));

export default function OpenAIScene() {
  const bloomScale = useLoop([0.94, 1.05, 0.94], { ease: easeInOut });
  const shimmerRotate = useLoop([0, 360]);
  const driftX = useLoop([0, 28, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.shimmer} style={{ rotate: shimmerRotate }} />
      <motion.div className={styles.bloom} style={{ scale: bloomScale }} />
      <motion.div className={styles.orbCool} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.orbWarm} style={{ x: driftY, y: driftX }} />
      {RINGS.map((ring) => (
        <BreathingRing key={ring.id} ring={ring} />
      ))}
      {MOTES.map((mote) => (
        <FloatingMote key={mote.id} mote={mote} />
      ))}
      <div className={styles.grain} />
    </div>
  );
}
