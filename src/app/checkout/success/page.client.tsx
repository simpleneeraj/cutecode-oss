"use client";

import Link from "next/link";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { useInterval } from "react-use";
import { tv } from "tailwind-variants";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useSubscription } from "@/hooks/use-subscription";
import { PLANS } from "@/lib/billing/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { Card, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";

const REDIRECT_SECONDS = 5;
const PLAN_POLL_MS = 2000;
const MAX_PLAN_POLLS = 15;

const page = tv({
  slots: {
    shell: "flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-4 text-foreground",
    header: "justify-items-center gap-3 text-center",
    media: "flex size-12 items-center justify-center rounded-full border",
    feature: "flex items-center gap-2 text-muted-foreground text-sm",
  },
  variants: {
    confirmed: {
      true: { media: "border-success/32 bg-success/8 text-success" },
      false: { media: "border-warning/32 bg-warning/8 text-warning" },
    },
  },
});

export default function CheckoutSuccessClient() {
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const [planPolls, setPlanPolls] = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { plan, isFree } = useSubscription();
  const planName = PLANS[plan].name;
  const unlockedFeatures = isFree ? [] : PLANS[plan].features.slice(1, 5);
  const isConfirmed = !isFree || planPolls >= MAX_PLAN_POLLS;
  const { shell, header, media, feature } = page({ confirmed: !isFree });

  useInterval(
    () => {
      setPlanPolls((polls) => polls + 1);
      mutate("auth-session");
      mutate(["billing.status"]);
    },
    isConfirmed ? null : PLAN_POLL_MS,
  );

  useInterval(
    () => {
      if (countdown <= 0) {
        router.push("/");
      } else {
        setCountdown((c) => c - 1);
      }
    },
    isConfirmed ? 1000 : null,
  );

  const progress = ((REDIRECT_SECONDS - countdown) / REDIRECT_SECONDS) * 100;

  if (!isConfirmed) {
    return (
      <main className={shell()} role="status">
        <Spinner className="size-5 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Activating your new plan…</p>
      </main>
    );
  }

  return (
    <main className={shell()}>
      <Card className="w-full max-w-md">
        <CardHeader className={header()}>
          <div className={media()}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" aria-hidden="true" />
          </div>
          {!isFree && <Badge variant="success">{planName} plan</Badge>}
          <CardTitle className="text-2xl">{!isFree ? "You’re all set" : "Payment received"}</CardTitle>
          <CardDescription>
            {!isFree
              ? `Your ${planName} plan is active. Here’s what you unlocked.`
              : "Your new plan is still activating. Refresh in a minute, or contact support@coolsnippets.fun if it doesn’t appear."}
          </CardDescription>
        </CardHeader>
        <CardPanel className="flex flex-col gap-6">
          {unlockedFeatures.length > 0 && (
            <ul className="flex flex-col gap-2">
              {unlockedFeatures.map((item) => (
                <li key={item} className={feature()}>
                  <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          <Progress value={progress}>
            <ProgressTrack>
              <ProgressIndicator className="bg-success" />
            </ProgressTrack>
            <p className="text-muted-foreground text-xs" aria-live="polite">
              Redirecting to the editor in <span className="font-medium text-foreground tabular-nums">{countdown}s</span>
            </p>
          </Progress>
        </CardPanel>
        <CardFooter>
          <Button className="w-full" size="lg" render={<Link href="/" />}>
            Start creating now
            <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
      <p className="text-center text-muted-foreground text-xs">A confirmation email is on its way to your inbox.</p>
    </main>
  );
}
