"use client";

import { Button } from "@cutecode/ui/components/button";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

import { customizerMotion } from "@/components/customizer/constants";
import { SwapLabel } from "@/components/customizer/swap-label";

import { themeBuilder } from "./constants";
import { themeBuilderStyles } from "./style";

type CodeViewProps = {
  code: string;
  hint: string;
};

const styles = themeBuilderStyles();

export function CodeView({ code, hint }: CodeViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const lineCount = code.split("\n").length;
  const isCollapsible = lineCount > themeBuilder.collapsedCodeLines;
  const isCollapsed = isCollapsible && !isExpanded;
  const toggleLabel = isExpanded ? "Show less" : `Show all ${lineCount} lines`;
  const scrollBehavior: ScrollBehavior = isReducedMotion ? "auto" : "smooth";

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      viewRef.current?.scrollIntoView({ block: "start", behavior: scrollBehavior });
    }
  }

  return (
    <div className={styles.codeView()} ref={viewRef}>
      <p className={styles.exportHint()}>{hint}</p>
      <motion.div
        animate={{ height: isCollapsed ? themeBuilder.collapsedCodeHeight : "auto" }}
        className={styles.codeFrame()}
        initial={false}
        transition={isReducedMotion ? { duration: 0 } : customizerMotion.reveal}
      >
        <pre className={styles.codeText({ isCollapsed })}>
          <code>{code}</code>
        </pre>
      </motion.div>
      {isCollapsible ? (
        <Button aria-expanded={isExpanded} onClick={toggleExpanded} size="sm" variant="ghost">
          <SwapLabel swapKey={toggleLabel}>{toggleLabel}</SwapLabel>
        </Button>
      ) : null}
    </div>
  );
}
