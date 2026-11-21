import type { Transition, Variants } from "motion/react";

export const homeMotion = {
  springGentle: { type: "spring", stiffness: 260, damping: 30 },
  springSnappy: { type: "spring", stiffness: 420, damping: 32 },
  fade: { duration: 0.15, ease: "easeOut" },
  stillFade: { duration: 0.15, ease: "easeOut", x: { duration: 0 }, y: { duration: 0 }, scale: { duration: 0 } },
  staggerStep: 0.06,
  entranceOffset: 16,
} satisfies Record<string, Transition | number>;

export enum Entrance {
  Hidden = "hidden",
  Shown = "shown",
}

export function readEntranceGroup(isReducedMotion: boolean): Variants {
  const staggerChildren = isReducedMotion ? 0 : homeMotion.staggerStep;
  return {
    [Entrance.Hidden]: {},
    [Entrance.Shown]: { transition: { staggerChildren } },
  };
}

export function readEntranceItem(isReducedMotion: boolean): Variants {
  return {
    [Entrance.Hidden]: { opacity: 0, y: homeMotion.entranceOffset },
    [Entrance.Shown]: { opacity: 1, y: 0, transition: readEntranceTransition(isReducedMotion) },
  };
}

export function readEntranceLift(isReducedMotion: boolean): Variants {
  return {
    [Entrance.Hidden]: { y: homeMotion.entranceOffset },
    [Entrance.Shown]: { y: 0, transition: readEntranceTransition(isReducedMotion) },
  };
}

function readEntranceTransition(isReducedMotion: boolean) {
  return isReducedMotion ? homeMotion.stillFade : homeMotion.springGentle;
}

export const entranceViewport = { once: true, amount: 0.2 };
