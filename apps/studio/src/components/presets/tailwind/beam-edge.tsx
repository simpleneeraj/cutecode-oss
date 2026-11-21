import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./tailwind.module.css";

export default function BeamEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}
