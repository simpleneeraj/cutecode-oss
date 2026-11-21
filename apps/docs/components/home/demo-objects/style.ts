import { tv } from "tailwind-variants";

export const ticketFaceStyles = tv(
  {
    slots: {
      label: "font-semibold text-caption2 text-muted-foreground uppercase tracking-wider",
      name: "font-heading font-semibold text-foreground text-title3",
      when: "text-footnote text-muted-foreground",
      seats: "flex gap-4",
      seat: "flex flex-col",
      seatLabel: "font-semibold text-caption2 text-muted-foreground uppercase tracking-wider",
      seatValue: "font-semibold text-body text-foreground tabular-nums",
    },
  },
  { twMerge: false },
);
