"use client";

import Link from "next/link";
import { useState } from "react";
import { useInterval } from "react-use";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, Refresh01Icon, Home01Icon, Alert01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";

const REDIRECT_SECONDS = 8;

export default function CheckoutFailurePage() {
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const router = useRouter();

  useInterval(() => {
    if (countdown <= 0) {
      router.push("/");
    } else {
      setCountdown((c) => c - 1);
    }
  }, 1000);

  const progress = ((REDIRECT_SECONDS - countdown) / REDIRECT_SECONDS) * 100;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-destructive/32 bg-destructive/8 text-destructive">
            <HugeiconsIcon icon={CancelCircleIcon} className="size-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Payment failed</CardTitle>
          <CardDescription>
            We couldn&apos;t process your payment. Your card has{" "}
            <strong className="font-medium text-foreground">not been charged</strong>. Try again or use a different
            payment method.
          </CardDescription>
        </CardHeader>
        <CardPanel className="flex flex-col gap-6">
          <Alert variant="warning">
            <HugeiconsIcon icon={Alert01Icon} aria-hidden="true" />
            <AlertTitle>Common reasons</AlertTitle>
            <AlertDescription>
              Insufficient funds, an expired card, or the bank declined the transaction. Contact your bank if it keeps
              happening.
            </AlertDescription>
          </Alert>
          <Progress value={progress}>
            <ProgressTrack>
              <ProgressIndicator className="bg-destructive" />
            </ProgressTrack>
            <p className="text-muted-foreground text-xs" aria-live="polite">
              Redirecting home in <span className="font-medium text-foreground tabular-nums">{countdown}s</span>
            </p>
          </Progress>
        </CardPanel>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" size="lg" render={<Link href="/" />}>
            <HugeiconsIcon icon={Refresh01Icon} aria-hidden="true" />
            Try again
          </Button>
          <Button className="w-full" size="lg" variant="outline" render={<Link href="/" />}>
            <HugeiconsIcon icon={Home01Icon} aria-hidden="true" />
            Return home
          </Button>
        </CardFooter>
      </Card>
      <p className="text-center text-muted-foreground text-xs">
        Need help? Email us at{" "}
        <a href="mailto:support@coolsnippets.fun" className="text-foreground underline underline-offset-4">
          support@coolsnippets.fun
        </a>
      </p>
    </main>
  );
}
