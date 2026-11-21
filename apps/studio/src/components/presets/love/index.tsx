import { motion, easeInOut } from "motion/react";
import { Icon } from "@cutecode/ui/components/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./love.module.css";

const HEARTS = Array.from({ length: 12 }, (_, index) => ({
  id: `heart-${index}`,
  left: `${(index * 43 + 6) % 96}%`,
  size: 10 + ((index * 7) % 10),
  sway: index % 2 === 0 ? 14 : -14,
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 12) / 12,
}));

const TWINKLES = [
  { id: "twinkle-a", x: 12, y: 14, size: 14 },
  { id: "twinkle-b", x: 86, y: 10, size: 12 },
  { id: "twinkle-c", x: 92, y: 58, size: 10 },
  { id: "twinkle-d", x: 6, y: 64, size: 11 },
  { id: "twinkle-e", x: 48, y: 6, size: 9 },
  { id: "twinkle-f", x: 70, y: 90, size: 12 },
];

type Heart = (typeof HEARTS)[number];
type Twinkle = (typeof TWINKLES)[number];

function RisingHeart({ heart }: { heart: Heart }) {
  const options = { cycles: heart.cycles, phase: heart.phase };
  const y = useLoop(["110cqh", "-10cqh"], options);
  const x = useLoop([0, heart.sway, 0, -heart.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.7, 0.7, 0], options);
  const scale = useLoop([0.6, 1, 0.8], options);

  return (
    <motion.span className={styles.heart} style={{ left: heart.left, top: 0, x, y, opacity, scale }}>
      <Icon icon="solar:heart-bold" width={heart.size} height={heart.size} />
    </motion.span>
  );
}

function TwinkleStar({ twinkle, index }: { twinkle: Twinkle; index: number }) {
  const phase = index / TWINKLES.length;
  const opacity = useLoop([0.15, 0.8, 0.15], { cycles: 2, phase, ease: easeInOut });
  const scale = useLoop([0.8, 1.15, 0.8], { cycles: 2, phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.twinkle}
      style={{ left: `${twinkle.x}%`, top: `${twinkle.y}%`, opacity, scale }}
    >
      <Icon icon="solar:stars-minimalistic-bold" width={twinkle.size} height={twinkle.size} />
    </motion.span>
  );
}

function LoveScene() {
  const driftX = useLoop([0, 28, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });
  const glowScale = useLoop([1, 1.1, 1], { cycles: 2, ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.blobPink} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobViolet} style={{ x: driftY, y: driftX }} />
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      {TWINKLES.map((twinkle, index) => (
        <TwinkleStar key={twinkle.id} twinkle={twinkle} index={index} />
      ))}
      {HEARTS.map((heart) => (
        <RisingHeart key={heart.id} heart={heart} />
      ))}
    </div>
  );
}

function HeartbeatEdge() {
  const opacity = useLoop([0.25, 1, 0.4, 0.9, 0.25, 0.25, 0.25], { cycles: 3 });
  const scaleX = useLoop([0.4, 1, 0.7, 0.95, 0.4, 0.4, 0.4], { cycles: 3 });

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.pulse} style={{ opacity, scaleX }} />
    </div>
  );
}

const background = <LoveScene />;
const accent = <HeartbeatEdge />;

export default function LoveFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
