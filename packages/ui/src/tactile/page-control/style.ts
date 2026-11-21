import { tv } from "tailwind-variants";

export const pageControlStyles = tv(
  {
    slots: {
      root: "glass inline-flex h-6.5 items-center gap-2.25 rounded-control px-2.5 shadow-glass",
      dot: "size-2 rounded-full bg-foreground opacity-30 transition-opacity duration-200 data-current:opacity-100 motion-reduce:transition-none",
    },
  },
  { twMerge: false },
);
