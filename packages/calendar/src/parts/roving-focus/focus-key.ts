import { FocusTarget, KeyCommand, type GridFocus, type PlainDate } from "../../types";

export type FocusProps = {
  tabIndex: number;
  "data-focus-key": string;
  "aria-describedby"?: string;
};

export const navigationCommands: ReadonlySet<KeyCommand> = new Set([
  KeyCommand.PreviousDay,
  KeyCommand.NextDay,
  KeyCommand.PreviousWeek,
  KeyCommand.NextWeek,
  KeyCommand.PreviousHour,
  KeyCommand.NextHour,
]);

export function slotKey(date: PlainDate, columnKey: string): string {
  return `slot|${date}|${columnKey}`;
}

export function eventKey(occurrenceKey: string, date: PlainDate, columnKey?: string): string {
  const key = `event|${occurrenceKey}|${date}`;
  return columnKey === undefined ? key : `${key}|${columnKey}`;
}

export function focusKeyOf(focus: GridFocus): string {
  if (focus.target === FocusTarget.Event) {
    return eventKey(focus.occurrenceKey, focus.date, focus.columnKey);
  }
  return slotKey(focus.date, focus.columnKey);
}

export function focusPropsOf(key: string, focus: GridFocus): FocusProps {
  const isCurrent = key === focusKeyOf(focus);
  return { tabIndex: isCurrent ? 0 : -1, "data-focus-key": key };
}
