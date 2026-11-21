import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { useLoop } from "../scene";
import styles from "./prisma.module.css";

export type SparkPoint = {
  id: string;
  x: number;
  y: number;
  size: number;
  phase: number;
  isTeal: boolean;
};

type SparkProps = {
  spark: SparkPoint;
};

export default function Spark({ spark }: SparkProps) {
  const scale = useLoop([0.4, 1, 0.4], { phase: spark.phase, ease: easeInOut });
  const opacity = useLoop([0.15, 0.9, 0.15], { phase: spark.phase, ease: easeInOut });

  return (
    <motion.span
      className={cn(styles.spark, spark.isTeal && styles.sparkTeal)}
      style={{ left: `${spark.x}%`, top: `${spark.y}%`, width: spark.size, height: spark.size, rotate: 45, scale, opacity }}
    />
  );
}
