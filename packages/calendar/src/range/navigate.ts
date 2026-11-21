import { addDays, addMonths, addYears } from "../time";
import { ViewKind, type PlainDate } from "../types";
import { rangeDays } from "./visible";

export function navigate(kind: ViewKind, anchor: PlainDate, step: number): PlainDate {
  switch (kind) {
    case ViewKind.Day:
      return addDays(anchor, step * rangeDays.day);
    case ViewKind.Week:
      return addDays(anchor, step * rangeDays.week);
    case ViewKind.Month:
      return addMonths(anchor, step);
    case ViewKind.Year:
      return addYears(anchor, step);
    case ViewKind.Agenda:
      return addDays(anchor, step * rangeDays.agenda);
  }
}
