"use client";

import { Button } from "@cutecode/ui/components/button";
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@cutecode/ui/components/drawer";
import Link from "next/link";
import type { RefObject } from "react";

import { siteLinks } from "./constants";
import type { NavigationLink } from "./navigation";
import { siteHeaderStyles } from "./style";

type NavDrawerProps = {
  isOpen: boolean;
  links: NavigationLink[];
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpenChange: (isOpen: boolean) => void;
};

const styles = siteHeaderStyles();

export function NavDrawer({ isOpen, links, triggerRef, onOpenChange }: NavDrawerProps) {
  const close = () => onOpenChange(false);

  return (
    <Drawer onOpenChange={onOpenChange} open={isOpen}>
      <DrawerPopup finalFocus={triggerRef}>
        <DrawerHeader>
          <DrawerTitle>CuteUI</DrawerTitle>
          <DrawerDescription>React components that feel like real objects.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <nav aria-label="Main" className={styles.drawerLinks()}>
            {links.map((link) => (
              <Link
                className={styles.drawerLink()}
                data-current={link.isCurrent ? "" : undefined}
                href={link.href}
                key={link.href}
                onClick={close}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </DrawerPanel>
        <DrawerFooter className={styles.drawerFooter()}>
          <Button onClick={close} render={<Link href={siteLinks.installation} />} size="lg">
            Get started
          </Button>
          <Button onClick={close} render={<a href={siteLinks.github} />} size="lg" variant="gray">
            View on GitHub
          </Button>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  );
}
