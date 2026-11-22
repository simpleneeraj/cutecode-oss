import { motion, easeInOut } from "motion/react";
import { CodeSquareIcon } from "@solar-icons/react/bold/code-square";
import { HeartIcon } from "@solar-icons/react/bold/heart";
import { MoonStarsIcon } from "@solar-icons/react/bold/moon-stars";
import { StarsMinimalisticIcon } from "@solar-icons/react/bold/stars-minimalistic";
import { BaseFrameProps } from "@/typings/presets";
import { SceneFrame, useLoop } from "../scene";
import styles from "./retro-mac.module.css";

const PIXELS = Array.from({ length: 14 }, (_, index) => ({
  id: `pixel-${index}`,
  x: (index * 47 + 5) % 96,
  y: (index * 31 + 7) % 92,
  size: 4 + (index % 3) * 2,
  phase: ((index * 5) % 14) / 14,
}));

const BADGES = [
  { id: "heart-top-left", icon: HeartIcon, x: 7, y: 11, size: 18 },
  { id: "star-top-right", icon: StarsMinimalisticIcon, x: 89, y: 9, size: 16 },
  { id: "moon-bottom-right", icon: MoonStarsIcon, x: 86, y: 84, size: 18 },
  { id: "code-bottom-left", icon: CodeSquareIcon, x: 9, y: 86, size: 17 },
];

type Pixel = (typeof PIXELS)[number];
type Badge = (typeof BADGES)[number];

function BlinkingPixel({ pixel }: { pixel: Pixel }) {
  const opacity = useLoop([0, 0, 1, 1, 0, 0], { cycles: 2, phase: pixel.phase });

  return (
    <motion.span
      className={styles.pixel}
      style={{ left: `${pixel.x}%`, top: `${pixel.y}%`, width: pixel.size, height: pixel.size, opacity }}
    />
  );
}

function BobbingBadge({ badge, index }: { badge: Badge; index: number }) {
  const y = useLoop([0, 0, -6, -6, 0, 0], { cycles: 2, phase: index / BADGES.length });

  return (
    <motion.span className={styles.badge} style={{ left: `${badge.x}%`, top: `${badge.y}%`, y }}>
      <badge.icon size={badge.size} />
    </motion.span>
  );
}

function RetroMacScene() {
  const patternX = useLoop([0, 16], { cycles: 2 });
  const patternY = useLoop([0, 16], { cycles: 2 });
  const scanY = useLoop(["-10cqh", "110cqh"]);
  const glowScale = useLoop([1, 1.08, 1], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.pattern} style={{ x: patternX, y: patternY }} />
      <motion.div className={styles.glow} style={{ scale: glowScale }} />
      <motion.div className={styles.scanline} style={{ y: scanY }} />
      {PIXELS.map((pixel) => (
        <BlinkingPixel key={pixel.id} pixel={pixel} />
      ))}
      {BADGES.map((badge, index) => (
        <BobbingBadge key={badge.id} badge={badge} index={index} />
      ))}
    </div>
  );
}

function PlatinumSheen() {
  const x = useLoop(["-100%", "300%", "300%"]);

  return (
    <div className={styles.topEdge} aria-hidden>
      <motion.div className={styles.shine} style={{ x }} />
    </div>
  );
}

const background = <RetroMacScene />;
const accent = <PlatinumSheen />;

export default function RetroMacFrame(props: BaseFrameProps) {
  return <SceneFrame {...props} themeStyles={styles} background={background} accent={accent} />;
}
