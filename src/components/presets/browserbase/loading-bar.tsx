import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./browserbase.module.css";

export default function LoadingBar() {
  const scaleX = useLoop([0, 0.6, 1, 1, 0, 0], { ease: easeInOut });
  const opacity = useLoop([1, 1, 1, 0, 0, 1]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.progress} style={{ scaleX, opacity }} />
    </div>
  );
}
