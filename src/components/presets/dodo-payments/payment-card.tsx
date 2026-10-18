import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./dodo-payments.module.css";

export default function PaymentCard() {
  const y = useLoop([0, -8, 0], { ease: easeInOut });
  const pathLength = useLoop([0, 1, 1, 1, 1], { ease: easeInOut });
  const checkOpacity = useLoop([0, 1, 1, 1, 0]);
  const ringScale = useLoop([0.9, 1, 1, 1, 0.9], { ease: easeInOut });

  return (
    <motion.div className={styles.card} style={{ y }}>
      <motion.svg className={styles.check} viewBox="0 0 24 24" style={{ scale: ringScale }}>
        <motion.path
          d="M7 12.5l3.2 3.2L17 9"
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength, opacity: checkOpacity }}
        />
      </motion.svg>
      <span className={styles.status}>Payment successful</span>
      <span className={styles.amount}>$49.00</span>
      <span className={styles.meta}>Pro plan, billed monthly</span>
    </motion.div>
  );
}
