import type { LinkItemType, MainItemType } from "fumadocs-ui/layouts/shared";
import { isLinkItemActive } from "fumadocs-ui/layouts/shared";
import type { ReactNode } from "react";

import { navigationLinks } from "./constants";

export type NavigationLink = {
  label: ReactNode;
  href: string;
  isCurrent: boolean;
};

function isMainLink(item: LinkItemType): item is MainItemType {
  return item.type === undefined || item.type === "main";
}

export function readNavigationLinks(items: LinkItemType[], pathname: string): NavigationLink[] {
  return items.filter(isMainLink).map((item) => ({
    label: item.text,
    href: item.url,
    isCurrent: isLinkItemActive(item, pathname),
  }));
}

export function readCustomItems(items: LinkItemType[]) {
  return items.flatMap((item) => (item.type === "custom" ? [item.children] : []));
}

export const homeLinks: LinkItemType[] = navigationLinks.map((link) => ({ text: link.label, url: link.href }));
