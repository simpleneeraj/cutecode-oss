import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./prisma.module.css";

export type Beam = {
  id: string;
  angle: number;
  color: string;
  phase: number;
};

type RefractedBeamProps = {
  beam: Beam;
};

export default function RefractedBeam({ beam }: RefractedBeamProps) {
  const opacity = useLoop([0.35, 0.85, 0.35], { phase: beam.phase, ease: easeInOut });
  const pulseX = useLoop(["-100%", "300%", "700%", "700%", "-100%"], { phase: beam.phase });
  const pulseOpacity = useLoop([0, 1, 0, 0, 0], { phase: beam.phase });

  return (
    <motion.div className={styles.beam} style={{ rotate: beam.angle, opacity, color: beam.color }}>
      <motion.span className={styles.pulse} style={{ x: pulseX, opacity: pulseOpacity }} />
    </motion.div>
  );
}
