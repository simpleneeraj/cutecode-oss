import { PaperclipIcon } from "@solar-icons/react/linear/paperclip";
import type { Icon } from "@solar-icons/react/lib/types";

import { AppIcon } from "../app-icon";
import { AppIconSize } from "../app-icon/style";
import type { Tone } from "../tone";
import { folderStickerStyles } from "./style";

type FolderStickerProps = {
  icon: Icon;
  tone?: Tone;
};

function FolderSticker({ icon, tone }: FolderStickerProps) {
  const styles = folderStickerStyles();

  return (
    <span aria-hidden="true" className={styles.root()} data-slot="folder-sticker">
      <AppIcon icon={icon} size={AppIconSize.Small} tone={tone} />
      <PaperclipIcon className={styles.clip()} />
    </span>
  );
}

export { FolderSticker };
