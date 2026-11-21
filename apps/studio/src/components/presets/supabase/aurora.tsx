import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { useLoop } from "../scene";
import styles from "./supabase.module.css";

export type AuroraRibbon = {
  id: string;
  className: string;
  phase: number;
};

type AuroraProps = {
  ribbon: AuroraRibbon;
};

export default function Aurora({ ribbon }: AuroraProps) {
  const x = useLoop(["-6%", "6%", "-6%"], { phase: ribbon.phase, ease: easeInOut });
  const opacity = useLoop([0.6, 1, 0.6], { phase: ribbon.phase, ease: easeInOut });

  return <motion.div className={cn(styles.aurora, ribbon.className)} style={{ x, opacity }} />;
}
