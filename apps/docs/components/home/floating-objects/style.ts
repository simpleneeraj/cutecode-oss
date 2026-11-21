import { tv } from "tailwind-variants";

export const floatingObjectsStyles = tv(
  {
    slots: {
      root: "pointer-events-none absolute inset-0 hidden xl:block",
      note: "absolute top-36 left-8",
      notifications: "absolute top-24 right-6 w-90 origin-top-right scale-80",
      folder: "absolute bottom-8 left-16 w-52 -rotate-3",
      solarCard:
        "absolute right-16 bottom-16 flex rotate-3 flex-col gap-3 rounded-surface edge bg-card p-4.5 text-card-foreground shadow-raised",
      solarTitle: "font-semibold text-subheadline",
      solarIcons: "flex gap-2.5",
    },
  },
  { twMerge: false },
);
