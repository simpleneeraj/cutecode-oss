import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import type { Icon } from "@solar-icons/react/lib/types";
import type { ReactNode } from "react";

import type { Tone } from "../tone";
import { statusBadgeGlyphStyles, statusBadgeStyles } from "./style";

type StatusBadgeProps = {
  tone?: Tone;
  icon?: Icon;
  children: ReactNode;
};

function StatusBadge({ tone, icon: Glyph = CheckCircleIcon, children }: StatusBadgeProps) {
  const styles = statusBadgeStyles();

  return (
    <span className={styles.root()} data-slot="status-badge">
      <span className={statusBadgeGlyphStyles({ tone })}>
        <Glyph aria-hidden="true" className={styles.icon()} />
      </span>
      {children}
    </span>
  );
}

export { StatusBadge };
