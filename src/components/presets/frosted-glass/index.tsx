import { motion, easeInOut } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./frosted-glass.module.css";

const ORBS = [
  { id: "indigo", className: styles.orbIndigo, dx: 36, dy: 22, phase: 0 },
  { id: "violet", className: styles.orbViolet, dx: -30, dy: -26, phase: 0.25 },
  { id: "sky", className: styles.orbSky, dx: 26, dy: -32, phase: 0.5 },
  { id: "rose", className: styles.orbRose, dx: -24, dy: 20, phase: 0.75 },
];

const GLINTS = [
  { id: "top-left", x: 6, y: 10, size: 14, phase: 0 },
  { id: "top-right", x: 90, y: 7, size: 18, phase: 0.3 },
  { id: "mid-left", x: 3, y: 56, size: 12, phase: 0.55 },
  { id: "bottom-right", x: 86, y: 86, size: 16, phase: 0.8 },
  { id: "bottom-left", x: 18, y: 90, size: 12, phase: 0.15 },
];

type Orb = (typeof ORBS)[number];
type Glint = (typeof GLINTS)[number];

function DriftingOrb({ orb }: { orb: Orb }) {
  const x = useLoop([0, orb.dx, 0], { phase: orb.phase, ease: easeInOut });
  const y = useLoop([0, orb.dy, 0], { phase: orb.phase, ease: easeInOut });
  const scale = useLoop([1, 1.12, 1], { cycles: 2, phase: orb.phase, ease: easeInOut });

  return <motion.div className={orb.className} style={{ x, y, scale }} />;
}

function TwinklingGlint({ glint }: { glint: Glint }) {
  const opacity = useLoop([0.15, 0.7, 0.15], { cycles: 2, phase: glint.phase, ease: easeInOut });
  const scale = useLoop([0.8, 1.1, 0.8], { cycles: 2, phase: glint.phase, ease: easeInOut });
  const rotate = useLoop([0, 90]);

  return (
    <motion.span
      className={styles.glint}
      style={{ left: `${glint.x}%`, top: `${glint.y}%`, opacity, scale, rotate }}
    >
      <Icon icon="solar:stars-minimalistic-bold-duotone" width={glint.size} height={glint.size} />
    </motion.span>
  );
}

function FrostedGlassScene() {
  return (
    <div className={styles.layer} aria-hidden>
      {ORBS.map((orb) => (
        <DriftingOrb key={orb.id} orb={orb} />
      ))}
      {GLINTS.map((glint) => (
        <TwinklingGlint key={glint.id} glint={glint} />
      ))}
    </div>
  );
}

function FrostPane() {
  const x = useLoop(["-60%", "260%", "260%"], { ease: easeInOut });

  return (
    <div className={styles.frost} aria-hidden>
      {ORBS.map((orb) => (
        <DriftingOrb key={orb.id} orb={orb} />
      ))}
      <div className={styles.milk} />
      <motion.div className={styles.sheen} style={{ x }} />
    </div>
  );
}

const background = <FrostedGlassScene />;
const accent = <FrostPane />;

export default function FrostedGlassFrame(props: BaseFrameProps) {
  return (
    <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />
  );
}
