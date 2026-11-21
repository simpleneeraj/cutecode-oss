import { tv } from "tailwind-variants";

export const arrowLinkStyles = tv(
  {
    slots: {
      root: "group relative inline-flex min-h-11 items-center gap-1.5 rounded-control font-semibold text-body text-brand-ink outline-none focus-visible:shadow-focus",
      icon: "size-4.5 transition-transform duration-snappy ease-snappy group-hover:translate-x-0.75 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
    },
  },
  { twMerge: false },
);
