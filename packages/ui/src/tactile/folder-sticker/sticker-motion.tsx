"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { folderStickerStyles, folderStickerVariants } from "./style";

type StickerMotionProps = {
  children: ReactNode;
};

export function StickerMotion({ children }: StickerMotionProps) {
  const isReducedMotion = useReducedMotion();
  const styles = folderStickerStyles();

  return (
    <motion.span
      aria-hidden="true"
      className={styles.root()}
      data-slot="folder-sticker"
      variants={isReducedMotion ? undefined : folderStickerVariants}
    >
      {children}
    </motion.span>
  );
}
