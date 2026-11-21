import { AvatarStack } from "@cutecode/ui/tactile/avatar-stack";
import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";

import { folderContents, folderPeople } from "./constants";

export function DesignsFolder() {
  return (
    <Folder count="32 items" front={<AvatarStack people={folderPeople} />} title="Designs">
      <FolderItems items={folderContents.designs} />
    </Folder>
  );
}
