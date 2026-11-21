import { Notification, type NotificationProps } from "../notification";
import { maxPlates, notificationStackStyles, plateDepths } from "./style";

type StackedNotification = NotificationProps & {
  id: string;
};

type NotificationStackProps = {
  notifications: StackedNotification[];
};

function NotificationStack({ notifications }: NotificationStackProps) {
  const front = notifications.at(-1);
  if (!front) {
    return null;
  }

  const { id, ...notification } = front;
  const plateCount = Math.min(notifications.length - 1, maxPlates);
  const depths = plateDepths.slice(plateDepths.length - plateCount);
  const styles = notificationStackStyles();

  return (
    <div
      aria-label={`${notifications.length} notifications`}
      className={styles.root()}
      data-slot="notification-stack"
      role="group"
    >
      {depths.map((depth) => (
        <div
          aria-hidden="true"
          className={notificationStackStyles({ depth }).plate()}
          key={depth}
        />
      ))}
      <ol className={styles.front()}>
        <li className={styles.item()} key={id}>
          <Notification {...notification} />
        </li>
      </ol>
    </div>
  );
}

export { NotificationStack };
