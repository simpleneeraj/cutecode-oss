import type { Variants } from "motion/react";
import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";
import { Tone } from "../tone";

export enum FolderPose {
  Closed = "closed",
  Open = "open",
  Pressed = "pressed",
}

export const folderMotion = {
  tilt: { degreesX: 6, degreesY: 8, perspective: 800, spring: { stiffness: 300, damping: 30 } },
  body: {
    [FolderPose.Pressed]: { scaleX: 1.015, scaleY: 0.97, transition: motion.springSnappy },
  } satisfies Variants,
};

export const folderStyles = tv(
  {
    slots: {
      root: "flex w-full touch-manipulation select-none flex-col items-center gap-2.5 outline-none",
      body: "relative block aspect-5/4 w-full origin-bottom perspective-midrange",
      tab: "absolute top-0 left-1/12 h-1/6 w-1/3 rounded-t-field bg-muted",
      back: "absolute inset-x-0 top-1/12 bottom-0 rounded-surface bg-muted",
      front:
        "glass absolute inset-x-0 bottom-0 flex h-3/5 origin-bottom items-end overflow-hidden rounded-surface edge p-3 shadow-glass",
      tint: "absolute inset-0",
      papers: "absolute inset-0",
      frontContent: "relative flex w-full items-end justify-between gap-2",
      title: "max-w-full truncate text-center font-semibold text-body text-foreground",
      count: "text-center text-footnote text-muted-foreground",
    },
    variants: {
      look: {
        [Tone.Neutral]: { tint: "bg-card" },
        [Tone.Gray]: { tint: "bg-secondary" },
        [Tone.Accent]: { tint: "bg-brand-soft", frontContent: "text-brand-ink" },
      },
      isOpen: {
        true: { front: "translate-y-1 scale-y-95" },
        false: {},
      },
    },
    compoundVariants: [
      { look: Tone.Neutral, isOpen: false, class: { tint: "opacity-0" } },
      { look: Tone.Neutral, isOpen: true, class: { tint: "opacity-40" } },
      { look: [Tone.Gray, Tone.Accent], isOpen: false, class: { tint: "opacity-80" } },
      { look: [Tone.Gray, Tone.Accent], isOpen: true, class: { tint: "opacity-55" } },
    ],
  },
  { twMerge: false },
);
