import { motion } from "motion/react";
import { useLoop } from "../scene";
import WaveBar, { type Bar } from "./wave-bar";
import styles from "./eleven-labs.module.css";

const BARS: Bar[] = Array.from({ length: 36 }, (_, index) => {
  const envelope = Math.abs(Math.sin(index * 0.42) * Math.cos(index * 0.17));
  return {
    id: `bar-${index}`,
    low: 0.06 + (index % 4) * 0.02,
    peak: 0.25 + envelope * 0.75,
    cycles: index % 3 === 0 ? 2 : 1,
    phase: ((index * 7) % 36) / 36,
  };
});

export default function WaveformScene() {
  const playheadX = useLoop(["0%", "50%", "100%", "100%", "0%"]);
  const playheadOpacity = useLoop([0, 1, 1, 1, 0, 0, 0, 0, 0]);

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.rings} />
      <div className={styles.baseline} />
      <div className={styles.waveform}>
        {BARS.map((bar) => (
          <WaveBar key={bar.id} bar={bar} />
        ))}
      </div>
      <motion.div className={styles.playhead} style={{ x: playheadX, opacity: playheadOpacity }} />
    </div>
  );
}
