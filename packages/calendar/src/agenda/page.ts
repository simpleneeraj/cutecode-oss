import type { DateRange, PlainDate } from "../types";
import { addDays } from "../time";

export function agendaPage(anchor: PlainDate, direction: number, size: number): DateRange {
  const isValidSize = Number.isInteger(size) && size > 0;
  if (!isValidSize) {
    throw new RangeError(`Agenda page size must be a positive integer: ${size}`);
  }
  if (!Number.isInteger(direction)) {
    throw new RangeError(`Agenda page direction must be an integer: ${direction}`);
  }
  const start = addDays(anchor, direction * size);
  return { start, end: addDays(start, size) };
}
