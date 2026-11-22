import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@cutecode/ui/components/accordion";
import { PRICING_FAQ, PRICING_HERO } from "./content";
import PricingPlans from "./components/pricing-plans";
import BrandPlans from "./components/brand-plans";
import { pricingPageStyles } from "./components/style";

const styles = pricingPageStyles();

export default function PricingPage() {
  return (
    <main className={styles.main()}>
      <div className={styles.content()}>
        <header className={styles.hero()}>
          <h1 className={styles.title()}>{PRICING_HERO.title}</h1>
          <p className={styles.subtitle()}>{PRICING_HERO.subtitle}</p>
        </header>

        <PricingPlans />

        <BrandPlans />

        <section className={styles.section()}>
          <h2 className={styles.sectionTitle()}>Frequently asked questions</h2>
          <Accordion className={styles.faq()}>
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
