import { RRule, Frequency as RuleFrequency, type Options, type Weekday as RuleWeekday } from "rrule";
import {
  addDays,
  daysBetween,
  formatDateTime,
  isPlainDate,
  milliseconds,
  minutes,
  parseDateTime,
  plainDateOf,
  toInstant,
  toUtcDate,
  toWallClock,
} from "@cutecode/calendar/time";
import { Frequency, Weekday, type CalendarEvent, type WallClock } from "@cutecode/calendar/types";

type EventTimes = Pick<CalendarEvent, "start" | "end" | "allDay">;

const ruleFrequencies: Record<Frequency, RuleFrequency> = {
  [Frequency.Daily]: RuleFrequency.DAILY,
  [Frequency.Weekly]: RuleFrequency.WEEKLY,
  [Frequency.Monthly]: RuleFrequency.MONTHLY,
  [Frequency.Yearly]: RuleFrequency.YEARLY,
};

const ruleWeekdays: Record<Weekday, RuleWeekday> = {
  [Weekday.Monday]: RRule.MO,
  [Weekday.Tuesday]: RRule.TU,
  [Weekday.Wednesday]: RRule.WE,
  [Weekday.Thursday]: RRule.TH,
  [Weekday.Friday]: RRule.FR,
  [Weekday.Saturday]: RRule.SA,
  [Weekday.Sunday]: RRule.SU,
};

export function floatingDate(wallClock: WallClock): Date {
  return new Date(toUtcDate(wallClock.date).getTime() + wallClock.minute * milliseconds.minute);
}

export function wallClockOfFloating(floating: Date): WallClock {
  const date = plainDateOf(floating.getUTCFullYear(), floating.getUTCMonth() + 1, floating.getUTCDate());
  return { date, minute: floating.getUTCHours() * minutes.hour + floating.getUTCMinutes() };
}

export function wallClockOfValue(value: string, timeZone: string): WallClock {
  if (isPlainDate(value)) {
    return { date: value, minute: 0 };
  }
  return toWallClock(parseDateTime(value, timeZone), timeZone);
}

export function formatSlot(wallClock: WallClock, allDay: boolean, timeZone: string): string {
  if (allDay) {
    return wallClock.date;
  }
  return formatDateTime(toInstant(wallClock, timeZone), timeZone);
}

export function canonicalStart(value: string, series: CalendarEvent): string {
  return formatSlot(wallClockOfValue(value, series.timeZone), series.allDay, series.timeZone);
}

export function slotOrder(value: string, series: CalendarEvent): number {
  return floatingDate(wallClockOfValue(value, series.timeZone)).getTime();
}

function untilOf(until: string, timeZone: string): Date {
  if (!isPlainDate(until)) {
    return floatingDate(wallClockOfValue(until, timeZone));
  }
  const nextDay = floatingDate({ date: addDays(until, 1), minute: 0 });
  return new Date(nextDay.getTime() - milliseconds.second);
}

export function toRRuleOptions(event: CalendarEvent): Partial<Options> {
  const recurrence = event.recurrence;
  if (recurrence === undefined) {
    throw new RangeError(`Event ${event.id} does not repeat`);
  }
  const byWeekday = recurrence.byWeekday?.map((weekday) => ruleWeekdays[weekday]) ?? null;
  const until = recurrence.until === undefined ? null : untilOf(recurrence.until, event.timeZone);
  return {
    freq: ruleFrequencies[recurrence.frequency],
    dtstart: floatingDate(wallClockOfValue(event.start, event.timeZone)),
    interval: Math.max(1, recurrence.interval),
    byweekday: byWeekday,
    bymonthday: recurrence.byMonthDay ?? null,
    bysetpos: recurrence.bySetPosition ?? null,
    count: recurrence.count ?? null,
    until,
    wkst: ruleWeekdays[recurrence.weekStartsOn ?? Weekday.Monday],
  };
}

export function ruleOf(event: CalendarEvent): RRule {
  return new RRule(toRRuleOptions(event));
}

export function seriesSlotOf(value: string, series: CalendarEvent): WallClock {
  const shown = wallClockOfValue(value, series.timeZone);
  const canonical = canonicalStart(value, series);
  const around = floatingDate(shown).getTime();
  const slot = ruleOf(series)
    .between(new Date(around - milliseconds.day), new Date(around + milliseconds.day), true)
    .map(wallClockOfFloating)
    .find((wallClock) => formatSlot(wallClock, series.allDay, series.timeZone) === canonical);
  return slot ?? shown;
}

export function endAfter(start: string, change: EventTimes, timeZone: string): string {
  if (change.allDay) {
    return addDays(start, daysBetween(change.start, change.end));
  }
  const duration = parseDateTime(change.end, timeZone) - parseDateTime(change.start, timeZone);
  return formatDateTime(parseDateTime(start, timeZone) + duration, timeZone);
}

export function usedCount(series: CalendarEvent, originalStart: string): number {
  const rule = ruleOf(series);
  const dtstart = rule.options.dtstart.getTime();
  const slot = floatingDate(seriesSlotOf(originalStart, series));
  return rule.between(new Date(dtstart - milliseconds.second), slot, false).length;
}

export function untilBefore(originalStart: string, series: CalendarEvent): string {
  if (series.allDay) {
    return addDays(originalStart, -1);
  }
  const rule = ruleOf(series);
  const previous = rule.before(floatingDate(seriesSlotOf(originalStart, series)), false) ?? rule.options.dtstart;
  return formatSlot(wallClockOfFloating(previous), false, series.timeZone);
}
