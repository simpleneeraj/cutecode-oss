"use client";

import { useEffect, useRef } from "react";
import View from "@/components/view";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareLock02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { OTPField, OTPFieldInput, OTPFieldSeparator } from "@/components/ui/otp-field";
import { motion } from "motion/react";

const OTP_LENGTH = 6;
const OTP_SLOT_KEYS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-slot-${i}`);

type PasscodeGateProps = {
  passcode: string;
  invalidPasscode: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

type PasscodeSlotsProps = {
  keys: string[];
  offset: number;
  invalidPasscode: boolean;
};

function PasscodeSlots({ keys, offset, invalidPasscode }: PasscodeSlotsProps) {
  return keys.map((key, i) => (
    <OTPFieldInput
      key={key}
      aria-label={`Digit ${i + offset + 1} of ${OTP_LENGTH}`}
      aria-invalid={invalidPasscode || undefined}
    />
  ));
}

function PasscodeStatus({ invalidPasscode }: { invalidPasscode: boolean }) {
  if (invalidPasscode) {
    return (
      <p className="text-xs text-destructive-foreground" role="alert">
        Incorrect passcode. Try again.
      </p>
    );
  }
  return <FieldDescription className="text-xs">Ask the author for the {OTP_LENGTH}-digit code.</FieldDescription>;
}

export function PasscodeGate({ passcode, invalidPasscode, isLoading, onChange, onSubmit }: PasscodeGateProps) {
  const isComplete = passcode.length === OTP_LENGTH;
  const prevComplete = useRef(false);

  useEffect(() => {
    if (isComplete && !prevComplete.current) onSubmit();
    prevComplete.current = isComplete;
  }, [isComplete, onSubmit]);

  return (
    <View className="layout-fill items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex w-full max-w-xs flex-col items-center gap-6 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <HugeiconsIcon icon={SquareLock02Icon} className="size-6 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-base font-medium text-foreground">This snippet is protected</h1>
        </div>

        <Field className="items-center gap-2">
          <FieldLabel className="sr-only">Passcode</FieldLabel>
          <OTPField
            length={OTP_LENGTH}
            size="lg"
            mask
            value={passcode}
            onValueChange={onChange}
            aria-label="6-digit passcode"
            aria-invalid={invalidPasscode || undefined}
          >
            <PasscodeSlots keys={OTP_SLOT_KEYS.slice(0, 3)} offset={0} invalidPasscode={invalidPasscode} />
            <OTPFieldSeparator />
            <PasscodeSlots keys={OTP_SLOT_KEYS.slice(3)} offset={3} invalidPasscode={invalidPasscode} />
          </OTPField>
          <PasscodeStatus invalidPasscode={invalidPasscode} />
        </Field>

        <Button className="w-full" onClick={onSubmit} disabled={!isComplete || isLoading}>
          {isLoading && <Spinner />}
          {isLoading ? "Unlocking..." : "Unlock"}
        </Button>
      </motion.div>
    </View>
  );
}
