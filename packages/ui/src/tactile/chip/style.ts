import { tv } from "tailwind-variants";

import { Tone } from "../tone";
import { toneTint } from "../tone/style";

export const chipStyles = tv(
  {
    slots: {
      base: "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-control px-2.5 font-semibold text-caption1",
      icon: "size-3.25 shrink-0",
    },
    variants: {
      tone: toneTint,
    },
    defaultVariants: {
      tone: Tone.Gray,
    },
  },
  { twMerge: false },
);
