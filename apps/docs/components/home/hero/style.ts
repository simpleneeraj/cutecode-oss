import { tv } from "tailwind-variants";

export const heroStyles = tv(
  {
    slots: {
      root: "relative flex w-full flex-col items-center overflow-hidden py-14 md:min-h-180 md:justify-center md:py-16",
      orbit: "pointer-events-none absolute top-1/2 left-1/2 w-150 -translate-1/2 md:w-280",
      content: "relative z-10 flex w-full max-w-180 flex-col items-center gap-6 text-center",
      chips: "flex flex-wrap justify-center gap-2",
      title: "text-balance font-semibold text-5xl tracking-tight md:text-7xl",
      accent: "font-normal font-serif",
      lead: "max-w-150 text-pretty text-lg text-muted-foreground md:text-xl",
      actions: "flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center",
      action: "w-full sm:w-auto",
      install: "flex w-full max-w-130 justify-center pt-1",
    },
  },
  { twMerge: false },
);
