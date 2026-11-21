"use client";

import type { TOCItemType } from "fumadocs-core/toc";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import type { ReactNode } from "react";

import { DocsBreadcrumb } from "./breadcrumb";
import { DocsPager } from "./pager";

type DocsPageShellProps = {
  isFull: boolean;
  toc: TOCItemType[];
  children: ReactNode;
};

export function DocsPageShell({ isFull, toc, children }: DocsPageShellProps) {
  return (
    <DocsPage full={isFull} slots={{ breadcrumb: DocsBreadcrumb, footer: DocsPager }} toc={toc}>
      {children}
    </DocsPage>
  );
}
