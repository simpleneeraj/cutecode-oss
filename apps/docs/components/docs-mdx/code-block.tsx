"use client";

import { CodeIcon } from "@solar-icons/react/linear/code";
import { CopyCheckIcon } from "@solar-icons/react/linear/copy-check";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { type ComponentProps, useRef } from "react";

import { SwapLabel } from "@/components/customizer/swap-label";

import { codeBlockStyles } from "./style";

const styles = codeBlockStyles();

function readCode(button: HTMLButtonElement | null) {
  const code = button?.closest("figure")?.getElementsByTagName("pre").item(0);
  const copy = code?.cloneNode(true);
  const isElement = copy instanceof HTMLElement;
  if (!isElement) {
    return undefined;
  }
  copy.querySelectorAll(".nd-copy-ignore").forEach((node) => node.replaceWith("\n"));
  return copy.textContent ?? "";
}

function useCodeCopy() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isCopied, onClick] = useCopyButton(() => {
    const text = readCode(buttonRef.current);
    if (text === undefined) {
      return;
    }
    return navigator.clipboard.writeText(text);
  });
  return { buttonRef, isCopied, onClick };
}

function CopyButton() {
  const { buttonRef, isCopied, onClick } = useCodeCopy();
  const label = isCopied ? "Copied" : "Copy";

  return (
    <button aria-live="polite" className={styles.copy()} onClick={onClick} ref={buttonRef} type="button">
      <SwapLabel swapKey={label}>{label}</SwapLabel>
    </button>
  );
}

function CopyIconButton() {
  const { buttonRef, isCopied, onClick } = useCodeCopy();
  const label = isCopied ? "Copied" : "Copy";
  const Icon = isCopied ? CopyCheckIcon : CopyIcon;

  return (
    <button aria-label={label} className={styles.iconCopy()} onClick={onClick} ref={buttonRef} type="button">
      <SwapLabel swapKey={label}>
        <Icon aria-hidden="true" className={styles.icon()} />
      </SwapLabel>
    </button>
  );
}

function ActionButton({ hasTitle }: { hasTitle: boolean }) {
  if (hasTitle) {
    return <CopyButton />;
  }
  return <CopyIconButton />;
}

export function DocsCodeBlock({ allowCopy = true, children, icon: _icon, ...props }: ComponentProps<typeof CodeBlock>) {
  const canCopy = allowCopy !== false && allowCopy !== "false";
  const hasTitle = Boolean(props.title);

  return (
    <CodeBlock
      {...props}
      Actions={({ className }) => <div className={className}>{canCopy ? <ActionButton hasTitle={hasTitle} /> : null}</div>}
      icon={<CodeIcon aria-hidden="true" className={styles.icon()} />}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}
