import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import { AvatarStack } from "@cutecode/ui/tactile/avatar-stack";
import { Folder } from "@cutecode/ui/tactile/folder";
import { FolderItems } from "@cutecode/ui/tactile/folder-items";
import { NotificationStack } from "@cutecode/ui/tactile/notification-stack";
import { StickyNote } from "@cutecode/ui/tactile/sticky-note";

import { folderContents } from "@/components/home/parts-grid/demo-data";

import { folderPeople, heroNotifications, solarIcons } from "./constants";
import { floatingObjectsStyles } from "./style";

const styles = floatingObjectsStyles();

export function FloatingObjects() {
  return (
    <div aria-hidden="true" className={styles.root()}>
      <div className={styles.note()}>
        <StickyNote>Base UI inside, Solar icons on top. Follows Apple&apos;s guidelines.</StickyNote>
      </div>
      <div className={styles.notifications()}>
        <NotificationStack notifications={heroNotifications} />
      </div>
      <div className={styles.folder()}>
        <Folder count="Free and open source" front={<AvatarStack people={folderPeople} />} title="Components">
          <FolderItems items={folderContents.photos} />
        </Folder>
      </div>
      <div className={styles.solarCard()}>
        <span className={styles.solarTitle()}>Solar icons</span>
        <div className={styles.solarIcons()}>
          {solarIcons.map((item) => (
            <AppIcon icon={item.icon} key={item.id} size={AppIconSize.Small} tone={item.tone} />
          ))}
        </div>
      </div>
    </div>
  );
}
