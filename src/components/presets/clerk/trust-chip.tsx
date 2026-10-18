import { motion, easeInOut } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { useLoop } from "../scene";
import styles from "./clerk.module.css";

export type Chip = {
  id: string;
  icon: string;
  x: number;
  y: number;
  phase: number;
};

type TrustChipProps = {
  chip: Chip;
};

export default function TrustChip({ chip }: TrustChipProps) {
  const y = useLoop([0, -10, 0], { phase: chip.phase, ease: easeInOut });
  const opacity = useLoop([0.75, 1, 0.75], { phase: chip.phase, ease: easeInOut });

  return (
    <motion.span className={styles.chip} style={{ left: `${chip.x}%`, top: `${chip.y}%`, y, opacity }}>
      <Icon icon={chip.icon} className="size-4" />
    </motion.span>
  );
}
