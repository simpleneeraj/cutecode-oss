"use client";

import { motion } from "motion/react";
import { tv } from "tailwind-variants";
import { Separator } from "@/components/ui/separator";
import { usePlanStyleGuard } from "@/hooks/use-plan-style-guard";
import ThemeControl from "./themes";
import LanguageControl from "./language";
import SnippetsPopover from "./snippets-popover";
import OptionsControl from "./options";
import FontFaceControl from "./font-face";
import CanvasSizePopover from "./canvas-size/canvas-size-popover";
import TypingPopover from "./typing-popover";
import ExportButton from "../export";
import { dockDivider } from "./dock-styles";

const entrance = { type: "spring", stiffness: 380, damping: 32, delay: 0.1 } as const;

const dock = tv({
  slots: {
    root: "relative z-10 flex shrink-0 flex-col items-center gap-2 pt-2 sm:px-3 sm:pb-4",
    bar: [
      "scrollbar-hide w-full overflow-x-auto overscroll-x-contain border-t bg-background/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl",
      "sm:w-auto sm:max-w-full sm:rounded-2xl sm:border sm:border-border/60 sm:bg-popover/90 sm:pb-0 sm:shadow-lg",
    ],
    track: "flex h-16 w-max min-w-full items-center gap-0 px-1 sm:h-auto sm:min-w-0 sm:justify-start sm:gap-0.5 sm:p-1",
  },
});

const { root, bar, track } = dock();

export default function Controls() {
  usePlanStyleGuard();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={entrance} className={root()}>
      <div role="group" aria-label="Editor controls" className={bar()}>
        <div className={track()}>
          <ThemeControl />
          <FontFaceControl />
          <Separator orientation="vertical" className={dockDivider()} />
          <LanguageControl />
          <SnippetsPopover />
          <Separator orientation="vertical" className={dockDivider()} />
          <CanvasSizePopover />
          <Separator orientation="vertical" className={dockDivider()} />
          <TypingPopover />
          <Separator orientation="vertical" className={dockDivider()} />
          <ExportButton />
          <OptionsControl />
        </div>
      </div>
    </motion.div>
  );
}
