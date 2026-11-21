import { tv } from "tailwind-variants";

export const themeBuilderStyles = tv(
  {
    slots: {
      root: "flex w-full flex-col gap-8 lg:flex-row lg:items-start",
      panel: "flex min-w-0 flex-col gap-7 lg:sticky lg:top-24 lg:w-96 lg:shrink-0",
      actions: "flex flex-wrap gap-2",
      actionsHint: "text-footnote text-muted-foreground",
      exportArea: "flex flex-col gap-3",
      preview:
        "flex min-w-0 flex-1 flex-col gap-5 rounded-overlay edge bg-background p-4 font-sans text-foreground shadow-raised md:p-6",
      previewGrid: "grid gap-5 md:grid-cols-2",
      column: "flex min-w-0 flex-col gap-5",
      stats: "grid grid-cols-3 gap-3",
      stat: "flex flex-col gap-1 p-3 md:p-4",
      statLabel: "truncate text-footnote text-muted-foreground",
      statValue: "font-heading font-semibold text-title3",
      statChange: "text-caption1 text-success-foreground",
      form: "flex flex-col gap-4 p-5",
      formTitle: "font-heading font-semibold text-body",
      field: "w-full",
      folders: "grid grid-cols-3 gap-4",
      code: "flex justify-center pt-2",
    },
  },
  { twMerge: false },
);
