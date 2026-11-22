import type { ReactNode } from "react";

import type { EventChange } from "../../types";

import type { QuickEventActions } from "../../parts/quick-event/target";
import type { QuickEventControl } from "../../parts/quick-event/use-session";
import type { CalendarStatus } from "../../parts/state/status";
import type { CalendarData, CalendarNavigation, HourZoom, TimeGridOptions } from "../../parts/time-grid/props";

export type PhoneFeatures = {
  actions: QuickEventActions;
  repeat?: ReactNode;
  timeZoneBanner?: ReactNode;
  onEventChange?: (change: EventChange) => void;
};

export type PhoneViewProps = {
  data: CalendarData;
  navigation: CalendarNavigation;
  options: TimeGridOptions;
  status?: CalendarStatus;
  features: PhoneFeatures;
};

export type ZoomControl = {
  value: HourZoom;
  onChange: (zoom: HourZoom) => void;
};

export type PhoneShellProps = {
  phone: PhoneViewProps;
  quickEvent: QuickEventControl;
  zoom: ZoomControl;
};
