import { ClockCircleIcon } from "@solar-icons/react/linear/clock-circle";
import { Fragment } from "react";

import type { EventOccurrence, Instant, ViewSettings } from "../../types";
import { sidebarCopy, upNextSummary } from "./model";
import { sidebarStyles } from "./style";

type UpNextCardProps = {
  occurrence: EventOccurrence | undefined;
  now: Instant | null;
  settings: ViewSettings;
};

const styles = sidebarStyles();

function UpNextCard({ occurrence, now, settings }: UpNextCardProps) {
  const summary = occurrence === undefined || now === null ? null : upNextSummary(occurrence, now, settings);

  return (
    <section aria-label={sidebarCopy.upNext} className={styles.upNext()} data-slot="up-next">
      <span className={styles.upNextLabel()}>
        <ClockCircleIcon aria-hidden="true" className={styles.upNextIcon()} />
        {sidebarCopy.upNext}
      </span>
      {summary === null ? (
        <span className={styles.upNextDetail()}>{sidebarCopy.nothingNext}</span>
      ) : (
        <Fragment>
          <strong className={styles.upNextTitle()}>{summary.title}</strong>
          <span className={styles.upNextDetail()}>{summary.detail}</span>
        </Fragment>
      )}
    </section>
  );
}

export { UpNextCard };
