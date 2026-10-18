import type { ReactNode } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download02Icon, Film01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Group, GroupSeparator } from "@/components/ui/group";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { dockLabel, dockPopup, dockTrigger } from "../controls/dock-styles";

type ExportDockItemProps = {
  isReelDisabled: boolean;
  onReelOpenChange: (open: boolean) => void;
  imagePanel: ReactNode;
  videoPanel: ReactNode;
};

const popupClassName = dockPopup({ className: "w-80 rounded-2xl text-sm text-wrap" });

export default function ExportDockItem({
  isReelDisabled,
  onReelOpenChange,
  imagePanel,
  videoPanel,
}: ExportDockItemProps) {
  return (
    <Group aria-label="Export" className="items-center max-sm:flex-1">
      <Popover>
        <Tooltip>
          <PopoverTrigger
            render={
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Export"
                    className={dockTrigger()}
                    render={<motion.button whileTap={{ scale: 0.92 }} />}
                  />
                }
              />
            }
          >
            <HugeiconsIcon icon={Download02Icon} className="size-4.5" aria-hidden="true" />
            <span className={dockLabel()}>Export</span>
          </PopoverTrigger>
          <TooltipPopup sideOffset={8}>Export</TooltipPopup>
        </Tooltip>
        <PopoverPopup keepMounted tooltipStyle side="top" align="center" sideOffset={8} className={popupClassName}>
          <div className="flex flex-col gap-2 py-1">{imagePanel}</div>
        </PopoverPopup>
      </Popover>
      <GroupSeparator className="h-5 self-center max-sm:hidden" />
      <Popover onOpenChange={onReelOpenChange}>
        <Tooltip>
          <PopoverTrigger
            disabled={isReelDisabled}
            render={
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Video reel"
                    disabled={isReelDisabled}
                    className={dockTrigger()}
                    render={<motion.button whileTap={{ scale: 0.92 }} />}
                  />
                }
              />
            }
          >
            <HugeiconsIcon icon={Film01Icon} className="size-4.5" aria-hidden="true" />
            <span className={dockLabel()}>Reel</span>
          </PopoverTrigger>
          <TooltipPopup sideOffset={8}>
            {isReelDisabled ? "Pick an animated preset to export video" : "Video reel"}
          </TooltipPopup>
        </Tooltip>
        <PopoverPopup tooltipStyle side="top" align="center" sideOffset={8} className={popupClassName}>
          <div className="flex flex-col gap-2 py-1">{videoPanel}</div>
        </PopoverPopup>
      </Popover>
    </Group>
  );
}
