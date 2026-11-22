import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";

import { stateCopy } from "./copy";
import { readOnlyHintStyles } from "./style";

type ReadOnlyHintProps = {
  calendarName: string;
};

const styles = readOnlyHintStyles();

function ReadOnlyHint({ calendarName }: ReadOnlyHintProps) {
  return (
    <p className={styles.root()} data-slot="read-only-hint">
      <LockKeyholeMinimalisticIcon aria-hidden="true" className={styles.icon()} />
      {stateCopy.readOnly(calendarName)}
    </p>
  );
}

export { ReadOnlyHint };
