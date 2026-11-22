import type { ReactNode } from "react";
import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const BULB_TONES = [styles.gold, styles.ivory];

const BULBS = Array.from({ length: 14 }, (_, index) => {
  const swag = Math.floor(index / 7);
  const progress = ((index % 7) + 0.5) / 7;
  return {
    id: `bulb-${index}`,
    left: `${(swag + progress) * 50}%`,
    top: 4 + 64 * progress * (1 - progress),
    tone: BULB_TONES[index % BULB_TONES.length],
    cycles: 2 + (index % 2),
    phase: ((index * 5) % 14) / 14,
  };
});

const FLAKES = Array.from({ length: 16 }, (_, index) => ({
  id: `flake-${index}`,
  left: `${(index * 43 + 7) % 100}%`,
  size: 2 + ((index * 5) % 4),
  sway: index % 2 === 0 ? 12 : -12,
  cycles: 1 + (index % 3 === 0 ? 1 : 0),
  phase: ((index * 7) % 16) / 16,
}));

const SPARKLES = [
  { id: "sparkle-left", x: 8, y: 34, size: 10 },
  { id: "sparkle-right", x: 70, y: 18, size: 12 },
  { id: "sparkle-low", x: 90, y: 72, size: 9 },
];

const BRANCHES = [
  { id: "branch-low", angle: 14, length: 92 },
  { id: "branch-mid", angle: 40, length: 104 },
  { id: "branch-high", angle: 68, length: 84 },
];

const CORNERS = [styles.topLeft, styles.bottomLeft, styles.bottomRight];

function needlePath(length: number) {
  return Array.from({ length: Math.floor((length - 6) / 4) }, (_, index) => {
    const x = 6 + index * 4;
    const reach = 12 * (1 - x / (length * 1.3));
    return `M${x} 0l${reach * 0.6} ${-reach}M${x} 0l${reach * 0.6} ${reach}`;
  }).join("");
}

function starPath(outer: number, inner: number) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * index - Math.PI / 2;
    return `${(12 + radius * Math.cos(angle)).toFixed(2)} ${(12 + radius * Math.sin(angle)).toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

const STAR_PATH = starPath(11, 4.6);
const SPARKLE_PATH = "M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10z";

type Bulb = (typeof BULBS)[number];
type Flake = (typeof FLAKES)[number];
type Sparkle = (typeof SPARKLES)[number];

function StringBulb({ bulb }: { bulb: Bulb }) {
  const opacity = useLoop([1, 0.55, 1], { cycles: bulb.cycles, phase: bulb.phase, ease: easeInOut });

  return <motion.span className={cn(styles.bulb, bulb.tone)} style={{ left: bulb.left, top: bulb.top, opacity }} />;
}

function Snowflake({ flake }: { flake: Flake }) {
  const options = { cycles: flake.cycles, phase: flake.phase };
  const y = useLoop(["-6cqh", "106cqh"], options);
  const x = useLoop([0, flake.sway, 0, -flake.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 0.8, 0.8, 0], options);

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
  const opacity = useLoop([0.3, 0.85, 0.3], { phase, ease: easeInOut });

  return (
    <motion.svg
      className={styles.sparkle}
      viewBox="0 0 24 24"
      width={sparkle.size}
      height={sparkle.size}
      style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, scale, opacity }}
    >
      <path d={SPARKLE_PATH} />
    </motion.svg>
  );
}

function PineCorner({ corner, index }: { corner: string; index: number }) {
  const rotate = useLoop([-1.5, 1.5, -1.5], { phase: index / CORNERS.length, ease: easeInOut });

  return (
    <div className={cn(styles.corner, corner)}>
      <motion.svg className={styles.branches} viewBox="0 0 120 120" style={{ rotate }}>
        {BRANCHES.map((branch) => (
          <g key={branch.id} transform={`rotate(${branch.angle})`}>
            <path className={styles.stem} d={`M0 0H${branch.length}`} />
            <path className={styles.needles} d={needlePath(branch.length)} />
          </g>
        ))}
      </motion.svg>
    </div>
  );
}

type PendulumProps = { x: number; drop: number; phase: number; children: ReactNode };

function Pendulum({ x, drop, phase, children }: PendulumProps) {
  const rotate = useLoop([-4, 4, -4], { phase, ease: easeInOut });

  return (
    <motion.div className={styles.pendulum} style={{ left: `${x}%`, rotate }}>
      <span className={styles.thread} style={{ height: `${drop}cqh` }} />
      {children}
    </motion.div>
  );
}

function HangingDecor() {
  return (
    <>
      <Pendulum x={80} drop={10} phase={0}>
        <span className={cn(styles.bauble, styles.goldBauble)} />
      </Pendulum>
      <Pendulum x={88} drop={4} phase={0.33}>
        <svg className={styles.star} viewBox="0 0 24 24">
          <path d={STAR_PATH} />
        </svg>
      </Pendulum>
      <Pendulum x={95} drop={16} phase={0.66}>
        <span className={cn(styles.bauble, styles.goldBauble, styles.small)} />
      </Pendulum>
    </>
  );
}

function ChristmasScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <div className={styles.frost} />
      <svg className={styles.wire} viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d="M0 4Q25 36 50 4Q75 36 100 4" vectorEffect="non-scaling-stroke" />
      </svg>
      {BULBS.map((bulb) => (
        <StringBulb key={bulb.id} bulb={bulb} />
      ))}
      {CORNERS.map((corner, index) => (
        <PineCorner key={corner} corner={corner} index={index} />
      ))}
      <HangingDecor />
      <span className={cn(styles.bauble, styles.pearlBauble, styles.restingLarge)} />
      <span className={cn(styles.bauble, styles.goldBauble, styles.restingSmall)} />
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
