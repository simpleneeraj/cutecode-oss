import { tv } from "tailwind-variants";

import { Tone } from "../tone";

const neutralGlyph = "bg-secondary text-foreground";

export const statusBadgeStyles = tv(
  {
    slots: {
      root: "inline-flex h-control-medium shrink-0 items-center gap-2 whitespace-nowrap rounded-control edge bg-card pr-control-inset-medium pl-1.5 font-medium text-density-footnote text-foreground shadow-rest",
      icon: "size-3.5",
    },
  },
  { twMerge: false },
);

export const statusBadgeGlyphStyles = tv(
  {
    base: "grid size-5 shrink-0 place-items-center rounded-full",
    variants: {
      look: {
        [Tone.Neutral]: neutralGlyph,
        [Tone.Gray]: neutralGlyph,
        [Tone.Accent]: "bg-brand text-on-fill",
      },
    },
    defaultVariants: {
      look: Tone.Neutral,
    },
  },
  { twMerge: false },
);
