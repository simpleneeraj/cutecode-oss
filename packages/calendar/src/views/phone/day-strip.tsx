"use client";

import { formatDayLabel, formatPlainDate } from "../../locale";
import type { PlainDate, ViewSettings } from "../../types";
import type { WeekStripDay } from "../../widgets";
import { dayStripStyles } from "./style";

type DayStripProps = {
  days: WeekStripDay[];
  settings: ViewSettings;
  onSelect: (date: PlainDate) => void;
};

const stripCopy = {
  label: "Days of the week",
};

function DayStrip({ days, settings, onSelect }: DayStripProps) {
  return (
    <div aria-label={stripCopy.label} className={dayStripStyles().root()} data-slot="day-strip" role="group">
      {days.map((day) => {
        const styles = dayStripStyles({ isToday: day.today });
        return (
          <button
            key={day.date}
            aria-label={formatDayLabel(day.date, settings)}
            aria-pressed={day.selected}
            className={styles.day()}
            onClick={() => onSelect(day.date)}
            type="button"
          >
            <span aria-hidden="true">{formatPlainDate(day.date, settings, { weekday: "narrow" })}</span>
            <span aria-hidden="true" className={styles.number()}>
              {formatPlainDate(day.date, settings, { day: "numeric" })}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { DayStrip };
