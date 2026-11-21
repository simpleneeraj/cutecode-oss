import { tv } from "tailwind-variants";

export const styleSwitcherStyles = tv({
  slots: {
    panel: "flex w-72 max-w-full flex-col gap-4",
    group: "flex flex-col gap-2",
    caption: "font-medium text-footnote text-muted-foreground",
    strip: "max-w-full overflow-x-auto",
    swatch: "size-5 rounded-full bg-brand shadow-rest",
    themeLabel: "flex items-center gap-1.5",
  },
});
