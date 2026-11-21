"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useTimeout } from "react-use";
import { useUser } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import PlanActive from "./plan-active";
import PlanActivating from "./plan-activating";

const POLL_MS = 2000;
const SLOW_AFTER_MS = 30_000;
const FAILED_STATUSES = ["failed", "canceled", "cancelled"];

export function FailedCheckoutRedirect() {
  const router = useRouter();
  const status = useSearchParams().get("status");

  useEffect(() => {
    if (status && FAILED_STATUSES.includes(status)) router.replace("/checkout/failure");
  }, [status, router]);

  return null;
}

function usePlanActivation() {
  const { user } = useUser();
  const { plan, isFree } = useSubscription();
  const [isSlowReady] = useTimeout(SLOW_AFTER_MS);
  const isSlow = isSlowReady() === true;
  const refreshInterval = isFree && !isSlow ? POLL_MS : 0;
  const session = useSWR("auth-session", () => authClient.getSession(), { refreshInterval });
  const billing = useSWR(user ? ["billing.status"] : null, () => trpc.billing.status.query(), { refreshInterval });

  const refresh = () => {
    session.mutate();
    billing.mutate();
  };

  return { plan, isFree, isSlow, isRefreshing: session.isValidating || billing.isValidating, refresh };
}

export default function CheckoutSuccessClient() {
  const { plan, isFree, isSlow, isRefreshing, refresh } = usePlanActivation();

  if (!isFree) return <PlanActive plan={plan} />;

  return <PlanActivating isSlow={isSlow} isRefreshing={isRefreshing} onRefresh={refresh} />;
}
