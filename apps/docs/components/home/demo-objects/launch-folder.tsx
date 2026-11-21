import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";
import { Tone } from "@cutecode/ui/tactile/tone";

import { folderContents } from "./constants";

export function LaunchFolder() {
  return (
    <Folder count="9 items" title="Launch" tone={Tone.Gray}>
      <FolderItems items={folderContents.launch} />
    </Folder>
  );
}
