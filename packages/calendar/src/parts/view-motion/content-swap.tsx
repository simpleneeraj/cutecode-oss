"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { viewSwitchMotion } from "./presets";
import { contentSwapStyles } from "./style";

type ContentSwapProps = {
  swapKey: string;
  children: ReactNode;
};

const exit = { opacity: 0 };

function ContentSwap({ swapKey, children }: ContentSwapProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const entrance = reduceMotion ? viewSwitchMotion.reduced : viewSwitchMotion.full;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={swapKey}
        animate={entrance.animate}
        className={contentSwapStyles()}
        exit={exit}
        initial={entrance.initial}
        transition={entrance.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export { ContentSwap };
