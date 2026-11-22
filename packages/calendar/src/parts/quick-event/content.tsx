"use client";

import { Fragment, useState, type ReactNode } from "react";

import { EventDetails } from "../event-details";
import type { EventOccurrence } from "../../types";
import { QuickEventForm } from "./form";
import { draftOf, editedEventValues, newEventValues, occurrenceTiming, slotTiming } from "./schema";
import { ScopeAsk } from "./scope-ask";
import { quickEventCopy } from "./session";
import { QuickEventMode, type QuickEventActions, type QuickEventContext, type QuickEventTarget } from "./target";
import { useScopeAsk } from "./use-scope-ask";

type QuickEventContentProps = {
  target: QuickEventTarget;
  isSaving: boolean;
  context: QuickEventContext;
  actions: QuickEventActions;
  repeat?: ReactNode;
};

type OccurrenceContentProps = Omit<QuickEventContentProps, "target"> & {
  occurrence: EventOccurrence;
};

function EditForm({ occurrence, isSaving, context, actions, repeat }: OccurrenceContentProps) {
  const timing = occurrenceTiming(occurrence, context.settings);
  const setup = { defaults: editedEventValues(occurrence), timing, submitLabel: quickEventCopy.save, isSaving };

  return (
    <QuickEventForm
      context={context}
      onSubmit={(values) => actions.onSave(draftOf(values, timing, occurrence))}
      repeat={repeat}
      setup={setup}
    />
  );
}

function OccurrenceContent({ occurrence, isSaving, context, actions, repeat }: OccurrenceContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const scope = useScopeAsk(actions, occurrence);
  const detailActions = { onEdit: () => setIsEditing(true), onDelete: () => scope.actions.onDelete(occurrence) };

  return (
    <Fragment>
      {isEditing ? (
        <EditForm
          actions={scope.actions}
          context={context}
          isSaving={isSaving}
          occurrence={occurrence}
          repeat={repeat}
        />
      ) : (
        <EventDetails actions={detailActions} context={context} occurrence={occurrence} />
      )}
      <ScopeAsk isSaving={isSaving} onCancel={scope.cancel} onChoose={scope.choose} request={scope.request} />
    </Fragment>
  );
}

function QuickEventContent({ target, isSaving, context, actions, repeat }: QuickEventContentProps) {
  if (target.mode === QuickEventMode.Read) {
    return (
      <OccurrenceContent
        actions={actions}
        context={context}
        isSaving={isSaving}
        occurrence={target.occurrence}
        repeat={repeat}
      />
    );
  }
  const timing = slotTiming(target.slot, context.settings);
  const defaults = newEventValues(target.slot, context.calendars);
  const setup = { defaults, timing, submitLabel: quickEventCopy.add, isSaving };
  return (
    <QuickEventForm
      context={context}
      onSubmit={(values) => actions.onSave(draftOf(values, timing, null))}
      repeat={repeat}
      setup={setup}
    />
  );
}

export { QuickEventContent };
