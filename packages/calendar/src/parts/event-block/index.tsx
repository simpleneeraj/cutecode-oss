"use client";

import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";

import { formatTimeRange } from "../../locale";
import type { Calendar, EventOccurrence, TimedBox } from "../../types";
import type { FocusProps } from "../roving-focus/focus-key";
import { toneStyles } from "../tone/style";
import { blockAppearance, statusWords, type BlockView } from "./appearance";
import { EventMarker } from "./marker";
import { eventBlockStyles } from "./style";

type EventBlockProps = {
  box: TimedBox;
  calendar: Calendar | undefined;
  view: BlockView;
  focusProps: FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

function EventBlock({ box, calendar, view, focusProps, onOpen }: EventBlockProps) {
  const appearance = blockAppearance(box, calendar, view);
  if (box.marker) {
    return <EventMarker box={box} appearance={appearance} view={view} focusProps={focusProps} onOpen={onOpen} />;
  }
  const { occurrence } = box;
  const { event } = occurrence;
  const tone = toneStyles({ tone: appearance.tone });
  const styles = eventBlockStyles(appearance);
  const statusWord = statusWords[appearance.status];

  return (
    <button
      type="button"
      {...focusProps}
      aria-label={appearance.label}
      className={styles.root({ class: [tone.body(), tone.text()] })}
      data-slot="event-block"
      data-status={appearance.status}
      onClick={() => onOpen(occurrence)}
    >
      <span aria-hidden="true" className={styles.bar({ class: tone.bar() })} />
      <span aria-hidden="true" className={styles.content()}>
        <span className={styles.heading()}>
          <span className={styles.title()}>{event.title}</span>
          {appearance.isReadOnly && <LockKeyholeMinimalisticIcon aria-hidden="true" className={styles.lock()} />}
        </span>
        <span className={styles.meta({ class: tone.meta() })}>
          {formatTimeRange(occurrence.start, occurrence.end, view.settings)}
          {statusWord && <span>{statusWord}</span>}
        </span>
        {event.location && <span className={styles.place()}>{event.location}</span>}
      </span>
      {appearance.isPending && <span aria-hidden="true" className={styles.pending()} />}
    </button>
  );
}

export { EventBlock };
