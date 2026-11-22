"use client";

import type { Ref } from "react";

import { formatPlainDate } from "../../locale";
import type { PlainDate, ViewSettings } from "../../types";
import { weeksStyle } from "./geometry";
import { MonthCell } from "./month-cell";
import type { MonthWeek } from "./model";
import { monthGridStyles } from "./style";
import type { MonthKeyboard } from "./use-month-keyboard";
import type { MonthState } from "./use-month-model";
import type { MonthActions } from "./use-month-view";

type MonthGridProps = {
  month: MonthState;
  keyboard: MonthKeyboard;
  actions: MonthActions;
  gridRef: Ref<HTMLDivElement>;
  rowRef: Ref<HTMLDivElement>;
};

type WeekdayRowProps = {
  week: MonthWeek | undefined;
  settings: ViewSettings;
};

const styles = monthGridStyles();

function weekdayLabel(date: PlainDate, settings: ViewSettings, weekday: "long" | "short" | "narrow"): string {
  return formatPlainDate(date, settings, { weekday });
}

function WeekdayRow({ week, settings }: WeekdayRowProps) {
  return (
    <div className={styles.head()} role="row">
      {week?.days.map((day) => (
        <div key={day.date} aria-label={weekdayLabel(day.date, settings, "long")} className={styles.weekday()} role="columnheader">
          <span aria-hidden="true" className={styles.weekdayShort()}>
            {weekdayLabel(day.date, settings, "short")}
          </span>
          <span aria-hidden="true" className={styles.weekdayNarrow()}>
            {weekdayLabel(day.date, settings, "narrow")}
          </span>
        </div>
      ))}
    </div>
  );
}

function MonthGrid({ month, keyboard, actions, gridRef, rowRef }: MonthGridProps) {
  const { weeks } = month.model;
  const context = { view: month.view, calendars: month.calendars, activeDate: keyboard.activeDate };

  return (
    <div
      ref={gridRef}
      aria-label={month.heading.title}
      className={styles.root()}
      data-slot="month-grid"
      onBlur={keyboard.onBlur}
      onFocusCapture={keyboard.onFocusCapture}
      onKeyDown={keyboard.onKeyDown}
      role="grid"
    >
      <WeekdayRow settings={month.settings} week={weeks[0]} />
      <div className={styles.weeks()} role="rowgroup" style={weeksStyle(weeks.length)}>
        {weeks.map((week, index) => (
          <div key={week.key} ref={index === 0 ? rowRef : undefined} className={styles.week()} role="row">
            {week.days.map((day) => (
              <MonthCell key={day.date} actions={actions} context={context} day={day} lanes={week.laneCount} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { MonthGrid };
