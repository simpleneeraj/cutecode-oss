import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import PaymentCard from "./payment-card";
import styles from "./dodo-payments.module.css";

export default function DodoScene() {
  const limeX = useLoop(["0%", "12%", "0%", "-10%", "0%"], { ease: easeInOut });
  const limeY = useLoop(["0%", "-6%", "4%", "-2%", "0%"], { ease: easeInOut });
  const greenX = useLoop(["0%", "-10%", "0%", "8%", "0%"], { ease: easeInOut });
  const greenScale = useLoop([1, 1.12, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.auroraLime} style={{ x: limeX, y: limeY }} />
      <motion.div className={styles.auroraGreen} style={{ x: greenX, scale: greenScale }} />
      <PaymentCard />
      <div className={styles.grain} />
    </div>
  );
}
