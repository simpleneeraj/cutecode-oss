import { tv } from "tailwind-variants";

export const heroStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col items-center gap-9 pt-10 pb-12 md:gap-14 md:pt-16 md:pb-16",
      copy: "flex w-full max-w-190 flex-col items-center gap-5 text-center md:gap-6",
      chips: "flex flex-wrap justify-center gap-2",
      title:
        "text-balance font-heading font-semibold text-5xl/12 text-foreground tracking-tight md:text-7xl/19 md:tracking-tighter",
      accent: "font-normal font-serif italic",
      lead: "max-w-160 text-pretty text-body/6 text-muted-foreground md:text-xl/7.5",
      actions: "flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center",
      action: "w-full sm:w-auto",
      stage: "w-full",
    },
  },
  { twMerge: false },
);
