"use client";

import { motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@cutecode/ui/lib/cn";
import { Button } from "@cutecode/ui/components/button";
import { Kbd, KbdGroup } from "@cutecode/ui/components/kbd";
import { ToolbarButton } from "@cutecode/ui/components/toolbar";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";

type ToolbarActionProps = {
  label: string;
  icon: IconSvgElement;
  keys: string[];
  onClick: () => void;
  disabled?: boolean;
  isDestructive?: boolean;
};

export default function ToolbarAction({ label, icon, keys, onClick, disabled, isDestructive }: ToolbarActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToolbarButton
            aria-label={label}
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onClick}
                disabled={disabled}
                className={cn("rounded-full before:rounded-full", isDestructive ? "text-destructive hover:bg-destructive/8" : "text-foreground")}
                render={<motion.button whileTap={{ scale: 0.9 }} />}
              />
            }
          >
            <HugeiconsIcon icon={icon} className="size-4" aria-hidden="true" />
          </ToolbarButton>
        }
      />
      <TooltipPopup sideOffset={8}>
        <span className="flex items-center gap-2">
          {label}
          <KbdGroup>
            {keys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        </span>
      </TooltipPopup>
    </Tooltip>
  );
}
