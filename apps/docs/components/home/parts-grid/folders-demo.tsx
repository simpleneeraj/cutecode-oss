import { AvatarStack } from "@cutecode/ui/tactile/avatar-stack";
import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";
import { FolderSticker } from "@cutecode/ui/tactile/folder-sticker";
import { Tone } from "@cutecode/ui/tactile/tone";
import { StickerSmileCircleIcon } from "@solar-icons/react/bold-duotone/sticker-smile-circle";

import { folderPeople } from "@/components/home/floating-objects/constants";

import { folderContents } from "./demo-data";
import { partsGridStyles } from "./style";

export function FoldersDemo() {
  return (
    <div className={partsGridStyles().folders()}>
      <Folder count="32 items" front={<AvatarStack people={folderPeople} />} title="Designs">
        <FolderItems items={folderContents.photos} />
      </Folder>
      <Folder count="136 items" title="Fonts" tone={Tone.Blue}>
        <FolderItems items={folderContents.mixed} />
        <FolderSticker icon={StickerSmileCircleIcon} tone={Tone.Yellow} />
      </Folder>
    </div>
  );
}
