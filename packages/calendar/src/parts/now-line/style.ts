import { tv } from "tailwind-variants";

import { NowEmphasis } from "./emphasis";

export const nowLineStyles = tv(
  {
    slots: {
      root: "pointer-events-none absolute inset-x-0 z-20 flex -translate-y-1/2 items-center",
      dot: "-ms-1.25 size-2.5 shrink-0 rounded-full bg-destructive",
      line: "flex-1 bg-destructive",
    },
    variants: {
      emphasis: {
        [NowEmphasis.Today]: { line: "h-0.5" },
        [NowEmphasis.Week]: { dot: "hidden", line: "h-px opacity-30" },
      },
    },
  },
  { twMerge: false },
);
