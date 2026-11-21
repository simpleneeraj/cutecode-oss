import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export default function UserPill() {
  const y = useLoop([0, -8, 0], { phase: 0.5, ease: easeInOut });
  const pulse = useLoop([1, 1.6, 1], { cycles: 2, ease: easeInOut });
  const pulseOpacity = useLoop([0.6, 0, 0.6], { cycles: 2, ease: easeInOut });

  return (
    <motion.div className={styles.pill} style={{ y }}>
      <span className={styles.avatar}>
        <motion.span className={styles.presence} style={{ scale: pulse, opacity: pulseOpacity }} />
      </span>
      <span className={styles.pillLines}>
        <span />
        <span />
      </span>
      <span className={styles.chevron} />
    </motion.div>
  );
}
