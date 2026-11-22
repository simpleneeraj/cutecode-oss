"use client";

import { motion, useReducedMotion, type PanInfo } from "motion/react";
import type { ReactNode } from "react";

import type { TextDirection } from "../../types";
import { swipeStep } from "./layout";
import { swipeStyles } from "./style";

type SwipeDaysProps = {
  direction: TextDirection;
  onStep: (step: number) => void;
  children: ReactNode;
};

const styles = swipeStyles();

function SwipeDays({ direction, onStep, children }: SwipeDaysProps) {
  const isReducedMotion = useReducedMotion();
  const finishSwipe = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const step = swipeStep(info.offset.x, info.velocity.x, direction);
    if (step !== 0) {
      onStep(step);
    }
  };

  return (
    <motion.div
      className={styles.root()}
      data-slot="phone-swipe"
      drag={isReducedMotion ? false : "x"}
      dragDirectionLock
      dragSnapToOrigin
      onDragEnd={finishSwipe}
      onPanEnd={isReducedMotion ? finishSwipe : undefined}
    >
      {children}
    </motion.div>
  );
}

export { SwipeDays };
