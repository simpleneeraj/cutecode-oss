import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./resend.module.css";

export type Envelope = {
  id: string;
  x: number;
  y: number;
  width: number;
  tilt: number;
};

type FloatingEnvelopeProps = {
  envelope: Envelope;
  phase: number;
};

export default function FloatingEnvelope({ envelope, phase }: FloatingEnvelopeProps) {
  const y = useLoop([0, -8, 0], { phase, ease: easeInOut });
  const rotate = useLoop([envelope.tilt, envelope.tilt + 3, envelope.tilt], { phase, ease: easeInOut });

  return (
    <motion.div
      className={styles.envelope}
      style={{ left: `${envelope.x}%`, top: `${envelope.y}%`, width: envelope.width, y, rotate }}
    />
  );
}
