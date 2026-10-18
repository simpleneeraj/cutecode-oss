import { motion, easeInOut } from "motion/react";
import { cn } from "@/utils/cn";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./style.module.css";

const BARS = Array.from({ length: 12 }, (_, index) => ({
  id: `bar-${index}`,
  peak: 0.55 + ((index * 7) % 5) * 0.1,
  cycles: 2 + (index % 3),
  phase: ((index * 5) % 12) / 12,
}));

const SHAPE_TONES = [styles.mint, styles.lilac, styles.peach, styles.butter];

const SHAPES = [
  { id: "shape-ring", x: 8, y: 12, size: 26, path: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" },
  { id: "shape-squiggle", x: 46, y: 6, size: 34, path: "M2 14c3-6 5-6 7 0s4 6 7 0 4-6 6 0" },
  { id: "shape-triangle", x: 70, y: 82, size: 22, path: "M12 4l9 15H3z" },
  { id: "shape-cross", x: 30, y: 90, size: 18, path: "M12 4v16M4 12h16" },
  { id: "shape-dot", x: 94, y: 56, size: 14, path: "M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" },
  { id: "shape-zigzag", x: 4, y: 50, size: 26, path: "M2 16l5-8 5 8 5-8 5 8" },
].map((shape, index) => ({ ...shape, tone: SHAPE_TONES[index % SHAPE_TONES.length] }));

const REELS = [
  { id: "reel-left", side: styles.reelLeft },
  { id: "reel-right", side: styles.reelRight },
];

type Bar = (typeof BARS)[number];
type Shape = (typeof SHAPES)[number];
type Reel = (typeof REELS)[number];

function MeterBar({ bar }: { bar: Bar }) {
  const scaleY = useLoop([0.25, bar.peak, 0.45, 1, 0.25], { cycles: bar.cycles, phase: bar.phase, ease: easeInOut });

  return <motion.span className={styles.bar} style={{ scaleY }} />;
}

function FloatingShape({ shape, index }: { shape: Shape; index: number }) {
  const options = { phase: index / SHAPES.length, ease: easeInOut };
  const y = useLoop([0, -12, 0], options);
  const rotate = useLoop([0, index % 2 === 0 ? 14 : -14, 0], options);

  return (
    <motion.svg
      className={cn(styles.shape, shape.tone)}
      viewBox="0 0 24 24"
      width={shape.size}
      height={shape.size}
      style={{ left: `${shape.x}%`, top: `${shape.y}%`, y, rotate }}
    >
      <path d={shape.path} />
    </motion.svg>
  );
}

function TapeReel({ reel }: { reel: Reel }) {
  const rotate = useLoop([0, 360], { cycles: 2 });

  return (
    <motion.svg className={cn(styles.reel, reel.side)} viewBox="0 0 40 40" style={{ rotate }}>
      <circle cx="20" cy="20" r="18" />
      <path d="M20 8v6M20 26v6M9.6 14l5.2 3M25.2 23l5.2 3M9.6 26l5.2-3M25.2 17l5.2-3" />
    </motion.svg>
  );
}

function CassetteTape() {
  return (
    <div className={styles.tape}>
      <div className={styles.tapeLabel} />
      <div className={styles.tapeWindow}>
        {REELS.map((reel) => (
          <TapeReel key={reel.id} reel={reel} />
        ))}
      </div>
      <div className={styles.tapeFoot} />
    </div>
  );
}

function CassetteScene() {
  const driftX = useLoop([0, 26, 0], { ease: easeInOut });
  const driftY = useLoop([0, -20, 0], { ease: easeInOut, phase: 0.25 });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.blobMint} style={{ x: driftX, y: driftY }} />
      <motion.div className={styles.blobPeach} style={{ x: driftY, y: driftX }} />
      {SHAPES.map((shape, index) => (
        <FloatingShape key={shape.id} shape={shape} index={index} />
      ))}
      <div className={styles.meter}>
        {BARS.map((bar) => (
          <MeterBar key={bar.id} bar={bar} />
        ))}
      </div>
      <CassetteTape />
    </div>
  );
}

function TapeEdge() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.sweep} style={{ x }} />
    </div>
  );
}

const background = <CassetteScene />;
const accent = <TapeEdge />;

export default function CassetteFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
