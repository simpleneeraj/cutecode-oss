import { motion, easeInOut, easeOut } from "motion/react";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const RAYS = Array.from({ length: 16 }, (_, index) => ({
  id: `ray-${index}`,
  angle: index * 22.5,
  isLong: index % 2 === 0,
}));

const BURSTS = [
  { id: "burst-top-left", x: 16, y: 18, size: 150, cycles: 1, phase: 0 },
  { id: "burst-top-right", x: 82, y: 14, size: 180, cycles: 1, phase: 0.42 },
  { id: "burst-right", x: 92, y: 62, size: 120, cycles: 2, phase: 0.18 },
  { id: "burst-bottom-left", x: 8, y: 78, size: 130, cycles: 1, phase: 0.7 },
  { id: "burst-top", x: 50, y: 6, size: 110, cycles: 2, phase: 0.62 },
];

const CONFETTI_TONES = [styles.gold, styles.champagne, styles.ivory];

const CONFETTI = Array.from({ length: 18 }, (_, index) => ({
  id: `confetti-${index}`,
  left: `${(index * 37 + 5) % 100}%`,
  width: 4 + (index % 3),
  height: 8 + ((index * 5) % 5),
  sway: index % 2 === 0 ? 22 : -22,
  spin: index % 2 === 0 ? 360 : -360,
  cycles: 1 + (index % 2),
  phase: ((index * 7) % 18) / 18,
  tone: CONFETTI_TONES[index % CONFETTI_TONES.length],
}));

type Burst = (typeof BURSTS)[number];
type Confetti = (typeof CONFETTI)[number];

type FireworkProps = {
  burst: Burst;
};

function Firework({ burst }: FireworkProps) {
  const options = { cycles: burst.cycles, phase: burst.phase, ease: easeOut };
  const scale = useLoop([0.1, 1, 1.08, 1.08, 0.1], options);
  const opacity = useLoop([0, 1, 0, 0, 0], options);

  return (
    <motion.span
      className={styles.burst}
      style={{
        left: `${burst.x}%`,
        top: `${burst.y}%`,
        width: burst.size,
        height: burst.size,
        marginLeft: -burst.size / 2,
        marginTop: -burst.size / 2,
        scale,
        opacity,
      }}
    >
      {RAYS.map((ray) => (
        <span
          key={ray.id}
          className={ray.isLong ? styles.ray : styles.rayShort}
          style={{ transform: `rotate(${ray.angle}deg)` }}
        />
      ))}
    </motion.span>
  );
}

type ConfettiPieceProps = {
  piece: Confetti;
};

function ConfettiPiece({ piece }: ConfettiPieceProps) {
  const options = { cycles: piece.cycles, phase: piece.phase };
  const y = useLoop(["-8cqh", "108cqh"], options);
  const x = useLoop([0, piece.sway, 0, -piece.sway, 0], { ...options, ease: easeInOut });
  const rotate = useLoop([0, piece.spin], options);
  const opacity = useLoop([0, 0.9, 0.9, 0], options);

  return (
    <motion.span
      className={`${styles.confetti} ${piece.tone}`}
      style={{ left: piece.left, width: piece.width, height: piece.height, x, y, rotate, opacity }}
    />
  );
}

function NewYearScene() {
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.7, 1, 0.7], { cycles: 2, ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.stars} />
      <motion.div className={styles.horizon} style={{ scale: glowScale, opacity: glowOpacity }} />
      {BURSTS.map((burst) => (
        <Firework key={burst.id} burst={burst} />
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
