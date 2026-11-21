import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./roses.module.css";

const PETALS = Array.from({ length: 16 }, (_, index) => ({
  id: `petal-${index}`,
  left: `${(index * 37 + 5) % 100}%`,
  size: 10 + ((index * 5) % 9),
  sway: index % 2 === 0 ? 22 : -22,
  spin: index % 2 === 0 ? 360 : -360,
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 16) / 16,
}));

const LEAVES = [
  { id: "leaf-top-left", x: 6, y: 10, size: 18, tilt: -24 },
  { id: "leaf-top-right", x: 90, y: 14, size: 16, tilt: 32 },
  { id: "leaf-bottom-right", x: 86, y: 82, size: 20, tilt: 58 },
  { id: "leaf-bottom-left", x: 10, y: 86, size: 15, tilt: -60 },
];

type Petal = (typeof PETALS)[number];
type Leaf = (typeof LEAVES)[number];

function FallingPetal({ petal }: { petal: Petal }) {
  const options = { cycles: petal.cycles, phase: petal.phase };
  const y = useLoop(["-10cqh", "115cqh"], options);
  const x = useLoop([0, petal.sway, 0, -petal.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([0, petal.spin], options);
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={styles.petal}
      style={{ left: petal.left, width: petal.size, height: petal.size * 0.8, top: 0, x, y, rotate, opacity }}
    />
  );
}

function SwayingLeaf({ leaf, index }: { leaf: Leaf; index: number }) {
  const rotate = useLoop([leaf.tilt, leaf.tilt + 10, leaf.tilt], { phase: index / LEAVES.length, ease: easeInOut });

  return (
    <motion.span className={styles.leaf} style={{ left: `${leaf.x}%`, top: `${leaf.y}%`, rotate }}>
      <Icon icon="solar:leaf-bold-duotone" width={leaf.size} height={leaf.size} />
    </motion.span>
  );
}

function RosesScene() {
  const bloomScale = useLoop([1, 1.12, 1], { ease: easeInOut });
  const driftX = useLoop([0, 20, 0], { ease: easeInOut });
  const driftY = useLoop([0, -16, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.bloomA} style={{ scale: bloomScale, x: driftX, y: driftY }} />
      <motion.div className={styles.bloomB} style={{ x: driftY, y: driftX }} />
      <div className={styles.vignette} />
      {LEAVES.map((leaf, index) => (
        <SwayingLeaf key={leaf.id} leaf={leaf} index={index} />
      ))}
      {PETALS.map((petal) => (
        <FallingPetal key={petal.id} petal={petal} />
      ))}
    </div>
  );
}

function RoseGoldEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <RosesScene />;
const accent = <RoseGoldEdge />;

export default function RosesFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
