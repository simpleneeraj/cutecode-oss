"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@cutecode/ui/components/button";
import { RepeatIcon } from "@solar-icons/react/linear/repeat";
import { Controller, useForm, type Control } from "react-hook-form";

import type { ViewSettings } from "../../types";
import { datesWhen, timedWhen } from "../event-details/when";
import { CalendarRow, InviteeRow, PlaceRow } from "./form-fields";
import { LockedRepeat } from "./repeat-field";
import { FormRow, TitleField, WhenRow } from "./rows";
import { quickEventSchema, writableCalendars, type EventTiming, type QuickEventValues } from "./schema";
import { quickEventStyles } from "./style";
import type { QuickEventContext, RepeatSlot } from "./target";

export type QuickEventFormSetup = {
  defaults: QuickEventValues;
  timing: EventTiming;
  submitLabel: string;
  isSaving: boolean;
  isSeriesException?: boolean;
};

type QuickEventFormProps = {
  setup: QuickEventFormSetup;
  context: QuickEventContext;
  repeat?: RepeatSlot;
  onSubmit: (values: QuickEventValues) => void;
};

const styles = quickEventStyles();

function timingWhen(timing: EventTiming, settings: ViewSettings) {
  if (timing.allDay) {
    return datesWhen({ start: timing.start, end: timing.end }, settings);
  }
  return timedWhen(timing.range, settings);
}

type RepeatRowProps = {
  repeat?: RepeatSlot;
  control: Control<QuickEventValues>;
  start: string;
  settings: ViewSettings;
  isSeriesException?: boolean;
};

function RepeatRow({ repeat, control, start, settings, isSeriesException }: RepeatRowProps) {
  return (
    <FormRow icon={RepeatIcon}>
      <div className={styles.field()}>
        {repeat ? (
          <Controller
            control={control}
            name="recurrence"
            render={({ field }) =>
              repeat({ value: field.value, onValueChange: field.onChange, start, settings, isSeriesException })
            }
          />
        ) : (
          <LockedRepeat />
        )}
      </div>
    </FormRow>
  );
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
      <RepeatRow
        control={control}
        isSeriesException={setup.isSeriesException}
        repeat={repeat}
        settings={context.settings}
        start={setup.timing.start}
      />
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
