import { useAtomValue } from "jotai";
import { CropMinimalisticIcon } from "@solar-icons/react/linear/crop-minimalistic";
import { canvasSizeAtom, elementPaddingAtom } from "@/store/editor/editor";
import DockPopover from "../dock-popover";
import PaddingControl from "../padding";
import CanvasSizeControl, { CANVAS_SIZE_OPTIONS } from ".";

export default function CanvasSizePopover() {
  const canvasSize = useAtomValue(canvasSizeAtom);
  const padding = useAtomValue(elementPaddingAtom);
  const ratio = CANVAS_SIZE_OPTIONS.find((option) => option.value === canvasSize)?.label;

  return (
    <DockPopover label="Canvas" icon={CropMinimalisticIcon} caption={`${ratio} · ${String(padding).replace("px", "")}`}>
      <CanvasSizeControl />
      <PaddingControl />
    </DockPopover>
  );
}
