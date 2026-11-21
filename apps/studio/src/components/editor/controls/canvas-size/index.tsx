import React from "react";
import { useAtom } from "jotai";
import { FullScreenIcon } from "@solar-icons/react/linear/full-screen";
import { SmartphoneIcon } from "@solar-icons/react/linear/smartphone";
import { StopIcon } from "@solar-icons/react/linear/stop";
import { TvIcon } from "@solar-icons/react/linear/tv";
import { Field } from "@cutecode/ui/components/field";
import { CanvasSize, canvasSizeAtom } from "@/store/editor/editor";
import ControlLabel from "../control-label";
import SegmentedControl from "../segmented-control";

export const CANVAS_SIZE_OPTIONS = [
  { value: CanvasSize.Auto, label: "Auto", icon: FullScreenIcon },
  { value: CanvasSize.Square, label: "1:1", icon: StopIcon },
  { value: CanvasSize.Portrait, label: "9:16", icon: SmartphoneIcon },
  { value: CanvasSize.Landscape, label: "16:9", icon: TvIcon },
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
