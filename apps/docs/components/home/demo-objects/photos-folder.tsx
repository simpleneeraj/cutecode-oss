"use client";

import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";
import { FolderSticker } from "@cutecode/ui/tactile/folder-sticker";
import { Tone } from "@cutecode/ui/tactile/tone";
import { StickerSmileCircleIcon } from "@solar-icons/react/bold-duotone/sticker-smile-circle";

import { folderContents } from "./constants";

export function PhotosFolder() {
  return (
    <Folder count="136 items" title="Photos" tone={Tone.Accent}>
      <FolderItems items={folderContents.photos} />
      <FolderSticker icon={StickerSmileCircleIcon} />
    </Folder>
  );
}
