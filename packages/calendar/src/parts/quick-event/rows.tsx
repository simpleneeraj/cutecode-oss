"use client";

import { Input } from "@cutecode/ui/components/input";
import type { Icon } from "@solar-icons/react/lib/types";
import { ClockCircleIcon } from "@solar-icons/react/linear/clock-circle";
import { Fragment, useId, type ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import type { EventWhen } from "../event-details/when";
import { quickEventStyles } from "./style";

type FormRowProps = {
  icon: Icon;
  children: ReactNode;
};

type TitleFieldProps = {
  registration: UseFormRegisterReturn<"title">;
  error: string | undefined;
};

type WhenRowProps = {
  when: EventWhen;
};

const titleCopy = {
  label: "Title",
  placeholder: "New event",
};

const styles = quickEventStyles();

function FormRow({ icon: RowIcon, children }: FormRowProps) {
  return (
    <div className={styles.row()}>
      <RowIcon aria-hidden="true" className={styles.rowIcon()} />
      {children}
    </div>
  );
}

function TitleField({ registration, error }: TitleFieldProps) {
  const hintId = useId();

  return (
    <Fragment>
      <Input
        {...registration}
        aria-describedby={error ? hintId : undefined}
        aria-invalid={error !== undefined}
        aria-label={titleCopy.label}
        autoFocus
        className={styles.title()}
        nativeInput
        placeholder={titleCopy.placeholder}
        unstyled
      />
      {error && (
        <p className={styles.hint()} id={hintId}>
          {error}
        </p>
      )}
    </Fragment>
  );
}

function WhenRow({ when }: WhenRowProps) {
  return (
    <FormRow icon={ClockCircleIcon}>
      <span className={styles.rowText()}>
        <span className={styles.rowPrimary()}>{when.day}</span>
        <span className={styles.rowSecondary()}>{when.time}</span>
      </span>
      <span className={styles.rowValue()}>{when.duration}</span>
    </FormRow>
  );
}

export { FormRow, TitleField, WhenRow };
