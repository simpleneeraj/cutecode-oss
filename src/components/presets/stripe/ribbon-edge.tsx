import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./stripe.module.css";

export default function RibbonEdge() {
  const x = useLoop(["0%", "-50%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}
