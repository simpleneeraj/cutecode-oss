import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const TRACKING_LINES = [
  { id: "tracking-high", top: 18, width: 34, cycles: 3, phase: 0.1 },
  { id: "tracking-mid", top: 46, width: 22, cycles: 2, phase: 0.55 },
  { id: "tracking-low", top: 71, width: 40, cycles: 3, phase: 0.8 },
  { id: "tracking-base", top: 88, width: 28, cycles: 2, phase: 0.3 },
];

type TrackingLine = (typeof TRACKING_LINES)[number];

type TrackingNoiseProps = {
  line: TrackingLine;
};

function TrackingNoise({ line }: TrackingNoiseProps) {
  const options = { cycles: line.cycles, phase: line.phase };
  const x = useLoop([0, 0, 18, -10, 0, 0], options);
  const opacity = useLoop([0, 0, 0.7, 0.4, 0, 0], options);

  return <motion.span className={styles.tracking} style={{ top: `${line.top}%`, width: `${line.width}%`, x, opacity }} />;
}

function RecordingBadge() {
  const opacity = useLoop([1, 1, 0.15, 0.15, 1], { cycles: 6 });

  return (
    <span className={styles.rec}>
      <motion.span className={styles.recDot} style={{ opacity }} />
      REC
    </span>
  );
}

function VhsScene() {
  const bandY = useLoop(["-30cqh", "130cqh"]);
  const bandOpacity = useLoop([0, 1, 1, 0]);
  const jitterX = useLoop([0, 0, 0, 0, 1.5, -1, 0, 0], { cycles: 2 });
  const driftX = useLoop([0, 26, 0], { ease: easeInOut });
  const driftY = useLoop([0, -18, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.picture} style={{ x: jitterX }}>
        <motion.div className={styles.glowKey} style={{ x: driftX, y: driftY }} />
        <motion.div className={styles.glowFill} style={{ x: driftY, y: driftX }} />
      </motion.div>
      <div className={styles.scanlines} />
      <motion.div className={styles.band} style={{ y: bandY, opacity: bandOpacity }} />
      {TRACKING_LINES.map((line) => (
        <TrackingNoise key={line.id} line={line} />
      ))}
      <div className={styles.vignette} />
      <RecordingBadge />
      <span className={styles.speed}>SP</span>
      <span className={styles.date}>OCT. 17 1994</span>
      <span className={styles.time}>AM 10:24</span>
    </div>
  );
}

function ChromaEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <VhsScene />;
const accent = <ChromaEdge />;

export default function VhsFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
