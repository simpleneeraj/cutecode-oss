"use client";

import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";

import type { AgendaRow as AgendaRowModel } from "../../agenda";
import type { Calendar, EventOccurrence } from "../../types";
import { BlockStatus, occurrenceAppearance, type BlockView } from "../event-block/appearance";
import { toneStyles } from "../tone/style";
import { rowMeta, rowTimes } from "./row-text";
import { agendaRowStyles } from "./style";

type AgendaRowProps = {
  row: AgendaRowModel;
  calendar: Calendar | undefined;
  view: BlockView;
  onOpen: (occurrence: EventOccurrence) => void;
};

const struckStatuses = new Set([BlockStatus.Declined, BlockStatus.Cancelled]);

function AgendaRow({ row, calendar, view, onOpen }: AgendaRowProps) {
  const appearance = occurrenceAppearance(row.occurrence, calendar, view, false);
  const tone = toneStyles({ tone: appearance.tone });
  const styles = agendaRowStyles({ isPast: row.past, isStruck: struckStatuses.has(appearance.status) });
  const times = rowTimes(row, view.settings);
  const meta = rowMeta(row, view.settings);

  return (
    <button
      aria-label={appearance.label}
      className={styles.root()}
      data-slot="agenda-row"
      data-status={appearance.status}
      onClick={() => onOpen(row.occurrence)}
      type="button"
    >
      <span aria-hidden="true" className={styles.time()}>
        {times.primary}
        {times.secondary && <span className={styles.timeEnd()}>{times.secondary}</span>}
      </span>
      <span aria-hidden="true" className={styles.bar({ class: tone.bar() })} />
      <span aria-hidden="true" className={styles.text()}>
        <span className={styles.title()}>{row.occurrence.event.title}</span>
        {meta && <span className={styles.meta()}>{meta}</span>}
      </span>
      {appearance.isReadOnly && <LockKeyholeMinimalisticIcon aria-hidden="true" className={styles.lock()} />}
    </button>
  );
}

export { AgendaRow };
