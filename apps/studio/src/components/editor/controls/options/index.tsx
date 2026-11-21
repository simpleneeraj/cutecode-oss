import React, { useCallback } from "react";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@cutecode/ui/components/menu";
import { Button } from "@cutecode/ui/components/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";
import { useAtomValue, useSetAtom } from "jotai";
import {
  elementShowLineNumbersAtom,
  elementTransparentAtom,
  updateSlideElementAtom,
  resetEditorAtom,
} from "@/store/editor/editor";
import useHotkeys from "@/utils/useHotkeys";
import { motion } from "motion/react";
import OptionToggle from "./option-toggle";
import { dockLabel, dockPopup, dockTrigger } from "../dock-styles";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, Image01Icon, HashtagIcon, Delete02Icon } from "@hugeicons/core-free-icons";

const OptionsControl: React.FC = () => {
  const updateSlideElement = useSetAtom(updateSlideElementAtom);
  const resetEditor = useSetAtom(resetEditorAtom);

  const handleReset = useCallback(() => {
    resetEditor();
  }, [resetEditor]);

  const transparent = useAtomValue(elementTransparentAtom);
  const showLineNumbers = useAtomValue(elementShowLineNumbersAtom);

  useHotkeys("n", (e) => {
    e.preventDefault();
    updateSlideElement({ properties: { showLineNumbers: !showLineNumbers } });
  });

  useHotkeys("b", (e) => {
    e.preventDefault();
    updateSlideElement({ properties: { transparent: !transparent } });
  });

  return (
    <Menu>
      <Tooltip>
        <MenuTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Display options"
                  className={dockTrigger()}
                  render={<motion.button whileTap={{ scale: 0.92 }} />}
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={SlidersHorizontalIcon} className="size-4.5" aria-hidden="true" />
          <span className={dockLabel()}>More</span>
        </MenuTrigger>
        <TooltipPopup sideOffset={8}>Display options</TooltipPopup>
      </Tooltip>

      <MenuPopup side="top" align="center" sideOffset={8} className={dockPopup({ className: "w-56" })}>
        <div className="flex flex-col gap-0.5">
          <OptionToggle
            icon={Image01Icon}
            label="Background"
            checked={!transparent}
            onCheckedChange={(checked) => updateSlideElement({ properties: { transparent: !checked } })}
          />
          <OptionToggle
            icon={HashtagIcon}
            label="Line numbers"
            checked={showLineNumbers}
            onCheckedChange={(checked) => updateSlideElement({ properties: { showLineNumbers: checked } })}
          />
        </div>

        <MenuSeparator />

        <MenuItem variant="destructive" onClick={handleReset} className="min-h-8 rounded-md text-sm">
          <HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden="true" />
          Reset storage
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
};

export default OptionsControl;
