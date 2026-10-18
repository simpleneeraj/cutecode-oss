import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./openai.module.css";

const ORB_SHAPES = [
  "50% 50% 50% 50% / 50% 50% 50% 50%",
  "58% 42% 46% 54% / 44% 56% 48% 52%",
  "46% 54% 58% 42% / 54% 44% 56% 46%",
  "50% 50% 50% 50% / 50% 50% 50% 50%",
];

export default function VoiceOrb() {
  const borderRadius = useLoop(ORB_SHAPES, { ease: easeInOut });
  const scale = useLoop([1, 1.05, 0.98, 1], { ease: easeInOut });
  const haloScale = useLoop([0.94, 1.06, 0.94], { ease: easeInOut });
  const haloOpacity = useLoop([0.6, 1, 0.6], { ease: easeInOut });
  const rotate = useLoop([0, 360]);
  const counterRotate = useLoop([0, -360]);

  return (
    <div className={styles.orbAnchor}>
      <motion.div className={styles.halo} style={{ scale: haloScale, opacity: haloOpacity }} />
      <motion.div className={styles.orb} style={{ borderRadius, scale }}>
        <motion.div className={styles.orbColor} style={{ rotate }} />
        <motion.div className={styles.orbSwirl} style={{ rotate: counterRotate }} />
        <div className={styles.orbSheen} />
      </motion.div>
    </div>
  );
}
