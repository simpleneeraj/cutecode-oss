"use client";

import { Button } from "@cutecode/ui/components/button";
import type { Icon } from "@solar-icons/react/lib/types";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

import { SwapLabel } from "./swap-label";

type CopyTextButtonProps = {
  readText: () => string;
  label: string;
  copiedLabel: string;
  icon: Icon;
};

export function CopyTextButton({ readText, label, copiedLabel, icon: LabelIcon }: CopyTextButtonProps) {
  const [isCopied, copyText] = useCopyButton(() => navigator.clipboard.writeText(readText()));
  const ShownIcon = isCopied ? CheckCircleIcon : LabelIcon;
  const shownLabel = isCopied ? copiedLabel : label;

  return (
    <Button aria-live="polite" onClick={copyText} variant="gray">
      <SwapLabel swapKey={shownLabel}>
        <ShownIcon aria-hidden="true" />
        {shownLabel}
      </SwapLabel>
    </Button>
  );
}
