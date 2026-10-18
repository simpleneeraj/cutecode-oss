import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import Crosshair, { type Marker } from "./crosshair";
import RippleRing from "./ripple-ring";
import styles from "./vercel.module.css";

const MARKERS: Marker[] = [
  { id: "far-left-top", column: -7, row: -3, phase: 0 },
  { id: "left-top", column: -4, row: -4, phase: 0.1 },
  { id: "right-top", column: 5, row: -4, phase: 0.2 },
  { id: "far-right-top", column: 8, row: -2, phase: 0.3 },
  { id: "far-right-bottom", column: 8, row: 3, phase: 0.4 },
  { id: "right-bottom", column: 4, row: 5, phase: 0.5 },
  { id: "left-bottom", column: -3, row: 5, phase: 0.6 },
  { id: "far-left-bottom", column: -7, row: 3, phase: 0.7 },
  { id: "far-left-middle", column: -8, row: 0, phase: 0.8 },
  { id: "far-right-middle", column: 9, row: 1, phase: 0.9 },
];

const RIPPLES = [
  { id: "ripple-first", phase: 0 },
  { id: "ripple-second", phase: 1 / 3 },
  { id: "ripple-third", phase: 2 / 3 },
];

export default function VercelScene() {
  const beamRotate = useLoop([-7, 7, -7], { ease: easeInOut });
  const counterBeamRotate = useLoop([5, -5, 5], { ease: easeInOut });
  const haloScale = useLoop([1, 1.08, 1], { ease: easeInOut });
  const haloOpacity = useLoop([0.7, 1, 0.7], { ease: easeInOut });
  const scanY = useLoop(["0%", "200%"]);

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <motion.div className={styles.beam} style={{ rotate: beamRotate }} />
      <motion.div className={styles.beamNarrow} style={{ rotate: counterBeamRotate }} />
      <motion.div className={styles.halo} style={{ scale: haloScale, opacity: haloOpacity }} />
      {RIPPLES.map((ripple) => (
        <RippleRing key={ripple.id} phase={ripple.phase} />
      ))}
      <motion.div className={styles.scan} style={{ y: scanY }} />
      {MARKERS.map((marker) => (
        <Crosshair key={marker.id} marker={marker} />
      ))}
    </div>
  );
}
