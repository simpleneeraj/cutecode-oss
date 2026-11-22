"use client";

import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { Button } from "@cutecode/ui/components/button";
import { useState } from "react";

import { formatDayLabel, formatPlainDate } from "../../locale";
import { pickerMonth, SelectionMode, type PickerDay, type SingleSelection } from "../../picker";
import { addDays, addMonths, startOfMonth, weekDates } from "../../time";
import type { DateRange, PlainDate, ViewSettings } from "../../types";
import type { CalendarNavigation } from "../time-grid/props";
import { sidebarCopy } from "./model";
import { miniMonthStyles } from "./style";

export type MiniMonthSource = {
  busyIn: (dates: DateRange) => Set<PlainDate>;
  today: PlainDate | null;
};

type MiniMonthProps = {
  navigation: Pick<CalendarNavigation, "date" | "onDateChange">;
  source: MiniMonthSource;
  settings: ViewSettings;
};

type MiniMonthHeadProps = {
  title: string;
  onStep: (offset: number) => void;
};

type MiniDayProps = {
  day: PickerDay;
  band: PlainDate[];
  isBusy: boolean;
  settings: ViewSettings;
  onSelect: (date: PlainDate) => void;
};

const noRules = {};

const styles = miniMonthStyles();

function shownDates(weeks: PickerDay[][]): DateRange {
  const days = weeks.flat();
  const start = days[0]?.date ?? "";
  return { start, end: addDays(days.at(-1)?.date ?? start, 1) };
}

function MiniDay({ day, band, isBusy, settings, onSelect }: MiniDayProps) {
  const dayStyles = miniMonthStyles({
    inMonth: day.inMonth,
    inBand: band.includes(day.date),
    isBandStart: band[0] === day.date,
    isBandEnd: band.at(-1) === day.date,
    isSelected: day.selected,
    isToday: day.today,
  });

  return (
    <button
      aria-current={day.today ? "date" : undefined}
      aria-label={formatDayLabel(day.date, settings)}
      aria-pressed={day.selected}
      className={dayStyles.day()}
      onClick={() => onSelect(day.date)}
      type="button"
    >
      <span aria-hidden="true" className={dayStyles.number()}>
        {formatPlainDate(day.date, settings, { day: "numeric" })}
      </span>
      {isBusy && <span aria-hidden="true" className={dayStyles.busy()} />}
    </button>
  );
}

function MiniMonthHead({ title, onStep }: MiniMonthHeadProps) {
  return (
    <div className={styles.head()}>
      <h3 className={styles.title()}>{title}</h3>
      <div className={styles.steps()}>
        <Button aria-label={sidebarCopy.previousMonth} onClick={() => onStep(-1)} size="icon-sm" variant="ghost">
          <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
        <Button aria-label={sidebarCopy.nextMonth} onClick={() => onStep(1)} size="icon-sm" variant="ghost">
          <AltArrowRightIcon aria-hidden="true" className={styles.arrow()} />
        </Button>
      </div>
    </div>
  );
}

function MiniMonth({ navigation, source, settings }: MiniMonthProps) {
  const { date } = navigation;
  const [browse, setBrowse] = useState({ date, month: startOfMonth(date) });
  const month = browse.date === date ? browse.month : startOfMonth(date);
  const selection: SingleSelection = { mode: SelectionMode.Single, date };
  const weeks = pickerMonth(month, settings, selection, noRules, source.today ?? "");
  const busy = source.busyIn(shownDates(weeks));
  const band = weekDates(date, settings.weekStartsOn);
  const step = (offset: number) => setBrowse({ date, month: addMonths(month, offset) });
  const title = formatPlainDate(month, settings, { month: "long", year: "numeric" });

  return (
    <div className={styles.root()} data-slot="mini-month">
      <MiniMonthHead onStep={step} title={title} />
      <div aria-label={title} className={styles.grid()} role="group">
        {weeks[0]?.map((day) => (
          <span key={day.date} aria-hidden="true" className={styles.weekday()}>
            {formatPlainDate(day.date, settings, { weekday: "narrow" })}
          </span>
        ))}
        {weeks.flat().map((day) => (
          <MiniDay
            key={day.date}
            band={band}
            day={day}
            isBusy={busy.has(day.date) && !day.today}
            onSelect={navigation.onDateChange}
            settings={settings}
          />
        ))}
      </div>
    </div>
  );
}

export { MiniMonth };
