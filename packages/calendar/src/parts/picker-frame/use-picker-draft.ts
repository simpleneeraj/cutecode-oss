"use client";

import { useState } from "react";

import { selectDate, SelectionMode, type DateRules, type DateSelection } from "../../picker";
import { startOfMonth } from "../../time";
import type { PlainDate } from "../../types";

type PickerDraft = {
  seedKey: string;
  selection: DateSelection;
  month: PlainDate | null;
};

export type PickerSeed = {
  key: string;
  selection: DateSelection;
};

function anchorOf(selection: DateSelection): PlainDate | null {
  if (selection.mode === SelectionMode.Single) {
    return selection.date;
  }
  return selection.start;
}

function freshDraft(seed: PickerSeed): PickerDraft {
  return { seedKey: seed.key, selection: seed.selection, month: null };
}

export function usePickerDraft(seed: PickerSeed, rules: DateRules, today: PlainDate | null) {
  const [draft, setDraft] = useState(() => freshDraft(seed));
  const current = draft.seedKey === seed.key ? draft : freshDraft(seed);
  const anchor = current.month ?? anchorOf(current.selection) ?? today;
  const month = anchor === null ? null : startOfMonth(anchor);

  const select = (date: PlainDate) => setDraft({ ...current, selection: selectDate(current.selection, date, rules) });
  const show = (shown: PlainDate) => setDraft({ ...current, month: startOfMonth(shown) });
  const reset = () => setDraft(freshDraft(seed));

  return { selection: current.selection, month, select, show, reset };
}
