"use client";

import React, { useState } from "react";
import { BASE_URL } from "@/utils/common";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@cutecode/ui/components/dialog";
import { Button } from "@cutecode/ui/components/button";
import { Group, GroupSeparator } from "@cutecode/ui/components/group";
import { Input } from "@cutecode/ui/components/input";
import { toast } from "@/components/toast";
import { ShareIcon } from "@solar-icons/react/linear/share";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { Brand, BrandIcon } from "@cutecode/ui/components/brand-icon";
import { shortenUrl } from "@/utils/common";
import siteConfig from "@/constants/site-config";

type ShareDialogProps = {
  slug: string;
};

function buildShareLinks(url: string) {
  const shareUrl = encodeURIComponent(url);
  const baseText = `Crafted this beautiful code presentation using ${siteConfig.name} ✨ Check it out!`;
  return [
    {
      label: "X",
      brand: Brand.X,
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(baseText)}&via=iamsimpleneeraj`,
    },
    {
      label: "LinkedIn",
      brand: Brand.LinkedIn,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(
        `Code Snippet on ${siteConfig.name}`,
      )}&summary=${encodeURIComponent(`${baseText} @simpleneeraj`)}`,
    },
    {
      label: "Facebook",
      brand: Brand.Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(
        `${baseText} @simpleneeraj`,
      )}`,
    },
  ];
}

export function ShareDialog({ slug }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = `${BASE_URL}/preview/${slug}`;

  const handleCopy = async () => {
    try {
      const shortUrl = await shortenUrl(url, "snippets").catch(() => url);
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" aria-label="Share" />}>
        <ShareIcon />
        <span className="max-sm:hidden">Share</span>
      </DialogTrigger>

      <DialogPopup className="sm:max-w-md">
        <DialogHeader className="gap-1 px-5 pt-5">
          <DialogTitle className="text-base font-medium">Share snippet</DialogTitle>
          <DialogDescription>Send the link or post it to your network.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4 px-5 pb-5">
          <Group className="w-full">
            <Input readOnly value={url} placeholder="Loading..." aria-label="Snippet link" className="font-mono" />
            <GroupSeparator />
            <Button variant="outline" onClick={handleCopy} disabled={!url}>
              {copied ? <CheckCircleIcon /> : <CopyIcon />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </Group>

          <div className="grid grid-cols-3 gap-2">
            {buildShareLinks(url).map((link) => (
              <Button
                key={link.label}
                variant="outline"
                render={<a href={link.href} target="_blank" rel="noopener noreferrer" />}
              >
                <BrandIcon brand={link.brand} className="size-4" />
                {link.label}
              </Button>
            ))}
          </div>
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
