"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { MoonIcon } from "@solar-icons/react/linear/moon";
import { SunIcon } from "@solar-icons/react/linear/sun";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@cutecode/ui/components/toolbar";
import { TooltipProvider } from "@cutecode/ui/components/tooltip";
import {
  createSlideAtom,
  currentSlideIdAtom,
  deleteSlideAtom,
  duplicateSlideAtom,
  elementDarkModeAtom,
  selectSlideAtom,
  slidesAtom,
  updateSlideElementAtom,
} from "@/store/editor/editor";
import useHotkeys from "@/utils/useHotkeys";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import ToolbarAction from "./toolbar-action";

export default function ToolbarParticle() {
  const slides = useAtomValue(slidesAtom);
  const slideId = useAtomValue(currentSlideIdAtom);
  const createSlide = useSetAtom(createSlideAtom);
  const duplicateSlide = useSetAtom(duplicateSlideAtom);
  const deleteSlide = useSetAtom(deleteSlideAtom);
  const selectSlide = useSetAtom(selectSlideAtom);
  const darkMode = useAtomValue(elementDarkModeAtom);
  const updateSlideElement = useSetAtom(updateSlideElementAtom);
  const { checkLimit, withAccess } = usePremiumAccess();

  const currentIndex = slides.findIndex((slide) => slide.id === slideId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;
  const canDelete = slides.length > 1;

  const withSlideRoom = (onAllowed: () => void) => withAccess(checkLimit("maxSlides", slides.length + 1), onAllowed);

  const addSlide = () => {
    withSlideRoom(() => createSlide({ id: crypto.randomUUID(), name: "New Slide", background: {} }));
  };

  const copySlide = () => {
    withSlideRoom(duplicateSlide);
  };

  const previousSlide = () => {
    if (!isFirst) selectSlide(slides[currentIndex - 1].id);
  };

  const nextSlide = () => {
    if (!isLast) selectSlide(slides[currentIndex + 1].id);
  };

  const removeSlide = () => {
    if (canDelete) deleteSlide();
  };

  const toggleDarkMode = () => {
    updateSlideElement({ properties: { darkMode: !darkMode } });
  };

  useHotkeys("shift+left", previousSlide);
  useHotkeys("shift+right", nextSlide);
  useHotkeys("a", addSlide);
  useHotkeys("shift+d", copySlide);
  useHotkeys("shift+backspace", removeSlide);
  useHotkeys("d", toggleDarkMode);

  return (
    <TooltipProvider>
      <Toolbar className="rounded-full bg-card/80 px-1.5 shadow-sm/5 backdrop-blur-xl">
        <ToolbarGroup>
          <ToolbarAction label="Previous slide" icon={AltArrowLeftIcon} keys={["Shift", "←"]} onClick={previousSlide} disabled={isFirst} />
          {canDelete && (
            <span className="px-1 text-xs text-muted-foreground tabular-nums select-none" aria-live="polite">
              {currentIndex + 1}/{slides.length}
            </span>
          )}
          <ToolbarSeparator orientation="vertical" />
          <ToolbarAction label="Add slide" icon={AddSquareIcon} keys={["A"]} onClick={addSlide} />
          <ToolbarAction label="Duplicate slide" icon={CopyIcon} keys={["⇧", "D"]} onClick={copySlide} />
          {canDelete && (
            <ToolbarAction label="Delete slide" icon={TrashBinMinimalisticIcon} keys={["Shift", "⌫"]} onClick={removeSlide} isDestructive />
          )}
          <ToolbarSeparator orientation="vertical" />
          <ToolbarAction
            label={darkMode ? "Light mode" : "Dark mode"}
            icon={darkMode ? SunIcon : MoonIcon}
            keys={["D"]}
            onClick={toggleDarkMode}
          />
          <ToolbarSeparator orientation="vertical" />
          <ToolbarAction label="Next slide" icon={AltArrowRightIcon} keys={["Shift", "→"]} onClick={nextSlide} disabled={isLast} />
        </ToolbarGroup>
      </Toolbar>
    </TooltipProvider>
  );
}
