import type { Transition } from "motion/react";
import { tv } from "tailwind-variants";

export enum CardStackState {
  Rest = "rest",
  Open = "open",
}

export const fanPositions = [
  { x: "-30%", y: "10%", rotate: -9, openX: -4, openY: 4 },
  { x: "28%", y: "-8%", rotate: 7, openX: 4, openY: -4 },
  { x: "-4%", y: "14%", rotate: -2, openX: 0, openY: 4 },
];

export const openTransition = { type: "spring", stiffness: 420, damping: 32 } satisfies Transition;

export const cardStackStyles = tv(
  {
    slots: {
      root: "relative grid w-full grid-cols-1 place-items-center py-6",
      card: "col-start-1 row-start-1 w-7/12 max-w-65",
    },
  },
  { twMerge: false },
);
