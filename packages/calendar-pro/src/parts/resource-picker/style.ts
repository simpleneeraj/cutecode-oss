import { tv } from "tailwind-variants";

export const resourcePickerStyles = tv(
  {
    slots: {
      root: "-mx-4 flex min-w-0 snap-x gap-2 overflow-x-auto px-4 pb-1",
      option:
        "press relative isolate flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full bg-card ps-1.5 pe-3.5 font-semibold text-subheadline shadow-rest outline-none transition-colors focus-visible:shadow-focus",
      thumb: "-z-10 absolute inset-0 rounded-full bg-brand-soft",
      name: "max-w-40 truncate",
    },
    variants: {
      isSelected: {
        true: { option: "text-brand-ink shadow-none" },
        false: { option: "text-foreground" },
      },
    },
  },
  { twMerge: false },
);
