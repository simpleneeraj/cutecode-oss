import { compareRanked, rankOccurrence, type RankedOccurrence } from "../agenda/order";
import { occurrenceInterval, overlapsRange } from "../event";
import { compareDates, dateOf, daySpan } from "../time";
import { EventStatus, OccurrenceKind, type EventOccurrence, type Instant, type PlainDate } from "../types";

export enum DayStatus {
  Free = "free",
  Busy = "busy",
  Done = "done",
}

type DatedOccurrence = RankedOccurrence & { startDate: PlainDate };

function startDateOf(ranked: RankedOccurrence, timeZone: string): PlainDate {
  if (ranked.occurrence.kind === OccurrenceKind.AllDay) {
    return ranked.occurrence.startDate;
  }
  return dateOf(ranked.interval.start, timeZone);
}

function compareDated(first: DatedOccurrence, second: DatedOccurrence): number {
  const byDate = compareDates(first.startDate, second.startDate);
  if (byDate !== 0) {
    return byDate;
  }
  return compareRanked(first, second);
}

function isUpcoming(ranked: RankedOccurrence, now: Instant): boolean {
  return ranked.interval.end > now || ranked.interval.start >= now;
}

export function upNext(
  occurrences: EventOccurrence[],
  now: Instant,
  count: number,
  timeZone: string,
): EventOccurrence[] {
  return occurrences
    .map((occurrence) => rankOccurrence(occurrence, timeZone))
    .filter((ranked) => isUpcoming(ranked, now))
    .map((ranked) => ({ ...ranked, startDate: startDateOf(ranked, timeZone) }))
    .sort(compareDated)
    .slice(0, Math.max(0, count))
    .map((dated) => dated.occurrence);
}

export function dayStatus(occurrences: EventOccurrence[], date: PlainDate, now: Instant, timeZone: string): DayStatus {
  const day = daySpan(date, timeZone);
  const planned = occurrences
    .filter((occurrence) => occurrence.event.status !== EventStatus.Cancelled)
    .map((occurrence) => occurrenceInterval(occurrence, timeZone))
    .filter((interval) => overlapsRange(interval, day));
  if (planned.length === 0) {
    return DayStatus.Free;
  }
  const lastEnd = Math.max(...planned.map((interval) => interval.end));
  if (lastEnd <= now) {
    return DayStatus.Done;
  }
  return DayStatus.Busy;
}
