import React from "react";
import { Field } from "@cutecode/ui/components/field";
import ControlLabel from "../control-label";
import { useAtomValue, useSetAtom } from "jotai";
import { elementPaddingAtom, updateSlideElementAtom } from "@/store/editor/editor";
import useHotkeys from "@/utils/useHotkeys";
import SegmentedControl from "../segmented-control";

export const PADDING_OPTIONS = [
  { label: "16px", value: "16px" },
  { label: "32px", value: "32px" },
  { label: "64px", value: "64px" },
  { label: "128px", value: "128px" },
] as const;

const PaddingControl: React.FC = () => {
  const padding = useAtomValue(elementPaddingAtom);
  const updateSlideElement = useSetAtom(updateSlideElementAtom);
  const selectedPadding = PADDING_OPTIONS.find((option) => option.value === padding)?.value ?? PADDING_OPTIONS[0].value;

  useHotkeys("p", (e) => {
    e.preventDefault();
    const currentIndex = PADDING_OPTIONS.findIndex((o) => o.value === padding);
    const next = PADDING_OPTIONS[currentIndex + 1] ?? PADDING_OPTIONS[0];
    updateSlideElement({ style: { padding: next.value } });
  });

  return (
    <Field className="gap-1.5">
      <ControlLabel>Padding</ControlLabel>
      <SegmentedControl
        label="Padding size"
        options={PADDING_OPTIONS}
        value={selectedPadding}
        onValueChange={(value) => updateSlideElement({ style: { padding: value } })}
      />
    </Field>
  );
};

export default PaddingControl;
