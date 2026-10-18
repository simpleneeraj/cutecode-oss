import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import FlowingRibbon, { type Ribbon } from "./flowing-ribbon";
import styles from "./stripe.module.css";

const RIBBONS: Ribbon[] = [
  { id: "cyan", tone: "toneCyan", top: 0, height: 26, sway: -10, isReversed: false, phase: 0 },
  { id: "blush", tone: "toneBlush", top: 18, height: 22, sway: 8, isReversed: true, phase: 0.2 },
  { id: "violet", tone: "toneViolet", top: 34, height: 26, sway: -12, isReversed: false, phase: 0.45 },
  { id: "ember", tone: "toneEmber", top: 52, height: 20, sway: 10, isReversed: true, phase: 0.65 },
  { id: "sky", tone: "toneSky", top: 66, height: 24, sway: -8, isReversed: false, phase: 0.85 },
];

export default function StripeScene() {
  const sheenX = useLoop(["-100%", "500%", "500%"], { ease: easeInOut });
  const glowScale = useLoop([1, 1.1, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.columns} />
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <div className={styles.band}>
        {RIBBONS.map((ribbon) => (
          <FlowingRibbon key={ribbon.id} ribbon={ribbon} />
        ))}
        <motion.div className={styles.sheen} style={{ x: sheenX }} />
      </div>
    </div>
  );
}
