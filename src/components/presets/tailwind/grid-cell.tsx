import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./tailwind.module.css";

const CELL_SIZE = 32;

export type Cell = {
  id: string;
  column: number;
  row: number;
  phase: number;
};

type GridCellProps = {
  cell: Cell;
};

export default function GridCell({ cell }: GridCellProps) {
  const opacity = useLoop([0, 0, 1, 0, 0], { phase: cell.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.cell}
      style={{ left: cell.column * CELL_SIZE, top: cell.row * CELL_SIZE, opacity }}
    />
  );
}
