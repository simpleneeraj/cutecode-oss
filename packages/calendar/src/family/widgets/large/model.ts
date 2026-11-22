import { formatPlainDate } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import { addDays, monthWeeks, startOfMonth } from "../../../time";
import type { PlainDate, ViewSettings } from "../../../types";
import { busyDayLines } from "../../../widgets";
import { shownOccurrences } from "../shared/model";

export type GlanceDay = {
  date: PlainDate;
  label: string;
  inMonth: boolean;
  today: boolean;
  busy: boolean;
};

export const glanceLimits = {
  busyFrom: 3,
};

export function monthGlance(data: CalendarData, today: PlainDate, settings: ViewSettings): GlanceDay[][] {
  const weeks = monthWeeks(today, settings.weekStartsOn);
  const first = weeks[0]?.[0] ?? today;
  const last = weeks.at(-1)?.at(-1) ?? today;
  const occurrences = shownOccurrences(data, { start: first, end: addDays(last, 1) }, settings.timeZone);
  const counts = busyDayLines(occurrences, weeks, settings.timeZone, 0);
  const month = startOfMonth(today);
  return weeks.map((week) =>
    week.map((date) => ({
      date,
      label: formatPlainDate(date, settings, { day: "numeric" }),
      inMonth: startOfMonth(date) === month,
      today: date === today,
      busy: (counts.get(date)?.hiddenCount ?? 0) >= glanceLimits.busyFrom,
    })),
  );
}
