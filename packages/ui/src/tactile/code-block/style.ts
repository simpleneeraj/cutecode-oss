import { tv } from "tailwind-variants";

export const codeBlockStyles = tv(
  {
    slots: {
      root: "relative w-full max-w-135 pt-7",
      backSheet: "absolute top-0 left-1/2 h-15 w-4/5 -translate-x-1/2 rounded-surface edge bg-card opacity-50 shadow-rest",
      middleSheet:
        "absolute top-3.5 left-1/2 h-15 w-9/10 -translate-x-1/2 rounded-surface edge bg-card opacity-80 shadow-rest",
      sheet: "relative overflow-hidden rounded-surface edge bg-card pt-5 pb-5.5 text-card-foreground shadow-raised",
      edge: "absolute top-0 left-0 h-1 w-3/5 bg-linear-to-r from-pink-ink to-brand opacity-80 blur-xs",
      saved: "absolute top-5 right-5 size-2.5 rounded-full bg-success",
      code: "flex flex-col overflow-x-auto font-mono text-footnote leading-7",
      children: "px-6",
      line: "flex gap-5 px-6",
      number: "w-4.5 shrink-0 select-none text-right text-syntax-comment",
    },
    variants: {
      isHighlighted: {
        true: { line: "bg-brand-soft" },
      },
    },
  },
  { twMerge: false },
);
