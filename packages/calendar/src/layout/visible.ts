import { isOnHiddenCalendar } from "../event";
import type { EventOccurrence } from "../types";

export function visibleOccurrences(occurrences: EventOccurrence[], hiddenCalendarIds: string[]): EventOccurrence[] {
  if (hiddenCalendarIds.length === 0) {
    return occurrences;
  }
  return occurrences.filter((occurrence) => !isOnHiddenCalendar(occurrence.event, hiddenCalendarIds));
}
