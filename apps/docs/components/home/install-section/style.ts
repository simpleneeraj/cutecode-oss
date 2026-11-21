import { tv } from "tailwind-variants";

export const installSectionStyles = tv(
  {
    slots: {
      command: "flex w-full max-w-140 flex-col items-center gap-3 self-center",
      note: "text-pretty text-center text-footnote text-muted-foreground",
      code: "rounded-field bg-secondary px-1.5 py-0.5 font-mono text-caption1 text-foreground",
      steps: "grid w-full gap-3 md:grid-cols-3 md:gap-4",
      step: "flex items-start gap-3 rounded-surface squircle edge bg-card p-4 shadow-rest md:p-5",
      number:
        "grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-footnote text-foreground tabular-nums",
      text: "flex min-w-0 flex-col gap-0.5",
      title: "font-semibold text-body text-foreground",
      body: "text-muted-foreground text-subheadline",
    },
  },
  { twMerge: false },
);
