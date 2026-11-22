"use client";

import type { Icon } from "@solar-icons/react/lib/types";
import { GalleryWideIcon } from "@solar-icons/react/bold-duotone/gallery-wide";
import { PenNewSquareIcon } from "@solar-icons/react/bold-duotone/pen-new-square";
import { TabBar, TabBarTab } from "@cutecode/ui/tactile/tab-bar";
import { ToolbarLink, ToolbarLinks } from "@cutecode/ui/tactile/toolbar";
import { Link } from "@/components/link";
import siteConfig from "@/constants/site-config";

const routePrefixes = {
  editor: ["/remix/", "/edit/"],
  snippet: ["/preview/", "/u/"],
};

const tabIcons: Record<string, Icon> = {
  "/": PenNewSquareIcon,
  "/snippets": GalleryWideIcon,
};

function readActiveTabHref(pathname: string) {
  const isEditorRoute = routePrefixes.editor.some((route) => pathname.startsWith(route));
  if (isEditorRoute) return "/";
  const isSnippetRoute = routePrefixes.snippet.some((route) => pathname.startsWith(route));
  if (isSnippetRoute) return "/snippets";
  return pathname;
}

export function MainLinks({ pathname }: { pathname: string }) {
  const activeHref = readActiveTabHref(pathname);

  return (
    <ToolbarLinks label="Main">
      {siteConfig.tabs.map((tab) => (
        <ToolbarLink
          key={tab.value}
          href={tab.href}
          isCurrent={tab.href === activeHref}
          render={<Link href={tab.href} />}
        >
          {tab.label}
        </ToolbarLink>
      ))}
    </ToolbarLinks>
  );
}

export function MainTabBar({ pathname }: { pathname: string }) {
  const activeHref = readActiveTabHref(pathname);

  return (
    <TabBar label="Main">
      {siteConfig.tabs.map((tab) => (
        <TabBarTab
          key={tab.value}
          href={tab.href}
          icon={tabIcons[tab.href]}
          isCurrent={tab.href === activeHref}
          render={<Link href={tab.href} />}
        >
          {tab.label}
        </TabBarTab>
      ))}
    </TabBar>
  );
}
