import type { DateRange } from "../types";
import { compareDates } from "../time";

export function intersectDates(first: DateRange, second: DateRange): DateRange | null {
  const start = compareDates(first.start, second.start) >= 0 ? first.start : second.start;
  const end = compareDates(first.end, second.end) <= 0 ? first.end : second.end;
  const isEmpty = compareDates(end, start) <= 0;
  if (isEmpty) {
    return null;
  }
  return { start, end };
}
