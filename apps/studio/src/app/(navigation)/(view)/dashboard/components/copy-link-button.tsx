"use client";

import { Fragment, useState } from "react";
import { Button } from "@cutecode/ui/components/button";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { LinkIcon } from "@solar-icons/react/linear/link";
import { getShareUrl } from "@/lib/share/urls";
import { tableStyles } from "./style";

const styles = tableStyles();

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const label = copied ? "Copied" : "Copy share link";

  const onCopy = async () => {
    const isCopied = await navigator.clipboard.writeText(getShareUrl(slug)).then(
      () => true,
      () => false,
    );
    if (!isCopied) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Fragment>
      <Button
        variant="ghost"
        size="icon-sm"
        className={styles.copy()}
        onClick={onCopy}
        aria-label={label}
        title={label}
      >
        {copied ? <CheckCircleIcon aria-hidden="true" /> : <LinkIcon aria-hidden="true" />}
      </Button>
      <span aria-live="polite" className={styles.copyStatus()}>
        {copied ? "Link copied" : ""}
      </span>
    </Fragment>
  );
}
