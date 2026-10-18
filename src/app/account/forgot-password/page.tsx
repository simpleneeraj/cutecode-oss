"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { tv } from "tailwind-variants";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const sentState = tv({
  slots: {
    root: "flex flex-col items-center gap-4 text-center",
    badge: "flex size-12 items-center justify-center rounded-full bg-muted text-foreground",
    copy: "flex flex-col gap-1.5",
    title: "text-lg font-semibold leading-none",
    body: "text-sm text-muted-foreground",
    highlight: "font-medium text-foreground",
  },
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "sent">("request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      if (resetError) {
        setError(resetError.message || "Failed to send the reset link. Please try again.");
        return;
      }
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const sent = sentState();

  return (
    <Card className="w-full">
      {step === "sent" ? (
        <CardPanel className={sent.root()}>
          <span className={sent.badge()}>
            <HugeiconsIcon icon={Mail01Icon} className="size-6" aria-hidden="true" />
          </span>
          <div className={sent.copy()}>
            <h1 className={sent.title()}>Check your inbox</h1>
            <p className={sent.body()}>
              If an account exists for <span className={sent.highlight()}>{email}</span>, we sent a link to reset your
              password.
            </p>
          </div>
        </CardPanel>
      ) : (
        <>
          <CardHeader className="justify-items-center text-center">
            <CardTitle render={<h1 />}>Reset your password</CardTitle>
            <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
          </CardHeader>

          <CardPanel className="flex flex-col gap-6">
            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSendLink} className="flex flex-col gap-5">
              <Field name="email">
                <FieldLabel>Email address</FieldLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  autoFocus
                />
                <FieldError match="valueMissing">Please enter your email address.</FieldError>
              </Field>

              <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Spinner />
                    Sending link…
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </CardPanel>
        </>
      )}

      <CardFooter className="justify-center border-t text-sm">
        <Link
          href="/account/sign-in"
          className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
