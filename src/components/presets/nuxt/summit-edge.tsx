import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./nuxt.module.css";

export default function SummitEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}
