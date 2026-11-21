"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/use-auth-mutations";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="w-full">
      <CardHeader className="justify-items-center text-center">
        <CardTitle render={<h1 />}>Set a new password</CardTitle>
        <CardDescription>Choose a new password for your account</CardDescription>
      </CardHeader>

      <CardPanel className="flex flex-col gap-6">
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

          <Button type="submit" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Spinner />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardPanel>

      <CardFooter className="justify-center border-t text-sm">
        <Link href="/account/sign-in" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
