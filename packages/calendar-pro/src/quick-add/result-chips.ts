import { formatPlainDate, formatTime } from "@cutecode/calendar/locale";
import {
  QuickAddField,
  type Instant,
  type PlainDate,
  type QuickAddChip,
  type QuickAddContext,
  type TextSpan,
} from "@cutecode/calendar/types";
import { durationLabel, type DurationMatch, type RepeatMatch, type WhereMatch, type WithMatch } from "./chips";
import type { MomentMatch } from "./moment";

export type Extraction = {
  duration: DurationMatch | null;
  repeat: RepeatMatch | null;
  moment: MomentMatch | null;
  with: WithMatch | null;
  where: WhereMatch | null;
  title: string;
  titleSpans: TextSpan[];
};

export type Timing = {
  date: PlainDate;
  endDate: PlainDate;
  start: Instant | null;
  end: Instant | null;
};

function dayChips(moment: MomentMatch | null, timing: Timing, context: QuickAddContext): QuickAddChip[] {
  const daySpan = moment?.daySpan ?? null;
  if (moment === null || daySpan === null) {
    return [];
  }
  const dateLabel = formatPlainDate(timing.date, context.settings, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const mergedStart = moment.timeSpan === null ? timing.start : null;
  const label = mergedStart === null ? dateLabel : `${dateLabel}, ${formatTime(mergedStart, context.settings)}`;
  return [{ field: QuickAddField.Day, label, span: daySpan }];
}

function timeChips(moment: MomentMatch | null, timing: Timing, context: QuickAddContext): QuickAddChip[] {
  const timeSpan = moment?.timeSpan ?? null;
  if (timeSpan === null || timing.start === null) {
    return [];
  }
  return [{ field: QuickAddField.Time, label: formatTime(timing.start, context.settings), span: timeSpan }];
}

function titleChips(text: string, titleSpans: TextSpan[]): QuickAddChip[] {
  return titleSpans.map((span) => ({
    field: QuickAddField.Title,
    label: text.slice(span.start, span.end).replace(/\s+/g, " "),
    span,
  }));
}

function textChips(extraction: Extraction, locale: string): QuickAddChip[] {
  const { duration, repeat, where } = extraction;
  const attendees = extraction.with;
  const chips: QuickAddChip[] = [];
  if (duration !== null) {
    chips.push({ field: QuickAddField.Duration, label: durationLabel(duration.minutes, locale), span: duration.span });
  }
  if (repeat !== null) {
    chips.push({ field: QuickAddField.Repeat, label: repeat.label, span: repeat.span });
  }
  if (attendees !== null) {
    const label = attendees.attendees.map((attendee) => attendee.name).join(", ");
    chips.push({ field: QuickAddField.With, label, span: attendees.span });
  }
  if (where !== null) {
    chips.push({ field: QuickAddField.Where, label: where.location, span: where.span });
  }
  return chips;
}

export function chipsOf(
  text: string,
  extraction: Extraction,
  timing: Timing,
  context: QuickAddContext,
): QuickAddChip[] {
  const chips = [
    ...titleChips(text, extraction.titleSpans),
    ...textChips(extraction, context.settings.locale),
    ...dayChips(extraction.moment, timing, context),
    ...timeChips(extraction.moment, timing, context),
  ];
  return chips.sort((first, second) => first.span.start - second.span.start);
}
