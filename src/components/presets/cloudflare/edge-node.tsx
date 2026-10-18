import { motion, easeOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./cloudflare.module.css";

export type EdgePoint = {
  id: string;
  x: number;
  y: number;
  phase: number;
};

type EdgeNodeProps = {
  node: EdgePoint;
};

export default function EdgeNode({ node }: EdgeNodeProps) {
  const scale = useLoop([0.6, 2.6], { phase: node.phase, ease: easeOut });
  const opacity = useLoop([0, 0.9, 0], { phase: node.phase });

  return (
    <span className={styles.node} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
      <motion.span className={styles.ripple} style={{ scale, opacity }} />
    </span>
  );
}
