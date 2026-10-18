"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResendVerification, useSignUp } from "@/hooks/use-auth-mutations";
import { tv } from "tailwind-variants";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { safeRedirectPath } from "@/utils/safe-redirect";
import { SocialAuthButtons } from "../components/social-auth-buttons";

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

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = safeRedirectPath(searchParams.get("redirectedFrom"));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState<"form" | "sent">("form");
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { trigger: signUp, isMutating: isLoading } = useSignUp();
  const { trigger: resendVerification } = useResendVerification();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError(null);

    try {
      const { data, error: signUpError } = await signUp({
        email,
        password,
        name: fullName.trim(),
        callbackURL: redirectedFrom,
      });

      if (signUpError) {
        setError(signUpError.message || "Something went wrong. Please try again.");
        return;
      }

      if (data?.token) {
        router.push(redirectedFrom);
        router.refresh();
      } else {
        setStep("sent");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  async function handleResend() {
    setError(null);
    setResendSuccess(false);
    try {
      const { error: resendError } = await resendVerification(email);
      if (resendError) setError(resendError.message || "Failed to resend the email.");
      else setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend the email.");
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
              We sent a confirmation link to <span className={sent.highlight()}>{email}</span>. Click it to finish
              creating your account.
            </p>
          </div>

          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {resendSuccess && (
            <Alert variant="success">
              <AlertDescription>Confirmation email resent.</AlertDescription>
            </Alert>
          )}

          <Button type="button" variant="link" onClick={handleResend}>
            Didn&apos;t get it? Resend email
          </Button>
        </CardPanel>
      ) : (
        <>
          <CardHeader className="justify-items-center text-center">
            <CardTitle render={<h1 />}>Create your account</CardTitle>
            <CardDescription>Start creating beautiful code screenshots</CardDescription>
          </CardHeader>

          <CardPanel className="flex flex-col gap-6">
            <SocialAuthButtons disabled={isLoading} redirectedFrom={redirectedFrom} onError={(m) => setError(m || null)} />

            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field name="fullName">
                <FieldLabel>Full name</FieldLabel>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
                <FieldError match="valueMissing">Please enter your name.</FieldError>
              </Field>

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
                />
                <FieldError match="valueMissing">Please enter your email address.</FieldError>
              </Field>

              <Field name="password">
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <FieldError match="valueMissing">Please create a password.</FieldError>
                <FieldError match="tooShort">Password must be at least 8 characters.</FieldError>
                <FieldDescription>Use at least 8 characters.</FieldDescription>
              </Field>

              <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Spinner />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardPanel>
        </>
      )}

      <CardFooter className="justify-center gap-1 border-t text-sm text-muted-foreground">
        Already have an account?
        <Link href="/account/sign-in" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
