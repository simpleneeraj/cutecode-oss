import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { PRICING_FAQ, PRICING_HERO } from "./content";
import PricingPlans from "./components/pricing-plans";

export default function PricingPage() {
  return (
    <main className="flex-1 bg-background px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <header className="mx-auto flex max-w-xl flex-col gap-3 text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
            {PRICING_HERO.title}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground md:text-base">{PRICING_HERO.subtitle}</p>
        </header>

        <PricingPlans />

        <section className="grid gap-6 border-t pt-16 md:grid-cols-3 md:gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <Accordion className="md:col-span-2">
            {PRICING_FAQ.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionPanel>{answer}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </main>
  );
}
