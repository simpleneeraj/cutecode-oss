"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/components/link";
import { useSignUp } from "@/hooks/use-auth-mutations";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@cutecode/ui/components/card";
import { Input } from "@cutecode/ui/components/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@cutecode/ui/components/field";
import { safeRedirectPath } from "@/utils/safe-redirect";
import { SocialAuthButtons } from "../components/social-auth-buttons";
import { FormAlert } from "../components/form-alert";
import { SignUpSent } from "../components/sign-up-sent";
import { EmailField } from "../components/email-field";
import { SubmitButton } from "../components/submit-button";
import { authCardStyles } from "../components/style";

enum SignUpStep {
  Form = "form",
  Sent = "sent",
}

const styles = authCardStyles();

function SignUpForm({ redirectedFrom }: { redirectedFrom: string }) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(SignUpStep.Form);
  const [error, setError] = useState<string | null>(null);
  const { trigger: signUp, isMutating: isLoading } = useSignUp();

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
        setStep(SignUpStep.Sent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className={styles.card()}>
      {step === SignUpStep.Sent ? (
        <SignUpSent email={email} />
      ) : (
        <>
          <CardHeader className={styles.header()}>
            <CardTitle render={<h1 />} className={styles.title()}>
              Create your account
            </CardTitle>
            <CardDescription>Start sharing beautiful code in seconds.</CardDescription>
          </CardHeader>

          <CardPanel className={styles.panel()}>
            <SocialAuthButtons disabled={isLoading} redirectedFrom={redirectedFrom} onError={(m) => setError(m || null)} />

            <FormAlert message={error} tone="error" />

            <form onSubmit={handleSubmit} className={styles.form()}>
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

              <EmailField value={email} onChange={setEmail} isDisabled={isLoading} />

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

              <SubmitButton isLoading={isLoading} loadingLabel="Creating account…">
                Create account
              </SubmitButton>
            </form>
          </CardPanel>
        </>
      )}

      <CardFooter className={styles.footer()}>
        Already have an account?
        <Link href="/account/sign-in" className={styles.footerLink()}>
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

function SignUpFormWithRedirect() {
  const searchParams = useSearchParams();
  return <SignUpForm redirectedFrom={safeRedirectPath(searchParams.get("redirectedFrom"))} />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpForm redirectedFrom="/" />}>
      <SignUpFormWithRedirect />
    </Suspense>
  );
}
