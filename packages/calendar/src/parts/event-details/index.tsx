"use client";

import { Button } from "@cutecode/ui/components/button";
import { CalendarIcon } from "@solar-icons/react/linear/calendar";
import { ClockCircleIcon } from "@solar-icons/react/linear/clock-circle";
import { MapPointIcon } from "@solar-icons/react/linear/map-point";
import { PenIcon } from "@solar-icons/react/linear/pen";
import { TrashBinTrashIcon } from "@solar-icons/react/linear/trash-bin-trash";

import { calendarOf } from "../../event";
import type { EventOccurrence, ViewSettings, Calendar } from "../../types";
import { ReadOnlyHint } from "../state/read-only-hint";
import { toneStyles } from "../tone/style";
import { AttendeeList } from "./attendee-list";
import { eventDetailsStyles } from "./style";
import { occurrenceWhen } from "./when";

export type EventDetailsContext = {
  calendars: Calendar[];
  settings: ViewSettings;
};

export type EventDetailsActions = {
  onEdit: () => void;
  onDelete: () => void;
};

type EventDetailsProps = {
  occurrence: EventOccurrence;
  context: EventDetailsContext;
  actions: EventDetailsActions;
};

const detailsCopy = {
  edit: "Edit",
  delete: "Delete",
  calendarFallback: "Calendar",
};

type DetailRowsProps = {
  occurrence: EventOccurrence;
  calendar: Calendar | undefined;
  duration: string;
};

type DetailActionsProps = {
  actions: EventDetailsActions;
};

const styles = eventDetailsStyles();

function DetailRows({ occurrence, calendar, duration }: DetailRowsProps) {
  const { event } = occurrence;
  const tone = toneStyles({ tone: calendar?.tone });
  const attendees = event.attendees ?? [];

  return (
    <div className={styles.rows()}>
      <div className={styles.row()}>
        <ClockCircleIcon aria-hidden="true" className={styles.rowIcon()} />
        <span className={styles.rowText()}>{duration}</span>
      </div>
      {event.location && (
        <div className={styles.row()}>
          <MapPointIcon aria-hidden="true" className={styles.rowIcon()} />
          <span className={styles.rowText()}>{event.location}</span>
        </div>
      )}
      <div className={styles.row()}>
        <CalendarIcon aria-hidden="true" className={styles.rowIcon()} />
        <span className={styles.rowText()}>{calendar?.name ?? detailsCopy.calendarFallback}</span>
        <span aria-hidden="true" className={styles.tick({ class: tone.bar() })} />
      </div>
      {attendees.length > 0 && <AttendeeList attendees={attendees} />}
    </div>
  );
}

function DetailActions({ actions }: DetailActionsProps) {
  return (
    <div className={styles.actions()}>
      <Button className={styles.action()} onClick={actions.onEdit} variant="gray">
        <PenIcon aria-hidden="true" />
        {detailsCopy.edit}
      </Button>
      <Button className={styles.action()} onClick={actions.onDelete} variant="destructive">
        <TrashBinTrashIcon aria-hidden="true" />
        {detailsCopy.delete}
      </Button>
    </div>
  );
}

function EventDetails({ occurrence, context, actions }: EventDetailsProps) {
  const { event } = occurrence;
  const calendar = calendarOf(event, context.calendars);
  const isReadOnly = calendar?.readOnly ?? true;
  const when = occurrenceWhen(occurrence, context.settings);

  return (
    <div className={styles.root()} data-slot="event-details">
      <div className={styles.heading()}>
        <h3 className={styles.title()}>{event.title}</h3>
        <p className={styles.when()}>{`${when.day}, ${when.time}`}</p>
      </div>
      <DetailRows calendar={calendar} duration={when.duration} occurrence={occurrence} />
      {event.notes && <p className={styles.notes()}>{event.notes}</p>}
      {isReadOnly ? (
        <ReadOnlyHint calendarName={calendar?.name ?? detailsCopy.calendarFallback} />
      ) : (
        <DetailActions actions={actions} />
      )}
    </div>
  );
}

export { EventDetails };
