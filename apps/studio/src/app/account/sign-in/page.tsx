"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/components/link";
import { useSignIn } from "@/hooks/use-auth-mutations";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@cutecode/ui/components/card";
import { Input } from "@cutecode/ui/components/input";
import { Field, FieldLabel, FieldError } from "@cutecode/ui/components/field";
import { Checkbox } from "@cutecode/ui/components/checkbox";
import { safeRedirectPath } from "@/utils/safe-redirect";
import { SocialAuthButtons } from "../components/social-auth-buttons";
import { FormAlert } from "../components/form-alert";
import { EmailField } from "../components/email-field";
import { SubmitButton } from "../components/submit-button";
import { authCardStyles, rememberStyles } from "../components/style";

const styles = authCardStyles();

function SignInForm({ redirectedFrom }: { redirectedFrom: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trigger: signIn, isMutating: isLoading } = useSignIn();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const { error: signInError } = await signIn({ email, password, rememberMe });

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        return;
      }

      router.push(redirectedFrom);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className={styles.card()}>
      <CardHeader className={styles.header()}>
        <CardTitle render={<h1 />} className={styles.title()}>
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to continue to CuteCode.</CardDescription>
      </CardHeader>

      <CardPanel className={styles.panel()}>
        <SocialAuthButtons disabled={isLoading} redirectedFrom={redirectedFrom} onError={(m) => setError(m || null)} />

        <FormAlert message={error} tone="error" />

        <form onSubmit={handleSubmit} className={styles.form()}>
          <EmailField value={email} onChange={setEmail} isDisabled={isLoading} />

          <Field name="password">
            <div className={styles.labelRow()}>
              <FieldLabel>Password</FieldLabel>
              <Link href="/account/forgot-password" className={styles.inlineLink()}>
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
            <FieldError match="valueMissing">Please enter your password.</FieldError>
          </Field>

          <label className={rememberStyles({ isDisabled: isLoading })}>
            <Checkbox checked={rememberMe} onCheckedChange={(val) => setRememberMe(val === true)} disabled={isLoading} />
            Remember me
          </label>

          <SubmitButton isLoading={isLoading} loadingLabel="Signing in…">
            Sign in
          </SubmitButton>
        </form>
      </CardPanel>

      <CardFooter className={styles.footer()}>
        Don&apos;t have an account?
        <Link href="/account/sign-up" className={styles.footerLink()}>
          Create one
        </Link>
      </CardFooter>
    </Card>
  );
}

function SignInFormWithRedirect() {
  const searchParams = useSearchParams();
  return <SignInForm redirectedFrom={safeRedirectPath(searchParams.get("redirectedFrom"))} />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInForm redirectedFrom="/" />}>
      <SignInFormWithRedirect />
    </Suspense>
  );
}
