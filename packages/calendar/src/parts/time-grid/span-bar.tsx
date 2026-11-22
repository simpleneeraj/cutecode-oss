import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";

import type { Calendar, EventOccurrence, SpanBar as SpanBarModel } from "../../types";
import { BlockStatus, occurrenceAppearance, statusWords, type BlockView } from "../event-block/appearance";
import type { FocusProps } from "../roving-focus/focus-key";
import { toneStyles } from "../tone/style";
import { barStyle } from "./geometry";
import { spanBarStyles } from "./style";

type SpanBarProps = {
  bar: SpanBarModel;
  calendar: Calendar | undefined;
  view: BlockView;
  focusProps: FocusProps;
  onOpen: (occurrence: EventOccurrence) => void;
};

const struckStatuses = new Set([BlockStatus.Declined, BlockStatus.Cancelled]);

function SpanBar({ bar, calendar, view, focusProps, onOpen }: SpanBarProps) {
  const { occurrence } = bar;
  const appearance = occurrenceAppearance(occurrence, calendar, view, false);
  const tone = toneStyles({ tone: appearance.tone });
  const statusWord = statusWords[appearance.status];
  const styles = spanBarStyles({
    continuesBefore: bar.continuesBefore,
    continuesAfter: bar.continuesAfter,
    isStruck: struckStatuses.has(appearance.status),
    isHatched: appearance.status === BlockStatus.Tentative,
    isPast: appearance.isPast,
    isReadOnly: appearance.isReadOnly,
  });

  return (
    <button
      {...focusProps}
      aria-label={appearance.label}
      className={styles.root({ class: [tone.body(), tone.text()] })}
      data-occurrence-key={bar.key}
      data-slot="span-bar"
      data-status={appearance.status}
      onClick={() => onOpen(occurrence)}
      style={barStyle(bar)}
      type="button"
    >
      {bar.continuesBefore && <AltArrowLeftIcon aria-hidden="true" className={styles.arrow()} />}
      <span aria-hidden="true" className={styles.title()}>
        {occurrence.event.title}
      </span>
      {appearance.isReadOnly && <LockKeyholeMinimalisticIcon aria-hidden="true" className={styles.lock()} />}
      {statusWord && (
        <span aria-hidden="true" className={styles.status()}>
          {statusWord}
        </span>
      )}
      {bar.continuesAfter && <AltArrowRightIcon aria-hidden="true" className={styles.arrowEnd()} />}
    </button>
  );
}

export { SpanBar };
