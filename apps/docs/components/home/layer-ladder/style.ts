import { tv } from "tailwind-variants";

export const layerLadderStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-300 flex-col gap-12",
      steps:
        "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pt-3 pb-2 lg:mx-0 lg:justify-center lg:gap-6 lg:overflow-visible lg:px-0",
      step: "group flex flex-none snap-start items-start gap-6",
      arrow:
        "hidden size-11 shrink-0 place-items-center self-center rounded-full edge bg-card text-muted-foreground shadow-rest group-first:hidden lg:grid",
      arrowIcon: "size-5",
      body: "flex w-60 flex-col gap-3.5 lg:w-64",
      description: "text-center text-muted-foreground text-subheadline",
    },
  },
  { twMerge: false },
);
