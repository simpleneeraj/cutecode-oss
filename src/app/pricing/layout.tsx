import type { Metadata } from "next";
import { BASE_URL } from "@/utils/common";
import PricingJsonLd from "@/components/seo/pricing-json-ld";

const title = "Pricing";
const description =
  "Compare Cool Snippets Free, Pro and Premium plans. Premium animated themes, high-resolution exports, watermark-free images and video, private shares and per-snippet analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: `${title} | Cool Snippets`,
    description,
    url: `${BASE_URL}/pricing`,
    siteName: "Cool Snippets",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${title} | Cool Snippets`, description },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
