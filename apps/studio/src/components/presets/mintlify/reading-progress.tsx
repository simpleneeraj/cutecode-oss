import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./mintlify.module.css";

export default function ReadingProgress() {
  const scaleX = useLoop([0, 0, 1, 1, 0], { ease: easeInOut });
  const opacity = useLoop([0, 1, 1, 0, 0], { ease: easeInOut });

  return (
    <div className={styles.progress}>
      <motion.span className={styles.progressFill} style={{ scaleX, opacity }} />
    </div>
  );
}
