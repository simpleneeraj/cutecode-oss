"use client";

import { Button } from "@cutecode/ui/components/button";
import { Sheet, SheetHeader, SheetPanel, SheetPopup, SheetTitle, SheetTrigger } from "@cutecode/ui/components/sheet";
import { SidebarMinimalisticIcon } from "@solar-icons/react/linear/sidebar-minimalistic";
import { useState, type ReactNode } from "react";

import { resolveSettings, textDirectionOf } from "../../locale";
import type { CalendarViewProps } from "../../parts/time-grid/props";
import { TextDirection } from "../../types";
import { WeekView } from "../week";
import { tabletStyles } from "./style";

type TabletViewProps = {
  calendar: CalendarViewProps;
  sidebar: ReactNode;
  timeZoneBanner?: ReactNode;
};

const tabletCopy = {
  showSidebar: "Show calendars",
  sidebarTitle: "Calendars",
};

const styles = tabletStyles();

function sheetSideOf(direction: TextDirection) {
  return direction === TextDirection.RightToLeft ? "right" : "left";
}

function TabletView({ calendar, sidebar, timeZoneBanner }: TabletViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const direction = textDirectionOf(resolveSettings(calendar.options).locale);

  return (
    <div className={styles.root()} data-slot="tablet-view">
      {timeZoneBanner}
      <div className={styles.main()}>
        <Sheet onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
          <SheetTrigger
            render={
              <Button aria-label={tabletCopy.showSidebar} className={styles.trigger()} size="icon" variant="glass" />
            }
          >
            <SidebarMinimalisticIcon aria-hidden="true" />
          </SheetTrigger>
          <SheetPopup className={styles.sheet()} side={sheetSideOf(direction)} variant="inset">
            <SheetHeader>
              <SheetTitle>{tabletCopy.sidebarTitle}</SheetTitle>
            </SheetHeader>
            <SheetPanel>{sidebar}</SheetPanel>
          </SheetPopup>
        </Sheet>
        <div className={styles.week()}>
          <WeekView {...calendar} />
        </div>
      </div>
    </div>
  );
}

export { TabletView };
export {
  HourZoom,
  type CalendarData,
  type CalendarNavigation,
  type CalendarViewProps,
  type TimeGridOptions,
} from "../../parts/time-grid/props";
export { CalendarStatusKind, ConflictChoice, type CalendarStatus, type SyncConflict } from "../../parts/state/status";
