import { dateTimeFormat, formatPlainDate } from "../../locale";
import { addDays, startOfMonth, toUtcDate } from "../../time";
import { ViewKind, type PlainDate, type ViewRange, type ViewSettings } from "../../types";

export type ToolbarHeading = {
  title: string;
  subtitle: string;
};

function formatDateRange(
  start: PlainDate,
  end: PlainDate,
  settings: ViewSettings,
  options: Intl.DateTimeFormatOptions,
) {
  return dateTimeFormat(settings.locale, { ...options, timeZone: "UTC" }).formatRange(toUtcDate(start), toUtcDate(end));
}

function weekHeading(range: ViewRange, settings: ViewSettings): ToolbarHeading {
  const first = range.dates.start;
  const last = addDays(range.dates.end, -1);
  const isOneMonth = startOfMonth(first) === startOfMonth(last);
  const title = isOneMonth
    ? formatPlainDate(first, settings, { month: "long", year: "numeric" })
    : formatDateRange(first, last, settings, { month: "short", year: "numeric" });
  return { title, subtitle: formatDateRange(first, last, settings, { month: "short", day: "numeric" }) };
}

function dayHeading(range: ViewRange, settings: ViewSettings): ToolbarHeading {
  return {
    title: formatPlainDate(range.anchor, settings, { month: "long", day: "numeric", year: "numeric" }),
    subtitle: formatPlainDate(range.anchor, settings, { weekday: "long" }),
  };
}

export function rangeHeading(range: ViewRange, settings: ViewSettings): ToolbarHeading {
  return range.kind === ViewKind.Day ? dayHeading(range, settings) : weekHeading(range, settings);
}
