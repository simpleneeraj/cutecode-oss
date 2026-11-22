import { tv } from "tailwind-variants";

export const customizerStyles = tv(
  {
    slots: {
      triggerLabel: "max-sm:sr-only",
      controls: "flex min-w-0 flex-col gap-7",
      section: "flex min-w-0 flex-col gap-3",
      sectionTitle: "font-semibold text-foreground text-subheadline",
      strip: "flex min-w-0 snap-x snap-mandatory scroll-px-2 gap-3 overflow-x-auto overscroll-x-contain p-2 pb-3",
      option:
        "press relative flex shrink-0 cursor-pointer snap-start flex-col gap-2 rounded-surface edge bg-card p-2 text-left shadow-rest outline-none focus-visible:shadow-focus data-checked:outline-2 data-checked:outline-brand data-checked:outline-offset-2 data-checked:outline-solid",
      check:
        "pointer-events-none absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-card text-brand shadow-rest",
      checkIcon: "size-6",
      optionText: "flex flex-col gap-0.5 px-1 pb-1",
      optionName: "font-semibold text-foreground text-subheadline",
      optionFeel: "text-footnote text-muted-foreground",
      styleOption: "w-44",
      styleSample: "flex flex-col gap-2 rounded-field bg-background p-2.5 font-sans text-foreground",
      sampleCard: "flex flex-col gap-1.5 rounded-surface edge bg-card p-2.5 shadow-rest",
      sampleLine: "h-1.5 w-12 rounded-control bg-muted",
      sampleField: "h-6 rounded-field edge bg-card inset-ring inset-ring-input",
      sampleButton:
        "inline-flex h-6 items-center justify-center self-start rounded-control bg-primary px-3 font-semibold text-caption1 text-primary-foreground shadow-rest",
      paletteOption: "w-22 items-center px-2 pt-3",
      swatch: "size-10 rounded-full bg-brand shadow-rest",
      paletteName: "pb-1 font-medium text-footnote text-foreground",
      fontOption: "w-40",
      fontSample: "flex h-24 flex-col gap-1 overflow-hidden rounded-field bg-background p-3 text-foreground",
      fontHeading: "font-heading font-semibold text-3xl",
      fontBody: "line-clamp-2 font-sans text-footnote text-muted-foreground",
      suggestion: "flex min-h-11 items-center justify-between gap-3 rounded-field bg-muted py-1 pr-1 pl-3",
      suggestionText: "text-footnote text-muted-foreground",
      themeLabel: "flex items-center gap-1.5",
      swapLabel: "inline-flex items-center gap-1.5",
      footer: "flex-row justify-between sm:justify-between",
    },
  },
  { twMerge: false },
);
