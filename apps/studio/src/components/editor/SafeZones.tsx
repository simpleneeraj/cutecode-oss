import { motion } from "motion/react";
import styles from "@/styles/editor/Frame.module.css";

export default function SafeZones() {
  return (
    <motion.div
      data-ignore-in-export
      aria-hidden="true"
      className={styles.safeZones}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.safeZoneTop} />
      <div className={styles.safeZoneBottom} />
    </motion.div>
  );
}
