import { tv } from "tailwind-variants";

export const profileStyles = tv({
  slots: {
    scroll: "layout-fill layout-scroll",
    root: "mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:py-8",
    center: "layout-fill flex items-center justify-center px-4",
    header: "flex-row items-center gap-4 p-4 max-sm:flex-wrap",
    avatar: "size-14 rounded-icon text-title3",
    avatarFallback: "rounded-icon",
    info: "flex min-w-0 flex-1 flex-col gap-1",
    name: "truncate font-heading text-title3 font-semibold text-foreground",
    meta: "flex flex-wrap items-center gap-2 text-density-footnote text-muted-foreground",
    plan: "capitalize",
    followers: "flex items-center gap-1",
    followersIcon: "size-3.5",
    divider: "text-muted-foreground/50",
    follow: "h-control-medium shrink-0 px-control-inset-medium text-density-subheadline max-sm:w-full",
    section: "flex flex-col gap-3",
    sectionTitle: "px-1 text-density-footnote font-semibold text-muted-foreground",
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    cardSkeleton: "h-48 rounded-surface",
    avatarSkeleton: "size-14 rounded-icon",
    nameSkeleton: "h-5 w-40",
    metaSkeleton: "h-4 w-24",
  },
});
