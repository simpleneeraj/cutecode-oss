import {
  PriceCard,
  PriceCardAction,
  PriceCardAmount,
  PriceCardFeatures,
  PriceCardHeader,
  PriceCardNote,
} from "@cutecode/ui/tactile/price-card";
import Link from "next/link";

import { SectionHeading } from "@/components/home/section-heading";
import { siteLinks } from "@/components/site-header/constants";

import { planFeatures } from "./constants";
import { pricingTeaserStyles } from "./style";

const styles = pricingTeaserStyles();

export function PricingTeaser() {
  return (
    <section className={styles.root()} id="pricing">
      <SectionHeading isCentered title="Free to start" />
      <div className={styles.plans()}>
        <PriceCard>
          <PriceCardHeader name="Free" />
          <PriceCardAmount period="forever" price="$0" />
          <PriceCardNote>Every component, MIT licensed.</PriceCardNote>
          <PriceCardAction render={<Link href={siteLinks.components} />}>Browse Components</PriceCardAction>
          <PriceCardFeatures features={planFeatures.free} />
        </PriceCard>
        <PriceCard isFeatured>
          <PriceCardHeader name="Pro" />
          <PriceCardAmount period="per year" price="[PRICE]" />
          <PriceCardNote>Blocks and templates, built from the components.</PriceCardNote>
          <PriceCardAction isFeatured render={<button disabled type="button" />}>
            Coming Soon
          </PriceCardAction>
          <PriceCardFeatures features={planFeatures.pro} />
        </PriceCard>
      </div>
    </section>
  );
}
