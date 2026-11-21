import Link from "next/link";

import { BrandMark } from "@/components/site-header/brand-mark";
import { navigationLinks } from "@/components/site-header/constants";

import { siteFooterStyles } from "./style";

const styles = siteFooterStyles();

export function SiteFooter() {
  return (
    <footer className={styles.root()}>
      <span className={styles.brand()}>
        <BrandMark />
      </span>
      <nav aria-label="Footer" className={styles.links()}>
        {navigationLinks.map((link) => (
          <Link className={styles.link()} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
