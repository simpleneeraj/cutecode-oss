import type { Icon } from "@solar-icons/react/lib/types";
import type { ReactNode } from "react";

import type { Tone } from "../tone";
import { chipStyles } from "./style";

type ChipProps = {
  tone?: Tone;
  icon?: Icon;
  children: ReactNode;
};

function Chip({ tone, icon: Glyph, children }: ChipProps) {
  const styles = chipStyles({ tone });

  return (
    <span className={styles.base()} data-slot="chip">
      {Glyph ? <Glyph aria-hidden="true" className={styles.icon()} /> : null}
      {children}
    </span>
  );
}

export { Chip };
