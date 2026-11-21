import { tv } from "tailwind-variants";

export const foundationsStyles = tv(
  {
    slots: {
      root: "grid w-full max-w-300 gap-5 md:grid-cols-3",
      card: "flex flex-col gap-3.5 rounded-surface edge bg-card p-7 text-card-foreground shadow-rest",
      title: "font-semibold text-title3",
      description: "text-muted-foreground text-subheadline",
    },
  },
  { twMerge: false },
);
