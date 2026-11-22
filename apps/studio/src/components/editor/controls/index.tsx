"use client";

import { motion } from "motion/react";
import { tv } from "tailwind-variants";
import { Separator } from "@cutecode/ui/components/separator";
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
      "scrollbar-hide glass w-full overflow-x-auto overscroll-x-contain border-t border-border",
      "sm:w-auto sm:max-w-full sm:rounded-2xl sm:edge sm:shadow-glass",
    ],
    track: "flex w-max min-w-full items-center gap-0.5 p-1 sm:min-w-0 sm:justify-start",
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
