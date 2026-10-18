import { BASE_URL } from "@/utils/common";
import { PLANS } from "@/lib/billing/plans";
import { PRICING_FAQ } from "@/app/pricing/content";

const paidPlans = [PLANS.PRO, PLANS.PREMIUM];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "CuteCode",
      description: "Code screenshot and snippet sharing tool with Free, Pro and Premium plans.",
      url: `${BASE_URL}/pricing`,
      image: `${BASE_URL}/opengraph-image`,
      brand: { "@type": "Brand", name: "CuteCode" },
      offers: [PLANS.FREE, ...paidPlans].flatMap((plan) => {
        const cycles = plan.prices.monthly === 0 ? [["month", plan.prices.monthly] as const] : [["month", plan.prices.monthly] as const, ["year", plan.prices.yearly] as const];
        return cycles.map(([cycle, price]) => ({
          "@type": "Offer",
          name: price === 0 ? plan.name : `${plan.name} ${cycle}ly`,
          price: String(price),
          priceCurrency: "USD",
          url: `${BASE_URL}/pricing`,
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(price),
            priceCurrency: "USD",
            unitCode: cycle === "month" ? "MON" : "ANN",
          },
        }));
      }),
    },
    {
      "@type": "FAQPage",
      mainEntity: PRICING_FAQ.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function PricingJsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
