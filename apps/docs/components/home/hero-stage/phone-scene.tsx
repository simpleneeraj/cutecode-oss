import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import { PageControl } from "@cutecode/ui/tactile/page-control";
import { StickyNote } from "@cutecode/ui/tactile/sticky-note";

import { DesignsFolder } from "@/components/home/demo-objects/designs-folder";
import { PhotosFolder } from "@/components/home/demo-objects/photos-folder";
import { NotificationDeck } from "@/components/home/notification-deck";

import { phoneApps } from "./constants";
import { heroStageStyles } from "./style";

const styles = heroStageStyles();

export function PhoneScene() {
  return (
    <div className={styles.phone()}>
      <div className={styles.phoneDeck()}>
        <NotificationDeck />
      </div>
      <div className={styles.phoneFolders()}>
        <DesignsFolder />
        <PhotosFolder />
      </div>
      <div className={styles.phoneRow()}>
        <div className={styles.phoneSticky()}>
          <StickyNote>Base UI inside, Solar icons on top.</StickyNote>
        </div>
        <div aria-hidden="true" className={styles.phoneIcons()}>
          {phoneApps.map((app) => (
            <AppIcon icon={app.icon} key={app.id} size={AppIconSize.Small} />
          ))}
        </div>
      </div>
      <PageControl count={4} current={0} />
    </div>
  );
}
