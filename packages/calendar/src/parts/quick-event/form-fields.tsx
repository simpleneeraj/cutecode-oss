"use client";

import { Input } from "@cutecode/ui/components/input";
import { CalendarIcon } from "@solar-icons/react/linear/calendar";
import { MapPointIcon } from "@solar-icons/react/linear/map-point";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { Fragment } from "react";
import { Controller, type Control, type UseFormRegisterReturn } from "react-hook-form";

import type { Calendar } from "../../types";
import { CalendarSelect } from "./calendar-select";
import { InviteeField } from "./invitee-field";
import { FormRow } from "./rows";
import { quickEventErrors, type QuickEventValues } from "./schema";
import { quickEventStyles } from "./style";

type CalendarRowProps = {
  control: Control<QuickEventValues>;
  calendars: Calendar[];
  error: string | undefined;
};

type InviteeRowProps = {
  control: Control<QuickEventValues>;
};

type PlaceRowProps = {
  registration: UseFormRegisterReturn<"place">;
};

const placeCopy = {
  label: "Place",
  placeholder: "Add place",
};

const styles = quickEventStyles();

function CalendarRow({ control, calendars, error }: CalendarRowProps) {
  const hint = calendars.length === 0 ? quickEventErrors.noCalendar : error;

  return (
    <Fragment>
      <FormRow icon={CalendarIcon}>
        <Controller
          control={control}
          name="calendarId"
          render={({ field }) => (
            <div className={styles.field()}>
              <CalendarSelect calendars={calendars} onValueChange={field.onChange} value={field.value} />
            </div>
          )}
        />
      </FormRow>
      {hint && <p className={styles.hint()}>{hint}</p>}
    </Fragment>
  );
}

function InviteeRow({ control }: InviteeRowProps) {
  return (
    <FormRow icon={UsersGroupRoundedIcon}>
      <Controller
        control={control}
        name="invitees"
        render={({ field }) => <InviteeField invitees={field.value} onInviteesChange={field.onChange} />}
      />
    </FormRow>
  );
}

function PlaceRow({ registration }: PlaceRowProps) {
  return (
    <FormRow icon={MapPointIcon}>
      <Input
        {...registration}
        aria-label={placeCopy.label}
        className={styles.field()}
        nativeInput
        placeholder={placeCopy.placeholder}
        size="sm"
      />
    </FormRow>
  );
}

export { CalendarRow, InviteeRow, PlaceRow };
