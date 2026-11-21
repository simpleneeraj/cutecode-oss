import type { Metadata, Viewport } from "next";

import { FloatingObjects } from "@/components/home/floating-objects";
import { Foundations } from "@/components/home/foundations";
import { Hero } from "@/components/home/hero";
import { HomeTabBar } from "@/components/home/home-tab-bar";
import { LayerLadder } from "@/components/home/layer-ladder";
import { PartsGrid } from "@/components/home/parts-grid";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { SiteFooter } from "@/components/home/site-footer";
import { StudioTeaser } from "@/components/home/studio-teaser";
import { SiteHeader } from "@/components/site-header";

import { homePageStyles } from "./style";

export const metadata: Metadata = {
  title: "CuteUI",
  description:
    "A React component library where folders, stacks and app icons feel like real objects. Built on Base UI, with Solar icons, following Apple's Human Interface Guidelines.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

const styles = homePageStyles();

export default function HomePage() {
  return (
    <div className={styles.root()}>
      <SiteHeader />
      <main className={styles.main()}>
        <Hero>
          <FloatingObjects />
        </Hero>
        <PartsGrid />
        <LayerLadder />
        <Foundations />
        <StudioTeaser />
        <PricingTeaser />
      </main>
      <SiteFooter />
      <div className={styles.dock()}>
        <HomeTabBar />
      </div>
    </div>
  );
}
