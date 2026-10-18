import type { ReactNode } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { dockPopup, dockTrigger } from "./dock-styles";

type DockPopoverProps = {
  label: string;
  icon: IconSvgElement;
  caption?: string;
  hasDot?: boolean;
  children: ReactNode;
};

export default function DockPopover({ label, icon, caption, hasDot = false, children }: DockPopoverProps) {
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
          <HugeiconsIcon icon={icon} className="size-4.5" aria-hidden="true" />
          {caption && <span className="text-xs text-muted-foreground tabular-nums">{caption}</span>}
          {hasDot && <span aria-hidden="true" className="absolute top-2 right-2 size-1.5 rounded-full bg-primary ring-2 ring-popover" />}
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
