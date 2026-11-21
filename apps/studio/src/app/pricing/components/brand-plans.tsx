"use client";

import { useState } from "react";
import Image from "next/image";
import { BRAND_BUILD_FEE, BRAND_DURATIONS, SPONSOR_TIERS } from "@/lib/brand-presets";
import { Button } from "@cutecode/ui/components/button";
import BrandRequestDialog from "@/components/brand-request/brand-request-dialog";
import SponsorsStrip from "@/components/sponsors/sponsors-strip";

const DISCOUNTS = BRAND_DURATIONS.filter(({ discount }) => discount > 0)
  .map(({ months, discount }) => `${discount * 100}% off ${months} months`)
  .join(", ");

export default function BrandPlans() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="grid gap-6 border-t pt-16 md:grid-cols-3 md:gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Sponsor CuteCode</h2>
        <p className="text-sm text-pretty text-muted-foreground">
          Put your brand in front of developers. Every tier includes a ${BRAND_BUILD_FEE} custom preset build. {DISCOUNTS}.
        </p>
      </div>
      <div className="flex flex-col gap-4 md:col-span-2">
        <ul className="grid gap-2 sm:grid-cols-3">
          {SPONSOR_TIERS.map(({ id, name, monthlyFee, perks, badge }) => (
            <li key={id} className="flex flex-col gap-2 rounded-lg border p-4">
              <Image src={badge} alt="" width={40} height={40} className="size-10 rounded-lg" />
              <span className="text-sm text-muted-foreground">{name}</span>
              <span className="text-2xl font-semibold text-foreground tabular-nums">
                ${monthlyFee}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </span>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Button className="self-start" onClick={() => setIsOpen(true)}>
          Become a sponsor
        </Button>
        <SponsorsStrip />
      </div>
      <BrandRequestDialog open={isOpen} onOpenChange={setIsOpen} />
    </section>
  );
}
