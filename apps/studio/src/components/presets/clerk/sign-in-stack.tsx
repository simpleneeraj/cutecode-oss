import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export default function SignInStack() {
  const y = useLoop([0, -10, 0], { ease: easeInOut });
  const ghostY = useLoop([0, 4, 0], { ease: easeInOut });
  const typed = useLoop([0, 0, 1, 1, 0], { ease: easeInOut });
  const shine = useLoop(["-120%", "-120%", "-120%", "240%", "240%"], { ease: easeInOut });

  return (
    <motion.div className={styles.stack} style={{ y }}>
      <motion.span className={styles.ghost} style={{ y: ghostY }} />
      <div className={styles.tray}>
        <div className={styles.signIn}>
          <span className={styles.appLogo} />
          <span className={styles.title} />
          <span className={styles.subtitle} />
          <div className={styles.socials}>
            <span />
            <span />
            <span />
          </div>
          <span className={styles.divider} />
          <span className={styles.field}>
            <motion.span className={styles.typed} style={{ scaleX: typed }} />
          </span>
          <span className={styles.submit}>
            <motion.span className={styles.shine} style={{ x: shine }} />
          </span>
        </div>
        <span className={styles.secured} />
      </div>
    </motion.div>
  );
}
