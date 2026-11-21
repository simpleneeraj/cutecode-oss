import type { Chrono } from "chrono-node/en";
import {
  addDays,
  compareDates,
  dateOf,
  formatDateTime,
  milliseconds,
  toInstant,
  weekdayOf,
} from "@cutecode/calendar/time";
import {
  ChangeSource,
  QuickAddField,
  type EventDraft,
  type Instant,
  type PlainDate,
  type QuickAddContext,
  type QuickAddParser,
  type QuickAddParserLoader,
  type QuickAddResult,
  type Recurrence,
  type WallClock,
} from "@cutecode/calendar/types";
import { findDuration, findRepeat, findWhere, findWith, maskMatches, maskSpans, spansOf, titleSpansOf } from "./chips";
import { findMoment, type MomentMatch } from "./moment";
import { chipsOf, type Extraction, type Timing } from "./result-chips";

const defaultDurationMinutes = 60;

function extract(text: string, context: QuickAddContext, chrono: Chrono): Extraction {
  const duration = findDuration(text);
  const repeat = findRepeat(maskMatches(text, [duration]));
  const moment = findMoment(maskMatches(text, [duration, repeat]), context, chrono);
  const withMatch = findWith(maskMatches(text, [duration, repeat, moment]));
  const where = findWhere(maskMatches(text, [duration, repeat, moment, withMatch]));
  const taken = spansOf([duration, repeat, moment, withMatch, where]);
  const title = maskSpans(text, taken).trim().replace(/\s+/g, " ");
  return { duration, repeat, moment, with: withMatch, where, title, titleSpans: titleSpansOf(text, taken) };
}

function firstRepeatDate(recurrence: Recurrence, today: PlainDate): PlainDate {
  const weekdays = recurrence.byWeekday ?? [];
  const offsets = Array.from({ length: 7 }, (_, offset) => offset);
  const offset = offsets.find((candidate) => weekdays.includes(weekdayOf(addDays(today, candidate))));
  return addDays(today, offset ?? 0);
}

function startDateOf(extraction: Extraction, today: PlainDate): PlainDate {
  const parsedDate = extraction.moment?.date;
  if (parsedDate !== undefined && parsedDate !== null) {
    return parsedDate;
  }
  if (extraction.repeat !== null) {
    return firstRepeatDate(extraction.repeat.recurrence, today);
  }
  return today;
}

function instantOf(wallClock: WallClock, timeZone: string, offsetMinutes: number | null): Instant {
  if (offsetMinutes === null) {
    return toInstant(wallClock, timeZone);
  }
  return toInstant(wallClock, "UTC") - offsetMinutes * milliseconds.minute;
}

function endInstantOf(moment: MomentMatch, start: WallClock, timeZone: string): Instant {
  const startInstant = instantOf(start, timeZone, moment.offsetMinutes);
  const endMinute = moment.endMinute;
  if (endMinute === null) {
    return startInstant + defaultDurationMinutes * milliseconds.minute;
  }
  const endDate = moment.endDate ?? start.date;
  const statedEnd = instantOf({ date: endDate, minute: endMinute }, timeZone, moment.offsetMinutes);
  if (statedEnd > startInstant) {
    return statedEnd;
  }
  return instantOf({ date: addDays(start.date, 1), minute: endMinute }, timeZone, moment.offsetMinutes);
}

function allDayEndOf(moment: MomentMatch | null, date: PlainDate): PlainDate {
  const endDate = moment?.endDate ?? null;
  const isLater = endDate !== null && compareDates(endDate, date) >= 0;
  return addDays(isLater ? endDate : date, 1);
}

function isDayGuessed(extraction: Extraction): boolean {
  return (extraction.moment?.date ?? null) === null && extraction.repeat === null;
}

function timedTiming(extraction: Extraction, moment: MomentMatch, start: WallClock, timeZone: string): Timing {
  const startInstant = instantOf(start, timeZone, moment.offsetMinutes);
  const durationMinutes = extraction.duration?.minutes ?? null;
  const end =
    durationMinutes === null
      ? endInstantOf(moment, start, timeZone)
      : startInstant + durationMinutes * milliseconds.minute;
  return { date: start.date, endDate: start.date, start: startInstant, end };
}

function timingOf(extraction: Extraction, context: QuickAddContext): Timing {
  const timeZone = context.settings.timeZone;
  const date = startDateOf(extraction, dateOf(context.now, timeZone));
  const moment = extraction.moment;
  const minute = moment?.minute ?? null;
  if (moment === null || minute === null) {
    return { date, endDate: allDayEndOf(moment, date), start: null, end: null };
  }
  const timing = timedTiming(extraction, moment, { date, minute }, timeZone);
  const isPast = timing.start !== null && timing.start < context.now;
  if (!isPast || !isDayGuessed(extraction)) {
    return timing;
  }
  return timedTiming(extraction, moment, { date: addDays(date, 1), minute }, timeZone);
}

function timedFields(timing: Timing, timeZone: string): Pick<EventDraft, "start" | "end" | "allDay"> {
  if (timing.start === null || timing.end === null) {
    return { start: timing.date, end: timing.endDate, allDay: true };
  }
  return { start: formatDateTime(timing.start, timeZone), end: formatDateTime(timing.end, timeZone), allDay: false };
}

function draftOf(extraction: Extraction, timing: Timing, context: QuickAddContext): EventDraft {
  const timeZone = context.settings.timeZone;
  const draft: EventDraft = {
    calendarId: context.calendarId,
    title: extraction.title,
    ...timedFields(timing, timeZone),
    timeZone,
    source: ChangeSource.QuickAdd,
  };
  if (extraction.where !== null) {
    draft.location = extraction.where.location;
  }
  if (extraction.with !== null) {
    draft.attendees = extraction.with.attendees;
  }
  if (extraction.repeat !== null) {
    draft.recurrence = { ...extraction.repeat.recurrence, weekStartsOn: context.settings.weekStartsOn };
  }
  return draft;
}

function missingOf(extraction: Extraction, timing: Timing): QuickAddField[] {
  const isDayKnown = (extraction.moment?.date ?? null) !== null || extraction.repeat !== null;
  return [
    ...(extraction.title === "" ? [QuickAddField.Title] : []),
    ...(isDayKnown ? [] : [QuickAddField.Day]),
    ...(timing.start === null ? [QuickAddField.Time] : []),
  ];
}

export function parseQuickAdd(text: string, context: QuickAddContext, chrono: Chrono): QuickAddResult {
  const isEmpty = text.trim() === "";
  if (isEmpty) {
    return { draft: null, chips: [], missing: [QuickAddField.Day, QuickAddField.Time] };
  }
  const extraction = extract(text, context, chrono);
  const timing = timingOf(extraction, context);
  return {
    draft: draftOf(extraction, timing, context),
    chips: chipsOf(text, extraction, timing, context),
    missing: missingOf(extraction, timing),
  };
}

export const loadQuickAddParser: QuickAddParserLoader = async () => {
  const { casual } = await import("chrono-node/en");
  const parser: QuickAddParser = (text, context) => parseQuickAdd(text, context, casual);
  return parser;
};
