"use client";

import { useState } from "react";
import { BillingInterval } from "@/lib/billing/products";
import BillingIntervalTabs from "@/components/editor/dialogs/billing-interval-tabs";
import PlanGrid from "@/components/editor/dialogs/plan-grid";
import CheckoutNote from "@/components/editor/dialogs/checkout-note";

export default function PricingPlans() {
  const [interval, setBillingInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);

  return (
    <div className="flex flex-col gap-8">
      <BillingIntervalTabs value={interval} onChange={setBillingInterval} />
      <PlanGrid interval={interval} signInRedirect="/pricing" />
      <CheckoutNote />
    </div>
  );
}
