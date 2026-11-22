import { Fragment, type ReactNode } from "react";

import { OfflineBanner } from "./offline-banner";
import { CalendarStatusKind, type CalendarStatus } from "./status";

type StatusBannersProps = {
  status: CalendarStatus;
  timeZoneBanner?: ReactNode;
};

function StatusBanners({ status, timeZoneBanner }: StatusBannersProps) {
  const isOffline = status.kind === CalendarStatusKind.Offline;

  return (
    <Fragment>
      {isOffline && <OfflineBanner />}
      {timeZoneBanner}
    </Fragment>
  );
}

export { StatusBanners };
