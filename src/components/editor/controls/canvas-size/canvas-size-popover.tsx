import { useAtomValue } from "jotai";
import { CropIcon } from "@hugeicons/core-free-icons";
import { CanvasSize, canvasSizeAtom } from "@/store/editor/editor";
import DockPopover from "../dock-popover";
import CanvasSizeControl, { CANVAS_SIZE_OPTIONS } from ".";

export default function CanvasSizePopover() {
  const canvasSize = useAtomValue(canvasSizeAtom);
  const ratio = CANVAS_SIZE_OPTIONS.find((option) => option.value === canvasSize)?.label;
  const caption = canvasSize === CanvasSize.Auto ? undefined : ratio;

  return (
    <DockPopover label="Canvas size" icon={CropIcon} caption={caption}>
      <CanvasSizeControl />
    </DockPopover>
  );
}
