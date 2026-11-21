import type { Icon } from "@solar-icons/react/lib/types";

import { AppIcon } from "../app-icon";
import { AppIconSize } from "../app-icon/style";
import type { Tone } from "../tone";
import { notificationStyles } from "./style";

type NotificationProps = {
  icon: Icon;
  tone?: Tone;
  title: string;
  time: string;
  body: string;
};

function Notification({ icon, tone, title, time, body }: NotificationProps) {
  const styles = notificationStyles();

  return (
    <div className={styles.root()} data-slot="notification">
      <AppIcon icon={icon} size={AppIconSize.Small} tone={tone} />
      <div className={styles.text()}>
        <div className={styles.head()}>
          <span className={styles.title()}>{title}</span>
          <span className={styles.time()}>{time}</span>
        </div>
        <span className={styles.body()}>{body}</span>
      </div>
    </div>
  );
}

export { Notification, type NotificationProps };
