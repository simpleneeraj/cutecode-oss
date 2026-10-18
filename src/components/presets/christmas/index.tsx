import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const BULB_TONES = [styles.gold, styles.berry, styles.ivory];

const BULBS = Array.from({ length: 12 }, (_, index) => {
  const swag = Math.floor(index / 6);
  const progress = ((index % 6) + 0.5) / 6;
  return {
    id: `bulb-${index}`,
    left: `${(swag + progress) * 50}%`,
    top: 6 + 80 * progress * (1 - progress),
    tone: BULB_TONES[index % BULB_TONES.length],
    cycles: 2 + (index % 2),
    phase: ((index * 5) % 12) / 12,
  };
});

const FLAKES = Array.from({ length: 18 }, (_, index) => ({
  id: `flake-${index}`,
  left: `${(index * 43 + 7) % 100}%`,
  size: 3 + ((index * 5) % 4),
  sway: index % 2 === 0 ? 14 : -14,
  cycles: 1 + (index % 3 === 0 ? 1 : 0),
  phase: ((index * 7) % 18) / 18,
}));

const SPARKLES = [
  { id: "sparkle-top-left", x: 6, y: 30, size: 14 },
  { id: "sparkle-top-right", x: 91, y: 34, size: 12 },
  { id: "sparkle-left", x: 9, y: 62, size: 10 },
  { id: "sparkle-right", x: 88, y: 66, size: 11 },
];

const PINE_TREES = [
  { x: 18, height: 52 },
  { x: 46, height: 76 },
  { x: 76, height: 44 },
  { x: 98, height: 60 },
];

function tierPath(x: number, apex: number, halfWidth: number, depth: number) {
  return `M${x} ${apex}L${x + halfWidth} ${apex + depth}H${x - halfWidth}Z`;
}

function treePath({ x, height }: (typeof PINE_TREES)[number]) {
  const top = 80 - height;
  return [0, 1, 2]
    .map((tier) => tierPath(x, top + tier * height * 0.25, height * (0.22 + tier * 0.1), height * 0.45))
    .join("");
}

const PINE_PATH = PINE_TREES.map(treePath).join("");

type Bulb = (typeof BULBS)[number];
type Flake = (typeof FLAKES)[number];
type Sparkle = (typeof SPARKLES)[number];

function StringBulb({ bulb }: { bulb: Bulb }) {
  const opacity = useLoop([1, 0.5, 1], { cycles: bulb.cycles, phase: bulb.phase, ease: easeInOut });

  return <motion.span className={cn(styles.bulb, bulb.tone)} style={{ left: bulb.left, top: bulb.top, opacity }} />;
}

function Snowflake({ flake }: { flake: Flake }) {
  const options = { cycles: flake.cycles, phase: flake.phase };
  const y = useLoop(["-6cqh", "106cqh"], options);
  const x = useLoop([0, flake.sway, 0, -flake.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={styles.flake}
      style={{ left: flake.left, width: flake.size, height: flake.size, x, y, opacity }}
    />
  );
}

function GoldSparkle({ sparkle, index }: { sparkle: Sparkle; index: number }) {
  const phase = index / SPARKLES.length;
  const scale = useLoop([0.7, 1, 0.7], { phase, ease: easeInOut });
  const opacity = useLoop([0.35, 0.9, 0.35], { phase, ease: easeInOut });

  return (
    <motion.svg
      className={styles.sparkle}
      viewBox="0 0 24 24"
      width={sparkle.size}
      height={sparkle.size}
      style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, scale, opacity }}
    >
      <path d="M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10z" />
    </motion.svg>
  );
}

function ChristmasScene() {
  const hearthScale = useLoop([1, 1.07, 1], { ease: easeInOut });
  const driftX = useLoop([0, 22, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.hearth} style={{ scale: hearthScale }} />
      <motion.div className={styles.berryBlob} style={{ x: driftX }} />
      <svg className={styles.wire} viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 6Q25 46 50 6Q75 46 100 6" vectorEffect="non-scaling-stroke" />
      </svg>
      {BULBS.map((bulb) => (
        <StringBulb key={bulb.id} bulb={bulb} />
      ))}
      <svg className={styles.pinesLeft} viewBox="0 0 120 80">
        <path d={PINE_PATH} />
      </svg>
      <svg className={styles.pinesRight} viewBox="0 0 120 80">
        <path d={PINE_PATH} />
      </svg>
      {SPARKLES.map((sparkle, index) => (
        <GoldSparkle key={sparkle.id} sparkle={sparkle} index={index} />
      ))}
      {FLAKES.map((flake) => (
        <Snowflake key={flake.id} flake={flake} />
      ))}
    </div>
  );
}

function RibbonEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <ChristmasScene />;
const accent = <RibbonEdge />;

export default function ChristmasFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
