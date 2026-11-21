import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

import { HomeTabBar } from "@/components/home/home-tab-bar";
import { SiteHeader } from "@/components/site-header";
import { homeLinks } from "@/components/site-header/navigation";
import { baseOptions } from "@/lib/layout.shared";

import { homeLayoutStyles } from "./style";

type HomeRootLayoutProps = {
  children: ReactNode;
};

const styles = homeLayoutStyles();

export default function HomeRootLayout({ children }: HomeRootLayoutProps) {
  const options = baseOptions();
  const customLinks = options.links?.filter((link) => link.type === "custom") ?? [];

  return (
    <HomeLayout {...options} className={styles.root()} links={[...homeLinks, ...customLinks]} slots={{ header: SiteHeader }}>
      {children}
      <div className={styles.dock()}>
        <HomeTabBar />
      </div>
    </HomeLayout>
  );
}
