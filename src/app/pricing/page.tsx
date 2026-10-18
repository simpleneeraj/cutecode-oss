import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { PRICING_FAQ, PRICING_HERO } from "./content";
import PricingPlans from "./components/pricing-plans";

export default function PricingPage() {
  return (
    <main className="flex-1 bg-background px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <header className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
            {PRICING_HERO.title}
          </h1>
          <p className="text-base text-pretty text-muted-foreground md:text-lg">{PRICING_HERO.subtitle}</p>
        </header>

        <PricingPlans />

        <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <h2 className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <Accordion>
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
