import { OccurrenceKind, type EventOccurrence, type InstantRange } from "../types";
import { occurrenceInterval } from "../event";

export type RankedOccurrence = {
  occurrence: EventOccurrence;
  interval: InstantRange;
};

function allDayRank(occurrence: EventOccurrence): number {
  return occurrence.kind === OccurrenceKind.AllDay ? 0 : 1;
}

function compareText(first: string, second: string): number {
  if (first === second) {
    return 0;
  }
  return first < second ? -1 : 1;
}

export function compareRanked(first: RankedOccurrence, second: RankedOccurrence): number {
  const byKind = allDayRank(first.occurrence) - allDayRank(second.occurrence);
  if (byKind !== 0) {
    return byKind;
  }
  const byStart = first.interval.start - second.interval.start;
  if (byStart !== 0) {
    return byStart;
  }
  const byLength = second.interval.end - second.interval.start - (first.interval.end - first.interval.start);
  if (byLength !== 0) {
    return byLength;
  }
  const byTitle = compareText(first.occurrence.event.title, second.occurrence.event.title);
  if (byTitle !== 0) {
    return byTitle;
  }
  return compareText(first.occurrence.key, second.occurrence.key);
}

export function rankOccurrence(occurrence: EventOccurrence, timeZone: string): RankedOccurrence {
  return { occurrence, interval: occurrenceInterval(occurrence, timeZone) };
}

export function sortOccurrences(occurrences: EventOccurrence[], timeZone: string): EventOccurrence[] {
  return occurrences
    .map((occurrence) => rankOccurrence(occurrence, timeZone))
    .sort(compareRanked)
    .map((ranked) => ranked.occurrence);
}
