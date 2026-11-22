import { tv } from "tailwind-variants";

export const eventDetailsStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3",
      heading: "flex min-w-0 flex-col gap-0.5",
      title: "font-heading font-semibold text-title3 tracking-tight wrap-anywhere",
      when: "text-muted-foreground text-subheadline tabular-nums",
      rows: "flex flex-col gap-1",
      row: "flex min-h-10 min-w-0 items-center gap-3 text-subheadline",
      rowIcon: "size-4.75 shrink-0 text-muted-foreground",
      rowText: "min-w-0 flex-1 truncate",
      tick: "size-3 shrink-0 rounded-full",
      people: "flex min-w-0 flex-1 flex-col",
      person: "flex min-h-8 min-w-0 items-center justify-between gap-2",
      personName: "truncate",
      answer: "flex shrink-0 items-center gap-1 text-footnote text-muted-foreground",
      answerIcon: "size-3.75",
      notes: "whitespace-pre-line text-muted-foreground text-subheadline wrap-anywhere",
      actions: "flex gap-2 pt-1",
      action: "flex-1",
    },
  },
  { twMerge: false },
);
