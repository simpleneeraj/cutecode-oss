"use client";

import type { ComponentProps } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Alert, AlertDescription } from "@cutecode/ui/components/alert";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";

type FormAlertProps = {
  message: string | null;
  tone: ComponentProps<typeof Alert>["variant"];
};

export function FormAlert({ message, tone }: FormAlertProps) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false}>
        {message ? (
          <motion.div
            key="form-alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={motionTokens.fade}
          >
            <Alert variant={tone}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
