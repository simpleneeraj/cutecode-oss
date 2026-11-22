"use client";

import { AvatarStack } from "@cutecode/ui/tactile/avatar-stack";
import { Tone } from "@cutecode/ui/tactile/tone";
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";
import { Fragment } from "react";

import { formatTime } from "../../../locale";
import type { CalendarData } from "../../../parts/time-grid/props";
import type { Attendee, EventOccurrence, Instant, ViewSettings } from "../../../types";
import { EventLine } from "../shared/event-line";
import {
  initialsOf,
  lineOf,
  placeWithRange,
  restingNote,
  startsIn,
  tomorrowLine,
  widgetCopy,
  type WidgetDay,
} from "../shared/model";
import { WidgetSize, type WidgetProps } from "../shared/props";
import { WidgetShell } from "../shared/shell";
import { useWidgetDay } from "../shared/use-widget-day";
import { notchWidgetStyles } from "./style";

type NotchBodyProps = {
  day: WidgetDay;
  data: CalendarData;
  settings: ViewSettings;
  now: Instant;
};

type NotchHeadProps = {
  detail: string;
};

type NextUpProps = {
  occurrence: EventOccurrence;
  body: NotchBodyProps;
};

type NotchTabProps = {
  time: string;
};

const placeholderLineIds = ["lead"];

const shownPeople = 3;

const styles = notchWidgetStyles();

function peopleOf(attendees: Attendee[]) {
  return attendees.slice(0, shownPeople).map((attendee) => ({
    id: attendee.id,
    initials: initialsOf(attendee.name),
    tone: attendee.organizer === true ? Tone.Accent : Tone.Neutral,
  }));
}

function NotchHead({ detail }: NotchHeadProps) {
  return (
    <div className={styles.head()}>
      <span aria-hidden="true" className={styles.glyph()}>
        <CalendarIcon className={styles.glyphIcon()} />
      </span>
      <div className={styles.headText()}>
        <strong className={styles.title()}>{widgetCopy.upNext}</strong>
        <span className={styles.detail()}>{detail}</span>
      </div>
    </div>
  );
}

function NextUp({ occurrence, body }: NextUpProps) {
  const people = peopleOf(occurrence.event.attendees ?? []);

  return (
    <Fragment>
      <NotchHead detail={startsIn(occurrence, body.now, body.settings)} />
      <EventLine line={lineOf(occurrence, body.data, placeWithRange(occurrence, body.settings))} />
      {people.length > 0 && <AvatarStack people={people} />}
    </Fragment>
  );
}

function NotchBody(props: NotchBodyProps) {
  const [next] = props.day.upcoming;
  if (next !== undefined) {
    return <NextUp body={props} occurrence={next} />;
  }
  return (
    <Fragment>
      <NotchHead detail={restingNote(props.day)} />
      {props.day.tomorrow && <EventLine line={tomorrowLine(props.day.tomorrow, props.data, props.settings)} />}
    </Fragment>
  );
}

function NotchTab({ time }: NotchTabProps) {
  return (
    <span className={styles.notch()} data-slot="widget-notch">
      <span aria-hidden="true" className={styles.corner()} />
      <time>{time}</time>
    </span>
  );
}

function MediumNotchWidget(props: WidgetProps) {
  const view = useWidgetDay(props);
  const { now, settings } = view;
  const accessory = now === null ? null : <NotchTab time={formatTime(now, settings)} />;

  return (
    <WidgetShell accessory={accessory} placeholderLineIds={placeholderLineIds} size={WidgetSize.Notch} view={view}>
      {(day) => now !== null && <NotchBody data={props.data} day={day} now={now} settings={settings} />}
    </WidgetShell>
  );
}

export { MediumNotchWidget };
export type { WidgetOptions, WidgetProps } from "../shared/props";
