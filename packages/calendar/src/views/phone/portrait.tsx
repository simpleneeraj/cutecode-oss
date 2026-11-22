"use client";

import { DragProvider } from "../../parts/drag/provider";
import { occurrenceElement } from "../../parts/quick-event/anchor";
import { LiveRegion } from "../../parts/live-region";
import { CalendarError } from "../../parts/state/error";
import { ViewOverlays } from "../../parts/shortcuts/view-overlays";
import { CalendarStatusKind } from "../../parts/state/status";
import { StatusBanners } from "../../parts/state/status-banners";
import { NavigationSource } from "../../parts/time-grid/use-grid-navigation";
import { useTimeGridView } from "../../parts/time-grid/use-time-grid-view";
import { ViewSwitch } from "../../parts/view-motion";
import { addDays } from "../../time";
import { ViewKind, type EventOccurrence } from "../../types";
import { PhoneFooter } from "./footer";
import { PhoneHeader } from "./header";
import { phoneTabsOf } from "./layout";
import type { PhoneShellProps } from "./props";
import { phoneStyles } from "./style";
import { SwipeDays } from "./swipe";
import { PhoneTimeline } from "./timeline";
import { usePhoneAddEvent } from "./use-add-event";

const portraitCopy = {
  empty: "Nothing planned this day.",
};

const styles = phoneStyles();

function usePortraitView({ phone, quickEvent }: Pick<PhoneShellProps, "phone" | "quickEvent">) {
  const actions = {
    onEventOpen: (occurrence: EventOccurrence) =>
      quickEvent.openEvent(occurrence, occurrenceElement(view.gridRef.current, occurrence.key)),
    onEventChange: phone.features.onEventChange,
    onSlotCreate: quickEvent.openNew,
  };
  const view = useTimeGridView({ ...phone, actions }, ViewKind.Day);
  return view;
}

function PhonePortrait({ phone, quickEvent, zoom }: PhoneShellProps) {
  const view = usePortraitView({ phone, quickEvent });
  const addEvent = usePhoneAddEvent(phone, quickEvent);
  const { model, navigation, status } = view;
  const { date } = phone.navigation;
  const tabs = { views: phoneTabsOf(navigation.views), current: ViewKind.Day, onSelect: navigation.changeView };
  const stepDay = (step: number) => navigation.goTo(addDays(date, step), NavigationSource.Pointer);

  return (
    <DragProvider value={view.drag}>
      <div className={styles.root()} data-slot="phone-view" dir={model.direction}>
        <PhoneHeader date={date} view={view} zoom={zoom} />
        <div className={styles.banners()}>
          <StatusBanners status={status} timeZoneBanner={phone.features.timeZoneBanner} />
        </div>
        <div className={styles.body()}>
          <SwipeDays direction={model.direction} onStep={stepDay}>
            <ViewSwitch kind={navigation.viewSwitch.kind} surfaceRef={navigation.viewSwitch.surfaceRef} viewKey={date}>
              {status.kind === CalendarStatusKind.Failed ? (
                <CalendarError onRetry={status.onRetry} />
              ) : (
                <PhoneTimeline view={view} zoom={zoom} />
              )}
            </ViewSwitch>
          </SwipeDays>
          {view.isEmpty && <p className={styles.empty()}>{portraitCopy.empty}</p>}
        </div>
        <PhoneFooter onAdd={addEvent} tabs={tabs} />
        {view.message && <LiveRegion message={view.message} />}
        <ViewOverlays settings={model.settings} shortcuts={view.shortcuts} status={status} />
      </div>
    </DragProvider>
  );
}

export { PhonePortrait };
