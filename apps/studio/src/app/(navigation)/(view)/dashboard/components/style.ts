import { tv } from "tailwind-variants";

export const dashboardStyles = tv({
  slots: {
    root: "mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:px-6 md:py-8",
    header: "flex items-end justify-between gap-3",
    heading: "flex min-w-0 flex-col gap-0.5",
    title: "font-heading text-title3 font-semibold text-foreground",
    subtitle: "truncate text-density-subheadline text-muted-foreground",
    action: "h-control-medium shrink-0 px-control-inset-medium text-density-subheadline",
    icon: "size-4",
    columns: "grid grid-cols-1 gap-4 lg:grid-cols-3",
    main: "min-w-0 lg:col-span-2",
  },
});

export const statStyles = tv({
  slots: {
    root: "grid grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4",
    cell: "flex min-w-0 flex-col gap-1 bg-card px-4 py-3",
    label: "truncate text-density-footnote text-muted-foreground",
    value: "flex h-control-medium items-center",
    number: "text-title3 font-semibold text-foreground tabular-nums",
  },
});

export const viewsStyles = tv({
  slots: {
    header: "gap-0.5",
    label: "text-density-footnote",
    summary: "text-title3 tabular-nums",
    prompt: "text-density-body",
    chart: "relative h-56 w-full",
    placeholder: "size-full opacity-40",
    overlay: "absolute inset-0 flex items-center justify-center",
    loading: "size-full rounded-surface",
    tooltip: "flex flex-col gap-0.5 rounded-field edge bg-popover px-2.5 py-1.5 text-density-caption shadow-raised",
    tooltipDate: "text-muted-foreground",
    tooltipValue: "font-medium text-foreground tabular-nums",
  },
});

export const tableStyles = tv({
  slots: {
    root: "overflow-hidden",
    header: "border-b py-4",
    title: "text-density-body",
    description: "text-density-footnote",
    action: "h-control-small px-control-inset-small text-density-footnote",
    numericHead: "text-right",
    copyHead: "w-10",
    numeric: "text-right text-muted-foreground tabular-nums",
    date: "text-right text-density-footnote text-muted-foreground",
    titleCell: "flex max-w-56 min-w-0 flex-col",
    titleText: "block max-w-56 truncate font-medium text-foreground",
    titleLink: "truncate font-medium text-foreground hover:underline",
    slug: "truncate font-mono text-density-caption text-muted-foreground",
    copy: "size-control-small",
    copyStatus: "sr-only",
  },
});

export const accountStyles = tv({
  slots: {
    root: "flex h-fit min-w-0 flex-col gap-3",
    number: "tabular-nums",
    meter: "flex-1 py-1",
    meterHeader: "flex items-center justify-between gap-3",
    meterLabel: "font-normal text-muted-foreground",
    meterTrack: "h-1.5",
    button: "h-control-large w-full text-density-subheadline",
  },
});

export const skeletonStyles = tv({
  slots: {
    title: "h-6 w-32",
    subtitle: "h-4 w-48",
    action: "h-control-medium w-28 rounded-control",
    stats: "h-24 w-full rounded-surface",
    chart: "h-80 w-full rounded-surface",
    table: "h-80 rounded-surface lg:col-span-2",
    account: "h-64 rounded-surface",
  },
});
