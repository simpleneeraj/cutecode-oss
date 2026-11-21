import type { Transition } from "motion/react";
import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";
import { StackMove } from "./order";

export enum CardStackState {
  Rest = "rest",
  Open = "open",
}

export const fanPositions = [
  { x: "-30%", y: "10%", rotate: -9, openX: -4, openY: 4 },
  { x: "28%", y: "-8%", rotate: 7, openX: 4, openY: -4 },
  { x: "-4%", y: "14%", rotate: -2, openX: 0, openY: 4 },
];

export const openTransition = motion.springSnappy;

export const cardStackMotion = {
  instant: { duration: 0 } satisfies Transition,
  hoverLift: { y: -6 },
  swipeDistance: 60,
  swipeVelocity: 400,
  dragElastic: 0.7,
  dragTilt: { range: [-200, 200], degrees: [-8, 8] },
  dragTransition: { bounceStiffness: 420, bounceDamping: 32 },
  crossFade: { opacity: [0, 1] },
};

export const cycleKeys: Partial<Record<string, StackMove>> = {
  ArrowRight: StackMove.Next,
  ArrowDown: StackMove.Next,
  ArrowLeft: StackMove.Previous,
  ArrowUp: StackMove.Previous,
};

export const cardStackStyles = tv(
  {
    slots: {
      root: "relative grid w-full select-none grid-cols-1 place-items-center py-6",
      card: "col-start-1 row-start-1 w-7/12 max-w-65 rounded-surface outline-none transition-shadow focus-visible:shadow-focus",
    },
    variants: {
      isDraggable: {
        true: { card: "cursor-grab active:cursor-grabbing" },
        false: { card: "cursor-pointer" },
      },
    },
  },
  { twMerge: false },
);
