import { tv } from "tailwind-variants";

import { Tone } from "../tone";

export const chipStyles = tv(
  {
    slots: {
      base: "inline-flex h-control-small shrink-0 items-center gap-1.5 whitespace-nowrap rounded-control px-control-inset-small font-medium text-density-footnote",
      icon: "size-4 shrink-0 sm:size-3.5",
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
