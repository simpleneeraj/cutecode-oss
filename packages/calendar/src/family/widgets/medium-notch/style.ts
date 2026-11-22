import { tv } from "tailwind-variants";

export const notchWidgetStyles = tv(
  {
    slots: {
      notch:
        "absolute -top-6.5 end-0 z-10 flex h-8.5 items-center rounded-t-2xl bg-card px-4 font-bold text-brand-ink text-footnote tabular-nums",
      corner:
        "absolute end-full bottom-2 size-4 bg-card mask-radial-at-top-left mask-circle mask-radial-from-transparent mask-radial-from-4 mask-radial-to-black mask-radial-to-4 rtl:mask-radial-at-top-right",
      head: "flex min-w-0 items-center gap-2.5",
      glyph:
        "grid size-7.5 shrink-0 place-items-center rounded-lg bg-linear-to-b from-brand/80 to-brand text-on-fill shadow-icon",
      glyphIcon: "size-4.5",
      headText: "flex min-w-0 flex-col",
      title: "font-semibold text-subheadline",
      detail: "truncate text-footnote text-muted-foreground",
    },
  },
  { twMerge: false },
);
