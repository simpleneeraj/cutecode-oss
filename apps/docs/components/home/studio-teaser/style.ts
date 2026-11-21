import { tv } from "tailwind-variants";

export const studioTeaserStyles = tv(
  {
    slots: {
      root: "flex w-full max-w-300 flex-col gap-12 rounded-overlay edge bg-card p-6 text-card-foreground shadow-rest md:p-12 lg:flex-row lg:items-center",
      copy: "flex flex-col items-start gap-3.5 lg:flex-1",
      title: "font-semibold text-3xl tracking-tight md:text-4xl",
      description: "text-pretty text-lg text-muted-foreground",
      preview: "flex min-w-0 justify-center lg:flex-1",
      keyword: "text-syntax-keyword",
      type: "text-syntax-type",
      string: "text-syntax-string",
    },
  },
  { twMerge: false },
);
