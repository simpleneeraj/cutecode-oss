import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import PixelCritter from "./pixel-critter";
import PixelSkyline, { type SkylineLayer } from "./pixel-skyline";
import Sparkle, { type Star } from "./sparkle";
import styles from "./claude.module.css";

const SKYLINES: SkylineLayer[] = [
  {
    id: "far",
    className: styles.skylineFar,
    height: 28,
    lit: false,
    buildings: [
      { id: "f1", x: 0, width: 5, height: 14 },
      { id: "f2", x: 5, width: 6, height: 22 },
      { id: "f3", x: 11, width: 4, height: 16 },
      { id: "f4", x: 15, width: 7, height: 26 },
      { id: "f5", x: 22, width: 5, height: 12 },
      { id: "f6", x: 27, width: 6, height: 19 },
      { id: "f7", x: 33, width: 8, height: 24 },
      { id: "f8", x: 41, width: 5, height: 15 },
      { id: "f9", x: 46, width: 6, height: 21 },
      { id: "f10", x: 52, width: 4, height: 13 },
      { id: "f11", x: 56, width: 7, height: 25 },
      { id: "f12", x: 63, width: 5, height: 17 },
      { id: "f13", x: 68, width: 6, height: 22 },
      { id: "f14", x: 74, width: 6, height: 14 },
    ],
  },
  {
    id: "near",
    className: styles.skylineNear,
    height: 20,
    lit: true,
    buildings: [
      { id: "n1", x: 0, width: 6, height: 10 },
      { id: "n2", x: 7, width: 8, height: 17 },
      { id: "n2-antenna", x: 10, width: 2, height: 20 },
      { id: "n3", x: 16, width: 5, height: 8 },
      { id: "n4", x: 22, width: 7, height: 14 },
      { id: "n5", x: 30, width: 5, height: 10 },
      { id: "n6", x: 36, width: 4, height: 6 },
      { id: "n7", x: 41, width: 7, height: 12 },
      { id: "n8", x: 49, width: 6, height: 16 },
      { id: "n9", x: 56, width: 4, height: 9 },
      { id: "n10", x: 61, width: 8, height: 18 },
      { id: "n11", x: 70, width: 5, height: 11 },
      { id: "n12", x: 76, width: 4, height: 7 },
    ],
  },
];

const STARS: Star[] = [
  { id: "top-right", x: 88, y: 12, size: 16 },
  { id: "top-left", x: 8, y: 18, size: 10 },
  { id: "mid-right", x: 92, y: 58, size: 12 },
  { id: "low-right", x: 82, y: 86, size: 18 },
  { id: "low-center", x: 46, y: 92, size: 8 },
];

export default function ClaudeScene() {
  const glowScale = useLoop([1, 1.06, 1], { ease: easeInOut });
  const glowOpacity = useLoop([0.85, 1, 0.85], { ease: easeInOut });

  return (
    <div className={styles.layer} aria-hidden>
      <motion.div className={styles.glow} style={{ scale: glowScale, opacity: glowOpacity }} />
      <div className={styles.skylines}>
        {SKYLINES.map((layer) => (
          <PixelSkyline key={layer.id} layer={layer} />
        ))}
      </div>
      <div className={styles.ground} />
      <PixelCritter />
      <div className={styles.grain} />
      {STARS.map((star, index) => (
        <Sparkle key={star.id} star={star} phase={index / STARS.length} />
      ))}
    </div>
  );
}
