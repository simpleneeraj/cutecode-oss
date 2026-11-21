import type { Transition } from "motion/react";

export const motion = {
  springSnappy: { type: "spring", stiffness: 420, damping: 32 } satisfies Transition,
  fade: { duration: 0.15, ease: "easeOut" } satisfies Transition,
};
