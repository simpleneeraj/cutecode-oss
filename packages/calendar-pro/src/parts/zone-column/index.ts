import { formatZoneName } from "@cutecode/calendar/locale";
import type { SecondaryZone, ZoneShiftLabeler } from "@cutecode/calendar/parts/time-grid/gutter-labels";
import { milliseconds, toInstant } from "@cutecode/calendar/time";
import type { Instant, ZoneMark } from "@cutecode/calendar/types";

import { secondaryZoneMarks } from "../../zones/marks";

function markInstant(mark: ZoneMark): Instant {
  return toInstant({ date: mark.date, minute: mark.wallMinute }, "UTC") - mark.offsetMinutes * milliseconds.minute;
}

export function zoneShiftLabelOf(timeZone: string): ZoneShiftLabeler {
  return (mark, previous, settings) => {
    const isShift = previous !== undefined && previous.offsetMinutes !== mark.offsetMinutes;
    return isShift ? formatZoneName(markInstant(mark), { ...settings, timeZone }) : null;
  };
}

export function zoneColumnOf(timeZone: string): SecondaryZone {
  return { timeZone, marksOf: secondaryZoneMarks, shiftLabelOf: zoneShiftLabelOf(timeZone) };
}
