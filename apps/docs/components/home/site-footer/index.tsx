import Link from "next/link";

import { BrandMark } from "@/components/site-header/brand-mark";

import { footerColumns } from "./constants";
import { siteFooterStyles } from "./style";

const styles = siteFooterStyles();

export function SiteFooter() {
  return (
    <footer className={styles.root()}>
      <div className={styles.top()}>
        <div className={styles.brand()}>
          <BrandMark />
          <p className={styles.tagline()}>UI you can almost touch. React components on Base UI, with Solar icons.</p>
        </div>
        <nav aria-label="Footer" className={styles.columns()}>
          {footerColumns.map((column) => (
            <div className={styles.column()} key={column.id}>
              <h2 className={styles.heading()}>{column.title}</h2>
              {column.links.map((link) => (
                <Link className={styles.link()} href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.bottom()}>
        <span>Built on Base UI. Icons by Solar.</span>
        <span>2026 CuteUI</span>
      </div>
    </footer>
  );
}
