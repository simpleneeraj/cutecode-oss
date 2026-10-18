import { motion } from "motion/react";
import { useLoop } from "../scene";
import styles from "./claude.module.css";

type Cell = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const BODY: Cell[] = [
  { id: "body", x: 1, y: 0, width: 16, height: 6 },
  { id: "nub-left", x: 0, y: 2, width: 1, height: 2 },
  { id: "nub-right", x: 17, y: 2, width: 1, height: 2 },
];

const EYES: Cell[] = [
  { id: "eye-left", x: 5, y: 2, width: 1, height: 2 },
  { id: "eye-right", x: 12, y: 2, width: 1, height: 2 },
];

const OUTER_LEGS: Cell[] = [
  { id: "leg-1", x: 2, y: 6, width: 1, height: 2 },
  { id: "leg-4", x: 15, y: 6, width: 1, height: 2 },
];

const INNER_LEGS: Cell[] = [
  { id: "leg-2", x: 4, y: 6, width: 1, height: 2 },
  { id: "leg-3", x: 13, y: 6, width: 1, height: 2 },
];

const BLINK = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.1, 1];

type CellsProps = {
  cells: Cell[];
};

function Cells({ cells }: CellsProps) {
  return cells.map((cell) => (
    <rect key={cell.id} x={cell.x} y={cell.y} width={cell.width} height={cell.height} />
  ));
}

export default function PixelCritter() {
  const outerStep = useLoop([0, -0.5, 0, 0, 0], { cycles: 4 });
  const innerStep = useLoop([0, 0, 0, -0.5, 0], { cycles: 4 });
  const blink = useLoop(BLINK, { cycles: 2 });

  return (
    <svg className={styles.critter} viewBox="0 0 18 8" shapeRendering="crispEdges">
      <motion.g style={{ y: outerStep }}>
        <Cells cells={OUTER_LEGS} />
      </motion.g>
      <motion.g style={{ y: innerStep }}>
        <Cells cells={INNER_LEGS} />
      </motion.g>
      <Cells cells={BODY} />
      <motion.g className={styles.critterEyes} style={{ scaleY: blink }}>
        <Cells cells={EYES} />
      </motion.g>
    </svg>
  );
}
