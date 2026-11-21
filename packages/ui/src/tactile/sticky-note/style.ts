import { tv } from "tailwind-variants";

export const stickyNoteStyles = tv(
  {
    slots: {
      root: "relative w-52.5 max-w-full -rotate-4 rounded-field rounded-br-surface edge bg-note px-4.5 pt-5 pb-5.5 font-medium text-body text-note-ink shadow-raised",
      tape: "absolute -top-2.5 left-1/2 h-5 w-18 -translate-x-1/2 -rotate-3 bg-glass shadow-press",
    },
  },
  { twMerge: false },
);
