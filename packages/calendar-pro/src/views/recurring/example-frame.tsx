"use client";

import { DayView } from "@cutecode/calendar/day";
import { CalendarAnnouncer } from "@cutecode/calendar/parts/live-region/announcer";
import { QuickEvent } from "@cutecode/calendar/quick-event";
import { ViewKind } from "@cutecode/calendar/types";
import { WeekView } from "@cutecode/calendar/week";
import { ToastProvider } from "@cutecode/ui/components/toast";
import type { ReactNode } from "react";

import { renderRepeatField } from "../../parts/repeat-field";
import { recurringExampleStyles } from "./style";
import type { ExampleCalendar } from "./use-example-calendar";

type ExampleFrameProps = {
  example: ExampleCalendar;
  children?: ReactNode;
};

const styles = recurringExampleStyles();

function ExampleFrame({ example, children }: ExampleFrameProps) {
  const { calendar, quickEvent, rootRef, context } = example;
  const isDay = calendar.navigation.view === ViewKind.Day;

  return (
    <CalendarAnnouncer>
      <ToastProvider>
        <div ref={rootRef} className={styles.root()}>
          {children}
          {isDay ? <DayView {...calendar} /> : <WeekView {...calendar} />}
        </div>
        <QuickEvent
          actions={quickEvent.actions}
          context={context}
          repeat={renderRepeatField}
          session={quickEvent.session}
        />
      </ToastProvider>
    </CalendarAnnouncer>
  );
}

export { ExampleFrame };
