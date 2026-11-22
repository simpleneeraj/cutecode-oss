"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@cutecode/ui/components/button";
import { RepeatIcon } from "@solar-icons/react/linear/repeat";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import type { ViewSettings } from "../../types";
import { datesWhen, timedWhen } from "../event-details/when";
import { CalendarRow, InviteeRow, PlaceRow } from "./form-fields";
import { LockedRepeat } from "./repeat-field";
import { FormRow, TitleField, WhenRow } from "./rows";
import { quickEventSchema, writableCalendars, type EventTiming, type QuickEventValues } from "./schema";
import { quickEventStyles } from "./style";
import type { QuickEventContext } from "./target";

export type QuickEventFormSetup = {
  defaults: QuickEventValues;
  timing: EventTiming;
  submitLabel: string;
  isSaving: boolean;
};

type QuickEventFormProps = {
  setup: QuickEventFormSetup;
  context: QuickEventContext;
  repeat?: ReactNode;
  onSubmit: (values: QuickEventValues) => void;
};

const styles = quickEventStyles();

function timingWhen(timing: EventTiming, settings: ViewSettings) {
  if (timing.allDay) {
    return datesWhen({ start: timing.start, end: timing.end }, settings);
  }
  return timedWhen(timing.range, settings);
}

function QuickEventForm({ setup, context, repeat, onSubmit }: QuickEventFormProps) {
  const { register, control, handleSubmit, formState } = useForm<QuickEventValues>({
    resolver: zodResolver(quickEventSchema),
    defaultValues: setup.defaults,
    mode: "onChange",
  });
  const calendars = writableCalendars(context.calendars);
  const canSave = !setup.isSaving && calendars.length > 0;

  return (
    <form className={styles.form()} noValidate onSubmit={handleSubmit(onSubmit)}>
      <TitleField error={formState.errors.title?.message} registration={register("title")} />
      <WhenRow when={timingWhen(setup.timing, context.settings)} />
      <FormRow icon={RepeatIcon}>
        <div className={styles.field()}>{repeat ?? <LockedRepeat />}</div>
      </FormRow>
      <CalendarRow calendars={calendars} control={control} error={formState.errors.calendarId?.message} />
      <InviteeRow control={control} />
      <PlaceRow registration={register("place")} />
      <div aria-hidden="true" className={styles.separator()} />
      <div className={styles.actions()}>
        <Button className={styles.submit()} disabled={!canSave} size="sm" type="submit">
          {setup.submitLabel}
        </Button>
      </div>
    </form>
  );
}

export { QuickEventForm };
