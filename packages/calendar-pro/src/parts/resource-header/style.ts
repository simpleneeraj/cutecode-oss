import { tv } from "tailwind-variants";

export const resourceGlyphStyles = tv(
  {
    slots: {
      root: "grid size-8 shrink-0 place-items-center bg-linear-to-b from-icon-top to-icon-bottom text-foreground shadow-icon",
      icon: "size-4.5",
      initials: "font-semibold text-caption1 leading-none",
    },
    variants: {
      isRound: {
        true: { root: "rounded-full" },
        false: { root: "rounded-field" },
      },
    },
  },
  { twMerge: false },
);

export const resourceHeaderStyles = tv(
  {
    slots: {
      root: "@container flex min-w-0 items-center justify-center gap-2 px-1.5 py-1",
      glyph: "@max-3xs:hidden",
      text: "flex min-w-0 flex-col items-start",
      name: "max-w-full truncate font-semibold text-foreground text-subheadline",
      detail: "max-w-full truncate text-caption1 text-muted-foreground",
    },
  },
  { twMerge: false },
);
