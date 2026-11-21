"use client";

import { Button } from "@cutecode/ui/components/button";
import type { Icon } from "@solar-icons/react/lib/types";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

type CopyTextButtonProps = {
  readText: () => string;
  label: string;
  copiedLabel: string;
  icon: Icon;
};

export function CopyTextButton({ readText, label, copiedLabel, icon: LabelIcon }: CopyTextButtonProps) {
  const [isCopied, copyText] = useCopyButton(() => navigator.clipboard.writeText(readText()));
  const ShownIcon = isCopied ? CheckCircleIcon : LabelIcon;

  return (
    <Button aria-live="polite" onClick={copyText} variant="gray">
      <ShownIcon aria-hidden="true" />
      {isCopied ? copiedLabel : label}
    </Button>
  );
}
