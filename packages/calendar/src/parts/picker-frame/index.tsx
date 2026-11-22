"use client";

import { AltArrowUpIcon } from "@solar-icons/react/linear/alt-arrow-up";
import { Button } from "@cutecode/ui/components/button";
import { useId, type ReactNode } from "react";

import type { FrameTone } from "./choices";
import { pickerFrameStyles } from "./style";

export type PickerSummary = {
  text: string;
  isInvalid: boolean;
};

export type PickerActions = {
  canConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

type PickerFrameProps = {
  label: string;
  tone: FrameTone;
  summary: PickerSummary;
  actions: PickerActions;
  children: ReactNode;
};

const pickerFrameCopy = {
  cancel: "Cancel",
  confirm: "Confirm",
};

function PickerFrame({ label, tone, summary, actions, children }: PickerFrameProps) {
  const labelId = useId();
  const styles = pickerFrameStyles({ tone, isInvalid: summary.isInvalid });

  return (
    <div aria-labelledby={labelId} className={styles.root()} data-slot="picker-frame" role="group">
      <div className={styles.header()}>
        <span id={labelId}>{label}</span>
        <AltArrowUpIcon aria-hidden="true" className={styles.headerIcon()} />
      </div>
      <div className={styles.body()}>
        {children}
        <div className={styles.footer()}>
          <span aria-live="polite" className={styles.summary()}>
            {summary.text}
          </span>
          <Button onClick={actions.onCancel} size="sm" variant="gray">
            {pickerFrameCopy.cancel}
          </Button>
          <Button disabled={!actions.canConfirm} onClick={actions.onConfirm} size="sm">
            {pickerFrameCopy.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { PickerFrame };
