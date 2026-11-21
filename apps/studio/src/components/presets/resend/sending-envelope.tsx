import { motion } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { useLoop } from "../scene";
import styles from "./resend.module.css";

export type Lane = {
  id: string;
  top: number;
  rise: string;
  phase: number;
};

type SendingEnvelopeProps = {
  lane: Lane;
};

export default function SendingEnvelope({ lane }: SendingEnvelopeProps) {
  const x = useLoop(["-10%", "50%", "110%", "110%", "-10%"], { phase: lane.phase });
  const y = useLoop(["0%", lane.rise, lane.rise, lane.rise, "0%"], { phase: lane.phase });
  const opacity = useLoop([0, 1, 1, 0, 0], { phase: lane.phase });

  return (
    <motion.div className={styles.lane} style={{ x, y, opacity }}>
      <div className={cn(styles.envelope, styles.sending)} style={{ top: `${lane.top}%` }} />
    </motion.div>
  );
}
