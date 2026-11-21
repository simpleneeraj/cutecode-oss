import { motion, easeInOut, useTransform } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

function polar(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return `${(radius * Math.cos(radians)).toFixed(2)} ${(radius * Math.sin(radians)).toFixed(2)}`;
}

function raysPath(count: number, inner: number, outer: number, offset: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (360 / count) * index + offset;
    return `M${polar(inner, angle)}L${polar(outer, angle)}`;
  }).join("");
}

function dotsPath(count: number, radius: number, offset: number) {
  return Array.from({ length: count }, (_, index) => `M${polar(radius, (360 / count) * index + offset)}h0`).join("");
}

const RAY_PATH = raysPath(18, 16, 42, 0);
const TIP_PATH = dotsPath(18, 46, 0);
const INNER_PATH = `${raysPath(12, 8, 24, 15)}${dotsPath(12, 28, 15)}`;

const BURSTS = [
  { id: "burst-top-left", x: 14, y: 20, size: 30, tone: styles.gold, cycles: 1, phase: 0 },
  { id: "burst-top-right", x: 84, y: 16, size: 36, tone: styles.rose, cycles: 1, phase: 0.5 },
  { id: "burst-top", x: 52, y: 8, size: 22, tone: styles.silver, cycles: 2, phase: 0.3 },
  { id: "burst-right", x: 92, y: 64, size: 24, tone: styles.gold, cycles: 1, phase: 0.75 },
  { id: "burst-bottom-left", x: 8, y: 74, size: 26, tone: styles.silver, cycles: 1, phase: 0.25 },
];

const STARS = Array.from({ length: 18 }, (_, index) => ({
  id: `star-${index}`,
  left: `${(index * 53 + 11) % 100}%`,
  top: `${(index * 29 + 7) % 64}%`,
  size: 1 + (index % 3 === 0 ? 1 : 0),
  cycles: 2 + (index % 3),
  phase: ((index * 5) % 18) / 18,
}));

const CONFETTI_TONES = [styles.gold, styles.champagne, styles.rose, styles.silver];

const CONFETTI = Array.from({ length: 24 }, (_, index) => ({
  id: `confetti-${index}`,
  left: `${(index * 37 + 5) % 100}%`,
  width: 4 + (index % 3),
  height: 6 + ((index * 5) % 5),
  isRound: index % 5 === 0,
  sway: index % 2 === 0 ? 20 : -20,
  spin: index % 2 === 0 ? 360 : -360,
  cycles: 1 + (index % 2),
  phase: ((index * 7) % 24) / 24,
  tone: CONFETTI_TONES[index % CONFETTI_TONES.length],
}));

const STREAMERS = Array.from({ length: 6 }, (_, index) => ({
  id: `streamer-${index}`,
  left: `${(index * 41 + 9) % 100}%`,
  sway: index % 2 === 0 ? 16 : -16,
  phase: index / 6,
  tone: CONFETTI_TONES[(index + 1) % CONFETTI_TONES.length],
}));

const STREAMER_PATH = "M4 0C10 6-2 12 4 18S-2 30 4 36-2 48 4 54";

type Burst = (typeof BURSTS)[number];
type Star = (typeof STARS)[number];
type Confetti = (typeof CONFETTI)[number];
type Streamer = (typeof STREAMERS)[number];

function useBurstMotion(burst: Burst) {
  const progress = useLoop([0, 1], { cycles: burst.cycles, phase: burst.phase });
  return {
    rocketY: useTransform(progress, [0, 0.2], ["40cqh", "0cqh"], { clamp: true }),
    rocketOpacity: useTransform(progress, [0, 0.04, 0.18, 0.21], [0, 1, 1, 0]),
    flash: useTransform(progress, [0.19, 0.22, 0.36], [0, 1, 0]),
    scale: useTransform(progress, [0.2, 0.42, 0.7], [0.15, 1, 1.12]),
    droop: useTransform(progress, [0.2, 0.7], ["0cqmin", "3cqmin"]),
    rays: useTransform(progress, [0.2, 0.24, 0.5], [0, 1, 0]),
    tips: useTransform(progress, [0.2, 0.26, 0.48, 0.52, 0.56, 0.7], [0, 1, 0.6, 1, 0.5, 0]),
  };
}

function Firework({ burst }: { burst: Burst }) {
  const motionValues = useBurstMotion(burst);
  const size = `${burst.size}cqmin`;

  return (
    <div className={cn(styles.burst, burst.tone)} style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
      <motion.span className={styles.rocket} style={{ y: motionValues.rocketY, opacity: motionValues.rocketOpacity }} />
      <motion.span className={styles.flash} style={{ opacity: motionValues.flash, width: size, height: size }} />
      <motion.svg
        className={styles.sparks}
        viewBox="-50 -50 100 100"
        style={{ width: size, height: size, scale: motionValues.scale, y: motionValues.droop }}
      >
        <motion.path className={styles.rays} d={RAY_PATH} style={{ opacity: motionValues.rays }} />
        <motion.path className={styles.inner} d={INNER_PATH} style={{ opacity: motionValues.rays }} />
        <motion.path className={styles.tips} d={TIP_PATH} style={{ opacity: motionValues.tips }} />
      </motion.svg>
    </div>
  );
}

function Twinkle({ star }: { star: Star }) {
  const opacity = useLoop([0.2, 0.9, 0.2], { cycles: star.cycles, phase: star.phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.star}
      style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity }}
    />
  );
}

function ConfettiPiece({ piece }: { piece: Confetti }) {
  const options = { cycles: piece.cycles, phase: piece.phase };
  const y = useLoop(["-8cqh", "108cqh"], options);
  const x = useLoop([0, piece.sway, 0, -piece.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([0, piece.spin], options);
  const scaleX = useLoop([1, 0.2, 1], { cycles: piece.cycles * 4, phase: piece.phase, ease: easeInOut });
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={cn(styles.confetti, piece.tone, piece.isRound && styles.round)}
      style={{ left: piece.left, width: piece.width, height: piece.height, x, y, rotate, scaleX, opacity }}
    />
  );
}

function StreamerRibbon({ streamer }: { streamer: Streamer }) {
  const options = { phase: streamer.phase };
  const y = useLoop(["-16cqh", "112cqh"], options);
  const x = useLoop([0, streamer.sway, 0, -streamer.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([-18, 18, -18], { cycles: 2, phase: streamer.phase, ease: easeInOut });
  const opacity = useLoop([0, 0.85, 0.85, 0], options);

  return (
    <motion.svg
      className={cn(styles.streamer, streamer.tone)}
      viewBox="-4 -2 16 58"
      style={{ left: streamer.left, x, y, rotate, opacity }}
    >
      <path d={STREAMER_PATH} />
    </motion.svg>
  );
}

function NewYearScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.75, 1, 0.75], { cycles: 2, ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <div className={styles.haze} />
      {STARS.map((star) => (
        <Twinkle key={star.id} star={star} />
      ))}
      {BURSTS.map((burst) => (
        <Firework key={burst.id} burst={burst} />
      ))}
      {STREAMERS.map((streamer) => (
        <StreamerRibbon key={streamer.id} streamer={streamer} />
      ))}
      {CONFETTI.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
}

function GildedEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <NewYearScene />;
const accent = <GildedEdge />;

export default function NewYearFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
