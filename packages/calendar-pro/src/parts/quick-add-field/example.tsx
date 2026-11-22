"use client";

import type { EventDraft } from "@cutecode/calendar/types";
import { useState } from "react";

import { ExampleFrame } from "../../views/recurring/example-frame";
import { exampleDate, exampleNow, exampleOptions } from "../../views/recurring/example-data";
import { recurringExampleStyles } from "../../views/recurring/style";
import { useExampleCalendar } from "../../views/recurring/use-example-calendar";
import { QuickAddDialog } from "./dialog";
import { QuickAddField } from "./field";

const styles = recurringExampleStyles();

function QuickAddExample() {
  const example = useExampleCalendar(exampleDate, exampleOptions);
  const [isOpen, setIsOpen] = useState(false);
  const context = { now: exampleNow, settings: example.context.settings, calendarId: "work" };
  const actions = { ...example.calendar.actions, onQuickAdd: () => setIsOpen(true) };
  const calendar = { ...example.calendar, actions };
  const create = (draft: EventDraft) => example.onSave(draft);

  return (
    <ExampleFrame example={{ ...example, calendar }}>
      <div className={styles.card()}>
        <QuickAddField context={context} onEventCreate={create} />
      </div>
      <QuickAddDialog context={context} onEventCreate={create} onOpenChange={setIsOpen} open={isOpen} />
    </ExampleFrame>
  );
}

export { QuickAddExample };
