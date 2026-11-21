import type { Variants } from "motion/react";
import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";
import { FolderPose } from "../folder/style";

export const folderStickerVariants = {
  [FolderPose.Closed]: { y: "0%", rotate: 0, transition: motion.springSnappy },
  [FolderPose.Open]: { y: "-10%", rotate: 4, transition: motion.springSnappy },
} satisfies Variants;

export const folderStickerStyles = tv(
  {
    slots: {
      root: "absolute top-1/3 right-1/12 z-20 rotate-8",
      clip: "absolute -top-4 right-1 size-6.5 rotate-18 text-muted-foreground",
    },
  },
  { twMerge: false },
);
