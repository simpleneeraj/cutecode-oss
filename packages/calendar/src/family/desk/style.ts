import { tv } from "tailwind-variants";

export const deskStyles = tv(
  {
    slots: {
      root: "relative flex w-full max-w-90 flex-col gap-3.5 rounded-overlay bg-card p-4 text-foreground shadow-raised edge",
      head: "flex items-center gap-2.5 font-semibold text-subheadline",
      glyph: "grid size-7 place-items-center rounded-lg bg-linear-to-b from-icon-top to-icon-bottom shadow-icon",
      glyphIcon: "size-4",
      stage:
        "relative flex min-h-43 flex-col justify-end gap-1.5 overflow-hidden rounded-surface bg-linear-to-b from-note to-secondary/60 p-4.5 text-note-ink",
      add: "press hit-area absolute top-3 end-3 z-2 grid size-8.5 cursor-pointer place-items-center rounded-full bg-foreground text-background outline-none focus-visible:shadow-focus",
      addIcon: "size-4.5",
      text: "relative z-1 flex max-w-3/5 flex-col gap-1.5",
      title: "font-heading font-semibold text-title3",
      date: "text-note-ink/55 text-subheadline",
      flips:
        "absolute end-3.5 bottom-3.5 flex gap-2 perspective-normal before:absolute before:-top-5.5 before:-end-10 before:-bottom-10 before:-start-6 before:rounded-overlay before:bg-note-ink/9",
      rings: "absolute -top-2 end-13 z-2 flex gap-11.5",
      ring: "h-4.5 w-1.5 rounded-full bg-note-ink/35",
      tile: "relative grid h-15.5 w-14.5 place-items-center rounded-2xl bg-linear-to-b from-icon-top to-icon-bottom font-semibold text-2xl text-foreground tracking-tight tabular-nums shadow-icon transform-3d after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-foreground/10",
      flipTile: "press cursor-pointer outline-none focus-visible:shadow-focus",
      face: "absolute inset-0 grid place-items-center backface-hidden",
      faceLabel: "absolute top-1.5 font-bold text-caption2 text-muted-foreground tracking-wide",
      faceNumber: "pt-2",
    },
  },
  { twMerge: false },
);
