"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mutate } from "swr";
import { authClient } from "@/lib/auth-client";
import { tv } from "tailwind-variants";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { safeRedirectPath } from "@/utils/safe-redirect";
import { SocialAuthButtons } from "../components/social-auth-buttons";

const rememberLabel = tv({
  base: "flex cursor-pointer select-none items-center gap-2.5 text-sm text-muted-foreground",
  variants: { disabled: { true: "cursor-not-allowed opacity-64" } },
});

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = safeRedirectPath(searchParams.get("redirectedFrom"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        return;
      }

      await mutate("auth-session");
      router.push(redirectedFrom);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="justify-items-center text-center">
        <CardTitle render={<h1 />}>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardPanel className="flex flex-col gap-6">
        <SocialAuthButtons disabled={isLoading} redirectedFrom={redirectedFrom} onError={(m) => setError(m || null)} />

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            <div className="flex w-full items-center justify-between">
              <FieldLabel>Password</FieldLabel>
              <Link href="/account/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-foreground">
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

          <label className={rememberLabel({ disabled: isLoading })}>
            <Checkbox checked={rememberMe} onCheckedChange={(val) => setRememberMe(val === true)} disabled={isLoading} />
            Remember me
          </label>

          <Button type="submit" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardPanel>

      <CardFooter className="justify-center gap-1 border-t text-sm text-muted-foreground">
        Don&apos;t have an account?
        <Link href="/account/sign-up" className="font-medium text-foreground hover:underline">
          Create one
        </Link>
      </CardFooter>
    </Card>
  );
}
