"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@/hooks/use-auth-mutations";
import { tv } from "tailwind-variants";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@cutecode/ui/components/card";
import { Button } from "@cutecode/ui/components/button";
import { Input } from "@cutecode/ui/components/input";
import { Field, FieldLabel, FieldError } from "@cutecode/ui/components/field";
import { Checkbox } from "@cutecode/ui/components/checkbox";
import { Spinner } from "@cutecode/ui/components/spinner";
import { Alert, AlertDescription } from "@cutecode/ui/components/alert";
import { safeRedirectPath } from "@/utils/safe-redirect";
import { SocialAuthButtons } from "../components/social-auth-buttons";

const rememberLabel = tv({
  base: "flex cursor-pointer select-none items-center gap-2.5 text-sm text-muted-foreground",
  variants: { disabled: { true: "cursor-not-allowed opacity-64" } },
});

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
    <Card className="w-full">
      <CardHeader className="justify-items-center text-center">
        <CardTitle render={<h1 />} className="font-heading text-xl tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to continue to CuteCode.</CardDescription>
      </CardHeader>

      <CardPanel className="flex flex-col gap-6">
        <SocialAuthButtons disabled={isLoading} redirectedFrom={redirectedFrom} onError={(m) => setError(m || null)} />

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
