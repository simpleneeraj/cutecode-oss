import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import DataRail, { type Rail } from "./data-rail";
import JunctionNode, { type Junction } from "./junction-node";
import styles from "./supabase.module.css";

const ROWS = [12, 34, 66, 88];
const COLUMNS = [6, 50, 94];

const RAILS: Rail[] = [
  ...ROWS.map((position, index) => ({
    id: `row-${position}`,
    position,
    isVertical: false,
    flows: [
      { id: `row-${position}-lead`, cycles: 1, phase: index * 0.27 },
      { id: `row-${position}-trail`, cycles: 2, phase: index * 0.19 + 0.5 },
    ],
  })),
  ...COLUMNS.map((position, index) => ({
    id: `column-${position}`,
    position,
    isVertical: true,
    flows: [
      { id: `column-${position}-lead`, cycles: 1, phase: index * 0.33 + 0.1 },
      { id: `column-${position}-trail`, cycles: 2, phase: index * 0.21 + 0.6 },
    ],
  })),
];

const JUNCTIONS: Junction[] = [
  ...ROWS.flatMap((y, row) =>
    [6, 94].map((x, column) => ({ id: `node-${x}-${y}`, x, y, phase: (row * 2 + column) / 10 })),
  ),
  { id: "node-50-12", x: 50, y: 12, phase: 0.8 },
  { id: "node-50-88", x: 50, y: 88, phase: 0.9 },
];

export default function SupabaseScene() {
  const bloomScale = useLoop([1, 1.12, 1], { ease: easeInOut });
  const bloomOpacity = useLoop([0.7, 1, 0.7], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.dotGrid} />
      <motion.div className={styles.bloom} style={{ scale: bloomScale, opacity: bloomOpacity }} />
      {RAILS.map((rail) => (
        <DataRail key={rail.id} rail={rail} />
      ))}
      {JUNCTIONS.map((junction) => (
        <JunctionNode key={junction.id} junction={junction} />
      ))}
    </div>
  );
}
