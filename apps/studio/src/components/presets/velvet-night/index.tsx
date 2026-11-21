import { motion, easeInOut } from "motion/react";
import { StarsIcon } from "@solar-icons/react/bold-duotone/stars";
import { StarsMinimalisticIcon } from "@solar-icons/react/bold-duotone/stars-minimalistic";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./velvet-night.module.css";

const STARS = Array.from({ length: 24 }, (_, index) => ({
  id: `star-${index}`,
  left: `${(index * 37 + 13) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  size: 1.5 + (index % 3),
  cycles: 1 + (index % 3),
  phase: ((index * 11) % 24) / 24,
}));

const FLOATERS = [
  { id: "stars-left", icon: StarsMinimalisticIcon, x: 6, y: 10, size: 18 },
  { id: "stars-top", icon: StarsIcon, x: 48, y: 4, size: 14 },
  { id: "stars-right", icon: StarsMinimalisticIcon, x: 92, y: 52, size: 14 },
  { id: "stars-bottom", icon: StarsIcon, x: 12, y: 86, size: 16 },
];

type Star = (typeof STARS)[number];
type Floater = (typeof FLOATERS)[number];

function TwinklingStar({ star }: { star: Star }) {
  const opacity = useLoop([0.15, 0.9, 0.15], { cycles: star.cycles, phase: star.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity }}
    />
  );
}

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const phase = index / FLOATERS.length;
  const y = useLoop([0, -8, 0], { phase, ease: easeInOut });
  const opacity = useLoop([0.25, 0.5, 0.25], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y, opacity }}>
      <floater.icon size={floater.size} />
    </motion.span>
  );
}

function Moon() {
  const y = useLoop([0, -10, 0], { ease: easeInOut });
  const glow = useLoop([0.75, 1, 0.75], { cycles: 2, ease: easeInOut });

  return (
    <motion.div className={styles.moon} style={{ y }}>
      <motion.div className={styles.moonHalo} style={{ opacity: glow }} />
      <div className={styles.moonDisc} />
    </motion.div>
  );
}

function VelvetNightScene() {
  const foldX = useLoop([0, 180]);
  const driftX = useLoop([0, 30, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.folds} style={{ x: foldX }} />
      <motion.div className={styles.blobA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobB} style={{ x: driftY, y: driftX }} />
      {STARS.map((star) => (
        <TwinklingStar key={star.id} star={star} />
      ))}
      <Moon />
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

const background = <VelvetNightScene />;
const accent = <TopEdgeSweep />;

export default function VelvetNightFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
