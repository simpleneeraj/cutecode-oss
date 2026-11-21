import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./aurora-nights.module.css";

const RIBBONS = [
  { className: styles.ribbonGreen, distance: 60 },
  { className: styles.ribbonTeal, distance: -48 },
  { className: styles.ribbonViolet, distance: 40 },
];

const STARS = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37 + 5) % 100}%`,
  top: `${(index * 23 + 3) % 48}%`,
  size: 1 + (index % 2),
  cycles: 1 + (index % 3),
  phase: ((index * 5) % 22) / 22,
}));

const FLAKES = Array.from({ length: 16 }, (_, index) => ({
  left: `${(index * 41 + 9) % 100}%`,
  size: 2 + ((index * 3) % 3),
  sway: index % 2 === 0 ? 10 : -10,
  phase: ((index * 7) % 16) / 16,
}));

const FLOATERS = [
  { icon: "solar:moon-stars-bold-duotone", x: 88, y: 9, size: 22 },
  { icon: "solar:stars-bold-duotone", x: 6, y: 14, size: 16 },
  { icon: "solar:stars-minimalistic-bold-duotone", x: 70, y: 30, size: 12 },
];

type Floater = (typeof FLOATERS)[number];
type Ribbon = (typeof RIBBONS)[number];
type Star = (typeof STARS)[number];
type Flake = (typeof FLAKES)[number];

function AuroraRibbon({ ribbon, index }: { ribbon: Ribbon; index: number }) {
  const phase = index / RIBBONS.length;
  const x = useLoop([0, ribbon.distance, 0], { phase, ease: easeInOut });
  const scaleY = useLoop([1, 1.25, 1], { phase, cycles: 2, ease: easeInOut });
  const opacity = useLoop([0.55, 0.95, 0.55], { phase, ease: easeInOut });

  return <motion.div className={ribbon.className} style={{ x, scaleY, opacity }} />;
}

function TwinklingStar({ star }: { star: Star }) {
  const opacity = useLoop([0.2, 1, 0.2], { cycles: star.cycles, phase: star.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity }}
    />
  );
}

function FallingFlake({ flake }: { flake: Flake }) {
  const y = useLoop([0, 380], { phase: flake.phase });
  const x = useLoop([0, flake.sway, 0, -flake.sway, 0], { phase: flake.phase, cycles: 2 });
  const opacity = useLoop([0, 0.85, 0.85, 0], { phase: flake.phase });

  return (
    <motion.span
      className={styles.flake}
      style={{ left: flake.left, width: flake.size, height: flake.size, x, y, opacity }}
    />
  );
}

function FloatingIcon({ floater, index }: { floater: Floater; index: number }) {
  const y = useLoop([0, -8, 0], { phase: index / FLOATERS.length, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${floater.x}%`, top: `${floater.y}%`, y }}>
      <Icon icon={floater.icon} width={floater.size} height={floater.size} />
    </motion.span>
  );
}

function AuroraNightsScene() {
  return (
    <div className={styles.layer} aria-hidden>
      {RIBBONS.map((ribbon, index) => (
        <AuroraRibbon key={index} ribbon={ribbon} index={index} />
      ))}
      {STARS.map((star, index) => (
        <TwinklingStar key={index} star={star} />
      ))}
      {FLOATERS.map((floater, index) => (
        <FloatingIcon key={index} floater={floater} index={index} />
      ))}
      <div className={styles.ridgeBack} />
      <div className={styles.ridgeFront} />
      {FLAKES.map((flake, index) => (
        <FallingFlake key={index} flake={flake} />
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

const background = <AuroraNightsScene />;
const accent = <TopEdgeSweep />;

export default function AuroraNightsFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
