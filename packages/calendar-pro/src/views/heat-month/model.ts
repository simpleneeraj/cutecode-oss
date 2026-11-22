import type { CalendarData } from "@cutecode/calendar/day";
import { hiddenCalendarIdsOf, isOnHiddenCalendar, occurrencesInRange } from "@cutecode/calendar/event";
import { formatDayLabel, formatPlainDate } from "@cutecode/calendar/locale";
import type { PickerDay } from "@cutecode/calendar/picker";
import { addDays, startOfDay } from "@cutecode/calendar/time";
import type { DayCount, PlainDate, ViewSettings } from "@cutecode/calendar/types";

import { aggregateDays, heatLevel, HeatLevel } from "../../heat/aggregate";
import { eventCountLabel } from "../year/model";

export enum HeatLook {
  Count = "count",
  Heat = "heat",
}

export type HeatTile = {
  date: PlainDate;
  number: string;
  label: string;
  count: number;
  level: HeatLevel;
  inMonth: boolean;
  today: boolean;
  selected: boolean;
};

export type HeatMonthModel = {
  weeks: HeatTile[][];
  total: number;
  busiest: PlainDate | null;
};

export function countShown(data: CalendarData, weeks: PickerDay[][], timeZone: string): DayCount[] {
  const days = weeks.flat();
  const start = days[0]?.date ?? "";
  const dates = { start, end: addDays(days.at(-1)?.date ?? start, 1) };
  const range = { start: startOfDay(dates.start, timeZone), end: startOfDay(dates.end, timeZone) };
  const hidden = hiddenCalendarIdsOf(data.calendars);
  const occurrences = occurrencesInRange(data.events, { range, dates, timeZone }, data.expand);
  const shown = occurrences.filter((occurrence) => !isOnHiddenCalendar(occurrence.event, hidden));
  return aggregateDays(shown, dates, timeZone);
}

function busiestOf(days: PickerDay[], counts: Map<PlainDate, number>): PlainDate | null {
  let busiest: PlainDate | null = null;
  let most = 0;
  for (const day of days) {
    const count = counts.get(day.date) ?? 0;
    if (count > most) {
      busiest = day.date;
      most = count;
    }
  }
  return busiest;
}

export function heatMonthModel(weeks: PickerDay[][], dayCounts: DayCount[], settings: ViewSettings): HeatMonthModel {
  const counts = new Map(dayCounts.map((day) => [day.date, day.count]));
  const inMonth = weeks.flat().filter((day) => day.inMonth);
  const maximum = Math.max(0, ...inMonth.map((day) => counts.get(day.date) ?? 0));
  const tiles = weeks.map((week) =>
    week.map((day) => {
      const count = day.inMonth ? (counts.get(day.date) ?? 0) : 0;
      return {
        date: day.date,
        number: formatPlainDate(day.date, settings, { day: "numeric" }),
        label: `${formatDayLabel(day.date, settings)}, ${eventCountLabel(count)}`,
        count,
        level: heatLevel(count, maximum),
        inMonth: day.inMonth,
        today: day.inMonth && day.today,
        selected: day.inMonth && day.selected,
      };
    }),
  );
  const total = inMonth.reduce((sum, day) => sum + (counts.get(day.date) ?? 0), 0);
  return { weeks: tiles, total, busiest: busiestOf(inMonth, counts) };
}

export function tileLevel(tile: HeatTile, look: HeatLook): HeatLevel | undefined {
  const isPlain = tile.selected || !tile.inMonth;
  if (isPlain) {
    return undefined;
  }
  return look === HeatLook.Heat ? tile.level : HeatLevel.None;
}

export function showsBadge(tile: HeatTile, look: HeatLook): boolean {
  return look === HeatLook.Count && tile.inMonth && tile.count > 0;
}
