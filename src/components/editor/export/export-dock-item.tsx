import type { ReactNode } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Download02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Group, GroupSeparator } from "@/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { dockLabel, dockPopup, dockTrigger } from "../controls/dock-styles";

type ExportDockItemProps = {
  onExport: () => void;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export default function ExportDockItem({ onExport, onOpenChange, children }: ExportDockItemProps) {
  return (
    <Group aria-label="Export" className="items-center max-sm:flex-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Export PNG"
              className={dockTrigger()}
              render={<motion.button whileTap={{ scale: 0.92 }} />}
              onClick={onExport}
            />
          }
        >
          <HugeiconsIcon icon={Download02Icon} className="size-4.5" aria-hidden="true" />
          <span className={dockLabel()}>Export</span>
        </TooltipTrigger>
        <TooltipPopup sideOffset={8}>Export PNG</TooltipPopup>
      </Tooltip>
      <GroupSeparator className="h-5 self-center max-sm:hidden" />
      <Popover onOpenChange={onOpenChange}>
        <Tooltip>
          <PopoverTrigger
            render={
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    aria-label="Export options"
                    className={dockTrigger({
                      shape: "label",
                      className: "w-5 px-0 max-sm:w-6 max-sm:min-w-0 max-sm:flex-none max-sm:px-0",
                    })}
                    render={<motion.button whileTap={{ scale: 0.92 }} />}
                  />
                }
              />
            }
          >
            <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </PopoverTrigger>
          <TooltipPopup sideOffset={8}>Export options</TooltipPopup>
        </Tooltip>
        <PopoverPopup
          keepMounted
          tooltipStyle
          side="top"
          align="center"
          sideOffset={8}
          className={dockPopup({ className: "w-80 rounded-2xl text-sm text-wrap" })}
        >
          <div className="flex flex-col gap-2 py-1">{children}</div>
        </PopoverPopup>
      </Popover>
    </Group>
  );
}
