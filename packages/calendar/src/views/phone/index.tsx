"use client";

import { Fragment, useState } from "react";

import { resolveSettings } from "../../locale";
import { QuickEvent } from "../../parts/quick-event";
import { draftOf } from "../../parts/quick-event/session";
import { useQuickEvent } from "../../parts/quick-event/use-session";
import { HourZoom } from "../../parts/time-grid/props";
import { useIsPhoneLandscape } from "../../parts/viewport/use-is-phone";
import { ViewKind } from "../../types";
import { PhoneLandscape } from "./landscape";
import { phoneTabOf } from "./layout";
import { PhoneOverview } from "./overview";
import { PhonePortrait } from "./portrait";
import type { PhoneShellProps, PhoneViewProps } from "./props";

function PhoneScreen(shell: PhoneShellProps) {
  const isLandscape = useIsPhoneLandscape();
  const showsTimeline = phoneTabOf(shell.phone.navigation.view) === ViewKind.Day;
  if (!showsTimeline) {
    return <PhoneOverview {...shell} />;
  }
  return isLandscape ? <PhoneLandscape {...shell} /> : <PhonePortrait {...shell} />;
}

function PhoneView(props: PhoneViewProps) {
  const [hourZoom, setHourZoom] = useState(props.options.hourZoom ?? HourZoom.Regular);
  const quickEvent = useQuickEvent(props.features.actions);
  const phone = { ...props, options: { ...props.options, hourZoom, draft: draftOf(quickEvent.session.target) } };
  const context = { calendars: props.data.calendars, settings: resolveSettings(props.options) };

  return (
    <Fragment>
      <PhoneScreen phone={phone} quickEvent={quickEvent} zoom={{ value: hourZoom, onChange: setHourZoom }} />
      <QuickEvent
        actions={quickEvent.actions}
        context={context}
        repeat={props.features.repeat}
        session={quickEvent.session}
      />
    </Fragment>
  );
}

export { PhoneView };
export type { PhoneFeatures, PhoneViewProps } from "./props";
export {
  HourZoom,
  type CalendarData,
  type CalendarNavigation,
  type TimeGridOptions,
} from "../../parts/time-grid/props";
export { CalendarStatusKind, ConflictChoice, type CalendarStatus, type SyncConflict } from "../../parts/state/status";
