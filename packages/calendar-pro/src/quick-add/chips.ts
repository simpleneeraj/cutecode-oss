import { minutes } from "@cutecode/calendar/time";
import {
  Attendance,
  Frequency,
  Weekday,
  type Attendee,
  type Recurrence,
  type TextSpan,
} from "@cutecode/calendar/types";

export type DurationMatch = {
  span: TextSpan;
  minutes: number;
};

export type RepeatMatch = {
  span: TextSpan;
  label: string;
  recurrence: Recurrence;
};

export type WithMatch = {
  span: TextSpan;
  attendees: Attendee[];
};

export type WhereMatch = {
  span: TextSpan;
  location: string;
};

const weekdayNames: Record<string, Weekday> = {
  sunday: Weekday.Sunday,
  sun: Weekday.Sunday,
  monday: Weekday.Monday,
  mon: Weekday.Monday,
  tuesday: Weekday.Tuesday,
  tues: Weekday.Tuesday,
  tue: Weekday.Tuesday,
  wednesday: Weekday.Wednesday,
  wed: Weekday.Wednesday,
  thursday: Weekday.Thursday,
  thurs: Weekday.Thursday,
  thur: Weekday.Thursday,
  thu: Weekday.Thursday,
  friday: Weekday.Friday,
  fri: Weekday.Friday,
  saturday: Weekday.Saturday,
  sat: Weekday.Saturday,
};

const workWeek = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday];

const frequencyWords: Record<string, Frequency> = {
  day: Frequency.Daily,
  daily: Frequency.Daily,
  week: Frequency.Weekly,
  weekly: Frequency.Weekly,
  month: Frequency.Monthly,
  monthly: Frequency.Monthly,
  year: Frequency.Yearly,
  yearly: Frequency.Yearly,
  annually: Frequency.Yearly,
};

const weekdayPattern = `(?:${Object.keys(weekdayNames)
  .sort((first, second) => second.length - first.length)
  .join("|")})s?`;

const patterns = {
  duration:
    /(?:\bfor\s+(\d+(?:\.\d+)?|an?|half\s+an)|(?<![\w.:])(\d+(?:\.\d+)?))\s*(minutes?|mins?|m|hours?|hrs?|h)\b/i,
  repeat: new RegExp(
    `\\b(?:every\\s+(?:(other|\\d+)\\s+)?(weekdays?|days?|weeks?|months?|years?|${weekdayPattern}(?:\\s*(?:,|and|&)\\s*${weekdayPattern})*)|(daily|weekly|monthly|yearly|annually))\\b`,
    "i",
  ),
  weekday: new RegExp(weekdayPattern, "gi"),
  with: /\b[Ww]ith\s+(\p{Lu}[\p{L}'-]*(?:\s+\p{Lu}[\p{L}'-]*)?(?:\s*(?:,|and|&)\s*\p{Lu}[\p{L}'-]*(?:\s+\p{Lu}[\p{L}'-]*)?)*)/u,
  nameSeparator: /\s*(?:,|\band\b|&)\s*/,
  where: /\b(?:[Aa]t|[Ii]n)\s+(\p{Lu}[\p{L}\p{N}'&.-]*(?:\s+(?:\p{Lu}[\p{L}\p{N}'&.-]*|\p{N}+\b))*)/u,
};

function spanOf(match: RegExpExecArray): TextSpan {
  return { start: match.index, end: match.index + match[0].length };
}

function durationAmount(word: string): number {
  const lower = word.toLowerCase();
  if (lower.startsWith("half")) {
    return 0.5;
  }
  if (lower === "a" || lower === "an") {
    return 1;
  }
  return Number(word);
}

export function findDuration(text: string): DurationMatch | null {
  const match = patterns.duration.exec(text);
  if (match === null) {
    return null;
  }
  const isHours = (match[3] ?? "").toLowerCase().startsWith("h");
  const total = Math.round(durationAmount(match[1] ?? match[2] ?? "") * (isHours ? minutes.hour : 1));
  if (total <= 0) {
    return null;
  }
  return { span: spanOf(match), minutes: total };
}

function weekdaysIn(words: string): Weekday[] {
  const names = words.toLowerCase().match(patterns.weekday) ?? [];
  const weekdays = names.map((name) => weekdayNames[name] ?? weekdayNames[name.slice(0, -1)]);
  return [...new Set(weekdays.filter((weekday) => weekday !== undefined))];
}

function intervalOf(word: string | undefined): number {
  if (word === undefined) {
    return 1;
  }
  if (word.toLowerCase() === "other") {
    return 2;
  }
  return Math.max(1, Number(word));
}

function recurrenceOf(unitWords: string, intervalWord: string | undefined): Recurrence {
  const interval = intervalOf(intervalWord);
  const unit = unitWords.toLowerCase().replace(/s$/, "");
  if (unit === "weekday") {
    return { frequency: Frequency.Weekly, interval, byWeekday: workWeek };
  }
  const frequency = frequencyWords[unit];
  if (frequency !== undefined) {
    return { frequency, interval };
  }
  return { frequency: Frequency.Weekly, interval, byWeekday: weekdaysIn(unitWords) };
}

export function findRepeat(text: string): RepeatMatch | null {
  const match = patterns.repeat.exec(text);
  if (match === null) {
    return null;
  }
  const unitWords = match[2] ?? match[3] ?? "";
  return { span: spanOf(match), label: match[0], recurrence: recurrenceOf(unitWords, match[1]) };
}

function attendeeOf(name: string): Attendee {
  return { id: name.toLowerCase().replace(/\s+/g, "-"), name, attendance: Attendance.Pending };
}

export function findWith(text: string): WithMatch | null {
  const match = patterns.with.exec(text);
  if (match === null) {
    return null;
  }
  const names = (match[1] ?? "").split(patterns.nameSeparator).filter((name) => name.length > 0);
  return { span: spanOf(match), attendees: names.map(attendeeOf) };
}

export function findWhere(text: string): WhereMatch | null {
  const match = patterns.where.exec(text);
  if (match === null) {
    return null;
  }
  return { span: spanOf(match), location: match[1] ?? "" };
}

export function maskSpans(text: string, spans: TextSpan[]): string {
  return spans.reduce(
    (masked, span) => masked.slice(0, span.start) + " ".repeat(span.end - span.start) + masked.slice(span.end),
    text,
  );
}

function trimmedSpan(text: string, start: number, end: number): TextSpan[] {
  const part = text.slice(start, end);
  const lead = part.search(/\S/);
  if (lead < 0) {
    return [];
  }
  return [{ start: start + lead, end: start + part.trimEnd().length }];
}

export function titleSpansOf(text: string, taken: TextSpan[]): TextSpan[] {
  const sorted = [...taken, { start: text.length, end: text.length }].sort(
    (first, second) => first.start - second.start,
  );
  const walk = sorted.reduce(
    (state, span) => ({ cursor: span.end, spans: [...state.spans, ...trimmedSpan(text, state.cursor, span.start)] }),
    { cursor: 0, spans: new Array<TextSpan>() },
  );
  return walk.spans;
}

export function spansOf(matches: ({ span: TextSpan } | null)[]): TextSpan[] {
  return matches.flatMap((match) => (match === null ? [] : [match.span]));
}

export function maskMatches(text: string, matches: ({ span: TextSpan } | null)[]): string {
  return maskSpans(text, spansOf(matches));
}

export function durationLabel(totalMinutes: number, locale: string): string {
  const isWholeHours = totalMinutes % minutes.hour === 0;
  const unit = isWholeHours ? "hour" : "minute";
  const amount = isWholeHours ? totalMinutes / minutes.hour : totalMinutes;
  return new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "short" }).format(amount);
}
