import type { Icon } from "@solar-icons/react/lib/types";

import type { Tone } from "../tone";
import { type AppIconSize, appIconStyles } from "./style";

type AppIconProps = {
  icon: Icon;
  tone?: Tone;
  size?: AppIconSize;
  label?: string;
};

function AppIcon({ icon: Glyph, tone, size, label }: AppIconProps) {
  const styles = appIconStyles({ size, look: tone });
  const isDecorative = label === undefined;

  return (
    <span
      aria-hidden={isDecorative || undefined}
      aria-label={label}
      className={styles.tile()}
      data-slot="app-icon"
      role={isDecorative ? undefined : "img"}
    >
      <Glyph className={styles.glyph()} />
    </span>
  );
}

export { AppIcon };
