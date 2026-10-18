import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { useLoop } from "../scene";
import styles from "./stripe.module.css";

export type Ribbon = {
  id: string;
  tone: string;
  top: number;
  height: number;
  sway: number;
  isReversed: boolean;
  phase: number;
};

type FlowingRibbonProps = {
  ribbon: Ribbon;
};

export default function FlowingRibbon({ ribbon }: FlowingRibbonProps) {
  const x = useLoop(ribbon.isReversed ? ["-20%", "0%"] : ["0%", "-20%"]);
  const y = useLoop([0, ribbon.sway, 0], { phase: ribbon.phase, ease: easeInOut });

  return (
    <motion.div
      className={cn(styles.ribbon, styles[ribbon.tone])}
      style={{ top: `${ribbon.top}%`, height: `${ribbon.height}%`, x, y }}
    />
  );
}
