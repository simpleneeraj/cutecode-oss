import type { Chrono, Component, ParsedResult } from "chrono-node/en";
import { minutes, offsetMinutesAt, plainDateOf } from "@cutecode/calendar/time";
import type { PlainDate, QuickAddContext, TextSpan } from "@cutecode/calendar/types";

export type MomentMatch = {
  span: TextSpan;
  daySpan: TextSpan | null;
  timeSpan: TextSpan | null;
  date: PlainDate | null;
  minute: number | null;
  endDate: PlainDate | null;
  endMinute: number | null;
  offsetMinutes: number | null;
};

type MomentParts = Pick<MomentMatch, "daySpan" | "timeSpan">;

type TextParser = (text: string) => ParsedResult | undefined;
const dayComponents: Component[] = ["year", "month", "day", "weekday"];

function dateOfComponents(components: ParsedResult["start"]): PlainDate | null {
  const isKnown = dayComponents.some((component) => components.isCertain(component));
  if (!isKnown) {
    return null;
  }
  return plainDateOf(components.get("year") ?? 0, components.get("month") ?? 1, components.get("day") ?? 1);
}

function minuteOfComponents(components: ParsedResult["start"]): number | null {
  if (!components.isCertain("hour")) {
    return null;
  }
  return (components.get("hour") ?? 0) * minutes.hour + (components.get("minute") ?? 0);
}

function offsetOfComponents(components: ParsedResult["start"]): number | null {
  if (!components.isCertain("timezoneOffset")) {
    return null;
  }
  return components.get("timezoneOffset");
}

function isSingleMoment(result: ParsedResult | undefined): result is ParsedResult {
  return result !== undefined && (result.end ?? null) === null;
}

function isDayOnly(result: ParsedResult | undefined): boolean {
  if (!isSingleMoment(result)) {
    return false;
  }
  return dateOfComponents(result.start) !== null && minuteOfComponents(result.start) === null;
}

function isTimeOnly(result: ParsedResult | undefined): boolean {
  if (!isSingleMoment(result)) {
    return false;
  }
  return dateOfComponents(result.start) === null && minuteOfComponents(result.start) !== null;
}

function wholeResult(text: string, span: TextSpan, parseText: TextParser): ParsedResult | undefined {
  const part = text.slice(span.start, span.end);
  const result = parseText(part);
  const isWhole = result !== undefined && result.index === 0 && result.text.length === part.length;
  return isWhole ? result : undefined;
}

function splitAt(text: string, span: TextSpan, gap: RegExpExecArray, parseText: TextParser): MomentParts | null {
  const first = { start: span.start, end: span.start + gap.index };
  const second = { start: first.end + gap[0].length, end: span.end };
  const firstResult = wholeResult(text, first, parseText);
  const secondResult = wholeResult(text, second, parseText);
  if (isDayOnly(firstResult) && isTimeOnly(secondResult)) {
    return { daySpan: first, timeSpan: second };
  }
  if (isTimeOnly(firstResult) && isDayOnly(secondResult)) {
    return { daySpan: second, timeSpan: first };
  }
  return null;
}

function momentParts(text: string, span: TextSpan, result: ParsedResult, parseText: TextParser): MomentParts {
  const hasDate = dateOfComponents(result.start) !== null;
  const hasTime = minuteOfComponents(result.start) !== null;
  if (!hasDate) {
    return { daySpan: null, timeSpan: hasTime ? span : null };
  }
  if (!hasTime) {
    return { daySpan: span, timeSpan: null };
  }
  const gaps = [...text.slice(span.start, span.end).matchAll(/\s+/g)];
  const split = gaps.map((gap) => splitAt(text, span, gap, parseText)).find((parts) => parts !== null);
  return split ?? { daySpan: span, timeSpan: null };
}

function momentOf(text: string, parseText: TextParser): MomentMatch | null {
  const result = parseText(text);
  if (result === undefined) {
    return null;
  }
  const end = result.end ?? null;
  const span = { start: result.index, end: result.index + result.text.length };
  return {
    span,
    ...momentParts(text, span, result, parseText),
    date: dateOfComponents(result.start),
    minute: minuteOfComponents(result.start),
    endDate: end === null ? null : dateOfComponents(end),
    endMinute: end === null ? null : minuteOfComponents(end),
    offsetMinutes: offsetOfComponents(result.start),
  };
}

export function findMoment(text: string, context: QuickAddContext, chrono: Chrono): MomentMatch | null {
  const timeZone = context.settings.timeZone;
  const reference = { instant: new Date(context.now), timezone: offsetMinutesAt(context.now, timeZone) };
  const parseText: TextParser = (part) => chrono.parse(part, reference, { forwardDate: true })[0];
  return momentOf(text, parseText);
}
