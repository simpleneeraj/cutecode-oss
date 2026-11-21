import { tv } from "tailwind-variants";

export const deckPoses = {
  closed: [
    { y: 0, scale: 1, opacity: 1 },
    { y: 8, scale: 0.94, opacity: 0.7 },
    { y: 16, scale: 0.88, opacity: 0.4 },
  ],
  open: { y: 0, scale: 1, opacity: 1 },
};

const depthLayers = ["z-30", "z-20", "z-10"];

export const notificationDeckStyles = tv(
  {
    slots: {
      root: "relative w-full max-w-90",
      list: "w-full",
      item: "relative flex w-full justify-center",
      card: "flex w-full origin-bottom justify-center",
      toggle: "absolute inset-0 z-40 cursor-pointer rounded-surface outline-none focus-visible:shadow-focus",
    },
    variants: {
      isOpen: {
        true: { list: "flex flex-col gap-2" },
        false: { list: "grid pb-4", item: "col-start-1 row-start-1" },
      },
    },
  },
  { twMerge: false },
);

export function readDepthLayer(depth: number) {
  return depthLayers[depth] ?? depthLayers.at(-1);
}
