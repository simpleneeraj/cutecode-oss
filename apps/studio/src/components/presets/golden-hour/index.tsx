import { useId } from "react";
import { motion, easeInOut } from "motion/react";
import { LeafIcon } from "@solar-icons/react/bold-duotone/leaf";
import { StarsIcon } from "@solar-icons/react/bold-duotone/stars";
import { StarsMinimalisticIcon } from "@solar-icons/react/bold-duotone/stars-minimalistic";
import { SunIcon } from "@solar-icons/react/bold-duotone/sun";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./golden-hour.module.css";

const FLOATERS = [
  { icon: SunIcon, x: 7, y: 9, size: 22 },
  { icon: StarsIcon, x: 88, y: 8, size: 18 },
  { icon: LeafIcon, x: 82, y: 84, size: 18 },
  { icon: StarsMinimalisticIcon, x: 4, y: 52, size: 14 },
  { icon: LeafIcon, x: 20, y: 88, size: 15 },
  { icon: StarsIcon, x: 55, y: 92, size: 14 },
];

const MOTES = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 41 + 9) % 100}%`,
  size: 3 + ((index * 4) % 3),
  phase: ((index * 7) % 18) / 18,
}));

const rayPaths = Array.from({ length: 20 }, (_, index) => {
  const start = (index * 18 * Math.PI) / 180;
  const end = start + (6 * Math.PI) / 180;
  const point = (angle: number) => `${(Math.cos(angle) * 100).toFixed(2)} ${(Math.sin(angle) * 100).toFixed(2)}`;
  return `M0 0L${point(start)}L${point(end)}Z`;
});

type Floater = (typeof FLOATERS)[number];
type Mote = (typeof MOTES)[number];

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const phase = index / FLOATERS.length;
  const y = useLoop([0, -6, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, index % 2 === 0 ? 5 : -5, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y, rotate }}>
      <floater.icon size={floater.size} />
    </motion.span>
  );
}

function RisingMote({ mote }: { mote: Mote }) {
  const y = useLoop([0, -220], { phase: mote.phase });
  const opacity = useLoop([0, 0.8, 0.4, 0], { phase: mote.phase });

  return (
    <motion.span className={styles.mote} style={{ left: mote.left, width: mote.size, height: mote.size, y, opacity }} />
  );
}

function SunRays() {
  const gradientId = useId();
  const rotate = useLoop([0, 18]);

  return (
    <motion.svg className={styles.rays} viewBox="-100 -100 200 200" style={{ rotate }}>
      <defs>
        <radialGradient id={gradientId} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="100">
          <stop offset="0" stopOpacity="1" />
          <stop offset="0.62" stopOpacity="0" />
        </radialGradient>
      </defs>
      {rayPaths.map((path) => (
        <path key={path} d={path} fill={`url(#${gradientId})`} />
      ))}
    </motion.svg>
  );
}

function GoldenHourScene() {
  const glowScale = useLoop([1, 1.05, 1], { ease: easeInOut });
  const driftX = useLoop([0, 14, 0], { ease: easeInOut });
  const driftY = useLoop([0, -10, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <SunRays />
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
  const x = useLoop(["-100%", "300%", "300%"], { ease: easeInOut });

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
