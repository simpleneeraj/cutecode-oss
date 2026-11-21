import { tv } from "tailwind-variants";

import { Tone } from "../tone";

const neutralFace = "bg-secondary text-foreground";

export const avatarStackStyles = tv(
  {
    slots: {
      root: "inline-flex items-center",
      avatar: "size-9 not-first:-ml-1 ring-2 ring-card",
    },
  },
  { twMerge: false },
);

export const avatarStackFallbackStyles = tv(
  {
    base: "font-semibold text-caption1 tracking-tight",
    variants: {
      look: {
        [Tone.Neutral]: neutralFace,
        [Tone.Gray]: neutralFace,
        [Tone.Accent]: "bg-brand-soft text-brand-ink",
      },
    },
    defaultVariants: {
      look: Tone.Neutral,
    },
  },
  { twMerge: false },
);
