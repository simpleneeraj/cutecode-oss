import { motion, easeInOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const ARM_ANGLES = [0, 60, 120];

const CRYSTALS = [
  { id: "crystal-top-left", x: 8, y: 12, size: 30 },
  { id: "crystal-top-right", x: 88, y: 18, size: 22 },
  { id: "crystal-right", x: 94, y: 58, size: 16 },
  { id: "crystal-bottom-right", x: 80, y: 86, size: 28 },
  { id: "crystal-bottom-left", x: 14, y: 82, size: 20 },
  { id: "crystal-left", x: 4, y: 46, size: 14 },
];

const FLAKES = Array.from({ length: 20 }, (_, index) => ({
  id: `flake-${index}`,
  left: `${(index * 47 + 3) % 100}%`,
  size: 2 + (index % 3),
  sway: index % 2 === 0 ? 14 : -14,
  cycles: 1 + (index % 2),
  phase: ((index * 9) % 20) / 20,
}));

type Crystal = (typeof CRYSTALS)[number];
type Flake = (typeof FLAKES)[number];

type FrostCrystalProps = {
  crystal: Crystal;
  index: number;
};

function FrostCrystal({ crystal, index }: FrostCrystalProps) {
  const phase = index / CRYSTALS.length;
  const rotate = useLoop([0, index % 2 === 0 ? 60 : -60]);
  const y = useLoop([0, -6, 0], { phase, ease: easeInOut });
  const opacity = useLoop([0.55, 1, 0.55], { phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.crystal}
      style={{ left: `${crystal.x}%`, top: `${crystal.y}%`, width: crystal.size, height: crystal.size, rotate, y, opacity }}
    >
      {ARM_ANGLES.map((angle) => (
        <span key={angle} className={styles.arm} style={{ transform: `rotate(${angle}deg)` }} />
      ))}
    </motion.span>
  );
}

type SnowFlakeProps = {
  flake: Flake;
};

function SnowFlake({ flake }: SnowFlakeProps) {
  const options = { cycles: flake.cycles, phase: flake.phase };
  const y = useLoop(["-4cqh", "104cqh"], options);
  const x = useLoop([0, flake.sway, 0, -flake.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={styles.flake}
      style={{ left: flake.left, width: flake.size, height: flake.size, x, y, opacity }}
    />
  );
}

function Aurora() {
  const options = { ease: easeInOut };
  const x = useLoop([0, 40, 0], options);
  const scaleY = useLoop([1, 1.25, 1], { ...options, phase: 0.3 });
  const opacity = useLoop([0.6, 1, 0.6], { ...options, cycles: 2 });
  const trailX = useLoop([0, -30, 0], { ...options, phase: 0.5 });
  const trailOpacity = useLoop([0.9, 0.5, 0.9], { ...options, cycles: 2 });

  return (
    <>
      <motion.div className={styles.aurora} style={{ x, scaleY, opacity }} />
      <motion.div className={styles.auroraTrail} style={{ x: trailX, opacity: trailOpacity }} />
    </>
  );
}

function WinterFrostScene() {
  return (
    <div className={styles.layer} aria-hidden>
      <Aurora />
      <div className={styles.frost} />
      {CRYSTALS.map((crystal, index) => (
        <FrostCrystal key={crystal.id} crystal={crystal} index={index} />
      ))}
      {FLAKES.map((flake) => (
        <SnowFlake key={flake.id} flake={flake} />
      ))}
    </div>
  );
}

function IceEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <WinterFrostScene />;
const accent = <IceEdge />;

export default function WinterFrostFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
