"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Sidebar, SidebarProvider, useSidebar } from "fumadocs-ui/layouts/docs/slots/sidebar";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";

import { MenuTrigger } from "./menu-trigger";
import { SearchButton } from "./search-button";
import { SearchField } from "./search-field";

type DocsShellProps = {
  tree: PageTree.Root;
  children: ReactNode;
};

export function DocsShell({ tree, children }: DocsShellProps) {
  return (
    <DocsLayout
      {...baseOptions()}
      sidebar={{ collapsible: false }}
      slots={{
        searchTrigger: { sm: SearchButton, full: SearchField },
        sidebar: { provider: SidebarProvider, root: Sidebar, trigger: MenuTrigger, useSidebar },
      }}
      tree={tree}
    >
      {children}
    </DocsLayout>
  );
}
