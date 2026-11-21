import { compareDates, weekDates } from "../time";
import type { PlainDate, ViewSettings } from "../types";

export type WeekStripDay = {
  date: PlainDate;
  today: boolean;
  selected: boolean;
  past: boolean;
};

export function weekStrip(anchor: PlainDate, settings: ViewSettings, today: PlainDate): WeekStripDay[] {
  return weekDates(anchor, settings.weekStartsOn).map((date) => ({
    date,
    today: date === today,
    selected: date === anchor,
    past: compareDates(date, today) < 0,
  }));
}
