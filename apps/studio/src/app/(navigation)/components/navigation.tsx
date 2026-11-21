"use client";

import { Link } from "@/components/link";
import siteConfig from "@/constants/site-config";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTab } from "@cutecode/ui/components/tabs";

const EDITOR_ROUTES = ["/remix/", "/edit/"];
const SNIPPET_ROUTES = ["/preview/", "/u/"];

function activeTabHref(pathname: string) {
  if (EDITOR_ROUTES.some((route) => pathname.startsWith(route))) return "/";
  if (SNIPPET_ROUTES.some((route) => pathname.startsWith(route))) return "/snippets";
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
            className="h-8 px-2.5 text-sm text-foreground/70 hover:text-foreground"
            render={<Link href={tab.href} />}
          >
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
}
