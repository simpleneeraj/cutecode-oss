import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const FLOATERS = [
  { icon: "solar:sunset-bold-duotone", x: 6, y: 8, size: 22 },
  { icon: "solar:stars-minimalistic-bold-duotone", x: 90, y: 10, size: 14 },
  { icon: "solar:stars-bold-duotone", x: 84, y: 46, size: 16 },
  { icon: "solar:leaf-bold-duotone", x: 4, y: 58, size: 15 },
];

const CLOUDS = [
  { className: styles.cloudA, distance: 28 },
  { className: styles.cloudB, distance: -22 },
  { className: styles.cloudC, distance: 18 },
];

const EMBERS = Array.from({ length: 16 }, (_, index) => ({
  left: `${(index * 37 + 13) % 100}%`,
  size: 3 + ((index * 5) % 3),
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 16) / 16,
  drift: index % 2 === 0 ? 14 : -14,
}));

type Floater = (typeof FLOATERS)[number];
type Cloud = (typeof CLOUDS)[number];
type Ember = (typeof EMBERS)[number];

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const phase = index / FLOATERS.length;
  const y = useLoop([0, -9, 0], { phase, ease: easeInOut });
  const rotate = useLoop([0, index % 2 === 0 ? 7 : -7, 0], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y, rotate }}>
      <Icon icon={floater.icon} width={floater.size} height={floater.size} />
    </motion.span>
  );
}

function DriftingCloud({ cloud, index }: { cloud: Cloud; index: number }) {
  const x = useLoop([0, cloud.distance, 0], { phase: index / CLOUDS.length, ease: easeInOut });

  return <motion.div className={cloud.className} style={{ x }} />;
}

function RisingEmber({ ember }: { ember: Ember }) {
  const options = { cycles: ember.cycles, phase: ember.phase };
  const y = useLoop([0, -320], options);
  const x = useLoop([0, ember.drift, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.9, 0.5, 0], options);

  return (
    <motion.span
      className={styles.ember}
      style={{ left: ember.left, width: ember.size, height: ember.size, x, y, opacity }}
    />
  );
}

function SunsetChillScene() {
  const sunY = useLoop([0, 10, 0], { ease: easeInOut });
  const glowScale = useLoop([1, 1.1, 1], { ease: easeInOut });
  const hillX = useLoop([0, -16, 0], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <motion.div className={styles.sun} style={{ y: sunY }} />
      {CLOUDS.map((cloud, index) => (
        <DriftingCloud key={index} cloud={cloud} index={index} />
      ))}
      <motion.div className={styles.hillBack} style={{ x: hillX }} />
      <div className={styles.hillFront} />
      {EMBERS.map((ember, index) => (
        <RisingEmber key={index} ember={ember} />
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

const background = <SunsetChillScene />;
const accent = <TopEdgeSweep />;

export default function SunsetChillFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
