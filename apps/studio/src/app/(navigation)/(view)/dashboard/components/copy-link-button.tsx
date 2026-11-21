"use client";

import { useState } from "react";
import { Button } from "@cutecode/ui/components/button";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import { LinkIcon } from "@solar-icons/react/bold/link";
import { getShareUrl } from "@/lib/share/urls";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(getShareUrl(slug)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy share link"}
      title={copied ? "Copied" : "Copy share link"}
    >
      {copied ? <CheckCircleIcon className="size-3.5" /> : <LinkIcon className="size-3.5" />}
    </Button>
  );
}
