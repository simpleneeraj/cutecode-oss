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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Group, GroupSeparator } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/toast";
import { Icon } from "@/components/ui/icon";
import { shortenUrl } from "@/utils/common";
import siteConfig from "@/contstant/site-config";

type ShareDialogProps = {
  slug: string;
};

function buildShareLinks(url: string) {
  const shareUrl = encodeURIComponent(url);
  const baseText = `Crafted this beautiful code presentation using ${siteConfig.name} ✨ Check it out!`;
  return [
    {
      label: "X",
      icon: "ri:twitter-x-fill",
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(baseText)}&via=iamsimpleneeraj`,
    },
    {
      label: "LinkedIn",
      icon: "ri:linkedin-fill",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(
        `Code Snippet on ${siteConfig.name}`,
      )}&summary=${encodeURIComponent(`${baseText} @simpleneeraj`)}`,
    },
    {
      label: "Facebook",
      icon: "ri:facebook-circle-fill",
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
        <Icon icon="solar:share-linear" />
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
              <Icon icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"} />
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
                <Icon icon={link.icon} />
                {link.label}
              </Button>
            ))}
          </div>
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}
