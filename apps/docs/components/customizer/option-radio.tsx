"use client";

import { RadioPrimitive } from "@cutecode/ui/components/radio-group";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import type { ReactNode } from "react";

import { customizerStyles } from "./style";

type OptionRadioProps = {
  value: string;
  shape: string;
  children: ReactNode;
};

const styles = customizerStyles();

export function OptionRadio({ value, shape, children }: OptionRadioProps) {
  return (
    <RadioPrimitive.Root className={styles.option({ class: shape })} value={value}>
      {children}
      <RadioPrimitive.Indicator className={styles.check()}>
        <CheckCircleIcon aria-hidden="true" className={styles.checkIcon()} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
