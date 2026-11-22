"use client";

import { calendarOf } from "../../event";
import { formatDayLabel, formatPlainDate } from "../../locale";
import { toneStyles } from "../../parts/tone/style";
import { CalendarTone, type Calendar, type EventOccurrence, type PlainDate, type ViewSettings } from "../../types";
import { lineWhen, type ListDay } from "./model";
import { monthListStyles } from "./style";

type MonthListProps = {
  days: ListDay[];
  calendars: Calendar[];
  settings: ViewSettings;
  selection: { value: PlainDate; onValueChange: (date: PlainDate) => void };
};

type ListEventProps = {
  occurrence: EventOccurrence;
  calendars: Calendar[];
  settings: ViewSettings;
};

const styles = monthListStyles();

function ListEvent({ occurrence, calendars, settings }: ListEventProps) {
  const tone = toneStyles({ tone: calendarOf(occurrence.event, calendars)?.tone ?? CalendarTone.Grey });

  return (
    <span className={styles.event()}>
      <span aria-hidden="true" className={styles.bar({ class: tone.bar() })} />
      <span className={styles.text()}>
        <span className={styles.title()}>{occurrence.event.title}</span>
        <span className={styles.when()}>{lineWhen(occurrence, settings)}</span>
      </span>
    </span>
  );
}

function MonthList({ days, calendars, settings, selection }: MonthListProps) {
  return (
    <ul className={styles.root()}>
      {days.map((day) => (
        <li key={day.date}>
          <button
            aria-pressed={day.date === selection.value}
            className={styles.day()}
            onClick={() => selection.onValueChange(day.date)}
            type="button"
          >
            <span aria-hidden="true" className={styles.date()}>
              <span className={styles.weekday()}>{formatPlainDate(day.date, settings, { weekday: "short" })}</span>
              <span className={styles.number()}>{formatPlainDate(day.date, settings, { day: "numeric" })}</span>
            </span>
            <span className={styles.spoken()}>{formatDayLabel(day.date, settings)}</span>
            <span className={styles.events()}>
              {day.occurrences.map((occurrence) => (
                <ListEvent key={occurrence.key} calendars={calendars} occurrence={occurrence} settings={settings} />
              ))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export { MonthList };
