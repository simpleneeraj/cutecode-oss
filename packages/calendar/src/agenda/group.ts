import { OccurrenceKind, type DateRange, type EventOccurrence, type Instant, type PlainDate } from "../types";
import { addDays, compareDates, eachDate } from "../time";
import { coveredDates } from "../event";
import { intersectDates } from "./coverage";
import { compareRanked, rankOccurrence, type RankedOccurrence } from "./order";

export type AgendaRow = {
  key: string;
  occurrence: EventOccurrence;
  allDay: boolean;
  continuesFrom: PlainDate | null;
  continuesAfter: boolean;
  past: boolean;
};

export type AgendaDay = {
  date: PlainDate;
  rows: AgendaRow[];
};

type PlacedRow = {
  ranked: RankedOccurrence;
  row: AgendaRow;
};

type RowContext = {
  dates: DateRange;
  now: Instant;
  timeZone: string;
};

function rowOn(date: PlainDate, ranked: RankedOccurrence, covered: DateRange, context: RowContext): AgendaRow {
  const startsEarlier = compareDates(covered.start, date) < 0;
  return {
    key: `${ranked.occurrence.key}#${date}`,
    occurrence: ranked.occurrence,
    allDay: ranked.occurrence.kind === OccurrenceKind.AllDay,
    continuesFrom: startsEarlier ? covered.start : null,
    continuesAfter: compareDates(addDays(date, 1), covered.end) < 0,
    past: ranked.interval.end <= context.now,
  };
}

function placeRows(buckets: Map<PlainDate, PlacedRow[]>, occurrence: EventOccurrence, context: RowContext): void {
  const covered = coveredDates(occurrence, context.timeZone);
  const shown = intersectDates(covered, context.dates);
  if (!shown) {
    return;
  }
  const ranked = rankOccurrence(occurrence, context.timeZone);
  for (const date of eachDate(shown)) {
    const placed = buckets.get(date) ?? [];
    placed.push({ ranked, row: rowOn(date, ranked, covered, context) });
    buckets.set(date, placed);
  }
}

function toAgendaDay(date: PlainDate, placed: PlacedRow[]): AgendaDay {
  const rows = placed.sort((first, second) => compareRanked(first.ranked, second.ranked)).map((item) => item.row);
  return { date, rows };
}

export function groupAgenda(
  occurrences: EventOccurrence[],
  dates: DateRange,
  now: Instant,
  timeZone: string,
): AgendaDay[] {
  const buckets = new Map<PlainDate, PlacedRow[]>();
  const context = { dates, now, timeZone };
  for (const occurrence of occurrences) {
    placeRows(buckets, occurrence, context);
  }
  return eachDate(dates).flatMap((date) => {
    const placed = buckets.get(date);
    return placed ? [toAgendaDay(date, placed)] : [];
  });
}
