import type { ReactNode } from "react";
import { LetterIcon } from "@solar-icons/react/bold-duotone/letter";
import { CardPanel } from "@cutecode/ui/components/card";
import { sentNoticeStyles } from "./style";

type SentNoticeProps = {
  email: string;
  before: string;
  after: string;
  children?: ReactNode;
};

const styles = sentNoticeStyles();

export function SentNotice({ email, before, after, children }: SentNoticeProps) {
  return (
    <CardPanel className={styles.root()}>
      <span className={styles.badge()}>
        <LetterIcon className={styles.badgeIcon()} aria-hidden="true" />
      </span>
      <div className={styles.copy()}>
        <h1 className={styles.title()}>Check your inbox</h1>
        <p className={styles.body()}>
          {before} <span className={styles.email()}>{email}</span>
          {after}
        </p>
      </div>
      {children}
    </CardPanel>
  );
}
