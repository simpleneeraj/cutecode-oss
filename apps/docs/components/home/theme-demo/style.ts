import { tv } from "tailwind-variants";

export const themeDemoStyles = tv(
  {
    slots: {
      root: "grid w-full gap-8 lg:grid-cols-12 lg:items-start lg:gap-10",
      panel:
        "flex min-w-0 flex-col gap-4 rounded-overlay squircle edge bg-background p-4 font-sans text-foreground shadow-raised transition-colors duration-color md:p-6 lg:col-span-8",
      panelHead: "flex flex-wrap items-center justify-between gap-3",
      greeting: "font-heading font-semibold text-foreground text-title3",
      panelBody: "grid gap-4 md:grid-cols-2",
      wall: "wallpaper flex items-center justify-center rounded-surface squircle p-4",
      buttons: "flex gap-2",
      button: "flex-1",
      controls: "flex min-w-0 flex-col gap-6 lg:sticky lg:top-24 lg:col-span-4",
      note: "text-pretty text-muted-foreground text-subheadline",
    },
  },
  { twMerge: false },
);
