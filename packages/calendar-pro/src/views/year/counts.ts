import type { CalendarData } from "@cutecode/calendar/day";
import { hiddenCalendarIdsOf, isOnHiddenCalendar, occurrencesInRange } from "@cutecode/calendar/event";
import { addYears, startOfDay } from "@cutecode/calendar/time";
import type { DayCount, PlainDate } from "@cutecode/calendar/types";

import { aggregateDays } from "../../heat/aggregate";

export function countYear(data: CalendarData, firstDay: PlainDate, timeZone: string): DayCount[] {
  const dates = { start: firstDay, end: addYears(firstDay, 1) };
  const range = { start: startOfDay(dates.start, timeZone), end: startOfDay(dates.end, timeZone) };
  const hidden = hiddenCalendarIdsOf(data.calendars);
  const occurrences = occurrencesInRange(data.events, { range, dates, timeZone }, data.expand);
  const shown = occurrences.filter((occurrence) => !isOnHiddenCalendar(occurrence.event, hidden));
  return aggregateDays(shown, dates, timeZone);
}
