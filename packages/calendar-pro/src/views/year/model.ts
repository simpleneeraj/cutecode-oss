import { formatDayLabel, formatPlainDate } from "@cutecode/calendar/locale";
import { addMonths, monthWeeks, startOfMonth, weekDates } from "@cutecode/calendar/time";
import type { DayCount, PlainDate, ViewSettings } from "@cutecode/calendar/types";

import { heatLevel, HeatLevel } from "../../heat/aggregate";

export type HeatDay = {
  date: PlainDate;
  count: number;
  level: HeatLevel;
  isToday: boolean;
  label: string;
};

export type HeatCell = { key: string; day: HeatDay | null };

export type HeatMonth = {
  key: PlainDate;
  title: string;
  isCurrent: boolean;
  weeks: HeatCell[][];
  total: number;
};

export type WeekdayName = { key: PlainDate; long: string };

export type YearModel = {
  year: string;
  months: HeatMonth[];
  weekdays: WeekdayName[];
  total: number;
  busiestMonth: string | null;
  days: Map<PlainDate, HeatDay>;
};

export type YearInput = {
  firstDay: PlainDate;
  counts: DayCount[];
  settings: ViewSettings;
  today: PlainDate | null;
};

const monthsInYear = 12;

const countCopy = {
  none: "No events",
  one: "1 event",
  many: (count: number) => `${count} events`,
};

export function eventCountLabel(count: number): string {
  if (count === 0) {
    return countCopy.none;
  }
  return count === 1 ? countCopy.one : countCopy.many(count);
}

function heatDays(input: YearInput): Map<PlainDate, HeatDay> {
  const maximum = Math.max(0, ...input.counts.map((day) => day.count));
  const entries = input.counts.map(({ date, count }): [PlainDate, HeatDay] => {
    const label = `${formatDayLabel(date, input.settings)}, ${eventCountLabel(count)}`;
    return [date, { date, count, level: heatLevel(count, maximum), isToday: date === input.today, label }];
  });
  return new Map(entries);
}

function monthOf(first: PlainDate, days: Map<PlainDate, HeatDay>, input: YearInput): HeatMonth {
  const weeks = monthWeeks(first, input.settings.weekStartsOn).map((week) =>
    week.map((date) => ({ key: date, day: startOfMonth(date) === first ? (days.get(date) ?? null) : null })),
  );
  const total = weeks.flat().reduce((sum, cell) => sum + (cell.day?.count ?? 0), 0);
  return {
    key: first,
    title: formatPlainDate(first, input.settings, { month: "long" }),
    isCurrent: input.today !== null && startOfMonth(input.today) === first,
    weeks,
    total,
  };
}

function busiestOf(months: HeatMonth[]): string | null {
  const busiest = months.reduce<HeatMonth | null>((best, month) => (month.total > (best?.total ?? 0) ? month : best), null);
  return busiest?.title ?? null;
}

export function buildYearModel(input: YearInput): YearModel {
  const days = heatDays(input);
  const months = Array.from({ length: monthsInYear }, (_, index) => monthOf(addMonths(input.firstDay, index), days, input));
  const weekdays = weekDates(input.firstDay, input.settings.weekStartsOn).map((date) => ({
    key: date,
    long: formatPlainDate(date, input.settings, { weekday: "long" }),
  }));
  return {
    year: formatPlainDate(input.firstDay, input.settings, { year: "numeric" }),
    months,
    weekdays,
    total: months.reduce((sum, month) => sum + month.total, 0),
    busiestMonth: busiestOf(months),
    days,
  };
}

export function monthIndexOf(date: PlainDate, model: YearModel): number {
  return model.months.findIndex((month) => month.key === startOfMonth(date));
}
