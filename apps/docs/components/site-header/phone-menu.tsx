"use client";

import { Button } from "@cutecode/ui/components/button";
import { HamburgerMenuIcon } from "@solar-icons/react/linear/hamburger-menu";
import dynamic from "next/dynamic";
import { Fragment, useRef, useState } from "react";

import type { NavigationLink } from "./navigation";
import { siteHeaderStyles } from "./style";

type PhoneMenuProps = {
  links: NavigationLink[];
};

const NavDrawer = dynamic(() => import("./nav-drawer").then((module) => module.NavDrawer), { ssr: false });

const styles = siteHeaderStyles();

export function PhoneMenu({ links }: PhoneMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Fragment>
      <span className={styles.narrow()}>
        <Button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          ref={triggerRef}
          size="icon"
          variant="ghost"
        >
          <HamburgerMenuIcon aria-hidden="true" />
        </Button>
      </span>
      <NavDrawer isOpen={isOpen} links={links} onOpenChange={setIsOpen} triggerRef={triggerRef} />
    </Fragment>
  );
}
