import { slotKey } from "@cutecode/calendar/parts/roving-focus/focus-key";
import { FocusTarget, type GridFocus, type KeyCommand, type PlainDate, type SlotFocus } from "@cutecode/calendar/types";

import { stepByCommand } from "../year/focus";

const columnKey = "heat-month";

export function tileFocus(date: PlainDate): SlotFocus {
  return { target: FocusTarget.Slot, date, minute: 0, columnKey };
}

export function tileKey(date: PlainDate): string {
  return slotKey(date, columnKey);
}

export function moveInMonth(focus: GridFocus, command: KeyCommand, dates: PlainDate[]): GridFocus {
  const next = stepByCommand(focus.date, command);
  const isShown = next !== null && dates.includes(next);
  return isShown ? tileFocus(next) : focus;
}

export function tabStopOf(focused: PlainDate, active: PlainDate, dates: PlainDate[]): PlainDate {
  return dates.includes(focused) ? focused : active;
}
