"use client";

import { Fragment } from "react";

import { formatPlainDate } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import type { ViewSettings } from "../../../types";
import { EventLine } from "../shared/event-line";
import {
  lineOf,
  restingNote,
  timeRangeOf,
  tomorrowLine,
  weekdayOfDate,
  widgetCopy,
  type WidgetDay,
} from "../shared/model";
import { WidgetSize, type WidgetProps } from "../shared/props";
import { WidgetShell } from "../shared/shell";
import { useWidgetDay } from "../shared/use-widget-day";
import { mediumWidgetStyles } from "./style";

type MediumPartProps = {
  day: WidgetDay;
  data: CalendarData;
  settings: ViewSettings;
};

const shownLimit = 2;

const placeholderLineIds = ["first", "second"];

const styles = mediumWidgetStyles();

function DateTile({ day, settings }: Omit<MediumPartProps, "data">) {
  return (
    <div className={styles.tile()}>
      <b className={styles.tileDate()}>{formatPlainDate(day.today, settings, { month: "short", day: "numeric" })}</b>
      <span className={styles.tileText()}>
        <span>{weekdayOfDate(day.today, settings)}</span>
        <span>{widgetCopy.events(day.plannedCount)}</span>
      </span>
    </div>
  );
}

function UpcomingList({ day, data, settings }: MediumPartProps) {
  const shown = day.upcoming.slice(0, shownLimit);
  const hiddenCount = day.upcoming.length - shown.length;

  if (shown.length === 0) {
    return (
      <Fragment>
        <p className={styles.note()}>{restingNote(day)}</p>
        {day.tomorrow && <EventLine line={tomorrowLine(day.tomorrow, data, settings)} />}
      </Fragment>
    );
  }
  return (
    <Fragment>
      {shown.map((occurrence) => (
        <EventLine key={occurrence.key} line={lineOf(occurrence, data, timeRangeOf(occurrence, settings))} />
      ))}
      {hiddenCount > 0 && <span className={styles.more()}>{widgetCopy.more(hiddenCount)}</span>}
    </Fragment>
  );
}

function MediumBody(props: MediumPartProps) {
  return (
    <div className={styles.row()}>
      <DateTile day={props.day} settings={props.settings} />
      <div className={styles.list()}>
        <h3 className={styles.heading()}>{widgetCopy.upcoming}</h3>
        <UpcomingList {...props} />
      </div>
    </div>
  );
}

function MediumWidget(props: WidgetProps) {
  const view = useWidgetDay(props);

  return (
    <WidgetShell placeholderLineIds={placeholderLineIds} size={WidgetSize.Medium} view={view}>
      {(day) => <MediumBody data={props.data} day={day} settings={view.settings} />}
    </WidgetShell>
  );
}

export { MediumWidget };
export type { WidgetOptions, WidgetProps } from "../shared/props";
