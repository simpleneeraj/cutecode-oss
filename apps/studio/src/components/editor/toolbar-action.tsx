"use client";

import type { Icon } from "@solar-icons/react/lib/types";
import { Button } from "@cutecode/ui/components/button";
import { Kbd, KbdGroup } from "@cutecode/ui/components/kbd";
import { ToolbarButton } from "@cutecode/ui/components/toolbar";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";
import { toolbarActionStyles } from "./style";

const styles = toolbarActionStyles();

type ToolbarActionProps = {
  label: string;
  icon: Icon;
  keys: string[];
  onClick: () => void;
  disabled?: boolean;
  isDestructive?: boolean;
};

export default function ToolbarAction({ label, icon: Glyph, keys, onClick, disabled, isDestructive }: ToolbarActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToolbarButton
            aria-label={label}
            render={
              <Button
                size="icon-sm"
                variant={isDestructive ? "destructive-outline" : "ghost"}
                onClick={onClick}
                disabled={disabled}
                className={styles.button()}
              />
            }
          >
            <Glyph aria-hidden="true" />
          </ToolbarButton>
        }
      />
      <TooltipPopup sideOffset={8}>
        <span className={styles.shortcut()}>
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
