import { PaperclipIcon } from "@solar-icons/react/linear/paperclip";
import type { Icon } from "@solar-icons/react/lib/types";

import { AppIcon } from "../app-icon";
import { AppIconSize } from "../app-icon/style";
import type { Tone } from "../tone";
import { StickerMotion } from "./sticker-motion";
import { folderStickerStyles } from "./style";

type FolderStickerProps = {
  icon: Icon;
  tone?: Tone;
};

const styles = folderStickerStyles();

function FolderSticker({ icon, tone }: FolderStickerProps) {
  return (
    <StickerMotion>
      <AppIcon icon={icon} size={AppIconSize.Small} tone={tone} />
      <PaperclipIcon className={styles.clip()} />
    </StickerMotion>
  );
}

export { FolderSticker };
