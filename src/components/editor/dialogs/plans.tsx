"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { useUser } from "@/hooks/use-auth";
import { usePricing } from "@/hooks/use-pricing";
import { useSubscription } from "@/hooks/use-subscription";
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
import BillingIntervalTabs from "./billing-interval-tabs";
import PlanCard from "./plan-card";
import CheckoutNote from "./checkout-note";

const TIERS = [Plan.FREE, Plan.PRO, Plan.PREMIUM];

type PlansDialogProps = {
  trigger?: React.ReactNode;
};

export default function PlansDialog({ trigger }: PlansDialogProps) {
  const { isSignedIn, isLoaded } = useUser();
  const { plan: currentPlan } = useSubscription();
  const { data: pricing } = usePricing();
  const [open, setOpen] = useAtom(plansDialogOpenAtom);
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

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
          <BillingIntervalTabs value={interval} onChange={setBillingInterval} />

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
          <CheckoutNote />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
