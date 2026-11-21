import { tv } from "tailwind-variants";

export const chromeStyles = tv(
  {
    slots: {
      iconButton:
        "press relative hit-area inline-flex size-11 shrink-0 items-center justify-center rounded-control text-foreground hover:bg-muted",
      icon: "size-5.5",
      searchField:
        "press inline-flex h-field w-full items-center gap-2 rounded-density-field bg-muted px-3 text-start text-density-subheadline text-muted-foreground hover:bg-secondary",
      searchIcon: "size-4 shrink-0",
      searchLabel: "flex-1 truncate",
      searchKeys: "flex gap-0.5",
      searchKey:
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-card px-1 text-caption1 font-medium text-muted-foreground shadow-rest",
      breadcrumb: "flex min-w-0 items-center gap-1 text-footnote text-muted-foreground",
      crumb: "truncate",
      crumbLink: "truncate hover:text-foreground",
      crumbIcon: "size-3.5 shrink-0",
      pager: "mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2",
      pagerCard:
        "press edge squircle flex flex-col gap-0.5 rounded-surface bg-card px-4 py-3.5 shadow-rest hover:shadow-raised",
      pagerNext: "sm:col-start-2 sm:text-end",
      pagerLabel: "text-footnote text-muted-foreground",
      pagerTitle: "text-body font-semibold text-brand-ink",
      links: "not-prose -mt-2 mb-8 flex flex-wrap gap-2",
      link: "press relative hit-area inline-flex h-8 items-center gap-1.5 rounded-control bg-card px-3 text-footnote font-semibold text-foreground shadow-rest hover:shadow-raised",
      linkIcon: "size-4 text-muted-foreground",
    },
  },
  { twMerge: false },
);
