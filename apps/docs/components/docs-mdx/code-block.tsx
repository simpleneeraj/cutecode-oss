"use client";

import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { type ComponentProps, useRef } from "react";

function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isChecked, onClick] = useCopyButton(() => {
    const code = buttonRef.current?.closest("figure")?.getElementsByTagName("pre").item(0);
    if (!code) return;
    const copy = code.cloneNode(true) as HTMLElement;
    copy.querySelectorAll(".nd-copy-ignore").forEach((node) => node.replaceWith("\n"));
    return navigator.clipboard.writeText(copy.textContent ?? "");
  });
  const Icon = isChecked ? CheckCircleIcon : CopyIcon;
  return (
    <button
      aria-live="polite"
      className={buttonVariants({
        className: "hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground",
        size: "icon-xs",
      })}
      data-checked={isChecked || undefined}
      onClick={onClick}
      ref={buttonRef}
      type="button"
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{isChecked ? "Copied Text" : "Copy Text"}</span>
    </button>
  );
}

export function DocsCodeBlock({ allowCopy = true, children, ...props }: ComponentProps<typeof CodeBlock>) {
  return (
    <CodeBlock
      {...props}
      Actions={({ className }) => (
        <div className={className}>{allowCopy === false ? null : <CopyButton />}</div>
      )}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}
