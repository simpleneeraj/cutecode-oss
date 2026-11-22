"use client";

import type { MouseEvent } from "react";

import { formatTime } from "../../locale";
import { OccurrenceKind, type Calendar, type EventOccurrence } from "../../types";
import { BlockStatus, occurrenceAppearance, type BlockView } from "../event-block/appearance";
import { toneStyles } from "../tone/style";
import { monthChipStyles } from "./style";

type MonthChipProps = {
  occurrence: EventOccurrence;
  calendar: Calendar | undefined;
  view: BlockView;
  tabIndex: number;
  onOpen: (occurrence: EventOccurrence) => void;
};

const struckStatuses = new Set([BlockStatus.Declined, BlockStatus.Cancelled]);

export function stopBubble(event: MouseEvent) {
  event.stopPropagation();
}

function MonthChip({ occurrence, calendar, view, tabIndex, onOpen }: MonthChipProps) {
  const appearance = occurrenceAppearance(occurrence, calendar, view, false);
  const tone = toneStyles({ tone: appearance.tone });
  const styles = monthChipStyles({
    isPast: appearance.isPast,
    isStruck: struckStatuses.has(appearance.status),
    isHatched: appearance.status === BlockStatus.Tentative,
  });
  const isTimed = occurrence.kind === OccurrenceKind.Timed;

  const open = (event: MouseEvent) => {
    event.stopPropagation();
    onOpen(occurrence);
  };

  return (
    <button
      aria-label={appearance.label}
      className={styles.root()}
      data-slot="month-chip"
      onClick={open}
      onDoubleClick={stopBubble}
      tabIndex={tabIndex}
      type="button"
    >
      <span aria-hidden="true" className={styles.dot({ class: tone.bar() })} />
      <span aria-hidden="true" className={styles.title()}>
        {occurrence.event.title}
      </span>
      {isTimed && (
        <span aria-hidden="true" className={styles.time()}>
          {formatTime(occurrence.start, view.settings)}
        </span>
      )}
    </button>
  );
}

export { MonthChip };
