"use client";

import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

import { SwapLabel } from "@/components/customizer/swap-label";

import { chromeStyles } from "./style";

type CopyPageButtonProps = {
  markdown: string;
};

const styles = chromeStyles();

export function CopyPageButton({ markdown }: CopyPageButtonProps) {
  const [isCopied, onCopy] = useCopyButton(() => navigator.clipboard.writeText(markdown));
  const Icon = isCopied ? CheckCircleIcon : CopyIcon;
  const label = isCopied ? "Copied" : "Copy page";

  return (
    <button aria-live="polite" className={styles.link()} onClick={onCopy} type="button">
      <SwapLabel swapKey={label}>
        <Icon aria-hidden="true" className={styles.linkIcon()} />
        {label}
      </SwapLabel>
    </button>
  );
}
