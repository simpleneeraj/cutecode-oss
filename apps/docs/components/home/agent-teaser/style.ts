import { tv } from "tailwind-variants";

export const agentTeaserStyles = tv(
  {
    slots: {
      copy: "lg:order-last",
      mock: "flex w-full min-w-0 flex-col gap-3",
      chat: "flex flex-col gap-3",
      bubble:
        "max-w-4/5 self-end text-pretty rounded-surface bg-secondary px-3.5 py-2 text-foreground text-subheadline",
      reply: "flex flex-col gap-2",
      tool: "flex min-w-0 items-center gap-2 text-footnote text-muted-foreground",
      toolIcon: "size-4.5 shrink-0 text-success",
      toolName: "font-semibold text-foreground",
      toolCode: "truncate font-mono text-caption1 text-foreground",
      code: "whitespace-pre-wrap wrap-anywhere rounded-field bg-secondary p-3 font-mono text-caption1/5 text-foreground",
      keyword: "text-brand-ink",
      type: "text-syntax-type",
      string: "text-syntax-string",
      comment: "text-syntax-comment",
      llms: "flex flex-col gap-3 rounded-surface squircle edge bg-card p-4 text-card-foreground shadow-rest",
      llmsHead: "flex items-center justify-between gap-3",
      llmsName: "flex min-w-0 items-center gap-2 truncate font-semibold text-foreground text-subheadline",
      llmsIcon: "size-4.5 shrink-0 text-muted-foreground",
    },
  },
  { twMerge: false },
);
