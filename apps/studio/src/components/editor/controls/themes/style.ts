import { tv } from "tailwind-variants";

export const themeStyles = tv({
  slots: {
    tile: "shrink-0 p-px",
    tileFrame: "grid size-full place-items-center overflow-hidden rounded-xs bg-muted ring-1 ring-border ring-inset",
    gradient: "size-full",
    glyph: "shrink-0",
    tileImage: "size-3/5 object-contain",
    triggerIcon: "size-4.5",
    rowIcon: "size-5",
    trigger: "max-w-44 justify-between",
    value: "flex min-w-0 items-center gap-2",
    valueName: "hidden truncate sm:inline",
    chevron: "hidden size-3.5 text-muted-foreground sm:block",
    row: "flex min-w-0 flex-row items-center gap-2 text-start",
    rowName: "min-w-0 truncate",
    badgeIcon: "size-3",
    sponsorLogo: "size-3 rounded-xs",
    footer: "border-t border-border p-1.5",
    footerButton: "w-full",
  },
});
