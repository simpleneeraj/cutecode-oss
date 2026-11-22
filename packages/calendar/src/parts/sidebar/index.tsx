"use client";

import { LiveRegion } from "../live-region";
import { CalendarToggles } from "./calendar-toggles";
import { MiniMonth } from "./mini-month";
import type { CalendarSidebarProps } from "./props";
import { SearchResults } from "./search-results";
import { SidebarFade } from "./fade";
import { SidebarSearch } from "./search";
import { sidebarStyles } from "./style";
import { UpNextCard } from "./up-next-card";
import { usePanelState } from "./use-panel-state";

const sidebarKeys = {
  results: "results",
  month: "month",
};

const styles = sidebarStyles();

function CalendarSidebar(props: CalendarSidebarProps) {
  const sidebar = usePanelState(props);
  const { search, settings } = sidebar;
  const isSearching = search.query.trim() !== "";

  return (
    <div className={styles.root()} data-slot="calendar-sidebar" dir={sidebar.direction}>
      <SidebarSearch search={search} />
      <SidebarFade fadeKey={isSearching ? sidebarKeys.results : sidebarKeys.month}>
        {isSearching ? (
          <SearchResults calendars={props.data.calendars} onOpen={props.onEventOpen} search={search} settings={settings} />
        ) : (
          <MiniMonth navigation={props.navigation} settings={settings} source={sidebar.source} />
        )}
      </SidebarFade>
      <CalendarToggles
        groups={sidebar.groups}
        hiddenCalendarIds={sidebar.hiddenCalendarIds}
        onToggle={sidebar.toggle}
      />
      <UpNextCard now={sidebar.now} occurrence={sidebar.upcoming} settings={settings} />
      {sidebar.message && <LiveRegion message={sidebar.message} />}
    </div>
  );
}

export { CalendarSidebar };
