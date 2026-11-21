import {
  PriceCard,
  PriceCardAction,
  PriceCardAmount,
  PriceCardFeatures,
  PriceCardHeader,
} from "@cutecode/ui/tactile/price-card";

import { previewPlan } from "./constants";

export function PreviewPlan() {
  return (
    <PriceCard isFeatured>
      <PriceCardHeader badge={previewPlan.badge} name={previewPlan.name} />
      <PriceCardAmount period={previewPlan.period} price={previewPlan.price} />
      <PriceCardFeatures features={previewPlan.features} />
      <PriceCardAction isFeatured>Upgrade</PriceCardAction>
    </PriceCard>
  );
}
