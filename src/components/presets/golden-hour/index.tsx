import { motion, easeInOut } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./golden-hour.module.css";

const FLOATERS = [
  { icon: "solar:sun-bold-duotone", x: 7, y: 9, size: 22 },
  { icon: "solar:stars-bold-duotone", x: 88, y: 8, size: 18 },
  { icon: "solar:leaf-bold-duotone", x: 82, y: 84, size: 18 },
  { icon: "solar:stars-minimalistic-bold-duotone", x: 4, y: 52, size: 14 },
  { icon: "solar:leaf-bold-duotone", x: 20, y: 88, size: 15 },
  { icon: "solar:stars-bold-duotone", x: 55, y: 92, size: 14 },
];

const MOTES = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 41 + 9) % 100}%`,
  size: 3 + ((index * 4) % 3),
  cycles: 1 + (index % 2),
  phase: ((index * 7) % 18) / 18,
}));

type Floater = (typeof FLOATERS)[number];
type Mote = (typeof MOTES)[number];

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const phase = index / FLOATERS.length;
  const y = useLoop([0, -10, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, index % 2 === 0 ? 8 : -8, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y, rotate }}>
      <Icon icon={floater.icon} width={floater.size} height={floater.size} />
    </motion.span>
  );
}

function RisingMote({ mote }: { mote: Mote }) {
  const y = useLoop([0, -340], { cycles: mote.cycles, phase: mote.phase });
  const opacity = useLoop([0, 0.8, 0.4, 0], { cycles: mote.cycles, phase: mote.phase });

  return (
    <motion.span className={styles.mote} style={{ left: mote.left, width: mote.size, height: mote.size, y, opacity }} />
  );
}

function GoldenHourScene() {
  const rotate = useLoop([0, 360]);
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });
  const driftX = useLoop([0, 24, 0], { ease: easeInOut });
  const driftY = useLoop([0, -18, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.rays} style={{ rotate }} />
      <motion.div className={styles.sun} style={{ scale: glowScale }} />
      <motion.div className={styles.blobA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobB} style={{ x: driftY, y: driftX }} />
      {MOTES.map((mote, index) => (
        <RisingMote key={index} mote={mote} />
      ))}
      {FLOATERS.map((floater, index) => (
        <FloatingIcon key={index} floater={floater} index={index} />
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

const background = <GoldenHourScene />;
const accent = <TopEdgeSweep />;

export default function GoldenHourFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
