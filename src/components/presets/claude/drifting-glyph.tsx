import { motion, easeInOut } from "motion/react";
import { useLoop } from "../scene";
import styles from "./claude.module.css";

export type Glyph = {
  id: string;
  character: string;
  x: number;
  y: number;
  size: number;
  tilt: number;
};

type DriftingGlyphProps = {
  glyph: Glyph;
  phase: number;
};

export default function DriftingGlyph({ glyph, phase }: DriftingGlyphProps) {
  const y = useLoop([0, -9, 0], { phase, ease: easeInOut });
  const rotate = useLoop([glyph.tilt, glyph.tilt + 6, glyph.tilt], { phase, ease: easeInOut });
  const opacity = useLoop([0.7, 1, 0.7], { phase, ease: easeInOut });

  return (
    <motion.span
      className={styles.glyph}
      style={{ left: `${glyph.x}%`, top: `${glyph.y}%`, fontSize: glyph.size, y, rotate, opacity }}
    >
      {glyph.character}
    </motion.span>
  );
}
