"use client";

import { useState } from "react";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { LinkSquareIcon } from "@solar-icons/react/linear/link-square";
import { toast } from "@/components/toast";
import { Button } from "@cutecode/ui/components/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@cutecode/ui/components/dialog";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@cutecode/ui/components/tabs";

type EmbedDialogProps = {
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function buildEmbedCode(embedUrl: string) {
  return [
    `<iframe`,
    `  src="${embedUrl}"`,
    `  width="100%"`,
    `  height="500"`,
    `  frameborder="0"`,
    `  style="border:0;"`,
    `  allowfullscreen>`,
    `</iframe>`,
  ].join("\n");
}

export function EmbedDialog({ slug, open, onOpenChange }: EmbedDialogProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/embed/${slug}`;
  const embedCode = buildEmbedCode(embedUrl);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="sm:max-w-2xl">
        <DialogHeader className="gap-1 px-5 pt-5">
          <DialogTitle className="text-base font-medium">Embed snippet</DialogTitle>
          <DialogDescription>Paste the iframe into any site, blog or doc.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="px-5">
          <Tabs defaultValue="preview" className="gap-3">
            <TabsList>
              <TabsTab value="preview">Preview</TabsTab>
              <TabsTab value="code">Code</TabsTab>
            </TabsList>

            <TabsPanel value="preview">
              <div className="rounded-xl border bg-muted/40 p-1">
                <iframe src={embedUrl} title="Embed preview" className="h-80 w-full rounded-lg bg-background" />
              </div>
            </TabsPanel>

            <TabsPanel value="code">
              <div className="flex flex-col rounded-xl border bg-muted/40">
                <div className="flex items-center justify-between border-b py-1 ps-3 pe-1">
                  <span className="font-mono text-xs text-muted-foreground">HTML</span>
                  <Button size="xs" variant="ghost" onClick={handleCopy} aria-label="Copy embed code">
                    {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3 font-mono text-xs leading-5 text-foreground">
                  <code>{embedCode}</code>
                </pre>
              </div>
            </TabsPanel>
          </Tabs>
        </DialogPanel>

        <DialogFooter className="px-5 py-3 sm:justify-between">
          <Button variant="ghost" render={<a href={embedUrl} target="_blank" rel="noopener noreferrer" />}>
            <LinkSquareIcon aria-hidden="true" />
            Open in new tab
          </Button>
          <Button onClick={handleCopy}>
            {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
            {copied ? "Copied" : "Copy code"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
