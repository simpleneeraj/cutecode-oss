import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import FlowWave, { type Wave } from "./flow-wave";
import GridCell, { type Cell } from "./grid-cell";
import styles from "./tailwind.module.css";

const WAVES: Wave[] = [
  { id: "violet", tone: "waveViolet", isReversed: true, cycles: 1 },
  { id: "sky", tone: "waveSky", isReversed: false, cycles: 1 },
  { id: "cyan", tone: "waveCyan", isReversed: true, cycles: 2 },
];

const CELL_POSITIONS = [
  [2, 1],
  [6, 3],
  [9, 0],
  [13, 2],
  [17, 1],
  [20, 3],
  [24, 0],
  [27, 2],
  [1, 5],
  [26, 6],
  [4, 8],
  [23, 9],
];

const CELLS: Cell[] = CELL_POSITIONS.map(([column, row], index) => ({
  id: `cell-${column}-${row}`,
  column,
  row,
  phase: ((index * 5) % CELL_POSITIONS.length) / CELL_POSITIONS.length,
}));

export default function TailwindScene() {
  const driftX = useLoop([0, 28, 0], { ease: easeInOut });
  const driftY = useLoop([0, -16, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.beamSky} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.beamViolet} style={{ x: driftY, y: driftX }} />
      <div className={styles.grid} />
      <div className={styles.cells}>
        {CELLS.map((cell) => (
          <GridCell key={cell.id} cell={cell} />
        ))}
      </div>
      <div className={styles.flow}>
        {WAVES.map((wave) => (
          <FlowWave key={wave.id} wave={wave} />
        ))}
      </div>
    </div>
  );
}
