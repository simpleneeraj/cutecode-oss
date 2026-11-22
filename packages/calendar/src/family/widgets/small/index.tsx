"use client";

import { Fragment } from "react";

import type { CalendarData } from "../../../parts/time-grid/props";
import type { ViewSettings } from "../../../types";
import { EventLine } from "../shared/event-line";
import {
  dayNumberOf,
  lineOf,
  restingNote,
  timeRangeOf,
  tomorrowLine,
  weekdayOfDate,
  type WidgetDay,
} from "../shared/model";
import { WidgetSize, type WidgetProps } from "../shared/props";
import { widgetDateStyles } from "../shared/style";
import { WidgetShell } from "../shared/shell";
import { useWidgetDay } from "../shared/use-widget-day";
import { smallWidgetStyles } from "./style";

type SmallBodyProps = {
  day: WidgetDay;
  data: CalendarData;
  settings: ViewSettings;
};

const shownLimit = 2;

const placeholderLineIds = ["first", "second"];

const styles = smallWidgetStyles();

const dateStyles = widgetDateStyles();

function SmallRest({ day, data, settings }: SmallBodyProps) {
  return (
    <Fragment>
      <p className={styles.note()}>{restingNote(day)}</p>
      {day.tomorrow && <EventLine line={tomorrowLine(day.tomorrow, data, settings)} />}
    </Fragment>
  );
}

function SmallBody({ day, data, settings }: SmallBodyProps) {
  const shown = day.upcoming.slice(0, shownLimit);

  return (
    <Fragment>
      <div className={dateStyles.root()}>
        <small className={dateStyles.weekday()}>{weekdayOfDate(day.today, settings)}</small>
        <b className={dateStyles.number()}>{dayNumberOf(day.today, settings)}</b>
      </div>
      {shown.length === 0 ? (
        <SmallRest data={data} day={day} settings={settings} />
      ) : (
        <div className={styles.lines()}>
          {shown.map((occurrence) => (
            <EventLine key={occurrence.key} line={lineOf(occurrence, data, timeRangeOf(occurrence, settings))} />
          ))}
        </div>
      )}
    </Fragment>
  );
}

function SmallWidget(props: WidgetProps) {
  const view = useWidgetDay(props);

  return (
    <WidgetShell placeholderLineIds={placeholderLineIds} size={WidgetSize.Small} view={view}>
      {(day) => <SmallBody data={props.data} day={day} settings={view.settings} />}
    </WidgetShell>
  );
}

export { SmallWidget };
export type { WidgetOptions, WidgetProps } from "../shared/props";
