import { tv } from "tailwind-variants";

export const siteHeaderStyles = tv(
  {
    slots: {
      root: "sticky top-3 z-40 flex w-full justify-center md:top-4",
      bar: "w-full max-w-270",
      brand: "inline-flex items-center gap-2.5",
      logo: "size-7 shrink-0",
    },
  },
  { twMerge: false },
);
