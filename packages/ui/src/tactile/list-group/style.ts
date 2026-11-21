import { tv } from "tailwind-variants";

import { Tone } from "../tone";

const neutralTile = "bg-secondary text-foreground";

export const listGroupStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col",
      header: "px-5 pb-1.75 text-density-footnote text-muted-foreground",
      rows: "flex flex-col overflow-hidden rounded-surface squircle edge bg-card text-card-foreground shadow-rest",
      row: "group/row relative flex items-center gap-3 pl-row-inset text-density-body text-foreground outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring data-interactive:cursor-pointer data-interactive:hover:bg-accent data-interactive:active:bg-muted",
      content:
        "flex min-h-row min-w-0 flex-1 items-center gap-3 border-border border-t py-2 pr-row-inset group-first/row:border-t-0",
      glyphIcon: "size-4.5",
      title: "flex min-w-0 flex-1 flex-col",
      subtitle: "text-density-subheadline text-muted-foreground",
      value: "shrink-0 text-muted-foreground",
      chevron: "size-4 shrink-0 text-muted-foreground",
      footer: "px-5 pt-1.75 text-density-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const listGroupGlyphStyles = tv(
  {
    base: "grid size-7.5 shrink-0 place-items-center rounded-icon squircle",
    variants: {
      look: {
        [Tone.Neutral]: neutralTile,
        [Tone.Gray]: neutralTile,
        [Tone.Accent]: "bg-brand text-on-fill",
      },
    },
    defaultVariants: {
      look: Tone.Neutral,
    },
  },
  { twMerge: false },
);
