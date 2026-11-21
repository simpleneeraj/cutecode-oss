import { Button } from "@cutecode/ui/components/button";
import { Toolbar, ToolbarActions, ToolbarBrand, ToolbarLink, ToolbarLinks } from "@cutecode/ui/tactile/toolbar";
import Link from "next/link";

import { Customizer } from "@/components/customizer";

import { BrandMark } from "./brand-mark";
import { navigationLinks, siteLinks } from "./constants";
import { siteHeaderStyles } from "./style";

const styles = siteHeaderStyles();

export function SiteHeader() {
  return (
    <div className={styles.root()}>
      <div className={styles.bar()}>
        <Toolbar>
          <ToolbarBrand href="/" render={<Link href="/" />}>
            <BrandMark />
          </ToolbarBrand>
          <ToolbarLinks label="Main">
            {navigationLinks.map((link) => (
              <ToolbarLink href={link.href} key={link.href} render={<Link href={link.href} />}>
                {link.label}
              </ToolbarLink>
            ))}
          </ToolbarLinks>
          <ToolbarActions>
            <Customizer />
            <Button render={<Link href={siteLinks.installation} />}>Get Started</Button>
          </ToolbarActions>
        </Toolbar>
      </div>
    </div>
  );
}
