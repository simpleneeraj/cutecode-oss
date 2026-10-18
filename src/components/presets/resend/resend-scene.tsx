import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import FloatingEnvelope, { type Envelope } from "./floating-envelope";
import SendingEnvelope, { type Lane } from "./sending-envelope";
import styles from "./resend.module.css";

const ENVELOPES: Envelope[] = [
  { id: "top-left", x: 4, y: 6, width: 96, tilt: -8 },
  { id: "top-center", x: 44, y: 3, width: 56, tilt: 4 },
  { id: "top-right", x: 84, y: 10, width: 80, tilt: 10 },
  { id: "mid-left", x: 1, y: 46, width: 52, tilt: 6 },
  { id: "mid-right", x: 90, y: 50, width: 64, tilt: -6 },
  { id: "bottom-left", x: 8, y: 82, width: 72, tilt: 5 },
  { id: "bottom-center", x: 52, y: 88, width: 48, tilt: -4 },
  { id: "bottom-right", x: 80, y: 80, width: 104, tilt: -10 },
];

const LANES: Lane[] = [
  { id: "lane-a", top: 5, rise: "-3%", phase: 0 },
  { id: "lane-b", top: 11, rise: "-5%", phase: 0.33 },
  { id: "lane-c", top: 50, rise: "-8%", phase: 0.16 },
  { id: "lane-d", top: 90, rise: "-4%", phase: 0.5 },
  { id: "lane-e", top: 95, rise: "-2%", phase: 0.66 },
];

export default function ResendScene() {
  const glowOpacity = useLoop([0.7, 1, 0.7], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <motion.div className={styles.glow} style={{ opacity: glowOpacity }} />
      {ENVELOPES.map((envelope, index) => (
        <FloatingEnvelope key={envelope.id} envelope={envelope} phase={index / ENVELOPES.length} />
      ))}
      {LANES.map((lane) => (
        <SendingEnvelope key={lane.id} lane={lane} />
      ))}
    </div>
  );
}
