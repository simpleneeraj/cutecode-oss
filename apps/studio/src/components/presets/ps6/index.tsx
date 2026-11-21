import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
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
  size: 5 + ((index * 3) % 3) * 2,
  color: ["#7ce7ff", "#ff7ac6", "#b69cff", "#ffd36e"][index % 4],
  cycles: 1 + (index % 3),
  phase: ((index * 7) % 14) / 14,
}));

type Controller = (typeof CONTROLLERS)[number];
type Pixel = (typeof PIXELS)[number];

function FloatingController({ controller, index }: { controller: Controller; index: number }) {
  const phase = index / CONTROLLERS.length;
  const y = useLoop([0, -10, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, controller.tilt, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.controller} style={{ left: `${controller.x}%`, top: `${controller.y}%`, y, rotate }}>
      <Icon icon="solar:gamepad-bold-duotone" width={controller.size} height={controller.size} />
    </motion.span>
  );
}

function BlinkingPixel({ pixel }: { pixel: Pixel }) {
  const options = { cycles: pixel.cycles, phase: pixel.phase };
  const opacity = useLoop([0.15, 0.9, 0.15], options);
  const y = useLoop([0, -8, 0], { ...options, ease: easeInOut });

  return (
    <motion.span
      className={styles.pixel}
      style={{
        left: pixel.left,
        top: pixel.top,
        width: pixel.size,
        height: pixel.size,
        background: pixel.color,
        color: pixel.color,
        y,
        opacity,
      }}
    />
  );
}

function RetroConsoleScene() {
  const gridY = useLoop([0, 48], { cycles: 2 });
  const sunScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const scanY = useLoop(["-10cqh", "110cqh"]);

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.sun} style={{ scale: sunScale }} />
      <div className={styles.horizon} />
      <div className={styles.floor}>
        <div className={styles.grid}>
          <motion.div className={styles.gridLines} style={{ y: gridY }} />
        </div>
      </div>
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
