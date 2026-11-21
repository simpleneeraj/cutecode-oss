"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { customizer, customizerMotion } from "./constants";
import { customizerStyles } from "./style";

type SwapLabelProps = {
  swapKey: string;
  children: ReactNode;
};

const styles = customizerStyles();

export function SwapLabel({ swapKey, children }: SwapLabelProps) {
  const isReducedMotion = useReducedMotion();
  const shift = isReducedMotion ? 0 : customizer.swapShift;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.span
        animate={{ opacity: 1, y: 0 }}
        className={styles.swapLabel()}
        exit={{ opacity: 0, y: -shift }}
        initial={{ opacity: 0, y: shift }}
        key={swapKey}
        transition={customizerMotion.swap}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
