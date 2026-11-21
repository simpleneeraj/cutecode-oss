import { tv } from "tailwind-variants";

export const docsTeaserStyles = tv(
  {
    slots: {
      preview: "flex w-full min-w-0 flex-col gap-3",
      previewTitle: "font-heading font-semibold text-foreground text-title3",
      previewLead: "text-muted-foreground text-subheadline",
      stage: "wallpaper flex min-h-60 items-center justify-center rounded-surface squircle p-6",
      stageContent: "flex w-full",
      code: "w-full whitespace-pre-wrap wrap-anywhere font-mono text-caption1/5 text-foreground",
      keyword: "text-brand-ink",
      type: "text-syntax-type",
      string: "text-syntax-string",
      links: "grid w-full gap-3 md:grid-cols-3 md:gap-4",
      link: "press group flex min-h-18 items-center gap-3 rounded-surface squircle edge bg-card p-3 pr-4 text-card-foreground shadow-rest outline-none transition duration-snappy ease-snappy hover:shadow-raised focus-visible:shadow-focus",
      linkText: "flex min-w-0 flex-1 flex-col",
      linkTitle: "font-semibold text-body text-foreground",
      linkLine: "truncate text-muted-foreground text-subheadline",
      linkIcon: "size-4.5 shrink-0 text-muted-foreground",
    },
    variants: {
      isPreview: {
        true: { stageContent: "w-44" },
      },
    },
  },
  { twMerge: false },
);
