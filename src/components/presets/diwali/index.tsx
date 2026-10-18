import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const PETAL_ANGLES = Array.from({ length: 8 }, (_, index) => index * 45);
const DOT_ANGLES = Array.from({ length: 16 }, (_, index) => index * 22.5);

const DIYAS = [
  { id: "diya-far-left", left: "6%", phase: 0 },
  { id: "diya-left", left: "18%", phase: 0.35 },
  { id: "diya-center", left: "50%", phase: 0.6 },
  { id: "diya-right", left: "82%", phase: 0.2 },
  { id: "diya-far-right", left: "94%", phase: 0.8 },
];

const SPARKS = Array.from({ length: 16 }, (_, index) => ({
  id: `spark-${index}`,
  left: `${(index * 37 + 11) % 100}%`,
  size: 2 + (index % 2),
  sway: index % 2 === 0 ? 10 : -10,
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 16) / 16,
}));

const TWINKLES = [
  { id: "twinkle-top-left", x: 8, y: 12, size: 12 },
  { id: "twinkle-top", x: 30, y: 6, size: 9 },
  { id: "twinkle-top-right", x: 70, y: 9, size: 10 },
  { id: "twinkle-right", x: 93, y: 40, size: 12 },
  { id: "twinkle-left", x: 4, y: 58, size: 9 },
  { id: "twinkle-bottom", x: 64, y: 82, size: 8 },
];

type Diya = (typeof DIYAS)[number];
type Spark = (typeof SPARKS)[number];
type Twinkle = (typeof TWINKLES)[number];

function Rangoli() {
  return (
    <svg viewBox="-50 -50 100 100" className="size-full">
      <circle className={styles.rangoliRing} r="46" />
      {PETAL_ANGLES.map((angle) => (
        <ellipse key={`outer-${angle}`} className={styles.petalOuter} cy="-28" rx="7" ry="14" transform={`rotate(${angle})`} />
      ))}
      {PETAL_ANGLES.map((angle) => (
        <ellipse
          key={`inner-${angle}`}
          className={styles.petalInner}
          cy="-15"
          rx="5"
          ry="9"
          transform={`rotate(${angle + 22.5})`}
        />
      ))}
      {DOT_ANGLES.map((angle) => (
        <circle key={`dot-${angle}`} className={styles.rangoliDot} cy="-41" r="2" transform={`rotate(${angle})`} />
      ))}
      <circle className={styles.rangoliCore} r="7" />
      <circle className={styles.rangoliHeart} r="3" />
    </svg>
  );
}

function DiyaLamp({ diya }: { diya: Diya }) {
  const options = { cycles: 3, phase: diya.phase, ease: easeInOut };
  const scaleY = useLoop([1, 1.16, 0.9, 1.08, 1], options);
  const rotate = useLoop([0, 4, -3, 2, 0], options);
  const opacity = useLoop([0.75, 1, 0.8, 0.95, 0.75], options);

  return (
    <div className={styles.diya} style={{ left: diya.left }}>
      <motion.span className={styles.diyaGlow} style={{ opacity }} />
      <motion.span className={styles.flame} style={{ scaleY, rotate }} />
      <svg className={styles.bowl} viewBox="0 0 40 18">
        <path d="M1 4c7 3 31 3 38 0-2 9-10 13-19 13S3 13 1 4z" />
        <path className={styles.rim} d="M1 4c7 3 31 3 38 0" />
      </svg>
    </div>
  );
}

function RisingSpark({ spark }: { spark: Spark }) {
  const options = { cycles: spark.cycles, phase: spark.phase };
  const y = useLoop(["0cqh", "-70cqh"], options);
  const x = useLoop([0, spark.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 1, 0.6, 0], options);

  return (
    <motion.span
      className={styles.spark}
      style={{ left: spark.left, width: spark.size, height: spark.size, x, y, opacity }}
    />
  );
}

function GoldTwinkle({ twinkle, index }: { twinkle: Twinkle; index: number }) {
  const phase = index / TWINKLES.length;
  const scale = useLoop([0.6, 1, 0.6], { phase, ease: easeInOut });
  const opacity = useLoop([0.3, 0.95, 0.3], { phase, ease: easeInOut });

  return (
    <motion.svg
      className={styles.twinkle}
      viewBox="0 0 24 24"
      width={twinkle.size}
      height={twinkle.size}
      style={{ left: `${twinkle.x}%`, top: `${twinkle.y}%`, scale, opacity }}
    >
      <path d="M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10z" />
    </motion.svg>
  );
}

function DiwaliScene() {
  const rotate = useLoop([0, 22.5, 0], { ease: easeInOut });
  const counterRotate = useLoop([0, -22.5, 0], { ease: easeInOut });
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <motion.div className={styles.rangoliTop} style={{ rotate }}>
        <Rangoli />
      </motion.div>
      <motion.div className={styles.rangoliBottom} style={{ rotate: counterRotate }}>
        <Rangoli />
      </motion.div>
      {TWINKLES.map((twinkle, index) => (
        <GoldTwinkle key={twinkle.id} twinkle={twinkle} index={index} />
      ))}
      {SPARKS.map((spark) => (
        <RisingSpark key={spark.id} spark={spark} />
      ))}
      {DIYAS.map((diya) => (
        <DiyaLamp key={diya.id} diya={diya} />
      ))}
    </div>
  );
}

function MarigoldEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <DiwaliScene />;
const accent = <MarigoldEdge />;

export default function DiwaliFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
