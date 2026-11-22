import { addDays, addMonths, addYears, compareDates, startOfMonth } from "@cutecode/calendar/time";
import { KeyCommand, type PlainDate } from "@cutecode/calendar/types";

export enum PageKey {
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",
}

const weekLength = 7;

const dayOffsets: Partial<Record<KeyCommand, number>> = {
  [KeyCommand.PreviousDay]: -1,
  [KeyCommand.NextDay]: 1,
  [KeyCommand.PreviousHour]: -weekLength,
  [KeyCommand.NextHour]: weekLength,
  [KeyCommand.PreviousWeek]: -weekLength,
  [KeyCommand.NextWeek]: weekLength,
};

function isPageKey(key: string): key is PageKey {
  return Object.values(PageKey).some((pageKey) => pageKey === key);
}

const pageSteps: Record<PageKey, (date: PlainDate) => PlainDate> = {
  [PageKey.Home]: startOfMonth,
  [PageKey.End]: (date) => addDays(addMonths(startOfMonth(date), 1), -1),
  [PageKey.PageUp]: (date) => addMonths(date, -1),
  [PageKey.PageDown]: (date) => addMonths(date, 1),
};

export function stepByCommand(date: PlainDate, command: KeyCommand): PlainDate | null {
  const offset = dayOffsets[command];
  return offset === undefined ? null : addDays(date, offset);
}

export function stepByKey(date: PlainDate, key: string): PlainDate | null {
  return isPageKey(key) ? pageSteps[key](date) : null;
}

export function isInYear(date: PlainDate, firstDay: PlainDate): boolean {
  return compareDates(date, firstDay) >= 0 && compareDates(date, addYears(firstDay, 1)) < 0;
}
