import React from "react";
import { useAtom } from "jotai";
import { FitToScreenIcon, SmartPhone01Icon, SquareIcon, Tv01Icon } from "@hugeicons/core-free-icons";
import { Field } from "@/components/ui/field";
import { CanvasSize, canvasSizeAtom } from "@/store/editor/editor";
import ControlLabel from "../control-label";
import SegmentedControl from "../segmented-control";

export const CANVAS_SIZE_OPTIONS = [
  { value: CanvasSize.Auto, label: "Auto", icon: FitToScreenIcon },
  { value: CanvasSize.Square, label: "1:1", icon: SquareIcon },
  { value: CanvasSize.Portrait, label: "9:16", icon: SmartPhone01Icon },
  { value: CanvasSize.Landscape, label: "16:9", icon: Tv01Icon },
];

const CanvasSizeControl: React.FC = () => {
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);

  return (
    <Field className="gap-1.5">
      <ControlLabel>Canvas</ControlLabel>
      <SegmentedControl
        label="Canvas size"
        options={CANVAS_SIZE_OPTIONS}
        value={canvasSize}
        onValueChange={setCanvasSize}
      />
    </Field>
  );
};

export default CanvasSizeControl;
