import { tv } from "tailwind-variants";

export const snippetsStyles = tv({
  slots: {
    root: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8",
    header: "flex items-end justify-between gap-3",
    heading: "flex min-w-0 flex-col gap-0.5",
    title: "font-heading text-title3 font-semibold text-foreground",
    subtitle: "truncate text-density-subheadline text-muted-foreground",
    action: "h-control-medium shrink-0 px-control-inset-medium text-density-subheadline",
    icon: "size-4",
    emptyAction: "h-control-small px-control-inset-small text-density-footnote",
    grid: "grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3",
  },
});

export const snippetCardStyles = tv({
  slots: {
    link: "flex flex-col gap-2 rounded-density-surface outline-none focus-visible:shadow-focus",
    meta: "flex min-w-0 flex-col gap-0.5 px-1",
    title: "truncate text-density-subheadline font-medium text-foreground",
    detail: "truncate text-density-caption text-muted-foreground",
    preview: "aspect-video w-full rounded-density-surface",
    titleLine: "h-4 w-2/3",
    detailLine: "h-3 w-1/3",
  },
});
