import { tv } from "tailwind-variants";

export enum CodeTone {
  Keyword = "keyword",
  Function = "function",
  Parameter = "parameter",
  Type = "type",
  String = "string",
  Punctuation = "punctuation",
}

export const authLayoutStyles = tv({
  slots: {
    root: "grid min-h-dvh bg-background text-foreground lg:grid-cols-2",
    column: "flex flex-col px-4 py-4 sm:px-8 sm:py-6",
    header: "flex h-control-large items-center",
    brand:
      "relative flex items-center gap-2 rounded-control outline-none transition-opacity hover:opacity-80 focus-visible:shadow-focus",
    brandName: "font-heading text-density-body font-semibold tracking-tight",
    main: "flex flex-1 items-center justify-center py-8",
    content: "flex w-full max-w-sm flex-col gap-5",
    legal: "text-pretty text-center text-density-footnote text-muted-foreground",
    legalLink: "underline underline-offset-2 hover:text-foreground",
  },
});

export const authCardStyles = tv({
  slots: {
    card: "w-full",
    header: "justify-items-center text-center",
    title: "font-heading text-title3 tracking-tight",
    panel: "flex flex-col gap-5",
    form: "flex flex-col gap-4",
    labelRow: "flex w-full items-center justify-between gap-2",
    inlineLink:
      "hit-area relative rounded-control text-density-footnote font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:shadow-focus",
    submit: "h-control-large w-full px-control-inset-medium text-density-body",
    footer: "flex-wrap justify-center gap-1 border-t text-density-subheadline text-muted-foreground",
    footerLink:
      "hit-area relative inline-flex items-center gap-1.5 rounded-control font-medium text-foreground outline-none hover:underline focus-visible:shadow-focus",
    footerIcon: "size-3.5",
  },
});

export const rememberStyles = tv({
  base: "flex min-h-control-medium cursor-pointer select-none items-center gap-2.5 text-density-subheadline text-muted-foreground",
  variants: { isDisabled: { true: "cursor-not-allowed opacity-64" } },
});

export const sentNoticeStyles = tv({
  slots: {
    root: "flex flex-col items-center gap-4 text-center",
    badge: "flex size-12 items-center justify-center rounded-full bg-muted text-foreground",
    badgeIcon: "size-6",
    copy: "flex flex-col gap-1.5",
    title: "font-heading text-title3 font-semibold tracking-tight",
    body: "text-pretty text-density-subheadline text-muted-foreground",
    email: "break-all font-medium text-foreground",
  },
});

export const socialAuthStyles = tv({
  slots: {
    root: "flex flex-col gap-5",
    buttons: "grid grid-cols-2 gap-2",
    button: "h-control-large w-full px-control-inset-medium text-density-body",
    divider: "flex items-center gap-3",
    line: "flex-1",
    label: "text-density-footnote text-muted-foreground",
  },
});

export const showcaseStyles = tv({
  slots: {
    root: "hidden p-2 lg:flex",
    stage:
      "wallpaper flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden rounded-overlay squircle px-12",
    figure: "w-full max-w-md",
    code: "font-mono text-density-footnote leading-6",
    caption:
      "max-w-sm text-balance text-center font-heading text-2xl font-semibold tracking-tight text-foreground",
  },
});

export const codeToneStyles = tv({
  variants: {
    tone: {
      [CodeTone.Keyword]: "text-brand-ink",
      [CodeTone.Function]: "font-semibold text-foreground",
      [CodeTone.Parameter]: "text-foreground",
      [CodeTone.Type]: "text-brand-ink",
      [CodeTone.String]: "text-muted-foreground",
      [CodeTone.Punctuation]: "text-muted-foreground",
    },
  },
});
