"use client";

import { Link } from "@/components/link";
import siteConfig from "@/contstant/site-config";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

const EDITOR_ROUTES = ["/remix/", "/edit/"];

function activeTabHref(pathname: string) {
  if (EDITOR_ROUTES.some((route) => pathname.startsWith(route))) return "/";
  return pathname;
}

export default function Navigations() {
  const pathname = usePathname();

  return (
    <Tabs value={activeTabHref(pathname ?? "/")}>
      <TabsList>
        {siteConfig.tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.href}
            nativeButton={false}
            className="h-8 px-2.5 text-sm hover:text-foreground"
            render={<Link href={tab.href} />}
          >
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
}
