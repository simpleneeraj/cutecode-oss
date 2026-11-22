import { tv } from "tailwind-variants";

export const quickEventStyles = tv(
  {
    slots: {
      popup:
        "w-86 data-ending-style:scale-94 data-starting-style:scale-94 motion-reduce:transition-opacity motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100",
      drawerBody: "flex flex-col gap-3 pt-8 pb-4",
      form: "flex min-w-0 flex-col gap-1",
      title:
        "h-11 w-full min-w-0 rounded-field font-semibold text-title3 tracking-tight has-focus-visible:shadow-focus has-aria-invalid:inset-ring-2 has-aria-invalid:inset-ring-destructive-foreground",
      hint: "px-1.5 pb-1 text-destructive-foreground text-footnote",
      row: "flex min-h-11 min-w-0 items-center gap-3 px-1.5",
      rowIcon: "size-4.75 shrink-0 text-muted-foreground",
      rowText: "flex min-w-0 flex-1 flex-col",
      rowPrimary: "truncate text-subheadline",
      rowSecondary: "truncate text-footnote text-muted-foreground tabular-nums",
      rowValue: "shrink-0 text-footnote text-muted-foreground tabular-nums",
      field: "min-w-0 flex-1",
      separator: "mx-1.5 my-1 h-px bg-border",
      actions: "flex justify-end gap-2 pt-2",
      submit: "max-sm:flex-1",
    },
  },
  { twMerge: false },
);

export const calendarOptionStyles = tv(
  {
    slots: {
      root: "flex min-w-0 items-center gap-2",
      tick: "size-3 shrink-0 rounded-full",
      name: "truncate",
    },
  },
  { twMerge: false },
);

export const inviteeStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1.5",
      chip: "flex h-8 max-w-full items-center gap-1 rounded-control bg-secondary ps-2.5 pe-1 font-semibold text-footnote",
      chipName: "truncate",
      remove: "hit-area rounded-full text-muted-foreground",
      removeIcon: "size-3.5",
      entry: "min-w-24 flex-1 text-subheadline",
    },
  },
  { twMerge: false },
);

export const quickEventExampleStyles = tv(
  {
    slots: {
      root: "flex min-w-0 flex-col gap-3",
      add: "self-start",
    },
  },
  { twMerge: false },
);

export const scopeStyles = tv(
  {
    slots: {
      form: "flex flex-col gap-4 px-6 pb-6",
      options: "flex flex-col gap-2",
      card: "flex min-h-14 cursor-pointer items-center gap-3 rounded-field bg-foreground/4 px-3.5 py-2.5 has-data-checked:bg-brand-soft has-focus-visible:shadow-focus",
      text: "flex min-w-0 flex-col gap-0.5",
      label: "font-semibold text-subheadline",
      detail: "text-footnote text-muted-foreground",
      actions: "flex gap-2 sm:justify-end",
      action: "flex-1 sm:flex-none",
    },
  },
  { twMerge: false },
);
