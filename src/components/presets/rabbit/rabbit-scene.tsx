import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import FloatingKey, { type Keycap } from "./floating-key";
import SignalDot from "./signal-dot";
import styles from "./rabbit.module.css";

const KEYS: Keycap[] = [
  { id: "key-top-left", x: 5, y: 10, size: 26, tilt: -12, isFilled: true, phase: 0 },
  { id: "key-left", x: 3, y: 48, size: 16, tilt: 10, isFilled: false, phase: 0.2 },
  { id: "key-bottom-left", x: 14, y: 86, size: 20, tilt: 6, isFilled: false, phase: 0.4 },
  { id: "key-top", x: 42, y: 4, size: 14, tilt: 18, isFilled: false, phase: 0.6 },
  { id: "key-right", x: 94, y: 46, size: 18, tilt: -8, isFilled: true, phase: 0.8 },
  { id: "key-bottom", x: 58, y: 92, size: 12, tilt: -16, isFilled: true, phase: 0.5 },
];

const SIGNALS = [
  { id: "signal-first", phase: 0 },
  { id: "signal-second", phase: 0.08 },
  { id: "signal-third", phase: 0.16 },
  { id: "signal-fourth", phase: 0.24 },
  { id: "signal-fifth", phase: 0.32 },
];

export default function RabbitScene() {
  const dialRotate = useLoop([0, 36, 36, 0, 0], { ease: easeInOut });
  const irisRotate = useLoop([0, 360]);
  const pupilScale = useLoop([1, 0.72, 1, 1], { ease: easeInOut });
  const glowScale = useLoop([1, 1.1, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.75, 1, 0.75], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.dotMatrix} />
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <motion.div className={styles.dial} style={{ rotate: dialRotate }} />
      <div className={styles.dialCap} />
      <div className={styles.eye}>
        <motion.span className={styles.iris} style={{ rotate: irisRotate }} />
        <motion.span className={styles.pupil} style={{ scale: pupilScale }} />
      </div>
      <div className={styles.signals}>
        {SIGNALS.map((signal) => (
          <SignalDot key={signal.id} phase={signal.phase} />
        ))}
      </div>
      {KEYS.map((keycap) => (
        <FloatingKey key={keycap.id} keycap={keycap} />
      ))}
    </div>
  );
}
