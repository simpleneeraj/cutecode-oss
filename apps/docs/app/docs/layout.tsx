import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { StyleSwitcher } from "@/components/style-switcher";
import { source } from "@/lib/source";

type DocsRootLayoutProps = {
  children: ReactNode;
};

export default function DocsRootLayout({ children }: DocsRootLayoutProps) {
  return (
    <DocsLayout
      links={[{ type: "custom", children: <StyleSwitcher /> }]}
      nav={{ title: "CuteUI" }}
      themeSwitch={{ enabled: false }}
      tree={source.getPageTree()}
    >
      {children}
    </DocsLayout>
  );
}
