import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./vercel.module.css";

const GRID_SIZE = 48;

export type Marker = {
  id: string;
  column: number;
  row: number;
  phase: number;
};

type CrosshairProps = {
  marker: Marker;
};

export default function Crosshair({ marker }: CrosshairProps) {
  const opacity = useLoop([0.25, 1, 0.25], { phase: marker.phase, ease: easeInOut });
  const scale = useLoop([0.8, 1, 0.8], { phase: marker.phase, ease: easeInOut });
  const left = `calc(50% + ${marker.column * GRID_SIZE - GRID_SIZE / 2}px)`;
  const top = `calc(50% + ${marker.row * GRID_SIZE - GRID_SIZE / 2}px)`;

  return <motion.span className={styles.crosshair} style={{ left, top, opacity, scale }} />;
}
