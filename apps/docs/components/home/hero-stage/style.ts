import { tv } from "tailwind-variants";

import { ScenePlace } from "./constants";

export const heroStageStyles = tv(
  {
    slots: {
      root: "relative w-full overflow-hidden rounded-overlay squircle wallpaper lg:h-145",
      desktop: "hidden lg:block",
      phone: "flex flex-col items-center gap-6 px-4 pt-6 pb-5 lg:hidden",
      windowBody: "flex gap-5",
      sidebar: "hidden w-32 shrink-0 flex-col gap-0.5 xl:flex",
      sidebarLabel: "px-2 pt-2 pb-1 font-semibold text-caption1 text-muted-foreground",
      sidebarRow: "flex h-8 items-center gap-2 rounded-field px-2 text-foreground text-subheadline",
      sidebarIcon: "size-4.5 shrink-0 text-muted-foreground",
      tagDot: "size-2.5 shrink-0 rounded-full bg-foreground/28",
      windowMain: "flex min-w-0 flex-1 flex-col gap-4 pt-3",
      windowGrid: "grid grid-cols-3 gap-4",
      windowStatus: "text-center text-footnote text-muted-foreground",
      dock: "glass flex items-center gap-2.5 rounded-control edge p-2 shadow-glass",
      ticket: "flex w-67",
      sticky: "flex w-49",
      phoneDeck: "flex w-full justify-center",
      phoneFolders: "grid w-full max-w-80 grid-cols-2 gap-6",
      phoneRow: "flex w-full max-w-80 items-center justify-between gap-4",
      phoneSticky: "flex w-40",
      phoneIcons: "grid shrink-0 grid-cols-2 gap-3",
    },
    variants: {
      isCurrent: {
        true: { sidebarRow: "bg-foreground/6 font-semibold" },
      },
      isAccent: {
        true: { tagDot: "bg-brand" },
      },
    },
  },
  { twMerge: false },
);

export const sceneLayerStyles = tv(
  {
    base: "absolute",
    variants: {
      place: {
        [ScenePlace.Window]: "top-14 left-1/20 z-10 w-15/28",
        [ScenePlace.Notifications]: "top-10 right-1/28 z-30 w-17/56",
        [ScenePlace.Ticket]: "right-1/20 bottom-24 z-10 rotate-5",
        [ScenePlace.Sticky]: "top-88 left-9/20 z-20 xl:left-8/15",
        [ScenePlace.Dock]: "bottom-5 left-1/2 z-20 -translate-x-1/2",
      },
    },
  },
  { twMerge: false },
);
