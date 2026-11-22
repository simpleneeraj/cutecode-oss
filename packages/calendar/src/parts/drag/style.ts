import { tv } from "tailwind-variants";

import { SlotLook } from "./store";

const lookVariants = {
  [SlotLook.Rest]: "",
  [SlotLook.Lifted]: "z-40 cursor-grabbing shadow-raised",
  [SlotLook.Locked]: "z-40 cursor-not-allowed",
  [SlotLook.Refused]:
    "z-40 cursor-not-allowed shadow-raised ring-2 ring-foreground/40 after:pointer-events-none after:absolute after:inset-0 after:rounded-field after:hatch",
};

export const dragSlotStyles = tv(
  {
    slots: {
      root: "group/slot absolute min-h-4.5 rounded-field",
      origin:
        "pointer-events-none absolute rounded-field outline-1.5 outline-foreground/25 outline-dashed -outline-offset-1",
    },
    variants: {
      look: {
        [SlotLook.Rest]: { root: lookVariants[SlotLook.Rest] },
        [SlotLook.Lifted]: { root: lookVariants[SlotLook.Lifted] },
        [SlotLook.Locked]: { root: lookVariants[SlotLook.Locked] },
        [SlotLook.Refused]: { root: lookVariants[SlotLook.Refused] },
      },
    },
  },
  { twMerge: false },
);

export const dragItemStyles = tv(
  {
    base: "rounded-field",
    variants: {
      look: lookVariants,
    },
  },
  { twMerge: false },
);

export const resizeGripStyles = tv(
  {
    slots: {
      root: "absolute inset-x-0 bottom-0 z-10 flex h-2 cursor-ns-resize touch-none items-end justify-center pb-0.5 opacity-0 transition-opacity duration-fade group-hover/slot:opacity-100 pointer-coarse:h-4 pointer-coarse:opacity-100 pointer-coarse:after:absolute pointer-coarse:after:inset-x-0 pointer-coarse:after:top-0 pointer-coarse:after:h-11",
      bar: "h-0.75 w-5.5 rounded-full bg-current opacity-60",
    },
  },
  { twMerge: false },
);

export const dragTipStyles = tv(
  {
    slots: {
      root: "pointer-events-none absolute start-0 z-50 flex h-6.5 items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-2.5 font-semibold text-background text-caption1 tabular-nums shadow-raised",
      icon: "size-3.5 shrink-0",
    },
    variants: {
      isBelow: {
        true: { root: "top-full mt-1.5" },
        false: { root: "bottom-full mb-1.5" },
      },
    },
  },
  { twMerge: false },
);

export const draftGhostStyles = tv(
  {
    slots: {
      root: "pointer-events-none absolute inset-x-0.5 z-30 flex min-h-4.5 flex-col overflow-hidden rounded-field px-2 py-1 font-semibold text-caption1 ring-1.5 ring-inset",
      time: "font-normal tabular-nums opacity-80",
    },
    variants: {
      isRefused: {
        true: { root: "hatch bg-card text-foreground ring-foreground/40" },
        false: { root: "bg-brand-soft text-brand-ink ring-brand" },
      },
    },
  },
  { twMerge: false },
);

export const dragHintStyles = tv({ base: "sr-only" }, { twMerge: false });
