"use client";

import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";

import type { Calendar } from "../../types";
import { toneStyles } from "../tone/style";
import { calendarOptionStyles } from "./style";

type CalendarSelectProps = {
  calendars: Calendar[];
  value: string;
  onValueChange: (calendarId: string) => void;
};

type CalendarOptionProps = {
  calendar: Calendar;
};

const selectCopy = {
  label: "Calendar",
};

const styles = calendarOptionStyles();

function CalendarOption({ calendar }: CalendarOptionProps) {
  const tone = toneStyles({ tone: calendar.tone });

  return (
    <span className={styles.root()}>
      <span aria-hidden="true" className={styles.tick({ class: tone.bar() })} />
      <span className={styles.name()}>{calendar.name}</span>
    </span>
  );
}

function CalendarSelect({ calendars, value, onValueChange }: CalendarSelectProps) {
  const items = Object.fromEntries(calendars.map((calendar) => [calendar.id, <CalendarOption calendar={calendar} />]));
  const selectCalendar = (calendarId: string | null) => {
    if (calendarId !== null) {
      onValueChange(calendarId);
    }
  };

  return (
    <Select items={items} onValueChange={selectCalendar} value={value}>
      <SelectTrigger aria-label={selectCopy.label} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {calendars.map((calendar) => (
          <SelectItem key={calendar.id} value={calendar.id}>
            <CalendarOption calendar={calendar} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

export { CalendarSelect };
