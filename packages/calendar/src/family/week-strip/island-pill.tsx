"use client";

import { occurrencesInRange } from "../../event";
import { formatPlainDate } from "../../locale";
import { useFamilySettings, type FamilyOptions } from "../../parts/family-options/use-family-settings";
import { occurrenceWhen, sidebarCopy } from "../../parts/sidebar/model";
import { addDays, startOfDay } from "../../time";
import type { CalendarEvent } from "../../types";
import { upNext } from "../../widgets";
import { islandPillStyles } from "./style";

type IslandPillProps = {
  events: CalendarEvent[];
  options: FamilyOptions;
};

const styles = islandPillStyles();

function IslandPill({ events, options }: IslandPillProps) {
  const { settings, now, today } = useFamilySettings(options);
  if (now === null || today === null) {
    return null;
  }
  const { timeZone, locale } = settings;
  const tomorrow = addDays(today, 1);
  const context = {
    range: { start: now, end: startOfDay(tomorrow, timeZone) },
    dates: { start: today, end: tomorrow },
    timeZone,
  };
  const [next] = upNext(occurrencesInRange(events, context), now, 1, timeZone);
  const weekday = formatPlainDate(today, settings, { weekday: "short" }).toLocaleUpperCase(locale);

  return (
    <div className={styles.root()} data-slot="island-pill">
      <span className={styles.weekday()}>{weekday}</span>
      <span className={styles.text()}>
        <span className={styles.title()}>{next === undefined ? sidebarCopy.nothingNext : next.event.title}</span>
        {next !== undefined && <span className={styles.when()}>{occurrenceWhen(next, now, settings)}</span>}
      </span>
      <span className={styles.badge()}>{formatPlainDate(today, settings, { day: "numeric" })}</span>
    </div>
  );
}

export { IslandPill };
