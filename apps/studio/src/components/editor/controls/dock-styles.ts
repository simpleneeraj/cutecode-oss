import { tv } from "tailwind-variants";

export const dockTrigger = tv({
  base: [
    "relative font-medium text-density-subheadline text-foreground data-popup-open:bg-muted",
    "max-sm:h-auto max-sm:min-h-control-large max-sm:w-auto max-sm:min-w-control-large max-sm:flex-1 max-sm:flex-col max-sm:justify-center max-sm:gap-1 max-sm:px-1 max-sm:py-1.5",
  ],
  variants: {
    shape: {
      icon: "size-control-large",
      label: "h-control-large gap-1.5 px-control-inset-small",
    },
  },
  defaultVariants: {
    shape: "icon",
  },
});

export const dockDivider = tv({
  base: "mx-0.5 hidden h-5 w-px bg-border sm:block",
});

export const dockLabel = tv({
  base: "text-density-caption text-muted-foreground sm:hidden",
});

export const dockPopup = tv({
  base: "glass squircle rounded-density-overlay edge text-foreground shadow-raised",
});

export const dockSearch = tv({
  slots: {
    root: "border-b border-border p-1.5",
    icon: "size-4",
  },
});

export const panelButton = tv({
  base: "h-control-small px-control-inset-small text-density-footnote",
});

export const panelText = tv({
  variants: {
    tone: {
      body: "text-density-subheadline text-foreground",
      hint: "text-density-footnote text-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "hint",
  },
});

export const dockPopover = tv({
  slots: {
    glyph: "size-4.5",
    caption: "text-density-footnote text-muted-foreground tabular-nums max-sm:text-density-caption",
    dot: "absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand",
    popup: "text-wrap",
    content: "flex flex-col gap-2 py-1",
  },
});

export const segmentedControl = tv({
  slots: {
    group: "w-full",
    segment: "flex-1 tabular-nums in-data-[slot=toggle-group]:h-control-small",
    glyph: "size-4",
  },
});
