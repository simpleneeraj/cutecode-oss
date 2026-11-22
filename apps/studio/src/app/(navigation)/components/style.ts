import { tv } from "tailwind-variants";

export const headerStyles = tv({
  slots: {
    root: "relative z-20 flex shrink-0 justify-center px-2 pt-2 md:px-4 md:pt-3",
    brandMark: "flex items-center gap-2",
    brandName: "text-density-body whitespace-nowrap max-sm:sr-only",
    location: "hidden items-center gap-2 text-density-body whitespace-nowrap text-muted-foreground lg:flex",
    locationDivider: "text-muted-foreground/40",
    tabBar: "order-last flex shrink-0 justify-center px-2 pb-safe-inset md:hidden",
    tabBarInset: "flex max-w-full py-2",
  },
});

export const controlStyles = tv({
  slots: {
    group: "flex items-center gap-1.5",
    button: "h-control-medium gap-1 px-control-inset-medium text-density-subheadline",
    iconButton: "size-control-medium",
    icon: "size-4",
    wideOnly: "max-sm:hidden",
    phoneOnly: "sm:hidden",
  },
});

export const paginationStyles = tv({
  slots: {
    root: "flex items-center justify-center gap-2 pt-2",
    button: "h-control-medium gap-1 px-control-inset-medium text-density-subheadline",
    icon: "size-4",
    count: "px-2 text-density-footnote tabular-nums text-muted-foreground",
  },
});
