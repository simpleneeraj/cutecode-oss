import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import EdgeNode, { type EdgePoint } from "./edge-node";
import PacketPulse, { type Packet } from "./packet-pulse";
import styles from "./cloudflare.module.css";

const HORIZONTAL_RAILS = [12, 50, 88];
const VERTICAL_RAILS = [6, 24, 76, 94];

const NODES: EdgePoint[] = [
  { id: "north-west", x: 6, y: 12, phase: 0 },
  { id: "north-inner", x: 24, y: 12, phase: 0.55 },
  { id: "north-east", x: 76, y: 12, phase: 0.3 },
  { id: "east", x: 94, y: 50, phase: 0.8 },
  { id: "west", x: 6, y: 50, phase: 0.45 },
  { id: "south-west", x: 24, y: 88, phase: 0.15 },
  { id: "south-east", x: 76, y: 88, phase: 0.65 },
  { id: "south-far-east", x: 94, y: 88, phase: 0.95 },
];

const PACKETS: Packet[] = [
  { id: "top-out", position: 12, isVertical: false, isReversed: false, cycles: 1, phase: 0 },
  { id: "top-in", position: 12, isVertical: false, isReversed: true, cycles: 2, phase: 0.4 },
  { id: "middle-out", position: 50, isVertical: false, isReversed: false, cycles: 1, phase: 0.5 },
  { id: "middle-in", position: 50, isVertical: false, isReversed: true, cycles: 1, phase: 0.15 },
  { id: "bottom-out", position: 88, isVertical: false, isReversed: true, cycles: 1, phase: 0.7 },
  { id: "bottom-in", position: 88, isVertical: false, isReversed: false, cycles: 2, phase: 0.25 },
  { id: "west-down", position: 6, isVertical: true, isReversed: false, cycles: 1, phase: 0.35 },
  { id: "inner-west-up", position: 24, isVertical: true, isReversed: true, cycles: 2, phase: 0.6 },
  { id: "inner-east-down", position: 76, isVertical: true, isReversed: false, cycles: 2, phase: 0.1 },
  { id: "east-up", position: 94, isVertical: true, isReversed: true, cycles: 1, phase: 0.85 },
];

export default function CloudflareScene() {
  const glowScale = useLoop([1, 1.1, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.75, 1, 0.75], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.grid} />
      <motion.div className={styles.coreGlow} style={{ scale: glowScale, opacity: glowOpacity }} />
      {HORIZONTAL_RAILS.map((top) => (
        <span key={top} className={styles.railHorizontal} style={{ top: `${top}%` }} />
      ))}
      {VERTICAL_RAILS.map((left) => (
        <span key={left} className={styles.railVertical} style={{ left: `${left}%` }} />
      ))}
      {PACKETS.map((packet) => (
        <PacketPulse key={packet.id} packet={packet} />
      ))}
      {NODES.map((node) => (
        <EdgeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
