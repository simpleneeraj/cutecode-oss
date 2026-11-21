import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import DocSheet, { type Sheet } from "./doc-sheet";
import DewDrop, { type Drop } from "./dew-drop";
import ReadingProgress from "./reading-progress";
import styles from "./mintlify.module.css";

const SHEETS: Sheet[] = [
  { id: "top-left", x: -4, y: -10, tilt: -6, phase: 0 },
  { id: "bottom-right", x: 82, y: 68, tilt: 5, phase: 0.5 },
];

const DROPS: Drop[] = Array.from({ length: 10 }, (_, index) => ({
  id: `drop-${index}`,
  x: (index * 37 + 11) % 100,
  y: (index * 53 + 7) % 100,
  size: 4 + (index % 3) * 2,
  phase: ((index * 3) % 10) / 10,
}));

export default function MintlifyScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const driftX = useLoop([0, 22, 0], { ease: easeInOut });
  const driftY = useLoop([0, -14, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <motion.div className={styles.blobMint} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobSage} style={{ x: driftY, y: driftX }} />
      <div className={styles.lines} />
      {SHEETS.map((sheet) => (
        <DocSheet key={sheet.id} sheet={sheet} />
      ))}
      <ReadingProgress />
      {DROPS.map((drop) => (
        <DewDrop key={drop.id} drop={drop} />
      ))}
    </div>
  );
}
