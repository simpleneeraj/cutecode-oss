import type { Metadata } from "next";
import { BASE_URL } from "@/utils/common";
import PricingJsonLd from "@/components/seo/pricing-json-ld";

const title = "Pricing";
const description =
  "Compare CuteCode Free, Pro and Premium plans. Premium animated themes, high-resolution exports, watermark-free images and video, private shares and per-snippet analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: `${title} | CuteCode`,
    description,
    url: `${BASE_URL}/pricing`,
    siteName: "CuteCode",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${title} | CuteCode`, description },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
