import type { ReactNode } from "react";
import type { Icon } from "@solar-icons/react/lib/types";
import { Button } from "@cutecode/ui/components/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@cutecode/ui/components/popover";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";
import { dockLabel, dockPopover, dockTrigger } from "./dock-styles";

const styles = dockPopover();

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
                />
              }
            />
          }
        >
          <Glyph className={styles.glyph()} aria-hidden="true" />
          {caption && (
            <span className={styles.caption()}>{caption}</span>
          )}
          {!caption && mobileLabel && <span className={dockLabel()}>{mobileLabel}</span>}
          {hasDot && <span aria-hidden="true" className={styles.dot()} />}
        </PopoverTrigger>
        <TooltipPopup sideOffset={8}>{label}</TooltipPopup>
      </Tooltip>
      <PopoverPopup keepMounted tooltipStyle side="top" align="center" sideOffset={8} className={styles.popup()}>
        <div className={styles.content()}>{children}</div>
      </PopoverPopup>
    </Popover>
  );
}
