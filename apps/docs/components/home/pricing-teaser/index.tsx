import {
  PriceCard,
  PriceCardAction,
  PriceCardAmount,
  PriceCardFeatures,
  PriceCardHeader,
  PriceCardNote,
} from "@cutecode/ui/tactile/price-card";
import Link from "next/link";

import { homeSectionStyles } from "@/components/home/section/style";
import { SectionHeading } from "@/components/home/section-heading";
import { siteLinks } from "@/components/site-header/constants";

import { planFeatures } from "./constants";
import { pricingTeaserStyles } from "./style";

const section = homeSectionStyles();
const styles = pricingTeaserStyles();

export function PricingTeaser() {
  return (
    <section className={section.root()} id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        isCentered
        lead="Every component is free and MIT licensed. Pro adds ready-made blocks and templates built from them."
        title="Free to start. Pro when you need more."
      />
      <div className={styles.plans()}>
        <PriceCard>
          <PriceCardHeader name="Free" />
          <PriceCardAmount period="MIT license" price="$0" />
          <PriceCardNote>Every component, MIT licensed.</PriceCardNote>
          <PriceCardAction render={<Link href={siteLinks.components} />}>Browse components</PriceCardAction>
          <PriceCardFeatures features={planFeatures.free} />
        </PriceCard>
        <PriceCard isFeatured>
          <PriceCardHeader name="Pro" />
          <PriceCardAmount period="Blocks and templates" price="Soon" />
          <PriceCardNote>Ready-made blocks and templates, built from the components.</PriceCardNote>
          <PriceCardAction isFeatured render={<button disabled type="button" />}>
            Coming soon
          </PriceCardAction>
          <PriceCardFeatures features={planFeatures.pro} />
        </PriceCard>
      </div>
    </section>
  );
}
