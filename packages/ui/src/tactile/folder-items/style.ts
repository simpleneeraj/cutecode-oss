import { tv } from "tailwind-variants";

export enum FolderItem {
  Paper = "paper",
  Sunset = "sunset",
  Bloom = "bloom",
  Meadow = "meadow",
}

enum FolderItemPosition {
  Left = "left",
  Center = "center",
  Right = "right",
}

export const folderItemPositions = [FolderItemPosition.Left, FolderItemPosition.Center, FolderItemPosition.Right];

export const paperLineIds = ["first", "second", "third", "fourth", "fifth", "sixth"];

export const folderItemsStyles = tv(
  {
    slots: {
      root: "absolute inset-x-1/8 top-0 isolate h-3/5",
      item: "absolute top-0 h-full w-5/12 overflow-hidden rounded-field bg-card shadow-icon",
      photo: "absolute inset-1 overflow-hidden rounded-field opacity-90",
      firstBlob: "absolute -bottom-1/8 -left-1/8 size-3/4 rounded-full blur-lg",
      secondBlob: "absolute -top-1/8 -right-1/8 size-3/4 rounded-full blur-lg",
      lines: "absolute inset-x-3 inset-y-3.5 flex flex-col gap-2.5",
      line: "h-px shrink-0 bg-border",
    },
    variants: {
      item: {
        [FolderItem.Paper]: { photo: "hidden" },
        [FolderItem.Sunset]: {
          lines: "hidden",
          photo: "bg-orange",
          firstBlob: "bg-brand",
          secondBlob: "bg-warning",
        },
        [FolderItem.Bloom]: {
          lines: "hidden",
          photo: "bg-purple",
          firstBlob: "bg-purple-ink",
          secondBlob: "bg-pink-ink",
        },
        [FolderItem.Meadow]: {
          lines: "hidden",
          photo: "bg-green",
          firstBlob: "bg-success",
          secondBlob: "bg-teal-ink",
        },
      },
      position: {
        [FolderItemPosition.Left]: { item: "left-0 -rotate-9" },
        [FolderItemPosition.Center]: { item: "-top-2 left-7/24 z-10 rotate-2" },
        [FolderItemPosition.Right]: { item: "right-0 rotate-10" },
      },
    },
  },
  { twMerge: false },
);
