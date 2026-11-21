import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";

import { previewFolders } from "./constants";
import { themeBuilderStyles } from "./style";

const styles = themeBuilderStyles();

export function PreviewFolders() {
  return (
    <div className={styles.folders()}>
      {previewFolders.map((folder) => (
        <Folder count={folder.count} key={folder.id} title={folder.title} tone={folder.tone}>
          <FolderItems items={folder.items} />
        </Folder>
      ))}
    </div>
  );
}
