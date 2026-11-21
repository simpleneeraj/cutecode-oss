import { tv } from "tailwind-variants";

import { Tone } from "../tone";
import { toneFill } from "../tone/style";

export const statusBadgeStyles = tv(
  {
    slots: {
      root: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-control edge bg-card pr-3.5 pl-2 font-semibold text-foreground text-subheadline shadow-rest",
      icon: "size-3.25",
    },
  },
  { twMerge: false },
);

export const statusBadgeGlyphStyles = tv(
  {
    base: "grid size-5 shrink-0 place-items-center rounded-full",
    variants: {
      tone: toneFill,
    },
    defaultVariants: {
      tone: Tone.Blue,
    },
  },
  { twMerge: false },
);
