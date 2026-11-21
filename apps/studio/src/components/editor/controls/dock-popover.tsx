import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { Icon } from "@solar-icons/react/lib/types";
import { Button } from "@cutecode/ui/components/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@cutecode/ui/components/popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";
import { dockLabel, dockPopup, dockTrigger } from "./dock-styles";

type DockPopoverProps = {
  label: string;
  icon: Icon;
  caption?: string;
  mobileLabel?: string;
  hasDot?: boolean;
  children: ReactNode;
};

export default function DockPopover({
  label,
  icon: Glyph,
  caption,
  mobileLabel,
  hasDot = false,
  children,
}: DockPopoverProps) {
  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size={caption ? "default" : "icon"}
                  aria-label={label}
                  className={dockTrigger({ shape: caption ? "label" : "icon" })}
                  render={<motion.button whileTap={{ scale: 0.92 }} />}
                />
              }
            />
          }
        >
          <Glyph className="size-4.5" aria-hidden="true" />
          {caption && (
            <span className="text-xs text-muted-foreground tabular-nums max-sm:text-[10px] max-sm:leading-none">{caption}</span>
          )}
          {!caption && mobileLabel && <span className={dockLabel()}>{mobileLabel}</span>}
          {hasDot && (
            <span
              aria-hidden="true"
              className="absolute top-2 right-2 size-1.5 rounded-full bg-primary ring-2 ring-popover max-sm:top-1.5 max-sm:right-2.5"
            />
          )}
        </PopoverTrigger>
        <TooltipPopup sideOffset={8}>{label}</TooltipPopup>
      </Tooltip>
      <PopoverPopup
        keepMounted
        tooltipStyle
        side="top"
        align="center"
        sideOffset={8}
        className={dockPopup({ className: "rounded-2xl text-sm text-wrap" })}
      >
        <div className="flex flex-col gap-2 py-1">{children}</div>
      </PopoverPopup>
    </Popover>
  );
}
