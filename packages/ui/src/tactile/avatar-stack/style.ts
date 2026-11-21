import { tv } from "tailwind-variants";

import { Tone } from "../tone";
import { toneTint } from "../tone/style";

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
      tone: toneTint,
    },
    defaultVariants: {
      tone: Tone.Gray,
    },
  },
  { twMerge: false },
);
