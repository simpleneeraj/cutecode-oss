"use client";

import { resolveSettings } from "../../locale";
import { AgendaListView } from "../../parts/agenda-list/view";
import { allViews } from "../../parts/calendar-toolbar/view-options";
import { LiveRegion } from "../../parts/live-region";
import { useAnnouncer } from "../../parts/live-region/use-announcer";
import { MonthGridView } from "../../parts/month-grid/view";
import { AnnouncementKind, ViewKind, type EventOccurrence } from "../../types";
import { PhoneFooter } from "./footer";
import { phoneTabOf, phoneTabsOf } from "./layout";
import type { PhoneShellProps } from "./props";
import { phoneStyles } from "./style";
import { usePhoneAddEvent } from "./use-add-event";

const styles = phoneStyles();

function PhoneOverview({ phone, quickEvent }: PhoneShellProps) {
  const { announce, message } = useAnnouncer(resolveSettings(phone.options));
  const addEvent = usePhoneAddEvent(phone, quickEvent);
  const { view } = phone.navigation;
  const calendar = {
    ...phone,
    actions: {
      onEventOpen: (occurrence: EventOccurrence) => quickEvent.openEvent(occurrence, null),
      onEventChange: phone.features.onEventChange,
    },
  };
  const selectView = (next: ViewKind) => {
    phone.navigation.onViewChange(next);
    announce({ kind: AnnouncementKind.ViewChanged, view: next });
  };
  const tabs = {
    views: phoneTabsOf(phone.navigation.views ?? allViews),
    current: phoneTabOf(view),
    onSelect: selectView,
  };

  return (
    <div className={styles.overview()} data-slot="phone-overview">
      {view === ViewKind.Month ? <MonthGridView calendar={calendar} /> : <AgendaListView calendar={calendar} />}
      <PhoneFooter onAdd={addEvent} tabs={tabs} />
      {message && <LiveRegion message={message} />}
    </div>
  );
}

export { PhoneOverview };
