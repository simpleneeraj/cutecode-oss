"use client";

import { useState } from "react";
import copy from "copy-to-clipboard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, MagicWandIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import siteConfig from "@/contstant/site-config";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

type EmbedFooterProps = {
  slug: string;
  code: string;
};

export function EmbedFooter({ slug, code }: EmbedFooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="flex items-center justify-center gap-1 text-muted-foreground">
      <Button
        size="xs"
        variant="ghost"
        className="text-muted-foreground"
        render={<a href={`/preview/${slug}`} target="_blank" rel="noopener noreferrer" />}
      >
        <BrandMark className="size-3.5" />
        {siteConfig.name}
      </Button>
      {code && (
        <Button size="xs" variant="ghost" className="text-muted-foreground" onClick={handleCopy}>
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </Button>
      )}
      <Button
        size="xs"
        variant="ghost"
        className="text-muted-foreground"
        render={<a href={`/remix/${slug}`} target="_blank" rel="noopener noreferrer" />}
      >
        <HugeiconsIcon icon={MagicWandIcon} aria-hidden="true" />
        Remix
      </Button>
    </footer>
  );
}
