import type { ReactNode } from "react";
import { motion, easeInOut } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const FLOWER_TONES = [styles.saffron, styles.gold];
const FLOWERS_PER_SWAG = 13;

const FLOWERS = Array.from({ length: FLOWERS_PER_SWAG * 2 }, (_, index) => {
  const swag = Math.floor(index / FLOWERS_PER_SWAG);
  const progress = ((index % FLOWERS_PER_SWAG) + 0.5) / FLOWERS_PER_SWAG;
  return {
    id: `flower-${index}`,
    left: `${(swag + progress) * 50}%`,
    top: 112 * progress * (1 - progress),
    tone: FLOWER_TONES[index % FLOWER_TONES.length],
  };
});

const STRAND = Array.from({ length: 4 }, (_, index) => ({
  id: `strand-${index}`,
  tone: FLOWER_TONES[index % FLOWER_TONES.length],
}));

const LANTERNS = [
  { id: "lantern-left", x: 14, drop: 6, phase: 0, tone: styles.magenta },
  { id: "lantern-right", x: 86, drop: 12, phase: 0.5, tone: styles.amber },
];

const BURSTS = [
  { id: "burst-left", x: 28, y: 26, size: 16, phase: 0, tone: styles.goldBurst },
  { id: "burst-right", x: 72, y: 22, size: 20, phase: 0.36, tone: styles.magentaBurst },
  { id: "burst-top", x: 50, y: 12, size: 12, phase: 0.68, tone: styles.saffronBurst },
];

const RAY_ANGLES = Array.from({ length: 12 }, (_, index) => index * 30);
const PETAL_ANGLES = Array.from({ length: 8 }, (_, index) => index * 45);
const DOT_ANGLES = Array.from({ length: 16 }, (_, index) => index * 22.5);
const RANGOLIS = [styles.rangoliLeft, styles.rangoliRight];

const DIYAS = Array.from({ length: 7 }, (_, index) => ({
  id: `diya-${index}`,
  left: `${8 + index * 14}%`,
  phase: ((index * 3) % 7) / 7,
}));

const EMBERS = Array.from({ length: 14 }, (_, index) => ({
  id: `ember-${index}`,
  left: `${(index * 37 + 11) % 100}%`,
  size: 2 + (index % 2),
  sway: index % 2 === 0 ? 8 : -8,
  cycles: 1 + (index % 2),
  phase: ((index * 5) % 14) / 14,
}));

const TWINKLES = [
  { id: "twinkle-left", x: 6, y: 30, size: 10 },
  { id: "twinkle-center", x: 40, y: 34, size: 8 },
  { id: "twinkle-right", x: 94, y: 34, size: 12 },
  { id: "twinkle-low", x: 60, y: 76, size: 8 },
];

const SPARKLE_PATH = "M12 2c.8 6 4 9.2 10 10-6 .8-9.2 4-10 10-.8-6-4-9.2-10-10 6-.8 9.2-4 10-10z";

type Lantern = (typeof LANTERNS)[number];
type Burst = (typeof BURSTS)[number];
type Diya = (typeof DIYAS)[number];
type Ember = (typeof EMBERS)[number];
type Twinkle = (typeof TWINKLES)[number];

type PendulumProps = { x: number; phase: number; children: ReactNode };

function Pendulum({ x, phase, children }: PendulumProps) {
  const rotate = useLoop([-4, 4, -4], { phase, ease: easeInOut });

  return (
    <motion.div className={styles.pendulum} style={{ left: `${x}%`, rotate }}>
      {children}
    </motion.div>
  );
}

function Garland() {
  const scaleY = useLoop([1, 1.04, 1], { ease: easeInOut });

  return (
    <motion.div className={styles.garland} style={{ scaleY }}>
      <svg className={styles.cord} viewBox="0 0 100 64" preserveAspectRatio="none">
        <path d="M0 0Q25 56 50 0Q75 56 100 0" vectorEffect="non-scaling-stroke" />
      </svg>
      {FLOWERS.map((flower) => (
        <span key={flower.id} className={cn(styles.flower, flower.tone)} style={{ left: flower.left, top: flower.top }} />
      ))}
    </motion.div>
  );
}

function GarlandStrand() {
  return (
    <Pendulum x={50} phase={0.25}>
      {STRAND.map((flower) => (
        <span key={flower.id} className={cn(styles.flower, styles.strandFlower, flower.tone)} />
      ))}
      <span className={styles.bead} />
    </Pendulum>
  );
}

function HangingLantern({ lantern }: { lantern: Lantern }) {
  const opacity = useLoop([0.6, 1, 0.75, 1, 0.6], { cycles: 2, phase: lantern.phase, ease: easeInOut });

  return (
    <Pendulum x={lantern.x} phase={lantern.phase}>
      <span className={styles.thread} style={{ height: `${lantern.drop}cqh` }} />
      <span className={styles.cap} />
      <span className={cn(styles.lantern, lantern.tone)}>
        <motion.span className={styles.lanternGlow} style={{ opacity }} />
      </span>
      <span className={styles.cap} />
      <span className={styles.tassel} />
    </Pendulum>
  );
}

function Firework({ burst }: { burst: Burst }) {
  const scale = useLoop([0.2, 1, 1.12, 1.12], { phase: burst.phase });
  const opacity = useLoop([0, 1, 0, 0], { phase: burst.phase });
  const size = `${burst.size}cqmin`;

  return (
    <motion.svg
      className={cn(styles.burst, burst.tone)}
      viewBox="-50 -50 100 100"
      style={{ left: `${burst.x}%`, top: `${burst.y}%`, width: size, height: size, x: "-50%", y: "-50%", scale, opacity }}
    >
      {RAY_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path className={styles.ray} d="M0 -12V-34" />
          <circle className={styles.burstTip} cy="-41" r="2.6" />
        </g>
      ))}
    </motion.svg>
  );
}

function SpinningRangoli({ corner, index }: { corner: string; index: number }) {
  const direction = index % 2 === 0 ? 1 : -1;
  const rotate = useLoop([0, 22.5 * direction, 0], { ease: easeInOut });

  return (
    <motion.div className={cn(styles.rangoli, corner)} style={{ rotate }}>
      <svg viewBox="-50 -50 100 100" className={styles.rangoliArt}>
        <circle className={styles.rangoliRing} r="46" />
        {PETAL_ANGLES.map((angle) => (
          <ellipse key={`outer-${angle}`} className={styles.petalOuter} cy="-28" rx="7" ry="14" transform={`rotate(${angle})`} />
        ))}
        {PETAL_ANGLES.map((angle) => (
          <ellipse key={`inner-${angle}`} className={styles.petalInner} cy="-15" rx="5" ry="9" transform={`rotate(${angle + 22.5})`} />
        ))}
        {DOT_ANGLES.map((angle) => (
          <circle key={`dot-${angle}`} className={styles.rangoliDot} cy="-41" r="2" transform={`rotate(${angle})`} />
        ))}
        <circle className={styles.rangoliCore} r="7" />
        <circle className={styles.rangoliHeart} r="3" />
      </svg>
    </motion.div>
  );
}

function DiyaLamp({ diya }: { diya: Diya }) {
  const options = { cycles: 3, phase: diya.phase, ease: easeInOut };
  const scaleY = useLoop([1, 1.16, 0.9, 1.08, 1], options);
  const rotate = useLoop([0, 4, -3, 2, 0], options);
  const opacity = useLoop([0.7, 1, 0.8, 0.95, 0.7], options);

  return (
    <div className={styles.diya} style={{ left: diya.left }}>
      <motion.span className={styles.diyaGlow} style={{ opacity }} />
      <motion.span className={styles.flame} style={{ scaleY, rotate }} />
      <svg className={styles.bowl} viewBox="0 0 40 16">
        <path d="M1 3c7 3 31 3 38 0-2 8-10 12-19 12S3 11 1 3z" />
        <path className={styles.rim} d="M1 3c7 3 31 3 38 0" />
        <path className={styles.bowlDots} d="M12 10h0M20 11h0M28 10h0" />
      </svg>
    </div>
  );
}

function RisingEmber({ ember }: { ember: Ember }) {
  const options = { cycles: ember.cycles, phase: ember.phase };
  const y = useLoop(["0cqh", "-64cqh"], options);
  const x = useLoop([0, ember.sway, 0], { ...options, ease: easeInOut });
  const opacity = useLoop([0, 1, 0.6, 0], options);

  return (
    <motion.span
      className={styles.ember}
      style={{ left: ember.left, width: ember.size, height: ember.size, x, y, opacity }}
    />
  );
}

function GoldTwinkle({ twinkle, index }: { twinkle: Twinkle; index: number }) {
  const phase = index / TWINKLES.length;
  const scale = useLoop([0.6, 1, 0.6], { phase, ease: easeInOut });
  const opacity = useLoop([0.3, 0.9, 0.3], { phase, ease: easeInOut });

  return (
    <motion.svg
      className={styles.twinkle}
      viewBox="0 0 24 24"
      width={twinkle.size}
      height={twinkle.size}
      style={{ left: `${twinkle.x}%`, top: `${twinkle.y}%`, scale, opacity }}
    >
      <path d={SPARKLE_PATH} />
    </motion.svg>
  );
}

function DiwaliScene() {
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.haze} />
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      {BURSTS.map((burst) => (
        <Firework key={burst.id} burst={burst} />
      ))}
      {RANGOLIS.map((corner, index) => (
        <SpinningRangoli key={corner} corner={corner} index={index} />
      ))}
      {LANTERNS.map((lantern) => (
        <HangingLantern key={lantern.id} lantern={lantern} />
      ))}
      <Garland />
      <GarlandStrand />
      {TWINKLES.map((twinkle, index) => (
        <GoldTwinkle key={twinkle.id} twinkle={twinkle} index={index} />
      ))}
      {EMBERS.map((ember) => (
        <RisingEmber key={ember.id} ember={ember} />
      ))}
      {DIYAS.map((diya) => (
        <DiyaLamp key={diya.id} diya={diya} />
      ))}
    </div>
  );
}

function MarigoldEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <DiwaliScene />;
const accent = <MarigoldEdge />;

export default function DiwaliFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
