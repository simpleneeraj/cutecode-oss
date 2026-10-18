"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plan } from "@/db/schema";
import { BillingInterval } from "@/lib/billing/products";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import PlanCard from "./plan-card";

const TIERS = [Plan.FREE, Plan.PRO, Plan.PREMIUM];
const INTERVALS = Object.values(BillingInterval);

type PlansDialogProps = {
  trigger?: React.ReactNode;
};

export default function PlansDialog({ trigger }: PlansDialogProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();
  const [open, setOpen] = useAtom(plansDialogOpenAtom);
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  function onIntervalChange(value: string[]) {
    const next = INTERVALS.find((option) => value.includes(option));
    if (next) setBillingInterval(next);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogPopup className="overflow-hidden rounded-2xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-heading text-2xl tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm/10">
              <HugeiconsIcon icon={CrownIcon} className="size-4" aria-hidden="true" />
            </span>
            Choose your plan
          </DialogTitle>
          <DialogDescription>Premium themes, sharper exports and clean, watermark-free video. Cancel anytime.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-5">
          <ToggleGroup variant="outline" className="self-center" value={[interval]} onValueChange={onIntervalChange}>
            <ToggleGroupItem value={BillingInterval.MONTHLY}>Monthly</ToggleGroupItem>
            <ToggleGroupItem value={BillingInterval.YEARLY}>
              Yearly
              <Badge variant="success" size="sm">
                2 months free
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="grid gap-4 pt-2 md:grid-cols-3">
            {TIERS.map((tier) => (
              <PlanCard
                key={tier}
                tier={tier}
                currentPlan={currentPlan}
                interval={interval}
                isSignedIn={!!isSignedIn}
                isLoaded={isLoaded}
                pricing={pricing}
              />
            ))}
          </div>
        </DialogPanel>

        <DialogFooter className="sm:justify-center">
          <p className="text-center text-xs text-muted-foreground">Secure checkout · Cancel anytime · Instant access</p>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
