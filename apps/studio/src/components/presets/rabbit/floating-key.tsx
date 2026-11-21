import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { useLoop } from "../scene";
import styles from "./rabbit.module.css";

export type Keycap = {
  id: string;
  x: number;
  y: number;
  size: number;
  tilt: number;
  isFilled: boolean;
  phase: number;
};

type FloatingKeyProps = {
  keycap: Keycap;
};

export default function FloatingKey({ keycap }: FloatingKeyProps) {
  const { x, y, size, tilt, isFilled, phase } = keycap;
  const lift = useLoop([0, -10, 0], { phase, ease: easeInOut });
  const rotate = useLoop([tilt, tilt + 8, tilt], { phase, ease: easeInOut });

  return (
    <motion.span
      className={cn(styles.key, isFilled && styles.keyFilled)}
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, y: lift, rotate }}
    />
  );
}
