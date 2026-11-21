import type { Variants } from "motion/react";
import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";
import { FolderPose } from "../folder/style";

export enum FolderItem {
  Paper = "paper",
  Photo = "photo",
  AccentPhoto = "accent-photo",
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

const staggerStep = 0.03;

const openLifts = {
  [FolderItemPosition.Left]: { x: "-6%", y: "-20%", rotate: -3 },
  [FolderItemPosition.Center]: { x: "0%", y: "-14%", rotate: 0 },
  [FolderItemPosition.Right]: { x: "6%", y: "-8%", rotate: 3 },
};

export function readFolderItemVariants(position: FolderItemPosition, index: number): Variants {
  const transition = { ...motion.springSnappy, delay: index * staggerStep };
  return {
    [FolderPose.Closed]: { x: "0%", y: "0%", rotate: 0, transition },
    [FolderPose.Open]: { ...openLifts[position], transition },
  };
}

const neutralPhoto = {
  lines: "hidden",
  photo: "bg-secondary",
  firstBlob: "bg-foreground/16",
  secondBlob: "bg-card",
};

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
        [FolderItem.Photo]: neutralPhoto,
        [FolderItem.AccentPhoto]: {
          lines: "hidden",
          photo: "bg-brand-soft",
          firstBlob: "bg-brand",
          secondBlob: "bg-brand/35",
        },
        [FolderItem.Sunset]: neutralPhoto,
        [FolderItem.Bloom]: neutralPhoto,
        [FolderItem.Meadow]: neutralPhoto,
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
