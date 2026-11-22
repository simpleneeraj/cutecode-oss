import { addDays } from "../../time";
import { FocusTarget, KeyCommand, type GridFocus, type PlainDate, type SlotFocus } from "../../types";
import { slotKey } from "../roving-focus/focus-key";
import { dayColumnKey } from "../time-grid/focus";

const weekLength = 7;

const dayOffsets: Partial<Record<KeyCommand, number>> = {
  [KeyCommand.PreviousDay]: -1,
  [KeyCommand.NextDay]: 1,
  [KeyCommand.PreviousHour]: -weekLength,
  [KeyCommand.NextHour]: weekLength,
  [KeyCommand.PreviousWeek]: -weekLength,
  [KeyCommand.NextWeek]: weekLength,
};

export function daySlot(date: PlainDate): SlotFocus {
  return { target: FocusTarget.Slot, date, minute: 0, columnKey: dayColumnKey };
}

export function dayKey(date: PlainDate): string {
  return slotKey(date, dayColumnKey);
}

export function moveMonthFocus(focus: GridFocus, command: KeyCommand): GridFocus {
  const offset = dayOffsets[command];
  return offset === undefined ? focus : daySlot(addDays(focus.date, offset));
}

export function startingDate(dates: PlainDate[], selected: PlainDate, anchor: PlainDate): PlainDate {
  const isSelectedShown = dates.includes(selected);
  return isSelectedShown ? selected : anchor;
}

export function dateForKey(key: string, dates: PlainDate[]): PlainDate | undefined {
  return dates.find((date) => dayKey(date) === key);
}
