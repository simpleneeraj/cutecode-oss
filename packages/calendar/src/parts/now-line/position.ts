import { milliseconds } from "../../time";
import type { DaySpan, Instant } from "../../types";

export function nowMinute(now: Instant | null, day: DaySpan): number | null {
  if (now === null) {
    return null;
  }
  const isWithinDay = now >= day.start && now < day.end;
  if (!isWithinDay) {
    return null;
  }
  return (now - day.start) / milliseconds.minute;
}
