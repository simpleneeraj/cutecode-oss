"use client";

import { useState } from "react";
import { Button } from "@cutecode/ui/components/button";
import { useResendVerification } from "@/hooks/use-auth-mutations";
import { FormAlert } from "./form-alert";
import { SentNotice } from "./sent-notice";

export function SignUpSent({ email }: { email: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isResent, setIsResent] = useState(false);
  const { trigger: resendVerification } = useResendVerification();

  async function handleResend() {
    setError(null);
    setIsResent(false);
    try {
      const { error: resendError } = await resendVerification(email);
      if (resendError) {
        setError(resendError.message || "Failed to resend the email.");
        return;
      }
      setIsResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend the email.");
    }
  }

  return (
    <SentNotice email={email} before="We sent a confirmation link to" after=". Click it to finish creating your account.">
      <FormAlert message={error} tone="error" />
      <FormAlert message={isResent ? "Confirmation email resent." : null} tone="success" />

      <Button type="button" variant="link" onClick={handleResend}>
        Didn&apos;t get it? Resend email
      </Button>
    </SentNotice>
  );
}
