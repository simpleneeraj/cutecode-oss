"use client";

import { useState } from "react";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { Link } from "@/components/link";
import { useForgotPassword } from "@/hooks/use-auth-mutations";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@cutecode/ui/components/card";
import { FormAlert } from "../components/form-alert";
import { EmailField } from "../components/email-field";
import { SubmitButton } from "../components/submit-button";
import { SentNotice } from "../components/sent-notice";
import { authCardStyles } from "../components/style";

enum ForgotPasswordStep {
  Request = "request",
  Sent = "sent",
}

const styles = authCardStyles();

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(ForgotPasswordStep.Request);
  const [error, setError] = useState<string | null>(null);
  const { trigger: requestPasswordReset, isMutating: isLoading } = useForgotPassword();

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const { error: resetError } = await requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (resetError) {
        setError(resetError.message || "Failed to send the reset link. Please try again.");
        return;
      }
      setStep(ForgotPasswordStep.Sent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className={styles.card()}>
      {step === ForgotPasswordStep.Sent ? (
        <SentNotice email={email} before="If an account exists for" after=", we sent a link to reset your password." />
      ) : (
        <>
          <CardHeader className={styles.header()}>
            <CardTitle render={<h1 />} className={styles.title()}>
              Reset your password
            </CardTitle>
            <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
          </CardHeader>

          <CardPanel className={styles.panel()}>
            <FormAlert message={error} tone="error" />

            <form onSubmit={handleSendLink} className={styles.form()}>
              <EmailField value={email} onChange={setEmail} isDisabled={isLoading} isAutoFocused />

              <SubmitButton isLoading={isLoading} loadingLabel="Sending link…">
                Send reset link
              </SubmitButton>
            </form>
          </CardPanel>
        </>
      )}

      <CardFooter className={styles.footer()}>
        <Link href="/account/sign-in" className={styles.footerLink()}>
          <AltArrowLeftIcon className={styles.footerIcon()} aria-hidden="true" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
