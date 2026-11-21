import type { Icon } from "@solar-icons/react/lib/types";

import { Tone } from "../tone";
import { toneGradient, toneInk } from "../tone/style";
import { type AppIconSize, appIconStyles } from "./style";

type AppIconProps = {
  icon: Icon;
  tone?: Tone;
  size?: AppIconSize;
  label?: string;
};

function AppIcon({ icon: Glyph, tone = Tone.Gray, size, label }: AppIconProps) {
  const styles = appIconStyles({ size });
  const isDecorative = label === undefined;

  return (
    <span
      aria-hidden={isDecorative || undefined}
      aria-label={label}
      className={styles.tile({ class: [toneGradient[tone], toneInk[tone]] })}
      data-slot="app-icon"
      role={isDecorative ? undefined : "img"}
    >
      <Glyph className={styles.glyph()} />
    </span>
  );
}

export { AppIcon };
