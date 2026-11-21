import { tv } from "tailwind-variants";

export const partsGridStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-300 flex-col gap-10",
      grid: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
      folders: "grid w-full grid-cols-2 gap-5 pt-3",
      stack: "w-full",
      controls: "flex w-full flex-col items-center gap-4",
      search: "max-w-72",
      icons: "grid grid-cols-4 justify-items-center gap-3",
    },
  },
  { twMerge: false },
);
