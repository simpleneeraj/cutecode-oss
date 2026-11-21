import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import { Tone } from "@cutecode/ui/tactile/tone";
import { FolderIcon } from "@solar-icons/react/bold-duotone/folder";

import { siteHeaderStyles } from "./style";

const styles = siteHeaderStyles();

export function BrandMark() {
  return (
    <span className={styles.brand()}>
      <AppIcon icon={FolderIcon} size={AppIconSize.ExtraSmall} tone={Tone.Accent} />
      CuteUI
    </span>
  );
}
