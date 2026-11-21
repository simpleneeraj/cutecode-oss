import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./starry-night.module.css";

const STARS = Array.from({ length: 40 }, (_, index) => ({
  left: `${(index * 37 + 13) % 100}%`,
  top: `${(index * 29 + 7) % 100}%`,
  size: 1 + ((index * 3) % 3),
  cycles: 1 + (index % 3),
  phase: ((index * 11) % 40) / 40,
}));

const SHOOTING_STARS = [
  { top: "12%", left: "8%", phase: 0 },
  { top: "34%", left: "46%", phase: 0.5 },
];

const CONSTELLATION = [
  [8, 34],
  [26, 22],
  [44, 30],
  [58, 12],
  [78, 20],
];

const CONSTELLATION_PATH = CONSTELLATION.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");

type Star = (typeof STARS)[number];
type ShootingStar = (typeof SHOOTING_STARS)[number];

function TwinklingStar({ star }: { star: Star }) {
  const options = { cycles: star.cycles, phase: star.phase, ease: easeInOut };
  const opacity = useLoop([0.15, 1, 0.15], options);
  const scale = useLoop([0.8, 1.25, 0.8], options);

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity, scale }}
    />
  );
}

function Meteor({ meteor }: { meteor: ShootingStar }) {
  const x = useLoop([0, 130, 260, 260, 260, 260, 0], { phase: meteor.phase });
  const opacity = useLoop([0, 1, 0, 0, 0, 0, 0], { phase: meteor.phase });

  return <motion.div className={styles.meteor} style={{ top: meteor.top, left: meteor.left, x, opacity }} />;
}

function Constellation() {
  const pathLength = useLoop([0, 1, 1, 0], { ease: easeInOut });

  return (
    <svg className={styles.constellation} viewBox="0 0 86 40" fill="none">
      <motion.path d={CONSTELLATION_PATH} style={{ pathLength }} />
      {CONSTELLATION.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} />
      ))}
    </svg>
  );
}

function Moon() {
  const y = useLoop([0, -6, 0], { ease: easeInOut });
  const glowScale = useLoop([1, 1.12, 1], { ease: easeInOut });

  return (
    <motion.div className={styles.moon} style={{ y }}>
      <motion.span className={styles.moonGlow} style={{ scale: glowScale }} />
      <Icon icon="solar:moon-stars-bold-duotone" className="size-6.5" />
    </motion.div>
  );
}

function StarryNightScene() {
  const driftX = useLoop([0, 30, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.nebulaA} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.nebulaB} style={{ x: driftY, y: driftX }} />
      {STARS.map((star, index) => (
        <TwinklingStar key={index} star={star} />
      ))}
      {SHOOTING_STARS.map((meteor, index) => (
        <Meteor key={index} meteor={meteor} />
      ))}
      <Constellation />
      <Moon />
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

const background = <StarryNightScene />;
const accent = <TopEdgeSweep />;

export default function StarryNightFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
