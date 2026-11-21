"use client";

import { HamburgerMenuIcon } from "@solar-icons/react/linear/hamburger-menu";
import { SidebarTrigger } from "fumadocs-ui/layouts/docs/slots/sidebar";
import type { ComponentProps } from "react";

import { chromeStyles } from "./style";

const styles = chromeStyles();

export function MenuTrigger({ children: _children, className: _className, ...props }: ComponentProps<"button">) {
  return (
    <SidebarTrigger {...props} className={styles.iconButton()}>
      <HamburgerMenuIcon aria-hidden="true" className={styles.icon()} />
    </SidebarTrigger>
  );
}
