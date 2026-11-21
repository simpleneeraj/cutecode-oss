import type { ReactNode } from "react";
import { source } from "@/lib/source";

import { DocsShell } from "./_chrome/docs-shell";

type DocsRootLayoutProps = {
  children: ReactNode;
};

export default function DocsRootLayout({ children }: DocsRootLayoutProps) {
  return <DocsShell tree={source.getPageTree()}>{children}</DocsShell>;
}
