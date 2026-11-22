"use client";

import type { RepeatFieldProps, RepeatSlot } from "@cutecode/calendar/quick-event";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";

import {
  RepeatPreset,
  choosablePresets,
  presetLabels,
  mergedRecurrence,
  presetOf,
  presetRecurrence,
  repeatCopy,
  startDateOf,
} from "./presets";

const seriesValue = "series";

const seriesItems = { [seriesValue]: repeatCopy.series };

function SeriesRepeat() {
  return (
    <Select disabled items={seriesItems} value={seriesValue}>
      <SelectTrigger aria-label={repeatCopy.label} size="sm">
        <SelectValue />
      </SelectTrigger>
    </Select>
  );
}

function RepeatField({ value, onValueChange, start, settings, isSeriesException }: RepeatFieldProps) {
  const date = startDateOf(start, settings.timeZone);
  const current = presetOf(value, date);
  const labels = presetLabels(date, settings);
  const presets = current === RepeatPreset.Custom ? [...choosablePresets, RepeatPreset.Custom] : choosablePresets;
  const items = Object.fromEntries(presets.map((preset) => [preset, labels[preset]]));
  const choose = (preset: RepeatPreset | null) => {
    if (preset !== null && preset !== RepeatPreset.Custom) {
      onValueChange(mergedRecurrence(presetRecurrence(preset, date, settings.weekStartsOn), value));
    }
  };
  if (isSeriesException) {
    return <SeriesRepeat />;
  }

  return (
    <Select items={items} onValueChange={choose} value={current}>
      <SelectTrigger aria-label={repeatCopy.label} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {presets.map((preset) => (
          <SelectItem key={preset} value={preset}>
            {labels[preset]}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

const renderRepeatField: RepeatSlot = (field) => <RepeatField {...field} />;

export { RepeatField, renderRepeatField };
export { RepeatPreset } from "./presets";
