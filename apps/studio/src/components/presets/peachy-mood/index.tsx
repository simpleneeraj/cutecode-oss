import { motion, easeInOut, easeOut } from "motion/react";
import { HeartIcon } from "@solar-icons/react/bold-duotone/heart";
import { LeafIcon } from "@solar-icons/react/bold-duotone/leaf";
import { SunIcon } from "@solar-icons/react/bold-duotone/sun";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./peachy-mood.module.css";

const RIPPLES = [
  { id: "ripple-a", phase: 0 },
  { id: "ripple-b", phase: 1 / 3 },
  { id: "ripple-c", phase: 2 / 3 },
];

const PETALS = Array.from({ length: 12 }, (_, index) => ({
  id: `petal-${index}`,
  left: `${(index * 29 + 6) % 100}%`,
  size: 8 + ((index * 5) % 6),
  sway: index % 2 === 0 ? 18 : -18,
  spin: index % 2 === 0 ? 360 : -360,
  phase: ((index * 5) % 12) / 12,
}));

const FLOATERS = [
  { id: "sun", icon: SunIcon, x: 6, y: 8, size: 20 },
  { id: "heart", icon: HeartIcon, x: 90, y: 10, size: 16 },
  { id: "leaf-left", icon: LeafIcon, x: 3, y: 60, size: 15 },
  { id: "leaf-bottom", icon: LeafIcon, x: 56, y: 92, size: 14 },
];

type Ripple = (typeof RIPPLES)[number];
type Petal = (typeof PETALS)[number];
type Floater = (typeof FLOATERS)[number];

function ExpandingRipple({ ripple }: { ripple: Ripple }) {
  const scale = useLoop([0.5, 1.7], { phase: ripple.phase, ease: easeOut });
  const opacity = useLoop([0, 0.55, 0], { phase: ripple.phase });

  return <motion.span className={styles.ripple} style={{ scale, opacity }} />;
}

function FallingPetal({ petal }: { petal: Petal }) {
  const y = useLoop([-30, 420], { phase: petal.phase });
  const x = useLoop([0, petal.sway, 0, -petal.sway, 0], { cycles: 2, phase: petal.phase, ease: easeInOut });
  const rotate = useLoop([0, petal.spin], { phase: petal.phase });
  const opacity = useLoop([0, 0.85, 0.85, 0], { phase: petal.phase });

  return (
    <motion.span
      className={styles.petal}
      style={{ left: petal.left, width: petal.size, height: petal.size, x, y, rotate, opacity }}
    />
  );
}

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const phase = index / FLOATERS.length;
  const y = useLoop([0, -9, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, index % 2 === 0 ? 10 : -10, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y, rotate }}>
      <floater.icon size={floater.size} />
    </motion.span>
  );
}

function PeachyMoodScene() {
  const orbScale = useLoop([1, 1.06, 1], { cycles: 2, ease: easeInOut });
  const driftX = useLoop([0, 26, 0], { ease: easeInOut });
  const driftY = useLoop([0, -18, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.blobA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobB} style={{ x: driftY, y: driftX }} />
      <div className={styles.pool}>
        {RIPPLES.map((ripple) => (
          <ExpandingRipple key={ripple.id} ripple={ripple} />
        ))}
        <motion.div className={styles.orb} style={{ scale: orbScale }} />
      </div>
      {PETALS.map((petal) => (
        <FallingPetal key={petal.id} petal={petal} />
      ))}
      {FLOATERS.map((floater, index) => (
        <FloatingIcon key={floater.id} floater={floater} index={index} />
      ))}
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

const background = <PeachyMoodScene />;
const accent = <TopEdgeSweep />;

export default function PeachyMoodFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
