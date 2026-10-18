import { motion, easeInOut } from "motion/react";
import { Icon } from "@/components/ui/icon";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./strawberry-milk.module.css";

const BERRIES = [
  { x: 6, y: 8, size: 30, tilt: -12 },
  { x: 88, y: 12, size: 24, tilt: 14 },
  { x: 90, y: 58, size: 20, tilt: -10 },
  { x: 3, y: 54, size: 22, tilt: 10 },
];

const HEARTS = [
  { x: 48, y: 4, size: 14 },
  { x: 74, y: 36, size: 12 },
  { x: 18, y: 32, size: 12 },
];

const BUBBLES = Array.from({ length: 14 }, (_, index) => ({
  left: `${(index * 43 + 9) % 100}%`,
  size: 6 + ((index * 5) % 4) * 3,
  sway: index % 2 === 0 ? 8 : -8,
  phase: ((index * 5) % 14) / 14,
}));

const SEEDS = [
  [9, 12],
  [15, 12],
  [12, 15.5],
  [8.5, 16.5],
  [15.5, 16.5],
  [12, 19],
];

type Berry = (typeof BERRIES)[number];
type Heart = (typeof HEARTS)[number];
type Bubble = (typeof BUBBLES)[number];

function StrawberryShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={styles.strawberry}>
      <path
        className={styles.berryBody}
        d="M12 7.5c4.6 0 7.5 1.7 7.5 5 0 4.3-4 9-7.5 9s-7.5-4.7-7.5-9c0-3.3 2.9-5 7.5-5Z"
      />
      <path
        className={styles.berryLeaf}
        d="M12 9c-1.6-1.9-4-2.4-5.6-1.5 1.4.3 2.5 1 3.2 1.9-.9 0-2 .3-2.8 1 1.9.4 3.6.1 5.2-1.4 1.6 1.5 3.3 1.8 5.2 1.4-.8-.7-1.9-1-2.8-1 .7-.9 1.8-1.6 3.2-1.9C16 6.6 13.6 7.1 12 9Z"
      />
      <path className={styles.berryStem} d="M12 8.5c0-1.6.4-3 1.4-4" />
      {SEEDS.map(([cx, cy]) => (
        <ellipse key={`${cx}-${cy}`} className={styles.berrySeed} cx={cx} cy={cy} rx={0.55} ry={0.8} />
      ))}
    </svg>
  );
}

function FloatingBerry({ berry, index }: { berry: Berry; index: number }) {
  const phase = index / BERRIES.length;
  const y = useLoop([0, -10, 0], { phase, ease: easeInOut });
  const rotate = useLoop([berry.tilt, -berry.tilt / 2, berry.tilt], { phase, ease: easeInOut });

  return (
    <motion.span className={styles.floater} style={{ left: `${berry.x}%`, top: `${berry.y}%`, y, rotate }}>
      <StrawberryShape size={berry.size} />
    </motion.span>
  );
}

function FloatingHeart({ heart, index }: { heart: Heart; index: number }) {
  const phase = index / HEARTS.length + 0.2;
  const y = useLoop([0, -6, 0], { phase, cycles: 2, ease: easeInOut });
  const scale = useLoop([1, 1.15, 1], { phase, cycles: 2, ease: easeInOut });

  return (
    <motion.span className={styles.heart} style={{ left: `${heart.x}%`, top: `${heart.y}%`, y, scale }}>
      <Icon icon="solar:heart-bold" width={heart.size} height={heart.size} />
    </motion.span>
  );
}

function RisingBubble({ bubble }: { bubble: Bubble }) {
  const y = useLoop([0, -340], { phase: bubble.phase });
  const x = useLoop([0, bubble.sway, 0, -bubble.sway, 0], { phase: bubble.phase, cycles: 2 });
  const opacity = useLoop([0, 0.9, 0.7, 0], { phase: bubble.phase });

  return (
    <motion.span
      className={styles.bubble}
      style={{ left: bubble.left, width: bubble.size, height: bubble.size, x, y, opacity }}
    />
  );
}

function MilkWaves() {
  const backX = useLoop(["0%", "-50%"]);
  const frontX = useLoop(["-50%", "0%"], { cycles: 2 });

  return (
    <>
      <motion.svg className={styles.waveBack} viewBox="0 0 800 60" preserveAspectRatio="none" style={{ x: backX }}>
        <path d="M0 30 Q100 0 200 30 T400 30 T600 30 T800 30 V60 H0Z" />
      </motion.svg>
      <motion.svg className={styles.waveFront} viewBox="0 0 800 60" preserveAspectRatio="none" style={{ x: frontX }}>
        <path d="M0 34 Q100 10 200 34 T400 34 T600 34 T800 34 V60 H0Z" />
      </motion.svg>
    </>
  );
}

function StrawberryMilkScene() {
  const dotsOffset = useLoop([0, 28]);

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.polka}>
        <motion.div className={styles.polkaDots} style={{ x: dotsOffset, y: dotsOffset }} />
      </div>
      <div className={styles.blobPink} />
      <div className={styles.blobCream} />
      {BUBBLES.map((bubble, index) => (
        <RisingBubble key={index} bubble={bubble} />
      ))}
      {HEARTS.map((heart, index) => (
        <FloatingHeart key={index} heart={heart} index={index} />
      ))}
      {BERRIES.map((berry, index) => (
        <FloatingBerry key={index} berry={berry} index={index} />
      ))}
      <MilkWaves />
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

const background = <StrawberryMilkScene />;
const accent = <TopEdgeSweep />;

export default function StrawberryMilkFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
