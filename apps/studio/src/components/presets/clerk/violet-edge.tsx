import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export default function VioletEdge() {
  const x = useLoop(["-100%", "-100%", "300%"], { ease: easeInOut });

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}
