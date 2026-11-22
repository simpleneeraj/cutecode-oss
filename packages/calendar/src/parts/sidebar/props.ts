import type { SettingsInput } from "../../locale";
import type { EventOccurrence } from "../../types";
import type { CalendarData, CalendarNavigation } from "../time-grid/props";

export type CalendarVisibility = {
  onVisibilityChange: (calendarId: string, visible: boolean) => void;
  otherCalendarIds?: string[];
};

export type SidebarOptions = SettingsInput & {
  viewerId?: string;
};

export type CalendarSidebarProps = {
  data: CalendarData;
  navigation: Pick<CalendarNavigation, "date" | "onDateChange">;
  visibility: CalendarVisibility;
  options: SidebarOptions;
  onEventOpen: (occurrence: EventOccurrence) => void;
};
