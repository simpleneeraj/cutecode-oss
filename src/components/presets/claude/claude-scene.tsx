import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import DriftingGlyph, { type Glyph } from "./drifting-glyph";
import RisingMote, { type Mote } from "./rising-mote";
import styles from "./claude.module.css";

const GLYPHS: Glyph[] = [
  { id: "quote-open", character: "“", x: 6, y: 8, size: 44, tilt: -6 },
  { id: "pilcrow", character: "¶", x: 90, y: 10, size: 24, tilt: 4 },
  { id: "ampersand", character: "&", x: 88, y: 80, size: 30, tilt: -8 },
  { id: "section", character: "§", x: 4, y: 50, size: 20, tilt: 6 },
  { id: "quote-close", character: "”", x: 14, y: 84, size: 36, tilt: 8 },
  { id: "letter", character: "a", x: 54, y: 90, size: 22, tilt: -4 },
];

const MOTES: Mote[] = Array.from({ length: 14 }, (_, index) => ({
  id: `mote-${index}`,
  left: `${(index * 37 + 7) % 100}%`,
  size: 2 + (index % 3),
  phase: ((index * 5) % 14) / 14,
}));

export default function ClaudeScene() {
  const raysRotate = useLoop([0, 15]);
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.85, 1, 0.85], { ease: easeInOut });
  const driftX = useLoop([0, 20, 0], { ease: easeInOut });
  const driftY = useLoop([0, -14, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.ruled} />
      <motion.div className={styles.rays} style={{ rotate: raysRotate }} />
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <motion.div className={styles.blobClay} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobIvory} style={{ x: driftY, y: driftX }} />
      <div className={styles.grain} />
      {MOTES.map((mote) => (
        <RisingMote key={mote.id} mote={mote} />
      ))}
      {GLYPHS.map((glyph, index) => (
        <DriftingGlyph key={glyph.id} glyph={glyph} phase={index / GLYPHS.length} />
      ))}
    </div>
  );
}
