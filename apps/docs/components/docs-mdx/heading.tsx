"use client";

import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { LinkIcon } from "@solar-icons/react/linear/link";
import type { ComponentProps } from "react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

import type { HeadingLevel } from "./heading-level";
import { headingStyles } from "./style";

type DocsHeadingProps = ComponentProps<"h2"> & { level: HeadingLevel };

const styles = headingStyles();

function copyAnchor(id: string | undefined) {
  if (!id) {
    return undefined;
  }
  const url = new URL(window.location.href);
  url.hash = id;
  return navigator.clipboard.writeText(url.href);
}

export function DocsHeading({ level: Level, children, id, ...props }: DocsHeadingProps) {
  const [isCopied, onCopy] = useCopyButton(() => copyAnchor(id));
  if (!id) {
    return <Level {...props}>{children}</Level>;
  }

  const Icon = isCopied ? CheckCircleIcon : LinkIcon;
  return (
    <div className={styles.root()}>
      <Level {...props} className={styles.heading()} id={id}>
        <a data-card="" href={`#${id}`}>
          {children}
        </a>
      </Level>
      <button
        aria-label={isCopied ? "Copied link" : "Copy link"}
        className={styles.anchor()}
        onClick={onCopy}
        type="button"
      >
        <Icon aria-hidden="true" className={styles.icon()} />
      </button>
      <span className={styles.status()} role="status">
        {isCopied ? "Copied link" : ""}
      </span>
    </div>
  );
}
