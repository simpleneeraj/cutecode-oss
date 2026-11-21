import { tv } from "tailwind-variants";

export enum AppIconSize {
  ExtraSmall = "extra-small",
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extra-large",
}

export const appIconStyles = tv(
  {
    slots: {
      tile: "grid shrink-0 place-items-center rounded-icon squircle bg-linear-to-b from-icon-top shadow-icon",
      glyph: "shrink-0",
    },
    variants: {
      size: {
        [AppIconSize.ExtraSmall]: { tile: "size-6", glyph: "size-3.5" },
        [AppIconSize.Small]: { tile: "size-10", glyph: "size-5.5" },
        [AppIconSize.Medium]: { tile: "size-16", glyph: "size-8.5" },
        [AppIconSize.Large]: { tile: "size-22", glyph: "size-11.5" },
        [AppIconSize.ExtraLarge]: { tile: "size-30", glyph: "size-15.5" },
      },
    },
    defaultVariants: {
      size: AppIconSize.Medium,
    },
  },
  { twMerge: false },
);
