import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./triggerdev.module.css";

export default function LiveEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);
  const scale = useLoop([1, 1, 2.6, 1], { cycles: 3 });
  const opacity = useLoop([0, 0.7, 0, 0], { cycles: 3 });

  return (
    <div aria-hidden>
      <div className={styles.topEdge}>
        <motion.div className={styles.sweep} style={{ x }} />
      </div>
      <span className={styles.live}>
        <motion.span className={styles.liveRing} style={{ scale, opacity }} />
      </span>
    </div>
  );
}
