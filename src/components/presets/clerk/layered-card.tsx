import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export type Card = {
  id: string;
  x: number;
  y: number;
  tilt: number;
  phase: number;
};

type LayeredCardProps = {
  card: Card;
};

export default function LayeredCard({ card }: LayeredCardProps) {
  const y = useLoop([0, -8, 0], { phase: card.phase, ease: easeInOut });
  const rotate = useLoop([card.tilt, card.tilt + 2, card.tilt], { phase: card.phase, ease: easeInOut });

  return (
    <motion.div className={styles.card} style={{ left: `${card.x}%`, top: `${card.y}%`, y, rotate }}>
      <span className={styles.avatar} />
      <span className={styles.lineWide} />
      <span className={styles.lineShort} />
      <span className={styles.button} />
    </motion.div>
  );
}
