import { tv } from "tailwind-variants";

enum PlateDepth {
  Middle = "middle",
  Back = "back",
}

export const maxPlates = 2;

export const plateDepths = [PlateDepth.Back, PlateDepth.Middle];

export const notificationStackStyles = tv(
  {
    slots: {
      root: "relative grid justify-items-center pb-4",
      front: "relative z-10 col-start-1 row-start-1 flex w-full justify-center",
      item: "contents",
      plate:
        "glass pointer-events-none col-start-1 row-start-1 w-90 max-w-full origin-bottom rounded-surface squircle edge shadow-glass",
    },
    variants: {
      depth: {
        [PlateDepth.Middle]: { plate: "translate-y-2 scale-94 opacity-70" },
        [PlateDepth.Back]: { plate: "translate-y-4 scale-88 opacity-40" },
      },
    },
  },
  { twMerge: false },
);
