"use client";

import { resolveSettings } from "../../locale";
import { useMinuteClock } from "../../parts/now-line/clock";
import type { QuickEventControl } from "../../parts/quick-event/use-session";
import { newEventRange } from "./layout";
import type { PhoneViewProps } from "./props";

export function usePhoneAddEvent(phone: PhoneViewProps, quickEvent: QuickEventControl) {
  const now = useMinuteClock();
  const settings = resolveSettings(phone.options);
  return (anchor: HTMLElement) =>
    quickEvent.openNew({ ...newEventRange(phone.navigation.date, settings, now), allDay: false }, anchor);
}
