import { tv } from "tailwind-variants";

export const sectionHeadingStyles = tv(
  {
    slots: {
      root: "flex max-w-170 flex-col items-start gap-3",
      eyebrow: "flex font-semibold text-brand-ink text-footnote",
      title: "text-balance font-heading font-semibold text-3xl/9 text-foreground tracking-tight md:text-5xl/13",
      lead: "text-pretty text-body/6 text-muted-foreground md:text-lg/7",
      extra: "flex flex-col items-start gap-5 pt-2",
    },
    variants: {
      isCentered: {
        true: { root: "items-center self-center text-center", extra: "items-center" },
      },
    },
  },
  { twMerge: false },
);
