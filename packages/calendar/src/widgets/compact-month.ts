import { compareRanked, rankOccurrence } from "../agenda/order";
import { overlapsRange } from "../event";
import { addDays, startOfDay } from "../time";
import type { EventOccurrence, Instant, InstantRange, PlainDate } from "../types";

export type BusyDay = {
  lines: EventOccurrence[];
  hiddenCount: number;
};

type DatedSpan = {
  date: PlainDate;
  span: InstantRange;
};

function consecutiveDaySpans(dates: PlainDate[], timeZone: string): DatedSpan[] {
  const spans: DatedSpan[] = [];
  let nextStart: Instant | undefined;
  for (const date of dates) {
    const start = nextStart ?? startOfDay(date, timeZone);
    const end = startOfDay(addDays(date, 1), timeZone);
    spans.push({ date, span: { start, end } });
    nextStart = end;
  }
  return spans;
}

export function busyDayLines(
  occurrences: EventOccurrence[],
  weeks: PlainDate[][],
  timeZone: string,
  limit: number,
): Map<PlainDate, BusyDay> {
  const ranked = occurrences.map((occurrence) => rankOccurrence(occurrence, timeZone)).sort(compareRanked);
  const lineLimit = Math.max(0, limit);
  const busyDays = new Map<PlainDate, BusyDay>();
  for (const { date, span } of consecutiveDaySpans(weeks.flat(), timeZone)) {
    const onDay = ranked.filter((entry) => overlapsRange(entry.interval, span)).map((entry) => entry.occurrence);
    if (onDay.length === 0) {
      continue;
    }
    busyDays.set(date, { lines: onDay.slice(0, lineLimit), hiddenCount: Math.max(0, onDay.length - lineLimit) });
  }
  return busyDays;
}
