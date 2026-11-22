import { tv } from "tailwind-variants";

export const windowLights = ["close", "minimize", "zoom"];

export const windowStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col overflow-hidden rounded-surface squircle edge bg-card text-card-foreground shadow-raised",
      bar: "relative flex h-12 shrink-0 items-center px-4.5",
      lights: "flex items-center gap-2",
      light: "size-3 rounded-full bg-window-light inset-ring inset-ring-foreground/10",
      title: "absolute inset-x-20 truncate text-center font-medium text-density-footnote text-muted-foreground",
      body: "px-6 pt-2 pb-6",
    },
  },
  { twMerge: false },
);
