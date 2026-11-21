"use client";

import { Button } from "@cutecode/ui/components/button";
import { useHomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { BrandMark } from "./brand-mark";
import { siteLinks } from "./constants";
import { readCustomItems, readNavigationLinks } from "./navigation";
import { PhoneMenu } from "./phone-menu";
import { siteHeaderStyles } from "./style";

const styles = siteHeaderStyles();

export function SiteHeader() {
  const { navItems } = useHomeLayout();
  const links = readNavigationLinks(navItems, usePathname());

  return (
    <header className={styles.root()}>
      <div className={styles.bar()}>
        <Link aria-label="CuteUI home" className={styles.brandLink()} href={siteLinks.home}>
          <BrandMark />
        </Link>
        <nav aria-label="Main" className={styles.links()}>
          {links.map((link) => (
            <Link
              className={styles.link()}
              data-current={link.isCurrent ? "" : undefined}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions()}>
          {readCustomItems(navItems).map((children, index) => (
            <Fragment key={index}>{children}</Fragment>
          ))}
          <span className={styles.wide()}>
            <Button render={<a href={siteLinks.github} />} size="sm" variant="ghost">
              GitHub
            </Button>
            <Button render={<Link href={siteLinks.installation} />} size="sm">
              Get started
            </Button>
          </span>
          <PhoneMenu links={links} />
        </div>
      </div>
    </header>
  );
}
