import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./dodo-payments.module.css";

export default function EdgeSweep() {
  const x = useLoop(["-100%", "300%", "300%"], { ease: easeInOut });

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}
