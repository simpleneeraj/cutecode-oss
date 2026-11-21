import { motion, easeInOut } from "motion/react";
import { StarsMinimalisticIcon } from "@solar-icons/react/bold-duotone/stars-minimalistic";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./neon-dreams.module.css";

const SPARKS = [
  { id: "top-left", x: 7, y: 9, size: 16, phase: 0 },
  { id: "top-mid", x: 34, y: 5, size: 12, phase: 0.4 },
  { id: "top-right", x: 88, y: 12, size: 18, phase: 0.2 },
  { id: "mid-left", x: 4, y: 42, size: 12, phase: 0.7 },
  { id: "mid-right", x: 94, y: 38, size: 12, phase: 0.55 },
];

type Spark = (typeof SPARKS)[number];

function FlickeringSpark({ spark }: { spark: Spark }) {
  const opacity = useLoop([0.2, 0.8, 0.5, 0.9, 0.2], { cycles: 2, phase: spark.phase });
  const y = useLoop([0, -6, 0], { phase: spark.phase, ease: easeInOut });

  return (
    <motion.span className={styles.spark} style={{ left: `${spark.x}%`, top: `${spark.y}%`, opacity, y }}>
      <StarsMinimalisticIcon size={spark.size} />
    </motion.span>
  );
}

function NeonSun() {
  const scale = useLoop([1, 1.05, 1], { cycles: 2, ease: easeInOut });
  const glow = useLoop([0.6, 1, 0.6], { cycles: 2, ease: easeInOut });

  return (
    <div className={styles.sunWrap}>
      <motion.div className={styles.sunGlow} style={{ opacity: glow, scale }} />
      <div className={styles.sun} />
    </div>
  );
}

function GridFloor() {
  const y = useLoop([0, 40], { cycles: 3 });

  return (
    <div className={styles.floor}>
      <div className={styles.plane}>
        <motion.div className={styles.grid} style={{ y }} />
      </div>
    </div>
  );
}

function NeonDreamsScene() {
  const driftX = useLoop([0, 30, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.blobA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobB} style={{ x: driftY, y: driftX }} />
      <NeonSun />
      <GridFloor />
      <div className={styles.horizon} />
      {SPARKS.map((spark) => (
        <FlickeringSpark key={spark.id} spark={spark} />
      ))}
      <div className={styles.scanlines} />
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

const background = <NeonDreamsScene />;
const accent = <TopEdgeSweep />;

export default function NeonDreamsFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
