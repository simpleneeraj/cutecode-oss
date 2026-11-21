import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import TwinkleStar, { type Star } from "./twinkle-star";
import RisingChevron, { type Chevron } from "./rising-chevron";
import styles from "./nuxt.module.css";

const STARS: Star[] = Array.from({ length: 12 }, (_, index) => ({
  id: `star-${index}`,
  x: (index * 37 + 5) % 100,
  y: (index * 23 + 4) % 50,
  size: 2 + (index % 2),
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 12) / 12,
}));

const CHEVRONS: Chevron[] = Array.from({ length: 9 }, (_, index) => ({
  id: `chevron-${index}`,
  x: (index * 29 + 8) % 100,
  size: 7 + (index % 3) * 3,
  phase: ((index * 4) % 9) / 9,
}));

export default function NuxtScene() {
  const backDrift = useLoop([0, -18, 0], { ease: easeInOut });
  const frontDrift = useLoop([0, 24, 0], { ease: easeInOut });
  const glowScale = useLoop([1, 1.12, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.7, 1, 0.7], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      {STARS.map((star) => (
        <TwinkleStar key={star.id} star={star} />
      ))}
      <motion.div className={styles.summitGlow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <motion.div className={styles.ridgeBack} style={{ x: backDrift }} />
      <motion.div className={styles.ridgeFront} style={{ x: frontDrift }} />
      {CHEVRONS.map((chevron) => (
        <RisingChevron key={chevron.id} chevron={chevron} />
      ))}
    </div>
  );
}
