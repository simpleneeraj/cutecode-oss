import { tv } from "tailwind-variants";

export const themesPageStyles = tv(
  {
    slots: {
      root: "flex w-full flex-1 flex-col items-center px-4 md:px-6",
      main: "flex w-full max-w-330 flex-col gap-10 py-12 md:py-16",
      heading: "flex max-w-180 flex-col gap-2.5",
      title: "text-balance font-heading font-semibold text-3xl tracking-tight md:text-4xl",
      description: "text-pretty text-lg text-muted-foreground",
    },
  },
  { twMerge: false },
);
