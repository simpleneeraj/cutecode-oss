"use client";

import { pickerMonth, SelectionMode, type DateRules, type RangeSelection } from "../../picker";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import { FrameTone } from "../../parts/picker-frame/choices";
import { DayGrid } from "../../parts/picker-frame/day-grid";
import { PickerFrame } from "../../parts/picker-frame";
import { MonthNav } from "../../parts/picker-frame/month-nav";
import { usePickerDraft } from "../../parts/picker-frame/use-picker-draft";
import type { DateRange } from "../../types";
import { rangePickerCopy, rangeSummary } from "./model";

export type RangePickerSetup = {
  label?: string;
  tone?: FrameTone;
  rules?: DateRules;
};

type RangePickerProps = {
  value: Partial<DateRange> | null;
  onValueChange: (range: DateRange) => void;
  onCancel: () => void;
  options: FamilyOptions;
  setup?: RangePickerSetup;
};

const noRules: DateRules = {};

function seedOf(value: Partial<DateRange> | null): RangeSelection {
  return { mode: SelectionMode.Range, start: value?.start ?? null, end: value?.end ?? null };
}

function RangePicker({ value, onValueChange, onCancel, options, setup = {} }: RangePickerProps) {
  const family = useFamilySettings(options);
  const rules = setup.rules ?? noRules;
  const seed = seedOf(value);
  const draft = usePickerDraft({ key: `${seed.start}|${seed.end}`, selection: seed }, rules, family.today);
  const selection = draft.selection.mode === SelectionMode.Range ? draft.selection : seed;
  const summary = rangeSummary(selection, rules, family.settings);
  if (draft.month === null) {
    return null;
  }
  const weeks = pickerMonth(draft.month, family.settings, selection, rules, family.today ?? "");
  const confirm = () => {
    if (selection.start !== null && selection.end !== null) {
      onValueChange({ start: selection.start, end: selection.end });
    }
  };
  const cancel = () => {
    draft.reset();
    onCancel();
  };

  return (
    <PickerFrame
      actions={{ canConfirm: summary.canConfirm, onConfirm: confirm, onCancel: cancel }}
      label={setup.label ?? rangePickerCopy.label}
      summary={summary}
      tone={setup.tone ?? FrameTone.Neutral}
    >
      <MonthNav month={draft.month} onMonthChange={draft.show} rules={rules} settings={family.settings} />
      <DayGrid
        family={family}
        onReveal={draft.show}
        onSelect={draft.select}
        preferred={[selection.start, family.today]}
        weeks={weeks}
      />
    </PickerFrame>
  );
}

export { RangePicker };
