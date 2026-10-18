import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const LANTERNS = [
  { id: "lantern-far-left", x: 7, drop: 34, scale: 0.85, cycles: 2, phase: 0 },
  { id: "lantern-left", x: 19, drop: 70, scale: 1, cycles: 1, phase: 0.3 },
  { id: "lantern-right", x: 81, drop: 52, scale: 1.1, cycles: 1, phase: 0.65 },
  { id: "lantern-far-right", x: 93, drop: 22, scale: 0.8, cycles: 2, phase: 0.5 },
];

const PETAL_ANGLES = [0, 72, 144, 216, 288];

const BLOSSOMS = [
  { id: "blossom-top", x: 31, y: 7, size: 22 },
  { id: "blossom-bottom-left", x: 6, y: 86, size: 26 },
  { id: "blossom-bottom-right", x: 90, y: 82, size: 20 },
  { id: "blossom-right", x: 70, y: 9, size: 16 },
];

const PETALS = Array.from({ length: 10 }, (_, index) => ({
  id: `petal-${index}`,
  left: `${(index * 29 + 11) % 100}%`,
  size: 6 + (index % 3) * 2,
  sway: index % 2 === 0 ? 26 : -26,
  spin: index % 2 === 0 ? 360 : -360,
  cycles: 1 + (index % 2),
  phase: ((index * 3) % 10) / 10,
}));

const CLOUDS = [
  { id: "cloud-top", x: 40, y: 16, drift: 22, phase: 0 },
  { id: "cloud-left", x: -4, y: 56, drift: 18, phase: 0.35 },
  { id: "cloud-right", x: 74, y: 70, drift: -20, phase: 0.7 },
];

type Lantern = (typeof LANTERNS)[number];
type Blossom = (typeof BLOSSOMS)[number];
type Petal = (typeof PETALS)[number];
type Cloud = (typeof CLOUDS)[number];

type HangingLanternProps = {
  lantern: Lantern;
};

function HangingLantern({ lantern }: HangingLanternProps) {
  const options = { cycles: lantern.cycles, phase: lantern.phase, ease: easeInOut };
  const rotate = useLoop([-4, 4, -4], options);
  const glow = useLoop([0.55, 1, 0.55], options);

  return (
    <motion.span
      className={styles.lantern}
      style={{ left: `${lantern.x}%`, scale: lantern.scale, rotate, transformOrigin: "50% 0%" }}
    >
      <span className={styles.string} style={{ height: lantern.drop }} />
      <span className={styles.cap} />
      <span className={styles.body}>
        <motion.span className={styles.glow} style={{ opacity: glow }} />
      </span>
      <span className={styles.cap} />
      <span className={styles.tassel} />
    </motion.span>
  );
}

type PlumBlossomProps = {
  blossom: Blossom;
  index: number;
};

function PlumBlossom({ blossom, index }: PlumBlossomProps) {
  const phase = index / BLOSSOMS.length;
  const y = useLoop([0, -6, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, 14, 0], { phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.blossom}
      style={{ left: `${blossom.x}%`, top: `${blossom.y}%`, width: blossom.size, height: blossom.size, y, rotate }}
    >
      {PETAL_ANGLES.map((angle) => (
        <span key={angle} className={styles.blossomPetal} style={{ transform: `rotate(${angle}deg) translateY(-38%)` }} />
      ))}
    </motion.span>
  );
}

type FallingPetalProps = {
  petal: Petal;
};

function FallingPetal({ petal }: FallingPetalProps) {
  const options = { cycles: petal.cycles, phase: petal.phase };
  const y = useLoop(["-6cqh", "106cqh"], options);
  const x = useLoop([0, petal.sway, 0, -petal.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([0, petal.spin], options);
  const opacity = useLoop([0, 0.85, 0.85, 0], options);

  return (
    <motion.span
      className={styles.petal}
      style={{ left: petal.left, width: petal.size, height: petal.size * 0.75, x, y, rotate, opacity }}
    />
  );
}

type AuspiciousCloudProps = {
  cloud: Cloud;
};

function AuspiciousCloud({ cloud }: AuspiciousCloudProps) {
  const x = useLoop([0, cloud.drift, 0], { phase: cloud.phase, ease: easeInOut });

  return <motion.span className={styles.cloud} style={{ left: `${cloud.x}%`, top: `${cloud.y}%`, x }} />;
}

function LunarNewYearScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.warmth} />
      {CLOUDS.map((cloud) => (
        <AuspiciousCloud key={cloud.id} cloud={cloud} />
      ))}
      {LANTERNS.map((lantern) => (
        <HangingLantern key={lantern.id} lantern={lantern} />
      ))}
      {BLOSSOMS.map((blossom, index) => (
        <PlumBlossom key={blossom.id} blossom={blossom} index={index} />
      ))}
      {PETALS.map((petal) => (
        <FallingPetal key={petal.id} petal={petal} />
      ))}
    </div>
  );
}

function GoldThreadEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <LunarNewYearScene />;
const accent = <GoldThreadEdge />;

export default function LunarNewYearFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
