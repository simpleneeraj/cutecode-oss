import { motion } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { useLoop } from "../scene";
import styles from "./cloudflare.module.css";

export type Packet = {
  id: string;
  position: number;
  isVertical: boolean;
  isReversed: boolean;
  cycles: number;
  phase: number;
};

type PacketPulseProps = {
  packet: Packet;
};

export default function PacketPulse({ packet }: PacketPulseProps) {
  const timing = { cycles: packet.cycles, phase: packet.phase };
  const travel = useLoop(packet.isReversed ? ["100%", "0%"] : ["0%", "100%"], timing);
  const opacity = useLoop([0, 1, 1, 0], timing);
  const pulseClassName = cn(styles.pulse, packet.isReversed && styles.isReversed);

  if (packet.isVertical) {
    return (
      <span className={styles.laneVertical} style={{ left: `${packet.position}%` }}>
        <motion.span className={styles.track} style={{ y: travel, opacity }}>
          <span className={pulseClassName} />
        </motion.span>
      </span>
    );
  }

  return (
    <span className={styles.laneHorizontal} style={{ top: `${packet.position}%` }}>
      <motion.span className={styles.track} style={{ x: travel, opacity }}>
        <span className={pulseClassName} />
      </motion.span>
    </span>
  );
}
