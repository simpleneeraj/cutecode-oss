"use client";

import { pickerMonth, SelectionMode, type DateRules, type SingleSelection } from "../../picker";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import { FrameTone } from "../../parts/picker-frame/choices";
import { DayGrid } from "../../parts/picker-frame/day-grid";
import { PickerFrame } from "../../parts/picker-frame";
import { MonthNav } from "../../parts/picker-frame/month-nav";
import { usePickerDraft } from "../../parts/picker-frame/use-picker-draft";
import type { PlainDate } from "../../types";
import { datePickerCopy, singleSummary } from "./model";

export type DatePickerSetup = {
  label?: string;
  tone?: FrameTone;
  rules?: DateRules;
};

type DatePickerProps = {
  value: PlainDate | null;
  onValueChange: (date: PlainDate) => void;
  onCancel: () => void;
  options: FamilyOptions;
  setup?: DatePickerSetup;
};

const noRules: DateRules = {};

function DatePicker({ value, onValueChange, onCancel, options, setup = {} }: DatePickerProps) {
  const family = useFamilySettings(options);
  const rules = setup.rules ?? noRules;
  const seed: SingleSelection = { mode: SelectionMode.Single, date: value };
  const draft = usePickerDraft({ key: value ?? "", selection: seed }, rules, family.today);
  const selection = draft.selection.mode === SelectionMode.Single ? draft.selection : seed;
  const summary = singleSummary(selection, rules, family.settings);
  if (draft.month === null) {
    return null;
  }
  const weeks = pickerMonth(draft.month, family.settings, selection, rules, family.today ?? "");
  const confirm = () => {
    if (selection.date !== null) {
      onValueChange(selection.date);
    }
  };
  const cancel = () => {
    draft.reset();
    onCancel();
  };

  return (
    <PickerFrame
      actions={{ canConfirm: summary.canConfirm, onConfirm: confirm, onCancel: cancel }}
      label={setup.label ?? datePickerCopy.label}
      summary={summary}
      tone={setup.tone ?? FrameTone.Accent}
    >
      <MonthNav month={draft.month} onMonthChange={draft.show} rules={rules} settings={family.settings} />
      <DayGrid
        family={family}
        onReveal={draft.show}
        onSelect={draft.select}
        preferred={[selection.date, family.today]}
        weeks={weeks}
      />
    </PickerFrame>
  );
}

export { DatePicker };
