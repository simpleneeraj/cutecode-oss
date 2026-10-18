import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

export type Flow = {
  id: string;
  cycles: number;
  phase: number;
};

type PacketProps = {
  flow: Flow;
  isVertical: boolean;
};

export default function Packet({ flow, isVertical }: PacketProps) {
  const offset = useLoop(["0%", "100%"], { cycles: flow.cycles, phase: flow.phase });

  if (isVertical) {
    return (
      <motion.span className={styles.runner} style={{ y: offset }}>
        <span className={styles.packet} />
      </motion.span>
    );
  }

  return (
    <motion.span className={styles.runner} style={{ x: offset }}>
      <span className={styles.packet} />
    </motion.span>
  );
}
