import { tv } from "tailwind-variants";

import { CalendarTone } from "../../types";

export const toneStyles = tv(
  {
    slots: {
      body: "",
      text: "",
      bar: "",
      meta: "",
    },
    variants: {
      tone: {
        [CalendarTone.Accent]: { body: "bg-tone-accent", text: "text-tone-accent-ink", bar: "bg-tone-accent-bar", meta: "opacity-80" },
        [CalendarTone.Ink]: { body: "bg-tone-ink", text: "text-foreground", bar: "bg-foreground/70", meta: "opacity-80" },
        [CalendarTone.Grey]: { body: "bg-tone-grey", text: "text-foreground", bar: "bg-foreground/26", meta: "opacity-80" },
        [CalendarTone.Line]: {
          body: "bg-card ring-1 ring-foreground/12 ring-inset",
          text: "text-foreground",
          bar: "bg-foreground/14",
          meta: "opacity-80",
        },
      },
    },
    defaultVariants: {
      tone: CalendarTone.Grey,
    },
  },
  { twMerge: false },
);
