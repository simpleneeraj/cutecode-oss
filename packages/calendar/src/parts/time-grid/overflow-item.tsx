import { calendarOf } from "../../event";
import { formatTimeRange } from "../../locale";
import { OccurrenceKind, type EventOccurrence } from "../../types";
import { toneStyles } from "../tone/style";
import type { GridModel } from "./model";
import { overflowStyles } from "./style";

type OverflowItemProps = {
  occurrence: EventOccurrence;
  model: GridModel;
  onOpen: (occurrence: EventOccurrence) => void;
};

const styles = overflowStyles();

function OverflowItem({ occurrence, model, onOpen }: OverflowItemProps) {
  const tone = toneStyles({ tone: calendarOf(occurrence.event, model.calendars)?.tone });

  return (
    <button className={styles.item()} onClick={() => onOpen(occurrence)} type="button">
      <span aria-hidden="true" className={styles.dot({ class: tone.bar() })} />
      <span className={styles.text()}>
        <span className={styles.title()}>{occurrence.event.title}</span>
        {occurrence.kind === OccurrenceKind.Timed && (
          <span className={styles.time()}>{formatTimeRange(occurrence.start, occurrence.end, model.settings)}</span>
        )}
      </span>
    </button>
  );
}

export { OverflowItem };
