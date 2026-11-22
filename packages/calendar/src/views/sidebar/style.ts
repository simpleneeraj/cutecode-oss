import { tv } from "tailwind-variants";

export const sidebarExampleStyles = tv(
  {
    slots: {
      root: "@container flex min-w-0 flex-col gap-5",
      shell: "flex min-w-0 flex-col gap-5 @5xl:flex-row",
      side: "flex min-w-0 flex-col @5xl:w-63 @5xl:shrink-0",
      main: "flex min-w-0 flex-1 flex-col",
    },
  },
  { twMerge: false },
);
