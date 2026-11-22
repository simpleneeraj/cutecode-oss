import { tv } from "tailwind-variants";

export const monthGridStyles = tv(
  {
    slots: {
      root: "relative flex min-w-0 flex-col outline-none",
      head: "grid grid-cols-7 border-foreground/8 border-b pt-3 pb-2",
      weekday: "text-center font-semibold text-caption2 text-muted-foreground uppercase tracking-wide",
      weekdayShort: "@max-md:hidden",
      weekdayNarrow: "@md:hidden",
      weeks: "grid h-112 @md:h-136 @lg:h-152",
      week: "relative grid min-h-0 grid-cols-7 border-foreground/8 border-b last:border-b-0",
    },
  },
  { twMerge: false },
);

export const monthCellStyles = tv(
  {
    slots: {
      root: "relative flex min-w-0 cursor-pointer select-none flex-col border-foreground/8 border-s outline-none transition-colors duration-fade first:border-s-0 focus-visible:z-2 focus-visible:shadow-focus",
      number:
        "mx-1 my-0.75 grid h-6.5 min-w-6.5 place-items-center self-start rounded-full px-1 font-semibold text-footnote tabular-nums",
      barSlot: "absolute start-0 z-1 grid @max-md:hidden",
      chips: "flex min-h-0 flex-col gap-0.5 overflow-hidden px-1 pb-1.5 @max-md:hidden",
      chipItem: "relative flex min-w-0 flex-col",
      dots: "flex justify-center gap-0.5 @md:hidden",
      dot: "size-1.5 rounded-full bg-foreground/40",
      more: "press flex h-6 shrink-0 cursor-pointer items-center gap-1 rounded-field px-1.5 text-start font-semibold text-caption1 text-muted-foreground outline-none hover:bg-foreground/6 focus-visible:shadow-focus",
    },
    variants: {
      inMonth: {
        false: { root: "bg-foreground/2.5", number: "text-foreground/32" },
      },
      isSelected: {
        true: { root: "bg-brand-soft" },
      },
      isToday: {
        true: { number: "bg-foreground text-background" },
      },
      isWeekend: {
        true: {},
      },
    },
    compoundVariants: [
      { isToday: false, isSelected: true, class: { number: "text-brand-ink" } },
      { isToday: false, isSelected: false, inMonth: true, isWeekend: true, class: { number: "text-muted-foreground" } },
    ],
  },
  { twMerge: false },
);

export const monthChipStyles = tv(
  {
    slots: {
      root: "press flex h-6 min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-field px-1.5 text-start text-caption1 text-foreground outline-none hover:bg-foreground/6 focus-visible:shadow-focus",
      dot: "size-1.5 shrink-0 rounded-full",
      title: "min-w-0 truncate font-medium",
      time: "ms-auto shrink-0 text-muted-foreground tabular-nums",
    },
    variants: {
      isPast: {
        true: { root: "opacity-50" },
      },
      isStruck: {
        true: { title: "line-through" },
      },
      isHatched: {
        true: { root: "hatch" },
      },
    },
  },
  { twMerge: false },
);
