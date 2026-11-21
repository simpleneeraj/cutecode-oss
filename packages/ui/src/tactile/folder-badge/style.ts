import type { Variants } from "motion/react";
import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";
import { RollDirection } from "./tally";

export enum DigitPose {
  Enter = "enter",
  Shown = "shown",
  Exit = "exit",
}

export enum BadgePose {
  Hidden = "hidden",
  Shown = "shown",
}

const enterOffsets = {
  [RollDirection.Up]: "60%",
  [RollDirection.Down]: "-60%",
};

const exitOffsets = {
  [RollDirection.Up]: "-60%",
  [RollDirection.Down]: "60%",
};

const movingDigitVariants = {
  [DigitPose.Enter]: (direction: RollDirection) => ({ y: enterOffsets[direction], opacity: 0 }),
  [DigitPose.Shown]: { y: "0%", opacity: 1, transition: { y: motion.springSnappy, opacity: motion.fade } },
  [DigitPose.Exit]: (direction: RollDirection) => ({
    y: exitOffsets[direction],
    opacity: 0,
    transition: { y: motion.springSnappy, opacity: motion.fade },
  }),
} satisfies Variants;

const fadingDigitVariants = {
  [DigitPose.Enter]: { opacity: 0 },
  [DigitPose.Shown]: { opacity: 1, transition: motion.fade },
  [DigitPose.Exit]: { opacity: 0, transition: motion.fade },
} satisfies Variants;

const movingBadgeVariants = {
  [BadgePose.Hidden]: { scale: 0.5, opacity: 0, transition: motion.springSnappy },
  [BadgePose.Shown]: { scale: 1, opacity: 1, transition: { scale: motion.springSnappy, opacity: motion.fade } },
} satisfies Variants;

const fadingBadgeVariants = {
  [BadgePose.Hidden]: { opacity: 0, transition: motion.fade },
  [BadgePose.Shown]: { opacity: 1, transition: motion.fade },
} satisfies Variants;

export const folderBadgeMotion = {
  digit: { moving: movingDigitVariants, fading: fadingDigitVariants },
  badge: { moving: movingBadgeVariants, fading: fadingBadgeVariants },
};

export const folderBadgeStyles = tv(
  {
    slots: {
      root: "absolute top-0 right-0 z-30 flex h-6 min-w-6 translate-x-1/4 items-center justify-center overflow-hidden rounded-full bg-foreground px-1.5 font-semibold text-background text-caption1 tabular-nums shadow-icon",
      digits: "flex",
    },
  },
  { twMerge: false },
);
