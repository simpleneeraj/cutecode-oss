import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./prisma.module.css";

export default function SpectrumEdge() {
  const x = useLoop(["-100%", "300%", "300%", "-100%", "-100%"]);
  const opacity = useLoop([1, 1, 0, 0, 1]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x, opacity }} />
    </div>
  );
}
