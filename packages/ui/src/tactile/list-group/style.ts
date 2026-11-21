import { tv } from "tailwind-variants";

import { Tone } from "../tone";
import { toneFill } from "../tone/style";

export const listGroupStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col",
      header: "px-5 pb-1.75 text-footnote text-muted-foreground uppercase",
      rows: "flex flex-col overflow-hidden rounded-surface edge bg-card text-card-foreground shadow-rest",
      row: "group/row relative flex items-center gap-3.5 pl-4 text-body text-foreground outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring data-interactive:cursor-pointer data-interactive:hover:bg-accent data-interactive:active:bg-muted",
      content:
        "flex min-h-13 min-w-0 flex-1 items-center gap-3 border-border border-t py-2.5 pr-4 group-first/row:border-t-0",
      glyphIcon: "size-4.75",
      title: "flex min-w-0 flex-1 flex-col",
      subtitle: "text-muted-foreground text-subheadline",
      value: "shrink-0 text-muted-foreground",
      chevron: "size-4 shrink-0 text-muted-foreground",
      footer: "px-5 pt-1.75 text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);

export const listGroupGlyphStyles = tv(
  {
    base: "grid size-7.5 shrink-0 place-items-center rounded-icon squircle",
    variants: {
      tone: toneFill,
    },
    defaultVariants: {
      tone: Tone.Blue,
    },
  },
  { twMerge: false },
);
