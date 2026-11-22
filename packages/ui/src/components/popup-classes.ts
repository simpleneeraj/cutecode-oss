export const popupClassNames = {
  glass: "glass squircle rounded-density-control edge text-foreground shadow-raised",
  anchored:
    "relative flex max-h-full min-w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden",
  inputButton:
    "hit-area absolute inset-y-0.5 end-0.5 inline-flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  inputStartAddon:
    "pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center ps-row-inset text-muted-foreground [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
  inputShell: "relative not-has-[>*.w-full]:w-fit w-full text-foreground has-disabled:opacity-64",
};
