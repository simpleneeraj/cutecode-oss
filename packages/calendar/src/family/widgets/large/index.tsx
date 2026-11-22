"use client";

import { Fragment } from "react";

import { formatPlainDate } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import type { ViewSettings } from "../../../types";
import { EventLine } from "../shared/event-line";
import { lineOf, restingNote, startWithPlace, tomorrowLine, widgetCopy, type WidgetDay } from "../shared/model";
import { WidgetSize, type WidgetProps } from "../shared/props";
import { WidgetShell } from "../shared/shell";
import { useWidgetDay } from "../shared/use-widget-day";
import { monthGlance } from "./model";
import { glanceDayStyles, largeWidgetStyles } from "./style";

type LargePartProps = {
  day: WidgetDay;
  data: CalendarData;
  settings: ViewSettings;
};

const shownLimit = 3;

const placeholderLineIds = ["first", "second", "third"];

const styles = largeWidgetStyles();

function MonthGlance({ day, data, settings }: LargePartProps) {
  const weeks = monthGlance(data, day.today, settings);

  return (
    <div aria-hidden="true" className={styles.grid()}>
      <div className={styles.row()}>
        {weeks[0]?.map((cell) => (
          <span key={cell.date} className={styles.weekday()}>
            {formatPlainDate(cell.date, settings, { weekday: "narrow" })}
          </span>
        ))}
      </div>
      {weeks.map((week) => (
        <div key={week[0]?.date} className={styles.row()}>
          {week.map((cell) => (
            <b
              key={cell.date}
              className={glanceDayStyles({ inMonth: cell.inMonth, busy: cell.busy, today: cell.today })}
            >
              {cell.label}
            </b>
          ))}
        </div>
      ))}
    </div>
  );
}

function LargeLines({ day, data, settings }: LargePartProps) {
  const shown = day.upcoming.slice(0, shownLimit);
  if (shown.length === 0) {
    return (
      <Fragment>
        <p className={styles.note()}>{restingNote(day)}</p>
        {day.tomorrow && <EventLine line={tomorrowLine(day.tomorrow, data, settings)} />}
      </Fragment>
    );
  }
  return shown.map((occurrence) => (
    <EventLine key={occurrence.key} line={lineOf(occurrence, data, startWithPlace(occurrence, settings))} />
  ));
}

function LargeBody(props: LargePartProps) {
  const { day, settings } = props;

  return (
    <Fragment>
      <div className={styles.head()}>
        <strong className={styles.title()}>{formatPlainDate(day.today, settings, { month: "long" })}</strong>
        <span className={styles.count()}>{widgetCopy.today(day.plannedCount)}</span>
      </div>
      <MonthGlance {...props} />
      <div aria-hidden="true" className={styles.separator()} />
      <div className={styles.lines()}>
        <LargeLines {...props} />
      </div>
    </Fragment>
  );
}

function LargeWidget(props: WidgetProps) {
  const view = useWidgetDay(props);

  return (
    <WidgetShell placeholderLineIds={placeholderLineIds} size={WidgetSize.Large} view={view}>
      {(day) => <LargeBody data={props.data} day={day} settings={view.settings} />}
    </WidgetShell>
  );
}

export { LargeWidget };
export type { WidgetOptions, WidgetProps } from "../shared/props";
