import type { Metadata, Viewport } from "next";

import { AgentTeaser } from "@/components/home/agent-teaser";
import { CalendarTeaser } from "@/components/home/calendar-teaser";
import { DocsTeaser } from "@/components/home/docs-teaser";
import { Hero } from "@/components/home/hero";
import { InstallSection } from "@/components/home/install-section";
import { ObjectsBento } from "@/components/home/objects-bento";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { SiteFooter } from "@/components/home/site-footer";
import { ThemeSection } from "@/components/home/theme-section";

import { homePageStyles } from "./style";

export const metadata: Metadata = {
  title: "CuteUI",
  description:
    "React components that feel like real objects. Folders open, cards fan out, glass catches the light. Built on Base UI, with Solar icons, following Apple's guidelines.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

const styles = homePageStyles();

export default function HomePage() {
  return (
    <div className={styles.root()}>
      <div className={styles.sections()}>
        <Hero />
        <InstallSection />
        <ObjectsBento />
        <ThemeSection />
        <CalendarTeaser />
        <AgentTeaser />
        <DocsTeaser />
        <PricingTeaser />
      </div>
      <SiteFooter />
    </div>
  );
}
