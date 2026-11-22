"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/link";
import { useResetPassword } from "@/hooks/use-auth-mutations";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@cutecode/ui/components/card";
import { Input } from "@cutecode/ui/components/input";
import { Field, FieldLabel, FieldError } from "@cutecode/ui/components/field";
import { FormAlert } from "../components/form-alert";
import { SubmitButton } from "../components/submit-button";
import { authCardStyles } from "../components/style";

const styles = authCardStyles();

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { trigger: resetPassword, isMutating: isLoading } = useResetPassword();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError(null);

    try {
      const { error: updateError } = await resetPassword({ newPassword: password });
      if (updateError) {
        setError(updateError.message || "Couldn't update your password. The reset link may have expired.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  }

  return (
    <Card className={styles.card()}>
      <CardHeader className={styles.header()}>
        <CardTitle render={<h1 />} className={styles.title()}>
          Set a new password
        </CardTitle>
        <CardDescription>Choose a new password for your account</CardDescription>
      </CardHeader>

      <CardPanel className={styles.panel()}>
        <FormAlert message={error} tone="error" />

        <form onSubmit={handleSubmit} className={styles.form()}>
          <Field name="password">
            <FieldLabel>New password</FieldLabel>
            <Input
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
              autoFocus
            />
            <FieldError match="valueMissing">Please enter a new password.</FieldError>
            <FieldError match="tooShort">Password must be at least 8 characters.</FieldError>
          </Field>

          <SubmitButton isLoading={isLoading} loadingLabel="Updating…">
            Update password
          </SubmitButton>
        </form>
      </CardPanel>

      <CardFooter className={styles.footer()}>
        <Link href="/account/sign-in" className={styles.footerLink()}>
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
