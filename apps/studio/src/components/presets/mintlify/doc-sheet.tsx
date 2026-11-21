import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./mintlify.module.css";

export type Sheet = {
  id: string;
  x: number;
  y: number;
  tilt: number;
  phase: number;
};

type DocSheetProps = {
  sheet: Sheet;
};

export default function DocSheet({ sheet }: DocSheetProps) {
  const y = useLoop([0, -6, 0], { phase: sheet.phase, ease: easeInOut });
  const rotate = useLoop([sheet.tilt, sheet.tilt + 1.5, sheet.tilt], { phase: sheet.phase, ease: easeInOut });

  return (
    <motion.div className={styles.sheet} style={{ left: `${sheet.x}%`, top: `${sheet.y}%`, y, rotate }}>
      <span className={styles.heading} />
      <span className={styles.text} />
      <span className={styles.text} />
      <span className={styles.textShort} />
      <span className={styles.callout} />
      <span className={styles.text} />
      <span className={styles.textShort} />
    </motion.div>
  );
}
