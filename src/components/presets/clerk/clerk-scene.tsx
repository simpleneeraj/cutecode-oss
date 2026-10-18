import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import LayeredCard, { type Card } from "./layered-card";
import OrbitRing, { type Orbit } from "./orbit-ring";
import TrustChip, { type Chip } from "./trust-chip";
import styles from "./clerk.module.css";

const ORBITS: Orbit[] = [
  { id: "inner", size: 360, isReversed: false },
  { id: "outer", size: 560, isReversed: true },
];

const CARDS: Card[] = [
  { id: "left-back", x: 1, y: 62, tilt: -12, phase: 0 },
  { id: "left-middle", x: 3, y: 67, tilt: -7, phase: 0.08 },
  { id: "left-front", x: 5, y: 72, tilt: -2, phase: 0.16 },
  { id: "right-back", x: 82, y: 3, tilt: 12, phase: 0.5 },
  { id: "right-middle", x: 80, y: 8, tilt: 7, phase: 0.58 },
  { id: "right-front", x: 78, y: 13, tilt: 2, phase: 0.66 },
];

const CHIPS: Chip[] = [
  { id: "lock", icon: "solar:lock-password-bold-duotone", x: 8, y: 14, phase: 0 },
  { id: "shield", icon: "solar:shield-keyhole-minimalistic-bold-duotone", x: 90, y: 58, phase: 0.25 },
  { id: "verified", icon: "solar:verified-check-bold-duotone", x: 62, y: 88, phase: 0.5 },
  { id: "users", icon: "solar:users-group-rounded-bold-duotone", x: 30, y: 6, phase: 0.75 },
];

export default function ClerkScene() {
  const haloScale = useLoop([1, 1.08, 1], { ease: easeInOut });
  const haloOpacity = useLoop([0.8, 1, 0.8], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.halo} style={{ scale: haloScale, opacity: haloOpacity }} />
      <div className={styles.pattern} />
      {ORBITS.map((orbit) => (
        <OrbitRing key={orbit.id} orbit={orbit} />
      ))}
      {CARDS.map((card) => (
        <LayeredCard key={card.id} card={card} />
      ))}
      {CHIPS.map((chip) => (
        <TrustChip key={chip.id} chip={chip} />
      ))}
    </div>
  );
}
