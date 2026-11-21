import { AppIcon } from "@cutecode/ui/tactile/app-icon";
import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";

import { appIcons } from "./constants";
import { objectsBentoStyles } from "./style";

const styles = objectsBentoStyles();

export function IconsDemo() {
  return (
    <div className={styles.icons()}>
      {appIcons.map((app) => (
        <span className={styles.iconCell()} key={app.id}>
          <AppIcon icon={app.icon} size={AppIconSize.Small} tone={app.tone} />
          {app.label}
        </span>
      ))}
    </div>
  );
}
