"use client";

import { formatDayLabel, formatPlainDate } from "../../locale";
import type { PickerDay } from "../../picker";
import type { PlainDate, ViewSettings } from "../../types";
import { fallbackDateOf } from "../date-grid/fallback";
import { useDateGridFocus, type DateCellFocus } from "../date-grid/use-date-grid-focus";
import type { FamilySettings } from "../family-options/use-family-settings";
import { dayMarkOf } from "./choices";
import { dayGridStyles } from "./style";

type DayGridProps = {
  weeks: PickerDay[][];
  family: FamilySettings;
  preferred: (PlainDate | null)[];
  onSelect: (date: PlainDate) => void;
  onReveal: (date: PlainDate) => void;
};

type DayCellProps = {
  day: PickerDay;
  settings: ViewSettings;
  focus: DateCellFocus;
  onSelect: (date: PlainDate) => void;
};

const styles = dayGridStyles();

function DayCell({ day, settings, focus, onSelect }: DayCellProps) {
  const number = formatPlainDate(day.date, settings, { day: "numeric" });
  if (!day.inMonth) {
    return (
      <div className={styles.out()} role="gridcell">
        <span aria-hidden="true">{number}</span>
      </div>
    );
  }
  const mark = dayMarkOf(day);
  const dayStyles = dayGridStyles({ ...mark, isToday: day.today, isDisabled: day.disabled });
  return (
    <div
      aria-disabled={day.disabled || undefined}
      aria-selected={day.selected}
      className={dayStyles.cell()}
      role="gridcell"
    >
      <button
        {...focus}
        aria-current={day.today ? "date" : undefined}
        aria-disabled={day.disabled || undefined}
        aria-label={formatDayLabel(day.date, settings)}
        className={dayStyles.day()}
        onClick={() => onSelect(day.date)}
        type="button"
      >
        <span className={dayStyles.number()}>{number}</span>
      </button>
    </div>
  );
}

function DayGrid({ weeks, family, preferred, onSelect, onReveal }: DayGridProps) {
  const { settings, direction } = family;
  const dates = weeks
    .flat()
    .filter((day) => day.inMonth)
    .map((day) => day.date);
  const fallbackDate = fallbackDateOf(dates, preferred);
  const { gridRef, onKeyDown, cellFocus } = useDateGridFocus({
    dates,
    fallbackDate,
    direction,
    timeZone: settings.timeZone,
    onReveal,
  });
  const title = formatPlainDate(fallbackDate, settings, { month: "long", year: "numeric" });

  return (
    <div ref={gridRef} aria-label={title} className={styles.root()} onKeyDown={onKeyDown} role="grid">
      <div className={styles.row()} role="row">
        {weeks[0]?.map((day) => (
          <span key={day.date} className={styles.weekday()} role="columnheader">
            <span aria-hidden="true">{formatPlainDate(day.date, settings, { weekday: "narrow" })}</span>
            <span className={styles.spoken()}>{formatPlainDate(day.date, settings, { weekday: "long" })}</span>
          </span>
        ))}
      </div>
      {weeks.map((week) => (
        <div key={week[0]?.date} className={styles.row()} role="row">
          {week.map((day) => (
            <DayCell key={day.date} day={day} focus={cellFocus(day.date)} onSelect={onSelect} settings={settings} />
          ))}
        </div>
      ))}
    </div>
  );
}

export { DayGrid };
