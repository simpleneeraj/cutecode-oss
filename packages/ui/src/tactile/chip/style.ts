import { tv } from "tailwind-variants";

import { Tone } from "../tone";

export const chipStyles = tv(
  {
    slots: {
      base: "inline-flex h-7 shrink-0 items-center gap-1.25 whitespace-nowrap rounded-control px-2.75 font-semibold text-footnote",
      icon: "size-3.75 shrink-0",
    },
    variants: {
      look: {
        [Tone.Neutral]: { base: "bg-card text-foreground shadow-rest" },
        [Tone.Gray]: { base: "bg-secondary text-muted-foreground" },
        [Tone.Accent]: { base: "bg-brand-soft text-brand-ink" },
      },
    },
    defaultVariants: {
      look: Tone.Neutral,
    },
  },
  { twMerge: false },
);
