import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import SignInStack from "./sign-in-stack";
import UserPill from "./user-pill";
import styles from "./clerk.module.css";

export default function ClerkScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.75, 1, 0.75], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <SignInStack />
      <UserPill />
    </div>
  );
}
