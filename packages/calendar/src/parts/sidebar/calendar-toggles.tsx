"use client";

import { LockKeyholeMinimalisticIcon } from "@solar-icons/react/linear/lock-keyhole-minimalistic";
import { Label } from "@cutecode/ui/components/label";
import { Switch } from "@cutecode/ui/components/switch";
import { useId } from "react";

import type { Calendar } from "../../types";
import { toneStyles } from "../tone/style";
import { sidebarCopy, type CalendarGroups } from "./model";
import { togglesStyles } from "./style";

export type CalendarToggle = (calendar: Calendar, visible: boolean) => void;

type CalendarTogglesProps = {
  groups: CalendarGroups;
  hiddenCalendarIds: string[];
  onToggle: CalendarToggle;
};

type ToggleGroupProps = {
  title: string;
  calendars: Calendar[];
  hiddenCalendarIds: string[];
  onToggle: CalendarToggle;
};

type ToggleRowProps = {
  calendar: Calendar;
  isHidden: boolean;
  onToggle: CalendarToggle;
};

const styles = togglesStyles();

function ToggleRow({ calendar, isHidden, onToggle }: ToggleRowProps) {
  const rowStyles = togglesStyles({ isHidden });
  const tone = toneStyles({ tone: calendar.tone });

  return (
    <Label className={rowStyles.row()} data-slot="calendar-toggle">
      <span aria-hidden="true" className={rowStyles.swatch({ class: tone.bar() })} />
      <span className={rowStyles.name()}>
        {calendar.name}
        {calendar.readOnly && <span className={rowStyles.spoken()}>, {sidebarCopy.readOnly}</span>}
      </span>
      {calendar.readOnly && <LockKeyholeMinimalisticIcon aria-hidden="true" className={rowStyles.lock()} />}
      <Switch checked={!isHidden} onCheckedChange={(checked) => onToggle(calendar, checked)} />
    </Label>
  );
}

function ToggleGroup({ title, calendars, hiddenCalendarIds, onToggle }: ToggleGroupProps) {
  const headingId = useId();
  if (calendars.length === 0) {
    return null;
  }

  return (
    <div aria-labelledby={headingId} className={styles.root()} role="group">
      <p className={styles.heading()} id={headingId}>
        {title}
      </p>
      {calendars.map((calendar) => (
        <ToggleRow
          key={calendar.id}
          calendar={calendar}
          isHidden={hiddenCalendarIds.includes(calendar.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function CalendarToggles({ groups, hiddenCalendarIds, onToggle }: CalendarTogglesProps) {
  return (
    <div aria-label={sidebarCopy.calendars} className={styles.root()} role="group">
      <ToggleGroup calendars={groups.mine} hiddenCalendarIds={hiddenCalendarIds} onToggle={onToggle} title={sidebarCopy.mine} />
      <ToggleGroup calendars={groups.other} hiddenCalendarIds={hiddenCalendarIds} onToggle={onToggle} title={sidebarCopy.other} />
    </div>
  );
}

export { CalendarToggles };
