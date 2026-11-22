"use client";

import { resolveSettings } from "../../locale";
import { allViews } from "../../parts/calendar-toolbar/view-options";
import { TimeGridView } from "../../parts/time-grid/view";
import { ViewKind, type EventOccurrence } from "../../types";
import { AddButton } from "./add-button";
import { phoneLayout, workWeekStart } from "./layout";
import type { PhoneShellProps } from "./props";
import { landscapeStyles } from "./style";
import { usePhoneAddEvent } from "./use-add-event";

const styles = landscapeStyles();

function PhoneLandscape({ phone, quickEvent }: PhoneShellProps) {
  const settings = resolveSettings(phone.options);
  const views = (phone.navigation.views ?? allViews).filter((view) => view !== ViewKind.Day);
  const navigation = {
    ...phone.navigation,
    date: workWeekStart(phone.navigation.date, settings),
    view: ViewKind.Week,
    views,
  };
  const calendar = {
    ...phone,
    navigation,
    actions: {
      onEventOpen: (occurrence: EventOccurrence) => quickEvent.openEvent(occurrence, null),
      onEventChange: phone.features.onEventChange,
      onSlotCreate: quickEvent.openNew,
    },
  };
  const addEvent = usePhoneAddEvent(phone, quickEvent);

  return (
    <div className={styles.root()} data-slot="phone-landscape">
      {phone.features.timeZoneBanner}
      <TimeGridView calendar={calendar} dayCount={phoneLayout.landscapeDays} kind={ViewKind.Week} />
      <footer className={styles.footer()}>
        <AddButton onAdd={addEvent} />
      </footer>
    </div>
  );
}

export { PhoneLandscape };
