"use client";

import { useRender } from "@base-ui/react/use-render";
import type { ReactNode } from "react";

import { toolbarStyles } from "./style";

type ToolbarProps = {
  children: ReactNode;
};

type ToolbarActionsProps = {
  children: ReactNode;
};

type ToolbarLinkProps = {
  href: string;
  isCurrent?: boolean;
  render?: useRender.RenderProp;
  children: ReactNode;
};

type ToolbarBrandProps = {
  href: string;
  render?: useRender.RenderProp;
  children: ReactNode;
};

type ToolbarLinksProps = {
  label: string;
  children: ReactNode;
};

const styles = toolbarStyles();

function Toolbar({ children }: ToolbarProps) {
  return (
    <header className={styles.root()} data-slot="toolbar">
      {children}
    </header>
  );
}

function ToolbarBrand({ href, render, children }: ToolbarBrandProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: { className: styles.brand(), "data-slot": "toolbar-brand", href, children },
  });
}

function ToolbarLinks({ label, children }: ToolbarLinksProps) {
  return (
    <nav aria-label={label} className={styles.links()} data-slot="toolbar-links">
      {children}
    </nav>
  );
}

function ToolbarLink({ href, isCurrent, render, children }: ToolbarLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: {
      "aria-current": isCurrent ? "page" : undefined,
      className: styles.link(),
      "data-current": isCurrent ? "" : undefined,
      "data-slot": "toolbar-link",
      href,
      children,
    },
  });
}

function ToolbarActions({ children }: ToolbarActionsProps) {
  return (
    <div className={styles.actions()} data-slot="toolbar-actions">
      {children}
    </div>
  );
}

export { Toolbar, ToolbarActions, ToolbarBrand, ToolbarLink, ToolbarLinks };
