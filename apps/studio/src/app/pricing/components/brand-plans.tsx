"use client";

import { useState } from "react";
import Image from "next/image";
import { BRAND_BUILD_FEE, BRAND_DURATIONS, SPONSOR_TIERS } from "@/lib/brand-presets";
import { Button } from "@cutecode/ui/components/button";
import { Card } from "@cutecode/ui/components/card";
import BrandRequestDialog from "@/components/brand-request/brand-request-dialog";
import SponsorsStrip from "@/components/sponsors/sponsors-strip";
import { pricingPageStyles, sponsorStyles } from "./style";

const sponsorDiscounts = BRAND_DURATIONS.filter(({ discount }) => discount > 0)
  .map(({ months, discount }) => `${discount * 100}% off ${months} months`)
  .join(", ");

const page = pricingPageStyles();
const styles = sponsorStyles();

export default function BrandPlans() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={page.section()}>
      <div className={styles.intro()}>
        <h2 className={page.sectionTitle()}>Sponsor CuteCode</h2>
        <p className={styles.body()}>
          Put your brand in front of developers. Every tier includes a ${BRAND_BUILD_FEE} custom preset build. {sponsorDiscounts}.
        </p>
      </div>
      <div className={styles.content()}>
        <ul className={styles.tiers()}>
          {SPONSOR_TIERS.map(({ id, name, monthlyFee, perks, badge }) => (
            <Card key={id} render={<li />} className={styles.tier()}>
              <Image src={badge} alt="" width={40} height={40} className={styles.badge()} />
              <span className={styles.name()}>{name}</span>
              <span className={styles.price()}>
                ${monthlyFee}
                <span className={styles.period()}>/mo</span>
              </span>
              <ul className={styles.perks()}>
                {perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
        <Button className={styles.action()} onClick={() => setIsOpen(true)}>
          Become a sponsor
        </Button>
        <SponsorsStrip />
      </div>
      <BrandRequestDialog open={isOpen} onOpenChange={setIsOpen} />
    </section>
  );
}
