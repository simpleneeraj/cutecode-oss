"use client";

import * as React from "react";
import Image from "next/image";
import { useBrandRequest } from "@/hooks/use-brand-request";
import {
  BRAND_BUILD_FEE,
  BRAND_DURATIONS,
  SPONSOR_TIERS,
  brandRequestSchema,
  sponsorTotal,
  type BrandMonths,
  type SponsorTier,
} from "@/lib/brand-presets";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioPrimitive } from "@/components/ui/radio-group";
import SegmentedControl from "@/components/editor/controls/segmented-control";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";

type BrandRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DURATION_OPTIONS = BRAND_DURATIONS.map(({ months, discount }) => ({
  value: String(months),
  label: discount > 0 ? `${months} mo · Save ${discount * 100}%` : `${months} mo`,
}));

function monthsLabel(months: BrandMonths) {
  return months === 1 ? "1 month" : `${months} months`;
}

function StepHeading({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs tabular-nums">{step}</span>
      {children}
    </h3>
  );
}

function TierCards({ value, onValueChange }: { value: SponsorTier; onValueChange: (tier: SponsorTier) => void }) {
  return (
    <RadioGroup
      aria-label="Plan"
      value={value}
      onValueChange={(next) => onValueChange(next as SponsorTier)}
      className="grid gap-2 sm:grid-cols-3"
    >
      {SPONSOR_TIERS.map((tier) => (
        <RadioPrimitive.Root
          key={tier.id}
          value={tier.id}
          className="flex cursor-pointer flex-col gap-2 rounded-xl border p-3 text-start outline-none transition-colors hover:bg-muted/48 focus-visible:ring-2 focus-visible:ring-ring data-checked:border-primary data-checked:bg-primary/4"
        >
          <Image src={tier.badge} alt="" width={48} height={48} className="size-12 rounded-lg" />
          <span className="text-sm font-medium text-foreground">{tier.name}</span>
          <span className="text-lg font-semibold text-foreground tabular-nums">
            ${tier.monthlyFee}
            <span className="text-xs font-normal text-muted-foreground">/mo</span>
          </span>
          <span className="flex flex-col gap-1 text-xs text-muted-foreground">
            {tier.perks.slice(0, 3).map((perk) => (
              <span key={perk}>{perk}</span>
            ))}
          </span>
        </RadioPrimitive.Root>
      ))}
    </RadioGroup>
  );
}

function readRequest(form: HTMLFormElement, tier: SponsorTier, months: BrandMonths) {
  const data = new FormData(form);
  return {
    brandName: String(data.get("brandName") ?? ""),
    website: String(data.get("website") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    tier,
    months,
    notes: String(data.get("notes") ?? "") || undefined,
  };
}

export default function BrandRequestDialog({ open, onOpenChange }: BrandRequestDialogProps) {
  const [tier, setTier] = React.useState<SponsorTier>("preset");
  const [months, setMonths] = React.useState<BrandMonths>(1);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSent, setIsSent] = React.useState(false);
  const { trigger, isMutating } = useBrandRequest();
  const total = sponsorTotal(tier, months);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = brandRequestSchema.safeParse(readRequest(event.currentTarget, tier, months));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      return;
    }
    setErrors({});
    try {
      await trigger(parsed.data);
      setIsSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your request.");
    }
  };

  const onOpenChangeComplete = (isOpen: boolean) => {
    if (isOpen) return;
    setIsSent(false);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Become a sponsor</DialogTitle>
          <DialogDescription>We build a custom preset for your brand and feature it across CuteCode.</DialogDescription>
        </DialogHeader>
        {isSent ? (
          <>
            <DialogPanel>
              <p className="text-sm text-muted-foreground">Thanks, we&apos;ll reply within 2 business days.</p>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button type="button" />}>Done</DialogClose>
            </DialogFooter>
          </>
        ) : (
          <Form className="contents" errors={errors} onSubmit={onSubmit}>
            <DialogPanel className="flex flex-col gap-6">
              <section className="flex flex-col gap-3">
                <StepHeading step={1}>Choose a plan</StepHeading>
                <TierCards value={tier} onValueChange={setTier} />
                <SegmentedControl
                  label="Duration"
                  options={DURATION_OPTIONS}
                  value={String(months)}
                  onValueChange={(value) => setMonths(Number(value) as BrandMonths)}
                />
              </section>
              <section className="flex flex-col gap-3">
                <StepHeading step={2}>Your details</StepHeading>
                <Field name="brandName">
                  <FieldLabel>Brand name</FieldLabel>
                  <Input name="brandName" placeholder="Acme" autoComplete="organization" />
                  <FieldError />
                </Field>
                <Field name="website">
                  <FieldLabel>Website</FieldLabel>
                  <Input name="website" type="url" placeholder="https://acme.com" autoComplete="url" />
                  <FieldError />
                </Field>
                <Field name="email">
                  <FieldLabel>Email</FieldLabel>
                  <Input name="email" type="email" placeholder="you@acme.com" autoComplete="email" />
                  <FieldError />
                </Field>
                <Field name="notes">
                  <FieldLabel>Notes (optional)</FieldLabel>
                  <Textarea name="notes" maxLength={1000} placeholder="Brand colors, fonts, launch dates" />
                  <FieldError />
                </Field>
              </section>
            </DialogPanel>
            <DialogFooter className="flex-col gap-3 sm:flex-col sm:justify-start">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-foreground">
                  Total <span className="font-semibold tabular-nums">${total}</span> today: ${BRAND_BUILD_FEE} build + $
                  {total - BRAND_BUILD_FEE} for {monthsLabel(months)}
                </p>
                <p className="text-xs text-muted-foreground">
                  No payment now. We reply within 2 business days with a preview and a payment link.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DialogClose render={<Button variant="ghost" type="button" />}>Cancel</DialogClose>
                <Button type="submit" disabled={isMutating}>
                  Send request
                </Button>
              </div>
            </DialogFooter>
          </Form>
        )}
      </DialogPopup>
    </Dialog>
  );
}
