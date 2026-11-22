"use client";

import { ToggleGroup, ToggleGroupItem } from "@cutecode/ui/components/toggle-group";

import { HourZoom } from "../../parts/time-grid/props";
import type { ZoomControl } from "./props";

type ZoomPickerProps = {
  zoom: ZoomControl;
};

const zoomOptions = [
  { zoom: HourZoom.Compact, letter: "S", label: "Small hours" },
  { zoom: HourZoom.Regular, letter: "M", label: "Medium hours" },
  { zoom: HourZoom.Spacious, letter: "L", label: "Large hours" },
];

const zoomCopy = {
  label: "Hour height",
};

function isHourZoom(value: unknown): value is HourZoom {
  return zoomOptions.some((option) => option.zoom === value);
}

function ZoomPicker({ zoom }: ZoomPickerProps) {
  const selectZoom = (values: unknown[]) => {
    const [next] = values;
    if (isHourZoom(next)) {
      zoom.onChange(next);
    }
  };

  return (
    <ToggleGroup aria-label={zoomCopy.label} onValueChange={selectZoom} value={[zoom.value]}>
      {zoomOptions.map((option) => (
        <ToggleGroupItem key={option.zoom} aria-label={option.label} value={option.zoom}>
          {option.letter}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export { ZoomPicker };
