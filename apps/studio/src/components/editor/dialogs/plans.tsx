"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@cutecode/ui/components/dialog";
import { BillingInterval } from "@/lib/billing/products";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import BillingIntervalTabs from "./billing-interval-tabs";
import PlanGrid from "./plan-grid";
import CheckoutNote from "./checkout-note";

type PlansDialogProps = {
  trigger?: React.ReactNode;
};

export default function PlansDialog({ trigger }: PlansDialogProps) {
  const [open, setOpen] = useAtom(plansDialogOpenAtom);
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogPopup className="overflow-hidden rounded-2xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-tight">Choose your plan</DialogTitle>
          <DialogDescription>Premium themes, sharper exports and clean, watermark-free video. Cancel anytime.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-6">
          <BillingIntervalTabs value={interval} onChange={setBillingInterval} />
          <PlanGrid interval={interval} />
        </DialogPanel>

        <DialogFooter className="sm:justify-center">
          <CheckoutNote />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
