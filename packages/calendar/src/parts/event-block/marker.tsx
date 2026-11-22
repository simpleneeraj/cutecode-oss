"use client";

import { formatTime } from "../../locale";
import type { EventOccurrence, TimedBox } from "../../types";
import type { FocusProps } from "../roving-focus/focus-key";
import { toneStyles } from "../tone/style";
import type { BlockAppearance, BlockView } from "./appearance";
import { eventMarkerStyles } from "./style";

type EventMarkerProps = {
  box: TimedBox;
  appearance: BlockAppearance;
  view: BlockView;
  focusProps: FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

function EventMarker({ box, appearance, view, focusProps, onOpen }: EventMarkerProps) {
  const { occurrence } = box;
  const tone = toneStyles({ tone: appearance.tone });
  const styles = eventMarkerStyles({ isPast: appearance.isPast });

  return (
    <button
      type="button"
      {...focusProps}
      aria-label={appearance.label}
      className={styles.root()}
      data-slot="event-marker"
      onClick={() => onOpen(occurrence)}
    >
      <span aria-hidden="true" className={styles.line({ class: tone.bar() })} />
      <span aria-hidden="true" className={styles.label()}>
        <span className={styles.dot({ class: tone.bar() })} />
        <span className={styles.title()}>{occurrence.event.title}</span>
        <span className={styles.time()}>{formatTime(occurrence.start, view.settings)}</span>
      </span>
    </button>
  );
}

export { EventMarker };
