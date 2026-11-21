"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { BadgePose, DigitPose, folderBadgeMotion, folderBadgeStyles } from "./style";
import { formatBadgeValue, RollDirection, readRollDirection } from "./tally";

type FolderBadgeProps = {
  value: number;
};

const styles = folderBadgeStyles();

function useRollDirection(value: number) {
  const [tally, setTally] = useState({ value, direction: RollDirection.Up });
  const hasChanged = tally.value !== value;
  if (hasChanged) {
    setTally({ value, direction: readRollDirection(tally.value, value) });
  }
  return tally.direction;
}

function FolderBadge({ value }: FolderBadgeProps) {
  const isReducedMotion = useReducedMotion();
  const direction = useRollDirection(value);
  const isShown = value > 0;
  const badgeVariants = isReducedMotion ? folderBadgeMotion.badge.fading : folderBadgeMotion.badge.moving;
  const digitVariants = isReducedMotion ? folderBadgeMotion.digit.fading : folderBadgeMotion.digit.moving;

  return (
    <AnimatePresence initial={false}>
      {isShown ? (
        <motion.span
          animate={BadgePose.Shown}
          className={styles.root()}
          data-slot="folder-badge"
          exit={BadgePose.Hidden}
          initial={BadgePose.Hidden}
          key="badge"
          variants={badgeVariants}
        >
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.span
              animate={DigitPose.Shown}
              className={styles.digits()}
              custom={direction}
              exit={DigitPose.Exit}
              initial={DigitPose.Enter}
              key={value}
              variants={digitVariants}
            >
              {formatBadgeValue(value)}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export { FolderBadge };
