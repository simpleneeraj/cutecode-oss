"use client";

import { useRender } from "@base-ui/react/use-render";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import type { Icon } from "@solar-icons/react/lib/types";
import { Fragment, type ReactNode } from "react";

import type { Tone } from "../tone";
import { listGroupGlyphStyles, listGroupStyles } from "./style";

type ListGroupProps = {
  children: ReactNode;
};

type ListGroupRowProps = {
  icon?: Icon;
  tone?: Tone;
  render?: useRender.RenderProp;
  children: ReactNode;
};

type ListGroupTitleProps = {
  subtitle?: ReactNode;
  children: ReactNode;
};

const styles = listGroupStyles();

function ListGroup({ children }: ListGroupProps) {
  return (
    <div className={styles.root()} data-slot="list-group">
      {children}
    </div>
  );
}

function ListGroupHeader({ children }: ListGroupProps) {
  return (
    <div className={styles.header()} data-slot="list-group-header">
      {children}
    </div>
  );
}

function ListGroupRows({ children }: ListGroupProps) {
  return (
    <div className={styles.rows()} data-slot="list-group-rows">
      {children}
    </div>
  );
}

function ListGroupRow({ icon: Glyph, tone, render, children }: ListGroupRowProps) {
  const glyph = Glyph ? (
    <span className={listGroupGlyphStyles({ tone })}>
      <Glyph aria-hidden="true" className={styles.glyphIcon()} />
    </span>
  ) : null;

  return useRender({
    defaultTagName: "div",
    render,
    props: {
      className: styles.row(),
      "data-interactive": render ? "" : undefined,
      "data-slot": "list-group-row",
      children: (
        <Fragment>
          {glyph}
          <span className={styles.content()}>{children}</span>
        </Fragment>
      ),
    },
  });
}

function ListGroupTitle({ subtitle, children }: ListGroupTitleProps) {
  return (
    <span className={styles.title()} data-slot="list-group-title">
      {children}
      {subtitle ? <span className={styles.subtitle()}>{subtitle}</span> : null}
    </span>
  );
}

function ListGroupValue({ children }: ListGroupProps) {
  return (
    <span className={styles.value()} data-slot="list-group-value">
      {children}
    </span>
  );
}

function ListGroupChevron() {
  return <AltArrowRightIcon aria-hidden="true" className={styles.chevron()} data-slot="list-group-chevron" />;
}

function ListGroupFooter({ children }: ListGroupProps) {
  return (
    <div className={styles.footer()} data-slot="list-group-footer">
      {children}
    </div>
  );
}

export {
  ListGroup,
  ListGroupChevron,
  ListGroupFooter,
  ListGroupHeader,
  ListGroupRow,
  ListGroupRows,
  ListGroupTitle,
  ListGroupValue,
};
