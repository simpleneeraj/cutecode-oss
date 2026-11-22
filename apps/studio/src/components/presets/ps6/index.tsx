import { motion, easeInOut } from "motion/react";
import { GamepadIcon } from "@solar-icons/react/bold-duotone/gamepad";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./ps6.module.css";

const CONTROLLERS = [
  { x: 7, y: 10, size: 22, tilt: 10 },
  { x: 88, y: 64, size: 18, tilt: -10 },
];

const PIXELS = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 43 + 7) % 96}%`,
  top: `${(index * 29 + 11) % 60}%`,
  size: 4 + ((index * 3) % 3) * 2,
  isBright: index % 3 === 0,
  cycles: 1 + (index % 3),
  phase: ((index * 7) % 14) / 14,
}));

const floorGrowth = 1.4;

const floor = {
  growth: floorGrowth,
  raysPath: Array.from({ length: 21 }, (_, index) => {
    const offset = index - 10;
    return `M${500 + offset * 40} 0L${500 + offset * 160} 100`;
  }).join(""),
  rowsPath: Array.from({ length: 13 }, (_, index) => `M0 ${(100 / floorGrowth ** index).toFixed(3)}H1000`).join(""),
};

type Controller = (typeof CONTROLLERS)[number];
type Pixel = (typeof PIXELS)[number];

function FloatingController({ controller, index }: { controller: Controller; index: number }) {
  const phase = index / CONTROLLERS.length;
  const y = useLoop([0, -10, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, controller.tilt, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.controller} style={{ left: `${controller.x}%`, top: `${controller.y}%`, y, rotate }}>
      <GamepadIcon size={controller.size} />
    </motion.span>
  );
}

function BlinkingPixel({ pixel }: { pixel: Pixel }) {
  const options = { cycles: pixel.cycles, phase: pixel.phase };
  const opacity = useLoop([0.15, 0.9, 0.15], options);
  const y = useLoop([0, -8, 0], { ...options, ease: easeInOut });

  return (
    <motion.span
      className={pixel.isBright ? styles.brightPixel : styles.pixel}
      style={{ left: pixel.left, top: pixel.top, width: pixel.size, height: pixel.size, y, opacity }}
    />
  );
}

function PerspectiveFloor() {
  const scaleY = useLoop([1, floor.growth], { cycles: 2 });

  return (
    <div className={styles.floor}>
      <svg className={styles.grid} viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d={floor.raysPath} vectorEffect="non-scaling-stroke" />
      </svg>
      <motion.svg className={styles.grid} viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ scaleY }}>
        <path d={floor.rowsPath} vectorEffect="non-scaling-stroke" />
      </motion.svg>
      <div className={styles.floorFade} />
    </div>
  );
}

function RetroConsoleScene() {
  const sunScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const scanY = useLoop(["-10cqh", "110cqh"]);

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.sun} style={{ scale: sunScale }} />
      <PerspectiveFloor />
      <div className={styles.horizon} />
      {PIXELS.map((pixel, index) => (
        <BlinkingPixel key={index} pixel={pixel} />
      ))}
      {CONTROLLERS.map((controller, index) => (
        <FloatingController key={index} controller={controller} index={index} />
      ))}
      <div className={styles.scanlines} />
      <motion.div className={styles.scanBar} style={{ y: scanY }} />
    </div>
  );
}

function TopEdgeSweep() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <RetroConsoleScene />;
const accent = <TopEdgeSweep />;

export default function RetroConsoleFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
