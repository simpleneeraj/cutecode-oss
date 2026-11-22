import { isTimeZone } from "@cutecode/calendar/time";
import type { Instant } from "@cutecode/calendar/types";

import { ZoneMismatchKind, zoneMismatch } from "../../zones/mismatch";

export type ZoneBannerCopy = {
  title: string;
  description: string;
  use: string;
  keep: string;
};

export function placeOf(timeZone: string): string {
  const place = timeZone.split("/").at(-1) ?? timeZone;
  return place.replaceAll("_", " ");
}

export function zoneBannerCopy(deviceZone: string, calendarZone: string): ZoneBannerCopy {
  const devicePlace = placeOf(deviceZone);
  return {
    title: `Your device is in ${devicePlace}`,
    description: `This calendar shows ${placeOf(calendarZone)} time.`,
    use: `Use ${devicePlace}`,
    keep: "Keep",
  };
}

export function isZoneMismatch(deviceZone: string | null, calendarZone: string, at: Instant): boolean {
  if (deviceZone === null || !isTimeZone(deviceZone) || !isTimeZone(calendarZone)) {
    return false;
  }
  return zoneMismatch(deviceZone, calendarZone, at).kind === ZoneMismatchKind.Offset;
}

export function dismissalKey(deviceZone: string, calendarZone: string): string {
  return `cutecode-calendar-zone-banner|${deviceZone}|${calendarZone}`;
}
